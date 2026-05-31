import React, { useState, useEffect, useRef } from "react";
import { Mail, Phone, MapPin, Clock, CreditCard, CheckCircle, ArrowRight, Camera, Calendar } from "lucide-react";
import { LeadForm } from "../types";

export default function ApplyForm() {
  const [form, setForm] = useState<LeadForm & {
    age: string;
    returnDate: string;
    isActiveGigDriver: "Yes" | "Not Yet";
    platforms: string[];
    termsAccepted2: boolean;
    termsAccepted3: boolean;
  }>({
    name: "",
    phone: "",
    email: "",
    city: "San Francisco",
    service: "Hatchback Pro Series",
    date: "",
    time: "",
    newCustomer: "Yes",
    message: "",
    termsAccepted: false, // Map to payment consent
    age: "",
    returnDate: "",
    isActiveGigDriver: "Yes",
    platforms: [],
    termsAccepted2: false, // Map to verify identity consent
    termsAccepted3: false, // Map to weekly tips consent
  });

  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [tripScreenshot, setTripScreenshot] = useState<File | null>(null);

  const licenseInputRef = useRef<HTMLInputElement>(null);
  const tripInputRef = useRef<HTMLInputElement>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [calendarDays] = useState(() => {
    const days = [];
    const weekdays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    for (let i = 1; i <= 8; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      days.push({
        formattedValue: d.toISOString().split('T')[0], // YYYY-MM-DD
        dayName: weekdays[d.getDay()],
        dayNum: d.getDate(),
        month: months[d.getMonth()]
      });
    }
    return days;
  });

  const availableTimeSlots = [
    "09:00 AM", "11:30 AM", "02:00 PM", "04:30 PM", "07:00 PM"
  ];

  useEffect(() => {
    if (calendarDays.length > 0 && !form.date) {
      const firstDate = calendarDays[0].formattedValue;
      const retDate = new Date();
      retDate.setDate(retDate.getDate() + 8);
      const firstReturnDate = retDate.toISOString().split('T')[0];
      
      setForm(prev => ({
        ...prev,
        date: firstDate,
        time: "11:30 AM",
        returnDate: firstReturnDate
      }));
    }
  }, [calendarDays]);

  useEffect(() => {
    const handleSelectVehicle = (e: Event) => {
      const customEvent = e as CustomEvent<{ service: string }>;
      if (customEvent.detail && customEvent.detail.service) {
        setForm((prev) => ({ ...prev, service: customEvent.detail.service }));
      }
    };
    window.addEventListener("select-vehicle", handleSelectVehicle);
    return () => {
      window.removeEventListener("select-vehicle", handleSelectVehicle);
    };
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleTogglePlatform = (platform: string) => {
    setForm((prev) => {
      const isSelected = prev.platforms.includes(platform);
      return {
        ...prev,
        platforms: isSelected
          ? prev.platforms.filter((p) => p !== platform)
          : [...prev.platforms, platform],
      };
    });
  };

  const handleToggleGigDriver = (status: "Yes" | "Not Yet") => {
    setForm((prev) => ({ ...prev, isActiveGigDriver: status }));
  };

  const handleUploadLicense = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLicenseFile(e.target.files[0]);
    }
  };

  const handleUploadTrip = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setTripScreenshot(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    // Validate inputs
    if (!form.name || !form.phone) {
      setErrorMessage("Please complete all required fields (Full Name and Phone Number).");
      return;
    }

    if (!form.termsAccepted || !form.termsAccepted2) {
      setErrorMessage("You must accept the payment term and file review authorization to submit.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          // Include extra metadata for server-side registration logs
          licenseFileName: licenseFile ? licenseFile.name : null,
          tripScreenshotName: tripScreenshot ? tripScreenshot.name : null,
          selectedPlatforms: form.platforms.join(", "),
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitSuccess(true);
      } else {
        setErrorMessage(data.error || "An unexpected error occurred. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Network connection failed. Please ensure the server is active and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const availablePlatforms = [
    "DOORDASH", "UBER EATS", "INSTACART", "LYFT", "UBER", "AMAZON FLEX", "SPARK", "GRUBHUB"
  ];

  return (
    <section id="apply" className="py-12 sm:py-24 bg-brand-secondary border-t border-brand-muted/30">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Main Grid: Info Left, Form Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Block: Contact Details */}
          <div className="lg:col-span-4 space-y-10">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-brand-gold font-semibold">
                Vetted Fleet Booking
              </span>
              <h2 className="text-3xl md:text-5xl text-brand-cream mt-2 leading-tight">
                Secure your ride <em className="text-brand-cream-dim font-serif italic font-normal">your way</em> today.
              </h2>
              <p className="text-brand-cream-dim font-light text-base mt-2 leading-relaxed">
                Complete our secure application form. Our metropolitan agency gets in touch inside 2 hours 
                to verify your credentials, finalize the weekly lease structure, and schedule your same-day vehicle pickup.
              </p>
            </div>

            {/* Quick Specs Block */}
            <div className="space-y-6 pt-2">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-brand-secondary text-brand-gold border border-brand-cream/5">
                  <Phone size={18} />
                </div>
                <div>
                  <h4 className="font-mono text-[10px] uppercase tracking-widest text-brand-cream-subtle font-semibold">
                    Support Hotline & SMS
                  </h4>
                  <a href="tel:+18656969885" className="text-brand-cream font-mono text-sm hover:text-brand-gold transition-colors">
                    +1 (865) 696-9885
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-brand-secondary text-brand-gold border border-brand-cream/5">
                  <MapPin size={18} />
                </div>
                <div>
                  <h4 className="font-mono text-[10px] uppercase tracking-widest text-brand-cream-subtle font-semibold">
                    Metropolitan Dispatch Hubs
                  </h4>
                  <p className="text-brand-cream text-sm font-light leading-relaxed">
                    San Francisco · Los Angeles · Seattle · Chicago · Boston
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-brand-secondary text-brand-gold border border-brand-cream/5">
                  <Clock size={18} />
                </div>
                <div>
                  <h4 className="font-mono text-[10px] uppercase tracking-widest text-brand-cream-subtle font-semibold">
                    Depot Operating Hours
                  </h4>
                  <p className="text-brand-cream text-sm font-light">
                    24 Hours / 7 Days On-Demand Dispatch Support
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-brand-secondary text-brand-gold border border-brand-cream/5">
                  <CreditCard size={18} />
                </div>
                <div>
                  <h4 className="font-mono text-[10px] uppercase tracking-widest text-brand-cream-subtle font-semibold">
                    Flexible Billing & Escrow Tiers
                  </h4>
                  <p className="text-brand-cream text-sm font-light">
                    Immediate driver verification, Cash/Zelle due at pickup, with standard 100% refundable deposits
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Block: Pure High-Fidelity Form design exactly like image */}
          <div className="lg:col-span-8 bg-brand-card border border-brand-cream-subtle/10 p-8 sm:p-12 rounded-[24px] shadow-sm relative text-brand-cream">
            
            {submitSuccess ? (
              <div className="py-12 px-6 text-center space-y-6 flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-brand-gold/10 border border-brand-gold text-brand-gold flex items-center justify-center mb-2">
                  <CheckCircle size={36} />
                </div>
                <h3 className="font-serif text-3xl text-brand-cream italic">Application Received</h3>
                <p className="text-brand-cream-dim text-sm sm:text-base font-light max-w-sm leading-relaxed">
                  Thank you for submitting, <span className="font-semibold text-brand-gold">{form.name}</span>. 
                  Our metropolitan coordinator will contact you at <span className="font-mono text-brand-gold font-medium">{form.phone}</span> within 2 hours to confirm your vehicle selection (<span className="text-brand-gold font-medium">{form.service}</span>).
                </p>
                <button
                  onClick={() => {
                    setSubmitSuccess(false);
                    setForm({
                      name: "",
                      phone: "",
                      email: "",
                      city: "San Francisco",
                      service: "Hatchback Pro Series",
                      date: "",
                      time: "",
                      newCustomer: "Yes",
                      message: "",
                      termsAccepted: false,
                      age: "",
                      returnDate: "",
                      isActiveGigDriver: "Yes",
                      platforms: [],
                      termsAccepted2: false,
                      termsAccepted3: false,
                    });
                    setLicenseFile(null);
                    setTripScreenshot(null);
                  }}
                  className="px-6 py-3 bg-brand-gold text-brand-bg hover:bg-brand-gold-light transition-colors text-xs font-mono tracking-wider uppercase rounded-full font-bold"
                >
                  Apply for Another Vehicle
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* Error Banner if any */}
                {errorMessage && (
                  <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg font-mono">
                    {errorMessage}
                  </div>
                )}

                {/* Selected vehicle class choice visual matching the style tags */}
                <div className="border-b border-brand-cream/5 pb-6">
                  <span className="text-[11px] font-semibold text-brand-cream-subtle uppercase tracking-widest block mb-3">
                    Selected Fleet Class
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { key: "Hatchback Pro Series", label: "Hatchback ($150)" },
                      { key: "Premium Sedan Range", label: "Premium Sedan ($200)" },
                      { key: "Electric Zero-Emission EV Fleet", label: "Zero-Emission EV ($220)" },
                      { key: "Luxury Executive Series", label: "Luxury SUV ($290)" }
                    ].map((item) => (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, service: item.key }))}
                        className={`px-3.5 py-1.5 border rounded-full text-[11px] font-medium tracking-wide uppercase transition-all duration-200 cursor-pointer ${
                          form.service === item.key
                            ? "bg-[#1F3A2D] border-[#1F3A2D] text-white shadow-xs dark:bg-brand-gold dark:border-brand-gold dark:text-brand-bg"
                            : "bg-brand-secondary border-brand-cream-subtle/20 text-brand-cream-dim hover:bg-brand-bg"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Text input grid matching full name, age, phone, email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-7">
                  {/* Full Name */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-brand-cream-subtle uppercase tracking-widest block">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="First & Last"
                      required
                      className="w-full bg-transparent text-brand-cream border-b border-brand-cream/15 focus:border-brand-gold py-2 px-0 focus:outline-none transition-all duration-200 text-base font-serif italic placeholder-brand-cream-subtle/40 placeholder:italic placeholder:font-serif"
                    />
                  </div>

                  {/* Age */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-brand-cream-subtle uppercase tracking-widest block">
                      Age
                    </label>
                    <input
                      type="text"
                      name="age"
                      value={form.age}
                      onChange={handleChange}
                      placeholder="25 or older"
                      className="w-full bg-transparent text-brand-cream border-b border-brand-cream/15 focus:border-brand-gold py-2 px-0 focus:outline-none transition-all duration-200 text-base font-serif italic placeholder-brand-cream-subtle/40 placeholder:italic placeholder:font-serif"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-brand-cream-subtle uppercase tracking-widest block">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="(___) ___-____"
                      required
                      className="w-full bg-transparent text-brand-cream border-b border-brand-cream/15 focus:border-brand-gold py-2 px-0 focus:outline-none transition-all duration-200 text-base font-serif italic placeholder-brand-cream-subtle/40 placeholder:italic placeholder:font-serif"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-brand-cream-subtle uppercase tracking-widest block">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@email.com"
                      className="w-full bg-transparent text-brand-cream border-b border-brand-cream/15 focus:border-brand-gold py-2 px-0 focus:outline-none transition-all duration-200 text-base font-serif italic placeholder-brand-cream-subtle/40 placeholder:italic placeholder:font-serif"
                    />
                  </div>
                </div>

                {/* Metro depot region selector matching the design flow */}
                <div className="space-y-1.5 max-w-sm">
                  <label className="text-[11px] font-semibold text-brand-cream-subtle uppercase tracking-widest block">
                    Metro Pickup Area
                  </label>
                  <select
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    className="w-full bg-transparent text-brand-cream border-b border-brand-cream/15 focus:border-brand-gold py-2 px-0 focus:outline-none transition-all duration-200 text-sm font-sans cursor-pointer"
                  >
                    <option value="San Francisco">San Francisco Metros</option>
                    <option value="Los Angeles">Los Angeles Region</option>
                    <option value="Seattle">Seattle Central</option>
                    <option value="Chicago">Chicago Area</option>
                    <option value="Boston">Boston Region</option>
                  </select>
                </div>

                {/* Visual Real-Time Booking Engine Block */}
                <div className="bg-brand-secondary/80 border border-brand-cream/5 rounded-[20px] p-6 space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-brand-gold font-bold block mb-1">
                        SECURE IMMUTABLE DISPATCH SLOTS
                      </span>
                      <h4 className="font-serif text-lg text-brand-cream italic">
                        Select Pickup Appointment
                      </h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="live-indicator" />
                      <span className="font-mono text-[9px] uppercase tracking-wider text-brand-gold font-bold">
                        12 SLOTS OPEN TODAY
                      </span>
                    </div>
                  </div>

                  {/* Day Picker */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#827266] font-medium block">
                      Choose Available Date:
                    </span>
                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                      {calendarDays.map((day) => {
                        const isSelected = form.date === day.formattedValue;
                        return (
                          <button
                            key={day.formattedValue}
                            type="button"
                            onClick={() => {
                              const ret = new Date(day.formattedValue);
                              ret.setDate(ret.getDate() + 7);
                              const retStr = ret.toISOString().split('T')[0];
                              setForm(prev => ({
                                ...prev,
                                date: day.formattedValue,
                                returnDate: retStr
                              }));
                            }}
                            className={`flex flex-col items-center justify-center p-3 rounded-[12px] border transition-all duration-200 cursor-pointer ${
                              isSelected
                                ? "bg-[#1F3A2D] border-[#1F3A2D] text-white shadow-md dark:bg-brand-gold dark:border-brand-gold dark:text-brand-bg"
                                : "bg-[#FAF8F5] border-brand-cream-subtle/10 text-brand-cream-dim hover:border-brand-gold/50 dark:bg-brand-secondary"
                            }`}
                          >
                            <span className="text-[8px] font-mono uppercase tracking-wider block opacity-70">
                              {day.month}
                            </span>
                            <span className="text-sm font-sans font-bold block my-0.5">
                              {day.dayNum}
                            </span>
                            <span className="text-[8px] font-mono uppercase tracking-wider block opacity-70">
                              {day.dayName}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Time Matrix */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#827266] font-medium block">
                      Choose Appointment Hour:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {availableTimeSlots.map((slot) => {
                        const isSelected = form.time === slot;
                        return (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setForm(prev => ({ ...prev, time: slot }))}
                            className={`px-4 py-2 border rounded-full text-[11px] font-mono tracking-wider transition-all duration-200 cursor-pointer ${
                              isSelected
                                ? "bg-[#1F3A2D] border-[#1F3A2D] text-white font-bold shadow-xs dark:bg-brand-gold dark:border-brand-gold dark:text-brand-bg"
                                : "bg-[#FAF8F5] border-brand-cream-subtle/10 text-brand-cream-dim hover:border-brand-gold/50 dark:bg-brand-secondary"
                            }`}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Return Date selection + Confirmation info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-[#1C1510]/5 dark:border-brand-cream/5 pt-4 items-center">
                    <div className="space-y-1">
                      <div className="flex justify-between items-baseline max-w-[200px]">
                        <label className="text-[10px] font-mono uppercase tracking-widest text-[#827266] font-medium block">
                          Return Date (Approximate)
                        </label>
                      </div>
                      <div className="relative max-w-[200px]">
                        <input
                          type="date"
                          name="returnDate"
                          value={form.returnDate}
                          onChange={handleChange}
                          className="w-full bg-transparent text-brand-cream border-b border-brand-cream-subtle/30 focus:border-brand-gold py-1.5 focus:outline-none transition-all duration-200 text-sm font-sans cursor-pointer"
                        />
                      </div>
                    </div>

                    <div className="p-3.5 bg-brand-gold/5 rounded-xl border border-brand-gold/15 space-y-1">
                      <p className="text-[11px] font-mono uppercase tracking-wider text-brand-gold font-bold flex items-center gap-1.5 leading-none">
                        <CheckCircle size={12} /> Appointment Locked
                      </p>
                      <p className="text-[10px] text-brand-cream-dim leading-relaxed normal-case">
                        Pickup scheduled for <strong className="font-semibold">{form.date ? new Date(form.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : ""}</strong> at <strong className="font-semibold">{form.time}</strong>. No email ping-pong required.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Yes/Not yet Gig Driver buttons */}
                <div className="space-y-3">
                  <label className="text-[11px] font-semibold text-brand-cream-subtle uppercase tracking-widest block">
                    Are you currently an active gig driver?
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => handleToggleGigDriver("Yes")}
                      className={`py-4 text-center rounded-[12px] border text-[13px] font-serif uppercase tracking-widest transition-all duration-200 cursor-pointer ${
                        form.isActiveGigDriver === "Yes"
                          ? "bg-brand-secondary border-brand-cream/60 text-brand-cream font-semibold"
                          : "bg-transparent border-brand-cream/10 text-brand-cream-dim hover:bg-brand-secondary/50"
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleGigDriver("Not Yet")}
                      className={`py-4 text-center rounded-[12px] border text-[13px] font-serif uppercase tracking-widest transition-all duration-200 cursor-pointer ${
                        form.isActiveGigDriver === "Not Yet"
                          ? "bg-brand-secondary border-brand-cream/60 text-brand-cream font-semibold"
                          : "bg-transparent border-brand-cream/10 text-brand-cream-dim hover:bg-brand-secondary/50"
                      }`}
                    >
                      Not Yet
                    </button>
                  </div>
                </div>

                {/* Selected platform pills */}
                <div className="space-y-3">
                  <label className="text-[11px] font-semibold text-brand-cream-subtle uppercase tracking-widest block">
                    Which platforms do you drive for?
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availablePlatforms.map((platform) => {
                      const isSelected = form.platforms.includes(platform);
                      return (
                        <button
                          key={platform}
                          type="button"
                          onClick={() => handleTogglePlatform(platform)}
                          className={`px-3 py-2 border rounded-full text-[10px] font-mono tracking-wider transition-all duration-200 cursor-pointer ${
                            isSelected
                              ? "bg-[#1F3A2D] border-[#1F3A2D] text-white dark:bg-brand-gold dark:border-brand-gold dark:text-brand-bg"
                              : "bg-transparent border-brand-cream/10 text-brand-cream-dim hover:bg-brand-secondary"
                          }`}
                        >
                          {platform}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Upload Photos fields */}
                <div className="space-y-4">
                  {/* Driver's License */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-baseline">
                      <label className="text-[11px] font-semibold text-brand-cream-subtle uppercase tracking-widest block">
                        Photo of your driver's license
                      </label>
                      <span className="text-[9px] text-brand-cream-subtle italic font-serif">required</span>
                    </div>

                    <div
                      onClick={() => licenseInputRef.current?.click()}
                      className="border border-dashed border-brand-cream/20 bg-brand-bg rounded-[12px] p-5 flex items-center gap-4 cursor-pointer hover:bg-brand-secondary/40 transition-all duration-200 relative group"
                    >
                      <input
                        type="file"
                        ref={licenseInputRef}
                        onChange={handleUploadLicense}
                        className="hidden"
                        accept="image/*,application/pdf"
                      />
                      <div className="w-10 h-10 rounded-full border border-brand-cream/10 flex items-center justify-center text-brand-cream-dim bg-brand-card shadow-xs shrink-0">
                        <CreditCard size={15} />
                      </div>
                      <div className="text-left flex-1">
                        <span className="text-[11px] font-bold tracking-widest text-brand-cream uppercase font-sans">
                          {licenseFile ? "LICENSE PHOTO SELECTED" : "TAP TO UPLOAD"}
                        </span>
                        <span className="text-[10px] text-brand-cream-subtle tracking-wide block mt-1 font-sans">
                          {licenseFile ? `Loaded: ${licenseFile.name}` : "FRONT OF LICENSE · JPG, PNG OR PDF UP TO 10MB"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Gig trips history screenshots */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-baseline">
                      <label className="text-[11px] font-semibold text-brand-cream-subtle uppercase tracking-widest block">
                        Screenshot of recent gig trips
                      </label>
                      <span className="text-[9px] text-brand-cream-subtle italic font-serif">last 30 days</span>
                    </div>

                    <div
                      onClick={() => tripInputRef.current?.click()}
                      className="border border-dashed border-brand-cream/20 bg-brand-bg rounded-[12px] p-5 flex items-center gap-4 cursor-pointer hover:bg-brand-secondary/40 transition-all duration-200 relative group"
                    >
                      <input
                        type="file"
                        ref={tripInputRef}
                        onChange={handleUploadTrip}
                        className="hidden"
                        accept="image/*,application/pdf"
                      />
                      <div className="w-10 h-10 rounded-full border border-brand-cream/10 flex items-center justify-center text-brand-cream-dim bg-brand-card shadow-xs shrink-0">
                        <Camera size={15} />
                      </div>
                      <div className="text-left flex-1">
                        <span className="text-[11px] font-bold tracking-widest text-brand-cream uppercase font-sans">
                          {tripScreenshot ? "TRIP SUMMARY SELECTED" : "TAP TO UPLOAD"}
                        </span>
                        <span className="text-[10px] text-brand-cream-subtle tracking-wide block mt-1 font-sans">
                          {tripScreenshot ? `Loaded: ${tripScreenshot.name}` : "DOORDASH / UBER / INSTACART IN-APP TRIP HISTORY"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Anything Else */}
                <div className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <label className="text-[11px] font-semibold text-brand-cream-subtle uppercase tracking-widest block">
                      Anything Else?
                    </label>
                    <span className="text-[9px] text-brand-cream-subtle italic font-serif">optional</span>
                  </div>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={1}
                    placeholder="Preferred pickup spot, questions, etc."
                    className="w-full bg-transparent text-brand-cream border-b border-brand-cream/15 focus:border-brand-gold py-2 focus:outline-none transition-all duration-200 text-sm font-serif italic placeholder-brand-cream-subtle/40 placeholder:italic placeholder:font-serif resize-none"
                  />
                </div>

                {/* Consents & Checkboxes */}
                <div className="space-y-4 pt-6 border-t border-brand-cream/5">
                  
                  {/* Checkbox 1 */}
                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      name="termsAccepted"
                      checked={form.termsAccepted}
                      onChange={handleChange}
                      required
                      className="mt-1 w-4 h-4 rounded text-brand-gold border-brand-cream/20 focus:ring-brand-gold cursor-pointer accent-brand-gold"
                    />
                    <span className="text-xs text-brand-cream-dim leading-relaxed font-light font-sans">
                      <strong className="font-semibold text-brand-cream">I understand payment is cash or Zelle</strong>, due weekly at pickup. No card on file.
                    </span>
                  </label>

                  {/* Checkbox 2 */}
                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      name="termsAccepted2"
                      checked={form.termsAccepted2}
                      onChange={handleChange}
                      required
                      className="mt-1 w-4 h-4 rounded text-brand-gold border-brand-cream/20 focus:ring-brand-gold cursor-pointer accent-brand-gold"
                    />
                    <span className="text-xs text-brand-cream-dim leading-relaxed font-light font-sans">
                      I authorize ServUfast to <strong className="font-semibold text-brand-cream">verify my identity</strong> and review my application using the documents I've provided.
                    </span>
                  </label>

                  {/* Checkbox 3 */}
                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      name="termsAccepted3"
                      checked={form.termsAccepted3}
                      onChange={handleChange}
                      className="mt-1 w-4 h-4 rounded text-brand-gold border-brand-cream/20 focus:ring-brand-gold cursor-pointer accent-brand-gold"
                    />
                    <span className="text-xs text-brand-cream-dim leading-relaxed font-light font-sans">
                      Send me weekly tips, offers and updates from ServUfast. <em className="italic text-brand-cream-subtle font-serif">Unsubscribe anytime.</em>
                    </span>
                  </label>

                </div>

                {/* Submit button capsule styled precisely like the screenshot */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-brand-gold hover:bg-brand-gold-light disabled:opacity-50 text-white font-sans text-sm font-medium rounded-full shadow-md transition-all duration-300 flex items-center justify-between px-8 cursor-pointer group"
                >
                  <span className="flex-1 text-center font-semibold text-[15px] tracking-wide text-brand-bg">
                    {isSubmitting ? "Verifying coordinates..." : "Submit application"}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-brand-bg/10 flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:translate-x-1">
                    <ArrowRight size={15} className="text-brand-bg" />
                  </div>
                </button>

              </form>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
