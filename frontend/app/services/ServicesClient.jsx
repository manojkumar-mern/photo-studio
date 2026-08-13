"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { services } from "@/lib/data";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Ensure ScrollTrigger is registered
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const DETAIL_IMAGES = {
  fashion: "/photos/makeup_1.webp",
  weddings: "/photos/wedding_candid_2.webp", // The silhouette couple wedding photo
  portraiture: "/photos/portrait_1.webp"
};

export default function ServicesClient() {
  const containerRef = useRef(null);

  useEffect(() => {
    // ScrollTrigger setup
    let ctx = gsap.context(() => {
      const articles = containerRef.current?.querySelectorAll("article");
      if (articles && articles.length > 0) {
        articles.forEach((art, idx) => {
          const imgWrapper = art.querySelector(".service-img-wrapper");
          const mainFrame = imgWrapper?.querySelector(".service-img-main");
          const detailFrame = imgWrapper?.querySelector(".service-img-detail");
          const textBlock = art.querySelector(".service-text-wrapper");
          const isEven = idx % 2 === 0;

          // Initial states for image frames
          if (mainFrame) {
            gsap.set(mainFrame, {
              opacity: 0,
              x: isEven ? -60 : 60,
              y: 40,
              scale: 0.96,
              clipPath: "inset(100% 0% 0% 0%)"
            });
          }
          if (detailFrame) {
            gsap.set(detailFrame, {
              opacity: 0,
              x: isEven ? -90 : 90,
              y: 70,
              scale: 0.9,
              clipPath: "inset(100% 0% 0% 0%)"
            });
          }

          // Initial state for text elements
          const textElements = textBlock?.querySelectorAll("span, h2, p, div");
          if (textElements) {
            gsap.set(textElements, { opacity: 0, y: 30 });
          }

          // Timeline for reveal
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: art,
              start: "top 88%",
              toggleActions: "play none none none"
            }
          });

          // Animate main frame
          if (mainFrame) {
            tl.to(mainFrame, {
              opacity: 1,
              x: 0,
              y: 0,
              scale: 1,
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 1.3,
              ease: "power4.out"
            });
          }

          // Animate detail frame (overlapping)
          if (detailFrame) {
            tl.to(detailFrame, {
              opacity: 1,
              x: 0,
              y: 0,
              scale: 1,
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 1.5,
              ease: "power3.out"
            }, "-=1.1");
          }

          // Animate text elements staggered
          if (textElements && textElements.length > 0) {
            tl.to(textElements, {
              opacity: 1,
              y: 0,
              duration: 0.9,
              stagger: 0.1,
              ease: "power2.out"
            }, "-=1.2");
          }

          // Add subtle opposing parallax scrolls on scroll
          if (mainFrame) {
            gsap.fromTo(
              mainFrame,
              { yPercent: -4 },
              {
                yPercent: 4,
                ease: "none",
                scrollTrigger: {
                  trigger: art,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: true,
                  invalidateOnRefresh: true
                }
              }
            );
          }
          if (detailFrame) {
            gsap.fromTo(
              detailFrame,
              { yPercent: 6 },
              {
                yPercent: -8,
                ease: "none",
                scrollTrigger: {
                  trigger: art,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: true,
                  invalidateOnRefresh: true
                }
              }
            );
          }
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <Header />
      <main ref={containerRef} className="flex-1 bg-[#FAF8F5] pt-28 md:pt-32 pb-24 px-4 sm:px-6 md:px-12 text-[#1C1C1E] overflow-x-hidden w-full relative">
        <div className="max-w-7xl mx-auto">

          {/* Page heading */}
          <div className="mb-16 md:mb-20">
            <span className="text-[10px] font-sans tracking-[0.3em] text-primary uppercase block mb-3">
              Creative Formats
            </span>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif text-[#1C1C1E] mb-4">
              Our Services
            </h1>
            <p className="text-sm font-sans text-[#5C5C5E] max-w-xl leading-relaxed">
              We approach every project with custom creative direction. Explore our structured photography formats and booking details.
            </p>
          </div>

          {/* Services list */}
          <div className="space-y-20 md:space-y-32">
            {services.map((service, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <article
                  key={service.id}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-20 items-center border-t border-[#E8E4DC] pt-10 md:pt-12"
                  aria-labelledby={`service-heading-${service.id}`}
                >
                  {/* Image wrapper: Dual Cinematic Overlapping Layout */}
                  <div
                    className={`service-img-wrapper lg:col-span-5 relative h-[50vh] md:h-[58vh] max-h-[620px] w-full flex items-center justify-center ${
                      isEven ? "lg:order-1" : "lg:order-2"
                    }`}
                  >
                    {/* Main Image Frame */}
                    <div className="service-img-main relative w-[76%] h-[76%] sm:w-[82%] sm:h-[82%] bg-[#161618] overflow-hidden rounded-xl border border-border/40 shadow-2xl mr-auto mb-auto">
                      <Image
                        src={service.image}
                        alt={`${service.name} — main photography`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 80vw, 30vw"
                        priority
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F5]/10 to-transparent pointer-events-none" />
                    </div>

                    {/* Overlapping Detail Frame */}
                    <div className="service-img-detail absolute bottom-0 right-0 w-[44%] h-[44%] sm:w-[52%] sm:h-[52%] bg-[#161618] overflow-hidden rounded-xl border border-primary/20 shadow-2xl ml-auto mt-auto">
                      <Image
                        src={DETAIL_IMAGES[service.id]}
                        alt={`${service.name} — detail photography`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 45vw, 15vw"
                        priority
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F5]/15 to-transparent pointer-events-none" />
                    </div>
                  </div>

                  {/* Copy wrapper */}
                  <div
                    className={`service-text-wrapper lg:col-span-7 space-y-6 ${
                      isEven ? "lg:order-2" : "lg:order-1"
                    }`}
                  >
                    <div className="space-y-2">
                      <span className="text-[10px] font-sans tracking-[0.25em] text-primary block" aria-hidden="true">
                        {String(idx + 1).padStart(2, "0")} / Format
                      </span>
                      <h2
                        id={`service-heading-${service.id}`}
                        className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#1C1C1E]"
                      >
                        {service.name}
                      </h2>
                    </div>

                    <p className="text-sm font-sans text-[#4A4A4C] leading-relaxed">
                      {service.description}
                    </p>

                    <div className="space-y-2">
                      <h3 className="text-[10px] font-sans tracking-[0.2em] text-[#1C1C1E] uppercase font-semibold">
                        What&apos;s Included
                      </h3>
                      <ul className="text-xs font-sans text-[#5C5C5E] space-y-1.5 list-disc pl-4">
                        {service.includes.map((inc, i) => (
                          <li key={i}>{inc}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-1 pt-1">
                      <h3 className="text-[10px] font-sans tracking-[0.2em] text-[#1C1C1E] uppercase font-semibold">
                        Ideal For
                      </h3>
                      <p className="text-xs font-sans text-[#5C5C5E]">
                        {service.useCase}
                      </p>
                    </div>

                    <div className="pt-2">
                      <Link
                        href="/#book"
                        className="inline-block text-xs font-sans tracking-[0.2em] border border-primary/40 hover:border-primary text-primary hover:bg-[#1C1C1E] hover:text-white px-6 py-2.5 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md"
                      >
                        Book this service
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* CTA */}
          <div className="border-t border-[#E8E4DC] mt-24 md:mt-32 pt-20 md:pt-24 text-center space-y-7">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#1C1C1E] leading-tight">
              Ready to create something beautiful?
            </h2>
            <p className="text-sm font-sans text-[#5C5C5E] max-w-md mx-auto leading-relaxed">
              Share your visual ideas with us. We will collaborate to build a bespoke campaign or session.
            </p>
            <Link
              href="/#book"
              className="inline-block text-xs font-sans tracking-[0.25em] border border-primary text-primary hover:bg-[#1C1C1E] hover:text-white px-8 py-3 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md"
            >
              Book a Session
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
