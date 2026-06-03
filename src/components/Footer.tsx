import { Phone, Mail, Globe, MapPin, ExternalLink } from "lucide-react";
import { useConfig } from "../hooks/useConfig";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { config } = useConfig();
  const { contact, social, general } = config;

  const socialLinks = [
    social.whatsapp ? { label: "WhatsApp", href: social.whatsapp } : { label: "WhatsApp Contact", href: `https://wa.me/${contact.phoneTel.replace(/[^0-9]/g, "") || "18656969885"}` },
    social.facebook && { label: "Facebook", href: social.facebook },
    social.twitter && { label: "Twitter", href: social.twitter },
    social.instagram && { label: "Instagram", href: social.instagram },
    social.linkedin && { label: "LinkedIn", href: social.linkedin },
    !social.facebook && !social.instagram && { label: "Reservation Form", href: "#apply" },
    !social.twitter && !social.linkedin && { label: "Fleet Guidelines", href: "#faq" },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <footer className="bg-brand-bg text-brand-cream-dim border-t border-brand-muted/30 pt-20 pb-28 lg:pb-10">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Core 4-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-brand-muted/40">
          
          {/* Column 1: Brand & Slogan */}
          <div className="lg:col-span-4 space-y-5">
            <a
              href="#top"
              className="font-serif text-3xl tracking-normal text-brand-cream hover:text-brand-gold transition-colors block"
            >
              {general.brandName === "ServUfast" ? (
                <>ServU<span className="italic font-light text-brand-gold">fast</span></>
              ) : (
                <>{general.brandName}<span className="italic font-light text-brand-gold">{general.brandSubtitle}</span></>
              )}
            </a>
            <p className="text-xs text-brand-cream-dim leading-relaxed font-light max-w-sm">
              {general.brandName} is the premier rent-to-drive car fleet network. We provide zero-maintenance premium hatchbacks, executive sedans, and high-saving electric EVs equipped with complete commercial registration and comprehensive insurance coverage.
            </p>
            {/* Social Icons Row styled premiumly */}
            <div className="flex flex-wrap gap-2 pt-2">
              {socialLinks.map((link, idx) => (
                <a
                  key={idx}
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
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
              <li>
                <a href="#contact" className="hover:text-brand-gold transition-colors block py-0.5 font-semibold text-brand-gold">
                  Inquire / Contact Desk
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
                <span>{contact.address}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone size={12} className="text-brand-gold shrink-0" />
                <a href={`tel:${contact.phoneTel}`} className="hover:text-brand-gold transition-colors font-mono">
                  {contact.phone}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Mail size={12} className="text-brand-gold shrink-0" />
                <a href={`mailto:${contact.email}`} className="hover:text-brand-gold transition-colors">
                  {contact.email}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Globe size={12} className="text-brand-gold shrink-0" />
                <span className="font-mono font-medium text-[10px] text-brand-cream-subtle tracking-wider uppercase">
                  {general.editionText}
                </span>
              </p>
            </div>
          </div>

        </div>

        {/* Bottom copyright line, credentials info */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 gap-4 text-[11px] font-mono text-brand-cream-subtle">
          <div>
            {general.copyrightText}
          </div>
          <div className="flex gap-4 items-center">
            <a href="#faq" className="hover:text-brand-gold transition-colors">Safety Escrow Agreements</a>
            <span className="text-brand-muted">•</span>
            <a href="#apply" className="hover:text-brand-gold transition-colors">Verification Registry</a>
            <span className="text-brand-muted">•</span>
            <a 
              href="#admin" 
              className="px-2.5 py-0.5 border border-brand-gold/20 text-brand-gold hover:text-brand-cream hover:border-brand-gold bg-brand-gold/5 rounded-[4px] text-[9px] font-mono tracking-widest uppercase transition-colors"
            >
              Admin Portal
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
