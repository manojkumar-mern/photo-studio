"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * A cinematic, premium image wrapper that animates on viewport entry and scroll.
 * Supports clip-path reveals, scale animation, and scroll parallax.
 */
export default function CinematicImage({
  src,
  alt,
  fill = false,
  width,
  height,
  className = "",
  imgClassName = "",
  revealType = "clip-down", // 'clip-down', 'clip-right', 'scale-down', 'fade'
  parallaxSpeed = 0.15, // 0 for no parallax, positive value (e.g., 0.15) for scroll-linked offset
  priority = false,
  sizes,
  ...props
}) {
  const containerRef = useRef(null);
  const imageWrapperRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const wrapper = imageWrapperRef.current;
    const img = imageRef.current;

    if (!container || !wrapper || !img) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let ctx = gsap.context(() => {
      // Fallback: If reduced motion is preferred, simple fade reveal and no parallax
      if (prefersReducedMotion) {
        gsap.fromTo(
          wrapper,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 1.0,
            ease: "power2.out",
            scrollTrigger: {
              trigger: container,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
        return;
      }

      // 1. Reveal Animation Setup
      if (revealType === "clip-down") {
        gsap.fromTo(
          wrapper,
          { clipPath: "inset(0% 0% 100% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.4,
            ease: "power3.inOut",
            scrollTrigger: {
              trigger: container,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
        // Subtle counter-scale to make reveal look organic
        gsap.fromTo(
          img,
          { scale: 1.15 },
          {
            scale: 1.0,
            duration: 1.6,
            ease: "power3.out",
            scrollTrigger: {
              trigger: container,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      } else if (revealType === "clip-right") {
        gsap.fromTo(
          wrapper,
          { clipPath: "inset(0% 100% 0% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.4,
            ease: "power3.inOut",
            scrollTrigger: {
              trigger: container,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
        gsap.fromTo(
          img,
          { scale: 1.15 },
          {
            scale: 1.0,
            duration: 1.6,
            ease: "power3.out",
            scrollTrigger: {
              trigger: container,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      } else if (revealType === "scale-down") {
        gsap.fromTo(
          wrapper,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 1.0,
            ease: "power2.out",
            scrollTrigger: {
              trigger: container,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
        gsap.fromTo(
          img,
          { scale: 1.12 },
          {
            scale: 1.0,
            duration: 1.4,
            ease: "power2.out",
            scrollTrigger: {
              trigger: container,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      } else {
        // Simple Fade
        gsap.fromTo(
          wrapper,
          { opacity: 0, y: 15 },
          {
            opacity: 1,
            y: 0,
            duration: 1.0,
            ease: "power2.out",
            scrollTrigger: {
              trigger: container,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // 2. Parallax Effect linked continuously to scrolling
      if (parallaxSpeed > 0) {
        // Animate the image wrapper offset
        gsap.fromTo(
          img,
          { yPercent: -10 * parallaxSpeed },
          {
            yPercent: 10 * parallaxSpeed,
            ease: "none",
            scrollTrigger: {
              trigger: container,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      }
    }, container);

    return () => ctx.revert();
  }, [revealType, parallaxSpeed]);

  const styleObj = fill
    ? { position: "relative", width: "100%", height: "100%" }
    : { position: "relative", width: width ? `${width}px` : "auto", height: height ? `${height}px` : "auto" };

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden relative ${className}`}
      style={styleObj}
      {...props}
    >
      <div
        ref={imageWrapperRef}
        className="w-full h-full overflow-hidden"
        style={{
          clipPath: prefersRevealClip(revealType) ? "inset(0% 100% 0% 0%)" : "none",
          width: "100%",
          height: "100%",
        }}
      >
        <div ref={imageRef} className="w-full h-full relative" style={{ height: parallaxSpeed > 0 ? "115%" : "100%", top: parallaxSpeed > 0 ? "-7.5%" : "0" }}>
          <Image
            src={src}
            alt={alt}
            fill={true}
            priority={priority}
            className={`object-cover ${imgClassName}`}
            sizes={sizes}
          />
        </div>
      </div>
    </div>
  );
}

function prefersRevealClip(type) {
  return type === "clip-down" || type === "clip-right";
}
