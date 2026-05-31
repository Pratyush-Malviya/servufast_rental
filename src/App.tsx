/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { lazy, Suspense } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import WhatsIncluded from "./components/WhatsIncluded";
import Footer from "./components/Footer";
import CustomCursor from "./components/CustomCursor";
import { PhoneCall } from "lucide-react";

// Lazy loaded below-the-fold heavy components for blazing-fast initial bundle loading
const Estimator = lazy(() => import("./components/Estimator"));
const Fleet = lazy(() => import("./components/Fleet"));
const Requirements = lazy(() => import("./components/Requirements"));
const Testimonials = lazy(() => import("./components/Testimonials"));
const FAQ = lazy(() => import("./components/FAQ"));
const ApplyForm = lazy(() => import("./components/ApplyForm"));
const ChatWidget = lazy(() => import("./components/ChatWidget"));

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
  return (
    <div id="top" className="bg-brand-bg min-h-screen text-brand-cream-dim relative selection:bg-brand-gold selection:text-brand-bg overflow-x-hidden">
      
      {/* Luxury Dual Ring Mouse Cursor */}
      <CustomCursor />

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

