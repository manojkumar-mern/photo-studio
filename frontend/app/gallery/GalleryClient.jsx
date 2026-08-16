"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import { unusedTestimonials } from "@/lib/data";

// Ensure ScrollTrigger is registered
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const CATEGORIES = [
  "ALL",
  "PRE-WEDDING",
  "WEDDING",
  "RECEPTION",
  "POST-WEDDING",
  "BABY SHOWER",
  "PORTRAITS"
];

const GALLERY_ITEMS = [
  {
    "id": 1,
    "title": "Sacred Vows",
    "category": "PRE-WEDDING",
    "src": "/photos/thats_a_wrap_1.webp",
    "aspectRatio": "aspect-[3/4]",
    "description": "Festive studio portrait capturing the warmth and magic of the holiday season.",
    "location": "Salem",
    "year": "2026"
  },
  {
    "id": 2,
    "title": "Bridal Candid Photography",
    "category": "RECEPTION",
    "src": "/photos/Bridal candid Photography___salemwedding _salemweddingphotography _salemweddingphotographer _candid _candidphotography _candidphotographer _candidweddingpho(.webp",
    "aspectRatio": "aspect-[4/5]",
    "description": "Exquisite traditional bridal portrait capturing intricate jewelry, makeup, and attire details.",
    "location": "Salem",
    "year": "2026"
  },
  {
    "id": 3,
    "title": "Holiday Magic",
    "category": "PORTRAITS",
    "src": "/photos/That_s a wrap_ Every single present is wrapped and ready_Γ¥ñ∩╕ÅΓ¢ä≡ƒÄä≡ƒÄë__._._._._._._._._.__christmas _christmastree _christmasdecor _xmas _merrychristm_2.webp",
    "aspectRatio": "aspect-square",
    "description": "Festive studio portrait capturing the warmth and magic of the holiday season.",
    "location": "Salem",
    "year": "2026"
  },
  {
    "id": 4,
    "title": "Dance",
    "category": "RECEPTION",
    "src": "/photos/dance_1.webp",
    "aspectRatio": "aspect-[3/2]",
    "description": "Capturing the dynamic energy and rhythm of a live stage performance.",
    "location": "Salem",
    "year": "2026"
  },
  {
    "id": 5,
    "title": "Holiday Magic",
    "category": "PORTRAITS",
    "src": "/photos/That_s a wrap_ Every single present is wrapped and ready_Γ¥ñ∩╕ÅΓ¢ä≡ƒÄä≡ƒÄë__._._._._._._._._.__christmas _christmastree _christmasdecor _xmas _merrychristma(.webp",
    "aspectRatio": "aspect-[4/5]",
    "description": "Festive studio portrait capturing the warmth and magic of the holiday season.",
    "location": "Salem",
    "year": "2026"
  },
  {
    "id": 6,
    "title": "Dramatic Artist",
    "category": "PORTRAITS",
    "src": "/photos/dramatic_artist_1.webp",
    "aspectRatio": "aspect-square",
    "description": "High-fashion editorial, beauty portraits, and artistic studio captures.",
    "location": "Salem",
    "year": "2026"
  },
  {
    "id": 7,
    "title": "Holiday Magic",
    "category": "PORTRAITS",
    "src": "/photos/That_s a wrap_ Every single present is wrapped and ready_Γ¥ñ∩╕ÅΓ¢ä≡ƒÄä≡ƒÄë__._._._._._._._._.__christmas _christmastree _christmasdecor _xmas _merrychristm_1.webp",
    "aspectRatio": "aspect-[3/4]",
    "description": "Festive studio portrait capturing the warmth and magic of the holiday season.",
    "location": "Salem",
    "year": "2026"
  },
  {
    "id": 8,
    "title": "Editorial Portrait",
    "category": "RECEPTION",
    "src": "/photos/A stunning dance performance from Do Own Style ≡ƒöÑKudos_On JCI national president meet___jci _jciindia _jcisalem __canonr5 _pixelbeesphotography _salem(JPG).webp",
    "aspectRatio": "aspect-square",
    "description": "Capturing the dynamic energy and rhythm of a live stage performance.",
    "location": "Salem",
    "year": "2026"
  },
  {
    "id": 9,
    "title": "Cool Is Breeze  Not A Competition≡ƒÿÄ",
    "category": "PORTRAITS",
    "src": "/photos/Cool is breeze_ not a competition≡ƒÿÄ___canonr5 _canonphotography _canonindia _potraits(JPG).webp",
    "aspectRatio": "aspect-square",
    "description": "High-fashion editorial, beauty portraits, and artistic studio captures.",
    "location": "Salem",
    "year": "2026"
  },
  {
    "id": 10,
    "title": "Instagram",
    "category": "WEDDING",
    "src": "/photos/Instagram - 1786510420297(WEBP).webp",
    "aspectRatio": "aspect-[3/2]",
    "description": "Traditional wedding ceremonies, raw emotions, vows, and classical details.",
    "location": "Salem",
    "year": "2026"
  },
  {
    "id": 11,
    "title": "For Booking",
    "category": "WEDDING",
    "src": "/photos/For Booking _ 8925101994___salemwedding _salemweddingphotographer _salemweddingphotographer _candidphotography _candidphotography _candidphotographer _candi(.webp",
    "aspectRatio": "aspect-square",
    "description": "A pure, unprompted emotional moment frozen in time.",
    "location": "Salem",
    "year": "2026"
  },
  {
    "id": 12,
    "title": "Instagram",
    "category": "WEDDING",
    "src": "/photos/Instagram - 1786510420289(WEBP).webp",
    "aspectRatio": "aspect-[4/5]",
    "description": "Traditional wedding ceremonies, raw emotions, vows, and classical details.",
    "location": "Salem",
    "year": "2026"
  },
  {
    "id": 13,
    "title": "Kid",
    "category": "BABY SHOWER",
    "src": "/photos/kid_1.webp",
    "aspectRatio": "aspect-square",
    "description": "Cherished maternity, baby shower, and early childhood portraits.",
    "location": "Salem",
    "year": "2026"
  },
  {
    "id": 14,
    "title": "Kid Girl",
    "category": "BABY SHOWER",
    "src": "/photos/kid_girl_2.webp",
    "aspectRatio": "aspect-[3/2]",
    "description": "Cherished maternity, baby shower, and early childhood portraits.",
    "location": "Salem",
    "year": "2026"
  },
  {
    "id": 15,
    "title": "Instagram",
    "category": "POST-WEDDING",
    "src": "/photos/Instagram - 1786510420295(WEBP).webp",
    "aspectRatio": "aspect-square",
    "description": "Beautiful sunset post-wedding session in a rustic outdoor setup.",
    "location": "Salem",
    "year": "2026"
  },
  {
    "id": 16,
    "title": "You Can T Buy Happiness Without Us",
    "category": "WEDDING",
    "src": "/photos/You can_t buy happiness without us____Book your date with usΓÿ║__For booking _ 8925101994__DM us for custom event packages___salem _candidphotography _candi(.webp",
    "aspectRatio": "aspect-[4/5]",
    "description": "A pure, unprompted emotional moment frozen in time.",
    "location": "Salem",
    "year": "2026"
  },
  {
    "id": 17,
    "title": "Editorial Portrait",
    "category": "RECEPTION",
    "src": "/photos/A stunning dance performance from Do Own Style ≡ƒöÑKudos_On JCI national president meet___jci _jciindia _jcisalem __canonr5 _pixelbeesphotography _salem(JP_1.webp",
    "aspectRatio": "aspect-[4/5]",
    "description": "Capturing the dynamic energy and rhythm of a live stage performance.",
    "location": "Salem",
    "year": "2026"
  },
  {
    "id": 18,
    "title": "Kid Girl",
    "category": "BABY SHOWER",
    "src": "/photos/kid_girl_1.webp",
    "aspectRatio": "aspect-square",
    "description": "Cherished maternity, baby shower, and early childhood portraits.",
    "location": "Salem",
    "year": "2026"
  },
  {
    "id": 19,
    "title": "You Can T Buy Happiness Without Us",
    "category": "PRE-WEDDING",
    "src": "/photos/You can_t buy happiness without us____Book your date with usΓÿ║__For booking _ 8925101994__DM us for custom event packages___salem _candidphotography _cand_1.webp",
    "aspectRatio": "aspect-square",
    "description": "A pure, unprompted emotional moment frozen in time.",
    "location": "Salem",
    "year": "2026"
  },
  {
    "id": 20,
    "title": "Reception Grandeur",
    "category": "RECEPTION",
    "src": "/photos/Happiness is look gorgeous on you ≡ƒÆÑ≡ƒÆ»___nandies_makeover_artist _punitha_makeover_artist_salem _niralisai_boutique ____shining_starlight___0621 ___br_1.webp",
    "aspectRatio": "aspect-[16/9]",
    "description": "Elegant portraits and details from the evening wedding reception.",
    "location": "Salem",
    "year": "2026"
  },
  {
    "id": 21,
    "title": "Editorial Portrait",
    "category": "RECEPTION",
    "src": "/photos/A stunning dance performance from Do Own Style ≡ƒöÑKudos_On JCI national president meet___jci _jciindia _jcisalem __canonr5 _pixelbeesphotography _salem(JP_2.webp",
    "aspectRatio": "aspect-[3/4]",
    "description": "Capturing the dynamic energy and rhythm of a live stage performance.",
    "location": "Salem",
    "year": "2026"
  },
  {
    "id": 22,
    "title": "Bridal Look Model Shoot≡ƒÆÑ",
    "category": "PORTRAITS",
    "src": "/photos/Bridal look model shoot≡ƒÆÑ___salemwedding _salemweddingphotography _salemweddingphotographer _candid _candidphotography _candidphotographer _candidwedding_1.webp",
    "aspectRatio": "aspect-[3/4]",
    "description": "Exquisite traditional bridal portrait capturing intricate jewelry, makeup, and attire details.",
    "location": "Salem",
    "year": "2026"
  },
  {
    "id": 23,
    "title": "A Beautiful Beginning",
    "category": "BABY SHOWER",
    "src": "/photos/_portraits _candidphotography _candid _babygirl _babyshooting _kidsphotography _salemphotography _salemphotographer _babyshoot(JPG).webp",
    "aspectRatio": "aspect-square",
    "description": "A pure, unprompted emotional moment frozen in time.",
    "location": "Salem",
    "year": "2026"
  },
  {
    "id": 24,
    "title": "Editorial Portrait",
    "category": "PORTRAITS",
    "src": "/photos/Skin finish makeup_ subtle HD makeup ≡ƒÆä _model__shoot __HMUA _ _aparna_makeover_artist _Doll_ _jayasri_official7714_Behind camera_ _pixelbeesphotography__1.webp",
    "aspectRatio": "aspect-square",
    "description": "Close-up beauty shot highlighting flawless HD makeup and styling.",
    "location": "Salem",
    "year": "2026"
  },
  {
    "id": 25,
    "title": "Bridal Look Model Shoot≡ƒÆÑ",
    "category": "PORTRAITS",
    "src": "/photos/Bridal look model shoot≡ƒÆÑ___salemwedding _salemweddingphotography _salemweddingphotographer _candid _candidphotography _candidphotographer _candidweddingp(.webp",
    "aspectRatio": "aspect-[3/4]",
    "description": "Exquisite traditional bridal portrait capturing intricate jewelry, makeup, and attire details.",
    "location": "Salem",
    "year": "2026"
  },
  {
    "id": 26,
    "title": "Bridal Look Model Shoot≡ƒÆÑ",
    "category": "PORTRAITS",
    "src": "/photos/Bridal look model shoot≡ƒÆÑ___salemwedding _salemweddingphotography _salemweddingphotographer _candid _candidphotography _candidphotographer _candidwedding_2.webp",
    "aspectRatio": "aspect-[4/5]",
    "description": "Exquisite traditional bridal portrait capturing intricate jewelry, makeup, and attire details.",
    "location": "Salem",
    "year": "2026"
  },
  {
    "id": 27,
    "title": "Editorial Portrait",
    "category": "PORTRAITS",
    "src": "/photos/DM us for custom packages_For booking _  91-8925101994___portraits _candidphotography _candid __candidphotographer _candidweddingphotography _photography _w(.webp",
    "aspectRatio": "aspect-square",
    "description": "A pure, unprompted emotional moment frozen in time.",
    "location": "Salem",
    "year": "2026"
  },
  {
    "id": 28,
    "title": "Editorial Portrait",
    "category": "PORTRAITS",
    "src": "/photos/Beauty of a women is in her eyes≡ƒÿë  _nandies_makeover_artist  _punitha_makeover_artist_salem _niralisai_boutique____shining_starlight___0621___bride _bri(.webp",
    "aspectRatio": "aspect-[3/4]",
    "description": "Exquisite traditional bridal portrait capturing intricate jewelry, makeup, and attire details.",
    "location": "Salem",
    "year": "2026"
  },
  {
    "id": 29,
    "title": "Makeup Hair",
    "category": "PORTRAITS",
    "src": "/photos/makeup_hair_1.webp",
    "aspectRatio": "aspect-[4/5]",
    "description": "Close-up beauty shot highlighting flawless HD makeup and styling.",
    "location": "Salem",
    "year": "2026"
  },
  {
    "id": 30,
    "title": "BRIDAL SHOOTΓ£¿",
    "category": "WEDDING",
    "src": "/photos/BRIDAL SHOOTΓ£¿___salemwedding _salemweddingphotography _salemweddingphotographer _candid _candidphotography _candidphotographer _candidweddingphotography _1.webp",
    "aspectRatio": "aspect-[3/2]",
    "description": "Exquisite traditional bridal portrait capturing intricate jewelry, makeup, and attire details.",
    "location": "Salem",
    "year": "2026"
  },
  {
    "id": 31,
    "title": "Makeup",
    "category": "PORTRAITS",
    "src": "/photos/makeup_1.webp",
    "aspectRatio": "aspect-[3/4]",
    "description": "Close-up beauty shot highlighting flawless HD makeup and styling.",
    "location": "Salem",
    "year": "2026"
  },
  {
    "id": 32,
    "title": "For Booking",
    "category": "RECEPTION",
    "src": "/photos/for_booking_1.webp",
    "aspectRatio": "aspect-[4/5]",
    "description": "Elegant portraits and details from the evening wedding reception.",
    "location": "Salem",
    "year": "2026"
  },
  {
    "id": 33,
    "title": "Wedding Candid",
    "category": "POST-WEDDING",
    "src": "/photos/wedding_candid_2.webp",
    "aspectRatio": "aspect-[3/4]",
    "description": "A pure, unprompted emotional moment frozen in time.",
    "location": "Salem",
    "year": "2026"
  },
  {
    "id": 34,
    "title": "Editorial Portrait",
    "category": "PORTRAITS",
    "src": "/photos/Mua _punitha_makeover_artist_salem _Stills _pixelbeesphotography _Retouching _vino_ranga_Jewelery _saisanjanajewels___bridalmakeup _wedding _salemphotograp(.webp",
    "aspectRatio": "aspect-[3/4]",
    "description": "Exquisite traditional bridal portrait capturing intricate jewelry, makeup, and attire details.",
    "location": "Salem",
    "year": "2026"
  },
  {
    "id": 35,
    "title": "Holiday Magic",
    "category": "PORTRAITS",
    "src": "/photos/Makeup _ Hairdo_ _aparna_makeover_artist _Clicked by_ _pixelbeesphotography_Muse _jayasri_official7714 ___merrychristmas _christmas _christmasshoot__modeli(.webp",
    "aspectRatio": "aspect-[4/5]",
    "description": "Festive studio portrait capturing the warmth and magic of the holiday season.",
    "location": "Salem",
    "year": "2026"
  },
  {
    "id": 36,
    "title": "Kids Phography ≡ƒºÜΓÇìΓÖÇ∩╕Å",
    "category": "BABY SHOWER",
    "src": "/photos/Kids phography ≡ƒºÜΓÇìΓÖÇ∩╕Å___portraits _candidphotography _candid _babygirl _babyshooting _kidsphotography _salemphotography _salemphotographer _babyshoot(.webp",
    "aspectRatio": "aspect-[3/4]",
    "description": "A pure, unprompted emotional moment frozen in time.",
    "location": "Salem",
    "year": "2026"
  },
  {
    "id": 37,
    "title": "Editorial Portrait",
    "category": "PORTRAITS",
    "src": "/photos/Skin finish makeup_ subtle HD makeup ≡ƒÆä _model__shoot __HMUA _ _aparna_makeover_artist _Doll_ _jayasri_official7714_Behind camera_ _pixelbeesphotography__(.webp",
    "aspectRatio": "aspect-[3/4]",
    "description": "Close-up beauty shot highlighting flawless HD makeup and styling.",
    "location": "Salem",
    "year": "2026"
  },
  {
    "id": 38,
    "title": "Reception Grandeur",
    "category": "RECEPTION",
    "src": "/photos/Happiness is look gorgeous on you ≡ƒÆÑ≡ƒÆ»___nandies_makeover_artist _punitha_makeover_artist_salem _niralisai_boutique ____shining_starlight___0621 ___bri(.webp",
    "aspectRatio": "aspect-square",
    "description": "Elegant portraits and details from the evening wedding reception.",
    "location": "Salem",
    "year": "2026"
  },
  {
    "id": 39,
    "title": "Beauty Jewelry",
    "category": "PORTRAITS",
    "src": "/photos/beauty_jewelry_1.webp",
    "aspectRatio": "aspect-square",
    "description": "High-fashion editorial, beauty portraits, and artistic studio captures.",
    "location": "Salem",
    "year": "2026"
  },
  {
    "id": 40,
    "title": "Melody of Life",
    "category": "PRE-WEDDING",
    "src": "/photos/creative_guitar_1.webp",
    "aspectRatio": "aspect-[4/5]",
    "description": "Intimate pre-wedding session capturing the chemistry and anticipation of the journey ahead.",
    "location": "Salem",
    "year": "2026"
  },
  {
    "id": 41,
    "title": "Pixelbeesphotography  For Booking",
    "category": "WEDDING",
    "src": "/photos/pixelbeesphotography__For Booking _ 8925101994___salemwedding _salemweddingphotography _salemweddingphotographer _candid _candidphotography _candidphotograp(.webp",
    "aspectRatio": "aspect-[3/4]",
    "description": "A pure, unprompted emotional moment frozen in time.",
    "location": "Salem",
    "year": "2026"
  },
  {
    "id": 42,
    "title": "For Booking",
    "category": "WEDDING",
    "src": "/photos/For Booking _ 8925101994___salemwedding _salemweddingphotography _salemweddingphotographer _candid _candidphotography _candidphotographer _candidweddingphot(.webp",
    "aspectRatio": "aspect-[3/2]",
    "description": "A pure, unprompted emotional moment frozen in time.",
    "location": "Salem",
    "year": "2026"
  },
  {
    "id": 43,
    "title": "Expression It S An Art And  A Passion.",
    "category": "PORTRAITS",
    "src": "/photos/_expression It_s an art and_ a passion.____canonr5 _canonindia _makeupartist _bridal _wedding(JPG).webp",
    "aspectRatio": "aspect-[3/4]",
    "description": "Exquisite traditional bridal portrait capturing intricate jewelry, makeup, and attire details.",
    "location": "Salem",
    "year": "2026"
  },
  {
    "id": 44,
    "title": "Pixelbeesphotography  For Booking",
    "category": "RECEPTION",
    "src": "/photos/pixelbeesphotography__For Booking _ 8925101994___salemwedding _salemweddingphotography _salemweddingphotographer _candid _candidphotography _candidphotogra_1.webp",
    "aspectRatio": "aspect-[3/2]",
    "description": "A pure, unprompted emotional moment frozen in time.",
    "location": "Salem",
    "year": "2026"
  },
  {
    "id": 45,
    "title": "Model Shoot",
    "category": "PORTRAITS",
    "src": "/photos/model_shoot_1.webp",
    "aspectRatio": "aspect-square",
    "description": "High-fashion editorial, beauty portraits, and artistic studio captures.",
    "location": "Salem",
    "year": "2026"
  },
  {
    "id": 46,
    "title": "Divine Grace",
    "category": "PORTRAITS",
    "src": "/photos/janmashtami_1.webp",
    "aspectRatio": "aspect-[3/4]",
    "description": "Artistic conceptual portrait inspired by traditional themes.",
    "location": "Salem",
    "year": "2026"
  },
  {
    "id": 47,
    "title": "A Wedding Promise",
    "category": "WEDDING",
    "src": "/photos/Mugurtham  look ≡ƒÆ½ with dual cut crease eye look ≡ƒÆ½__HMUA _ saree drape_ _aparna_makeover_artist _Doll_  _srimathilifestyle_Behind camera_ _pixelbeesph_1.webp",
    "aspectRatio": "aspect-square",
    "description": "Traditional wedding ceremonies, raw emotions, vows, and classical details.",
    "location": "Salem",
    "year": "2026"
  },
  {
    "id": 48,
    "title": "Glowing Skin For The Win Γ£¿∩╕Å ≡ƒÆÑ",
    "category": "PORTRAITS",
    "src": "/photos/Glowing skin for the win Γ£¿∩╕Å ≡ƒÆÑ___bridestyle _makeupartist _canonr5 _wedding(WEBP)_1.webp",
    "aspectRatio": "aspect-square",
    "description": "Exquisite traditional bridal portrait capturing intricate jewelry, makeup, and attire details.",
    "location": "Salem",
    "year": "2026"
  },
  {
    "id": 49,
    "title": "Mugurtham",
    "category": "PRE-WEDDING",
    "src": "/photos/mugurtham_1.webp",
    "aspectRatio": "aspect-[3/4]",
    "description": "Romantic couple candid session captured in natural morning light.",
    "location": "Salem",
    "year": "2026"
  },
  {
    "id": 50,
    "title": "Wedding Candid",
    "category": "RECEPTION",
    "src": "/photos/wedding_candid_1.webp",
    "aspectRatio": "aspect-[16/9]",
    "description": "A pure, unprompted emotional moment frozen in time.",
    "location": "Salem",
    "year": "2026"
  },
  {
    "id": 51,
    "title": "BRIDAL SHOOTΓ£¿",
    "category": "POST-WEDDING",
    "src": "/photos/BRIDAL SHOOTΓ£¿___salemwedding _salemweddingphotography _salemweddingphotographer _candid _candidphotography _candidphotographer _candidweddingphotography _(.webp",
    "aspectRatio": "aspect-square",
    "description": "Exquisite traditional bridal portrait capturing intricate jewelry, makeup, and attire details.",
    "location": "Salem",
    "year": "2026"
  },
  {
    "id": 52,
    "title": "From Hot Mess To Bridal Dress≡ƒÆû",
    "category": "WEDDING",
    "src": "/photos/From hot mess to bridal dress≡ƒÆû(JPG).webp",
    "aspectRatio": "aspect-[4/5]",
    "description": "Exquisite traditional bridal portrait capturing intricate jewelry, makeup, and attire details.",
    "location": "Salem",
    "year": "2026"
  },
  {
    "id": 53,
    "title": "Maternity",
    "category": "BABY SHOWER",
    "src": "/photos/maternity_1.webp",
    "aspectRatio": "aspect-square",
    "description": "Celebrating motherhood with an elegant outdoor maternity session.",
    "location": "Salem",
    "year": "2026"
  },
  {
    "id": 54,
    "title": "Editorial Portrait",
    "category": "PORTRAITS",
    "src": "/photos/Everything has beauty_ but not everyone seems__MUA_  _neerajasampath_mua _MODEL_  __bhuvani_ _RETOUCH_  _vino_ranga_STILLS BY_  _pixelbeesphotography_JEWEL(.webp",
    "aspectRatio": "aspect-square",
    "description": "High-fashion editorial, beauty portraits, and artistic studio captures.",
    "location": "Salem",
    "year": "2026"
  },
  {
    "id": 55,
    "title": "Bridal",
    "category": "PRE-WEDDING",
    "src": "/photos/bridal_1.webp",
    "aspectRatio": "aspect-square",
    "description": "Exquisite traditional bridal portrait capturing intricate jewelry, makeup, and attire details.",
    "location": "Salem",
    "year": "2026"
  },
  {
    "id": 56,
    "title": "A Wedding Promise",
    "category": "RECEPTION",
    "src": "/photos/Mugurtham  look ≡ƒÆ½ with dual cut crease eye look ≡ƒÆ½__HMUA _ saree drape_ _aparna_makeover_artist _Doll_  _srimathilifestyle_Behind camera_ _pixelbeespho(.webp",
    "aspectRatio": "aspect-[3/4]",
    "description": "Elegant portraits and details from the evening wedding reception.",
    "location": "Salem",
    "year": "2026"
  },
  {
    "id": 57,
    "title": "For Booking  8925101994  Salemwedding",
    "category": "POST-WEDDING",
    "src": "/photos/For Booking _8925101994__salemwedding ___salemweddingphotographer _salemweddingphotographer _candid _candidphotography _candidphotographer _candidweddingph_1.webp",
    "aspectRatio": "aspect-[3/4]",
    "description": "A pure, unprompted emotional moment frozen in time.",
    "location": "Salem",
    "year": "2026"
  },
  {
    "id": 58,
    "title": "Portrait",
    "category": "PORTRAITS",
    "src": "/photos/portrait_1.webp",
    "aspectRatio": "aspect-[3/4]",
    "description": "High-fashion editorial, beauty portraits, and artistic studio captures.",
    "location": "Salem",
    "year": "2026"
  },
  {
    "id": 59,
    "title": "Glowing Skin",
    "category": "PORTRAITS",
    "src": "/photos/glowing_skin_1.webp",
    "aspectRatio": "aspect-[4/5]",
    "description": "Close-up beauty shot highlighting flawless HD makeup and styling.",
    "location": "Salem",
    "year": "2026"
  },
  {
    "id": 60,
    "title": "Glowing Skin For The Win Γ£¿∩╕Å ≡ƒÆÑ",
    "category": "PORTRAITS",
    "src": "/photos/Glowing skin for the win Γ£¿∩╕Å ≡ƒÆÑ___bridestyle _makeupartist _canonr5 _wedding(WEBP).webp",
    "aspectRatio": "aspect-square",
    "description": "Exquisite traditional bridal portrait capturing intricate jewelry, makeup, and attire details.",
    "location": "Salem",
    "year": "2026"
  },
  {
    "id": 61,
    "title": "Outdoor Portrait",
    "category": "PRE-WEDDING",
    "src": "/photos/outdoor_portrait_1.webp",
    "aspectRatio": "aspect-[3/4]",
    "description": "Intimate pre-wedding session capturing the chemistry and anticipation of the journey ahead.",
    "location": "Salem",
    "year": "2026"
  },
  {
    "id": 62,
    "title": "Bridal Candid",
    "category": "RECEPTION",
    "src": "/photos/bridal_candid_3.webp",
    "aspectRatio": "aspect-[4/5]",
    "description": "Exquisite traditional bridal portrait capturing intricate jewelry, makeup, and attire details.",
    "location": "Salem",
    "year": "2026"
  },
  {
    "id": 63,
    "title": "Happiness",
    "category": "POST-WEDDING",
    "src": "/photos/happiness_1.webp",
    "aspectRatio": "aspect-square",
    "description": "Beautiful sunset post-wedding session in a rustic outdoor setup.",
    "location": "Salem",
    "year": "2026"
  },
  {
    "id": 64,
    "title": "Holiday Magic",
    "category": "PORTRAITS",
    "src": "/photos/festive_christmas.webp",
    "aspectRatio": "aspect-[3/4]",
    "description": "Festive studio portrait capturing the warmth and magic of the holiday season.",
    "location": "Salem",
    "year": "2026"
  },
  {
    "id": 65,
    "title": "Glowing Skin For The Win Γ£¿∩╕Å ≡ƒÆÑ",
    "category": "PORTRAITS",
    "src": "/photos/Glowing skin for the win Γ£¿∩╕Å ≡ƒÆÑ___bridestyle _makeupartist _canonr5 _wedding(WEBP)_2.webp",
    "aspectRatio": "aspect-[4/5]",
    "description": "Exquisite traditional bridal portrait capturing intricate jewelry, makeup, and attire details.",
    "location": "Salem",
    "year": "2026"
  },
  {
    "id": 66,
    "title": "Bridal Look",
    "category": "WEDDING",
    "src": "/photos/bridal_look_1.webp",
    "aspectRatio": "aspect-[3/2]",
    "description": "Exquisite traditional bridal portrait capturing intricate jewelry, makeup, and attire details.",
    "location": "Salem",
    "year": "2026"
  },
  {
    "id": 67,
    "title": "Editorial Portrait",
    "category": "PRE-WEDDING",
    "src": "/photos/Dm for more details and enquiries __Mua _neerajasampath_mua _Photographer _pixelbeesphotography _Muse __bhuvani_ _Jewel _saisanjanajewels(JPG).webp",
    "aspectRatio": "aspect-square",
    "description": "Romantic couple candid session captured in natural morning light.",
    "location": "Salem",
    "year": "2026"
  },
  {
    "id": 68,
    "title": "For Booking  8925101994  Salemwedding",
    "category": "RECEPTION",
    "src": "/photos/For Booking _8925101994__salemwedding ___salemweddingphotographer _salemweddingphotographer _candid _candidphotography _candidphotographer _candidweddingpho(.webp",
    "aspectRatio": "aspect-square",
    "description": "A pure, unprompted emotional moment frozen in time.",
    "location": "Salem",
    "year": "2026"
  },
  {
    "id": 69,
    "title": "Editorial Portrait",
    "category": "POST-WEDDING",
    "src": "/photos/Dm for more details and booking ≡ƒÿè_Mua_ _neerajasampath_mua _Photographer_ _pixelbeesphotography _Muse_ __bhuvani_ _Jewel_ _saisanjanajewels ___keralabrid(.webp",
    "aspectRatio": "aspect-[3/4]",
    "description": "Beautiful sunset post-wedding session in a rustic outdoor setup.",
    "location": "Salem",
    "year": "2026"
  },
  {
    "id": 70,
    "title": "Beauty",
    "category": "PORTRAITS",
    "src": "/photos/beauty_1.webp",
    "aspectRatio": "aspect-[3/4]",
    "description": "High-fashion editorial, beauty portraits, and artistic studio captures.",
    "location": "Salem",
    "year": "2026"
  },
  {
    "id": 71,
    "title": "A Wedding Promise",
    "category": "WEDDING",
    "src": "/photos/Mua _punitha_makeover_artist_salem _Stills _pixelbeesphotography _Retouching _vino_ranga_Jewelery _saisanjanajewels___bridal _wedding _salemphotographer _c(.webp",
    "aspectRatio": "aspect-square",
    "description": "Exquisite traditional bridal portrait capturing intricate jewelry, makeup, and attire details.",
    "location": "Salem",
    "year": "2026"
  }
];

export default function GalleryClient() {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const gridRef = useRef(null);

  // Filter gallery items based on active category
  const filteredItems = GALLERY_ITEMS.filter(
    (item) => activeCategory === "ALL" || item.category === activeCategory
  );

  // GSAP Entrance reveals for gallery grid items
  useEffect(() => {
    let ctx = gsap.context(() => {
      // Clear any existing ScrollTrigger instances on re-renders
      ScrollTrigger.getAll().forEach(t => t.kill());

      const cards = gridRef.current?.querySelectorAll(".gallery-card");
      if (cards && cards.length > 0) {
        cards.forEach((card) => {
          const img = card.querySelector("img");
          
          // Set initial visual states for container and image
          gsap.set(card, { 
            y: 50, 
            opacity: 0, 
            clipPath: "inset(100% 0% 0% 0%)" 
          });
          if (img) {
            gsap.set(img, { scale: 1.15 });
          }

          // Create a custom timeline for the reveal
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: card,
              start: "top 95%", // Starts revealing when entering the viewport
              toggleActions: "play none none none"
            }
          });

          tl.to(card, {
            y: 0,
            opacity: 1,
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.0,
            ease: "power3.out"
          });

          if (img) {
            tl.to(img, {
              scale: 1.01,
              duration: 1.2,
              ease: "power2.out"
            }, "-=1.0");
          }
        });
      }
    }, gridRef);

    return () => ctx.revert();
  }, [activeCategory]);

  const handlePrevLightbox = () => {
    setLightboxIndex((prev) => (prev === 0 ? filteredItems.length - 1 : prev - 1));
  };

  const handleNextLightbox = () => {
    setLightboxIndex((prev) => (prev === filteredItems.length - 1 ? 0 : prev + 1));
  };

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowRight") handleNextLightbox();
      if (e.key === "ArrowLeft") handlePrevLightbox();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, filteredItems]);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = "hidden";
      if (window.lenis) window.lenis.stop();
    } else {
      document.body.style.overflow = "";
      if (window.lenis) window.lenis.start();
    }
    return () => {
      document.body.style.overflow = "";
      if (window.lenis) window.lenis.start();
    };
  }, [lightboxIndex]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-32 pb-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto space-y-12">
          
          {/* Header Section */}
          <div className="text-center space-y-3 max-w-2xl mx-auto pb-4">
            <span className="text-[10px] font-sans tracking-[0.4em] text-primary uppercase block font-medium">
              OUR GALLERY
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-foreground font-light tracking-tight leading-tight">
              Stories Worth <span className="italic text-primary font-normal">Remembering</span>
            </h1>
            <p className="text-xs sm:text-sm font-sans text-muted-foreground leading-relaxed">
              Capturing weddings, romantic celebrations, fine art portraits, and intimate milestones. 
              Each frame preserves the natural elegance and emotional depth of your most meaningful moments.
            </p>
          </div>

          {/* Clean Minimalist Category Filtering */}
          <div className="flex flex-wrap justify-center gap-x-6 sm:gap-x-8 gap-y-3 border-b border-border/30 pb-6 max-w-4xl mx-auto">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                  }}
                  className={`relative text-[10px] sm:text-xs font-sans tracking-[0.2em] py-2 transition-all duration-300 uppercase focus:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded-sm cursor-pointer
                    ${isActive ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {cat}
                  {isActive && (
                    <motion.div
                      layoutId="activeFilter"
                      className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-primary"
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Responsive CSS Masonry Grid */}
          <div 
            ref={gridRef}
            className="columns-1 sm:columns-2 md:columns-3 gap-6 lg:gap-8 space-y-6 lg:space-y-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item, idx) => (
                <div
                  key={item.id}
                  className="gallery-card break-inside-avoid mb-6 lg:mb-8 relative group cursor-pointer overflow-hidden bg-card border border-border/40 rounded-md w-full select-none"
                  onClick={() => setLightboxIndex(idx)}
                >
                  {/* Subtle outer gold frame on hover */}
                  <div className="absolute -inset-1 border border-primary/10 pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Image wrapper */}
                  <div className={`relative w-full ${item.aspectRatio} overflow-hidden pointer-events-none`}>
                    <Image
                      src={item.src}
                      alt={item.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover object-center scale-[1.01] group-hover:scale-[1.05] transition-transform duration-[800ms] ease-out"
                      priority={idx < 4}
                      loading={idx >= 4 ? "lazy" : undefined}
                    />
                    
                    {/* Shadow overlay vignette */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

                    {/* View Info Overlay */}
                    <div className="absolute bottom-5 left-5 right-5 z-20 flex flex-col justify-end text-left translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-[500ms] ease-out">
                      <span className="text-[9px] font-sans tracking-[0.25em] text-primary uppercase font-semibold mb-1">
                        {item.category}
                      </span>
                      <h3 className="text-base font-serif text-white leading-tight">
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="text-[10px] font-sans text-white/60 mt-1.5 leading-normal line-clamp-2 max-w-xs">
                          {item.description}
                        </p>
                      )}
                      
                      {/* View cue */}
                      <div className="mt-3 flex items-center gap-1.5 text-[9px] font-sans tracking-[0.15em] text-primary font-medium">
                        <span>OPEN</span>
                        <svg className="w-2.5 h-2.5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Behind the Lens: Creative Testimonials */}
      <section className="relative bg-card border-y border-border/40 py-20 px-6 md:px-12 z-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[10px] font-sans tracking-[0.3em] text-primary uppercase block mb-3">
              CREATIVE STORIES & FEEDBACK
            </span>
            <h2 className="text-3xl md:text-5xl font-serif text-foreground font-light">
              Behind the <span className="italic text-primary font-normal">Lens</span>
            </h2>
            <p className="text-xs md:text-sm font-sans text-muted-foreground max-w-md mx-auto mt-2 leading-relaxed">
              Explore client memories and visual captures created during our custom editorial shoots.
            </p>
          </div>
          <AnimatedTestimonials testimonials={
            unusedTestimonials.map((t) => ({
              quote: t.quote,
              name: t.author,
              designation: t.context,
              src: t.image,
            }))
          } autoplay={true} isDark={true} />
        </div>
      </section>

      {/* Cinematic Fullscreen Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-6 md:p-10 select-none backdrop-blur-md"
            role="dialog"
            aria-modal="true"
          >
            {/* Top Bar: Title & Close Button */}
            <div className="flex items-center justify-between z-20">
              <div className="space-y-0.5">
                <span className="text-[9px] font-sans tracking-[0.2em] text-primary uppercase">
                  {filteredItems[lightboxIndex].category}
                </span>
                <h3 className="text-base sm:text-lg font-serif text-white">
                  {filteredItems[lightboxIndex].title}
                </h3>
              </div>
              
              <button
                onClick={() => setLightboxIndex(null)}
                className="group relative flex items-center justify-center w-10 h-10 rounded-full border border-white/10 hover:border-primary/45 transition-colors focus:outline-none cursor-pointer"
                aria-label="Close lightbox"
              >
                <span className="text-white group-hover:text-primary transition-colors text-lg">✕</span>
              </button>
            </div>

            {/* Main Center Image and Navigation */}
            <div className="relative flex-1 flex items-center justify-center my-6 z-10 w-full">
              {/* Prev Button */}
              <button
                onClick={handlePrevLightbox}
                className="absolute left-0 md:left-4 z-30 p-3 rounded-full border border-white/5 bg-black/40 hover:bg-black/80 hover:border-primary/40 text-white hover:text-primary transition-all duration-300 focus:outline-none cursor-pointer"
                aria-label="Previous image"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Image Frame */}
              <div className="relative w-full h-full max-w-5xl max-h-[70vh]">
                <Image
                  src={filteredItems[lightboxIndex].src}
                  alt={filteredItems[lightboxIndex].title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 80vw"
                  className="object-contain"
                  priority
                />
              </div>

              {/* Next Button */}
              <button
                onClick={handleNextLightbox}
                className="absolute right-0 md:right-4 z-30 p-3 rounded-full border border-white/5 bg-black/40 hover:bg-black/80 hover:border-primary/40 text-white hover:text-primary transition-all duration-300 focus:outline-none cursor-pointer"
                aria-label="Next image"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Bottom Bar: Description & Index */}
            <div className="flex flex-col sm:flex-row items-center justify-between border-t border-white/10 pt-4 z-20 text-center sm:text-left gap-4">
              <p className="text-xs font-sans text-white/60 max-w-md leading-relaxed">
                {filteredItems[lightboxIndex].description}
              </p>
              <span className="text-[10px] font-sans tracking-[0.2em] text-white/40 uppercase">
                {lightboxIndex + 1} / {filteredItems.length}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}
