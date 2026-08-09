"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, animate } from "framer-motion";
import Image from "next/image";

// Decorative corner bracket
function CornerBracket({ position }) {
  const pos = {
    "top-left":    "top-3 left-3 rotate-0",
    "top-right":   "top-3 right-3 rotate-90",
    "bottom-right":"bottom-3 right-3 rotate-180",
    "bottom-left": "bottom-3 left-3 -rotate-90",
  };
  return (
    <span className={`absolute w-5 h-5 pointer-events-none z-30 ${pos[position]}`} aria-hidden="true">
      <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 12 L1 1 L12 1" stroke="#C5A880" strokeWidth="1.5" strokeLinecap="square" />
      </svg>
    </span>
  );
}

// ── Category accent colours ──────────────────────────────────
// Keys must exactly match the category strings used in data.js
const CATEGORY_ACCENTS = {
  "FASHION EDITORIAL":   { bg: "bg-amber-400/20",  text: "text-amber-300",  dot: "bg-amber-400"  },
  "WEDDING DOCUMENTARY": { bg: "bg-rose-400/20",   text: "text-rose-300",   dot: "bg-rose-400"   },
  "FINE ART PORTRAIT":   { bg: "bg-sky-400/20",    text: "text-sky-300",    dot: "bg-sky-400"    },
  "COMMERCIAL BRAND":    { bg: "bg-violet-400/20", text: "text-violet-300", dot: "bg-violet-400" },
};
const DEFAULT_ACCENT = { bg: "bg-primary/20", text: "text-primary", dot: "bg-primary" };

// ── Heights for grid cards ────────────────────────────────────
// Note: col-span logic must live in the PARENT grid, not here.
// This component only controls its own height.
const CARD_HEIGHTS = ["h-[58vh] sm:h-[64vh]", "h-[46vh] sm:h-[52vh]", "h-[46vh] sm:h-[52vh]"];

export default function PortfolioCard({ item, idx, onClick }) {
  // Read reduced-motion preference.
  // The initial value is evaluated lazily inside useState so it runs
  // once on the client without triggering the setState-in-effect lint rule.
  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const hoverProgress  = useMotionValue(0);
  const hoverSpring    = useSpring(hoverProgress, { damping: 28, stiffness: 200 });
  const imageScale     = useTransform(hoverSpring, [0, 1], [1, 1.06]);
  const overlayOpacity = useTransform(hoverSpring, [0, 1], [0.55, 0.78]);
  const textY          = useTransform(hoverSpring, [0, 1], [16, 0]);
  const textOpacity    = useTransform(hoverSpring, [0, 1], [0, 1]);
  const bracketOpacity = useTransform(hoverSpring, [0, 1], [0, 1]);
  const shimmerScaleX  = useTransform(hoverSpring, [0, 1], [0, 1]);

  const handleMouseEnter = () => {
    if (reducedMotion) return;
    animate(hoverProgress, 1, { duration: 0.4, ease: "easeOut" });
  };
  const handleMouseLeave = () => {
    animate(hoverProgress, 0, { duration: 0.5, ease: "easeInOut" });
  };

  const heightClass = CARD_HEIGHTS[idx % 3];
  const accent      = CATEGORY_ACCENTS[item.category] ?? DEFAULT_ACCENT;

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => onClick(item)}
      tabIndex={0}
      role="button"
      aria-label={`View project: ${item.title}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick(item);
        }
      }}
      className={`
        group relative w-full cursor-pointer overflow-hidden card-glow
        focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background
        ${heightClass}
      `}
    >
      {/* ── Image ────────────────────────────────────────── */}
      <motion.div
        style={{ scale: reducedMotion ? 1 : imageScale }}
        className="absolute inset-0 w-full h-full"
      >
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 45vw"
          priority={idx === 0}
        />
      </motion.div>

      {/* ── Gradient overlay ─────────────────────────────── */}
      <motion.div
        style={{ opacity: reducedMotion ? 0.65 : overlayOpacity }}
        className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent z-10"
      />

      {/* ── Top shimmer strip ────────────────────────────── */}
      <div className="absolute top-0 left-0 right-0 h-[2px] z-20 overflow-hidden">
        <motion.div
          style={{
            scaleX: reducedMotion ? 1 : shimmerScaleX,
            transformOrigin: "left",
          }}
          className="h-full bg-gradient-to-r from-primary via-amber-200 to-primary"
        />
      </div>

      {/* ── Corner brackets ──────────────────────────────── */}
      <motion.div
        style={{ opacity: reducedMotion ? 0 : bracketOpacity }}
        className="absolute inset-0 z-20 pointer-events-none"
      >
        <CornerBracket position="top-left" />
        <CornerBracket position="top-right" />
        <CornerBracket position="bottom-right" />
        <CornerBracket position="bottom-left" />
      </motion.div>

      {/* ── Index number ─────────────────────────────────── */}
      <div className="absolute top-4 right-4 z-20" aria-hidden="true">
        <span className="font-serif text-[10px] tracking-[0.2em] text-white/25 select-none">
          {String(idx + 1).padStart(2, "0")}
        </span>
      </div>

      {/* ── Category badge ───────────────────────────────── */}
      <div className="absolute top-4 left-4 z-20">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[9px] font-sans tracking-[0.2em] uppercase font-semibold backdrop-blur-sm border border-white/10 ${accent.bg} ${accent.text}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${accent.dot}`} />
          {item.category}
        </span>
      </div>

      {/* ── Bottom text ──────────────────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-5 md:p-7">
        <div className="mb-1">
          <span className="text-[10px] font-sans tracking-[0.15em] text-white/40 uppercase">
            {item.location} · {item.year}
          </span>
        </div>
        <h3 className="text-xl md:text-2xl lg:text-3xl font-serif text-white leading-tight mb-2">
          {item.title}
        </h3>

        {/* Animated reveal */}
        <motion.div
          style={{
            y:       reducedMotion ? 0 : textY,
            opacity: reducedMotion ? 1 : textOpacity,
          }}
          className="overflow-hidden"
        >
          <div className="w-8 h-[1px] bg-primary mb-3" />
          <p className="text-xs font-sans text-white/70 leading-relaxed max-w-md mb-3 line-clamp-2">
            {item.description}
          </p>
          <div className="inline-flex items-center gap-2">
            <span className="text-[10px] font-sans tracking-[0.25em] text-primary font-semibold uppercase">
              View Project
            </span>
            <svg
              className="w-3 h-3 text-primary"
              fill="none"
              viewBox="0 0 16 16"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </div>
        </motion.div>
      </div>

      {/* ── Bottom border accent ──────────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent z-20" />
    </div>
  );
}
