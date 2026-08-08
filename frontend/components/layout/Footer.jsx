"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border py-16 px-6 md:px-12 text-muted-foreground">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
        {/* Brand Info */}
        <div className="space-y-4">
          <Link href="/" className="text-xl font-serif tracking-[0.25em] text-foreground hover:text-primary transition-colors">
            A U R A
          </Link>
          <p className="text-xs leading-relaxed max-w-[240px]">
            Fine art and editorial photography studio. Capturing raw elegance and timeless visual stories.
          </p>
        </div>

        {/* Studio Links */}
        <div className="space-y-4">
          <h4 className="text-xs font-sans tracking-[0.2em] text-foreground uppercase">STUDIO</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/work" className="hover:text-foreground transition-colors">SELECTED WORK</Link></li>
            <li><Link href="/services" className="hover:text-foreground transition-colors">EXPERIENCES</Link></li>
            <li><Link href="/about" className="hover:text-foreground transition-colors">OUR STORY</Link></li>
          </ul>
        </div>

        {/* Contact Info (Placeholders) */}
        <div className="space-y-4">
          <h4 className="text-xs font-sans tracking-[0.2em] text-foreground uppercase">CONNECT</h4>
          <ul className="space-y-2 text-xs">
            <li className="hover:text-foreground transition-colors">hello@auraphotostudio.com</li>
            <li className="hover:text-foreground transition-colors">+91 98765 43210</li>
            <li className="hover:text-foreground transition-colors">Studio Location Placeholder</li>
          </ul>
        </div>

        {/* Social Media (Placeholders) */}
        <div className="space-y-4">
          <h4 className="text-xs font-sans tracking-[0.2em] text-foreground uppercase">SOCIALS</h4>
          <ul className="space-y-2 text-xs">
            <li><span className="hover:text-foreground transition-colors cursor-pointer">INSTAGRAM</span></li>
            <li><span className="hover:text-foreground transition-colors cursor-pointer">PINTEREST</span></li>
            <li><span className="hover:text-foreground transition-colors cursor-pointer">VIMEO</span></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-border mt-16 pt-8 flex flex-col md:flex-row items-center justify-between text-[10px] tracking-[0.15em] uppercase">
        <p>© {new Date().getFullYear()} AURA STUDIO. ALL RIGHTS RESERVED.</p>
        <p className="mt-4 md:mt-0 text-muted-foreground/60">DESIGNED FOR ELEGANCE</p>
      </div>
    </footer>
  );
}
