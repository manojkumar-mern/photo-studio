"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { portfolioItems } from "@/lib/data";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function CornerBracket({ position }) {
  const transforms = {
    "top-left":    "top-3 left-3 rotate-0",
    "top-right":   "top-3 right-3 rotate-90",
    "bottom-right":"bottom-3 right-3 rotate-180",
    "bottom-left": "bottom-3 left-3 -rotate-90",
  };
  return (
    <span
      className={`absolute w-4 h-4 pointer-events-none z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${transforms[position]}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 12 L1 1 L12 1" stroke="#C5A880" strokeWidth="1.2" strokeLinecap="square" />
      </svg>
    </span>
  );
}

export default function SelectedWork() {
  const containerRef    = useRef(null);
  const scrollStripRef  = useRef(null);
  const headerRef       = useRef(null);
  const titleRef        = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isDesktop = window.innerWidth >= 1024;
    let ctx;

    ctx = gsap.context(() => {
      // 1. Text reveals for the section header
      gsap.fromTo(
        headerRef.current.querySelectorAll(".reveal-text"),
        { opacity: 0, y: 15 },
        {
          opacity: 1,
          y: 0,
          duration: 1.0,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // 2. Horizontal pinning & scroll layout (Desktop only)
      if (isDesktop && !prefersReducedMotion) {
        const getAnimateWidth = () => {
          const totalScrollWidth = scrollStripRef.current.scrollWidth;
          const vw = window.innerWidth;
          return Math.max(0, totalScrollWidth - vw);
        };

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            pin: true,
            anticipatePin: 1,
            scrub: 1.0,
            start: "top top",
            end: () => `+=${getAnimateWidth()}`,
            invalidateOnRefresh: true,
          },
        });

        // Translate the whole horizontal container
        timeline.to(scrollStripRef.current, {
          x: () => -getAnimateWidth(),
          ease: "none",
        });

        // Parallax the individual inner images within their cards
        const images = scrollStripRef.current.querySelectorAll(".parallax-inner-img");
        timeline.to(
          images,
          {
            xPercent: 12,
            ease: "none",
          },
          0
        );
      }
    }, containerRef);

    return () => {
      if (ctx) ctx.revert();
    };
  }, []);

  return (
    <div id="work" ref={containerRef} className="relative bg-background z-20 overflow-hidden">

      {/* ── Section Header ──────────────────────────────────── */}
      <div ref={headerRef} className="px-6 md:px-12 pt-20 md:pt-28 pb-10 max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-4 reveal-text">
          <div className="h-[1px] w-8 bg-primary flex-shrink-0" />
          <span className="text-[10px] font-sans tracking-[0.35em] text-primary uppercase font-medium">
            Portfolio Selection
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <h2 ref={titleRef} className="text-3xl md:text-5xl lg:text-6xl font-serif text-foreground leading-[1.05] reveal-text">
            Selected{" "}
            <span className="italic font-light text-gold-foil">narratives</span>
          </h2>

          <Link
            href="/work"
            className="group inline-flex items-center gap-3 text-[10px] font-sans tracking-[0.25em] text-muted-foreground hover:text-primary transition-colors uppercase self-start sm:self-auto flex-shrink-0 reveal-text"
          >
            View full archive
            <span className="inline-block w-8 h-[1px] bg-current group-hover:w-12 transition-all duration-300" />
          </Link>
        </div>
      </div>

      {/* ── Horizontal Gallery Strip ─────────────────────────── */}
      <div
        className="overflow-x-auto lg:overflow-x-hidden pb-12 lg:pb-0 w-full scrollbar-none"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <div
          ref={scrollStripRef}
          className="
            flex flex-row items-stretch
            gap-6 sm:gap-8
            px-6 md:px-12
            w-max
            snap-x snap-mandatory lg:snap-none
            h-[340px] sm:h-[400px] md:h-[440px] lg:h-[clamp(340px,calc(100svh-350px),500px)]
          "
        >
          {portfolioItems.map((item, idx) => {
            const isWide = idx % 3 === 0;
            return (
              <Link
                key={item.id}
                href={`/work/${item.slug}`}
                className="
                  group relative flex-shrink-0 overflow-hidden rounded-lg
                  bg-card border border-border/50
                  hover:border-primary/20 transition-colors duration-700
                  snap-start
                "
                style={{
                  width: isWide
                    ? "clamp(265px, 38vw, 560px)"
                    : "clamp(220px, 28vw, 420px)",
                }}
                aria-label={`View project: ${item.title}`}
              >
                {/* Image Mask Wrapper */}
                <div className="relative w-full h-full overflow-hidden">
                  {/* Inner Image with larger width to allow horizontal parallax movement */}
                  <div className="absolute inset-0 w-[115%] h-full left-[-7.5%] parallax-inner-img">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-103"
                      sizes="(max-width: 640px) 80vw, (max-width: 1024px) 50vw, 38vw"
                    />
                  </div>
                  {/* Subtle editorial vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-85 group-hover:opacity-90 transition-opacity duration-500" />
                </div>

                {/* Clean Corner brackets */}
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
                  <span className="inline-flex items-center px-2.5 py-1 text-[9px] font-sans tracking-[0.18em] uppercase font-medium backdrop-blur-sm bg-white/5 text-white/80 border border-white/10">
                    {item.category}
                  </span>
                </div>

                {/* Text content */}
                <div className="absolute inset-0 p-5 md:p-6 flex flex-col justify-end z-10">
                  <p className="text-[9px] font-sans tracking-[0.15em] text-white/40 uppercase mb-1">
                    {item.location} · {item.year}
                  </p>
                  <h3 className="text-lg md:text-2xl font-serif text-white leading-tight">
                    {item.title}
                  </h3>

                  {/* Reveal on hover */}
                  <div className="max-h-0 overflow-hidden group-hover:max-h-24 transition-all duration-500 ease-out">
                    <div className="w-8 h-[1px] bg-primary my-3" />
                    <p className="text-xs font-sans text-white/60 leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  {/* CTA arrow */}
                  <div className="mt-3 overflow-hidden h-5">
                    <div className="translate-y-5 group-hover:translate-y-0 transition-transform duration-300 ease-out inline-flex items-center gap-2">
                      <span className="text-[10px] font-sans tracking-[0.25em] text-primary uppercase font-medium">
                        View Story
                      </span>
                      <svg
                        className="w-3 h-3 text-primary"
                        fill="none"
                        viewBox="0 0 16 16"
                        stroke="currentColor"
                        strokeWidth={1.5}
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
              border border-dashed border-primary/20
              hover:border-primary/50 transition-colors duration-500
              px-8
            "
            style={{ width: "clamp(160px, 14vw, 240px)" }}
            aria-label="View all work"
          >
            <div className="relative w-12 h-12 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-primary/20 group-hover:border-primary/60 group-hover:scale-105 transition-all duration-500" />
              <svg
                className="w-4 h-4 text-primary group-hover:translate-x-0.5 transition-transform duration-300"
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
              <p className="text-[10px] font-sans tracking-[0.3em] text-primary uppercase font-medium">
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
      <div className="px-6 md:px-12 py-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-border to-transparent" />
          <span className="text-[9px] font-sans tracking-[0.3em] text-muted-foreground/45 uppercase">
            {portfolioItems.length} Projects
          </span>
          <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>
      </div>
    </div>
  );
}
