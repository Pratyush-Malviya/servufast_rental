import { Phone, Mail, Globe, MapPin, ExternalLink } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-bg text-brand-cream-dim border-t border-brand-muted/30 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Core 4-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-brand-muted/40">
          
          {/* Column 1: Brand & Slogan */}
          <div className="lg:col-span-4 space-y-5">
            <a
              href="#top"
              className="font-serif text-3xl tracking-normal text-brand-cream hover:text-brand-gold transition-colors block"
            >
              ServU<span className="italic font-light text-brand-gold">fast</span>
            </a>
            <p className="text-xs text-brand-cream-dim leading-relaxed font-light max-w-sm">
              ServUfast is the premier rent-to-drive car fleet network. We provide zero-maintenance premium hatchbacks, executive sedans, and high-saving electric EVs equipped with complete commercial registration and comprehensive insurance coverage.
            </p>
            {/* Social Icons Placeholder Row styled premiumly */}
            <div className="flex gap-4 pt-2">
              {[
                { label: "WhatsApp Contact", href: "https://wa.me/18656969885" },
                { label: "Reservation Form", href: "#apply" },
                { label: "Fleet Guidelines", href: "#faq" },
              ].map((link, idx) => (
                <a
                  key={idx}
                  href={link.href}
                  className="font-mono text-[9px] uppercase tracking-wider text-brand-gold hover:text-brand-cream transition-colors border border-brand-muted px-2.5 py-1 rounded"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-mono text-[10px] uppercase tracking-widest text-brand-cream font-bold">
              Explore Fleet
            </h4>
            <ul className="space-y-2.5 text-xs font-light">
              <li>
                <a href="#whats-included" className="hover:text-brand-gold transition-colors block py-0.5">
                  Core Inclusions
                </a>
              </li>
              <li>
                <a href="#estimator" className="hover:text-brand-gold transition-colors block py-0.5">
                  Earnings Estimator
                </a>
              </li>
              <li>
                <a href="#fleet" className="hover:text-brand-gold transition-colors block py-0.5">
                  Our Vehicle Fleet
                </a>
              </li>
              <li>
                <a href="#requirements" className="hover:text-brand-gold transition-colors block py-0.5">
                  Rental Qualifications
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-brand-gold transition-colors block py-0.5">
                  Reservation FAQs
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Get Started / Payouts */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-mono text-[10px] uppercase tracking-widest text-brand-cream font-bold">
              Become a Rental Partner
            </h4>
            <ul className="space-y-2.5 text-xs font-light">
              <li>
                <a href="#apply" className="hover:text-brand-gold transition-colors block py-0.5">
                  Vehicle Booking Form
                </a>
              </li>
              <li>
                <a href="#estimator" className="hover:text-brand-gold transition-colors block py-0.5">
                  Weekly Rent Calculator
                </a>
              </li>
              <li>
                <a href="#requirements" className="hover:text-brand-gold transition-colors block py-0.5">
                  Verification Standards
                </a>
              </li>
              <li>
                <span className="text-brand-cream-subtle block py-0.5">
                  Security Escrow Setup: $100
                </span>
              </li>
              <li>
                <span className="text-brand-cream-subtle block py-0.5">
                  Standard Maintenance: Covered
                </span>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Service Areas */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-mono text-[10px] uppercase tracking-widest text-brand-cream font-bold">
              Office Contacts
            </h4>
            <div className="space-y-3 text-xs font-light">
              <p className="flex items-start gap-2 pt-0.5">
                <MapPin size={12} className="text-brand-gold shrink-0 mt-0.5" />
                <span>Executive Office, Financial District, San Francisco, CA 94111</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone size={12} className="text-brand-gold shrink-0" />
                <a href="tel:+18656969885" className="hover:text-brand-gold transition-colors font-mono">
                  +1 (865) 696-9885
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Mail size={12} className="text-brand-gold shrink-0" />
                <a href="mailto:registration@servufast.com" className="hover:text-brand-gold transition-colors">
                  registration@servufast.com
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Globe size={12} className="text-brand-gold shrink-0" />
                <span className="font-mono font-medium text-[10px] text-brand-cream-subtle tracking-wider uppercase">
                  Edition No. 01 · 2026
                </span>
              </p>
            </div>
          </div>

        </div>

        {/* Bottom copyright line, credentials info */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 gap-4 text-[11px] font-mono text-brand-cream-subtle">
          <div>
            © {currentYear} ServUfast LLC. All rights reserved. Registered under Delaware and United States Corporate Standards.
          </div>
          <div className="flex gap-4">
            <a href="#faq" className="hover:text-brand-gold transition-colors">Safety Escrow Agreements</a>
            <span className="text-brand-muted">•</span>
            <a href="#apply" className="hover:text-brand-gold transition-colors">Verification Registry</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
