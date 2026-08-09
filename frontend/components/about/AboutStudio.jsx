"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function AboutStudio() {
  return (
    <section id="about" className="relative bg-background py-24 md:py-36 px-6 md:px-12 z-20 border-b border-border">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">

        <div className="lg:col-span-5 relative h-[56vh] md:h-[68vh] bg-card overflow-hidden rounded-xl border border-border">
          <Image
            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop"
            alt="AURA Studio team member in a natural-light setting"
            fill
            className="object-cover object-center grayscale hover:grayscale-0 transition-all duration-700"
            sizes="(max-width: 1024px) 92vw, 40vw"
          />
        </div>

        {/* Right: Copy */}
        <div className="lg:col-span-7 space-y-8">
          <div>
            <span className="text-[10px] font-sans tracking-[0.3em] text-primary uppercase block mb-3">
              About the Studio
            </span>
            <h2 className="text-3xl md:text-5xl font-serif text-foreground">
              The faces behind the lens
            </h2>
          </div>

          <p className="text-base md:text-lg font-sans text-muted-foreground leading-relaxed max-w-2xl">
            AURA Studio was built around a single conviction: that great photography is never rushed. We
            collaborate closely with each client to shape visual narratives that are premium in craft and
            timeless in character.
          </p>

          <p className="text-base md:text-lg font-sans text-muted-foreground leading-relaxed max-w-2xl">
            Our approach is slow and intentional. We reject generic templates and compressed schedules,
            choosing instead to curate compositions that reveal authentic, honest character in every frame.
          </p>

          {/* Recognitions */}
          <div className="pt-8 border-t border-border space-y-6">
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
