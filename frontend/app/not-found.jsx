import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "Page Not Found | Pixel Bees Photos",
};

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-background flex items-center justify-center px-6 md:px-12 py-32 min-h-[80vh]">
        <div className="text-center space-y-8 max-w-lg">
          {/* Decorative aperture */}
          <div className="flex justify-center" aria-hidden="true">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-full border border-primary/20" />
              <div className="absolute inset-3 rounded-full border border-primary/40" />
              <div className="absolute inset-6 rounded-full border border-primary/60" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-serif text-2xl text-primary/50">404</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <span className="text-[10px] font-sans tracking-[0.3em] text-primary uppercase block">
              Frame Not Found
            </span>
            <h1 className="text-4xl md:text-5xl font-serif text-foreground leading-tight">
              This page doesn&apos;t exist
            </h1>
            <p className="text-sm font-sans text-muted-foreground leading-relaxed">
              The page you&apos;re looking for may have moved, or the URL may be incorrect.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/"
              className="inline-block text-xs font-sans tracking-[0.25em] bg-primary text-primary-foreground hover:bg-[#D5B890] px-8 py-3 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Return Home
            </Link>
            <Link
              href="/work"
              className="inline-block text-xs font-sans tracking-[0.25em] border border-border hover:border-primary/50 text-muted-foreground hover:text-foreground px-8 py-3 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              View Our Work
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
