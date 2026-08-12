"use client";

import { useState, useRef, useEffect } from "react";
import { services } from "@/lib/data";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ServicesList() {
  const [activeIdx, setActiveIdx] = useState(0);
  const containerRef = useRef(null);
  const listRef = useRef(null);
  const imageContainerRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let ctx = gsap.context(() => {
      // Reveal the entire section contents on entry
      gsap.fromTo(
        containerRef.current.querySelectorAll(".reveal-fade"),
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 1.0,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Subtle parallax on the image wrapper
      if (!prefersReducedMotion && imageContainerRef.current) {
        gsap.fromTo(
          imageContainerRef.current.querySelector(".parallax-img"),
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Handle slide transitions for active service selection
  useEffect(() => {
    const activeImage = imageContainerRef.current?.querySelector(".active-service-img");
    if (activeImage) {
      gsap.fromTo(
        activeImage,
        { opacity: 0, scale: 1.03 },
        { opacity: 0.85, scale: 1.0, duration: 0.6, ease: "power2.out" }
      );
    }
  }, [activeIdx]);

  return (
    <section id="services" ref={containerRef} className="relative bg-[#FAF8F5] py-28 md:py-36 px-6 md:px-12 z-20 border-b border-[#E8E4DC]">
      <div className="max-w-7xl mx-auto">
        <span className="text-[10px] font-sans tracking-[0.3em] text-primary uppercase block mb-3 reveal-fade">
          CREATIVE SERVICES
        </span>
        <h2 className="text-3xl md:text-5xl font-serif text-[#1C1C1E] mb-16 reveal-fade">
          Photography experiences
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Services List Panel */}
          <div ref={listRef} className="lg:col-span-7 space-y-2 reveal-fade">
            {services.map((service, idx) => {
              const isActive = activeIdx === idx;
              return (
                <div
                  key={service.id}
                  onMouseEnter={() => setActiveIdx(idx)}
                  className={`py-8 border-b border-[#E8E4DC] cursor-pointer transition-opacity duration-500 ${
                    isActive ? "opacity-100" : "opacity-35 hover:opacity-60"
                  }`}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl md:text-3.5xl font-serif text-[#1C1C1E]">
                      {service.name}
                    </h3>
                    <span className="text-xs font-sans text-primary tracking-wider">
                      0{idx + 1}
                    </span>
                  </div>

                  {/* Elegant heights transition */}
                  <div
                    className={`overflow-hidden transition-all duration-500 ease-out`}
                    style={{
                      maxHeight: isActive ? "200px" : "0px",
                      opacity: isActive ? 1 : 0,
                    }}
                  >
                    <p className="text-base md:text-lg font-sans text-[#4A4A4C] leading-relaxed max-w-xl mb-6 mt-2">
                      {service.description}
                    </p>
                    <a
                      href="#book"
                      className="inline-block text-xs font-sans tracking-[0.2em] text-primary hover:text-[#1C1C1E] transition-colors"
                    >
                      BOOK SESSION →
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Service Photography Preview */}
          <div
            ref={imageContainerRef}
            className="lg:col-span-5 relative h-[50vh] md:h-[60vh] w-full bg-card overflow-hidden rounded-xl border border-border reveal-fade"
          >
            <div className="absolute inset-0 w-full h-[116%] top-[-8%] parallax-img">
              <Image
                key={activeIdx}
                src={services[activeIdx].image}
                alt={services[activeIdx].name}
                fill
                className="object-cover active-service-img"
                sizes="(max-width: 1024px) 100vw, 40vw"
                priority
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-30 pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
}
