"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function AboutStudio() {
  return (
    <section id="about" className="relative bg-[#0C0C0D] py-24 md:py-36 px-6 md:px-12 z-20 border-b border-white/5">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
        {/* Left Column: Portrait */}
        <div className="lg:col-span-5 relative h-[60vh] md:h-[70vh] bg-[#161618] overflow-hidden border border-white/5">
          <Image
            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop"
            alt="Studio Portrait Placeholder"
            fill
            className="object-cover object-center grayscale hover:grayscale-0 transition-all duration-750"
            sizes="(max-width: 1024px) 100vw, 40vw"
          />
        </div>

        {/* Right Column: Editorial Copy */}
        <div className="lg:col-span-7 space-y-8">
          <div>
            <span className="text-[10px] font-sans tracking-[0.3em] text-[#C5A880] uppercase block mb-3">
              ABOUT THE STUDIO
            </span>
            <h2 className="text-3xl md:text-5xl font-serif text-[#F4F1EA]">
              The faces behind the lens
            </h2>
          </div>

          <p className="text-sm font-sans text-[#8E8E93] leading-relaxed max-w-2xl">
            [Studio Biography Placeholder - A brief description of the studio's origin, artistic principles, and creative direction. This section will describe how the studio was formed to document raw human connections and editorial design.]
          </p>

          <p className="text-sm font-sans text-[#8E8E93] leading-relaxed max-w-2xl">
            [Our approach is slow and intentional. We reject rushed templates and fast schedules, choosing instead to curate compositions that reveal authentic, honest character in every frame.]
          </p>

          {/* Exhibition / Publication Placeholders (No fabricated awards) */}
          <div className="pt-8 border-t border-white/5 space-y-6">
            <h4 className="text-[10px] font-sans tracking-[0.25em] text-[#F4F1EA] uppercase">
              EXHIBITIONS & RECOGNITIONS
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans text-[#8E8E93]">
              <div className="py-2 border-b border-white/5">
                <p className="text-[#F4F1EA] font-medium">[Gallery Show Year]</p>
                <p className="text-[10px] text-[#8E8E93]/80">[Exhibition Title Placeholder · Location]</p>
              </div>
              <div className="py-2 border-b border-white/5">
                <p className="text-[#F4F1EA] font-medium">[Publication Year]</p>
                <p className="text-[10px] text-[#8E8E93]/80">[Editorial Feature Title Placeholder · Magazine Name]</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
