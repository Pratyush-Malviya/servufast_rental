import { motion } from "motion/react";
import { CheckCircle2, Award, ClipboardCheck, ArrowUpRight } from "lucide-react";

export default function Requirements() {
  const requirements = [
    {
      idx: "i.",
      title: "Valid U.S. Driver's License",
      description: "Must hold an active driver's license with at least 1 year of active city experience and zero severe traffic violations.",
    },
    {
      idx: "ii.",
      title: "Clean Background Vetting",
      description: "Zero records of litigations or serious driving infractions. We complete automated checks through trusted independent verification firms.",
    },
    {
      idx: "iii.",
      title: "Official Verification & ID Documents",
      description: "Requires digital submission of driving history, driver's license verification, and active credentials to generate the rental lease agreements securely.",
    },
    {
      idx: "iv.",
      title: "Verified Metropolitan Address",
      description: "Must be currently residing inside active municipal zones of San Francisco, Los Angeles, Seattle, Chicago, or Boston.",
    },
    {
      idx: "v.",
      title: "Active Mobile Number & Smartphone",
      description: "Must hold a smartphone possessing modern high-speed GPS connectivity to operate partner driving applications.",
    },
  ];

  const steps = [
    {
      idx: "01",
      label: "Select Vehicle & Apply",
      duration: "5 Mins Online",
      desc: "Specify your vehicle choice (Hatchback Pro, Premium Sedan, or Electric EV) and complete our rapid online reservation form.",
    },
    {
      idx: "02",
      label: "Digital Screening Approval",
      duration: "Under 24 Hrs Vetting",
      desc: "Our verification engine screens documentation on priority. Get approved and sign your digital lease contract instantly.",
    },
    {
      idx: "03",
      label: "Pick Up & Drive",
      duration: "Same-Day Handover",
      desc: "Collect your polished, fully insured rental vehicle from our regional city depot and begin high-yield gig driving immediately.",
    },
  ];

  return (
    <section id="requirements" className="py-12 sm:py-24 bg-brand-bg relative overflow-hidden border-t border-brand-muted/30">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Main Grid: Split Left & Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Left Block: Partner qualifications checklist */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-brand-gold font-medium">
                  Rental Qualifications
                </span>
                <h2 className="text-3xl md:text-5xl text-brand-cream mt-2 leading-tight">
                  Who qualifies to <em className="text-brand-gold font-serif italic font-normal">rent our vetted</em> vehicles.
                </h2>
                <p className="text-brand-cream-dim font-light text-base mt-2 max-w-lg">
                  We maintain a pristine standard of fleet trust and safety. Check our simple qualification guidelines before applying.
                </p>
              </div>

              {/* Checklists */}
              <div className="space-y-6 pt-4">
                {requirements.map((req, rIdx) => (
                  <div key={rIdx} className="flex gap-4 p-4 rounded-lg bg-brand-card/40 border border-brand-cream/5 hover:border-brand-gold/20 transition-all duration-200">
                    <span className="font-mono text-xs text-brand-gold tracking-widest uppercase pt-0.5 font-semibold">
                      {req.idx}
                    </span>
                    <div className="space-y-1">
                      <h4 className="font-sans text-sm font-semibold text-brand-cream">{req.title}</h4>
                      <p className="text-xs text-brand-cream-dim leading-relaxed font-light">{req.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Block: Three-step process */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-12">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-brand-cream-subtle font-semibold block">
                Workflow Mapping
              </span>
              <h3 className="font-serif text-3xl text-brand-cream leading-tight mt-2">
                A simple <em className="text-brand-gold font-serif italic font-normal">three-step transition</em> to get your keys.
              </h3>
              <p className="text-brand-cream-dim text-sm font-light leading-relaxed mt-2 max-w-md">
                Get driving without complex loops or redundant background steps with our digital validation system.
              </p>
            </div>

            {/* Workflow Step Blocks */}
            <div className="space-y-8 relative">
              {/* Optional joining dashed vertical track line for step aesthetics */}
              <div className="absolute top-4 bottom-4 left-6 border-l border-dashed border-brand-gold/20 hidden sm:block" />

              {steps.map((step, sIdx) => (
                <div key={sIdx} className="flex flex-col sm:flex-row items-start gap-5 relative z-10">
                  {/* Step Cycle badge */}
                  <div className="w-12 h-12 rounded-full border border-brand-gold bg-brand-bg text-brand-gold flex items-center justify-center font-mono text-sm shrink-0 font-bold shadow-lg shadow-brand-gold/5">
                    {step.idx}
                  </div>

                  <div className="space-y-1.5 pt-1.5">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <h4 className="font-sans text-base font-semibold text-brand-cream">{step.label}</h4>
                      <span className="font-mono text-[10px] uppercase text-brand-gold bg-brand-gold/10 px-2.5 py-0.5 rounded-full font-medium">
                        {step.duration}
                      </span>
                    </div>
                    <p className="text-sm font-light text-brand-cream-dim leading-relaxed max-w-md">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Callout banner */}
            <div className="bg-brand-card border border-brand-cream/5 p-6 rounded-[16px] border-l-4 border-l-brand-gold">
              <span className="font-mono text-[9px] uppercase tracking-widest text-brand-gold font-bold block mb-1">
                Security Escrow Safeguard
              </span>
              <p className="text-xs text-brand-cream-dim leading-relaxed font-light">
                All rental security deposits are securely placed in verified banking escrows and are returned instantly within 48 hours of vehicle return. No hidden onboarding processing deductions.
              </p>
              <a
                href="#apply"
                className="mt-3 inline-flex items-center gap-1.5 text-xs text-brand-gold hover:text-brand-gold-light transition-colors font-mono tracking-wider font-semibold"
              >
                Launch Verification Form <ArrowUpRight size={14} />
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
