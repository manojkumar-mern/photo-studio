import Header from "@/components/layout/Header";
import HeroSection from "@/components/hero/HeroSection";
import HomeCategories from "@/components/services/HomeCategories";
import Testimonials from "@/components/testimonials/Testimonials";
import BookingWizard from "@/components/booking/BookingWizard";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1 w-full overflow-x-hidden relative">
        <HeroSection />
        <HomeCategories />
        <BookingWizard />
        <Testimonials />
      </main>
      <Footer />
    </>
  );
}
