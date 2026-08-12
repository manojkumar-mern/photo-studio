"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollProvider({ children }) {
  const lenisRef = useRef(null);
  const pathname = usePathname();

  useEffect(() => {
    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
      infinite: false,
    });

    lenisRef.current = lenis;
    window.lenis = lenis;

    // Connect Lenis to GSAP ScrollTrigger
    lenis.on("scroll", () => {
      ScrollTrigger.update();
    });

    const updateRaf = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateRaf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      window.lenis = null;
      gsap.ticker.remove(updateRaf);
    };
  }, []);

  // Handle route transitions
  useEffect(() => {
    if (lenisRef.current) {
      // Instantly scroll to top on navigation to prevent being stuck at previous page height
      lenisRef.current.scrollTo(0, { immediate: true });
      // Wait a tick for Next.js DOM render then recalculate scroll dimensions
      setTimeout(() => {
        if (lenisRef.current) {
          lenisRef.current.resize();
        }
        ScrollTrigger.refresh();
      }, 50);
    }
  }, [pathname]);

  return <>{children}</>;
}
