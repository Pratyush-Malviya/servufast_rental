import React, { useState, useEffect } from "react";
import { 
  Shield, 
  Trash2, 
  CheckCircle, 
  Calendar, 
  MapPin, 
  User, 
  Clock, 
  Mail, 
  Phone, 
  Coins, 
  LogOut, 
  RefreshCw, 
  AlertCircle, 
  Unlock, 
  Lock, 
  Settings, 
  FileText, 
  Check, 
  ChevronRight,
  Eye,
  Paperclip,
  Plus,
  Globe
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ServiceCard } from "../types";

export default function AdminPanel({ onClose }: { onClose: () => void }) {
  // Passcode verification
  const [passcode, setPasscode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");

  // Server state
  const [vehicles, setVehicles] = useState<ServiceCard[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState("");

  // Editor states
  const [editingVehicleId, setEditingVehicleId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{
    title: string;
    description: string;
    pricingNum: number;
    badge: "Available now" | "Coming soon" | "Waitlist";
    isAvailable: boolean;
    image: string;
  }>({
    title: "",
    description: "",
    pricingNum: 150,
    badge: "Available now",
    isAvailable: true,
    image: "",
  });

  // UI status (e.g. "Saved successfully")
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState<"success" | "error">("success");
  
  // Debounced auto-save state
  const [savingStatus, setSavingStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  // Passcode rotation access state management
  const [currentPasscode, setCurrentPasscode] = useState("");
  const [newPasscode, setNewPasscode] = useState("");
  const [confirmPasscode, setConfirmPasscode] = useState("");
  const [changeError, setChangeError] = useState("");
  const [isChanging, setIsChanging] = useState(false);
  const [showSecurityCard, setShowSecurityCard] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // New Listing creation state
  const [showAddListing, setShowAddListing] = useState(false);
  const [showBrandPanel, setShowBrandPanel] = useState(false);
  const [isSavingBrand, setIsSavingBrand] = useState(false);
  const [brandForm, setBrandForm] = useState({
    phone: "",
    phoneTel: "",
    email: "",
    address: "",
    whatsapp: "",
    facebook: "",
    twitter: "",
    instagram: "",
    linkedin: "",
    brandName: "",
    brandSubtitle: "",
    editionText: "",
    copyrightText: "",
  });
  const [newVehicleForm, setNewVehicleForm] = useState({
    title: "",
    description: "",
    category: "",
    pricingNum: 150,
    badge: "Available now" as "Available now" | "Coming soon" | "Waitlist",
    isAvailable: true,
    image: "",
    stat1Label: "Optimal Fuels",
    stat1Value: "Regular Gas / Hybrid",
    stat2Label: "Avg. Mileage",
    stat2Value: "32 MPG",
    stat3Label: "Partner Rating",
    stat3Value: "4.95 / 5",
    stat4Label: "Pickup Depot",
    stat4Value: "Central Depot",
    inclusionsText: "Tested structural safety configurations\nExcellent air flow systems for maximum comfort\nIncludes standard routine engine maintenance\nFull comprehensive zero-deductible insurance guard"
  });

  // Fetch admin content
  useEffect(() => {
    if (isAuthenticated) {
      loadAdminData();
    }
  }, [isAuthenticated]);

  // Debounced auto-save effect for vehicle form fields
  useEffect(() => {
    if (!editingVehicleId) {
      setSavingStatus("idle");
      return;
    }

    // Check if there are actual edits compare to the stored state
    const originalVehicle = vehicles.find((v) => v.id === editingVehicleId);
    if (!originalVehicle) return;

    const priceDigits = originalVehicle.price.replace(/[^0-9]/g, "");
    const parsedPrice = parseInt(priceDigits) || 150;

    const hasChanges =
      originalVehicle.title !== editForm.title ||
      originalVehicle.description !== editForm.description ||
      originalVehicle.image !== editForm.image ||
      originalVehicle.badge !== editForm.badge ||
      originalVehicle.isAvailable !== editForm.isAvailable ||
      parsedPrice !== editForm.pricingNum;

    if (!hasChanges) {
      // If no changes exist, reset loading and return
      setSavingStatus("idle");
      return;
    }

    setSavingStatus("saving");

    const timer = setTimeout(async () => {
      const updated = vehicles.map((v) => {
        if (v.id === editingVehicleId) {
          return {
            ...v,
            title: editForm.title,
            description: editForm.description,
            price: `$${editForm.pricingNum} / week`,
            isAvailable: editForm.isAvailable,
            badge: editForm.badge,
            image: editForm.image,
          };
        }
        return v;
      });

      try {
        const response = await fetch("/api/admin/vehicles", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updated),
        });

        if (!response.ok) throw new Error("Auto-save failed.");

        const resData = await response.json();
        setVehicles(resData.vehicles);
        setSavingStatus("saved");

        // Dispatch background synchronization event
        window.dispatchEvent(new CustomEvent("fleet-updated"));
      } catch (err) {
        console.error("Failed to automatically synchronize vehicle info", err);
        setSavingStatus("error");
      }
    }, 850);

    return () => clearTimeout(timer);
  }, [editForm, editingVehicleId, vehicles]);

   const loadAdminData = async () => {
    setIsLoading(true);
    setErrorStatus("");
    try {
      // Parallel fetches for efficiency
      const [vRes, lRes, cRes] = await Promise.all([
        fetch("/api/vehicles"),
        fetch("/api/admin/leads"),
        fetch("/api/config")
      ]);

      if (!vRes.ok || !lRes.ok || !cRes.ok) {
        throw new Error("One or more admin endpoints failed to load.");
      }

      const vData = await vRes.json();
      const lData = await lRes.json();
      const cData = await cRes.json();

      setVehicles(vData);
      setLeads(lData);
      if (cData) {
        setBrandForm({
          phone: cData.contact?.phone || "",
          phoneTel: cData.contact?.phoneTel || "",
          email: cData.contact?.email || "",
          address: cData.contact?.address || "",
          whatsapp: cData.social?.whatsapp || "",
          facebook: cData.social?.facebook || "",
          twitter: cData.social?.twitter || "",
          instagram: cData.social?.instagram || "",
          linkedin: cData.social?.linkedin || "",
          brandName: cData.general?.brandName || "",
          brandSubtitle: cData.general?.brandSubtitle || "",
          editionText: cData.general?.editionText || "",
          copyrightText: cData.general?.copyrightText || "",
        });
      }
    } catch (e: any) {
      console.error(e);
      setErrorStatus(e.message || "Failed to load admin logs.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setIsVerifying(true);

    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode: passcode.trim() }),
      });
      if (res.ok) {
        setIsAuthenticated(true);
      } else {
        const data = await res.json();
        setAuthError(data.error || "Invalid master key passcode. Standard key defaults to 'admin'.");
      }
    } catch (err) {
      setAuthError("Failed to communicate with master authorization host.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleChangePasscode = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangeError("");

    if (!currentPasscode) {
      setChangeError("Existing master key verification is required.");
      return;
    }
    if (!newPasscode.trim()) {
      setChangeError("New security validation key cannot be empty.");
      return;
    }
    if (newPasscode !== confirmPasscode) {
      setChangeError("Confirm validation key must match exactly.");
      return;
    }

    setIsChanging(true);
    try {
      const res = await fetch("/api/admin/change-passcode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPasscode: currentPasscode.trim(),
          newPasscode: newPasscode.trim(),
        }),
      });

      if (res.ok) {
        showToast("Administrative master passcode rotated successfully.", "success");
        setCurrentPasscode("");
        setNewPasscode("");
        setConfirmPasscode("");
        setShowSecurityCard(false);
      } else {
        const data = await res.json();
        setChangeError(data.error || "Master key lifecycle transition rejected.");
      }
    } catch (err) {
      setChangeError("Network exception occurred during passport rotation.");
    } finally {
      setIsChanging(false);
    }
  };

  const handleSaveBrandForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingBrand(true);
    try {
      const response = await fetch("/api/admin/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          passcode: passcode.trim(),
          config: {
            contact: {
              phone: brandForm.phone,
              phoneTel: brandForm.phoneTel,
              email: brandForm.email,
              address: brandForm.address,
            },
            social: {
              whatsapp: brandForm.whatsapp,
              facebook: brandForm.facebook,
              twitter: brandForm.twitter,
              instagram: brandForm.instagram,
              linkedin: brandForm.linkedin,
            },
            general: {
              brandName: brandForm.brandName,
              brandSubtitle: brandForm.brandSubtitle,
              editionText: brandForm.editionText,
              copyrightText: brandForm.copyrightText,
            }
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update brand profile.");
      }

      showToast("Brand metadata and contact details modernized successfully.", "success");
      
      // Dispatch update custom event to trigger other components/hooks to refresh!
      window.dispatchEvent(new CustomEvent("brand-config-updated"));
      
      setShowBrandPanel(false);
    } catch (err: any) {
      showToast(err.message || "Could not synchronize brand settings.", "error");
    } finally {
      setIsSavingBrand(false);
    }
  };

  const handleCreateVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newVehicleForm.title.trim()) {
      showToast("Title is required for listing.", "error");
      return;
    }
    if (!newVehicleForm.description.trim()) {
      showToast("Description is required for listing.", "error");
      return;
    }

    const newId = newVehicleForm.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || `vehicle-${Date.now()}`;
    const newCategory = newVehicleForm.category.trim().toLowerCase() || newId;

    if (vehicles.some(v => v.id === newId)) {
      showToast("A vehicle category with this Title already exists.", "error");
      return;
    }

    const newVehicle: ServiceCard = {
      id: newId,
      title: newVehicleForm.title.trim(),
      description: newVehicleForm.description.trim(),
      category: newCategory,
      badge: newVehicleForm.badge,
      price: `$${newVehicleForm.pricingNum} / week`,
      isAvailable: newVehicleForm.isAvailable,
      image: newVehicleForm.image.trim() || undefined,
      stats: [
        { label: newVehicleForm.stat1Label.trim() || "Optimal Fuels", value: newVehicleForm.stat1Value.trim() || "Regular Gas" },
        { label: newVehicleForm.stat2Label.trim() || "Avg. Mileage", value: newVehicleForm.stat2Value.trim() || "32 MPG" },
        { label: newVehicleForm.stat3Label.trim() || "Partner Rating", value: newVehicleForm.stat3Value.trim() || "4.90 / 5" },
        { label: newVehicleForm.stat4Label.trim() || "Pickup Depot", value: newVehicleForm.stat4Value.trim() || "Central Depot" },
      ],
      inclusions: newVehicleForm.inclusionsText
        .split("\n")
        .map(line => line.trim())
        .filter(line => line.length > 0)
    };

    const updated = [...vehicles, newVehicle];

    try {
      const response = await fetch("/api/admin/vehicles", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });

      if (!response.ok) throw new Error("Failed to write to central fleet catalog.");

      const resData = await response.json();
      setVehicles(resData.vehicles);
      setShowAddListing(false);
      showToast(`Successfully added "${newVehicle.title}" to active listing registry!`, "success");

      // Reset Form
      setNewVehicleForm({
        title: "",
        description: "",
        category: "",
        pricingNum: 150,
        badge: "Available now",
        isAvailable: true,
        image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80",
        stat1Label: "Optimal Fuels",
        stat1Value: "Regular Gas / Hybrid",
        stat2Label: "Avg. Mileage",
        stat2Value: "32 MPG",
        stat3Label: "Partner Rating",
        stat3Value: "4.95 / 5",
        stat4Label: "Pickup Depot",
        stat4Value: "Central Depot",
        inclusionsText: "Tested structural safety configurations\nExcellent air flow systems for maximum comfort\nIncludes standard routine engine maintenance\nFull comprehensive zero-deductible insurance guard"
      });

      // Dispatch background synchronization event
      window.dispatchEvent(new CustomEvent("fleet-updated"));
    } catch (err: any) {
      showToast(err.message || "Error creating vehicle listing.", "error");
    }
  };

  const handleDeleteVehicle = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${title}" listing from the active catalog? This cannot be undone.`)) {
      return;
    }

    const updated = vehicles.filter((v) => v.id !== id);

    try {
      const response = await fetch("/api/admin/vehicles", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });

      if (!response.ok) throw new Error("Could not discard category listing.");

      const resData = await response.json();
      setVehicles(resData.vehicles);
      showToast(`Discarded "${title}" category from the active database catalog.`, "success");

      // Dispatch background synchronization event
      window.dispatchEvent(new CustomEvent("fleet-updated"));
    } catch (err: any) {
      showToast(err.message || "Failed to delete listing.", "error");
    }
  };

  // Select vehicle for editing
  const startEditVehicle = (vehicle: ServiceCard) => {
    setEditingVehicleId(vehicle.id);
    
    // Extract numeric weekly price from string (e.g. "$150 / week" -> 150)
    const priceDigits = vehicle.price.replace(/[^0-9]/g, "");
    const parsedPrice = parseInt(priceDigits) || 150;

    setEditForm({
      title: vehicle.title,
      description: vehicle.description,
      pricingNum: parsedPrice,
      badge: vehicle.badge,
      isAvailable: vehicle.isAvailable,
      image: vehicle.image || "",
    });
  };

  // Save vehicle edit
  const handleSaveVehicle = async (id: string) => {
    const updated = vehicles.map((v) => {
      if (v.id === id) {
        return {
          ...v,
          title: editForm.title,
          description: editForm.description,
          price: `$${editForm.pricingNum} / week`,
          isAvailable: editForm.isAvailable,
          badge: editForm.badge,
          image: editForm.image,
        };
      }
      return v;
    });

    try {
      const response = await fetch("/api/admin/vehicles", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });

      if (!response.ok) throw new Error("Failed to write layout modification.");

      const resData = await response.json();
      setVehicles(resData.vehicles);
      setEditingVehicleId(null);
      showToast("Fleet class modified and pricing synced successfully.", "success");
      
      // Dispatch event to refresh live views instantly
      window.dispatchEvent(new CustomEvent("fleet-updated"));
    } catch (err: any) {
      showToast(err.message || "Error saving layout.", "error");
    }
  };

  // Delete lead submission
  const handleDeleteLead = async (leadId: string) => {
    if (!window.confirm("Are you sure you want to permanently remove this driver application ledger?")) return;

    try {
      const response = await fetch(`/api/admin/leads/${leadId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Could not drop application from directory.");

      setLeads((prev) => prev.filter((l) => l.id !== leadId));
      showToast("Application ledger deleted securely.", "success");
    } catch (err: any) {
      showToast(err.message || "Failed to drop applicant.", "error");
    }
  };

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setStatusMessage(msg);
    setStatusType(type);
    setTimeout(() => {
      setStatusMessage("");
    }, 4000);
  };

  // Passcode login card styled beautifully
  if (!isAuthenticated) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center p-6 bg-brand-bg relative z-20">
        <div className="absolute inset-0 bg-radial-gradient from-brand-gold/5 via-transparent to-transparent pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md p-10 bg-brand-card/80 backdrop-blur-md rounded-[24px] border border-brand-gold/15 glass-cyber-card transition-all"
        >
          <div className="text-center space-y-4 mb-8">
            <div className="w-14 h-14 rounded-full border border-brand-gold/25 bg-brand-gold/10 flex items-center justify-center text-brand-gold mx-auto mb-2">
              <Shield size={24} />
            </div>
            <span className="font-mono text-[10px] tracking-widest text-brand-gold uppercase block font-bold">
              Secure Central Registry Authority
            </span>
            <h2 className="font-serif text-2xl text-brand-cream italic">
              ServUfast Staff Vault
            </h2>
            <p className="text-xs text-brand-cream-dim font-light max-w-xs mx-auto">
              Protected administration console. Enter administrative security key to coordinate listings, pricing and vehicle dispatches.
            </p>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-6">
            <div className="space-y-1.5 text-left">
              <label className="text-[10px] font-semibold text-brand-cream-subtle uppercase tracking-widest block">
                Security Passcode
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Enter 'admin' as default key"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full bg-brand-bg text-brand-cream border border-brand-cream/10 rounded-xl py-3.5 pl-4 pr-10 focus:border-brand-gold focus:outline-none transition-all duration-200 font-mono text-sm tracking-widest placeholder:tracking-normal placeholder-brand-cream-subtle/30"
                  autoFocus
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-cream-subtle/60">
                  <Lock size={14} />
                </div>
              </div>
              {authError && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] font-mono rounded-lg mt-2 flex items-center gap-2">
                  <AlertCircle size={12} className="shrink-0" />
                  <span>{authError}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-4 bg-brand-gold hover:bg-brand-gold-light text-brand-bg rounded-xl font-sans text-xs font-bold tracking-widest uppercase transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
            >
              {isVerifying ? (
                <>
                  <RefreshCw size={13} className="animate-spin" />
                  Verifying Credentials...
                </>
              ) : (
                <>
                  Verify Master Key <ChevronRight size={14} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 border-t border-brand-cream/5 pt-6 text-center">
            <button
              onClick={onClose}
              className="text-xs text-brand-cream-subtle hover:text-brand-gold font-mono transition-colors"
            >
              ← Cancel & Back to Homepage
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Loaded administrative panel
  return (
    <div className="min-h-screen bg-brand-bg text-brand-cream p-4 sm:p-8 lg:p-12 relative z-20">
      
      {/* Toast Alert Banner */}
      <AnimatePresence>
        {statusMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            className={`fixed top-8 left-1/2 -translate-x-1/2 px-6 py-4 rounded-xl border z-50 shadow-2xl flex items-center gap-3 backdrop-blur-md font-mono text-xs ${
              statusType === "success" 
                ? "bg-emerald-950/90 text-emerald-300 border-emerald-550/40" 
                : "bg-red-950/90 text-red-300 border-red-500/40"
            }`}
          >
            <CheckCircle size={15} />
            <span>{statusMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header Ribbon */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-8 border-b border-brand-muted/40 gap-6">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="live-indicator shrink-0" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-brand-gold font-bold">
                SYSTEM PORTAL SECURE · SESSION ACTIVE
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-serif text-brand-cream mt-2">
              ServUfast <em className="text-brand-gold font-serif italic font-normal">Administration</em> Console
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={loadAdminData}
              title="Refresh Registry Data"
              className="p-3 border border-brand-cream/10 rounded-full hover:border-brand-gold text-brand-cream hover:text-brand-gold transition-all duration-200"
            >
              <RefreshCw size={15} className={`${isLoading ? "animate-spin" : ""}`} />
            </button>
            <button
              onClick={() => {
                setShowSecurityCard(!showSecurityCard);
                setShowBrandPanel(false);
                setChangeError("");
              }}
              className={`inline-flex items-center gap-2 px-4 py-2.5 border text-xs font-mono tracking-wider uppercase rounded-full transition-colors cursor-pointer ${
                showSecurityCard 
                  ? "border-brand-gold bg-brand-gold/10 text-brand-gold font-bold" 
                  : "border-brand-cream/20 text-brand-cream hover:text-brand-gold hover:border-brand-gold/45 hover:bg-brand-secondary/40"
              }`}
            >
              <Settings size={12} className={showSecurityCard ? "animate-spin text-brand-gold" : "text-brand-cream"} /> Security Credentials
            </button>
            <button
              onClick={() => {
                setShowBrandPanel(!showBrandPanel);
                setShowSecurityCard(false);
              }}
              className={`inline-flex items-center gap-2 px-4 py-2.5 border text-xs font-mono tracking-wider uppercase rounded-full transition-colors cursor-pointer ${
                showBrandPanel 
                  ? "border-brand-gold bg-brand-gold/10 text-brand-gold font-bold" 
                  : "border-brand-cream/20 text-brand-cream hover:text-brand-gold hover:border-brand-gold/45 hover:bg-brand-secondary/40"
              }`}
            >
              <Globe size={12} className={showBrandPanel ? "text-brand-gold scale-110" : "text-brand-cream"} /> Brand & Social Links
            </button>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="inline-flex items-center gap-2 px-4 py-2.5 border border-red-500/20 text-red-400 hover:bg-red-500/10 text-xs font-mono tracking-wider uppercase rounded-full transition-colors cursor-pointer"
            >
              <LogOut size={12} /> Lock Dashboard
            </button>
            <button
              onClick={onClose}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-cream text-brand-bg hover:bg-brand-cream-subtle text-xs font-mono font-bold tracking-wider uppercase rounded-full transition-colors"
            >
              Exit Console
            </button>
          </div>
        </div>

        {/* Credentials security panel */}
        <AnimatePresence>
          {showSecurityCard && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="overflow-hidden bg-brand-card/90 backdrop-blur-md border border-brand-gold/20 rounded-[20px] p-6 sm:p-8 space-y-6"
            >
              <div className="flex items-start justify-between pb-4 border-b border-brand-cream/5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Settings className="text-brand-gold shrink-0 animate-spin-slow" size={18} />
                    <h3 className="font-serif text-lg text-brand-cream">
                      Rotate Access Credentials
                    </h3>
                  </div>
                  <p className="text-xs text-brand-cream-dim leading-relaxed font-light">
                    Update the master security key required to access the central registry, modify fleet listing details, and adjust active pricing structures.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSecurityCard(false)}
                  className="p-1 px-2.5 text-[10px] font-mono border border-brand-cream/10 rounded-md hover:border-brand-gold hover:text-brand-gold text-brand-cream-dim transition-colors cursor-pointer uppercase"
                >
                  Close
                </button>
              </div>

              <form onSubmit={handleChangePasscode} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-mono tracking-widest uppercase text-brand-gold font-bold">
                    Existing Validation Key
                  </label>
                  <input
                    type="password"
                    placeholder="Enter current passcode"
                    value={currentPasscode}
                    onChange={(e) => setCurrentPasscode(e.target.value)}
                    className="w-full bg-brand-bg text-brand-cream border border-brand-cream/15 rounded-xl px-4 py-3 text-xs focus:border-brand-gold focus:outline-none transition-all placeholder:text-brand-cream-subtle/30"
                    required
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-mono tracking-widest uppercase text-brand-gold font-bold">
                    New Security Key
                  </label>
                  <input
                    type="password"
                    placeholder="Enter new passcode"
                    value={newPasscode}
                    onChange={(e) => setNewPasscode(e.target.value)}
                    className="w-full bg-brand-bg text-brand-cream border border-brand-cream/15 rounded-xl px-4 py-3 text-xs focus:border-brand-gold focus:outline-none transition-all placeholder:text-brand-cream-subtle/30"
                    required
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-mono tracking-widest uppercase text-brand-gold font-bold">
                    Confirm Validation Key
                  </label>
                  <input
                    type="password"
                    placeholder="Re-enter new passcode"
                    value={confirmPasscode}
                    onChange={(e) => setConfirmPasscode(e.target.value)}
                    className="w-full bg-brand-bg text-brand-cream border border-brand-cream/15 rounded-xl px-4 py-3 text-xs focus:border-brand-gold focus:outline-none transition-all placeholder:text-brand-cream-subtle/30"
                    required
                  />
                </div>

                <div className="md:col-span-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-brand-cream/5">
                  <div className="text-xs text-red-400 font-mono flex items-center gap-2 min-h-[1.5rem]">
                    {changeError && (
                      <>
                        <AlertCircle size={12} />
                        <span>{changeError}</span>
                      </>
                    )}
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isChanging}
                    className="px-6 py-3 bg-brand-gold text-brand-bg hover:bg-brand-gold-light lg:self-end font-sans text-xs font-bold tracking-widest uppercase rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 disabled:opacity-40 font-bold"
                  >
                    {isChanging ? (
                      <>
                        <RefreshCw size={12} className="animate-spin" />
                        Rotating Authority...
                      </>
                    ) : (
                      <>
                        Update Validation Key
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Brand Identity & Social Links Panel */}
        <AnimatePresence>
          {showBrandPanel && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="overflow-hidden bg-brand-card/90 backdrop-blur-md border border-brand-gold/20 rounded-[20px] p-6 sm:p-8 space-y-6"
            >
              <div className="flex items-start justify-between pb-4 border-b border-brand-cream/5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Globe className="text-brand-gold shrink-0" size={18} />
                    <h3 className="font-serif text-lg text-brand-cream font-medium">
                      Design & Brand Configurations
                    </h3>
                  </div>
                  <p className="text-xs text-brand-cream-dim leading-relaxed font-light">
                    Manage support hotlines, contact parameters, copyright clauses, brand typography tags, and social media integrations in real-time.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowBrandPanel(false)}
                  className="p-1 px-2.5 text-[10px] font-mono border border-brand-cream/10 rounded-md hover:border-brand-gold hover:text-brand-gold text-brand-cream-dim transition-colors cursor-pointer uppercase"
                >
                  Close
                </button>
              </div>

              <form onSubmit={handleSaveBrandForm} className="space-y-6">
                {/* 3-Column Grid representing categories */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  
                  {/* Column A: Brand Identity */}
                  <div className="space-y-4">
                    <h4 className="font-mono text-[10px] uppercase tracking-widest text-brand-gold font-bold border-b border-brand-cream/5 pb-2">
                      1. Corporate Identity
                    </h4>
                    
                    <div className="space-y-1.5 text-left">
                      <label className="text-[9px] font-mono tracking-wider uppercase text-brand-cream-subtle font-semibold block">
                        Primary Brand Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. ServU"
                        value={brandForm.brandName}
                        onChange={(e) => setBrandForm({ ...brandForm, brandName: e.target.value })}
                        className="w-full bg-brand-bg text-brand-cream border border-brand-cream/15 rounded-xl px-4 py-2.5 text-xs focus:border-brand-gold focus:outline-none transition-all placeholder:text-brand-cream-subtle/20"
                        required
                      />
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="text-[9px] font-mono tracking-wider uppercase text-brand-cream-subtle font-semibold block">
                        Brand Subtitle / Suffix
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. fast"
                        value={brandForm.brandSubtitle}
                        onChange={(e) => setBrandForm({ ...brandForm, brandSubtitle: e.target.value })}
                        className="w-full bg-brand-bg text-brand-cream border border-brand-cream/15 rounded-xl px-4 py-2.5 text-xs focus:border-brand-gold focus:outline-none transition-all placeholder:text-brand-cream-subtle/20"
                      />
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="text-[9px] font-mono tracking-wider uppercase text-brand-cream-subtle font-semibold block">
                        Edition Label Reference
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Edition No. 01 · 2026"
                        value={brandForm.editionText}
                        onChange={(e) => setBrandForm({ ...brandForm, editionText: e.target.value })}
                        className="w-full bg-brand-bg text-brand-cream border border-brand-cream/15 rounded-xl px-4 py-2.5 text-xs focus:border-brand-gold focus:outline-none transition-all placeholder:text-brand-cream-subtle/20"
                      />
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="text-[9px] font-mono tracking-wider uppercase text-brand-cream-subtle font-semibold block">
                        Copyright & System Stamp
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Copyright block details"
                        value={brandForm.copyrightText}
                        onChange={(e) => setBrandForm({ ...brandForm, copyrightText: e.target.value })}
                        className="w-full bg-brand-bg text-brand-cream border border-brand-cream/15 rounded-xl px-4 py-2.5 text-xs focus:border-brand-gold focus:outline-none transition-all placeholder:text-brand-cream-subtle/20 font-light resize-none text-[11px]"
                      />
                    </div>
                  </div>

                  {/* Column B: Primary Contacts */}
                  <div className="space-y-4">
                    <h4 className="font-mono text-[10px] uppercase tracking-widest text-brand-gold font-bold border-b border-brand-cream/5 pb-2">
                      2. Support & Dispatch Center
                    </h4>

                    <div className="space-y-1.5 text-left">
                      <label className="text-[9px] font-mono tracking-wider uppercase text-brand-cream-subtle font-semibold block">
                        Helpdesk Hotline Number
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. +1 (865) 696-9885"
                        value={brandForm.phone}
                        onChange={(e) => setBrandForm({ ...brandForm, phone: e.target.value })}
                        className="w-full bg-brand-bg text-brand-cream border border-brand-cream/15 rounded-xl px-4 py-2.5 text-xs focus:border-brand-gold focus:outline-none transition-all placeholder:text-brand-cream-subtle/20"
                        required
                      />
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="text-[9px] font-mono tracking-wider uppercase text-brand-cream-subtle font-semibold block">
                        Hotline Tel URI Link (numbers only)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. +18656969885"
                        value={brandForm.phoneTel}
                        onChange={(e) => setBrandForm({ ...brandForm, phoneTel: e.target.value })}
                        className="w-full bg-brand-bg text-brand-cream border border-brand-cream/15 rounded-xl px-4 py-2.5 text-xs focus:border-brand-gold focus:outline-none transition-all placeholder:text-brand-cream-subtle/20"
                        required
                      />
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="text-[9px] font-mono tracking-wider uppercase text-brand-cream-subtle font-semibold block">
                        Official Inquiry Email
                      </label>
                      <input
                        type="email"
                        placeholder="e.g. info@domain.com"
                        value={brandForm.email}
                        onChange={(e) => setBrandForm({ ...brandForm, email: e.target.value })}
                        className="w-full bg-brand-bg text-brand-cream border border-brand-cream/15 rounded-xl px-4 py-2.5 text-xs focus:border-brand-gold focus:outline-none transition-all placeholder:text-brand-cream-subtle/20"
                        required
                      />
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="text-[9px] font-mono tracking-wider uppercase text-brand-cream-subtle font-semibold block">
                        Corporate Headquarters Address
                      </label>
                      <input
                        type="text"
                        placeholder="Physical address text"
                        value={brandForm.address}
                        onChange={(e) => setBrandForm({ ...brandForm, address: e.target.value })}
                        className="w-full bg-brand-bg text-brand-cream border border-brand-cream/15 rounded-xl px-4 py-2.5 text-xs focus:border-brand-gold focus:outline-none transition-all placeholder:text-brand-cream-subtle/20"
                        required
                      />
                    </div>
                  </div>

                  {/* Column C: Social integrations */}
                  <div className="space-y-4">
                    <h4 className="font-mono text-[10px] uppercase tracking-widest text-brand-gold font-bold border-b border-brand-cream/5 pb-2">
                      3. Social Integrations
                    </h4>

                    <div className="space-y-1.5 text-left">
                      <label className="text-[9px] font-mono tracking-wider uppercase text-brand-cream-subtle font-semibold block">
                        WhatsApp Contact URL
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., https://wa.me/1865..."
                        value={brandForm.whatsapp}
                        onChange={(e) => setBrandForm({ ...brandForm, whatsapp: e.target.value })}
                        className="w-full bg-brand-bg text-brand-cream border border-brand-cream/15 rounded-xl px-4 py-2.5 text-xs focus:border-brand-gold focus:outline-none transition-all placeholder:text-brand-cream-subtle/20 font-mono text-[11px]"
                      />
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="text-[9px] font-mono tracking-wider uppercase text-brand-cream-subtle font-semibold block">
                        Facebook Account Link
                      </label>
                      <input
                        type="text"
                        placeholder="https://facebook.com/..."
                        value={brandForm.facebook}
                        onChange={(e) => setBrandForm({ ...brandForm, facebook: e.target.value })}
                        className="w-full bg-brand-bg text-brand-cream border border-brand-cream/15 rounded-xl px-4 py-2.5 text-xs focus:border-brand-gold focus:outline-none transition-all placeholder:text-brand-cream-subtle/20 font-mono text-[11px]"
                      />
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="text-[9px] font-mono tracking-wider uppercase text-brand-cream-subtle font-semibold block">
                        Instagram Profile URL
                      </label>
                      <input
                        type="text"
                        placeholder="https://instagram.com/..."
                        value={brandForm.instagram}
                        onChange={(e) => setBrandForm({ ...brandForm, instagram: e.target.value })}
                        className="w-full bg-brand-bg text-brand-cream border border-brand-cream/15 rounded-xl px-4 py-2.5 text-xs focus:border-brand-gold focus:outline-none transition-all placeholder:text-brand-cream-subtle/20 font-mono text-[11px]"
                      />
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="text-[9px] font-mono tracking-wider uppercase text-brand-cream-subtle font-semibold block">
                        X Twitter Platform URL
                      </label>
                      <input
                        type="text"
                        placeholder="https://x.com/..."
                        value={brandForm.twitter}
                        onChange={(e) => setBrandForm({ ...brandForm, twitter: e.target.value })}
                        className="w-full bg-brand-bg text-brand-cream border border-brand-cream/15 rounded-xl px-4 py-2.5 text-xs focus:border-brand-gold focus:outline-none transition-all placeholder:text-brand-cream-subtle/20 font-mono text-[11px]"
                      />
                    </div>

                    <div className="space-y-1.5 text-left">
                      <label className="text-[9px] font-mono tracking-wider uppercase text-brand-cream-subtle font-semibold block">
                        LinkedIn Corporate URL
                      </label>
                      <input
                        type="text"
                        placeholder="https://linkedin.com/company/..."
                        value={brandForm.linkedin}
                        onChange={(e) => setBrandForm({ ...brandForm, linkedin: e.target.value })}
                        className="w-full bg-brand-bg text-brand-cream border border-brand-cream/15 rounded-xl px-4 py-2.5 text-xs focus:border-brand-gold focus:outline-none transition-all placeholder:text-brand-cream-subtle/20 font-mono text-[11px]"
                      />
                    </div>
                  </div>

                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-brand-cream/5 font-mono">
                  <button
                    type="button"
                    onClick={() => setShowBrandPanel(false)}
                    className="px-5 py-3 border border-brand-cream/10 text-brand-cream hover:border-brand-gold text-xs uppercase rounded-xl transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingBrand}
                    className="px-6 py-3 bg-brand-gold hover:bg-brand-gold-light text-brand-bg text-xs font-sans font-bold tracking-widest uppercase rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-45"
                  >
                    {isSavingBrand ? (
                      <>
                        <RefreshCw size={12} className="animate-spin" />
                        Synchronizing Brand...
                      </>
                    ) : (
                      <>
                        Commit Brand Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dashboard Quick Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              label: "Vetted Driver Inquiries",
              value: leads.length,
              desc: "Total dynamic bookings received",
              color: "text-brand-gold"
            },
            {
              label: "Fleet Categories Active",
              value: vehicles.length,
              desc: "Fully serialized lease archetypes",
              color: "text-brand-cream"
            },
            {
              label: "Average Weekly Rate",
              value: vehicles.length > 0
                ? `$${Math.round(vehicles.reduce((acc, curr) => {
                    const priceDigits = curr.price.replace(/[^0-9]/g, "");
                    return acc + (parseInt(priceDigits) || 0);
                  }, 0) / vehicles.length)}`
                : "$0",
              desc: "Derived weekly rent average",
              color: "text-emerald-400"
            },
            {
              label: "Pending Verification Priority",
              value: leads.length > 0 ? `${leads.length} Leads` : "0 Pending",
              desc: "Queued for instant dispatch",
              color: "text-amber-500"
            }
          ].map((stat, sIdx) => (
            <div key={sIdx} className="p-6 bg-brand-card/50 border border-brand-cream/5 rounded-[16px] space-y-2 relative overflow-hidden">
              <span className="font-mono text-[9px] uppercase tracking-widest text-[#B6B2AB]">
                {stat.label}
              </span>
              <p className={`font-mono text-3xl font-medium ${stat.color}`}>
                {stat.value}
              </p>
              <p className="text-[11px] text-brand-cream-dim leading-none font-light">
                {stat.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Dynamic Vehicles Listings & Pricing Management Section */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-serif text-brand-cream">
                Fleet Catalog & <span className="text-brand-gold italic">Weekly Pricing</span>
              </h2>
              <p className="text-xs text-brand-cream-dim font-light">
                Manage live fleet listings, adjust active price points, and configure real-time waitlists.
              </p>
            </div>

            <button
              onClick={() => {
                setShowAddListing(!showAddListing);
                if (showAddListing) {
                  // close
                } else {
                  // initialize form clean
                  setNewVehicleForm({
                    title: "",
                    description: "",
                    category: "",
                    pricingNum: 150,
                    badge: "Available now",
                    isAvailable: true,
                    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80",
                    stat1Label: "Optimal Fuels",
                    stat1Value: "Regular Gas",
                    stat2Label: "Avg. Mileage",
                    stat2Value: "32 MPG",
                    stat3Label: "Partner Rating",
                    stat3Value: "4.90 / 5",
                    stat4Label: "Pickup Depot",
                    stat4Value: "Central Depot",
                    inclusionsText: "Tested structural safety configurations\nExcellent air flow systems for maximum comfort\nIncludes standard routine engine maintenance\nFull comprehensive zero-deductible insurance guard"
                  });
                }
              }}
              className={`inline-flex items-center gap-2 px-5 py-2.5 border text-xs font-mono font-bold tracking-wider uppercase rounded-full transition-all duration-200 cursor-pointer shadow-lg ${
                showAddListing 
                  ? "border-brand-gold bg-brand-gold text-brand-bg hover:bg-brand-gold-light" 
                  : "border-brand-cream/20 text-brand-cream hover:text-brand-gold hover:border-brand-gold/45 hover:bg-brand-secondary/40"
              }`}
            >
              <Plus size={14} className={showAddListing ? "rotate-45 transition-transform" : "transition-transform"} /> 
              {showAddListing ? "Cancel Creation" : "Create New Listing"}
            </button>
          </div>

          {/* Create New Listing expandable panel */}
          <AnimatePresence>
            {showAddListing && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="overflow-hidden bg-brand-card/90 backdrop-blur-md border border-brand-gold/25 rounded-[24px] p-6 sm:p-10 space-y-8 shadow-2xl relative text-left"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-gold via-brand-cream to-brand-gold" />
                
                <div className="flex items-start justify-between pb-4 border-b border-brand-cream/5">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold border border-brand-gold/20">
                        <Plus size={16} />
                      </div>
                      <h3 className="font-serif text-xl text-brand-cream">
                        Craft New Fleet Category
                      </h3>
                    </div>
                    <p className="text-xs text-brand-cream-dim leading-relaxed font-light">
                      Expand the dynamic leasing directory by launching a new vehicle model class, initializing standard specs, and customizing base inclusions.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAddListing(false)}
                    className="p-1.5 px-3 text-[10px] font-mono border border-brand-cream/10 rounded-md hover:border-brand-gold hover:text-brand-gold text-brand-cream-dim transition-colors cursor-pointer uppercase font-bold"
                  >
                    Close
                  </button>
                </div>

                <form onSubmit={handleCreateVehicle} className="space-y-6 text-left">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
                    {/* Basic Listing Fields */}
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono tracking-widest uppercase text-brand-gold block font-bold">
                          Vehicle Listing/Class Title
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Mercedes Sprinter Prime van"
                          value={newVehicleForm.title}
                          onChange={(e) => setNewVehicleForm({ ...newVehicleForm, title: e.target.value })}
                          className="w-full bg-brand-bg text-brand-cream border border-brand-cream/15 rounded-xl px-4 py-3 text-xs focus:border-brand-gold focus:outline-none transition-all placeholder:text-brand-cream-subtle/30 font-semibold"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono tracking-widest uppercase text-brand-gold block font-bold">
                            Weekly Rental Price ($)
                          </label>
                          <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-brand-cream-subtle font-mono">$</span>
                            <input
                              type="number"
                              value={newVehicleForm.pricingNum}
                              onChange={(e) => setNewVehicleForm({ ...newVehicleForm, pricingNum: parseInt(e.target.value) || 0 })}
                              className="w-full bg-brand-bg text-brand-cream border border-brand-cream/15 rounded-xl pl-8 pr-3 py-3 text-xs focus:border-brand-gold focus:outline-none transition-all font-mono"
                              min={1}
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-mono tracking-widest uppercase text-brand-gold block font-bold">
                            Status Badge Label
                          </label>
                          <select
                            value={newVehicleForm.badge}
                            onChange={(e) => setNewVehicleForm({ ...newVehicleForm, badge: e.target.value as any })}
                            className="w-full bg-brand-bg text-brand-cream border border-brand-cream/15 rounded-xl px-3 py-3 text-xs focus:border-brand-gold focus:outline-none transition-all font-sans cursor-pointer"
                          >
                            <option value="Available now">Available now</option>
                            <option value="Coming soon">Coming soon</option>
                            <option value="Waitlist">Waitlist</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono tracking-widest uppercase text-brand-gold block font-bold">
                          Category Identifier (Lowercase Unique)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. van (defaults to slugified title)"
                          value={newVehicleForm.category}
                          onChange={(e) => setNewVehicleForm({ ...newVehicleForm, category: e.target.value })}
                          className="w-full bg-brand-bg text-brand-cream border border-brand-cream/15 rounded-xl px-4 py-3 text-xs focus:border-brand-gold focus:outline-none transition-all placeholder:text-brand-cream-subtle/30 font-mono"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono tracking-widest uppercase text-brand-gold block font-bold">
                          Introductory Summary Card Text
                        </label>
                        <textarea
                          placeholder="Provide a sleek explanation of this custom rental category class tailored for driver partners..."
                          value={newVehicleForm.description}
                          rows={3}
                          onChange={(e) => setNewVehicleForm({ ...newVehicleForm, description: e.target.value })}
                          className="w-full bg-brand-bg text-brand-cream border border-brand-cream/15 rounded-xl px-4 py-3 text-xs focus:border-brand-gold focus:outline-none transition-all placeholder:text-brand-cream-subtle/30 leading-relaxed font-light"
                          required
                        />
                      </div>

                      <div className="space-y-2 p-3 bg-brand-secondary/40 rounded-xl border border-brand-cream/5">
                        <label className="text-[10px] font-mono tracking-widest uppercase text-brand-gold block font-bold">
                          Vehicle Photo Image Card URL
                        </label>
                        
                        {newVehicleForm.image && (
                          <div className="w-full aspect-[21/9] rounded-lg overflow-hidden border border-brand-cream/15 relative bg-brand-secondary/80 mb-2">
                            <img
                              src={newVehicleForm.image}
                              alt="New Vehicle Preview"
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => setNewVehicleForm(prev => ({ ...prev, image: "" }))}
                              className="absolute top-2 right-2 p-1.5 bg-brand-bg/85 hover:bg-red-600 hover:text-white rounded-full text-xs text-brand-cream transition-colors border border-brand-cream/10 flex items-center justify-center cursor-pointer"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="Paste unsplash or web image link"
                            value={newVehicleForm.image}
                            onChange={(e) => setNewVehicleForm({ ...newVehicleForm, image: e.target.value })}
                            className="w-full bg-brand-bg text-brand-cream border border-brand-cream/15 rounded-lg px-3 py-1.5 focus:border-brand-gold focus:outline-none text-[11px] placeholder:text-brand-cream-subtle/30 font-mono"
                          />
                          <label className="flex items-center justify-center border border-dashed border-brand-cream/20 hover:border-brand-gold/45 bg-brand-bg rounded-lg py-1.5 px-3 cursor-pointer text-[11px] text-brand-cream-subtle hover:text-brand-cream transition-all h-[30px]">
                            <span className="font-mono text-[9px] tracking-wide uppercase">Or Upload File</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onloadend = () => {
                                    if (typeof reader.result === "string") {
                                      setNewVehicleForm(prev => ({ ...prev, image: reader.result as string }));
                                    }
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          </label>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 pt-1.5 uppercase-none">
                        <input
                          type="checkbox"
                          id="new-avail"
                          checked={newVehicleForm.isAvailable}
                          onChange={(e) => setNewVehicleForm({ ...newVehicleForm, isAvailable: e.target.checked })}
                          className="w-4 h-4 text-brand-gold accent-brand-gold bg-brand-bg border-brand-cream/20 rounded focus:ring-0 cursor-pointer"
                        />
                        <label htmlFor="new-avail" className="text-xs font-mono text-brand-cream cursor-pointer font-medium selection:bg-transparent">
                          Mark as Immediately Available (active for leads)
                        </label>
                      </div>
                    </div>

                    {/* Stats and Inclusions fields */}
                    <div className="space-y-6">
                      <div className="space-y-4 p-5 bg-brand-secondary/30 rounded-2xl border border-brand-cream/5">
                        <span className="text-[10px] font-mono tracking-widest uppercase text-brand-gold block font-bold">
                          Performance Stats / Configuration Matrix
                        </span>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <span className="text-[9px] font-mono uppercase text-brand-cream-dim block">Stat 1 Label</span>
                            <input
                              type="text"
                              value={newVehicleForm.stat1Label}
                              onChange={(e) => setNewVehicleForm({ ...newVehicleForm, stat1Label: e.target.value })}
                              className="w-full bg-brand-bg text-brand-cream border border-brand-cream/10 rounded-md px-2 py-1.5 text-xs focus:border-brand-gold font-mono"
                            />
                          </div>
                          <div className="space-y-1">
                            <span className="text-[9px] font-mono uppercase text-brand-cream-dim block">Stat 1 Value</span>
                            <input
                              type="text"
                              value={newVehicleForm.stat1Value}
                              onChange={(e) => setNewVehicleForm({ ...newVehicleForm, stat1Value: e.target.value })}
                              className="w-full bg-brand-bg text-brand-cream border border-brand-cream/10 rounded-md px-2 py-1.5 text-xs focus:border-brand-gold font-mono"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <span className="text-[9px] font-mono uppercase text-brand-cream-dim block">Stat 2 Label</span>
                            <input
                              type="text"
                              value={newVehicleForm.stat2Label}
                              onChange={(e) => setNewVehicleForm({ ...newVehicleForm, stat2Label: e.target.value })}
                              className="w-full bg-brand-bg text-brand-cream border border-brand-cream/10 rounded-md px-2 py-1.5 text-xs focus:border-brand-gold font-mono"
                            />
                          </div>
                          <div className="space-y-1">
                            <span className="text-[9px] font-mono uppercase text-brand-cream-dim block">Stat 2 Value</span>
                            <input
                              type="text"
                              value={newVehicleForm.stat2Value}
                              onChange={(e) => setNewVehicleForm({ ...newVehicleForm, stat2Value: e.target.value })}
                              className="w-full bg-brand-bg text-brand-cream border border-brand-cream/10 rounded-md px-2 py-1.5 text-xs focus:border-brand-gold font-mono"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <span className="text-[9px] font-mono uppercase text-brand-cream-dim block">Stat 3 Label</span>
                            <input
                              type="text"
                              value={newVehicleForm.stat3Label}
                              onChange={(e) => setNewVehicleForm({ ...newVehicleForm, stat3Label: e.target.value })}
                              className="w-full bg-brand-bg text-brand-cream border border-brand-cream/10 rounded-md px-2 py-1.5 text-xs focus:border-brand-gold font-mono"
                            />
                          </div>
                          <div className="space-y-1">
                            <span className="text-[9px] font-mono uppercase text-brand-cream-dim block">Stat 3 Value</span>
                            <input
                              type="text"
                              value={newVehicleForm.stat3Value}
                              onChange={(e) => setNewVehicleForm({ ...newVehicleForm, stat3Value: e.target.value })}
                              className="w-full bg-brand-bg text-brand-cream border border-brand-cream/10 rounded-md px-2 py-1.5 text-xs focus:border-brand-gold font-mono"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <span className="text-[9px] font-mono uppercase text-brand-cream-dim block">Stat 4 Label</span>
                            <input
                              type="text"
                              value={newVehicleForm.stat4Label}
                              onChange={(e) => setNewVehicleForm({ ...newVehicleForm, stat4Label: e.target.value })}
                              className="w-full bg-brand-bg text-brand-cream border border-brand-cream/10 rounded-md px-2 py-1.5 text-xs focus:border-brand-gold font-mono"
                            />
                          </div>
                          <div className="space-y-1">
                            <span className="text-[9px] font-mono uppercase text-brand-cream-dim block">Stat 4 Value</span>
                            <input
                              type="text"
                              value={newVehicleForm.stat4Value}
                              onChange={(e) => setNewVehicleForm({ ...newVehicleForm, stat4Value: e.target.value })}
                              className="w-full bg-brand-bg text-brand-cream border border-brand-cream/10 rounded-md px-2 py-1.5 text-xs focus:border-brand-gold font-mono"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1.5 font-sans">
                        <label className="text-[10px] font-mono tracking-widest uppercase text-brand-gold block font-bold">
                          Included Benefits & Inclusions (One per line)
                        </label>
                        <textarea
                          placeholder="Fully registered commercial rideshare compliance..."
                          value={newVehicleForm.inclusionsText}
                          rows={4}
                          onChange={(e) => setNewVehicleForm({ ...newVehicleForm, inclusionsText: e.target.value })}
                          className="w-full bg-brand-bg text-brand-cream border border-brand-cream/15 rounded-xl px-4 py-3 text-xs focus:border-brand-gold focus:outline-none transition-all placeholder:text-brand-cream-subtle/30 font-mono leading-relaxed"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-brand-cream/5 font-sans">
                    <button
                      type="button"
                      onClick={() => setShowAddListing(false)}
                      className="px-5 py-3 border border-brand-cream/15 text-brand-cream hover:bg-brand-secondary/40 font-mono text-xs tracking-wider uppercase rounded-xl transition-all cursor-pointer font-bold"
                    >
                      Discard
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-brand-gold text-brand-bg hover:bg-brand-gold-light font-sans text-xs font-bold tracking-widest uppercase rounded-xl transition-all shadow-lg shadow-brand-gold/10 flex items-center gap-2 cursor-pointer font-bold"
                    >
                      <Plus size={14} /> Launch Listing Class
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="h-64 rounded-2xl bg-brand-card/20 border border-brand-cream/5 animate-pulse" />
              ))
            ) : vehicles.length === 0 ? (
              <div className="col-span-1 lg:col-span-2 text-center p-12 bg-brand-card/30 border border-brand-cream/5 rounded-2xl">
                <AlertCircle className="mx-auto text-brand-gold mb-3" />
                <p className="text-sm font-mono text-brand-cream-dim">No vehicle classes found initialized.</p>
              </div>
            ) : (
              vehicles.map((v) => {
                const isEditing = editingVehicleId === v.id;
                return (
                  <div 
                    key={v.id} 
                    className={`p-6 sm:p-8 bg-brand-card/60 backdrop-blur-md rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                      isEditing ? "border-brand-gold border-dashed bg-brand-muted/20" : "border-brand-cream/5 hover:border-brand-gold/25"
                    }`}
                  >
                    <div>
                      {/* Top ribbon info */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-mono text-[10px] uppercase text-brand-cream-subtle font-bold">
                          ID ID: <strong className="font-serif italic font-normal text-brand-cream">{v.id}</strong>
                        </span>
                        
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-wider font-bold ${
                            v.isAvailable ? "bg-emerald-950/60 text-emerald-400 border border-emerald-800/20" : "bg-brand-muted text-brand-cream-dim"
                          }`}>
                            {v.badge}
                          </span>
                        </div>
                      </div>

                      {/* Editing Forms */}
                      {isEditing ? (
                        <div className="space-y-4 pt-1 mb-6">
                          <div className="space-y-1">
                            <label className="text-[10px] font-mono tracking-wider uppercase text-brand-gold">
                              Class Title
                            </label>
                            <input
                              type="text"
                              value={editForm.title}
                              onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                              className="w-full bg-brand-bg text-brand-cream border border-brand-cream/15 rounded-md px-3 py-2 focus:border-brand-gold focus:outline-none text-sm font-semibold"
                            />
                          </div>

                          {/* Image upload / URL inputs */}
                          <div className="space-y-2 p-3 bg-brand-secondary/40 rounded-lg border border-brand-cream/5">
                            <label className="text-[10px] font-mono tracking-wider uppercase text-brand-gold block">
                              Vehicle Photo Card Image
                            </label>
                            
                            {editForm.image && (
                              <div className="w-full aspect-[21/9] rounded-lg overflow-hidden border border-brand-cream/15 relative bg-brand-secondary/80 mb-2">
                                <img
                                  src={editForm.image}
                                  alt="Preview"
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover"
                                />
                                <button
                                  type="button"
                                  onClick={() => setEditForm(prev => ({ ...prev, image: "" }))}
                                  className="absolute top-2 right-2 p-1.5 bg-brand-bg/85 hover:bg-red-600 hover:text-white rounded-full text-xs text-brand-cream transition-colors border border-brand-cream/10 flex items-center justify-center cursor-pointer"
                                  title="Remove Image"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {/* Option A: Image URL */}
                              <div className="space-y-1">
                                <span className="text-[9px] font-mono tracking-wider uppercase text-brand-cream-dim block">
                                  Option 1: Paste URL
                                </span>
                                <input
                                  type="text"
                                  placeholder="https://images.unsplash.com/..."
                                  value={editForm.image}
                                  onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                                  className="w-full bg-brand-bg text-brand-cream border border-brand-cream/15 rounded-md px-3 py-1.5 focus:border-brand-gold focus:outline-none text-[11px] placeholder:text-brand-cream-subtle/30"
                                />
                              </div>

                              {/* Option B: Local File Input */}
                              <div className="space-y-1">
                                <span className="text-[9px] font-mono tracking-wider uppercase text-brand-cream-dim block">
                                  Option 2: Select File
                                </span>
                                <label className="flex items-center justify-center border border-dashed border-brand-cream/20 hover:border-brand-gold/45 bg-brand-bg rounded-md py-1.5 px-3 cursor-pointer text-[11px] text-brand-cream-subtle hover:text-brand-cream transition-all h-[30px]">
                                  <span className="font-mono text-[9px] tracking-wide uppercase">Browser Files</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                          if (typeof reader.result === "string") {
                                            setEditForm(prev => ({ ...prev, image: reader.result as string }));
                                          }
                                        };
                                        reader.readAsDataURL(file);
                                      }
                                    }}
                                  />
                                </label>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-[10px] font-mono tracking-wider uppercase text-brand-gold">
                                Weekly Price ($)
                              </label>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-brand-cream-subtle font-mono">$</span>
                                <input
                                  type="number"
                                  value={editForm.pricingNum}
                                  onChange={(e) => setEditForm({ ...editForm, pricingNum: parseInt(e.target.value) || 0 })}
                                  className="w-full bg-brand-bg text-brand-cream border border-brand-cream/15 rounded-md pl-6 pr-3 py-2 focus:border-brand-gold focus:outline-none text-sm font-mono"
                                />
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] font-mono tracking-wider uppercase text-brand-gold">
                                Badge / Status
                              </label>
                              <select
                                value={editForm.badge}
                                onChange={(e) => setEditForm({ ...editForm, badge: e.target.value as any })}
                                className="w-full bg-brand-bg text-brand-cream border border-brand-cream/15 rounded-md px-3 py-2 focus:border-brand-gold focus:outline-none text-sm font-sans"
                              >
                                <option value="Available now">Available now</option>
                                <option value="Coming soon">Coming soon</option>
                                <option value="Waitlist">Waitlist</option>
                              </select>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-mono tracking-wider uppercase text-brand-gold">
                              Description Card Text
                            </label>
                            <textarea
                              value={editForm.description}
                              rows={3}
                              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                              className="w-full bg-brand-bg text-brand-cream border border-brand-cream/15 rounded-md px-3 py-2 focus:border-brand-gold focus:outline-none text-xs text-brand-cream-dim"
                            />
                          </div>

                          <div className="flex items-center gap-2 pt-2">
                            <input
                              type="checkbox"
                              id={`avail-${v.id}`}
                              checked={editForm.isAvailable}
                              onChange={(e) => setEditForm({ ...editForm, isAvailable: e.target.checked })}
                              className="w-4 h-4 text-brand-gold accent-brand-gold bg-brand-bg border-brand-cream/20 rounded focus:ring-0"
                            />
                            <label htmlFor={`avail-${v.id}`} className="text-xs font-mono text-brand-cream cursor-pointer">
                              Mark as Immediately Available (isAvailable)
                            </label>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3 mb-6">
                          {/* Active Thumbnail Preview */}
                          {v.image ? (
                            <div className="w-full aspect-[21/9] rounded-lg overflow-hidden border border-brand-cream/5 relative bg-brand-secondary/80">
                              <img
                                src={v.image}
                                alt={v.title}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover filter brightness-[0.8] contrast-[1.05]"
                              />
                            </div>
                          ) : (
                            <div className="w-full aspect-[21/9] rounded-lg border border-dashed border-brand-cream/10 flex items-center justify-center bg-brand-secondary/40">
                              <span className="text-[10px] font-mono text-brand-cream-subtle/50 uppercase">No active photo</span>
                            </div>
                          )}

                          <h3 className="text-xl font-serif text-brand-cream font-medium">
                            {v.title}
                          </h3>
                          <p className="text-xs text-brand-cream-dim leading-relaxed font-light">
                            {v.description}
                          </p>

                          {/* Stats parameters summary pill */}
                          <div className="flex gap-2.5 flex-wrap pt-1.5 pb-2">
                            {v.stats.map((st, sIdx) => (
                              <span key={sIdx} className="font-mono text-[9px] bg-brand-bg px-2.5 py-1 rounded border border-brand-cream/5 text-[#B6B2AB]">
                                {st.label}: <strong className="text-brand-gold font-normal">{st.value}</strong>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Bottom CTA Block */}
                    <div className="flex items-center justify-between border-t border-brand-cream/5 pt-4">
                      <div>
                        <span className="text-[9px] font-mono uppercase text-brand-cream-dim tracking-wider block">
                          Current Price Matrix
                        </span>
                        <span className="font-mono text-lg text-brand-gold font-bold">
                          {isEditing ? `$${editForm.pricingNum} / week` : v.price}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {isEditing ? (
                          <>
                            {/* Real-time feedback indicators */}
                            <div className="flex items-center gap-1.5 mr-2">
                              {savingStatus === "saving" && (
                                <span className="flex items-center gap-1 text-[10px] text-brand-gold font-mono uppercase tracking-wide">
                                  <RefreshCw size={10} className="animate-spin text-brand-gold" />
                                  Auto-saving...
                                </span>
                              )}
                              {savingStatus === "saved" && (
                                <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono uppercase tracking-wide">
                                  <Check size={10} className="text-emerald-400" />
                                  Changes saved
                                </span>
                              )}
                              {savingStatus === "error" && (
                                <span className="flex items-center gap-1 text-[10px] text-red-400 font-mono uppercase tracking-wide flex-wrap">
                                  <AlertCircle size={10} className="text-red-400" />
                                  Save error
                                </span>
                              )}
                              {savingStatus === "idle" && (
                                <span className="text-[10px] text-brand-cream-subtle/50 font-mono uppercase tracking-wide">
                                  Synced to Database
                                </span>
                              )}
                            </div>

                            <button
                              onClick={async () => {
                                // If they click Done while it is still auto-saving, trigger an immediate final save to ensure absolute consistency
                                const originalVehicle = vehicles.find(veh => veh.id === v.id);
                                if (originalVehicle) {
                                  const parsedOriginalPriceStr = originalVehicle.price.replace(/[^0-9]/g, "");
                                  const parsedOriginalPrice = parseInt(parsedOriginalPriceStr) || 150;
                                  const hasChanges = 
                                    originalVehicle.title !== editForm.title ||
                                    originalVehicle.description !== editForm.description ||
                                    originalVehicle.image !== editForm.image ||
                                    originalVehicle.badge !== editForm.badge ||
                                    originalVehicle.isAvailable !== editForm.isAvailable ||
                                    parsedOriginalPrice !== editForm.pricingNum;
                                  
                                  if (hasChanges) {
                                    await handleSaveVehicle(v.id);
                                    return;
                                  }
                                }
                                setEditingVehicleId(null);
                              }}
                              className="px-4 py-1.5 bg-brand-cream text-brand-bg font-sans font-bold hover:bg-brand-cream-subtle rounded-md text-xs transition-colors cursor-pointer uppercase tracking-wider"
                            >
                              Done
                            </button>
                          </>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleDeleteVehicle(v.id, v.title)}
                              className="p-2 border border-red-500/15 text-red-400 hover:text-white hover:bg-red-600 rounded-lg transition-all duration-200 cursor-pointer"
                              title="Delete Listing"
                            >
                              <Trash2 size={13} />
                            </button>
                            <button
                              onClick={() => startEditVehicle(v)}
                              className="px-4 py-1.5 border border-brand-gold/30 text-brand-gold hover:bg-brand-gold hover:text-brand-bg hover:border-brand-gold rounded-full text-xs font-mono tracking-wider uppercase transition-all duration-200 cursor-pointer"
                            >
                              Edit Pricing & Info
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* leads Review Area (Driver Applications) */}
        <div className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-serif text-brand-cream">
              Recent Driver <span className="text-brand-gold italic">Inquiries & Leads</span>
            </h2>
            <p className="text-xs text-brand-cream-dim font-light">
              Complete metadata log for drive-to-own screening applications submitted via the ServUfast reservation engine.
            </p>
          </div>

          <div className="space-y-6">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="h-44 rounded-2xl bg-brand-card/25 border border-brand-cream/5 animate-pulse" />
              ))
            ) : leads.length === 0 ? (
              <div className="col-span-1 text-center p-16 bg-brand-card/40 border border-brand-cream/5 rounded-2xl">
                <FileText className="mx-auto text-brand-gold/50 mb-3" size={32} />
                <p className="text-sm font-mono text-brand-cream-dim">No driver bookings submitted yet.</p>
                <p className="text-xs text-brand-cream-subtle mt-1">Submit the enrollment form on the home screen to test this telemetry ledger.</p>
              </div>
            ) : (
              leads.map((l) => {
                const formattedDate = l.createdAt ? new Date(l.createdAt).toLocaleDateString(undefined, {
                  month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
                }) : "Unknown Date";

                // Generate a generic nice avatar letter
                const driverInitials = l.name ? l.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) : "D";

                return (
                  <motion.div 
                    key={l.id} 
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="p-6 bg-brand-card/80 border border-brand-cream/5 rounded-[20px] transition-all duration-300 hover:border-brand-gold/25 relative group overflow-hidden"
                  >
                    {/* Top strip */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-brand-cream/5 gap-4">
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-full bg-brand-secondary border border-brand-gold/20 flex items-center justify-center text-brand-gold font-serif font-bold text-base shadow-sm">
                          {driverInitials}
                        </div>
                        <div>
                          <h3 className="font-serif text-lg text-brand-cream flex items-center gap-2">
                            {l.name}
                            {l.age && <span className="font-mono text-xs text-brand-gold bg-brand-gold/15 px-2 py-0.5 rounded-full font-bold">AGE: {l.age}</span>}
                          </h3>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-brand-cream-dim font-light mt-0.5">
                            <span className="flex items-center gap-1"><MapPin size={11} className="text-brand-gold" /> {l.city || "San Francisco"}</span>
                            <span className="text-brand-cream-subtle/40">•</span>
                            <span className="flex items-center gap-1 font-mono text-[10px]"><Clock size={11} className="text-brand-gold" /> Registered: {formattedDate}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {l.isActiveGigDriver === "Yes" ? (
                          <span className="px-2.5 py-1 bg-emerald-990/60 text-emerald-400 border border-emerald-800/30 text-[9px] font-mono font-bold tracking-wider uppercase rounded-full">
                            Active Gig Driver
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 bg-brand-secondary text-brand-cream-dim border border-brand-cream/10 text-[9px] font-mono tracking-wider uppercase rounded-full">
                            Not Active Yet
                          </span>
                        )}

                        <span className="px-2.5 py-1 bg-brand-gold/15 text-brand-gold border border-brand-gold/20 text-[9px] font-mono tracking-wider uppercase rounded-full font-bold">
                          {l.service || "Hatchback Pro Series"}
                        </span>
                      </div>
                    </div>

                    {/* Driver details grid */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 py-6 border-b border-brand-cream/5 text-sm">
                      
                      {/* Left: Contact Info */}
                      <div className="md:col-span-4 space-y-2">
                        <span className="font-mono text-[9px] uppercase tracking-widest text-[#B6B2AB] font-bold block mb-1">
                          Applicant Communication
                        </span>
                        
                        <div className="flex items-center gap-2.5 text-xs">
                          <Phone size={12} className="text-brand-gold" />
                          <a href={`tel:${l.phone}`} className="font-mono hover:text-brand-gold text-brand-cream transition-colors">
                            {l.phone || "No phone supplied"}
                          </a>
                        </div>

                        <div className="flex items-center gap-2.5 text-xs">
                          <Mail size={12} className="text-brand-gold" />
                          <a href={`mailto:${l.email}`} className="hover:text-brand-gold text-brand-cream transition-colors">
                            {l.email || "No email supplied"}
                          </a>
                        </div>
                      </div>

                      {/* Middle: Appointment dispatch details */}
                      <div className="md:col-span-4 space-y-2">
                        <span className="font-mono text-[9px] uppercase tracking-widest text-[#B6B2AB] font-bold block mb-1">
                          Pickup Appointment
                        </span>
                        
                        <div className="flex items-center gap-2.5 text-xs text-brand-cream">
                          <Calendar size={12} className="text-brand-gold" />
                          <span>{l.date ? new Date(l.date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : "Today Class"}</span>
                        </div>

                        <div className="flex items-center gap-2.5 text-xs text-brand-cream">
                          <Clock size={12} className="text-brand-gold" />
                          <span className="font-mono">Reservation Hour: {l.time || "10:00 AM"}</span>
                        </div>
                      </div>

                      {/* Right: Platforms list & uploads */}
                      <div className="md:col-span-4 space-y-2">
                        <span className="font-mono text-[9px] uppercase tracking-widest text-[#B6B2AB] font-bold block mb-1">
                          Documents & Platforms
                        </span>
                        
                        <div className="text-xs text-brand-cream flex flex-wrap gap-1.5 items-center">
                          <span className="text-brand-cream-dim text-[11px] font-light">Platforms:</span>
                          {l.selectedPlatforms || l.platforms?.join(", ") ? (
                            <span className="font-mono font-bold text-brand-gold text-[10px]">{l.selectedPlatforms || l.platforms?.join(", ")}</span>
                          ) : (
                            <span className="font-mono italic text-[10px] text-brand-cream-subtle">None selected</span>
                          )}
                        </div>

                        {/* Attachments indicators */}
                        <div className="space-y-1.5 pt-0.5">
                          {l.licenseFileName && (
                            <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400">
                              <Paperclip size={10} />
                              <span>License: {l.licenseFileName}</span>
                            </div>
                          )}
                          {l.tripScreenshotName && (
                            <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400">
                              <Paperclip size={10} />
                              <span>Trips History: {l.tripScreenshotName}</span>
                            </div>
                          )}
                        </div>
                      </div>

                    </div>

                    {/* Bottom comments row + lead controls */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 gap-4">
                      <div className="text-xs italic font-serif text-brand-cream-dim font-light">
                        {l.message ? (
                          <span>Message: "{l.message}"</span>
                        ) : (
                          <span className="text-brand-cream-subtle/50 font-sans text-[11px] not-italic">No additional message or notes provided.</span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 w-full sm:w-auto shrink-0 justify-end">
                        <button
                          onClick={() => {
                            showToast(`Driver dispatch approval simulated for ${l.name}.`, "success");
                          }}
                          className="px-4 py-2 bg-brand-gold/10 border border-brand-gold/25 text-brand-gold hover:bg-brand-gold hover:text-brand-bg transition-all duration-200 text-xs font-mono tracking-wider uppercase rounded-full"
                        >
                          Approve Driver
                        </button>
                        <button
                          onClick={() => handleDeleteLead(l.id)}
                          title="Permanently Drop Lead"
                          className="p-2.5 bg-red-950/20 text-red-400 border border-red-500/10 hover:border-red-500 hover:bg-red-500/10 rounded-full transition-all duration-200"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                  </motion.div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
