/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, lazy, Suspense } from "react";
import { useConfig } from "./hooks/useConfig";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import WhatsIncluded from "./components/WhatsIncluded";
import Footer from "./components/Footer";
import CustomCursor from "./components/CustomCursor";
import { PhoneCall, ArrowRight, Phone } from "lucide-react";

// Lazy loaded below-the-fold heavy components for blazing-fast initial bundle loading
const Estimator = lazy(() => import("./components/Estimator"));
const Fleet = lazy(() => import("./components/Fleet"));
const Requirements = lazy(() => import("./components/Requirements"));
const Testimonials = lazy(() => import("./components/Testimonials"));
const FAQ = lazy(() => import("./components/FAQ"));
const ApplyForm = lazy(() => import("./components/ApplyForm"));
const ChatWidget = lazy(() => import("./components/ChatWidget"));
const AdminPanel = lazy(() => import("./components/AdminPanel"));

// High-fidelity elegant skeletal area fallback so that heights remain consistent during lazy mount
function SectionSkeleton() {
  return (
    <div className="w-full h-[600px] bg-brand-bg relative flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-cream/2 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
      <div className="w-12 h-12 rounded-full border-2 border-brand-gold/10 border-t-brand-gold animate-spin" />
    </div>
  );
}

export default function App() {
  const [isAdmin, setIsAdmin] = useState(window.location.hash === "#admin");
  const { config } = useConfig();
  const { contact, general } = config;

  useEffect(() => {
    const handleHashChange = () => {
      setIsAdmin(window.location.hash === "#admin");
      // Seamless luxury scrolling behavior between screen shifts
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return (
    <div id="top" className="bg-brand-bg min-h-screen text-brand-cream-dim relative selection:bg-brand-gold selection:text-brand-bg overflow-x-hidden">
      
      {/* Luxury Dual Ring Mouse Cursor */}
      <CustomCursor />

      {isAdmin ? (
        <Suspense fallback={<SectionSkeleton />}>
          <AdminPanel onClose={() => { window.location.hash = "#top"; }} />
        </Suspense>
      ) : (
        <>
          {/* Structural Components */}
          <Navbar />
          
          <main className="relative z-10">
            <Hero />
            <WhatsIncluded />
            
            <Suspense fallback={<SectionSkeleton />}>
              <Estimator />
            </Suspense>
            
            <Suspense fallback={<SectionSkeleton />}>
              <Fleet />
            </Suspense>
            
            <Suspense fallback={<SectionSkeleton />}>
              <Requirements />
            </Suspense>
            
            <Suspense fallback={<SectionSkeleton />}>
              <Testimonials />
            </Suspense>
            
            <Suspense fallback={<SectionSkeleton />}>
              <FAQ />
            </Suspense>

            {/* Final High-Fidelity Call-to-Action Section */}
            <section id="apply-now" className="py-20 sm:py-32 bg-brand-secondary border-t border-brand-muted/30 relative overflow-hidden">
              {/* Ambient background glows */}
              <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-brand-gold/5 blur-[120px] rounded-full pointer-events-none" />
              <div className="absolute bottom-0 right-10 w-[200px] sm:w-[300px] h-[200px] sm:h-[300px] bg-brand-gold/2 blur-[80px] rounded-full pointer-events-none" />

              <div className="max-w-4xl mx-auto px-6 text-center relative z-10 space-y-8">
                <div>
                  <span className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-[#B6B2AB] border border-brand-cream-dim/10 px-4 py-1.5 rounded-full bg-brand-bg/40 font-semibold inline-block">
                    Immediate Same-Day Dispatch
                  </span>
                  <h2 className="text-3xl sm:text-5xl md:text-6xl text-brand-cream mt-6 font-serif italic font-normal tracking-tight leading-tight">
                    Secure your premium ride. <br className="hidden sm:inline" />
                    Start driving <span className="text-brand-gold font-sans not-italic font-medium">on your terms</span> today.
                  </h2>
                  <p className="text-brand-cream-dim font-light text-sm sm:text-base md:text-lg max-w-2xl mx-auto mt-4 leading-relaxed">
                    Skip the credit checks and long wait times. Fill out our detailed 1-minute digital reservation form online, upload standard identity documents, and pick up your keys at your local metropolitan hub.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                  <a
                    href="#apply"
                    className="w-full sm:w-auto px-10 py-5 bg-brand-gold hover:bg-brand-gold-light text-brand-bg font-sans font-bold text-sm tracking-wider uppercase rounded-full shadow-xl shadow-brand-gold/10 transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer group"
                  >
                    Apply & Book Now
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
                  </a>
                  <a
                    href={`tel:${contact.phoneTel}`}
                    className="w-full sm:w-auto px-8 py-5 border border-brand-cream/10 text-brand-cream font-mono text-xs tracking-widest uppercase rounded-full hover:border-brand-gold/50 hover:bg-brand-gold/5 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Phone size={14} className="text-brand-gold" />
                    {contact.phone}
                  </a>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-12 border-t border-brand-cream/5 text-[#B6B2AB]">
                  <div className="space-y-1">
                    <span className="block font-mono text-[10px] uppercase tracking-widest text-brand-gold font-semibold">2-Hour Reply</span>
                    <span className="block text-xs font-light">Rapid verification</span>
                  </div>
                  <div className="space-y-1">
                    <span className="block font-mono text-[10px] uppercase tracking-widest text-brand-gold font-semibold">Zelle or Cash</span>
                    <span className="block text-xs font-light font-sans">No cards on file</span>
                  </div>
                  <div className="space-y-1">
                    <span className="block font-mono text-[10px] uppercase tracking-widest text-brand-gold font-semibold font-sans">Fully Certified</span>
                    <span className="block text-xs font-light font-sans">Worry-free maintenance</span>
                  </div>
                  <div className="space-y-1">
                    <span className="block font-mono text-[10px] uppercase tracking-widest text-brand-gold font-semibold font-sans">Refundable</span>
                    <span className="block text-xs font-light font-sans">Standard deposit model</span>
                  </div>
                </div>
              </div>
            </section>
            
            <Suspense fallback={<SectionSkeleton />}>
              <ApplyForm />
            </Suspense>
          </main>

          <Footer />

          {/* AI Chat Widget Concierge (Lazy loaded) */}
          <Suspense fallback={null}>
            <ChatWidget />
          </Suspense>

          {/* Mobile Sticky Bottom CTA Bar */}
          <div className="fixed bottom-0 left-0 w-full bg-brand-card/90 backdrop-blur-md border-t border-brand-cream/10 py-3.5 px-6 flex items-center justify-between z-40 lg:hidden shadow-lg">
            <div className="flex flex-col">
              <span className="text-[10px] font-mono uppercase tracking-wider text-brand-cream-subtle font-semibold leading-none">Vetted Registry</span>
              <span className="text-sm font-serif italic text-brand-gold leading-normal mt-0.5">{general.brandName} On-Demand</span>
            </div>
            <div className="flex items-center gap-3">
              <a
                href={`tel:${contact.phoneTel}`}
                className="p-2.5 border border-brand-cream/15 rounded-full text-brand-cream hover:text-brand-gold transition-colors"
                title="Call Support Hotline"
              >
                <PhoneCall size={14} />
              </a>
              <a
                href="#apply"
                className="px-5 py-2.5 bg-brand-gold hover:bg-brand-gold-light text-brand-bg text-xs font-bold tracking-widest uppercase rounded-full shadow-md shadow-brand-gold/10 transition-colors"
              >
                Get Started
              </a>
            </div>
          </div>
        </>
      )}

    </div>
  );
}

