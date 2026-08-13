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
      "/photos/makeup_1.webp",
      "/photos/stylish_model_1.webp"
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
    image: "/photos/wedding_candid_1.webp",
    description: "Candid imagery documenting human connection along the oceanic shoreline. Designed to replicate natural, organic frames with warm ivory grain tones.",
    images: [
      "/photos/wedding_candid_1.webp",
      "/photos/wedding_candid_2.webp",
      "/photos/bridal_1.webp"
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
    image: "/photos/portrait_1.webp",
    description: "A close-up studio portrait study exploring subtle facial contours, high contrast styling, and ambient lighting states.",
    images: [
      "/photos/portrait_1.webp",
      "/photos/outdoor_portrait_1.webp",
      "/photos/creative_guitar_1.webp"
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
    image: "/photos/food_1.webp",
    description: "Editorial campaign photography created in collaboration with design spaces. Documenting architecture, geometry, and subtle human interaction.",
    images: [
      "/photos/food_1.webp",
      "/photos/food_2.webp",
      "/photos/dance_1.webp"
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
    image: "/photos/stylish_model_1.webp",
    includes: ["Style curation & concept direction", "Full studio production & ambient lighting team", "15+ High-resolution editorial proofed images", "Digital & print output delivery formats"],
    useCase: "Best suited for clothing collections, design campaigns, model portfolios, and lookbooks."
  },
  {
    id: "weddings",
    name: "Wedding Documentary",
    description: "Candid, non-intrusive documentation of your celebration. Capturing raw emotional narratives, architectural beauty of the venue, and intimate editorial moments.",
    image: "/photos/mugurtham_1.webp",
    includes: ["Full-day coverage by chief visual artist", "Ambient lifestyle documentation (non-intrusive)", "300+ Color-graded digital negatives", "Handcrafted premium linen box print collection"],
    useCase: "Best suited for intimate or large celebrations that appreciate raw, non-posed artistic storytelling."
  },
  {
    id: "portraiture",
    name: "Fine Art Portraiture",
    description: "Timeless solo or group portraits utilizing natural lighting, deep shadows, and architectural elements. Designed to reveal character and mood in a minimalist setup.",
    image: "/photos/dramatic_artist_1.webp",
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
    image: "/photos/wedding_candid_2.webp"
  },
  {
    id: 2,
    quote: "The visual curation and pacing of the photoshoot were extraordinary. The studio understood our brand intent perfectly and delivered a cinematic narrative that exceeded expectations.",
    author: "Creative Director",
    context: "Apparel Brand Campaign",
    image: "/photos/makeup_1.webp"
  },
  {
    id: 3,
    quote: "A completely non-intrusive approach. We barely noticed the cameras, yet every single frame feels like a high-end film still. Truly a masterpiece of portraiture.",
    author: "Dr. Adrian Vance",
    context: "Fine Art Portraiture",
    image: "/photos/portrait_1.webp"
  },
  {
    id: 4,
    quote: "The team's creativity is unbounded. They turned a simple lifestyle shoot into a gorgeous, high-fashion editorial story that perfectly captures the artistic mood we wanted.",
    author: "Sasha & Julian",
    context: "Fashion Editorial",
    image: "/photos/_Mournful and yet grand is the destiny of the artist._(JPG).webp"
  },
  {
    id: 5,
    quote: "The outdoor session was so fun and light. They kept everyone comfortable and captured the most genuine, joyful moments in natural lighting.",
    author: "The Iyer Family",
    context: "Family Portraiture",
    image: "/photos/_If you look the right way_ you can see that the whole world is a garden_(JPG).webp"
  },
  {
    id: 6,
    quote: "Stunning product and food styling! The playing with lighting shadows and textures brought our culinary creations to life. An absolute pleasure to work with.",
    author: "Chef Vivek",
    context: "Commercial Foodgraphy",
    image: "/photos/_The only way to get rid of a temptation is to yield to it.___On today_s foodgraphy ___canonr5 _canonindia _foodstyling __vino_ranga(JPG).webp"
  }
];

export const unusedTestimonials = [
  {
    id: 1,
    quote: "The details captured in the beauty portrait are incredibly refined. The lighting highlights skin textures perfectly, bringing out a stunning depth.",
    author: "Bhuvani S.",
    context: "Fine Art Beauty Shoot",
    image: "/photos/Beauty is seen by the eyes but felt through the heart Γ¥ñ∩╕Å __MUA _neerajasampath_mua _In frame __bhuvani_ _Jewelery _saisanjanajewels _Retouching _vino_r(.webp"
  },
  {
    id: 2,
    quote: "An absolute masterclass in traditional bridal portraits. The dual cut crease makeup and intricate details of the saree draping were captured so beautifully.",
    author: "Srimathi R.",
    context: "Traditional Mugurtham Look",
    image: "/photos/Mugurtham  look ≡ƒÆ½ with dual cut crease eye look ≡ƒÆ½__HMUA _ saree drape_ _aparna_makeover_artist _Doll_  _srimathilifestyle_Behind camera_ _pixelbeesph_1.webp"
  },
  {
    id: 3,
    quote: "Capturing a child's pure innocence in a frame is extremely challenging, but the photographer did it with absolute ease. These portraits are treasures.",
    author: "Nandini Kumar",
    context: "Kids Candid Session",
    image: "/photos/Kids phography ≡ƒºÜΓÇìΓÖÇ∩╕Å___portraits _candidphotography _candid _babygirl _babyshooting _kidsphotography _salemphotography _salemphotographer _babyshoo_1.webp"
  },
  {
    id: 4,
    quote: "The Janmashtami conceptual shoot was breathtaking. The creative fine art composition combined with the moody lighting resulted in pure magic.",
    author: "Shanmuga Balaji",
    context: "Fine Art Conceptual Shoot",
    image: "/photos/Happy Janmashtami Γ£¿__Fine art makeup creation and photography__Mua _neerajasampath_mua _Framed by _pixelbeesphotography _Model _shanmuga_balaji ___canonr5(.webp"
  },
  {
    id: 5,
    quote: "Our Christmas-themed shoot was warm, festive, and editorial. The photography perfectly showcased the hair styling and makeup details in a cozy layout.",
    author: "Jayasri M.",
    context: "Holiday Editorial Campaign",
    image: "/photos/Makeup _ Hairdo_ _aparna_makeover_artist _Clicked by_ _pixelbeesphotography_Muse _jayasri_official7714 ___merrychristmas _christmas _christmasshoot__model_1.webp"
  },
  {
    id: 6,
    quote: "The skin finish and high-definition styling details are phenomenal. The shoot captured subtle lighting contours that elevated the brand lookbook.",
    author: "Aparna Dev",
    context: "HD Beauty Campaign",
    image: "/photos/Skin finish makeup_ subtle HD makeup ≡ƒÆä _model__shoot __HMUA _ _aparna_makeover_artist _Doll_ _jayasri_official7714_Behind camera_ _pixelbeesphotography__1.webp"
  },
  {
    id: 7,
    quote: "The dynamic freeze-frame of our dance performance is spectacular. It captured the high-energy movement, expression, and absolute passion of the dancers.",
    author: "Do Own Style Crew",
    context: "Live Performance Documentary",
    image: "/photos/A stunning dance performance from Do Own Style ≡ƒöÑKudos_On JCI national president meet___jci _jciindia _jcisalem __canonr5 _pixelbeesphotography _salem(JP_1.webp"
  },
  {
    id: 8,
    quote: "Pure joy captured in the most genuine way possible. The bride's radiant smile and glowing expression say it all. Extremely happy with the results!",
    author: "Punitha Makeovers",
    context: "Bridal Happiness Documentary",
    image: "/photos/Happiness is look gorgeous on you ≡ƒÆÑ≡ƒÆ»___nandies_makeover_artist _punitha_makeover_artist_salem _niralisai_boutique ____shining_starlight___0621 ___br_1.webp"
  },
  {
    id: 9,
    quote: "A gorgeous, cinematic sunset portrait. The depth of field, the cool ambient breeze, and the natural lighting blend together into an elegant work of art.",
    author: "Vivek Ranga",
    context: "Ambient Portrait Session",
    image: "/photos/Cool is breeze_ not a competition≡ƒÿÄ___canonr5 _canonphotography _canonindia _potraits(JPG)_1.webp"
  },
  {
    id: 10,
    quote: "Beautiful, candid capture during the ceremony. The warm colors, composition, and emotional timing of the photograph are absolutely remarkable.",
    author: "Ranganathan Family",
    context: "Traditional Candid Wedding",
    image: "/photos/Bridal candid Photography___salemwedding _salemweddingphotography _salemweddingphotographer _candid _candidphotography _candidphotographer _candidweddingpho(.webp"
  },
  {
    id: 11,
    quote: "A breathtaking bridal look! The makeup was flawless, and the photographer captured every fine detail of the jewelry and styling with incredible precision.",
    author: "Deepika P.",
    context: "Traditional Bridal Session",
    image: "/photos/Bridal look model shoot\u2261\u0192\u00C6\u00D1___salemwedding _salemweddingphotography _salemweddingphotographer _candid _candidphotography _candidphotographer _candidwedding_1.jpg"
  },
  {
    id: 12,
    quote: "The kids photography session was outstanding. They knew exactly how to make the children comfortable and captured the most beautiful, natural laughter.",
    author: "Meera Krishnan",
    context: "Kids Portrait Shoot",
    image: "/photos/Kids phography \u2261\u0192\u00BA\u0393\u00C7\u00EC\u0393\u00D6\u00C7\u2229\u00B8\u00C5___portraits _candidphotography _candid _babygirl _babyshooting _kidsphotography _salemphotography _salemphotographer _babyshoo_2.jpg"
  },
  {
    id: 13,
    quote: "The bridal shoot captures are pure art. The lighting details and raw emotions were documented with such elegance and sophistication.",
    author: "Shreya Sen",
    context: "Premium Bridal Lookbook",
    image: "/photos/BRIDAL SHOOT\u0393\u00A3\u00BF___salemwedding _salemweddingphotography _salemweddingphotographer _candid _candidphotography _candidphotographer _candidweddingphotography _1.jpg"
  },
  {
    id: 14,
    quote: "Such a beautiful composition! The team captured the happiness and glowing energy of our special moments in the most stunning way possible.",
    author: "Nandhini & Rahul",
    context: "Wedding Candid Session",
    image: "/photos/Happiness is look gorgeous on you \u2261\u0192\u00C6\u00D1\u2261\u0192\u00C6\u00BB___nandies_makeover_artist _punitha_makeover_artist_salem _niralisai_boutique ____shining_starlight___0621 ___br_2.webp"
  },
  {
    id: 15,
    quote: "An absolute masterpiece. The dual cut crease makeup and intricate saree pleating were photographed with outstanding clarity and contrast.",
    author: "Kavya Murthy",
    context: "Traditional Muhurtham Portrait",
    image: "/photos/Mugurtham  look \u2261\u0192\u00C6\u00BD with dual cut crease eye look \u2261\u0192\u00C6\u00BD__HMUA _ saree drape_ _aparna_makeover_artist _Doll_  _srimathilifestyle_Behind camera_ _pixelbeesph_2.jpg"
  },
  {
    id: 16,
    quote: "The high-energy dance performance was captured dynamically, freezing the intense movement and passion in a single, perfect frame.",
    author: "JCI Salem Crew",
    context: "Live Performance Documentary",
    image: "/photos/A stunning dance performance from Do Own Style \u2261\u0192\u00F6\u00D1Kudos_On JCI national president meet___jci _jciindia _jcisalem __canonr5 _pixelbeesphotography _salem(JP_2.jpg"
  },
  {
    id: 17,
    quote: "Exquisite framing and emotional capture! The pictures tell the entire story of our joy and laughter. We couldn't have asked for a better documentary team.",
    author: "Arjun & Priyanka",
    context: "Pre-Wedding Celebration",
    image: "/photos/You can_t buy happiness without us____Book your date with us\u0393\u00FF\u263A__For booking _ 8925101994__DM us for custom event packages___salem _candidphotography _candi(.jpg"
  }
];
