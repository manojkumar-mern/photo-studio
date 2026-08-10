import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { portfolioItems } from "@/lib/data";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export async function generateStaticParams() {
  return portfolioItems.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const item = portfolioItems.find((p) => p.slug === slug);
  if (!item) return {};
  return {
    title: item.title,
    description: item.description,
    openGraph: {
      title: `${item.title} | Pixel Bees Photos`,
      description: item.description,
    },
  };
}

export default async function ProjectDetailPage({ params }) {
  const { slug } = await params;
  const item = portfolioItems.find((p) => p.slug === slug);
  if (!item) notFound();

  const prev = portfolioItems.find((p) => p.slug === item.prevSlug);
  const next = portfolioItems.find((p) => p.slug === item.nextSlug);

  return (
    <>
      <Header />
      <main className="flex-1 bg-background pt-28 md:pt-32 pb-24 px-4 sm:px-6 md:px-12">
        <div className="max-w-7xl mx-auto">

          {/* Back */}
          <Link
            href="/work"
            className="text-[10px] font-sans tracking-[0.25em] text-muted-foreground hover:text-primary transition-colors mb-12 inline-flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 8H3M7 4L3 8l4 4" />
            </svg>
            Back to archive
          </Link>

          {/* Heading */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-12 md:mb-16">
            <div className="lg:col-span-8 space-y-3">
              <span className="text-[10px] font-sans tracking-[0.3em] text-primary uppercase block font-semibold">
                {item.category}
              </span>
              <h1 className="text-3xl sm:text-5xl md:text-7xl font-serif text-foreground leading-[1.05]">
                {item.title}
              </h1>
            </div>
            <div className="lg:col-span-4 text-left lg:text-right text-xs font-sans text-muted-foreground tracking-[0.1em] space-y-1">
              <p>{item.location}</p>
              <p>{item.date}</p>
            </div>
          </div>

          {/* Hero image */}
          <div className="relative w-full h-[50vh] sm:h-[60vh] md:h-[78vh] border border-border bg-card mb-10 md:mb-12 overflow-hidden">
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover"
              sizes="92vw"
              priority
            />
          </div>

          {/* Concept + highlights */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-12 mb-20 md:mb-24">
            <div className="lg:col-span-8 space-y-5">
              <h2 className="text-[10px] font-sans tracking-[0.25em] text-primary uppercase font-bold">
                Creative Concept
              </h2>
              <p className="font-serif text-xl md:text-2xl lg:text-3xl text-foreground/95 leading-relaxed italic">
                &ldquo;{item.description}&rdquo;
              </p>
            </div>
            <div className="lg:col-span-4 bg-card border border-border p-6 md:p-8 space-y-4">
              <h2 className="text-[10px] font-sans tracking-[0.25em] text-foreground uppercase font-bold">
                Project Highlights
              </h2>
              <ul className="text-xs font-sans text-muted-foreground space-y-2 list-disc pl-4" aria-label="Project highlights">
                {item.highlights?.map((h, i) => <li key={i}>{h}</li>)}
              </ul>
            </div>
          </div>

          {/* Image sequence */}
          {item.images.slice(1).length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 mb-20 md:mb-24">
              {item.images.slice(1).map((img, idx) => (
                <div
                  key={idx}
                  className="relative h-[48vw] sm:h-[46vh] md:h-[68vh] border border-border bg-card overflow-hidden"
                >
                  <Image
                    src={img}
                    alt={`${item.title} — visual sequence ${idx + 2}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 92vw, 45vw"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Prev / Next */}
          <div className="border-t border-border pt-10 flex flex-col sm:flex-row justify-between gap-6 text-[10px] font-sans tracking-[0.2em] uppercase">
            {prev ? (
              <Link
                href={`/work/${prev.slug}`}
                className="group flex flex-col gap-1 text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <span className="inline-flex items-center gap-1.5 group-hover:text-primary transition-colors">
                  <svg className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 8H3M7 4L3 8l4 4" />
                  </svg>
                  Previous
                </span>
                <span className="text-xs font-serif normal-case tracking-normal text-foreground/50 group-hover:text-foreground transition-colors">
                  {prev.title}
                </span>
              </Link>
            ) : <span />}

            {next ? (
              <Link
                href={`/work/${next.slug}`}
                className="group flex flex-col gap-1 items-end text-right text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <span className="inline-flex items-center gap-1.5 group-hover:text-primary transition-colors">
                  Next
                  <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h10M9 4l4 4-4 4" />
                  </svg>
                </span>
                <span className="text-xs font-serif normal-case tracking-normal text-foreground/50 group-hover:text-foreground transition-colors">
                  {next.title}
                </span>
              </Link>
            ) : <span />}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
