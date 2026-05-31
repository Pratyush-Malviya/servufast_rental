/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import WhatsIncluded from "./components/WhatsIncluded";
import Estimator from "./components/Estimator";
import Fleet from "./components/Fleet";
import Requirements from "./components/Requirements";
import Testimonials from "./components/Testimonials";
import FAQ from "./components/FAQ";
import ApplyForm from "./components/ApplyForm";
import ChatWidget from "./components/ChatWidget";
import Footer from "./components/Footer";
import CustomCursor from "./components/CustomCursor";
import { PhoneCall } from "lucide-react";

export default function App() {
  return (
    <div id="top" className="bg-brand-bg min-h-screen text-brand-cream-dim relative selection:bg-brand-gold selection:text-brand-bg overflow-x-hidden">
      
      {/* Luxury Dual Ring Mouse Cursor */}
      <CustomCursor />

      {/* Structural Components */}
      <Navbar />
      
      <main className="relative z-10">
        <Hero />
        <WhatsIncluded />
        <Estimator />
        <Fleet />
        <Requirements />
        <Testimonials />
        <FAQ />
        <ApplyForm />
      </main>

      <Footer />

      {/* AI Chat Widget Concierge */}
      <ChatWidget />

      {/* Mobile Sticky Bottom CTA Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-brand-card/90 backdrop-blur-md border-t border-brand-cream/10 py-3.5 px-6 flex items-center justify-between z-40 lg:hidden shadow-lg">
        <div className="flex flex-col">
          <span className="text-[10px] font-mono uppercase tracking-wider text-brand-cream-subtle font-semibold leading-none">Vetted Registry</span>
          <span className="text-sm font-serif italic text-brand-gold leading-normal mt-0.5">ServUfast On-Demand</span>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="tel:+18656969885"
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

    </div>
  );
}

