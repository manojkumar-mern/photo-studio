"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { name: "ABOUT",    href: "/about"    },
  { name: "WORK",     href: "/work"     },
  { name: "SERVICES", href: "/services" },
  { name: "GALLERY",  href: "/gallery"  },
  { name: "CONTACT",  href: "/contact"  },
];

export default function Header() {
  const [isOpen, setIsOpen]   = useState(false);
  const pathname              = usePathname();

  // ── Close on route change ──────────────────────────────────
  // Using a ref to track previous pathname so we only close
  // when the route actually changes, avoiding the lint warning
  // about setState inside an effect body.
  const prevPathRef = useRef(pathname);
  useEffect(() => {
    if (prevPathRef.current !== pathname) {
      prevPathRef.current = pathname;
      setIsOpen(false);
    }
  }, [pathname]);

  // ── Body scroll-lock while menu is open ───────────────────
  useEffect(() => {
    if (isOpen) {
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
  }, [isOpen]);

  // ── ESC key closes menu ───────────────────────────────────
  const handleKeyDown = useCallback((e) => {
    if (e.key === "Escape" && isOpen) setIsOpen(false);
  }, [isOpen]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const close = () => setIsOpen(false);

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 bg-background/85 backdrop-blur-md border-b border-border py-6 px-6 md:px-12 transition-all duration-300"
        role="banner"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">

          {/* ── Logo ────────────────────────────────────── */}
          <Link
            href="/"
            className="group flex items-center gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm shrink-0"
            aria-label="Pixel Bees Photos — return to home"
          >
            {/* Bee mark — w-auto lets the 436:394 natural ratio expand wider
                while h-[52px] keeps the vertical footprint identical to before */}
            <Image
              src="/client_logo.svg"
              alt="Pixel Bees Photography logo"
              width={64}
              height={52}
              className="h-[52px] w-auto object-contain flex-shrink-0"
              priority
            />

            {/* Brand lockup */}
            <div className="flex flex-col text-left min-w-0">
              <span className="text-[22px] leading-[1.1] font-serif font-medium tracking-[0.05em] whitespace-nowrap navbar-brand-logo">
                Pixelbees Photography
              </span>
              <span
                className="
                  text-[13px] leading-[1.25]
                  font-serif font-light italic
                  tracking-[0.12em]
                  text-primary/65
                  group-hover:text-primary/90
                  transition-colors duration-300
                  mt-[3px]
                  whitespace-nowrap
                "
              >
                Emotion through Photos
              </span>
            </div>
          </Link>

          {/* ── Desktop nav ─────────────────────────────── */}
          <nav className="hidden md:flex items-center space-x-9" aria-label="Main navigation">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative text-[13px] font-sans tracking-[0.18em] transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 hover:scale-[1.03] active:scale-[0.98] rounded-sm
                    after:absolute after:bottom-[-3px] after:left-0 after:h-[1px] after:bg-primary after:transition-all after:duration-300
                    ${isActive
                      ? "text-foreground after:w-full"
                      : "text-muted-foreground hover:text-foreground after:w-0 hover:after:w-full"}`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {link.name}
                </Link>
              );
            })}
            <Link
              href="/booking"
              className="text-[13px] font-sans tracking-[0.18em] border border-primary bg-primary text-primary-foreground rounded-md px-7 py-2.5 transition-all duration-300 hover:bg-transparent hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 hover:scale-[1.03] active:scale-[0.97]"
            >
              BOOK SESSION
            </Link>
          </nav>

          {/* ── Mobile hamburger ────────────────────────── */}
          <button
            onClick={() => setIsOpen((v) => !v)}
            className="md:hidden text-foreground hover:text-primary p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            <div className="w-6 h-4 flex flex-col justify-between items-end" aria-hidden="true">
              <span className={`w-6 h-[1px] bg-current transition-transform duration-300 ${isOpen ? "rotate-45 translate-y-[7.5px]" : ""}`} />
              <span className={`w-4 h-[1px] bg-current transition-all  duration-300 ${isOpen ? "w-0 opacity-0" : ""}`} />
              <span className={`w-6 h-[1px] bg-current transition-transform duration-300 ${isOpen ? "-rotate-45 -translate-y-[7.5px]" : ""}`} />
            </div>
          </button>
        </div>
      </header>

      {/* ── Mobile menu overlay ───────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            className="fixed inset-0 z-40 bg-background/98 backdrop-blur-sm flex flex-col md:hidden"
          >
            {/* Decorative top accent */}
            <div className="h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent" />

            {/* Spacer for header */}
            <div className="h-[88px] flex-shrink-0" />

            <nav
              className="flex-1 flex flex-col items-center justify-center gap-8 px-8 py-12"
              aria-label="Mobile navigation"
            >
              {NAV_LINKS.map((link, idx) => {
                const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
                return (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.06, duration: 0.3 }}
                    className="w-full text-center"
                  >
                    <Link
                      href={link.href}
                      onClick={close}
                      className={`text-2xl font-serif tracking-[0.12em] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary
                        ${isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                );
              })}

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: NAV_LINKS.length * 0.06, duration: 0.3 }}
                className="pt-4 w-full flex justify-center"
              >
                <Link
                  href="/booking"
                  onClick={close}
                  className="inline-block text-xs font-sans tracking-[0.2em] border border-primary bg-primary text-primary-foreground rounded-md px-10 py-3 transition-all duration-300 hover:bg-transparent hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  BOOK SESSION
                </Link>
              </motion.div>
            </nav>

            {/* Bottom decorative rule */}
            <div className="px-8 pb-10 text-center">
              <p className="text-[9px] font-sans tracking-[0.3em] text-muted-foreground/40 uppercase">
                Pixel Bees Fine Art & Editorial Photography
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <style dangerouslySetInnerHTML={{ __html: `
        .navbar-brand-logo {
          background: linear-gradient(
            120deg,
            #FAF8F5 0%,
            #FAF8F5 35%,
            #C5A880 50%,
            #FAF8F5 65%,
            #FAF8F5 100%
          );
          background-size: 250% auto;
          background-position: 0% 50%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          transition: background-position 0.8s cubic-bezier(0.25, 1, 0.5, 1);
          display: inline-block;
        }
        .group:hover .navbar-brand-logo {
          background-position: 100% 50%;
        }
      ` }} />
    </>
  );
}
