"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const containerRef = useRef(null);
  const imageWrapperRef = useRef(null);
  const imageRef = useRef(null);
  const contentWrapperRef = useRef(null);
  const titleRef = useRef(null);
  const categoryRef = useRef(null);
  const textRef = useRef(null);
  const ctaRef = useRef(null);
  const scrollIndicatorWrapperRef = useRef(null);
  const scrollIndicatorRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    
    let ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      if (prefersReducedMotion) {
        tl.fromTo(imageRef.current, { opacity: 0 }, { opacity: 0.45, duration: 1.5 })
          .fromTo([categoryRef.current, titleRef.current, textRef.current, ctaRef.current], { opacity: 0 }, { opacity: 1, duration: 1.0, stagger: 0.1 }, "-=0.8")
          .fromTo(scrollIndicatorRef.current, { opacity: 0 }, { opacity: 0.6, duration: 0.8 }, "-=0.3");
        return;
      }

      // Initial setup for entrance
      gsap.set(imageRef.current, { scale: 1.06, opacity: 0 });
      gsap.set([categoryRef.current, textRef.current, ctaRef.current], { opacity: 0, y: 25 });
      gsap.set(scrollIndicatorRef.current, { opacity: 0 });

      const titleLines = titleRef.current.querySelectorAll(".title-line");
      gsap.set(titleLines, { yPercent: 40, opacity: 0 });

      // Run entrance sequence with a slight delay and slower transitions
      tl.to(imageRef.current, { scale: 1.0, opacity: 0.45, duration: 2.2, ease: "power2.out" })
        .to(titleLines, { yPercent: 0, opacity: 1, duration: 1.4, stagger: 0.15, ease: "power4.out" }, "-=1.0")
        .to(categoryRef.current, { opacity: 1, y: 0, duration: 1.0 }, "-=0.7")
        .to([textRef.current, ctaRef.current], { opacity: 1, y: 0, duration: 1.0, stagger: 0.2 }, "-=0.5")
        .to(scrollIndicatorRef.current, { opacity: 0.6, duration: 1.2 }, "-=0.2");

      // Scroll-linked parallax & scale on background image wrapper
      gsap.to(imageWrapperRef.current, {
        yPercent: 8,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        }
      });

      // Fade out and blur copy elements wrapper on scroll
      gsap.to([contentWrapperRef.current, scrollIndicatorWrapperRef.current], {
        opacity: 0,
        y: -30,
        filter: "blur(10px)",
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "60% top",
          scrub: true,
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} data-no-scroll-blur="true" className="relative min-h-[100svh] w-full overflow-hidden flex items-center justify-center bg-background">
      {/* Background Cinematic Image */}
      <div ref={imageWrapperRef} className="absolute inset-0 z-0 overflow-hidden">
        <div ref={imageRef} style={{ opacity: 0 }} className="relative w-full h-[110%] top-[-5%]">
          <Image
            src="/images/hero.png"
            alt="Cinematic Portrait Cover"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>
        {/* Deep Overlay Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/35 z-10" />
      </div>

      {/* Content Overlay */}
      <div ref={contentWrapperRef} className="relative z-20 max-w-7xl mx-auto w-full px-6 md:px-12 text-center md:text-left flex flex-col justify-center md:justify-end min-h-[100svh] pt-28 md:pt-36 lg:pt-44 pb-20 md:pb-28">
        {/* Micro Category */}
        <span
          ref={categoryRef}
          style={{ opacity: 0 }}
          className="text-xs font-sans tracking-[0.3em] text-primary mb-4 uppercase block"
        >
          FINE ART & EDITORIAL PHOTOGRAPHY
        </span>

        {/* Huge Title */}
        <h1
          ref={titleRef}
          className="text-5xl md:text-8xl lg:text-9xl font-serif text-foreground leading-[0.9] tracking-tight max-w-4xl"
        >
          <span className="block overflow-hidden py-1">
            <span className="title-line block" style={{ opacity: 0 }}>Capturing the</span>
          </span>
          <span className="block overflow-hidden py-1">
            <span className="title-line italic font-light text-primary block" style={{ opacity: 0 }}>essence of shadow</span>
          </span>
        </h1>

        {/* Subtitle / CTA */}
        <div className="mt-8 flex flex-col md:flex-row items-center md:items-end justify-between gap-6">
          <p
            ref={textRef}
            style={{ opacity: 0 }}
            className="text-base md:text-lg font-sans text-muted-foreground max-w-sm leading-relaxed text-center md:text-left"
          >
            We document timeless human narratives, styling high-contrast compositions with raw, organic elegance.
          </p>

          <div ref={ctaRef} style={{ opacity: 0 }}>
            <a
              href="#work"
              className="group text-xs font-sans tracking-[0.25em] text-foreground hover:text-primary transition-colors inline-flex items-center gap-2"
            >
              EXPLORE WORKS
              <span className="inline-block transform group-hover:translate-x-1 transition-transform duration-200">
                →
              </span>
            </a>
          </div>
        </div>
      </div>
      
      {/* Scroll Down Indicator */}
      <div
        ref={scrollIndicatorWrapperRef}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
      >
        <div
          ref={scrollIndicatorRef}
          style={{ opacity: 0 }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-[9px] font-sans tracking-[0.2em] text-muted-foreground uppercase">SCROLL</span>
          <div className="w-[1px] h-8 bg-gradient-to-b from-muted-foreground to-transparent animate-pulse" />
        </div>
      </div>
    </section>
  );
}
