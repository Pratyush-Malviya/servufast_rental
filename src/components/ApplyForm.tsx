import React, { useState, useEffect, useRef } from "react";
import { useConfig } from "../hooks/useConfig";
import { Mail, Phone, MapPin, Clock, CreditCard, CheckCircle, ArrowRight, Camera, Calendar, X, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { LeadForm } from "../types";

export default function ApplyForm() {
  const { config } = useConfig();
  const { contact } = config;
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

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
  const [vehicles, setVehicles] = useState<{ id: string; title: string; price: string }[]>([]);

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
        setIsOpen(true);
      }
    };
    window.addEventListener("select-vehicle", handleSelectVehicle);
    return () => {
      window.removeEventListener("select-vehicle", handleSelectVehicle);
    };
  }, []);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await fetch("/api/vehicles");
        if (res.ok) {
          const data = await res.json();
          setVehicles(data.map((v: any) => ({
            id: v.id,
            title: v.title,
            price: v.price
          })));
          
          if (data.length > 0) {
            setForm(f => {
              const exists = data.some((v: any) => v.title === f.service);
              if (!exists) {
                return { ...f, service: data[0].title };
              }
              return f;
            });
          }
        }
      } catch (err) {
        console.error("Failed to load vehicle list in select form", err);
      }
    };
    fetchVehicles();

    window.addEventListener("fleet-updated", fetchVehicles);
    return () => window.removeEventListener("fleet-updated", fetchVehicles);
  }, []);

  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      if (anchor && anchor.getAttribute("href") === "#apply") {
        e.preventDefault();
        setIsOpen(true);
      }
    };
    document.addEventListener("click", handleAnchorClick, { capture: true });
    return () => document.removeEventListener("click", handleAnchorClick, { capture: true });
  }, []);

  const validateField = (name: string, value: any) => {
    let error = "";
    if (name === "name") {
      if (!String(value).trim()) {
        error = "Full name is required";
      } else if (!String(value).trim().includes(" ")) {
        error = "Please enter both first and last name (e.g., John Doe)";
      }
    } else if (name === "age") {
      if (!String(value).trim()) {
        error = "Age is required";
      } else {
        const parsedAge = parseInt(value, 10);
        if (isNaN(parsedAge)) {
          error = "Please enter a valid age number";
        } else if (parsedAge < 21) {
          error = "To rent, you must be 21 or older";
        }
      }
    } else if (name === "phone") {
      if (!String(value).trim()) {
        error = "Phone number is required";
      } else {
        const cleanPhone = String(value).replace(/\D/g, "");
        if (cleanPhone.length < 10) {
          error = "Please enter a valid 10-digit phone number";
        }
      }
    } else if (name === "email") {
      if (!String(value).trim()) {
        error = "Email is required";
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(String(value))) {
          error = "Please enter a valid email address (e.g., you@domain.com)";
        }
      }
    }
    return error;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    
    let nextValue: any = value;
    if (type === "checkbox") {
      nextValue = (e.target as HTMLInputElement).checked;
    }
    
    setForm((prev) => {
      const updated = { ...prev, [name]: nextValue };
      if (touched[name] || errors[name]) {
        const error = validateField(name, nextValue);
        setErrors((prevErr) => ({ ...prevErr, [name]: error }));
      }
      return updated;
    });
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const validateStep1 = () => {
    const stepErrors: Record<string, string> = {};
    const nameErr = validateField("name", form.name);
    const ageErr = validateField("age", form.age);
    const phoneErr = validateField("phone", form.phone);
    const emailErr = validateField("email", form.email);

    if (nameErr) stepErrors.name = nameErr;
    if (ageErr) stepErrors.age = ageErr;
    if (phoneErr) stepErrors.phone = phoneErr;
    if (emailErr) stepErrors.email = emailErr;

    return stepErrors;
  };

  const handleNextStep = () => {
    const step1Errors = validateStep1();
    const allFields = ["name", "age", "phone", "email"];
    
    const newTouched = { ...touched };
    allFields.forEach(f => { newTouched[f] = true; });
    setTouched(newTouched);

    if (Object.keys(step1Errors).length > 0) {
      setErrors(step1Errors);
      setErrorMessage("Please complete all driver details correctly in Section 1.");
      return;
    }

    setErrors({});
    setErrorMessage("");
    setCurrentStep(2);
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
      setErrors((prev) => ({ ...prev, licenseFile: "" }));
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

    const step1Errors = validateStep1();
    if (Object.keys(step1Errors).length > 0) {
      setCurrentStep(1);
      setErrors(step1Errors);
      setErrorMessage("Please complete all driver details correctly in Section 1.");
      return;
    }

    const step2Errors: Record<string, string> = {};
    if (!licenseFile) {
      step2Errors.licenseFile = "A photo of your driver's license is required for verification.";
    }
    if (!form.termsAccepted) {
      step2Errors.termsAccepted = "You must understand and accept the cash or Zelle payment terms.";
    }
    if (!form.termsAccepted2) {
      step2Errors.termsAccepted2 = "You must authorize ServUfast to verify details and documents.";
    }

    if (Object.keys(step2Errors).length > 0) {
      setErrors((prev) => ({ ...prev, ...step2Errors }));
      const newTouched = { ...touched };
      Object.keys(step2Errors).forEach((f) => { newTouched[f] = true; });
      setTouched(newTouched);
      setErrorMessage("Please resolve the required items in Step 2 before submitting.");
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#060A08]/90 backdrop-blur-md cursor-zoom-out"
        onClick={() => setIsOpen(false)}
      />
      
      {/* Scrollable Container */}
      <div className="relative w-full max-w-2xl max-h-[92vh] sm:max-h-[85vh] overflow-y-auto bg-brand-card border border-brand-cream/15 rounded-[28px] sm:rounded-[36px] shadow-2xl z-10 m-4 text-brand-cream">
        
        {/* Close Button or Back trigger */}
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="absolute top-5 right-5 sm:top-8 sm:right-8 p-2.5 rounded-full bg-brand-bg/60 border border-brand-cream/5 hover:bg-brand-secondary hover:border-brand-gold/40 text-brand-cream-dim hover:text-brand-cream transition-all duration-300 cursor-pointer z-50 group shadow-md"
          aria-label="Close modal"
        >
          <X size={18} className="group-hover:rotate-90 transition-transform duration-300" />
        </button>

        <div className="p-6 sm:p-10 md:p-12">
          
            {submitSuccess ? (
              <div className="py-12 px-6 text-center space-y-6 flex flex-col items-center justify-center">
                <div className="relative w-20 h-20 flex items-center justify-center mb-2">
                  {/* Subtle pulsing ambient halo */}
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: [1, 1.25, 1], opacity: [0.35, 0.08, 0] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
                    className="absolute inset-0 rounded-full bg-brand-gold/25"
                  />
                  
                  {/* High-fidelity custom drawn checkmark dynamic path */}
                  <svg
                    className="w-16 h-16 text-brand-gold overflow-visible relative z-10"
                    viewBox="0 0 52 52"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <motion.circle
                      cx="26"
                      cy="26"
                      r="23"
                      stroke="currentColor"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 0.65, ease: "easeOut" }}
                    />
                    <motion.path
                      d="M16 26l7 7 13-13"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.52, delay: 0.55, ease: "easeInOut" }}
                    />
                  </svg>
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
                
                {/* Step Info Indicator */}
                <div className="mb-6 border-b border-brand-cream/5 pb-5">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-brand-cream-subtle font-bold">
                      Step {currentStep} of 2 · {currentStep === 1 ? "Driver Profile & Fleet Choice" : "Verification & Scheduling"}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-brand-gold bg-brand-gold/10 px-2.5 py-1 rounded-full uppercase">
                      {currentStep === 1 ? "Section 1: 50% Complete" : "Section 2: Final Verification"}
                    </span>
                  </div>
                  <div className="w-full h-1 bg-brand-cream/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-brand-gold transition-all duration-300 rounded-full"
                      style={{ width: currentStep === 1 ? "50%" : "100%" }}
                    />
                  </div>
                </div>

                {/* Error Banner if any */}
                {errorMessage && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-xs rounded-xl font-mono flex items-center gap-2">
                    <AlertCircle size={14} className="shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <AnimatePresence mode="wait">
                  {currentStep === 1 ? (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, y: 35 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -35 }}
                      transition={{ duration: 0.48, ease: [0.215, 0.61, 0.355, 1.0] }}
                      className="space-y-8 text-brand-cream"
                    >
                      {/* Selected vehicle class choice visual matching the style tags */}
                      <div className="border-b border-brand-cream/5 pb-6">
                        <span className="text-[11px] font-semibold text-brand-cream-subtle uppercase tracking-widest block mb-3">
                          Selected Fleet Class
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {(vehicles.length > 0 ? vehicles : [
                            { id: "hatchback", title: "Hatchback Pro Series", price: "$150 / week" },
                            { id: "sedan", title: "Premium Sedan Range", price: "$200 / week" },
                            { id: "electric", title: "Electric Zero-Emission EV Fleet", price: "$220 / week" },
                            { id: "luxury", title: "Luxury Executive Series", price: "$290 / week" }
                          ]).map((item) => {
                            const trimmedPrice = item.price.split("/")[0].trim();
                            return (
                              <button
                                key={item.title}
                                type="button"
                                onClick={() => setForm((f) => ({ ...f, service: item.title }))}
                                className={`px-3.5 py-1.5 border rounded-full text-[11px] font-medium tracking-wide uppercase transition-all duration-200 cursor-pointer ${
                                  form.service === item.title
                                    ? "bg-[#1F3A2D] border-[#1F3A2D] text-white shadow-xs dark:bg-brand-gold dark:border-brand-gold dark:text-brand-bg"
                                    : "bg-brand-secondary border-brand-cream-subtle/20 text-brand-cream-dim hover:bg-[#151515]"
                                }`}
                              >
                                {item.title} ({trimmedPrice})
                              </button>
                            );
                          })}
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
                            onBlur={handleBlur}
                            placeholder="First & Last"
                            required
                            className={`w-full bg-transparent text-brand-cream border-b py-2 px-0 focus:outline-none transition-all duration-200 text-base font-serif italic placeholder-brand-cream-subtle/40 placeholder:italic placeholder:font-serif ${
                              touched.name && errors.name
                                ? "border-red-500/40 focus:border-red-500 text-red-500 dark:text-red-400"
                                : "border-brand-cream/15 focus:border-brand-gold"
                            }`}
                          />
                          {touched.name && errors.name && (
                            <span className="text-[10px] text-red-500 dark:text-red-400 font-mono tracking-wide mt-1 block flex items-center gap-1">
                              <AlertCircle size={10} /> {errors.name}
                            </span>
                          )}
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
                            onBlur={handleBlur}
                            placeholder="25 or older"
                            className={`w-full bg-transparent text-brand-cream border-b py-2 px-0 focus:outline-none transition-all duration-200 text-base font-serif italic placeholder-brand-cream-subtle/40 placeholder:italic placeholder:font-serif ${
                              touched.age && errors.age
                                ? "border-red-500/40 focus:border-red-500 text-red-500 dark:text-red-400"
                                : "border-brand-cream/15 focus:border-brand-gold"
                            }`}
                          />
                          {touched.age && errors.age && (
                            <span className="text-[10px] text-red-500 dark:text-red-400 font-mono tracking-wide mt-1 block flex items-center gap-1">
                              <AlertCircle size={10} /> {errors.age}
                            </span>
                          )}
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
                            onBlur={handleBlur}
                            placeholder="(___) ___-____"
                            required
                            className={`w-full bg-transparent text-brand-cream border-b py-2 px-0 focus:outline-none transition-all duration-200 text-base font-serif italic placeholder-brand-cream-subtle/40 placeholder:italic placeholder:font-serif ${
                              touched.phone && errors.phone
                                ? "border-red-500/40 focus:border-red-500 text-red-500 dark:text-red-400"
                                : "border-brand-cream/15 focus:border-brand-gold"
                            }`}
                          />
                          {touched.phone && errors.phone && (
                            <span className="text-[10px] text-red-500 dark:text-red-400 font-mono tracking-wide mt-1 block flex items-center gap-1">
                              <AlertCircle size={10} /> {errors.phone}
                            </span>
                          )}
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
                            onBlur={handleBlur}
                            placeholder="you@email.com"
                            className={`w-full bg-transparent text-brand-cream border-b py-2 px-0 focus:outline-none transition-all duration-200 text-base font-serif italic placeholder-brand-cream-subtle/40 placeholder:italic placeholder:font-serif ${
                              touched.email && errors.email
                                ? "border-red-500/40 focus:border-red-500 text-red-500 dark:text-red-400"
                                : "border-brand-cream/15 focus:border-brand-gold"
                            }`}
                          />
                          {touched.email && errors.email && (
                            <span className="text-[10px] text-red-500 dark:text-red-400 font-mono tracking-wide mt-1 block flex items-center gap-1">
                              <AlertCircle size={10} /> {errors.email}
                            </span>
                          )}
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

                      {/* Proceed button container */}
                      <div className="pt-4">
                        <button
                          type="button"
                          onClick={handleNextStep}
                          className="w-full py-4 bg-brand-gold hover:bg-brand-gold-light text-white font-sans text-sm font-medium rounded-full shadow-md transition-all duration-300 flex items-center justify-between px-8 cursor-pointer group"
                        >
                          <span className="flex-1 text-center font-semibold text-[15px] tracking-wide text-brand-bg">
                            Continue to Appointment Slot
                          </span>
                          <div className="w-8 h-8 rounded-full bg-brand-bg/10 flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:translate-x-1">
                            <ArrowRight size={15} className="text-brand-bg" />
                          </div>
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, y: 35 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -35 }}
                      transition={{ duration: 0.48, ease: [0.215, 0.61, 0.355, 1.0] }}
                      className="space-y-8 text-brand-cream"
                    >
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
                            className={`border border-dashed rounded-[12px] p-5 flex items-center gap-4 cursor-pointer hover:bg-brand-secondary/40 transition-all duration-200 relative group ${
                              errors.licenseFile 
                                ? "border-red-500 bg-red-500/5"
                                : "border-brand-cream/20 bg-brand-bg"
                            }`}
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
                          {errors.licenseFile && (
                            <span className="text-[10px] text-red-500 dark:text-red-400 font-mono tracking-wide mt-1 block flex items-center gap-1">
                              <AlertCircle size={10} /> {errors.licenseFile}
                            </span>
                          )}
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
                        <div>
                          <label className="flex items-start gap-3 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              name="termsAccepted"
                              checked={form.termsAccepted}
                              onChange={handleChange}
                              className="mt-1 w-4 h-4 rounded text-brand-gold border-brand-cream/20 focus:ring-brand-gold cursor-pointer accent-brand-gold"
                            />
                            <span className="text-xs text-brand-cream-dim leading-relaxed font-light font-sans">
                              <strong className="font-semibold text-brand-cream">I understand payment is cash or Zelle</strong>, due weekly at pickup. No card on file.
                            </span>
                          </label>
                          {touched.termsAccepted && errors.termsAccepted && (
                            <span className="text-[10px] text-red-500 dark:text-red-400 font-mono tracking-wide mt-1 block ml-7">
                              {errors.termsAccepted}
                            </span>
                          )}
                        </div>

                        {/* Checkbox 2 */}
                        <div>
                          <label className="flex items-start gap-3 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              name="termsAccepted2"
                              checked={form.termsAccepted2}
                              onChange={handleChange}
                              className="mt-1 w-4 h-4 rounded text-brand-gold border-brand-cream/20 focus:ring-brand-gold cursor-pointer accent-brand-gold"
                            />
                            <span className="text-xs text-brand-cream-dim leading-relaxed font-light font-sans">
                              I authorize ServUfast to <strong className="font-semibold text-brand-cream">verify my identity</strong> and review my application using the documents I've provided.
                            </span>
                          </label>
                          {touched.termsAccepted2 && errors.termsAccepted2 && (
                            <span className="text-[10px] text-red-500 dark:text-red-400 font-mono tracking-wide mt-1 block ml-7">
                              {errors.termsAccepted2}
                            </span>
                          )}
                        </div>

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

                      {/* Progressive navigation back and submit action buttons */}
                      <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 border-t border-brand-cream/5">
                        <button
                          type="button"
                          onClick={() => {
                            setCurrentStep(1);
                            setErrorMessage("");
                          }}
                          className="w-full sm:w-auto px-6 py-4 border border-brand-cream/15 text-brand-cream rounded-full text-xs font-mono tracking-wider uppercase hover:bg-brand-secondary transition-colors cursor-pointer"
                        >
                          ← Back to Driver Details
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="flex-1 w-full py-4 bg-brand-gold hover:bg-brand-gold-light disabled:opacity-50 text-white font-sans text-sm font-medium rounded-full shadow-md transition-all duration-300 flex items-center justify-between px-8 cursor-pointer group"
                        >
                          <span className="flex-1 text-center font-semibold text-[15px] tracking-wide text-brand-bg">
                            {isSubmitting ? "Verifying credentials..." : "Submit application"}
                          </span>
                          <div className="w-8 h-8 rounded-full bg-brand-bg/10 flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:translate-x-1">
                            <ArrowRight size={15} className="text-brand-bg" />
                          </div>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </form>
            )}

        </div>

      </div>
    </div>
  );
}
