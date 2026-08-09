import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";

const serifFont = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const sansFont = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://auraphotostudio.com";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "AURA Studio | Fine Art & Editorial Photography",
    template: "%s | AURA Studio",
  },
  description:
    "A premium, editorial-focused photography studio capturing cinematic moments, high-fashion storytelling, and timeless portraits.",
  keywords: [
    "photography studio",
    "editorial photography",
    "fine art portrait",
    "wedding documentary",
    "fashion photography",
    "AURA Studio",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: "AURA Studio",
    title: "AURA Studio | Fine Art & Editorial Photography",
    description:
      "A premium, editorial-focused photography studio capturing cinematic moments, high-fashion storytelling, and timeless portraits.",
  },
  twitter: {
    card: "summary_large_image",
    title: "AURA Studio | Fine Art & Editorial Photography",
    description:
      "A premium, editorial-focused photography studio capturing cinematic moments, high-fashion storytelling, and timeless portraits.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0C0C0D",
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
