import { motion } from "motion/react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export default function Hero() {
  const headlineWords = "A car that earns its own weekly rate.".split(" ");

  const avatars = [
    { src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&h=80&q=80" },
    { src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80&q=80" },
    { src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80" },
    { src: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=80&h=80&q=80" },
  ];

  return (
    <section id="hero" className="w-full min-h-screen relative flex items-center bg-brand-bg pt-24 overflow-hidden grain-overlay cyber-grid">
      
      {/* Absolute floating futuristic ambient glowing spots */}
      <div className="glow-orb w-[400px] h-[400px] bg-brand-gold top-[-100px] left-[-50px] animate-wander-slow" />
      <div className="glow-orb w-[500px] h-[500px] bg-emerald-500/40 bottom-[-150px] right-[-100px] animate-wander-medium" />
      <div className="absolute top-[20%] right-[10%] w-[1px] h-[250px] bg-gradient-to-b from-transparent via-brand-gold/20 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 w-full z-10 relative">
        
        {/* Left Editorial Content */}
        <div className="lg:col-span-7 flex flex-col justify-center space-y-8">
          
          {/* Edition Badge */}
          <div className="flex items-center space-x-3">
            <span className="live-indicator"></span>
            <span className="font-mono text-[10px] uppercase tracking-widest text-brand-gold font-bold bg-brand-gold/10 px-3.5 py-1 rounded-full border border-brand-gold/30">
              Edition No. 01 · 2026
            </span>
          </div>

          {/* Staggered Heading */}
          <h1 className="leading-none tracking-tight text-brand-cream max-w-xl font-serif text-5xl sm:text-6xl lg:text-7xl">
            {headlineWords.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
                className="inline-block mr-3"
              >
                {word === "rate." ? (
                  <em className="text-brand-gold font-serif not-italic font-normal mr-1 drop-shadow-[0_0_15px_rgba(31,58,45,0.45)]">rate.</em>
                ) : (
                  word
                )}
              </motion.span>
            ))}
          </h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="text-brand-cream-dim text-base md:text-lg font-light leading-relaxed max-w-lg"
          >
            ServUfast delivers pristine weekly car rentals tailored for active gig drivers, executive chauffeurs, 
            and private fleet seekers. Zero maintenance worries, unlimited mileage, and comprehensive insurance are included as standard.
          </motion.p>

          {/* Call to Actions */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="flex flex-wrap items-center gap-4 pt-2"
          >
            <a
              href="#apply"
              className="inline-flex items-center gap-3 px-8 py-4 bg-brand-gold text-brand-bg text-xs font-bold tracking-widest uppercase rounded-full hover:bg-brand-gold-light hover:scale-103 transition-all duration-300 shadow-xl shadow-brand-gold/20"
            >
              Reserve Your Car <ArrowRight size={14} />
            </a>
            <a
              href="#estimator"
              className="inline-flex items-center gap-2 px-8 py-4 border border-brand-cream/10 text-brand-cream text-xs font-bold tracking-widest uppercase rounded-full hover:border-[#E6F0FA] hover:bg-[#E6F0FA]/5 transition-all duration-300"
            >
              Weekly Calculator
            </a>
          </motion.div>

          {/* Social Proof Strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 1.1 }}
            className="pt-6 border-t border-brand-muted/40 max-w-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="flex -space-x-3 overflow-hidden">
              {avatars.map((avatar, idx) => (
                <img
                  key={idx}
                  src={avatar.src}
                  alt={`Active Driver ${idx + 1}`}
                  referrerPolicy="no-referrer"
                  className="inline-block h-9 w-9 rounded-full ring-2 ring-brand-bg object-cover"
                />
              ))}
            </div>
            
            <div className="flex-1">
              <p className="text-xs font-mono tracking-wider text-brand-gold flex items-center gap-1.5 font-medium">
                <CheckCircle2 size={12} /> SERVING ACTIVE GIG DRIVERS
              </p>
              <p className="text-xs text-brand-cream-dim mt-0.5 font-sans">
                San Francisco · Los Angeles · Seattle · Chicago · Boston
              </p>
            </div>
          </motion.div>

        </div>

        {/* Right High-End Visual Element (Aesthetic crop and geometric cuts) */}
        <div className="lg:col-span-5 h-[340px] lg:h-[480px] relative w-full flex items-center justify-center">
          
          {/* Aesthetic wireframe bounding corners to represent high-tech scanning/precision */}
          <div className="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-brand-gold/60 pointer-events-none" />
          <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 border-brand-gold/60 pointer-events-none" />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, ease: "easeOut" }}
            className="w-full h-full relative border border-brand-cream/10 rounded-[12px] overflow-hidden shadow-2xl shadow-brand-gold/5"
            style={{
              clipPath: "polygon(0 0, 100% 0, 100% 100%, 8% 100%)",
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80"
              alt="Premium fleet rental options"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover select-none filter brightness-95 contrast-102 transition-transform duration-1000 hover:scale-105"
              loading="eager"
            />
            {/* Ambient vignette background mask */}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-bg/95 via-transparent to-brand-bg/30 z-1 pointer-events-none" />
            
            {/* Overlay holographic data stats badge */}
            <div className="absolute top-4 left-6 z-10 bg-brand-secondary/80 backdrop-blur-md border border-brand-gold/30 px-3 py-1.5 rounded-md flex items-center gap-2">
              <span className="live-indicator" />
              <span className="font-mono text-[9px] uppercase tracking-wider text-brand-gold font-bold">VERIFIED PLATFORM</span>
            </div>

            <div className="absolute bottom-6 right-6 z-10 bg-brand-card/90 backdrop-blur-md border border-brand-cream/10 px-4 py-3 rounded-md">
              <span className="font-mono text-[9px] uppercase tracking-widest text-brand-gold-light block font-semibold mb-0.5">Verified Fleet</span>
              <span className="text-xs text-brand-cream font-light">Commercial Insurance Guaranteed</span>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
