"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function StudioStatement() {
  const sectionRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current.querySelectorAll(".reveal-fade"),
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 1.0,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-background py-32 md:py-48 lg:py-56 px-6 md:px-12 z-20 border-b border-border">
      <div className="max-w-4xl mx-auto text-center md:text-left">
        <span className="text-[10px] font-sans tracking-[0.3em] text-primary uppercase block mb-6 reveal-fade">
          PHILOSOPHY & ARTISTRY
        </span>
        
        <p className="font-serif text-3xl md:text-5xl lg:text-6xl text-foreground leading-[1.3] font-light tracking-tight reveal-fade">
          We believe in photography that feels like a <span className="italic text-primary font-normal">cinematic memory</span>. 
          By embracing organic shadow and composition, we create portraits and visual campaigns that transcend temporary trends.
        </p>
      </div>
    </section>
  );
}
