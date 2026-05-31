import { useEffect, useState, useRef } from "react";

export default function CustomCursor() {
  const [isHidden, setIsHidden] = useState(true);

  // Direct DOM references for zero React re-render, maximum 120Hz/140Hz performance
  const outerRingRef = useRef<HTMLDivElement | null>(null);
  const centerDotRef = useRef<HTMLDivElement | null>(null);
  const trailRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Coordinates and system state refs
  const mousePos = useRef({ x: -100, y: -100 });
  const centerPos = useRef({ x: -100, y: -100 });
  const outerPos = useRef({ x: -100, y: -100 });
  const isHovered = useRef(false);
  const isHiddenRef = useRef(true);

  // Number of elegant trailing particles
  const numTrailPoints = 4;
  const trailCoords = useRef(
    Array.from({ length: numTrailPoints }, () => ({ x: -100, y: -100 }))
  );

  // Scaler interpolators
  const scaleOuter = useRef(1.0);
  const scaleCenter = useRef(1.0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (isHiddenRef.current) {
        isHiddenRef.current = false;
        setIsHidden(false);

        // Warm start: lock everything instantly to prevent visual snap jumps on initialization
        centerPos.current = { x: e.clientX, y: e.clientY };
        outerPos.current = { x: e.clientX, y: e.clientY };
        trailCoords.current.forEach((pt) => {
          pt.x = e.clientX;
          pt.y = e.clientY;
        });
      }
    };

    const handleMouseLeave = () => {
      isHiddenRef.current = true;
      setIsHidden(true);
    };

    const handleMouseEnter = () => {
      isHiddenRef.current = false;
      setIsHidden(false);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      // 1. Core global interactive elements
      const isGlobalInteractive = target.closest(
        "a, button, input, select, textarea, [role='button'], .cursor-pointer, .group\\/tooltip button, [onclick]"
      );

      // 2. High-fidelity section interactions (ApplyForm #apply and FAQ #faq)
      const isInApplyForm = target.closest("#apply");
      const isInFAQ = target.closest("#faq");

      let isLocalInteractive = false;
      if (isInApplyForm) {
        isLocalInteractive = !!(
          target.closest("button") ||
          target.closest("input") ||
          target.closest("select") ||
          target.closest("textarea") ||
          target.closest(".cursor-pointer") ||
          target.closest("label") ||
          target.closest(".border-dashed") || // File drag and drop upload containers
          target.closest("[type='file']") ||
          target.closest(".accent-brand-gold") // Target custom checkboxes
        );
      }

      if (isInFAQ) {
        isLocalInteractive = !!(
          target.closest("button") ||
          target.closest(".faq-trigger") ||
          target.closest(".accordion-header") ||
          (target.closest("span") && target.closest("button")) ||
          (target.closest("svg") && target.closest("button"))
        );
      }

      isHovered.current = !!isGlobalInteractive || isLocalInteractive;
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  // Frame calculation via requestAnimationFrame
  useEffect(() => {
    let animationFrameId: number;

    const updateCursor = () => {
      if (isHiddenRef.current) {
        animationFrameId = requestAnimationFrame(updateCursor);
        return;
      }

      const targetX = mousePos.current.x;
      const targetY = mousePos.current.y;

      // 1. Update Core Point Position: immediate precision lag
      const centerFactor = 0.38;
      centerPos.current.x += (targetX - centerPos.current.x) * centerFactor;
      centerPos.current.y += (targetY - centerPos.current.y) * centerFactor;

      // 2. Update Trail chain-link lag coords
      if (trailCoords.current.length > 0) {
        const ptZero = trailCoords.current[0];
        const factor0 = 0.28;
        ptZero.x += (centerPos.current.x - ptZero.x) * factor0;
        ptZero.y += (centerPos.current.y - ptZero.y) * factor0;
      }

      for (let i = 1; i < numTrailPoints; i++) {
        const prev = trailCoords.current[i - 1];
        const curr = trailCoords.current[i];
        const factor = 0.28 - i * 0.04;
        curr.x += (prev.x - curr.x) * Math.max(0.08, factor);
        curr.y += (prev.y - curr.y) * Math.max(0.08, factor);
      }

      // 3. Update Outer luxury elastic spring Ring position
      const outerFactor = 0.12;
      outerPos.current.x += (targetX - outerPos.current.x) * outerFactor;
      outerPos.current.y += (targetY - outerPos.current.y) * outerFactor;

      // 4. Update scale variables smoothly (expansion effect)
      const targetScaleOuter = isHovered.current ? 1.7 : 1.0;
      const targetScaleCenter = isHovered.current ? 0.35 : 1.0;

      scaleOuter.current += (targetScaleOuter - scaleOuter.current) * 0.15;
      scaleCenter.current += (targetScaleCenter - scaleCenter.current) * 0.18;

      // Apply transformations to DOM immediately bypasses React render overhead
      if (centerDotRef.current) {
        centerDotRef.current.style.transform = `translate3d(${centerPos.current.x}px, ${centerPos.current.y}px, 0) scale(${scaleCenter.current})`;
      }

      if (outerRingRef.current) {
        outerRingRef.current.style.transform = `translate3d(${outerPos.current.x}px, ${outerPos.current.y}px, 0) scale(${scaleOuter.current})`;
        outerRingRef.current.style.backgroundColor = isHovered.current
          ? "rgba(212, 175, 55, 0.14)"
          : "rgba(212, 175, 55, 0)";
        outerRingRef.current.style.borderColor = isHovered.current
          ? "rgba(230, 195, 80, 1)"
          : "rgba(212, 175, 55, 0.75)";
        outerRingRef.current.style.boxShadow = isHovered.current
          ? "0 0 15px rgba(212, 175, 55, 0.4), inset 0 0 6px rgba(212, 175, 55, 0.15)"
          : "none";
      }

      trailRefs.current.forEach((el, index) => {
        if (el) {
          const pt = trailCoords.current[index];
          const opacity = (1.0 - index / numTrailPoints) * 0.45;
          const scale = (1.0 - index / numTrailPoints) * 0.8;
          el.style.transform = `translate3d(${pt.x}px, ${pt.y}px, 0) scale(${scale})`;
          el.style.opacity = `${opacity}`;
        }
      });

      animationFrameId = requestAnimationFrame(updateCursor);
    };

    animationFrameId = requestAnimationFrame(updateCursor);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      className={`hidden md:block pointer-events-none fixed inset-0 z-[9999] transition-opacity duration-300 ${
        isHidden ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Outer Springing Premium Ring */}
      <div
        ref={outerRingRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-brand-gold pointer-events-none transition-shadow transition-colors duration-300 ease-out"
        style={{
          transform: "translate3d(-100px, -100px, 0)",
          transformOrigin: "center",
          backfaceVisibility: "hidden",
          willChange: "transform",
        }}
      />

      {/* Luxury Trailing Particles (Gold dust tail) */}
      {Array.from({ length: numTrailPoints }).map((_, index) => (
        <div
          key={index}
          ref={(el) => {
            if (trailRefs.current) {
              trailRefs.current[index] = el;
            }
          }}
          className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-brand-gold/60 pointer-events-none"
          style={{
            transform: "translate3d(-100px, -100px, 0)",
            transformOrigin: "center",
            backfaceVisibility: "hidden",
            willChange: "transform",
          }}
        />
      ))}

      {/* Core Precise Aiming Dot */}
      <div
        ref={centerDotRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-brand-gold pointer-events-none"
        style={{
          transform: "translate3d(-100px, -100px, 0)",
          transformOrigin: "center",
          backfaceVisibility: "hidden",
          willChange: "transform",
        }}
      />
    </div>
  );
}
