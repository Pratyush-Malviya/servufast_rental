import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { FAQItem } from "../types";

export default function FAQ() {
  const [openId, setOpenId] = useState<number | null>(1); // default expand first

  const faqs: FAQItem[] = [
    {
      id: 1,
      question: "Who is responsible for the vehicle's maintenance?",
      answer: "We cover 100% of standard maintenance costs. Routine oil changes, brake alignments, general electrical tuning, and tire replacements are handled entirely by ServUfast at no extra cost to you.",
    },
    {
      id: 2,
      question: "How quickly can I get approved and obtain keys?",
      answer: "If your driver screening and active Driving License (DL) check out cleanly, approval takes under 24 hours. Sign the digital lease, set the deposit, and drive the car away same-day.",
    },
    {
      id: 3,
      question: "What is the security deposit amount, and when is it returned?",
      answer: "There is a fully-refundable security deposit of $100 for hatchbacks, $150 for sedans, and $200 for electric EVs. This deposit is placed in escrow security and is returned to your bank account or card within 48 hours of vehicle return.",
    },
    {
      id: 4,
      question: "What happens if there's an emergency breakdown or flat tire?",
      answer: "We operate a 24/7 dedicated transit rescue team across active city zones. In the event of any mechanical issue or breakdown, we dispatch an on-site towing truck and deliver a replacement vehicle to your spot immediately.",
    },
    {
      id: 5,
      question: "Are there any hard daily or weekly limits on mileage?",
      answer: "No. Unlike other rental agencies, ServUfast provides unlimited mileage on all vehicles. Take as many long-haul passenger rides or quick gig schedules as your daily timelines allow.",
    },
    {
      id: 6,
      question: "Can I drive the car for personal trips alongside gig shifts?",
      answer: "Yes, you have complete ownership of the vehicle during the rental period. The car is yours to use for both active commercial gig shifts (Uber, Lyft, DoorDash, etc.) and private family trips.",
    },
    {
      id: 7,
      question: "How are the weekly rental payments settled?",
      answer: "Payments are made weekly in cash or Zelle at vehicle pickup or via secure weekly transfer. This guarantees flexible booking for active gig partners without requiring credit cards on file.",
    },
    {
      id: 8,
      question: "Can I pause or terminate my rental lease easily?",
      answer: "Yes. Our lease schedules operate on a flexible cycle. You are free to return the car at the end of any rental week with zero penalties, provided you keep a 24-hour advance return notification.",
    },
  ];

  const toggleAccordion = (id: number) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="py-24 bg-brand-bg relative border-t border-brand-muted/30">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="mb-16 text-center">
          <span className="font-mono text-xs uppercase tracking-widest text-brand-gold font-medium">
            Registry Guidelines
          </span>
          <h2 className="text-3xl md:text-5xl text-brand-cream mt-2 leading-tight">
            Frequently asked <em className="text-brand-gold font-serif italic font-normal">inquiries</em>.
          </h2>
          <p className="text-brand-cream-dim font-light text-base mt-2">
            Clear, transparent parameters outlining how we serve our users and elite expert partners.
          </p>
        </div>

        {/* Accordions Container */}
        <div className="space-y-4">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className={`rounded-[12px] border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? "bg-brand-card/80 border-brand-gold/40 shadow-lg shadow-black/30"
                    : "bg-brand-card/30 border-brand-cream/5 hover:border-brand-gold/15"
                }`}
              >
                {/* Header Toggle Click */}
                <button
                  onClick={() => toggleAccordion(faq.id)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="font-serif text-lg sm:text-xl text-brand-cream hover:text-brand-gold transition-colors duration-150">
                    {faq.question}
                  </span>
                  <div className="p-2 bg-brand-muted/50 rounded-full text-brand-gold shrink-0 ml-4 transition-transform duration-200">
                    {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                  </div>
                </button>

                {/* Body Content with slide animation capability */}
                <div
                  className={`transition-all duration-300 ease-in-out px-6 ${
                    isOpen ? "max-h-[300px] pb-6 opacity-100" : "max-h-0 pb-0 opacity-0 pointer-events-none"
                  }`}
                >
                  <p className="text-brand-cream-dim text-sm sm:text-base font-light leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
