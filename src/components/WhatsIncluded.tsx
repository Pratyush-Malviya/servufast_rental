import { motion } from "motion/react";

export default function WhatsIncluded() {
  const inclusions = [
    {
      idx: "i.",
      title: "Comprehensive Commercial Insurance",
      description: "Full zero-depreciation coverage including premium bumper-to-bumper collision protection. You are covered 100% on active gig shifts and executive paths.",
    },
    {
      idx: "ii.",
      title: "Zero Maintenance Overhead",
      description: "Brakes, tire wear, regular service schedules, and electrical checks are completely on us. If something needs attention, swap for another vehicle immediately.",
    },
    {
      idx: "iii.",
      title: "Unlimited Gig Mileage",
      description: "Drive as much as your gig shifts require. There are no restrictive per-mileage caps or high penalty rates on Uber, Lyft, or delivery routes.",
    },
    {
      idx: "iv.",
      title: "24/7 Immediate Towing & Support",
      description: "In-transit emergency crew available. If any breakdown or puncture occurs, our roadside assistance team delivers a replacement vehicle to you right away.",
    },
    {
      idx: "v.",
      title: "Same-Day Setup & Active Driving",
      description: "Submit your KYC details quickly in our verification system. Pick up your vetted vehicle from our regional depot on the same day.",
    },
  ];

  return (
    <section id="whats-included" className="py-24 bg-brand-secondary border-t border-brand-muted/30">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="mb-16">
          <span className="font-mono text-xs uppercase tracking-widest text-brand-gold font-medium">
            Core Rental Standard
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl text-brand-cream mt-2 leading-tight">
            Designed for those who want a car that <em className="text-brand-gold font-serif italic font-normal">earns its own rate</em>.
          </h2>
        </div>

        {/* Vertical Inclusions List */}
        <div className="flex flex-col">
          {inclusions.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group border-t border-brand-muted/40 py-8 grid grid-cols-1 md:grid-cols-12 gap-4 hover:bg-brand-card/30 px-4 -mx-4 rounded-lg transition-colors duration-200"
            >
              {/* Roman Numeral */}
              <div className="md:col-span-1 font-mono text-xs text-brand-gold tracking-widest uppercase md:pt-1">
                {item.idx}
              </div>

              {/* Title */}
              <div className="md:col-span-4 font-serif text-xl sm:text-2xl text-brand-cream group-hover:text-brand-gold transition-colors duration-150">
                {item.title}
              </div>

              {/* Description */}
              <div className="md:col-span-7 text-brand-cream-dim text-sm sm:text-base font-light leading-relaxed">
                {item.description}
              </div>
            </motion.div>
          ))}
          {/* Bottom border capping off list */}
          <div className="border-t border-brand-muted/40"></div>
        </div>

      </div>
    </section>
  );
}
