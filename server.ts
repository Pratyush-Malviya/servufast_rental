import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client on the server lazily and securely
let genAI: GoogleGenAI | null = null;
function getGenAI() {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY environment variable is not defined.");
      return null;
    }
    genAI = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return genAI;
}

// Memory / File stored list of leads for active verification
const LEADS_FILE = path.join(process.cwd(), "leads_database.json");

function saveLead(lead: any) {
  try {
    let leads: any[] = [];
    if (fs.existsSync(LEADS_FILE)) {
      leads = JSON.parse(fs.readFileSync(LEADS_FILE, "utf-8"));
    }
    leads.push({ id: Date.now().toString(), createdAt: new Date().toISOString(), ...lead });
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2));
  } catch (err) {
    console.error("Failed to save lead:", err);
  }
}

// ───── API ENDPOINTS ─────

// API health endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// App lead submission route
app.post("/api/apply", (req, res) => {
  const { name, phone, email, city, service, date, time, newCustomer, message } = req.body;

  if (!name || !phone || !city) {
    return res.status(400).json({ error: "Missing required fields: Name, Phone, and City are required." });
  }

  // Save lead locally
  const leadData = { name, phone, email, city, service, date, time, newCustomer, message };
  saveLead(leadData);

  res.json({
    success: true,
    message: "Application submitted successfully.",
    lead: leadData,
  });
});

// AI Chatbot endpoint utilizing the standard gemini-3.5-flash model
app.post("/api/gemini/chat", async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Messages array is required." });
  }

  const ai = getGenAI();
  if (!ai) {
    return res.status(500).json({
      error: "Gemini API client is not configured. Please supply a valid GEMINI_API_KEY in the Secrets panel.",
    });
  }

  // Standardize instruction and brand background info
  const systemInstruction = `
You are the dedicated AI Concierge and assistant for ServUfast (servufast.com).
ServUfast is a premium, verified car rental platform operating in prime US metro areas (primarily San Francisco, Los Angeles, Seattle, Chicago, Boston).
Our key business is rent-to-drive premium vehicles tailored for active gig drivers (Uber, Lyft, DoorDash, etc.), personal fleet seekers, and executive chauffeurs.

Our key model values/identity:
- Luxury Editorial Style: elegant, high-contrast, professional, and refined.
- A car that earns its own weekly rate: Vehicles are priced weekly of $150 to $290 based on standard metrics.
- All-Inclusive Pricing: Zero unexpected maintenance charges, premium vehicle insurance included, unlimited gig mileage, and 24/7 client road assistance as standard.
- Rapid Approval: Drive off the same day. Profile verification process takes under 24 hours.

We offer multiple premium vehicle configurations:
1. Hatchback Pro (Toyota Yaris/Honda Fit) — Optimized for short city gig runs at $150/week.
2. Premium Sedan Range (Toyota Corolla/Hyundai Elantra) — Perfect for high-tier airport transfers at $200/week.
3. Electric Fleet (Tesla Model 3/Chevrolet Bolt EV) — Ultimate zero-emission cost saver at $220/week.
4. Luxury Executive Series (Toyota Sienna Hybrid) — Top tier chauffeur and high-end transport at $290/week.

Your personality:
- Courteous, highly professional, polite, direct, and slightly refined (reflecting a luxury editorial concierge tone).
- Provide straightforward answers about weekly pricing, deposits, qualifications, or vehicle availability.
- Promote our online estimator tool or enrollment form to book or reserve.
- If asked about rates: Standard rates begin at $150 per week, everything included. There are no hidden processing fees.
- If asked about qualifications: Requires valid driver screening, ID / SSN or Tax ID verification, a clean driving record and background history, an active driving license (DL), and a security deposit.

Keep responses relatively brief, beautifully formatted with clean markdown, and focused on helping customers or partners reserve a vehicle.
`;

  try {
    // Reconstruct conversation messages for API
    // The @google/genai SDK chats.create allows using system instructions.
    // Let's create a formatted text prompt or use chats.sendMessage
    
    // We can compile history into a single structured prompt or use chats
    let conversationHistory = systemInstruction + "\n\n";
    messages.forEach((msg: any) => {
      const roleName = msg.sender === "user" ? "User" : "Assistant";
      conversationHistory += `${roleName}: ${msg.text}\n`;
    });
    conversationHistory += "\nAssistant:";

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: conversationHistory,
    });

    const replyText = response.text || "I apologize, but I could not compute a response at this moment. Please call us or submit our form.";
    res.json({ reply: replyText });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: error.message || "An error occurred with the Gemini generation service." });
  }
});

// ───── VITE MIDDLEWARE SETUP ─────

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[ServUfast Server] Running on http://localhost:${PORT}`);
  });
}

startServer();
