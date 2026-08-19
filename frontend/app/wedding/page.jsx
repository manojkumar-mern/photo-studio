import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WeddingLeadForm from "@/components/booking/WeddingLeadForm";

export const metadata = {
  title: "Plan Your Wedding Story | Pixel Bees Photos",
  description:
    "Curate your cinematic South Indian wedding memories. Inquire about standard, premium, and elite photography packages tailored to capture your special day.",
  openGraph: {
    title: "Plan Your Wedding Story | Pixel Bees Photos",
    description:
      "Curate your cinematic South Indian wedding memories. Inquire about packages tailored to capture your special day.",
  },
};

export default function WeddingLandingPage() {
  return (
    <>
      <Header />
      {/* 
        WeddingLeadForm renders its own internal grid hover effect and padding.
        This main page handles overall layout and fixed header clearing (pt-28).
      */}
      <main className="flex-1 bg-background pt-28 md:pt-32">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-12">
          <div className="text-center max-w-2xl mx-auto pt-8 md:pt-12 space-y-4">
            <span className="text-[10px] font-sans tracking-[0.3em] text-primary uppercase block font-semibold">
              Cinematic Documentaries
            </span>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif text-foreground leading-tight">
              Emotion through Photos.
            </h1>
            <p className="text-sm font-sans text-muted-foreground leading-relaxed max-w-xl mx-auto">
              We specialize in capturing authentic candid wedding moments, sacred South Indian rituals, and heirloom storytelling. Let us curate your memory catalog.
            </p>
          </div>
        </div>
        <WeddingLeadForm />
      </main>
      <Footer />
    </>
  );
}
