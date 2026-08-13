import { Cormorant_Garamond, DM_Sans, Playfair_Display, Pinyon_Script } from "next/font/google";
import "./globals.css";
import ScrollProvider from "@/components/layout/ScrollProvider";
import Preloader from "@/components/ui/Preloader";

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

const cursiveFont = Pinyon_Script({
  variable: "--font-cursive",
  subsets: ["latin"],
  weight: ["400"],
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
  const schemaData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        "name": "Pixel Bees Photos",
        "url": SITE_URL,
        "logo": `${SITE_URL}/logo.png`,
        "sameAs": [
          "https://www.instagram.com/pixelbeesphotography"
        ]
      },
      {
        "@type": "LocalBusiness",
        "@id": `${SITE_URL}/#localbusiness`,
        "name": "Pixel Bees Photos",
        "image": [`${SITE_URL}/photos/bridal_look_1.jpg`],
        "url": SITE_URL,
        "telephone": "+918925101994",
        "priceRange": "$$",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Salem Bypass Road",
          "addressLocality": "Salem",
          "addressRegion": "Tamil Nadu",
          "postalCode": "636001",
          "addressCountry": "IN"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 11.6643,
          "longitude": 78.1460
        },
        "openingHoursSpecification": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday"
          ],
          "opens": "09:00",
          "closes": "21:00"
        }
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/#faq`,
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What photography services does Pixel Bees Photos offer?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Pixel Bees Photos offers premium visual services tailored for brands and individuals, specializing in Fashion & Editorial portfolios, candid Wedding Documentary storytelling, and Fine Art Portraiture."
            }
          },
          {
            "@type": "Question",
            "name": "Where is Pixel Bees Photos located?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Pixel Bees Photos is based in Salem, Tamil Nadu, India, but we are available for travel worldwide to shoot lookbooks, weddings, and artistic editorial campaigns."
            }
          },
          {
            "@type": "Question",
            "name": "How can I book a photoshoot session?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "You can book a session easily by visiting our online Booking Wizard on our website (https://pixelbeesphotos.com/booking) or contacting us directly via phone or WhatsApp at +91-8925101994."
            }
          }
        ]
      }
    ]
  };

  return (
    <html
      lang="en"
      className={`${serifFont.variable} ${sansFont.variable} ${displayFont.variable} ${cursiveFont.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground selection:bg-primary/30 selection:text-foreground">
        <Preloader />
        <ScrollProvider>
          {children}
        </ScrollProvider>
      </body>
    </html>
  );
}
