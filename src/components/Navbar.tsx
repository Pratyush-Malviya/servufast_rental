import { useState, useEffect } from "react";
import { Menu, X, PhoneCall, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      if (saved) return saved === "dark";
      return false;
    }
    return false;
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
  ];

  return (
    <>
      <nav
        id="navbar"
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled ? "nav-scrolled py-4" : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <a
            href="#top"
            className="font-serif text-2xl tracking-normal text-brand-cream hover:text-brand-gold transition-colors duration-200"
          >
            ServU<span className="italic font-light text-brand-gold">fast</span>
          </a>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-8">
            {menuItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="font-sans text-xs tracking-widest uppercase text-brand-cream-dim hover:text-brand-gold transition-colors duration-200"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-6">
            <a
              href="tel:+18656969885"
              className="flex items-center gap-2 font-mono text-xs text-brand-cream-dim hover:text-brand-gold transition-colors duration-200"
            >
              <PhoneCall size={14} className="text-brand-gold" />
              +1 (865) 696-9885
            </a>
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2.5 rounded-full border border-brand-cream/15 hover:border-brand-gold text-brand-cream-dim hover:text-brand-gold transition-all duration-200 bg-brand-bg/40 backdrop-blur-md cursor-pointer"
              title={isDark ? "Switch to Light Mode" : "Switch to VIP Dark Mode"}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={14} className="text-brand-gold" /> : <Moon size={14} className="text-brand-gold" />}
            </button>
            <a
              href="#apply"
              className="inline-flex items-center px-5 py-2.5 bg-brand-gold text-brand-bg text-xs font-semibold tracking-widest uppercase rounded-full hover:bg-brand-gold-light hover:scale-102 active:scale-98 transition-all duration-200"
            >
              Get Started
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
              href="tel:+18656969885"
              className="p-2 border border-brand-muted rounded-full text-brand-gold hover:text-brand-cream hover:border-brand-gold transition-colors duration-200"
              aria-label="Call ServUfast"
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
                  href="tel:+18656969885"
                  className="flex items-center gap-3 font-mono text-sm text-brand-cream-dim hover:text-brand-gold"
                >
                  <PhoneCall size={16} className="text-brand-gold" />
                  +1 (865) 696-9885
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
