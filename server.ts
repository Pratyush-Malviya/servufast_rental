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
const VEHICLES_FILE = path.join(process.cwd(), "vehicles_database.json");
const CONFIG_FILE = path.join(process.cwd(), "config_database.json");

const DEFAULT_BRAND_CONFIG = {
  passcode: "admin",
  contact: {
    phone: "+1 (865) 696-9885",
    phoneTel: "+18656969885",
    email: "registration@servufast.com",
    address: "Executive Office, Financial District, San Francisco, CA 94111",
  },
  social: {
    whatsapp: "https://wa.me/18656969885",
    facebook: "",
    twitter: "",
    instagram: "",
    linkedin: "",
  },
  general: {
    brandName: "ServUfast",
    brandSubtitle: "",
    editionText: "Edition No. 01 · 2026",
    copyrightText: "© 2026 ServUfast LLC. All rights reserved. Registered under Delaware and United States Corporate Standards.",
  }
};

function getConfig() {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const data = JSON.parse(fs.readFileSync(CONFIG_FILE, "utf-8"));
      return {
        passcode: data.passcode || DEFAULT_BRAND_CONFIG.passcode,
        contact: { ...DEFAULT_BRAND_CONFIG.contact, ...(data.contact || {}) },
        social: { ...DEFAULT_BRAND_CONFIG.social, ...(data.social || {}) },
        general: { ...DEFAULT_BRAND_CONFIG.general, ...(data.general || {}) },
      };
    }
  } catch (err) {
    console.error("Failed to read config:", err);
  }
  return DEFAULT_BRAND_CONFIG;
}

function saveConfig(config: any) {
  try {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
    return true;
  } catch (err) {
    console.error("Failed to write config:", err);
    return false;
  }
}

function getPasscode() {
  return getConfig().passcode;
}

function savePasscode(passcode: string) {
  const currentConfig = getConfig();
  currentConfig.passcode = passcode;
  return saveConfig(currentConfig);
}

const DEFAULT_VEHICLES = [
  {
    id: "hatchback",
    title: "Hatchback Pro Series",
    description: "Highly fuel-efficient Toyota Yaris or compact Honda Fit models tailored for quick city delivery and passenger bookings.",
    category: "hatchback",
    badge: "Available now",
    stats: [
      { label: "Optimal Fuels", value: "Regular Gas" },
      { label: "Avg. Mileage", value: "32-38 MPG" },
      { label: "Partner Rating", value: "4.91 / 5" },
      { label: "Pickup Depot", value: "Central Metro Depots" },
    ],
    inclusions: [
      "Tested structural safety configurations",
      "Excellent air flow systems for maximum comfort",
      "Includes standard routine engine maintenance",
      "Full comprehensive zero-deductible insurance guard"
    ],
    price: "$150 / week",
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1627454820516-dc767bcb4d3e?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "sedan",
    title: "Premium Sedan Range",
    description: "Elegant Toyota Corolla or spacious Hyundai Elantra models with comfortable rear legroom and enlarged trunk storage for high-value airport rides.",
    category: "sedan",
    badge: "Available now",
    stats: [
      { label: "Optimal Fuels", value: "Gas / Hybrid" },
      { label: "Trunk Cargo", value: "14+ Cubic Feet" },
      { label: "Partner Rating", value: "4.94 / 5" },
      { label: "Client Growth", value: "+45% Accept Rate" },
    ],
    inclusions: [
      "High rating layout perfect for prime hailing classes",
      "Real-time GPS security tracking pre-configured",
      "Complimentary high-tensile suspension screening",
      "Fully registered commercial rideshare compliance"
    ],
    price: "$200 / week",
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "electric",
    title: "Electric Zero-Emission EV Fleet",
    description: "Ultra-quiet, advanced Tesla Model 3 or Chevrolet Bolt EV vehicles with immediate fast-charger compatibility to maximize your pure margins.",
    category: "electric",
    badge: "Available now",
    stats: [
      { label: "Drive System", value: "100% Battery EV" },
      { label: "Real Range", value: "220+ miles / charge" },
      { label: "Partner Rating", value: "4.96 / 5" },
      { label: "Battery Guard", value: "Full OEM Warranty" },
    ],
    inclusions: [
      "Save $20+ daily in standard combustive fuel bills",
      "Direct priority ticketing on ride-hailing applications",
      "Includes standard fast-charger heavy cable hookups",
      "Zero-emission metropolitan green routing pass"
    ],
    price: "$220 / week",
    isAvailable: true,
    image: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "luxury",
    title: "Luxury Executive Series",
    description: "Spacious Toyota Sienna Hybrid or elite premium SUVs. Perfect for luxury airport charters and corporate transfers.",
    category: "luxury",
    badge: "Waitlist",
    stats: [
      { label: "Engine Type", value: "Premium Hybrid / Gas" },
      { label: "Seat Count", value: "7 Captain Seats" },
      { label: "Partner Rating", value: "4.98 / 5" },
      { label: "Onboard Tech", value: "Premium Acoustic" },
    ],
    inclusions: [
      "Plush luxury leather upholstery design and layout",
      "Access to elite high-paying long-haul hotel accounts",
      "24/7 dedicated executive fleet concierge hotline",
      "Double-vetted vehicle security escort setups"
    ],
    price: "$290 / week",
    isAvailable: false,
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80",
  }
];

function initVehiclesFile() {
  try {
    if (!fs.existsSync(VEHICLES_FILE)) {
      fs.writeFileSync(VEHICLES_FILE, JSON.stringify(DEFAULT_VEHICLES, null, 2));
    }
  } catch (err) {
    console.error("Failed to initialize vehicles file:", err);
  }
}

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

// GET brand configuration metadata (public settings)
app.get("/api/config", (req, res) => {
  try {
    const { passcode, ...publicConfig } = getConfig();
    res.json(publicConfig);
  } catch (error) {
    res.status(500).json({ error: "Failed to load brand environment configuration." });
  }
});

// Update brand configuration settings (requires passcode verification)
app.put("/api/admin/config", (req, res) => {
  try {
    const { passcode, config } = req.body;
    const currentPasscode = getPasscode();
    
    if (!passcode || passcode.trim().toLowerCase() !== currentPasscode.trim().toLowerCase()) {
      return res.status(401).json({ error: "Unauthorized: Invalid administrative authorization key." });
    }
    
    if (!config || typeof config !== "object") {
      return res.status(400).json({ error: "Invalid configuration entity payload." });
    }

    const currentConfig = getConfig();
    const updatedConfig = {
      passcode: currentConfig.passcode, // retain passcode
      contact: { ...currentConfig.contact, ...(config.contact || {}) },
      social: { ...currentConfig.social, ...(config.social || {}) },
      general: { ...currentConfig.general, ...(config.general || {}) },
    };

    const success = saveConfig(updatedConfig);
    if (success) {
      const { passcode: _, ...publicResponse } = updatedConfig;
      return res.json({ success: true, config: publicResponse });
    } else {
      return res.status(500).json({ error: "Could not persist brand configuration properties." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update configuration settings." });
  }
});

// Verify Admin Passcode
app.post("/api/admin/verify", (req, res) => {
  try {
    const { passcode } = req.body;
    const current = getPasscode();
    if (passcode && passcode.trim().toLowerCase() === current.trim().toLowerCase()) {
      return res.json({ success: true });
    }
    return res.status(401).json({ error: "Invalid master key passcode." });
  } catch (error) {
    res.status(500).json({ error: "Intrusion protection system error." });
  }
});

// Change Admin Passcode
app.post("/api/admin/change-passcode", (req, res) => {
  try {
    const { currentPasscode, newPasscode } = req.body;
    const current = getPasscode();
    if (!currentPasscode || currentPasscode.trim().toLowerCase() !== current.trim().toLowerCase()) {
      return res.status(401).json({ error: "Incorrect current passcode. Please enter the valid existing validation key." });
    }
    if (!newPasscode || newPasscode.trim().length === 0) {
      return res.status(400).json({ error: "New passcode validation failed. Passcode cannot be blank." });
    }
    const success = savePasscode(newPasscode.trim());
    if (success) {
      return res.json({ success: true, message: "Security authorization credentials updated successfully." });
    }
    return res.status(500).json({ error: "Database lock conflict. Master passcode change ignored." });
  } catch (error) {
    res.status(500).json({ error: "Passcode rotation module failure." });
  }
});

// GET Vehicles List
app.get("/api/vehicles", (req, res) => {
  try {
    initVehiclesFile();
    const data = fs.readFileSync(VEHICLES_FILE, "utf-8");
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: "Failed to read vehicles database" });
  }
});

// Update Vehicles List
app.put("/api/admin/vehicles", (req, res) => {
  try {
    initVehiclesFile();
    const newVehicles = req.body;
    if (!Array.isArray(newVehicles)) {
      return res.status(400).json({ error: "Invalid vehicles list format" });
    }
    fs.writeFileSync(VEHICLES_FILE, JSON.stringify(newVehicles, null, 2));
    res.json({ success: true, vehicles: newVehicles });
  } catch (error) {
    res.status(500).json({ error: "Failed to update vehicles database" });
  }
});

// GET All Leads
app.get("/api/admin/leads", (req, res) => {
  try {
    let leads: any[] = [];
    if (fs.existsSync(LEADS_FILE)) {
      leads = JSON.parse(fs.readFileSync(LEADS_FILE, "utf-8"));
    }
    // Sort leads by creation date descending (newest first)
    leads.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json(leads);
  } catch (error) {
    res.status(500).json({ error: "Failed to load applications list" });
  }
});

// DELETE a specific lead
app.delete("/api/admin/leads/:id", (req, res) => {
  try {
    const { id } = req.params;
    let leads: any[] = [];
    if (fs.existsSync(LEADS_FILE)) {
      leads = JSON.parse(fs.readFileSync(LEADS_FILE, "utf-8"));
    }
    const filtered = leads.filter((l) => l.id !== id);
    fs.writeFileSync(LEADS_FILE, JSON.stringify(filtered, null, 2));
    res.json({ success: true, message: `Lead ${id} has been removed` });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete lead from database" });
  }
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
You are David, the human Client Support Coordinator for ServUfast (servufast.com).
You must ALWAYS speak and align yourself as a warm, human coordinator. Never say you are an AI, a machine, a model, or a bot.
Speak with positive, genuine human helpfulness, conversational flows, friendly contractions (e.g., "I'm", "don't", "we've"), and straightforward answers. Avoid lists with complex bullets or headers. Never generate tables, code blocks, or robotic system logs.

Strict knowledge constraint (Talk ONLY about details on the website):
- Weekly Rates: Hatchback Pro ($150/week, Toyota Yaris/Honda Fit), Premium Sedan ($200/week, Toyota Corolla/Hyundai Elantra), Electric EV ($220/week, Tesla Model 3/Chevrolet Bolt EV), and Luxury Executive Series ($290/week, Toyota Sienna Hybrid).
- Ideal for: Gig-driving applications (Uber, Lyft, DoorDash), personal fleet seekers, and elite high-end chauffeurs.
- What is always included in the weekly rate: Complete all-inclusive premium commercial insurance, unlimited gig mileage, zero unexpected repairs or upkeep charges (all maintenance covered by us), and 24/7 roadside assistance.
- Operation Metropolitan Areas: Serving SF, Los Angeles, Seattle, Chicago, and Boston.
- Same-Day Approved Drive-Off: Verification screening takes under 24 hours. Depot pickup in under 1 hour from approval at central locations.
- Requirements to apply: Active driver's license (DL), clean driving/background history record, ID or SSN/Tax ID verification, and a refundable security deposit.
- Pricing structure: Standard flat weekly fee. Absolutely zero unexpected fees.

STRICT CONFLICT AND EXTRA-DETAIL PROTOCOL:
If the customer asks for ANY additional details, custom leasing period lengths, multi-car discounts, spec colors, contract customization, specific policy articles, exact depot garage street addresses, or any other out-of-scope details, you MUST:
1. Politely state that one of our local executive managers can coordinate directly with them.
2. Ask them to share their:
   - Full Name
   - Phone Number
   - Email Address
3. Once they have provided these details, or if they have already provided them in current messages, you MUST reply with this EXACT sentence:
   "Thank you for sharing your details. I've noted this down, and our executive will reach out to you shortly to assist!"

Keep your replies highly natural, personal, short, and focused.
`;

  try {
    // Reconstruct conversation messages for API
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
    
    // Auto-detect and save chat lead if contact details were gathered and executive will reach out
    try {
      const lowerReply = replyText.toLowerCase();
      if (lowerReply.includes("executive will reach out") || lowerReply.includes("reach out shortly")) {
        let extractedName = "";
        let extractedPhone = "";
        let extractedEmail = "";
        
        // Loop backwards in user messages to extract name, email, phone
        for (let i = messages.length - 1; i >= 0; i--) {
          const msg = messages[i];
          if (msg.sender === "user") {
            const text = msg.text;
            
            // Extract Email
            const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
            if (emailMatch && !extractedEmail) {
              extractedEmail = emailMatch[0];
            }
            
            // Extract Phone
            const phoneMatch = text.match(/(\+?\d{1,4}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
            if (phoneMatch && !extractedPhone) {
              extractedPhone = phoneMatch[0];
            }
            
            // Extract Name (simple heuristic)
            const nameMatch = text.match(/(?:my name is|i am|this is|name:?)\s+([a-zA-Z'\s]{2,30})/i);
            if (nameMatch && !extractedName) {
              extractedName = nameMatch[1].trim();
            } else if (!extractedName && text.split(/\s+/).length <= 3 && !emailMatch && !phoneMatch) {
              extractedName = text.trim();
            }
          }
        }
        
        if (extractedPhone || extractedEmail) {
          saveLead({
            name: extractedName || "Chat User",
            phone: extractedPhone || "Not provided",
            email: extractedEmail || "Not provided",
            city: "Chat Inquiry",
            service: "Chat Lead",
            date: new Date().toISOString().split('T')[0],
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            newCustomer: "Yes",
            message: `Lead captured via Live Support Chat. Full details: ${messages.map((m: any) => m.sender + ": " + m.text).join(" | ")}`
          });
        }
      }
    } catch (saveErr) {
      console.error("Failed to parse and save lead from chat thread:", saveErr);
    }

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
