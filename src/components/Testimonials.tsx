import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Quote, ShieldAlert } from "lucide-react";
import { Testimonial } from "../types";

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Robert Vance",
      city: "San Francisco (Marina)",
      initials: "RV",
      quote: "Renting the Hatchback Pro Series model lets me earn my entire weekly rental rate in the first 1.5 days of driving. The rest of my week's revenue is pure take-home profit.",
      platform: "Hatchback Pro Series",
    },
    {
      id: 2,
      name: "Alan Brooks",
      city: "Seattle (Capitol Hill)",
      initials: "AB",
      quote: "ServUfast's zero-maintenance guarantee is a game changer. When my tire had a bad puncture during an active passenger trip, they swapped the car for me in under an hour.",
      platform: "Zero-Overhead Service",
    },
    {
      id: 3,
      name: "Patricia Chen",
      city: "Los Angeles (Santa Monica)",
      initials: "PC",
      quote: "Renting their premium Elantra Sedan for airport schedules has increased my driver acceptance rate by 45%. Clients immediately comment on the immaculate, pristine state of the cabin.",
      platform: "Premium Sedan Range",
    },
    {
      id: 4,
      name: "Jordan Miller",
      city: "Chicago (Lincoln Park)",
      initials: "JM",
      quote: "I switched to their Electric EV Fleet. Saving $20+ daily in standard gasoline bills has expanded my household margins immensely. No battery hassle or charging cables worries.",
      platform: "Electric EV Fleet",
    },
    {
      id: 5,
      name: "Steven Hall",
      city: "Boston (Back Bay)",
      initials: "SH",
      quote: "The digital validation process took under 24 hours. Sign, verify driver identity screening, pick up from the depot, and drive off. Absolute editorial styling and professional transparency.",
      platform: "Express Rental Setup",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <section id="reviews" className="py-24 bg-brand-secondary border-t border-brand-muted/30 relative">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="mb-16 text-center">
          <span className="font-mono text-xs uppercase tracking-widest text-brand-gold font-medium">
            Active Verified Testimony
          </span>
          <h2 className="text-3xl md:text-5xl text-brand-cream mt-2 leading-tight">
            Endorsed by those who expect <em className="text-brand-gold font-serif italic font-normal">nothing less</em> than the best.
          </h2>
        </div>

        {/* Testimonials Frame */}
        <div className="relative max-w-3xl mx-auto bg-brand-card border border-brand-cream/5 p-8 md:p-14 rounded-[24px] shadow-2xl shadow-black/60 overflow-hidden">
          
          {/* Decorative quote back-accent */}
          <Quote size={120} className="absolute -top-6 -right-6 text-brand-gold/5 pointer-events-none" />

          {/* Testimonial Active Slider content */}
          <div className="relative z-10 space-y-6">
            
            <Quote size={32} className="text-brand-gold" />

            <div className="min-h-[140px] flex items-center">
              <p className="text-brand-cream font-serif text-lg sm:text-xl lg:text-2xl font-light italic leading-relaxed">
                "{testimonials[activeIndex].quote}"
              </p>
            </div>

            {/* Profile Row */}
            <div className="flex items-center justify-between pt-6 border-t border-brand-muted/50">
              <div className="flex items-center gap-4">
                {/* Initials Fallback */}
                <div className="w-12 h-12 rounded-full bg-brand-muted border border-brand-gold/30 text-brand-gold flex items-center justify-center font-mono font-bold text-sm tracking-widest">
                  {testimonials[activeIndex].initials}
                </div>
                <div>
                  <h4 className="font-sans text-sm font-semibold text-brand-cream">
                    {testimonials[activeIndex].name}
                  </h4>
                  <p className="text-xs text-brand-cream-subtle">
                    {testimonials[activeIndex].city}
                  </p>
                </div>
              </div>

              {/* Service Subtype Badge */}
              <span className="font-mono text-[9px] uppercase tracking-widest text-brand-gold-light bg-brand-gold/15 border border-brand-gold/20 px-3 py-1 rounded-full font-medium">
                {testimonials[activeIndex].platform}
              </span>
            </div>

          </div>

          {/* Slider Handlers & Dots Navigation inside layout */}
          <div className="flex items-center justify-between mt-8 relative z-10 pt-4">
            
            {/* Dots */}
            <div className="flex gap-2.5">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === activeIndex ? "w-6 bg-brand-gold" : "w-2 bg-brand-cream-subtle/40 hover:bg-brand-cream-subtle"
                  }`}
                  aria-label={`Go to testimonial ${idx + 1}`}
                />
              ))}
            </div>

            {/* Arrows */}
            <div className="flex gap-2">
              <button
                onClick={handlePrev}
                className="p-2 rounded-full border border-brand-cream/10 text-brand-cream hover:border-brand-gold hover:text-brand-gold transition-colors"
                aria-label="Previous testimony"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={handleNext}
                className="p-2 rounded-full border border-brand-cream/10 text-brand-cream hover:border-brand-gold hover:text-brand-gold transition-colors"
                aria-label="Next testimony"
              >
                <ChevronRight size={16} />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
