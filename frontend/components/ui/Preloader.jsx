"use client";

import { useEffect, useState, useRef } from "react";
import gsap from "gsap";

export default function Preloader() {
  const [show, setShow] = useState(true);
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);

  useEffect(() => {
    // Lock scroll on mount
    if (typeof window !== "undefined") {
      document.body.style.overflow = "hidden";
      window.lenis?.stop();
    }

    // GSAP entrance animation for the title and subtitle
    if (titleRef.current && subtitleRef.current) {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, scale: 0.93, y: 40 },
        { opacity: 1, scale: 1, y: 0, duration: 1.5, ease: "power4.out" }
      );
      gsap.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1.2, delay: 0.6, ease: "power2.out" }
      );
    }

    // Set timeline for fading out the preloader
    const timer = setTimeout(() => {
      if (containerRef.current) {
        gsap.to(containerRef.current, {
          yPercent: -100,
          opacity: 0,
          duration: 1.2,
          ease: "power4.inOut",
          onComplete: () => {
            setShow(false);
            // Unlock scroll
            document.body.style.overflow = "";
            window.lenis?.start();
          }
        });
      }
    }, 2800);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "";
      window.lenis?.start();
    };
  }, []);

  if (!show) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-[#070708] z-[99999] flex flex-col items-center justify-center px-6 pointer-events-auto"
      style={{ willChange: "transform, opacity" }}
    >
      <div className="text-center space-y-4 max-w-4xl w-full">
        {/* Animated Cursive Brand Title with Swirling Liquid Gold Gradient Mask */}
        <h1
          ref={titleRef}
          className="preloader-title fiery-glow-effect select-none"
        >
          Pixelbees Photography
        </h1>
        
        {/* Subtitle with a soft arrival fade */}
        <p
          ref={subtitleRef}
          className="text-[10px] font-sans tracking-[0.35em] uppercase text-primary/75 pt-4"
        >
          Emotion through Photos
        </p>
      </div>

      <style jsx global>{`
        @keyframes flameFlow {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes fireGlowCycle {
          0%, 100% {
            filter: drop-shadow(0 0 15px rgba(255, 190, 60, 0.4)) 
                    drop-shadow(0 0 35px rgba(255, 105, 0, 0.15));
          }
          50% {
            filter: drop-shadow(0 0 25px rgba(255, 215, 130, 0.65)) 
                    drop-shadow(0 0 55px rgba(255, 120, 0, 0.35));
          }
        }

        .preloader-title {
          font-family: var(--font-cursive), cursive !important;
          font-size: clamp(48px, 9.5vw, 110px) !important;
          line-height: 1.1;
          text-transform: none !important;
          background: linear-gradient(
            135deg,
            #d4af37 0%,
            #ffffff 25%,
            #f3e5ab 50%,
            #111111 75%,
            #d4af37 100%
          );
          background-size: 200% 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: flameFlow 4s ease infinite, fireGlowCycle 2.5s infinite ease-in-out;
        }

        .fiery-glow-effect {
          will-change: filter, background-position;
        }
      `}</style>
    </div>
  );
}
