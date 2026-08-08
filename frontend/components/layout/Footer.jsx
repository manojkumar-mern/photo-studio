"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#161618] border-t border-white/5 py-16 px-6 md:px-12 text-[#8E8E93]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
        {/* Brand Info */}
        <div className="space-y-4">
          <Link href="/" className="text-xl font-serif tracking-[0.25em] text-[#F4F1EA] hover:text-[#C5A880] transition-colors">
            A U R A
          </Link>
          <p className="text-xs leading-relaxed max-w-[240px]">
            Fine art and editorial photography studio. Capturing raw elegance and timeless visual stories.
          </p>
        </div>

        {/* Studio Links */}
        <div className="space-y-4">
          <h4 className="text-xs font-sans tracking-[0.2em] text-[#F4F1EA] uppercase">STUDIO</h4>
          <ul className="space-y-2 text-xs">
            <li><a href="#work" className="hover:text-[#F4F1EA] transition-colors">SELECTED WORK</a></li>
            <li><a href="#services" className="hover:text-[#F4F1EA] transition-colors">EXPERIENCES</a></li>
            <li><a href="#about" className="hover:text-[#F4F1EA] transition-colors">OUR STORY</a></li>
          </ul>
        </div>

        {/* Contact Info (Placeholders) */}
        <div className="space-y-4">
          <h4 className="text-xs font-sans tracking-[0.2em] text-[#F4F1EA] uppercase">CONNECT</h4>
          <ul className="space-y-2 text-xs">
            <li className="hover:text-[#F4F1EA] transition-colors">hello@auraphotostudio.com</li>
            <li className="hover:text-[#F4F1EA] transition-colors">+91 98765 43210</li>
            <li className="hover:text-[#F4F1EA] transition-colors">Studio Location Placeholder</li>
          </ul>
        </div>

        {/* Social Media (Placeholders) */}
        <div className="space-y-4">
          <h4 className="text-xs font-sans tracking-[0.2em] text-[#F4F1EA] uppercase">SOCIALS</h4>
          <ul className="space-y-2 text-xs">
            <li><span className="hover:text-[#F4F1EA] transition-colors cursor-pointer">INSTAGRAM</span></li>
            <li><span className="hover:text-[#F4F1EA] transition-colors cursor-pointer">PINTEREST</span></li>
            <li><span className="hover:text-[#F4F1EA] transition-colors cursor-pointer">VIMEO</span></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-white/5 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between text-[10px] tracking-[0.15em] uppercase">
        <p>© {new Date().getFullYear()} AURA STUDIO. ALL RIGHTS RESERVED.</p>
        <p className="mt-4 md:mt-0 text-[#8E8E93]/60">DESIGNED FOR ELEGANCE</p>
      </div>
    </footer>
  );
}
