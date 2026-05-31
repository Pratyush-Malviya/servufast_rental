import { useState } from "react";
import { Calculator, ArrowRight, HelpCircle } from "lucide-react";
import { motion } from "motion/react";

export default function Estimator() {
  const [grossGigEarnings, setGrossGigEarnings] = useState(1500);
  const [vehicleType, setVehicleType] = useState<"hatchback" | "sedan" | "electric">("hatchback");

  // Rental rates based on vehicle classes
  const RENTAL_RATES = {
    hatchback: 150,
    sedan: 200,
    electric: 220,
  };

  // Fuel/Charging overhead coefficient estimates based on vehicle class efficiency
  const FUEL_RATES = {
    hatchback: 0.18, // 18% of gross spent on fuel
    sedan: 0.15,     // 15% spent on fuel (optimized diesel/CNG)
    electric: 0.06,  // 6% spent on charging
  };

  const rentalCost = RENTAL_RATES[vehicleType];
  const fuelCost = Math.round(grossGigEarnings * FUEL_RATES[vehicleType]);
  const netEarnings = Math.max(0, grossGigEarnings - rentalCost - fuelCost);

  // Calculate percentage slices for the visual stacked bar
  const rentalPct = (rentalCost / grossGigEarnings) * 100;
  const fuelPct = (fuelCost / grossGigEarnings) * 100;
  const netPct = (netEarnings / grossGigEarnings) * 100;

  return (
    <section id="estimator" className="py-12 sm:py-24 bg-brand-bg relative overflow-hidden border-t border-brand-muted/20">
      {/* Background radial highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-gold/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="mb-16 text-center lg:text-left">
          <span className="font-mono text-xs uppercase tracking-widest text-brand-gold font-bold bg-brand-gold/10 px-3.5 py-1 rounded-full border border-brand-gold/20 inline-block mb-3">
            Dynamic Revenue Calculator
          </span>
          <h2 className="text-3xl md:text-5xl text-brand-cream mt-2 leading-tight">
            See your potential <em className="text-brand-gold font-serif italic font-normal">earnings</em> unfold.
          </h2>
          <p className="text-brand-cream-dim font-light text-base mt-2 max-w-lg">
            Drag the slider to adjust your expected weekly gig earnings. Select a vehicle model to view live calculations for weekly rent, fuel or charging, and net take-home rewards.
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Controls Panel (Left) */}
          <div className="lg:col-span-7 bg-brand-card/60 backdrop-blur-md border border-brand-cream/5 p-8 rounded-[16px] flex flex-col justify-between space-y-8 glass-cyber-card">
            <div className="space-y-6">
              {/* Type selector */}
              <div>
                <label className="text-xs font-mono uppercase tracking-widest text-brand-cream-dim block mb-3 font-semibold">
                  Select Vehicle Class
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["hatchback", "sedan", "electric"] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setVehicleType(type)}
                      className={`py-3 px-2 rounded-md font-sans text-xs uppercase tracking-wider font-semibold border transition-all duration-200 ${
                        vehicleType === type
                          ? "bg-brand-gold text-brand-bg border-brand-gold shadow-md"
                          : "bg-brand-muted/40 text-brand-cream-dim border-brand-cream/5 hover:border-brand-gold/30 hover:text-brand-cream"
                      }`}
                    >
                      {type === "hatchback" ? "Hatchback" : type === "sedan" ? "Sedan" : "Electric EV"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Slider Container */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-widest text-brand-cream-dim font-semibold">
                    Expected Weekly Gig Revenue
                  </span>
                  <span className="font-mono text-xl text-brand-gold font-bold">${grossGigEarnings.toLocaleString("en-US")}</span>
                </div>
                
                <input
                  type="range"
                  min="600"
                  max="3000"
                  step="50"
                  value={grossGigEarnings}
                  onChange={(e) => setGrossGigEarnings(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-brand-muted rounded-lg appearance-none cursor-pointer accent-brand-gold"
                />
                
                <div className="flex justify-between text-[11px] font-mono text-brand-cream-subtle font-medium">
                  <span>$600 /wk</span>
                  <span>$1,800 /wk</span>
                  <span>$3,000 /wk</span>
                </div>
              </div>
            </div>

            {/* High-Tech Allocation Telemetry Bar */}
            <div className="space-y-3 pt-2">
              <span className="text-[10px] uppercase font-mono tracking-widest text-brand-cream-subtle font-bold block">
                Weekly Revenue Allocation Split
              </span>
              
              <div className="h-4 w-full rounded-full bg-brand-muted overflow-hidden flex shadow-inner border border-white/5 relative">
                {/* Net Earnings Slice */}
                <motion.div 
                  className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 relative group"
                  animate={{ width: `${netPct}%` }}
                  transition={{ type: "spring", stiffness: 80, damping: 15 }}
                />
                {/* Fuel/Charging Overheads Slice */}
                <motion.div 
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-400"
                  animate={{ width: `${fuelPct}%` }}
                  transition={{ type: "spring", stiffness: 80, damping: 15 }}
                />
                {/* Rental Cost Slice */}
                <motion.div 
                  className="h-full bg-gradient-to-r from-red-500 to-rose-600"
                  animate={{ width: `${rentalPct}%` }}
                  transition={{ type: "spring", stiffness: 80, damping: 15 }}
                />
              </div>

              {/* Stacked Bar Legend */}
              <div className="flex flex-wrap gap-x-5 gap-y-2 pt-1">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded bg-emerald-400" />
                  <span className="text-xs text-brand-cream-dim font-light">Net Profits ({Math.round(netPct)}%)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded bg-amber-400" />
                  <span className="text-xs text-brand-cream-dim font-light">Fuel/Charging ({Math.round(fuelPct)}%)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded bg-rose-500" />
                  <span className="text-xs text-brand-cream-dim font-light">Vehicle Rental ({Math.round(rentalPct)}%)</span>
                </div>
              </div>
            </div>

            {/* Information notice */}
            <div className="flex gap-3 bg-brand-muted/30 border-l border-brand-gold/40 p-4 rounded-r-md">
              <HelpCircle size={18} className="text-brand-gold shrink-0 mt-0.5" />
              <p className="text-xs text-brand-cream-dim leading-relaxed font-light">
                Our base estimation factors in our fixed all-inclusive weekly rental rate alongside standard metropolitan operating fuel profiles (approx. {FUEL_RATES[vehicleType]*100}% for {vehicleType === "electric" ? "EV charging cycles" : "clean combustive fuels"}).
              </p>
            </div>
          </div>

          {/* Result Panel (Right) */}
          <div className="lg:col-span-5 bg-brand-secondary border border-brand-gold/25 p-8 rounded-[16px] flex flex-col justify-between space-y-8 relative overflow-hidden">
            {/* Fine gold gradient mask */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/10 rounded-full blur-3xl pointer-events-none" />

            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-brand-gold font-semibold block mb-1">
                Estimated Net Take-Home
              </span>
              <h3 className="font-mono text-4xl sm:text-5xl lg:text-6xl text-brand-gold leading-none font-medium mt-1">
                <motion.span
                  key={netEarnings}
                  initial={{ opacity: 0.6, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  ${Math.round(netEarnings).toLocaleString("en-US")}
                </motion.span>
                <span className="text-xs font-sans tracking-normal text-brand-cream-dim lowercase font-light block mt-1">
                  your net cash / week
                </span>
              </h3>
            </div>

            {/* Stats Breakdown Grid */}
            <div className="space-y-4 border-t border-brand-muted py-6">
              <div className="flex justify-between items-center text-sm">
                <span className="text-brand-cream-dim font-light">Total Earned (Gross)</span>
                <span className="font-mono text-brand-cream font-medium">
                  ${grossGigEarnings.toLocaleString("en-US")}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-brand-cream-dim font-light">Weekly Rental Charge</span>
                <span className="font-mono text-brand-cream font-medium">
                  -${rentalCost.toLocaleString("en-US")}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-brand-cream-dim font-light">{vehicleType === "electric" ? "Charging Cycles Est." : "Fuel/CNG Expenses Est."}</span>
                <span className="font-mono text-brand-cream font-medium">
                  -${fuelCost.toLocaleString("en-US")}
                </span>
              </div>
            </div>

            {/* Action Trigger */}
            <a
              href="#apply"
              className="w-full inline-flex items-center justify-center gap-3 px-6 py-4 bg-brand-gold text-brand-bg text-xs font-bold tracking-widest uppercase rounded-full hover:bg-brand-gold-light transition-all duration-200"
            >
              Sign Up & Reserve Vehicle <ArrowRight size={14} />
            </a>

            <div className="text-[10px] font-mono text-brand-cream-subtle text-center">
              *Projections vary based on specific city fuel rates, driving style, and active ride-hailing demand parameters.
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
