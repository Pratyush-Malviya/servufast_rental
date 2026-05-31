import { useState } from "react";
import { Check, ArrowRight, ShieldCheck, Star } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ServiceCard } from "../types";

function FleetSkeletonCard() {
  return (
    <div className="p-8 lg:p-10 rounded-[20px] bg-brand-card/70 backdrop-blur-md border border-brand-cream/5 flex flex-col justify-between glass-cyber-card shadow-lg shadow-black/40">
      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="h-3.5 w-24 bg-brand-muted/20 rounded shimmer-bg" />
          <div className="h-6 w-20 bg-brand-muted/30 rounded-full shimmer-bg" />
        </div>

        {/* Image Box Skeleton */}
        <div className="w-full aspect-[16/10] rounded-[12px] bg-brand-muted/20 mb-6 shimmer-bg" />

        {/* Title */}
        <div className="h-8 w-2/3 bg-brand-muted/30 rounded mb-4 shimmer-bg" />

        {/* Description */}
        <div className="space-y-2 mb-6">
          <div className="h-4 w-full bg-brand-muted/20 rounded shimmer-bg" />
          <div className="h-4 w-5/6 bg-brand-muted/20 rounded shimmer-bg" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 border-y border-brand-muted/40 py-6 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-3 w-16 bg-brand-muted/15 rounded shimmer-bg" />
              <div className="h-4 w-24 bg-brand-muted/25 rounded shimmer-bg" />
            </div>
          ))}
        </div>

        {/* Inclusions */}
        <div className="space-y-3 mb-8">
          <div className="h-3.5 w-32 bg-brand-muted/20 rounded mb-2 shimmer-bg" />
          <div className="space-y-2.5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-2.5 items-center">
                <div className="w-3.5 h-3.5 rounded-full bg-brand-muted/30 shrink-0 shimmer-bg" />
                <div className="h-3 w-4/5 bg-brand-muted/15 rounded shimmer-bg" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom CTA Block */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-t border-brand-muted/40 pt-6 gap-4">
        <div className="space-y-1.5">
          <div className="h-3 w-28 bg-brand-muted/20 rounded shimmer-bg" />
          <div className="h-6 w-20 bg-brand-muted/35 rounded shimmer-bg" />
        </div>
        <div className="h-10 w-32 bg-brand-muted/50 rounded-full shimmer-bg" />
      </div>
    </div>
  );
}

export default function Fleet() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isCategoryLoading, setIsCategoryLoading] = useState<boolean>(false);
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

  const handleCategoryChange = (catId: string) => {
    setIsCategoryLoading(true);
    setSelectedCategory(catId);
    // Mimic an premium network delay before resolving data for visual polish
    setTimeout(() => {
      setIsCategoryLoading(false);
    }, 450);
  };

  const handleSelect = (serviceTitle: string) => {
    const event = new CustomEvent("select-vehicle", { detail: { service: serviceTitle } });
    window.dispatchEvent(event);
  };

  const services: ServiceCard[] = [
    {
      id: "hatchback",
      title: "Hatchback Pro Series",
      description: "Highly fuel-efficient Toyota Yaris or compact Honda Fit models tailored for quick city delivery and passenger bookings.",
      category: "hatchback",
      badge: "Available now",
      stats: [
        { label: "Optimal Fuels", value: "Regular Gas" },
        { label: "Avg. Mileage", value: "32-38 MPG" },
        { label: "Partner Rating", value: "4.91 / 5" },
        { label: "Pickup Depot", value: "Central Metro Depots" },
      ],
      inclusions: [
        "Tested structural safety configurations",
        "Excellent air flow systems for maximum comfort",
        "Includes standard routine engine maintenance",
        "Full comprehensive zero-deductible insurance guard"
      ],
      price: "$150 / week",
      isAvailable: true,
      image: "https://images.unsplash.com/photo-1627454820516-dc767bcb4d3e?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "sedan",
      title: "Premium Sedan Range",
      description: "Elegant Toyota Corolla or spacious Hyundai Elantra models with comfortable rear legroom and enlarged trunk storage for high-value airport rides.",
      category: "sedan",
      badge: "Available now",
      stats: [
        { label: "Optimal Fuels", value: "Gas / Hybrid" },
        { label: "Trunk Cargo", value: "14+ Cubic Feet" },
        { label: "Partner Rating", value: "4.94 / 5" },
        { label: "Client Growth", value: "+45% Accept Rate" },
      ],
      inclusions: [
        "High rating layout perfect for prime hailing classes",
        "Real-time GPS security tracking pre-configured",
        "Complimentary high-tensile suspension screening",
        "Fully registered commercial rideshare compliance"
      ],
      price: "$200 / week",
      isAvailable: true,
      image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "electric",
      title: "Electric Zero-Emission EV Fleet",
      description: "Ultra-quiet, advanced Tesla Model 3 or Chevrolet Bolt EV vehicles with immediate fast-charger compatibility to maximize your pure margins.",
      category: "electric",
      badge: "Available now",
      stats: [
        { label: "Drive System", value: "100% Battery EV" },
        { label: "Real Range", value: "220+ miles / charge" },
        { label: "Partner Rating", value: "4.96 / 5" },
        { label: "Battery Guard", value: "Full OEM Warranty" },
      ],
      inclusions: [
        "Save $20+ daily in standard combustive fuel bills",
        "Direct priority ticketing on ride-hailing applications",
        "Includes standard fast-charger heavy cable hookups",
        "Zero-emission metropolitan green routing pass"
      ],
      price: "$220 / week",
      isAvailable: true,
      image: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "luxury",
      title: "Luxury Executive Series",
      description: "Spacious Toyota Sienna Hybrid or elite premium SUVs. Perfect for luxury airport charters and corporate transfers.",
      category: "luxury",
      badge: "Waitlist",
      stats: [
        { label: "Engine Type", value: "Premium Hybrid / Gas" },
        { label: "Seat Count", value: "7 Captain Seats" },
        { label: "Partner Rating", value: "4.98 / 5" },
        { label: "Onboard Tech", value: "Premium Acoustic" },
      ],
      inclusions: [
        "Plush luxury leather upholstery design and layout",
        "Access to elite high-paying long-haul hotel accounts",
        "24/7 dedicated executive fleet concierge hotline",
        "Double-vetted vehicle security escort setups"
      ],
      price: "$290 / week",
      isAvailable: false,
      image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80",
    },
  ];

  const filteredServices = selectedCategory === "all"
    ? services
    : services.filter(s => s.category === selectedCategory);

  return (
    <section id="fleet" className="py-24 bg-brand-secondary border-t border-brand-muted/30">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-6">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-brand-gold font-medium">
              Vetted Fleet Vehicles
            </span>
            <h2 className="text-3xl md:text-5xl text-brand-cream mt-2 leading-tight">
              Our <em className="text-brand-gold font-serif italic font-normal">curated premium</em> service fleet.
            </h2>
            <p className="text-brand-cream-dim font-light text-base mt-2 max-w-xl">
              Select from city hatchback models, long-range premium sedans, high-margin EVs, or premium luxury cruisers.
            </p>
          </div>

          {/* Nav Categories */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: "all", label: "All Vehicles" },
              { id: "hatchback", label: "Hatchbacks" },
              { id: "sedan", label: "Sedans" },
              { id: "electric", label: "Electric EV" },
              { id: "luxury", label: "Executive" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`px-5 py-2.5 rounded-full text-xs font-mono tracking-wider uppercase font-semibold border transition-all duration-200 ${
                  selectedCategory === cat.id
                    ? "bg-brand-cream text-brand-bg border-brand-cream shadow-md"
                    : "bg-transparent text-brand-cream-dim border-brand-cream/10 hover:border-brand-gold/40 hover:text-brand-cream"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Fleet Service Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={isCategoryLoading ? "loading" : selectedCategory}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.08
                }
              }
            }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch"
          >
            {isCategoryLoading ? (
              // Show skeleton cards during category transition
              Array.from({ length: filteredServices.length || 2 }).map((_, sIdx) => (
                <motion.div
                  key={`skeleton-${sIdx}`}
                  variants={{
                    hidden: { opacity: 0, y: 15 },
                    visible: { 
                      opacity: 1, 
                      y: 0,
                      transition: { duration: 0.45, ease: [0.25, 1, 0.5, 1] } 
                    }
                  }}
                >
                  <FleetSkeletonCard />
                </motion.div>
              ))
            ) : (
              // Actual high-end dynamic cards
              filteredServices.map((service) => (
                <motion.div
                  key={service.id}
                  variants={{
                    hidden: { opacity: 0, y: 15 },
                    visible: { 
                      opacity: 1, 
                      y: 0,
                      transition: { duration: 0.45, ease: [0.25, 1, 0.5, 1] } 
                    }
                  }}
                  className={`p-8 lg:p-10 rounded-[20px] bg-brand-card/70 backdrop-blur-md border transition-all duration-300 flex flex-col justify-between glass-cyber-card ${
                    service.isAvailable
                      ? "border-brand-cream/5 shadow-lg shadow-black/40"
                      : "border-brand-muted/40 opacity-60"
                  }`}
                >
                  <div>
                    {/* Top Headers */}
                    <div className="flex items-center justify-between gap-4 mb-6">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-brand-cream-subtle font-bold">
                        Category: {service.category}
                      </span>
                      <div className="relative group/tooltip">
                        <span
                          className={`px-3 py-1 text-[9px] font-mono uppercase tracking-widest rounded-full font-bold transition-all duration-200 cursor-help ${
                            service.isAvailable
                              ? "bg-emerald-950/60 text-emerald-400 border border-emerald-850/40"
                              : "bg-brand-muted/60 text-brand-cream-dim border border-brand-muted hover:border-brand-gold hover:text-brand-cream"
                          }`}
                        >
                          {service.badge}
                        </span>
                        {!service.isAvailable && (
                          <div className="absolute right-0 bottom-full mb-2 w-64 p-3 bg-brand-bg/95 backdrop-blur-md border border-brand-gold/30 rounded-lg shadow-xl shadow-black/80 opacity-0 group-hover/tooltip:opacity-100 pointer-events-none transition-all duration-300 transform translate-y-1 group-hover/tooltip:translate-y-0 z-50 text-left">
                            <p className="text-[11px] font-mono uppercase tracking-wider text-brand-gold font-bold mb-1">
                              Current Queue: ~4-6 Days
                            </p>
                            <p className="text-[10px] text-brand-cream-dim leading-relaxed font-light font-sans normal-case">
                              Leases are allocated first-come, first-served. Submit your application today to lock your waitlist priority and receive an automated instant notification as soon as a chassis is returned.
                            </p>
                            <div className="absolute top-full right-4 w-2 h-2 bg-brand-bg border-r border-b border-brand-gold/30 transform rotate-45 -translate-y-1" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Vehicle Photo Container */}
                    {service.image && (
                      <div className="w-full aspect-[16/10] rounded-[12px] overflow-hidden mb-6 border border-brand-cream/5 relative bg-brand-secondary/80">
                        {!loadedImages[service.id] && (
                          <div className="absolute inset-0 shimmer-bg z-10" />
                        )}
                        <img
                          src={service.image}
                          alt={service.title}
                          referrerPolicy="no-referrer"
                          onLoad={() => setLoadedImages(prev => ({ ...prev, [service.id]: true }))}
                          className={`w-full h-full object-cover filter brightness-[0.9] contrast-[1.05] transition-all duration-700 hover:scale-105 ${
                            loadedImages[service.id] ? "opacity-100 scale-100" : "opacity-0 scale-95"
                          }`}
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-secondary/50 via-transparent to-transparent pointer-events-none" />
                      </div>
                    )}

                    {/* Title */}
                    <h3 className="font-serif text-2xl sm:text-3xl text-brand-cream mb-3 group-hover:text-brand-gold transition-colors duration-150">
                      {service.title}
                    </h3>

                    {/* Description */}
                    <p className="text-brand-cream-dim font-light text-sm sm:text-base leading-relaxed mb-6">
                      {service.description}
                    </p>

                    {/* Stat Grid */}
                    <div className="grid grid-cols-2 gap-4 border-y border-brand-muted/40 py-6 mb-6">
                      {service.stats.map((stat, sIdx) => (
                        <div key={sIdx} className="space-y-1">
                          <span className="text-[10px] uppercase font-mono tracking-widest text-brand-cream-subtle font-medium block">
                            {stat.label}
                          </span>
                          <span className="font-mono text-sm text-brand-gold font-medium">
                            {stat.value}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Inclusions */}
                    <div className="space-y-3 mb-8">
                      <span className="text-xs uppercase font-mono tracking-widest text-brand-cream-dim font-semibold block">
                        What is Included:
                      </span>
                      <ul className="space-y-2.5">
                        {service.inclusions.map((inc, iIdx) => (
                          <li key={iIdx} className="flex gap-2.5 text-xs text-brand-cream-dim font-light items-start">
                            <Check size={14} className="text-brand-gold shrink-0 mt-0.5" />
                            <span>{inc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Bottom CTA Block */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-t border-brand-muted/40 pt-6 gap-4">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#827266] block font-semibold">
                        Transparent Price Schema
                      </span>
                      <span className="font-mono text-xl text-brand-cream font-medium">
                        {service.price}
                      </span>
                    </div>

                    {service.isAvailable ? (
                      <a
                        href="#apply"
                        onClick={() => handleSelect(service.title)}
                        className="inline-flex items-center gap-2 group/btn font-sans px-5 py-2.5 bg-brand-gold text-brand-bg text-xs font-bold tracking-widest uppercase rounded-full hover:bg-brand-gold-light hover:scale-103 transition-all duration-200"
                      >
                        Apply & Book <ArrowRight size={13} className="group-hover/btn:translate-x-1 transition-transform" />
                      </a>
                    ) : (
                      <a
                        href="#apply"
                        onClick={() => handleSelect(service.title)}
                        className="inline-flex items-center gap-2 font-sans px-5 py-2.5 border border-brand-cream/10 text-brand-cream-dim text-xs font-bold tracking-widest uppercase rounded-full hover:border-brand-gold hover:text-brand-gold transition-all duration-200"
                      >
                        Join Waitlist
                      </a>
                    )}
                  </div>

                </motion.div>
              ))
            )}
          </motion.div>
        </AnimatePresence>

        {/* Avg. Partner Rating Custom Bar Chart Section */}
        <div className="mt-16 bg-brand-card/30 border border-brand-cream/5 rounded-[24px] p-8 sm:p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-radial-gradient from-brand-gold/5 via-transparent to-transparent pointer-events-none" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left side explanation */}
            <div className="lg:col-span-4 space-y-4 col-span-1">
              <span className="font-mono text-xs uppercase tracking-widest text-brand-gold font-semibold block">
                Elite Performance Metrics
              </span>
              <h3 className="text-2xl sm:text-3xl text-brand-cream leading-tight">
                Average Partner <em className="text-brand-gold font-serif italic font-normal">Rating</em>
              </h3>
              <p className="text-brand-cream-dim font-light text-sm leading-relaxed">
                Our active partners maintain world-class ratings across all delivery and passenger applications. Clean, reliable, and premium vehicles ensure continuous client satisfaction and higher average tips.
              </p>
              <div className="pt-2 flex items-center gap-2 text-brand-cream">
                <span className="text-2xl font-serif font-bold text-brand-gold">4.95</span>
                <div className="space-y-0.5">
                  <div className="flex gap-0.5 text-brand-gold">
                    {[1, 2, 3, 4, 5].map((_, starIdx) => (
                      <Star key={starIdx} size={11} className="fill-brand-gold" />
                    ))}
                  </div>
                  <span className="font-mono text-[9px] uppercase tracking-wider text-brand-cream-subtle block">
                    Global Fleet Average
                  </span>
                </div>
              </div>
            </div>

            {/* Right side interactive bar chart visualization */}
            <div className="lg:col-span-8 space-y-6 col-span-1 w-full">
              {[
                {
                  name: "Hatchback Pro Series",
                  rating: 4.91,
                  percent: 91,
                  shifts: "4,200+ Shifts",
                  trips: "12,400+ Trips",
                  gradient: "from-emerald-950/40 via-emerald-800/80 to-emerald-500",
                },
                {
                  name: "Premium Sedan Range",
                  rating: 4.94,
                  percent: 94,
                  shifts: "8,600+ Shifts",
                  trips: "28,100+ Trips",
                  gradient: "from-brand-gold/20 via-brand-gold/60 to-brand-gold",
                },
                {
                  name: "Electric Zero-Emission EV Fleet",
                  rating: 4.96,
                  percent: 96,
                  shifts: "12,100+ Shifts",
                  trips: "41,500+ Trips",
                  gradient: "from-teal-900/30 via-teal-700/70 to-teal-400",
                },
                {
                  name: "Luxury Executive Series",
                  rating: 4.98,
                  percent: 98,
                  shifts: "2,400+ Shifts",
                  trips: "7,800+ Trips",
                  gradient: "from-amber-950/40 via-amber-700/80 to-brand-gold",
                },
              ].map((bar, barIdx) => {
                // Compute visual fill percentage normalizing the 4.88 to 5.0 scale for pristine distinct widths
                const visualFillPercent = Math.max(10, Math.min(100, Math.round(((bar.rating - 4.88) / (5.0 - 4.88)) * 100)));

                return (
                  <div key={barIdx} className="space-y-2 group/bar relative">
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs sm:text-sm font-semibold text-brand-cream font-sans group-hover/bar:text-brand-gold transition-colors duration-200">
                        {bar.name}
                      </span>
                      <div className="flex items-center gap-1.5 font-mono">
                        <span className="text-xs text-brand-cream-dim">Rating:</span>
                        <span className="text-xs font-bold text-brand-gold">{bar.rating}</span>
                        <span className="text-[10px] text-brand-cream-subtle font-light">/ 5.0</span>
                      </div>
                    </div>

                    <div className="relative">
                      {/* Bar Track */}
                      <div className="h-5 w-full bg-brand-muted/20 rounded-full overflow-hidden border border-brand-cream/5 flex relative">
                        {/* Progressive loading motion div */}
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${visualFillPercent}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.2, delay: barIdx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                          className={`h-full bg-gradient-to-r ${bar.gradient} rounded-full origin-left relative shadow-lg`}
                        />
                      </div>

                      {/* Floating Mini Reports card container that triggers elegantly on hover */}
                      <div className="absolute right-0 top-full mt-2 opacity-0 group-hover/bar:opacity-100 pointer-events-none transition-all duration-300 transform translate-y-1 group-hover/bar:translate-y-0 z-40 bg-brand-card/95 border border-brand-gold/30 rounded-xl p-3.5 shadow-2xl flex flex-wrap gap-4 items-center border-brand-gold/20 min-w-[280px]">
                        <div className="space-y-0.5">
                          <span className="text-[9px] uppercase font-mono tracking-widest text-[#827266] block">
                            Active Shifts
                          </span>
                          <span className="text-xs font-mono font-bold text-brand-cream block">
                            {bar.shifts}
                          </span>
                        </div>
                        <div className="w-px h-8 bg-brand-muted/40 hidden sm:block" />
                        <div className="space-y-0.5">
                          <span className="text-[9px] uppercase font-mono tracking-widest text-[#827266] block">
                            Trips Led
                          </span>
                          <span className="text-xs font-mono font-bold text-brand-cream block">
                            {bar.trips}
                          </span>
                        </div>
                        <div className="w-px h-8 bg-brand-muted/40 hidden sm:block" />
                        <div className="space-y-0.5">
                          <span className="text-[9px] uppercase font-mono tracking-widest text-brand-gold block">
                            Platform Match
                          </span>
                          <span className="text-xs font-mono font-bold text-brand-gold block uppercase">
                            99.8% Match
                          </span>
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Global Security Disclaimer Banner */}
        <div className="mt-12 bg-gradient-to-r from-brand-card to-brand-muted/10 border border-brand-cream/10 p-6 rounded-[16px] flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-start gap-4">
            <ShieldCheck size={36} className="text-brand-gold shrink-0" />
            <div className="space-y-1">
              <h4 className="font-serif text-lg text-brand-cream">Elite Insurance Protection Schema</h4>
              <p className="text-xs text-brand-cream-dim leading-relaxed font-light">
                Every booking is structured with instant accidental damage & public liability screening safeguards. 
                All partner payouts are secured under escrow guarantees.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0 bg-brand-muted/50 px-3.5 py-1.5 rounded-full">
            <Star size={14} className="text-brand-gold fill-brand-gold" />
            <span className="font-mono text-[10px] uppercase text-brand-cream tracking-wider font-semibold">Verified Safe Operations</span>
          </div>
        </div>

      </div>
    </section>
  );
}
