import { useState, useEffect } from "react";
import { Menu, X, PhoneCall, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useConfig } from "../hooks/useConfig";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const { config } = useConfig();
  const { contact, general } = config;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Sync preference on initial load
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "light") {
      setIsDark(false);
    } else {
      setIsDark(true);
    }
  }, []);

  // Apply class changes and save preference
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const menuItems = [
    { label: "Inclusions", href: "#whats-included" },
    { label: "Rate Estimator", href: "#estimator" },
    { label: "Fleet Options", href: "#fleet" },
    { label: "Qualifications", href: "#requirements" },
    { label: "FAQs", href: "#faq" },
    { label: "Contact Desk", href: "#contact" },
  ];

  return (
    <>
      <nav
        id="navbar"
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-out ${
          scrolled 
            ? "py-3 px-4 sm:px-6 md:px-8 bg-transparent" 
            : "py-6 px-6 bg-transparent"
        }`}
      >
        <div 
          className={`mx-auto flex items-center justify-between transition-all duration-500 ease-out ${
            scrolled
              ? "max-w-5xl bg-[#FCFBFA]/85 dark:bg-[#060A08]/75 backdrop-blur-xl px-6 sm:px-8 py-2.5 rounded-full border border-brand-cream/10 dark:border-brand-cream/15 shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
              : "max-w-7xl px-2 w-full"
          }`}
        >
          {/* Logo */}
          <a
            href="#top"
            className="font-serif text-2xl tracking-normal text-brand-cream hover:text-brand-gold transition-colors duration-200"
          >
            {general.brandName === "ServUfast" ? (
              <>ServU<span className="italic font-light text-brand-gold">fast</span></>
            ) : (
              <>{general.brandName}<span className="italic font-light text-brand-gold">{general.brandSubtitle}</span></>
            )}
          </a>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-2">
            {menuItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="relative font-sans text-[10px] font-bold tracking-widest uppercase text-brand-cream-dim hover:text-brand-cream px-3 py-2 rounded-full hover:bg-brand-cream/5 transition-all duration-300 group"
              >
                {item.label}
                <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-brand-gold rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
              </a>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            <a
              href={`tel:${contact.phoneTel}`}
              className="flex items-center gap-2 px-3.5 py-1.5 bg-brand-cream/5 hover:bg-brand-cream/10 border border-brand-cream/5 rounded-full font-mono text-xs text-brand-cream hover:text-brand-gold transition-all duration-300"
            >
              <PhoneCall size={12} className="text-brand-gold animate-pulse" />
              <span className="tracking-wide">{contact.phone}</span>
            </a>
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-full bg-brand-cream/5 hover:bg-brand-cream/10 border border-brand-cream/10 hover:border-brand-gold text-brand-cream hover:text-brand-gold transition-all duration-300 cursor-pointer"
              title={isDark ? "Switch to Light Mode" : "Switch to VIP Dark Mode"}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={13} className="text-brand-gold" /> : <Moon size={13} className="text-brand-gold" />}
            </button>
            <a
              href="#apply"
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-brand-gold text-brand-bg text-[10px] font-bold tracking-widest uppercase rounded-full hover:bg-brand-gold-light hover:shadow-lg hover:shadow-brand-gold/15 hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 group/btn"
            >
              <span>Get Started</span>
              <span className="transform group-hover/btn:translate-x-1 transition-transform duration-200 font-mono">→</span>
            </a>
          </div>

          {/* Mobile Right Container */}
          <div className="flex lg:hidden items-center space-x-3">
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 border border-brand-muted/70 rounded-full text-brand-gold hover:text-brand-cream hover:border-brand-gold transition-colors duration-200 cursor-pointer"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            <a
              href={`tel:${contact.phoneTel}`}
              className="p-2 border border-brand-muted rounded-full text-brand-gold hover:text-brand-cream hover:border-brand-gold transition-colors duration-200"
              aria-label={`Call ${general.brandName}`}
            >
              <PhoneCall size={15} />
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-brand-cream hover:text-brand-gold transition-colors duration-150"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="fixed top-0 left-0 w-full max-h-screen overflow-y-auto bg-brand-bg/95 backdrop-blur-2xl border-b border-brand-muted/70 pt-24 pb-8 px-6 z-45"
          >
            <div className="flex flex-col space-y-6">
              {menuItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-serif text-2xl text-brand-cream hover:text-brand-gold transition-colors duration-200 block border-b border-brand-muted/40 pb-4"
                >
                  {item.label}
                </a>
              ))}
              <div className="pt-4 flex flex-col space-y-4">
                <a
                  href={`tel:${contact.phoneTel}`}
                  className="flex items-center gap-3 font-mono text-sm text-brand-cream-dim hover:text-brand-gold"
                >
                  <PhoneCall size={16} className="text-brand-gold" />
                  {contact.phone}
                </a>
                <a
                  href="#apply"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-3 bg-brand-gold text-brand-bg text-xs font-semibold tracking-widest uppercase rounded-full hover:bg-brand-gold-light transition-all duration-200 block"
                >
                  Get Started
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
