// Mock Portfolio Data
export const portfolioItems = [
  {
    id: 1,
    slug: "project-narrative-a",
    category: "FASHION EDITORIAL",
    title: "Project Narrative A",
    location: "Studio Space",
    year: "2026",
    date: "April 12, 2026",
    highlights: ["High-Contrast Styling", "Studio Flash Choreography", "Fine Grain Textures", "Structural Geometry"],
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop",
    description: "An editorial styling exploration framing raw garment textures against stark minimalist concrete backdrops. Every image studies the play of light and dynamic contrast.",
    images: [
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop"
    ],
    prevSlug: "project-narrative-d",
    nextSlug: "project-narrative-b"
  },
  {
    id: 2,
    slug: "project-narrative-b",
    category: "WEDDING DOCUMENTARY",
    title: "Project Narrative B",
    location: "Coastal Pavilion",
    year: "2026",
    date: "June 24, 2026",
    highlights: ["Natural Sunset Lighting", "Candid Interactions", "Linen Box Proof Prints", "Cinematic Aspect Ratio"],
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop",
    description: "Candid imagery documenting human connection along the oceanic shoreline. Designed to replicate natural, organic frames with warm ivory grain tones.",
    images: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=1200&auto=format&fit=crop"
    ],
    prevSlug: "project-narrative-a",
    nextSlug: "project-narrative-c"
  },
  {
    id: 3,
    slug: "project-narrative-c",
    category: "FINE ART PORTRAIT",
    title: "Project Narrative C",
    location: "Minimalist Set",
    year: "2025",
    date: "October 18, 2025",
    highlights: ["Ambient Light Study", "Minimalist Backdrops", "High Detail Capture", "Monochrome Tonality"],
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200&auto=format&fit=crop",
    description: "A close-up studio portrait study exploring subtle facial contours, high contrast styling, and ambient lighting states.",
    images: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1200&auto=format&fit=crop"
    ],
    prevSlug: "project-narrative-b",
    nextSlug: "project-narrative-d"
  },
  {
    id: 4,
    slug: "project-narrative-d",
    category: "COMMERCIAL BRAND",
    title: "Project Narrative D",
    location: "Urban Loft",
    year: "2025",
    date: "December 05, 2025",
    highlights: ["Architectural Integration", "Geometric Styling", "Lookbook Production", "Product Textures Study"],
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop",
    description: "Editorial campaign photography created in collaboration with design spaces. Documenting architecture, geometry, and subtle human interaction.",
    images: [
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1200&auto=format&fit=crop"
    ],
    prevSlug: "project-narrative-c",
    nextSlug: "project-narrative-a"
  }
];

// Mock Services Data
export const services = [
  {
    id: "fashion",
    name: "Fashion & Editorial",
    description: "High-contrast visual storytelling tailored for brands, designers, and creative lookbooks. Focused on styling, unique compositions, and cinematic lighting setups.",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop",
    includes: ["Style curation & concept direction", "Full studio production & ambient lighting team", "15+ High-resolution editorial proofed images", "Digital & print output delivery formats"],
    useCase: "Best suited for clothing collections, design campaigns, model portfolios, and lookbooks."
  },
  {
    id: "weddings",
    name: "Wedding Documentary",
    description: "Candid, non-intrusive documentation of your celebration. Capturing raw emotional narratives, architectural beauty of the venue, and intimate editorial moments.",
    image: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=800&auto=format&fit=crop",
    includes: ["Full-day coverage by chief visual artist", "Ambient lifestyle documentation (non-intrusive)", "300+ Color-graded digital negatives", "Handcrafted premium linen box print collection"],
    useCase: "Best suited for intimate or large celebrations that appreciate raw, non-posed artistic storytelling."
  },
  {
    id: "portraiture",
    name: "Fine Art Portraiture",
    description: "Timeless solo or group portraits utilizing natural lighting, deep shadows, and architectural elements. Designed to reveal character and mood in a minimalist setup.",
    image: "https://images.unsplash.com/photo-1488161628813-04466f872be2?q=80&w=800&auto=format&fit=crop",
    includes: ["2-hour studio or outdoor architecture session", "Natural light manipulation & shadow study", "5 Premium retouched gallery print files", "Personal design consultation call"],
    useCase: "Best suited for artists, musicians, corporate profiles, and fine-art personal records."
  }
];

// Mock Testimonials (Client Stories) Data
export const testimonials = [
  {
    id: 1,
    quote: "The photographs felt effortless, intimate, and completely true to us. Every moment was captured with such care that looking through the gallery felt like reliving the day.",
    author: "Elena & Marcus",
    context: "Wedding Documentary",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 2,
    quote: "The visual curation and pacing of the photoshoot were extraordinary. The studio understood our brand intent perfectly and delivered a cinematic narrative that exceeded expectations.",
    author: "Creative Director",
    context: "Apparel Brand Campaign",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 3,
    quote: "A completely non-intrusive approach. We barely noticed the cameras, yet every single frame feels like a high-end film still. Truly a masterpiece of portraiture.",
    author: "Dr. Adrian Vance",
    context: "Fine Art Portraiture",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop"
  }
];
