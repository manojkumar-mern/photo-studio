import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WorkIndex from "./WorkIndex";

export const metadata = {
  title: "Selected Work | AURA Studio",
  description: "Explore our archive of fashion editorials, fine art portraiture, and wedding documentaries.",
};

export default function WorkPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-background">
        <WorkIndex />
      </main>
      <Footer />
    </>
  );
}
