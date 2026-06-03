import React, { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, AlertCircle, Sparkles, MessageSquare } from "lucide-react";
import { useConfig } from "../hooks/useConfig";
import { motion, AnimatePresence } from "motion/react";

export default function ContactSection() {
  const { config } = useConfig();
  const { contact, social, general } = config;

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "San Francisco",
    message: "",
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const validateField = (name: string, value: string) => {
    let error = "";
    if (name === "name") {
      if (!value.trim()) {
        error = "Name is required";
      } else if (value.trim().length < 2) {
        error = "Please enter your full name";
      }
    } else if (name === "email") {
      if (!value.trim()) {
        error = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        error = "Please enter a valid email address";
      }
    } else if (name === "phone") {
      if (!value.trim()) {
        error = "Phone number is required";
      } else if (value.replace(/\D/g, "").length < 10) {
        error = "Please enter a valid 10-digit phone number";
      }
    } else if (name === "message") {
      if (!value.trim()) {
        error = "Message cannot be empty";
      } else if (value.trim().length < 10) {
        error = "Your message should be at least 10 characters";
      }
    }
    return error;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (touched[name] || errors[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    // Validate all fields
    const newErrors: Record<string, string> = {};
    Object.keys(form).forEach((key) => {
      const error = validateField(key, form[key as keyof typeof form]);
      if (error) {
        newErrors[key] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched(
        Object.keys(form).reduce((acc, key) => {
          acc[key] = true;
          return acc;
        }, {} as Record<string, boolean>)
      );
      setErrorMessage("Please fill in all details correctly before sending.");
      return;
    }

    setIsSubmitting(true);

    try {
      // POST format aligned with database schema mapping to contact inquiry
      const response = await fetch("/api/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email,
          city: form.city,
          service: "Contact Form Inquiry",
          date: new Date().toISOString().split("T")[0],
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          newCustomer: "Yes",
          message: form.message,
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

  return (
    <section id="contact" className="py-24 sm:py-32 bg-brand-bg relative overflow-hidden border-t border-brand-muted/30">
      {/* Editorial Decorative Accent Elements */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-cream/10 to-transparent" />
      <div className="absolute bottom-0 left-10 w-[300px] h-[300px] bg-brand-gold/2 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute top-1/4 right-5 w-[400px] h-[400px] bg-brand-gold/3 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header styled luxury-editorial style */}
        <div id="contact-header" className="max-w-3xl mb-16 sm:mb-24 space-y-4">
          <span className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-[#B6B2AB] border border-brand-cream-dim/10 px-4 py-1.5 rounded-full bg-brand-secondary/40 font-semibold inline-block">
            Concierge Relations
          </span>
          <h2 className="text-4xl sm:text-6xl text-brand-cream font-serif italic font-normal tracking-tight leading-tight">
            Have a question? <br />
            Our support desk is <span className="text-brand-gold font-sans not-italic font-medium">always present</span>.
          </h2>
          <p className="text-brand-cream-dim font-light text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed">
            Interested in fleet corporate solutions, long-term flexible reservations, or key depot operations? Send us a premium secure message or contact David directly via our instant text and phone guidelines.
          </p>
        </div>

        {/* Dual Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          
          {/* Column Left: Contact Details & Service Areas info */}
          <div className="lg:col-span-5 space-y-10" id="contact-details-block">
            <div className="space-y-6">
              <h3 className="font-serif text-2xl text-brand-cream italic font-normal">
                Direct Communication Hub
              </h3>
              <p className="text-[#B6B2AB] text-sm leading-relaxed font-light">
                David, our Client Support Coordinator and dispatch managers respond within 2 hours maximum to ensure zero delays with same-day metropolitan keys distribution.
              </p>
            </div>

            {/* Structured Details Cards */}
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-5 bg-brand-secondary border border-brand-cream-subtle/5 rounded-[16px] transition-all hover:bg-brand-secondary/80">
                <div className="p-3 bg-brand-gold/10 hover:bg-brand-gold/20 text-brand-gold border border-brand-gold/20 rounded-full shrink-0">
                  <Phone size={18} />
                </div>
                <div className="space-y-1">
                  <span className="block font-mono text-[9px] uppercase tracking-widest text-brand-cream-subtle font-bold">
                    Official Support Phone & SMS
                  </span>
                  <a 
                    href={`tel:${contact.phoneTel}`} 
                    className="block font-sans text-[17px] font-semibold text-brand-cream hover:text-brand-gold transition-colors duration-200"
                  >
                    {contact.phone}
                  </a>
                  <span className="block text-[11px] text-[#B6B2AB] font-light">
                    Complimentary call routing or secure dispatch SMS
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 bg-brand-secondary border border-brand-cream-subtle/5 rounded-[16px] transition-all hover:bg-brand-secondary/80">
                <div className="p-3 bg-brand-gold/10 hover:bg-brand-gold/20 text-brand-gold border border-brand-gold/20 rounded-full shrink-0">
                  <Mail size={18} />
                </div>
                <div className="space-y-1">
                  <span className="block font-mono text-[9px] uppercase tracking-widest text-brand-cream-subtle font-bold">
                    Email Reservations Registry
                  </span>
                  <a 
                    href={`mailto:${contact.email}`} 
                    className="block font-sans text-[17px] font-semibold text-brand-cream hover:text-brand-gold transition-colors duration-200"
                  >
                    {contact.email}
                  </a>
                  <span className="block text-[11px] text-[#B6B2AB] font-light">
                    Direct routing to executive managers
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 bg-brand-secondary border border-brand-cream-subtle/5 rounded-[16px] transition-all hover:bg-brand-secondary/80">
                <div className="p-3 bg-brand-gold/10 hover:bg-brand-gold/20 text-brand-gold border border-brand-gold/20 rounded-full shrink-0">
                  <MapPin size={18} />
                </div>
                <div className="space-y-1">
                  <span className="block font-mono text-[9px] uppercase tracking-widest text-[#827266] font-bold">
                    Executive Headquarters
                  </span>
                  <p className="font-sans text-[15px] font-light text-brand-cream">
                    {contact.address}
                  </p>
                  <span className="block text-[11px] text-brand-gold font-mono uppercase tracking-wider font-semibold mt-1">
                    SF · LA · Seattle · Chicago · Boston
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 bg-brand-secondary border border-brand-cream-subtle/5 rounded-[16px] transition-all hover:bg-brand-secondary/80">
                <div className="p-3 bg-brand-gold/10 hover:bg-brand-gold/20 text-brand-gold border border-brand-gold/20 rounded-full shrink-0">
                  <Clock size={18} />
                </div>
                <div className="space-y-1">
                  <span className="block font-mono text-[9px] uppercase tracking-widest text-brand-cream-subtle font-bold">
                    Depot Operating Times
                  </span>
                  <p className="font-sans text-[15px] font-light text-brand-cream">
                    24 Hours / 7 Days On-Demand Support
                  </p>
                  <span className="block text-[11px] text-[#B6B2AB] font-light">
                    Vehicle pickup and check-in active around the clock
                  </span>
                </div>
              </div>
            </div>

            {/* Direct Instant Action Links */}
            <div className="pt-4 flex flex-wrap gap-3">
              <a 
                href={social.whatsapp || `https://wa.me/${contact.phoneTel.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-6 py-3 border border-brand-cream/10 text-brand-cream font-sans text-xs tracking-wider uppercase rounded-full hover:border-brand-gold/50 hover:bg-brand-gold/5 transition-all duration-300"
              >
                <MessageSquare size={13} className="text-brand-gold" />
                WhatsApp Chat
              </a>
              <a 
                href={`sms:${contact.phoneTel}`}
                className="inline-flex items-center gap-2.5 px-6 py-3 border border-brand-cream/10 text-brand-cream font-sans text-xs tracking-wider uppercase rounded-full hover:border-brand-gold/50 hover:bg-brand-gold/5 transition-all duration-300"
              >
                <Sparkles size={13} className="text-brand-gold" />
                SMS Text Dispatch
              </a>
            </div>
          </div>

          {/* Column Right: Elegant Premium Standalone Inquiry Form */}
          <div className="lg:col-span-7 bg-brand-card border border-brand-cream-subtle/10 p-8 sm:p-12 rounded-[28px] shadow-xl relative" id="contact-form-block">
            <AnimatePresence mode="wait">
              {submitSuccess ? (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="py-12 text-center space-y-6 flex flex-col items-center justify-center"
                >
                  <div className="relative w-20 h-20 flex items-center justify-center mb-2">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: [1, 1.25, 1], opacity: [0.35, 0.08, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                      className="absolute inset-0 rounded-full bg-brand-gold/20"
                    />
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
                        strokeWidth="3"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      />
                      <motion.path
                        d="M16 26l7 7 13-13"
                        stroke="currentColor"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.4, delay: 0.45, ease: "easeInOut" }}
                      />
                    </svg>
                  </div>
                  <h3 className="font-serif text-3xl text-brand-cream italic font-normal">
                    Inquiry Transmitted
                  </h3>
                  <p className="text-brand-cream-dim text-sm sm:text-base font-light max-w-sm leading-relaxed mx-auto">
                    Thank you, <span className="font-semibold text-brand-gold">{form.name}</span>. 
                    David has queued your inquiry for pickup options at <span className="text-brand-gold font-medium">{form.city}</span>. We will follow up at <span className="font-mono text-brand-gold">{form.phone}</span> within 2 hours.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitSuccess(false);
                      setForm({
                        name: "",
                        email: "",
                        phone: "",
                        city: "San Francisco",
                        message: "",
                      });
                    }}
                    className="px-6 py-3 bg-brand-gold text-brand-bg hover:bg-brand-gold-light transition-colors duration-200 text-xs font-mono tracking-wider uppercase rounded-full font-bold"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <h4 className="font-serif text-xl font-normal italic text-brand-cream">
                      Inquire Online
                    </h4>
                    <p className="text-xs text-brand-cream-dim/70 font-light mt-1">
                      Fill out our secure secure concierge form to dispatch your request immediately.
                    </p>
                  </div>

                  {errorMessage && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-xs rounded-xl font-mono flex items-center gap-2">
                      <AlertCircle size={14} className="shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Name field */}
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
                      placeholder="e.g., John Miller"
                      required
                      className={`w-full bg-transparent text-brand-cream border-b py-2 px-0 focus:outline-none transition-all duration-200 text-sm font-serif italic placeholder-brand-cream-subtle/30 placeholder:italic ${
                        touched.name && errors.name
                          ? "border-red-500/40 focus:border-red-500 text-red-500"
                          : "border-brand-cream/15 focus:border-brand-gold"
                      }`}
                    />
                    {touched.name && errors.name && (
                      <span className="text-[10px] text-red-500 font-mono tracking-wide mt-1 block flex items-center gap-1">
                        <AlertCircle size={10} /> {errors.name}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Email field */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-brand-cream-subtle uppercase tracking-widest block">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="e.g., john@example.com"
                        required
                        className={`w-full bg-transparent text-brand-cream border-b py-2 px-0 focus:outline-none transition-all duration-200 text-sm font-serif italic placeholder-brand-cream-subtle/30 placeholder:italic ${
                          touched.email && errors.email
                            ? "border-red-500/40 focus:border-red-500 text-red-500"
                            : "border-brand-cream/15 focus:border-brand-gold"
                        }`}
                      />
                      {touched.email && errors.email && (
                        <span className="text-[10px] text-red-500 font-mono tracking-wide mt-1 block flex items-center gap-1">
                          <AlertCircle size={10} /> {errors.email}
                        </span>
                      )}
                    </div>

                    {/* Phone field */}
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-brand-cream-subtle uppercase tracking-widest block">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="e.g., (123) 456-7890"
                        required
                        className={`w-full bg-transparent text-brand-cream border-b py-2 px-0 focus:outline-none transition-all duration-200 text-sm font-serif italic placeholder-brand-cream-subtle/30 placeholder:italic ${
                          touched.phone && errors.phone
                            ? "border-red-500/40 focus:border-red-500 text-red-500"
                            : "border-brand-cream/15 focus:border-brand-gold"
                        }`}
                      />
                      {touched.phone && errors.phone && (
                        <span className="text-[10px] text-red-500 font-mono tracking-wide mt-1 block flex items-center gap-1">
                          <AlertCircle size={10} /> {errors.phone}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Metropolitan Region */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-brand-cream-subtle uppercase tracking-widest block">
                      Preferred Booking Hub
                    </label>
                    <select
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      className="w-full bg-transparent text-brand-cream border-b border-brand-cream/15 focus:border-brand-gold py-2 px-0 focus:outline-none transition-all duration-200 text-sm font-sans cursor-pointer"
                    >
                      <option value="San Francisco">San Francisco Metropolitan Hub</option>
                      <option value="Los Angeles">Los Angeles Depot</option>
                      <option value="Seattle">Seattle Hub</option>
                      <option value="Chicago">Chicago Region</option>
                      <option value="Boston">Boston Depot</option>
                    </select>
                  </div>

                  {/* Message field */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-brand-cream-subtle uppercase tracking-widest block">
                      Secure Message
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      rows={4}
                      placeholder="Type your questions or special custom reservation requirements..."
                      required
                      className={`w-full bg-transparent text-brand-cream border border-brand-cream/15 rounded-xl py-3 px-4 focus:outline-none focus:border-brand-gold transition-all duration-200 text-sm font-light placeholder-brand-cream-subtle/30 resize-none ${
                        touched.message && errors.message
                          ? "border-red-500/40 focus:border-red-500 text-red-500"
                          : "border-brand-cream/15 focus:border-brand-gold"
                      }`}
                    />
                    {touched.message && errors.message && (
                      <span className="text-[10px] text-red-500 font-mono tracking-wide mt-1 block flex items-center gap-1">
                        <AlertCircle size={10} /> {errors.message}
                      </span>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-brand-gold hover:bg-brand-gold-light text-brand-bg font-sans font-bold text-xs tracking-widest uppercase rounded-full shadow-lg shadow-brand-gold/5 hover:shadow-brand-gold/10 transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed uppercase shrink-0"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-brand-bg border-t-transparent rounded-full animate-spin" />
                          <span>Dispatching...</span>
                        </>
                      ) : (
                        <>
                          <span>Transmit Message</span>
                          <Send size={12} className="text-brand-bg" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
