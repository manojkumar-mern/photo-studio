import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { portfolioItems } from "@/lib/data";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

// Generate static params for Next.js build optimization
export async function generateStaticParams() {
  return portfolioItems.map((item) => ({
    slug: item.slug,
  }));
}

// Generate dynamic metadata
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const item = portfolioItems.find((p) => p.slug === slug);
  if (!item) return {};

  return {
    title: `${item.title} | AURA Studio`,
    description: item.description,
  };
}

export default async function ProjectDetailPage({ params }) {
  const { slug } = await params;
  const item = portfolioItems.find((p) => p.slug === slug);

  if (!item) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="flex-1 bg-background pt-32 pb-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb Back Link */}
          <Link
            href="/work"
            className="text-[10px] font-sans tracking-[0.25em] text-muted-foreground hover:text-foreground mb-12 inline-flex items-center gap-2"
          >
            ← BACK TO ARCHIVE
          </Link>

          {/* Project Editorial Headers */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-16">
            <div className="lg:col-span-8 space-y-4">
              <span className="text-[10px] font-sans tracking-[0.3em] text-primary uppercase block font-semibold">
                {item.category}
              </span>
              <h1 className="text-4xl md:text-7xl font-serif text-foreground leading-[1.1]">
                {item.title}
              </h1>
            </div>
            <div className="lg:col-span-4 text-left lg:text-right text-xs font-sans text-muted-foreground tracking-[0.1em] space-y-1">
              <p className="text-foreground font-medium uppercase">[LOCATION / DETAILS]</p>
              <p>{item.location}</p>
              <p>Date: {item.date}</p>
            </div>
          </div>

          {/* Main Hero Showcase Frame */}
          <div className="relative w-full h-[60vh] md:h-[80vh] border border-border bg-card mb-12 overflow-hidden">
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover"
              sizes="90vw"
              priority
            />
          </div>

          {/* Detailed Narrative Concept & Highlights */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-24">
            <div className="lg:col-span-8 space-y-6 text-center md:text-left">
              <h4 className="text-[10px] font-sans tracking-[0.25em] text-primary uppercase font-bold">
                CREATIVE CONCEPT
              </h4>
              <p className="font-serif text-2xl md:text-3xl text-foreground/95 leading-relaxed italic">
                "{item.description}"
              </p>
            </div>
            
            {/* Highlights List */}
            <div className="lg:col-span-4 bg-card border border-border p-8 space-y-4">
              <h4 className="text-[10px] font-sans tracking-[0.25em] text-foreground uppercase font-bold">
                PROJECT HIGHLIGHTS
              </h4>
              <ul className="text-xs font-sans text-muted-foreground space-y-2 list-disc pl-4">
                {item.highlights.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Editorial Visual Sequence Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-24">
            {item.images.slice(1).map((img, idx) => (
              <div
                key={idx}
                className="relative h-[50vh] md:h-[70vh] border border-border bg-card overflow-hidden"
              >
                <Image
                  src={img}
                  alt={`Sequence Frame ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 90vw, 45vw"
                />
              </div>
            ))}
          </div>

          {/* Previous / Next Narrative Navigation */}
          <div className="border-t border-border pt-12 flex justify-between items-center text-[10px] font-sans tracking-[0.2em] uppercase">
            <Link
              href={`/work/${item.prevSlug}`}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              ← PREVIOUS NARRATIVE
            </Link>
            <Link
              href={`/work/${item.nextSlug}`}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              NEXT NARRATIVE →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
