"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { portfolioItems } from "@/lib/data";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ── Decorative corner bracket ────────────────────────────────
function CornerBracket({ position }) {
  const transforms = {
    "top-left":    "top-3 left-3 rotate-0",
    "top-right":   "top-3 right-3 rotate-90",
    "bottom-right":"bottom-3 right-3 rotate-180",
    "bottom-left": "bottom-3 left-3 -rotate-90",
  };
  return (
    <span
      className={`absolute w-5 h-5 pointer-events-none z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${transforms[position]}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 12 L1 1 L12 1" stroke="#C5A880" strokeWidth="1.5" strokeLinecap="square" />
      </svg>
    </span>
  );
}

// ── Constants ────────────────────────────────────────────────
const HEADER_HEIGHT = 88; // px — matches header py-6 + content ~88px

export default function SelectedWork() {
  const containerRef    = useRef(null);
  const scrollStripRef  = useRef(null);
  const headerRef       = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isDesktop = window.innerWidth >= 1024;
    let ctx;
    let scrollTimeout;

    if (isDesktop && !prefersReducedMotion) {
      ctx = gsap.context(() => {
        // Recalculate on resize via invalidateOnRefresh
        const getAnimateWidth = () => {
          const totalScrollWidth = scrollStripRef.current.scrollWidth;
          const vw = window.innerWidth;
          return Math.max(0, totalScrollWidth - vw);
        };

        const tl = gsap.to(scrollStripRef.current, {
          x: () => -getAnimateWidth(),
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            pin: true,
            anticipatePin: 1,
            scrub: 1.2,
            start: "top top",
            end: () => `+=${getAnimateWidth()}`,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (scrollStripRef.current) {
                scrollStripRef.current.classList.add("is-scrolling");
              }
              clearTimeout(scrollTimeout);
              scrollTimeout = setTimeout(() => {
                if (scrollStripRef.current) {
                  scrollStripRef.current.classList.remove("is-scrolling");
                }
              }, 100);
            }
          },
        });
      }, containerRef);
    }

    return () => { 
      if (ctx) ctx.revert(); 
      clearTimeout(scrollTimeout);
    };
  }, []);


  return (
    <div id="work" ref={containerRef} className="relative bg-background z-20">

      {/* ── Section Header ──────────────────────────────────── */}
      <div ref={headerRef} className="px-6 md:px-12 pt-16 md:pt-20 lg:pt-[120px] pb-10 lg:pb-10 max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-5">
          <div className="h-[1px] w-10 bg-primary flex-shrink-0" />
          <span className="text-[10px] font-sans tracking-[0.35em] text-primary uppercase font-semibold">
            Portfolio Selection
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif text-foreground leading-[1.05]">
            Selected{" "}
            <span className="italic font-light text-gold-foil">narratives</span>
          </h2>

          <Link
            href="/work"
            className="group inline-flex items-center gap-3 text-[10px] font-sans tracking-[0.25em] text-muted-foreground hover:text-primary transition-colors uppercase self-start sm:self-auto flex-shrink-0"
          >
            View full archive
            <span className="inline-block w-8 h-[1px] bg-current group-hover:w-12 transition-all duration-300" />
          </Link>
        </div>
      </div>

      {/* ── Horizontal Gallery Strip ─────────────────────────── */}
      {/*
        On mobile/tablet  → native horizontal scroll with snap
        On desktop (lg+)  → GSAP-driven scroll-pinned horizontal pan
      */}
      <div
        className="overflow-x-auto lg:overflow-x-hidden pb-10 lg:pb-0 w-full"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <div
          ref={scrollStripRef}
          className="
            flex flex-row items-stretch
            gap-4 sm:gap-5 lg:gap-6
            px-6 md:px-12
            w-max
            snap-x snap-mandatory lg:snap-none
            h-[340px] sm:h-[400px] md:h-[440px] lg:h-[clamp(340px,calc(100svh-350px),500px)]
          "
        >
          {portfolioItems.map((item, idx) => {
            // Wide card every 3rd item; standard otherwise
            const isWide = idx % 3 === 0;
            return (
              <Link
                key={item.id}
                href={`/work/${item.slug}`}
                className="
                  group relative flex-shrink-0 overflow-hidden rounded-lg
                  bg-card border border-border/50
                  hover:border-primary/30 transition-colors duration-500
                  snap-start
                  card-glow
                "
                style={{
                  width: isWide
                    ? "clamp(260px, 38vw, 580px)"
                    : "clamp(220px, 28vw, 440px)",
                }}
                aria-label={`View project: ${item.title}`}
              >
                {/* Image */}
                <div className="relative w-full h-full overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    sizes="(max-width: 640px) 80vw, (max-width: 1024px) 50vw, 38vw"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-500" />
                  {/* Top shimmer on hover */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary via-amber-200 to-primary scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 z-10" />
                  {/* Bottom glow */}
                  <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/60 to-transparent z-10" />
                </div>

                {/* Corner brackets */}
                <CornerBracket position="top-left" />
                <CornerBracket position="top-right" />
                <CornerBracket position="bottom-left" />
                <CornerBracket position="bottom-right" />

                {/* Index number */}
                <div className="absolute top-4 right-4 z-20">
                  <span className="font-serif text-[10px] tracking-[0.2em] text-white/20 select-none">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                </div>

                {/* Category badge */}
                <div className="absolute top-4 left-4 z-20">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[9px] font-sans tracking-[0.18em] uppercase font-semibold backdrop-blur-sm bg-white/10 text-white/80 border border-white/15">
                    {item.category}
                  </span>
                </div>

                {/* Text content */}
                <div className="absolute inset-0 p-5 md:p-6 flex flex-col justify-end z-10">
                  <p className="text-[10px] font-sans tracking-[0.15em] text-white/40 uppercase mb-1">
                    {item.location} · {item.year}
                  </p>
                  <h3 className="text-lg md:text-2xl lg:text-3xl font-serif text-white leading-tight">
                    {item.title}
                  </h3>

                  {/* Reveal on hover */}
                  <div className="max-h-0 overflow-hidden group-hover:max-h-24 transition-all duration-500 ease-out">
                    <div className="w-8 h-[1px] bg-primary my-3" />
                    <p className="text-xs font-sans text-white/65 leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  {/* CTA arrow */}
                  <div className="mt-3 overflow-hidden h-5">
                    <div className="translate-y-5 group-hover:translate-y-0 transition-transform duration-300 ease-out inline-flex items-center gap-2">
                      <span className="text-[10px] font-sans tracking-[0.25em] text-primary uppercase font-semibold">
                        View Story
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
                  </div>
                </div>
              </Link>
            );
          })}

          {/* ── End Card: View All CTA ─────────────────────── */}
          <Link
            href="/work"
            className="
              group relative flex-shrink-0 snap-start rounded-lg
              flex flex-col items-center justify-center gap-5
              border border-dashed border-primary/25
              hover:border-primary/60 transition-colors duration-500
              px-8
            "
            style={{ width: "clamp(140px, 14vw, 240px)" }}
            aria-label="View all work"
          >
            <div className="relative w-14 h-14 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-primary/30 group-hover:border-primary/70 group-hover:scale-110 transition-all duration-500" />
              <svg
                className="w-5 h-5 text-primary group-hover:translate-x-0.5 transition-transform duration-300"
                fill="none"
                viewBox="0 0 16 16"
                stroke="currentColor"
                strokeWidth={1.5}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </div>
            <div className="text-center space-y-1">
              <p className="text-[10px] font-sans tracking-[0.3em] text-primary uppercase font-semibold">
                Full Archive
              </p>
              <p className="text-[9px] font-sans tracking-[0.15em] text-muted-foreground uppercase">
                All Projects
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* ── Bottom decorative rule ───────────────────────────── */}
      <div className="px-6 md:px-12 py-7 max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-border to-transparent" />
          <span className="text-[9px] font-sans tracking-[0.3em] text-muted-foreground/50 uppercase">
            {portfolioItems.length} Projects
          </span>
          <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>
      </div>
    </div>
  );
}
