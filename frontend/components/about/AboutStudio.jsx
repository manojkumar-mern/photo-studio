"use client";

import { useEffect, useRef } from "react";
import CinematicImage from "@/components/ui/CinematicImage";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function AboutStudio() {
  const containerRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Staggered text block reveals
      gsap.fromTo(
        containerRef.current.querySelectorAll(".reveal-text"),
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 1.0,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={containerRef} className="relative bg-background py-28 md:py-36 px-6 md:px-12 z-20 border-b border-border">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">

        {/* Left: Premium Team Image with Clip Reveal */}
        <div className="lg:col-span-5 relative h-[56vh] md:h-[68vh] bg-card rounded-xl border border-border overflow-hidden">
          <CinematicImage
            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop"
            alt="Pixel Bees Photos team member in a natural-light setting"
            fill
            revealType="clip-right"
            parallaxSpeed={0.15}
            imgClassName="grayscale hover:grayscale-0 transition-all duration-1000 ease-out"
            sizes="(max-width: 1024px) 92vw, 40vw"
          />
        </div>

        {/* Right: Copy */}
        <div className="lg:col-span-7 space-y-8">
          <div className="reveal-text">
            <span className="text-[10px] font-sans tracking-[0.3em] text-primary uppercase block mb-3">
              About the Studio
            </span>
            <h2 className="text-3xl md:text-5xl font-serif text-foreground">
              The faces behind the lens
            </h2>
          </div>

          <p className="text-base md:text-lg font-sans text-muted-foreground leading-relaxed max-w-2xl reveal-text">
            Pixel Bees Photos was built around a single conviction: that great photography is never rushed. We
            collaborate closely with each client to shape visual narratives that are premium in craft and
            timeless in character.
          </p>

          <p className="text-base md:text-lg font-sans text-muted-foreground leading-relaxed max-w-2xl reveal-text">
            Our approach is slow and intentional. We reject generic templates and compressed schedules,
            choosing instead to curate compositions that reveal authentic, honest character in every frame.
          </p>

          {/* Recognitions */}
          <div className="pt-8 border-t border-border space-y-6 reveal-text">
            <h3 className="text-[10px] font-sans tracking-[0.25em] text-foreground uppercase">
              Exhibitions &amp; Recognitions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans text-muted-foreground">
              <div className="py-2 border-b border-border">
                <p className="text-foreground font-medium">2025</p>
                <p className="text-[10px] text-muted-foreground/80">Group Exhibition · Mumbai Art Week</p>
              </div>
              <div className="py-2 border-b border-border">
                <p className="text-foreground font-medium">2024</p>
                <p className="text-[10px] text-muted-foreground/80">Editorial Feature · Aperture Quarterly</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
