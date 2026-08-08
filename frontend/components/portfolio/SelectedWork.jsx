"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { portfolioItems } from "@/lib/data";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export default function SelectedWork() {
  const containerRef = useRef(null);
  const scrollSectionRef = useRef(null);

  useEffect(() => {
    // Check user preference for reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // We only enable GSAP ScrollTrigger on desktop viewports and if user allows motion
    const isDesktop = window.innerWidth >= 1024;

    let pinContext;

    if (isDesktop && !prefersReducedMotion) {
      pinContext = gsap.context(() => {
        const scrollWidth = scrollSectionRef.current.scrollWidth;
        const viewportWidth = window.innerWidth;
        const animateWidth = scrollWidth - viewportWidth;

        gsap.to(scrollSectionRef.current, {
          x: -animateWidth,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            pin: true,
            scrub: 1,
            start: "top top",
            end: () => `+=${animateWidth}`,
            invalidateOnRefresh: true,
          },
        });
      }, containerRef);
    }

    return () => {
      if (pinContext) pinContext.revert();
    };
  }, []);

  return (
    <div id="work" ref={containerRef} className="relative bg-background z-20">
      {/* Section Header */}
      <div className="px-6 md:px-12 py-16 md:py-24 max-w-7xl mx-auto">
        <span className="text-[10px] font-sans tracking-[0.3em] text-primary block mb-3 uppercase">
          PORTFOLIO SELECTION
        </span>
        <h2 className="text-3xl md:text-5xl font-serif text-foreground">
          Selected narratives
        </h2>
      </div>

      {/* Horizontal Gallery Wrapper */}
      <div className="overflow-x-auto lg:overflow-x-hidden pb-12 lg:pb-0 scrollbar-thin">
        <div
          ref={scrollSectionRef}
          className="flex flex-row space-x-6 md:space-x-12 px-6 md:px-12 w-max lg:h-[70vh] items-center"
        >
          {portfolioItems.map((item) => (
            <div
              key={item.id}
              className="relative w-[80vw] sm:w-[50vw] lg:w-[45vw] h-[55vh] lg:h-full bg-card flex-shrink-0 group overflow-hidden border border-border"
            >
              {/* Image Container */}
              <div className="relative w-full h-full">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 80vw, 45vw"
                />
                {/* Visual Gradient Dark Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-75 group-hover:opacity-90 transition-opacity duration-300" />
              </div>

              {/* Text Hover Content - Focus on Client Experience */}
              <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-end text-left">
                <span className="text-[10px] font-sans tracking-[0.25em] text-primary mb-2 uppercase">
                  {item.category}
                </span>
                <h3 className="text-2xl md:text-3xl font-serif text-foreground mb-1">
                  {item.title}
                </h3>
                <p className="text-xs font-sans text-muted-foreground tracking-[0.1em] mb-6">
                  {item.location} · {item.year}
                </p>
                <div className="overflow-hidden">
                  <span className="text-[10px] font-sans tracking-[0.25em] text-foreground group-hover:text-primary inline-flex items-center gap-2 transform translate-y-6 group-hover:translate-y-0 transition-transform duration-300">
                    VIEW STORY <span className="text-xs">→</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
