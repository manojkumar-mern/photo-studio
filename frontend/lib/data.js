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
    image: "/photos/beauty_1.webp",
    description: "An editorial styling exploration framing raw garment textures against stark minimalist concrete backdrops. Every image studies the play of light and dynamic contrast.",
    images: [
      "/photos/beauty_1.webp",
      "/photos/makeup_1.jpg",
      "/photos/stylish_model_1.jpg"
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
    image: "/photos/wedding_candid_1.jpg",
    description: "Candid imagery documenting human connection along the oceanic shoreline. Designed to replicate natural, organic frames with warm ivory grain tones.",
    images: [
      "/photos/wedding_candid_1.jpg",
      "/photos/wedding_candid_2.jpg",
      "/photos/bridal_1.jpg"
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
    image: "/photos/portrait_1.jpg",
    description: "A close-up studio portrait study exploring subtle facial contours, high contrast styling, and ambient lighting states.",
    images: [
      "/photos/portrait_1.jpg",
      "/photos/outdoor_portrait_1.jpg",
      "/photos/creative_guitar_1.jpg"
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
    image: "/photos/food_1.jpg",
    description: "Editorial campaign photography created in collaboration with design spaces. Documenting architecture, geometry, and subtle human interaction.",
    images: [
      "/photos/food_1.jpg",
      "/photos/food_2.jpg",
      "/photos/dance_1.jpg"
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
    image: "/photos/stylish_model_1.jpg",
    includes: ["Style curation & concept direction", "Full studio production & ambient lighting team", "15+ High-resolution editorial proofed images", "Digital & print output delivery formats"],
    useCase: "Best suited for clothing collections, design campaigns, model portfolios, and lookbooks."
  },
  {
    id: "weddings",
    name: "Wedding Documentary",
    description: "Candid, non-intrusive documentation of your celebration. Capturing raw emotional narratives, architectural beauty of the venue, and intimate editorial moments.",
    image: "/photos/mugurtham_1.jpg",
    includes: ["Full-day coverage by chief visual artist", "Ambient lifestyle documentation (non-intrusive)", "300+ Color-graded digital negatives", "Handcrafted premium linen box print collection"],
    useCase: "Best suited for intimate or large celebrations that appreciate raw, non-posed artistic storytelling."
  },
  {
    id: "portraiture",
    name: "Fine Art Portraiture",
    description: "Timeless solo or group portraits utilizing natural lighting, deep shadows, and architectural elements. Designed to reveal character and mood in a minimalist setup.",
    image: "/photos/dramatic_artist_1.jpg",
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
    image: "/photos/wedding_candid_2.jpg"
  },
  {
    id: 2,
    quote: "The visual curation and pacing of the photoshoot were extraordinary. The studio understood our brand intent perfectly and delivered a cinematic narrative that exceeded expectations.",
    author: "Creative Director",
    context: "Apparel Brand Campaign",
    image: "/photos/makeup_1.jpg"
  },
  {
    id: 3,
    quote: "A completely non-intrusive approach. We barely noticed the cameras, yet every single frame feels like a high-end film still. Truly a masterpiece of portraiture.",
    author: "Dr. Adrian Vance",
    context: "Fine Art Portraiture",
    image: "/photos/portrait_1.jpg"
  }
];
