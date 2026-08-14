"use client";

import Link from "next/link";
import { services } from "@/lib/data";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const HIGHLIGHTS = {
  standard: "Essential Value Focus",
  premium: "Highly Recommended",
  elite: "Signature Production"
};

const GOALS = {
  standard: "Best for branding lookbooks, model test portfolios, & fresh campaigns.",
  premium: "Best for authentic candid wedding moments, rituals, & heirloom print albums.",
  elite: "Best for grand scale events, luxury destination weddings, & live venue displays."
};

export default function HomeCategories() {
  const router = useRouter();

  return (
    <section className="bg-[#FAF8F5] py-20 md:py-28 px-6 md:px-12 border-b border-[#E8E4DC] relative z-20">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Section Title */}
        <div className="text-center space-y-3 max-w-3xl mx-auto scroll-reveal">
          <span className="text-[10px] font-sans tracking-[0.3em] text-[#C5A880] uppercase font-bold block">
            EXPERIENCE TIERS
          </span>
          <h2 className="text-3xl md:text-4xl font-serif text-[#1C1C1E] tracking-tight">
            Our Package Categories
          </h2>
          <p className="text-sm font-sans text-[#5C5C5E] leading-relaxed max-w-xl mx-auto">
            Select a card to view dynamic details, or book your preferred category directly below.
          </p>
        </div>

        {/* 3 Horizontal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-stretch pt-2">
          {services.map((service, idx) => {
            const isPremium = service.id === "premium";
            // Show only first 3 key inclusions for length shortness and neatness
            const shortInclusions = service.includes.slice(0, 3);
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: idx * 0.1, ease: "easeOut" }}
                whileHover={{ y: -8 }}
                onClick={() => router.push(`/services?category=${service.id}`)}
                className={`relative flex flex-col justify-between p-6 sm:p-8 rounded-xl border cursor-pointer transition-all duration-500 ${
                  isPremium
                    ? "bg-[#1C1C1E] border-[#C5A880] text-white shadow-xl scale-[1.02]"
                    : "bg-[#FFFFFF] border-[#E8E4DC] text-[#1C1C1E] shadow-sm hover:shadow-lg"
                }`}
              >
                {/* Premium Banner Tag */}
                {isPremium && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#C5A880] text-white rounded-full text-[8px] font-sans tracking-[0.2em] uppercase font-extrabold shadow-md">
                    Most Popular Choice
                  </div>
                )}

                {/* Card Top Information */}
                <div className="space-y-6 text-left">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-sans tracking-[0.2em] text-[#C5A880] uppercase font-extrabold">
                        0{idx + 1} / Tier
                      </span>
                      <span className={`text-[8px] font-sans tracking-widest uppercase font-bold ${
                        isPremium ? "text-primary-foreground/75" : "text-[#8C8C8E]"
                      }`}>
                        {HIGHLIGHTS[service.id]}
                      </span>
                    </div>
                    <h3 className="text-2xl font-serif leading-tight">
                      {service.categoryName}
                    </h3>
                    <p className={`text-[9px] font-sans tracking-[0.15em] uppercase font-bold block ${
                      isPremium ? "text-[#C5A880]" : "text-primary"
                    }`}>
                      {service.name} Focus
                    </p>
                  </div>

                  {/* Core Goal Purpose */}
                  <div className={`p-3.5 rounded-lg border text-xs font-sans leading-relaxed ${
                    isPremium 
                      ? "bg-[#2A2A2C]/50 border-[#C5A880]/30 text-white/90" 
                      : "bg-[#FAF8F5] border-[#E8E4DC] text-[#4A4A4C]"
                  }`}>
                    {GOALS[service.id]}
                  </div>

                  <div className="space-y-3">
                    <ul className="space-y-2.5">
                      {shortInclusions.map((benefit, i) => (
                        <li key={i} className="flex items-start text-xs font-sans leading-relaxed">
                          <span className="text-[#C5A880] text-xs font-bold mr-2 shrink-0">✓</span>
                          <span className={isPremium ? "text-white/80" : "text-[#4A4A4C]"}>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card Bottom Direct Booking CTA */}
                <div className="pt-6 mt-6 border-t border-[#E8E4DC]/20" onClick={(e) => e.stopPropagation()}>
                  <Link
                    href={`/booking?service=${encodeURIComponent(service.name)}&category=${encodeURIComponent(service.categoryName)}`}
                    className={`block text-center text-[10px] font-sans tracking-[0.2em] px-4 py-3 rounded-lg uppercase font-bold transition-all duration-300 focus:outline-none ${
                      isPremium
                        ? "bg-[#C5A880] text-white hover:bg-white hover:text-[#1C1C1E] shadow-md"
                        : "bg-[#1C1C1E] text-white hover:bg-[#C5A880] hover:text-white"
                    }`}
                  >
                    Book {service.categoryName}
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
