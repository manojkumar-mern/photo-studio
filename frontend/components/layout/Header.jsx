"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { name: "ABOUT",    href: "/about"    },
  { name: "WORK",     href: "/work"     },
  { name: "SERVICES", href: "/services" },
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
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
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
            className="text-xl font-serif tracking-[0.25em] text-foreground hover:text-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="AURA Studio — return to home"
          >
            A U R A
          </Link>

          {/* ── Desktop nav ─────────────────────────────── */}
          <nav className="hidden md:flex items-center space-x-8" aria-label="Main navigation">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-xs font-sans tracking-[0.2em] transition-colors editorial-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm
                    ${isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {link.name}
                </Link>
              );
            })}
            <Link
              href="/booking"
              className={`text-xs font-sans tracking-[0.2em] border px-6 py-2 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary
                ${pathname === "/booking"
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-primary/30 hover:border-primary text-primary hover:bg-primary hover:text-primary-foreground"}`}
              aria-current={pathname === "/booking" ? "page" : undefined}
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
                  className="inline-block text-xs font-sans tracking-[0.2em] border border-primary text-primary hover:bg-primary hover:text-primary-foreground px-10 py-3 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  BOOK SESSION
                </Link>
              </motion.div>
            </nav>

            {/* Bottom decorative rule */}
            <div className="px-8 pb-10 text-center">
              <p className="text-[9px] font-sans tracking-[0.3em] text-muted-foreground/40 uppercase">
                AURA Fine Art & Editorial Photography
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
