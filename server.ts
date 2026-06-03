import express from "express";
import path from "path";
import fs from "fs";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

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

// In-memory state backups for serverless environments (like Vercel)
let memoryLeads: any[] = [];
let memoryConfig: any = null;
let memoryVehicles: any[] = [];

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
  },
  smtp: {
    enabled: false,
    host: "",
    port: "587",
    secure: false,
    user: "",
    pass: "",
    sender: "ServUfast Fleet <no-reply@servufast.com>",
    adminEmail: "registration@servufast.com",
  }
};

function getConfig() {
  if (memoryConfig) {
    return memoryConfig;
  }
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const data = JSON.parse(fs.readFileSync(CONFIG_FILE, "utf-8"));
      memoryConfig = {
        passcode: data.passcode || DEFAULT_BRAND_CONFIG.passcode,
        contact: { ...DEFAULT_BRAND_CONFIG.contact, ...(data.contact || {}) },
        social: { ...DEFAULT_BRAND_CONFIG.social, ...(data.social || {}) },
        general: { ...DEFAULT_BRAND_CONFIG.general, ...(data.general || {}) },
        smtp: { ...DEFAULT_BRAND_CONFIG.smtp, ...(data.smtp || {}) },
      };
      return memoryConfig;
    }
  } catch (err) {
    console.error("Failed to read config:", err);
  }
  return DEFAULT_BRAND_CONFIG;
}

function saveConfig(config: any) {
  memoryConfig = config;
  try {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
    return true;
  } catch (err) {
    console.error("Failed to write config:", err);
    // Still support the operation successfully in-memory for serverless
    return true;
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
  if (memoryVehicles && memoryVehicles.length > 0) {
    return;
  }
  try {
    if (fs.existsSync(VEHICLES_FILE)) {
      const data = fs.readFileSync(VEHICLES_FILE, "utf-8");
      memoryVehicles = JSON.parse(data);
    } else {
      memoryVehicles = [...DEFAULT_VEHICLES];
      try {
        fs.writeFileSync(VEHICLES_FILE, JSON.stringify(DEFAULT_VEHICLES, null, 2));
      } catch (writeErr) {
        console.warn("Storage write suppressed (Serverless Mode):", writeErr);
      }
    }
  } catch (err) {
    console.error("Failed to initialize vehicles file, falling back to memory:", err);
    memoryVehicles = [...DEFAULT_VEHICLES];
  }
}

function saveLead(lead: any) {
  const newLead = { id: Date.now().toString(), createdAt: new Date().toISOString(), ...lead };
  memoryLeads.unshift(newLead); // Unshift so that in-memory leads are sorted newest-first
  try {
    let leads: any[] = [];
    if (fs.existsSync(LEADS_FILE)) {
      leads = JSON.parse(fs.readFileSync(LEADS_FILE, "utf-8"));
    }
    leads.push(newLead);
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2));
  } catch (err) {
    console.error("Failed to write lead to filesystem (Ignored gracefully):", err);
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
    const { passcode, config } = req.body || {};
    const passcodeStr = passcode !== undefined && passcode !== null ? String(passcode).trim().toLowerCase() : "";
    const currentPasscode = getPasscode();
    const currentStr = currentPasscode !== undefined && currentPasscode !== null ? String(currentPasscode).trim().toLowerCase() : "";
    
    if (!passcodeStr || passcodeStr !== currentStr) {
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
      smtp: { ...currentConfig.smtp, ...(config.smtp || {}) },
    };

    const success = saveConfig(updatedConfig);
    if (success) {
      const { passcode: _, ...publicResponse } = updatedConfig;
      return res.json({ success: true, config: publicResponse });
    } else {
      return res.status(500).json({ error: "Could not persist brand configuration properties." });
    }
  } catch (error: any) {
    res.status(500).json({ error: "Failed to update configuration settings.", details: error?.message });
  }
});

// Verify Admin Passcode
app.post("/api/admin/verify", (req, res) => {
  try {
    const { passcode } = req.body || {};
    const passcodeStr = passcode !== undefined && passcode !== null ? String(passcode).trim().toLowerCase() : "";
    const current = getPasscode();
    const currentStr = current !== undefined && current !== null ? String(current).trim().toLowerCase() : "";

    if (passcodeStr && passcodeStr === currentStr) {
      return res.json({ success: true });
    }
    return res.status(401).json({ error: "Invalid master key passcode." });
  } catch (error: any) {
    res.status(500).json({ error: "Intrusion protection system error.", details: error?.message });
  }
});

// Change Admin Passcode
app.post("/api/admin/change-passcode", (req, res) => {
  try {
    const { currentPasscode, newPasscode } = req.body || {};
    const currentPassStr = currentPasscode !== undefined && currentPasscode !== null ? String(currentPasscode).trim().toLowerCase() : "";
    const current = getPasscode();
    const currentStr = current !== undefined && current !== null ? String(current).trim().toLowerCase() : "";
    const newPassStr = newPasscode !== undefined && newPasscode !== null ? String(newPasscode) : "";

    if (!currentPassStr || currentPassStr !== currentStr) {
      return res.status(401).json({ error: "Incorrect current passcode. Please enter the valid existing validation key." });
    }
    if (newPassStr.trim().length === 0) {
      return res.status(400).json({ error: "New passcode validation failed. Passcode cannot be blank." });
    }
    const success = savePasscode(newPassStr.trim());
    if (success) {
      return res.json({ success: true, message: "Security authorization credentials updated successfully." });
    }
    return res.status(500).json({ error: "Database lock conflict. Master passcode change ignored." });
  } catch (error: any) {
    res.status(500).json({ error: "Passcode rotation module failure.", details: error?.message });
  }
});

// GET Vehicles List
app.get("/api/vehicles", (req, res) => {
  try {
    initVehiclesFile();
    res.json(memoryVehicles);
  } catch (error) {
    res.json(DEFAULT_VEHICLES);
  }
});

// Update Vehicles List
app.put("/api/admin/vehicles", (req, res) => {
  try {
    const newVehicles = req.body;
    if (!Array.isArray(newVehicles)) {
      return res.status(400).json({ error: "Invalid vehicles list format" });
    }
    memoryVehicles = newVehicles;
    try {
      fs.writeFileSync(VEHICLES_FILE, JSON.stringify(newVehicles, null, 2));
    } catch (writeErr) {
      console.warn("Storage write suppressed (Serverless Mode):", writeErr);
    }
    res.json({ success: true, vehicles: newVehicles });
  } catch (error) {
    res.status(500).json({ error: "Failed to update vehicles database" });
  }
});

// GET All Leads
app.get("/api/admin/leads", (req, res) => {
  try {
    let fileLeads: any[] = [];
    if (fs.existsSync(LEADS_FILE)) {
      fileLeads = JSON.parse(fs.readFileSync(LEADS_FILE, "utf-8"));
    }
    
    // Combine file-stored leads and in-memory leads seamlessly
    const combined = [...memoryLeads];
    fileLeads.forEach((fl) => {
      if (!combined.some((ml) => ml.id === fl.id)) {
        combined.push(fl);
      }
    });

    // Sort leads by creation date descending (newest first)
    combined.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json(combined);
  } catch (error) {
    // Fallback directly to memory leads
    res.json(memoryLeads);
  }
});

// DELETE a specific lead
app.delete("/api/admin/leads/:id", (req, res) => {
  try {
    const { id } = req.params;
    memoryLeads = memoryLeads.filter((l) => l.id !== id);
    try {
      let leads: any[] = [];
      if (fs.existsSync(LEADS_FILE)) {
        leads = JSON.parse(fs.readFileSync(LEADS_FILE, "utf-8"));
      }
      const filtered = leads.filter((l) => l.id !== id);
      fs.writeFileSync(LEADS_FILE, JSON.stringify(filtered, null, 2));
    } catch (writeErr) {
      console.warn("Deleted in memory only. Storage write suppressed (Serverless Mode):", writeErr);
    }
    res.json({ success: true, message: `Lead ${id} has been removed` });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete lead from database" });
  }
});

// Robust, non-blocking SMTP Dispatch module to notify visitor and corporate admin
async function sendLeadEmails(lead: any) {
  try {
    const config = getConfig();
    const smtp = config.smtp || DEFAULT_BRAND_CONFIG.smtp;

    // Resolve SMTP configurations
    const isEnabled = smtp.enabled || process.env.SMTP_ENABLED === "true";
    if (!isEnabled) {
      console.log("SMTP notifications are currently disabled in setup config.");
      return;
    }

    const host = smtp.host || process.env.SMTP_HOST;
    const port = Number(smtp.port || process.env.SMTP_PORT || 587);
    const user = smtp.user || process.env.SMTP_USER;
    const pass = smtp.pass || process.env.SMTP_PASS;
    const sender = smtp.sender || process.env.SMTP_FROM || `ServUfast Fleet <no-reply@servufast.com>`;
    const adminEmail = smtp.adminEmail || process.env.SMTP_ADMIN_TO || config.contact?.email || "registration@servufast.com";

    if (!host || !user || !pass) {
      console.warn("SMTP has been set to active, but host/user/password fields are vacant. Dispatch aborted.");
      return;
    }

    // Secure SSL flag evaluation
    const isSecureState = smtp.secure !== undefined ? smtp.secure : (port === 465);

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: isSecureState,
      auth: {
        user,
        pass,
      },
      tls: {
        rejectUnauthorized: false, // Bypasses self-signed cert handshake blocks
      }
    });

    // 1. Send beautiful confirmation email to the client visitor (if email provided)
    if (lead.email && lead.email.trim().length > 0) {
      const visitorHtml = `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #eaeaea; border-radius: 16px; background-color: #ffffff; color: #1a1a1a;">
          <div style="text-align: center; margin-bottom: 25px;">
            <div style="font-size: 26px; font-weight: bold; color: #111; letter-spacing: -0.5px;">
              Serv<span style="color: #cda851;">U</span>fast
            </div>
            <div style="font-size: 10px; font-family: monospace; letter-spacing: 2px; color: #888; text-transform: uppercase; margin-top: 5px;">
              Elite Fleet Hire
            </div>
          </div>
          
          <hr style="border: 0; border-top: 1px solid #f0f0f0; margin: 20px 0;" />
          
          <p style="font-size: 15px; line-height: 1.6; color: #444;">Hello <strong>${lead.name}</strong>,</p>
          <p style="font-size: 15px; line-height: 1.6; color: #444;">We have successfully received your vehicle rental request. Our support team is already reviewing your background & driving details. Most approvals are processed and completed in under 24 hours.</p>
          
          <div style="background-color: #fcfbfa; padding: 24px; border-radius: 12px; border: 1px solid #f5ebd5; margin: 25px 0;">
            <h3 style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #8a784d; margin-top: 0; margin-bottom: 16px; font-weight: bold;">Reservation Request Receipt</h3>
            <table style="width: 100%; border-collapse: collapse; font-size: 13px; line-height: 2;">
              <tr>
                <td style="color: #777; width: 140px;">Vehicle Selected</td>
                <td style="color: #111; font-weight: 600;">${lead.service || "Standard Selection"}</td>
              </tr>
              <tr>
                <td style="color: #777;">Metro Region</td>
                <td style="color: #111; font-weight: 600;">${lead.city}</td>
              </tr>
              <tr>
                <td style="color: #777;">Scheduled Pickup</td>
                <td style="color: #111;">${lead.date || "To be arranged"} / ${lead.time || "To be arranged"}</td>
              </tr>
              <tr>
                <td style="color: #777;">Contact Number</td>
                <td style="color: #111;">${lead.phone}</td>
              </tr>
            </table>
          </div>

          <p style="font-size: 14px; color: #555; line-height: 1.6; margin-bottom: 25px;">What's next? A dispatch coordinator will call or SMS you shortly on your registered number to finalize the validation step. Once confirmed, you can pick up your vehicle from our local depot in under 1 hour.</p>
          
          <hr style="border: 0; border-top: 1px solid #f0f0f0; margin: 25px 0;" />
          
          <div style="text-align: center; font-size: 11px; color: #999; line-height: 1.6;">
            <p style="font-weight: bold; color: #555; margin-bottom: 4px;">ServUfast Corporation</p>
            <p style="margin: 0;">Certified Commercial Transit Solutions.<br />
            Need instant help? Reach our regional support team at ${config.contact?.phone || "+1 (865) 696-9885"}</p>
          </div>
        </div>
      `;

      await transporter.sendMail({
        from: sender,
        to: lead.email,
        subject: `Booking Acknowledged - ServUfast Rental Verification`,
        html: visitorHtml,
      });
      console.log(`Successfully completed automated confirmation mail trigger to client: ${lead.email}`);
    }

    // 2. Send instant copy notification to management/admin
    const adminHtml = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #111; border-radius: 16px; background-color: #0d110f; color: #e6e8e7;">
        <div style="border-left: 3px solid #cda851; padding-left: 15px; margin-bottom: 25px;">
          <h2 style="color: #ffffff; font-size: 18px; margin: 0; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">New Booking Submission</h2>
          <span style="font-size: 10px; font-family: monospace; color: #cda851;">STATUS: PENDING COORDINATOR ACTION</span>
        </div>
        
        <p style="font-size: 13.5px; line-height: 1.5; color: #b0b5b2;">A new driver has registered an application flow on the website portal. Please find their lead specifications down below:</p>
        
        <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin: 25px 0; background-color: #141a17; border-radius: 8px; overflow: hidden; border: 1px solid #232b26;">
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #232b26; font-weight: bold; width: 150px; color: #8a928e;">Applicant Full Name</td>
            <td style="padding: 12px; border-bottom: 1px solid #232b26; color: #ffffff; font-weight: bold;">${lead.name}</td>
          </tr>
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #232b26; font-weight: bold; color: #8a928e;">Phone Number</td>
            <td style="padding: 12px; border-bottom: 1px solid #232b26; color: #cda851; font-weight: bold;"><a href="tel:${lead.phone}" style="color: #cda851; text-decoration: none;">${lead.phone}</a></td>
          </tr>
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #232b26; font-weight: bold; color: #8a928e;">Email Address</td>
            <td style="padding: 12px; border-bottom: 1px solid #232b26; color: #ffffff;">${lead.email || "No Email Provided"}</td>
          </tr>
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #232b26; font-weight: bold; color: #8a928e;">Metro Area / Location</td>
            <td style="padding: 12px; border-bottom: 1px solid #232b26; color: #ffffff;">${lead.city}</td>
          </tr>
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #232b26; font-weight: bold; color: #8a928e;">Vehicle Class Code</td>
            <td style="padding: 12px; border-bottom: 1px solid #232b26; color: #cda851; font-weight: bold; text-transform: capitalize;">${lead.service || "Standard Rental"}</td>
          </tr>
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #232b26; font-weight: bold; color: #8a928e;">Scheduled Pickup</td>
            <td style="padding: 12px; border-bottom: 1px solid #232b26; color: #ffffff;">${lead.date || "N/A"} at ${lead.time || "N/A"}</td>
          </tr>
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #232b26; font-weight: bold; color: #8a928e;">Rideshare Background</td>
            <td style="padding: 12px; border-bottom: 1px solid #232b26; color: #ffffff;">${lead.newCustomer === false ? "Experienced Gig Driver" : "Beginner / New Applicant"}</td>
          </tr>
          <tr>
            <td style="padding: 12px; font-weight: bold; color: #8a928e; vertical-align: top;">Custom Notes</td>
            <td style="padding: 12px; color: #e6e8e7; line-height: 1.5; white-space: pre-wrap;">${lead.message || "No comments attached by driver."}</td>
          </tr>
        </table>

        <div style="text-align: center; margin-top: 35px; margin-bottom: 10px;">
          <div style="display: inline-block; background-color: #cda851; border-radius: 30px; padding: 1px;">
            <span style="display: block; background-color: #0d110f; border-radius: 29px; padding: 10px 24px; font-size: 12px; color: #cda851; font-weight: bold; letter-spacing: 1px; text-decoration: none;">
              MANAGEMENT LEAD NOTIFIED
            </span>
          </div>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: sender,
      to: adminEmail,
      subject: `[LEAD-ALERT] New application from ${lead.name} (${lead.city})`,
      html: adminHtml,
    });
    console.log(`Successfully completed copy alert transmission to admin inbox: ${adminEmail}`);

  } catch (err) {
    console.error("Nodemailer routing system exception caught:", err);
  }
}

// App lead submission route
app.post("/api/apply", (req, res) => {
  const { name, phone, email, city, service, date, time, newCustomer, message } = req.body;

  if (!name || !phone || !city) {
    return res.status(400).json({ error: "Missing required fields: Name, Phone, and City are required." });
  }

  // Save lead locally
  const leadData = { name, phone, email, city, service, date, time, newCustomer, message };
  saveLead(leadData);

  // Trigger SMTP emails asynchronously (non-blocking, fast client response)
  sendLeadEmails(leadData).catch(err => {
    console.error("Async email dispatcher routing runtime error:", err);
  });

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
    const { createServer: createViteServer } = await import("vite");
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

if (!process.env.VERCEL) {
  startServer();
}

export default app;
