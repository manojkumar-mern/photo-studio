"use client";

import { useEffect, useRef } from "react";
import { services } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SIZE_CLASSES = [
  "md:col-span-6",  // Fashion (Standard)
  "md:col-span-6",  // Weddings (Premium)
  "md:col-span-12", // Portraiture (Elite)
];

const ASPECT_CLASSES = [
  "aspect-[3/4]",
  "aspect-[3/4]",
  "aspect-[16/9] md:aspect-[21/9]",
];

export default function ServicesList() {
  const containerRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let ctx = gsap.context(() => {
      if (prefersReducedMotion) return;

      const cards = containerRef.current?.querySelectorAll(".service-card");
      if (cards && cards.length > 0) {
        cards.forEach((card) => {
          const img = card.querySelector("img");

          // Initial states
          gsap.set(card, {
            y: 100,
            opacity: 0,
            clipPath: "inset(100% 0% 0% 0%)"
          });
          if (img) {
            gsap.set(img, { scale: 1.25 });
          }

          // Timeline for reveal
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: card,
              start: "top 90%", // Trigger when top of card enters 90% viewport
              toggleActions: "play none none none"
            }
          });

          tl.to(card, {
            y: 0,
            opacity: 1,
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.3,
            ease: "power4.out"
          });

          if (img) {
            tl.to(img, {
              scale: 1.03,
              duration: 1.6,
              ease: "power3.out"
            }, "-=1.3");
          }
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="services" ref={containerRef} className="relative bg-[#FAF8F5] py-28 md:py-36 px-6 md:px-12 z-20 border-b border-[#E8E4DC]">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Section Header */}
        <div className="text-center md:text-left space-y-3">
          <span className="text-[10px] font-sans tracking-[0.3em] text-primary uppercase block">
            CREATIVE SERVICES
          </span>
          <h2 className="text-3xl md:text-5xl font-serif text-[#1C1C1E]">
            Photography experiences
          </h2>
          <p className="text-sm font-sans text-[#5C5C5E] max-w-xl leading-relaxed">
            Tailored visual storytelling formats designed around raw atmosphere, structure, and emotional authenticity.
          </p>
        </div>

        {/* Gallery-like Asymmetric Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          {services.map((service, idx) => (
            <div
              key={service.id}
              className={`service-card relative group overflow-hidden bg-[#161618] border border-border/40 rounded-xl cursor-pointer ${SIZE_CLASSES[idx]}`}
            >
              {/* Image Frame */}
              <div className={`relative w-full ${ASPECT_CLASSES[idx]} overflow-hidden`}>
                <Image
                  src={service.image}
                  alt={service.name}
                  fill
                  className="object-cover transition-all duration-[1200ms] ease-out group-hover:scale-[1.06]"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
                
                {/* Visual Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/10 z-10" />
                <div className="absolute -inset-1 border border-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-20" />

                {/* Card Top: Number */}
                <div className="absolute top-6 right-6 z-20">
                  <span className="font-sans text-xs tracking-widest text-primary font-bold">
                    0{idx + 1} / {service.categoryName.toUpperCase()}
                  </span>
                </div>

                {/* Card Bottom: Service Content Lockup */}
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 z-20 flex flex-col justify-end text-left transition-all duration-500 translate-y-[170px] sm:translate-y-[150px] md:translate-y-[140px] group-hover:translate-y-0">
                  <span className="text-[10px] font-sans tracking-[0.2em] text-primary uppercase font-bold mb-1.5">
                    {service.useCase}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-serif text-white mb-3 leading-tight">
                    {service.name}
                  </h3>
                  
                  {/* Expandable/Reveal Details */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 space-y-4 mt-2">
                    <p className="text-xs font-sans text-white/70 leading-relaxed max-w-lg">
                      {service.description}
                    </p>

                    {/* Features checklist */}
                    <ul className="text-[11px] font-sans text-white/60 space-y-1.5 border-l border-primary/40 pl-3 py-1">
                      {service.includes.map((inc, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="text-primary font-bold">✓</span> {inc}
                        </li>
                      ))}
                    </ul>

                    {/* Link */}
                    <Link
                      href={`/booking?service=${encodeURIComponent(service.name)}&category=${encodeURIComponent(service.categoryName)}`}
                      className="inline-flex text-[10px] font-sans tracking-[0.25em] text-primary font-bold uppercase hover:text-white transition-colors gap-1.5 mt-2"
                    >
                      BOOK SESSION <span className="text-xs">→</span>
                    </Link>
                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
