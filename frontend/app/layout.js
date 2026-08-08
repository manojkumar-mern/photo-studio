import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";

const serifFont = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const sansFont = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata = {
  title: "AURA Studio | Fine Art & Editorial Photography",
  description: "A premium, editorial-focused photography studio capturing cinematic moments, high-fashion storytelling, and timeless portraits.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${serifFont.variable} ${sansFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-primary/30 selection:text-foreground">
        {children}
      </body>
    </html>
  );
}

