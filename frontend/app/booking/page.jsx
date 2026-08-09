import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BookingWizard from "@/components/booking/BookingWizard";

export const metadata = {
  title: "Book a Session | AURA Studio",
  description:
    "Begin your creative story with AURA Studio's photography enquiry wizard. Select your service, preferred date, and share your visual concept.",
  openGraph: {
    title: "Book a Session | AURA Studio",
    description:
      "Begin your creative story with AURA Studio's photography enquiry wizard.",
  },
};

export default function BookingPage() {
  return (
    <>
      <Header />
      {/*
        BookingWizard renders its own py-20/py-32 padding internally.
        The main element here only needs to clear the fixed header (pt-28).
      */}
      <main className="flex-1 bg-background pt-28 md:pt-32">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-12">
          <div className="text-center max-w-2xl mx-auto pt-8 md:pt-12">
            <span className="text-[10px] font-sans tracking-[0.3em] text-primary uppercase block mb-3">
              Reservations
            </span>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif text-foreground mb-4 leading-tight">
              Let&apos;s create something memorable.
            </h1>
            <p className="text-sm font-sans text-muted-foreground leading-relaxed">
              Complete the consultation wizard below. We will coordinate details matching your creative direction.
            </p>
          </div>
        </div>
        <BookingWizard />
      </main>
      <Footer />
    </>
  );
}
