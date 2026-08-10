import { Cormorant_Garamond, DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import ThemeSwitcher from "@/components/ui/ThemeSwitcher";

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

const displayFont = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://pixelbeesphotos.com";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Pixel Bees Photos | Fine Art & Editorial Photography",
    template: "%s | Pixel Bees Photos",
  },
  description:
    "A premium, editorial-focused photography studio capturing cinematic moments, wedding documentary, and timeless portraits.",
  keywords: [
    "photography studio",
    "editorial photography",
    "fine art portrait",
    "wedding documentary",
    "fashion photography",
    "Pixel Bees Photos",
    "Pixel Bees Photography",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: "Pixel Bees Photos",
    title: "Pixel Bees Photos | Fine Art & Editorial Photography",
    description:
      "A premium, editorial-focused photography studio capturing cinematic moments, wedding documentary, and timeless portraits.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pixel Bees Photos | Fine Art & Editorial Photography",
    description:
      "A premium, editorial-focused photography studio capturing cinematic moments, wedding documentary, and timeless portraits.",
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
      className={`${serifFont.variable} ${sansFont.variable} ${displayFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-primary/30 selection:text-foreground">
        {children}
        {/* Theme preview switcher — development/design only, remove when final theme is decided */}
        <ThemeSwitcher />
      </body>
    </html>
  );
}
