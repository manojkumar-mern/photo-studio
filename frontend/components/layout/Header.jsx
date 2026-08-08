"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "ABOUT", href: "/about" },
    { name: "WORK", href: "/work" },
    { name: "SERVICES", href: "/services" },
    { name: "CONTACT", href: "/contact" },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border py-6 px-6 md:px-12 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo / Brand Name */}
          <Link href="/" className="text-xl font-serif tracking-[0.25em] text-foreground hover:text-primary transition-colors">
            A U R A
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-xs font-sans tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors editorial-underline"
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/booking"
              className="text-xs font-sans tracking-[0.2em] border border-primary/30 hover:border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 py-2 transition-all duration-300"
            >
              BOOK SESSION
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-foreground hover:text-primary p-2 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            <div className="w-6 h-4 flex flex-col justify-between items-end">
              <span className={`w-6 h-[1px] bg-current transition-transform duration-300 ${isOpen ? "rotate-45 translate-y-[7.5px]" : ""}`} />
              <span className={`w-4 h-[1px] bg-current transition-all duration-300 ${isOpen ? "w-0 opacity-0" : ""}`} />
              <span className={`w-6 h-[1px] bg-current transition-transform duration-300 ${isOpen ? "-rotate-45 -translate-y-[7.5px]" : ""}`} />
            </div>
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-40 bg-background pt-28 px-8 flex flex-col md:hidden"
          >
            <nav className="flex flex-col space-y-8 text-center">
              {navLinks.map((link, idx) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-lg font-serif tracking-[0.15em] text-muted-foreground hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navLinks.length * 0.05 }}
                className="pt-6"
              >
                <Link
                  href="/booking"
                  onClick={() => setIsOpen(false)}
                  className="inline-block text-xs font-sans tracking-[0.2em] border border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-3 w-full max-w-[280px]"
                >
                  BOOK SESSION
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
