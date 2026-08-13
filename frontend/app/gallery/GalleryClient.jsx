"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DraggableCardBody, DraggableCardContainer } from "@/components/ui/draggable-card";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import { unusedTestimonials } from "@/lib/data";

// Ensure ScrollTrigger is registered
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const CATEGORIES = ["ALL", "WEDDINGS", "PORTRAITS", "FASHION", "EVENTS"];

const GALLERY_ITEMS = [
  {
    id: 1,
    title: "Bridal Splendor",
    category: "WEDDINGS",
    src: "/photos/bridal_look_1.jpg",
    aspectRatio: "aspect-[3/4]",
    sizeClass: "md:col-span-5",
    description: "Elegant traditional bridal portrait with focus on fine details and expressions."
  },
  {
    id: 2,
    title: "Subtle HD Glow",
    category: "PORTRAITS",
    src: "/photos/skin_finish_1.jpg",
    aspectRatio: "aspect-[3/4]",
    sizeClass: "md:col-span-4",
    description: "Flawless skin finish makeup portrait under professional studio lighting."
  },
  {
    id: 3,
    title: "Festive Joy",
    category: "EVENTS",
    src: "/photos/thats_a_wrap_1.jpg",
    aspectRatio: "aspect-square",
    sizeClass: "md:col-span-6",
    description: "Cozy and warm festive settings capturing the holiday spirit."
  },
  {
    id: 4,
    title: "Editorial Statement",
    category: "FASHION",
    src: "/photos/model_shoot_1.jpg",
    aspectRatio: "aspect-[4/5]",
    sizeClass: "md:col-span-6",
    description: "High-fashion model photography focused on pose and styling."
  },
  {
    id: 13,
    title: "The Icing on the Cake",
    category: "FASHION",
    src: "/photos/beauty_jewelry_1.jpg",
    aspectRatio: "aspect-[3/4]",
    sizeClass: "md:col-span-4",
    description: "Exquisite bridal jewelry details showcasing intricate patterns and classic craftsmanship."
  },
  {
    id: 14,
    title: "Golden Candid Vows",
    category: "WEDDINGS",
    src: "/photos/bridal_candid_3.jpg",
    aspectRatio: "aspect-video",
    sizeClass: "md:col-span-8",
    description: "Intimate and warm candid moments captured during the traditional wedding ceremony."
  },
  {
    id: 5,
    title: "Glamour Curation",
    category: "FASHION",
    src: "/photos/makeup_hair_1.webp",
    aspectRatio: "aspect-[3/4]",
    sizeClass: "md:col-span-4",
    description: "Close-up beauty shot displaying detailed makeup and hairdo styling."
  },
  {
    id: 6,
    title: "Childhood Innocence",
    category: "PORTRAITS",
    src: "/photos/kids_1.jpg",
    aspectRatio: "aspect-[3/4]",
    sizeClass: "md:col-span-4",
    description: "Candid children portrait capture full of natural expression."
  },
  {
    id: 15,
    title: "Imagination & Reality",
    category: "PORTRAITS",
    src: "/photos/imagination_guitar.jpg",
    aspectRatio: "aspect-[4/5]",
    sizeClass: "md:col-span-6",
    description: "Artistic fine-art portrait mapping expressions, guitar details, and subtle ambient shadows."
  },
  {
    id: 16,
    title: "Playful Innocent Smile",
    category: "PORTRAITS",
    src: "/photos/kids_photography_2.jpg",
    aspectRatio: "aspect-square",
    sizeClass: "md:col-span-6",
    description: "Delightful baby portrait capturing sweet laughter and genuine childhood expressions."
  },
  {
    id: 7,
    title: "Radiant Smile",
    category: "PORTRAITS",
    src: "/photos/happiness_1.webp",
    aspectRatio: "aspect-square",
    sizeClass: "md:col-span-6",
    description: "A delightful close-up capturing pure happiness and glowing expressions."
  },
  {
    id: 8,
    title: "Luminous Beauty",
    category: "FASHION",
    src: "/photos/glowing_skin_1.webp",
    aspectRatio: "aspect-[4/5]",
    sizeClass: "md:col-span-6",
    description: "High-definition beauty shoot studying lighting contours and skin details."
  },
  {
    id: 17,
    title: "Maternal Grace",
    category: "PORTRAITS",
    src: "/photos/maternity_shoot_2.jpg",
    aspectRatio: "aspect-[3/4]",
    sizeClass: "md:col-span-5",
    description: "Stunning outdoor maternity portrait session capturing the anticipation of new beginnings."
  },
  {
    id: 18,
    title: "Festive Crimson Portrait",
    category: "EVENTS",
    src: "/photos/merry_christmas_model.jpg",
    aspectRatio: "aspect-[3/4]",
    sizeClass: "md:col-span-7",
    description: "Holiday themed portraiture utilizing rich red tones and warm studio lighting."
  },
  {
    id: 9,
    title: "The Candid Vow",
    category: "WEDDINGS",
    src: "/photos/for_booking_1.jpg",
    aspectRatio: "aspect-video",
    sizeClass: "md:col-span-8",
    description: "Emotion-filled candid photography of wedding traditions."
  },
  {
    id: 10,
    title: "Breeze & Solitude",
    category: "PORTRAITS",
    src: "/photos/cool_is_breeze_1.jpg",
    aspectRatio: "aspect-[3/4]",
    sizeClass: "md:col-span-4",
    description: "Ambient portrait of a cool breeze mood, captured using cinematic lens depth.",
    objectPosition: "object-center"
  },
  {
    id: 11,
    title: "Rhythmic Grace",
    category: "EVENTS",
    src: "/photos/stunning_dance_1.jpg",
    aspectRatio: "aspect-video",
    sizeClass: "md:col-span-8",
    description: "Capturing a stunning performance dynamically frozen in motion."
  },
  {
    id: 12,
    title: "New Beginnings",
    category: "PORTRAITS",
    src: "/photos/maternity_1.jpg",
    aspectRatio: "aspect-video",
    sizeClass: "md:col-span-8",
    description: "Fine-art outdoor maternity portrait framing expectations and soft light."
  }
];

export default function GalleryClient() {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const gridRef = useRef(null);

  // Filter gallery items based on active category
  const filteredItems = GALLERY_ITEMS.filter(
    (item) => activeCategory === "ALL" || item.category === activeCategory
  );

  // GSAP Entrance reveals for gallery grid items
  useEffect(() => {
    let ctx = gsap.context(() => {
      // Clear any existing ScrollTrigger instances on re-renders
      ScrollTrigger.getAll().forEach(t => t.kill());

      const cards = gridRef.current?.querySelectorAll(".gallery-card");
      if (cards && cards.length > 0) {
        cards.forEach((card) => {
          const img = card.querySelector("img");
          
          // Set initial visual states for container and image
          gsap.set(card, { 
            y: 80, 
            opacity: 0, 
            clipPath: "inset(100% 0% 0% 0%)" 
          });
          if (img) {
            gsap.set(img, { scale: 1.25 });
          }

          // Create a custom timeline for the reveal
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: card,
              start: "top 92%", // Starts revealing when the card enters the lower viewport edge
              toggleActions: "play none none none"
            }
          });

          tl.to(card, {
            y: 0,
            opacity: 1,
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.2,
            ease: "power4.out"
          });

          if (img) {
            tl.to(img, {
              scale: 1.03, // Returns to normal slight scale
              duration: 1.5,
              ease: "power3.out"
            }, "-=1.2"); // Overlaps timeline animation
          }
        });
      }
    }, gridRef);

    return () => ctx.revert();
  }, [activeCategory]);

  const handlePrevLightbox = () => {
    setLightboxIndex((prev) => (prev === 0 ? filteredItems.length - 1 : prev - 1));
  };

  const handleNextLightbox = () => {
    setLightboxIndex((prev) => (prev === filteredItems.length - 1 ? 0 : prev + 1));
  };

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowRight") handleNextLightbox();
      if (e.key === "ArrowLeft") handlePrevLightbox();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, filteredItems]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = "hidden";
      if (window.lenis) window.lenis.stop();
    } else {
      document.body.style.overflow = "";
      if (window.lenis) window.lenis.start();
    }
    return () => {
      document.body.style.overflow = "";
      if (window.lenis) window.lenis.start();
    };
  }, [lightboxIndex]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-32 pb-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto space-y-16">
          
          {/* Header Section */}
          <div className="text-center md:text-left space-y-4">
            <span className="text-[10px] font-sans tracking-[0.35em] text-primary uppercase block">
              Pixelbees Exhibition
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-foreground font-light tracking-tight">
              The Gallery <span className="italic text-primary font-normal">Archive</span>
            </h1>
            <p className="text-sm md:text-base font-sans text-muted-foreground max-w-xl leading-relaxed">
              A curated collection of human connection, styling narratives, and cinematic memories. Drag and scatter frames anywhere, or click to inspect details.
            </p>
          </div>

          {/* Clean Minimalist Category Filtering */}
          <div className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-8 border-b border-border/40 pb-6">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                  }}
                  className={`relative text-xs font-sans tracking-[0.2em] py-2 transition-all duration-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded-sm
                    ${isActive ? "text-foreground font-bold" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {cat}
                  {isActive && (
                    <motion.div
                      layoutId="activeFilter"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary"
                      transition={{ duration: 0.38, ease: "easeInOut" }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Premium Editorial Asymmetric Grid wrapped in DraggableCardContainer */}
          <DraggableCardContainer
            ref={gridRef}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 items-start"
          >
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item, idx) => (
                <DraggableCardBody
                  key={item.id}
                  className="gallery-card group cursor-pointer overflow-hidden bg-card border border-border/45 rounded-lg w-full min-h-[auto] p-0 select-none"
                  onClick={() => setLightboxIndex(idx)}
                >
                  {/* Subtle outer gold frame */}
                  <div className="absolute -inset-1.5 border border-primary/5 pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  
                  {/* Image wrapper */}
                  <div className={`relative w-full ${item.aspectRatio} overflow-hidden pointer-events-none`}>
                    <Image
                      src={item.src}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 40vw"
                      className={`object-cover ${item.objectPosition || "object-center"} scale-[1.03] group-hover:scale-[1.07] transition-all duration-1000 ease-out`}
                      priority={idx < 3}
                    />
                    
                    {/* Shadow overlay vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

                    {/* View Info Overlay */}
                    <div className="absolute bottom-6 left-6 right-6 z-20 flex flex-col justify-end text-left translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                      <span className="text-[10px] font-sans tracking-[0.25em] text-primary uppercase font-bold mb-1.5">
                        {item.category}
                      </span>
                      <h3 className="text-lg md:text-xl font-serif text-white mb-2 leading-none">
                        {item.title}
                      </h3>
                      <p className="text-[11px] font-sans text-white/60 mb-2 leading-normal line-clamp-2 max-w-xs">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </DraggableCardBody>
              ))}
            </AnimatePresence>
          </DraggableCardContainer>
        </div>
      </main>

      {/* Behind the Lens: Animated Testimonial Component showing unused images */}
      <section className="relative bg-card border-y border-border/40 py-20 px-6 md:px-12 z-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[10px] font-sans tracking-[0.3em] text-primary uppercase block mb-3">
              CREATIVE STORIES & FEEDBACK
            </span>
            <h2 className="text-3xl md:text-5xl font-serif text-foreground font-light">
              Behind the <span className="italic text-primary font-normal">Lens</span>
            </h2>
            <p className="text-xs md:text-sm font-sans text-muted-foreground max-w-md mx-auto mt-2 leading-relaxed">
              Explore client memories and visual captures created during our custom editorial shoots.
            </p>
          </div>
          <AnimatedTestimonials testimonials={
            unusedTestimonials.map((t) => ({
              quote: t.quote,
              name: t.author,
              designation: t.context,
              src: t.image,
            }))
          } autoplay={true} isDark={true} />
        </div>
      </section>

      {/* Cinematic Fullscreen Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-6 md:p-10 select-none backdrop-blur-md"
            role="dialog"
            aria-modal="true"
          >
            {/* Bottom Bar: Description & Index */}
            <div className="flex flex-col sm:flex-row items-center justify-between border-t border-white/10 pt-4 z-20 text-center sm:text-left gap-4">
              <p className="text-xs font-sans text-white/60 max-w-md leading-relaxed">
                {filteredItems[lightboxIndex].description}
              </p>
              <span className="text-[10px] font-sans tracking-[0.2em] text-white/40 uppercase">
                {lightboxIndex + 1} / {filteredItems.length}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}
