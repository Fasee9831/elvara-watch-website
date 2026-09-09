import {
  type Currency,
  formatRawPrice,
  formatPrice,
} from '@/utils/currency';

export type CountryPriceMatrix = Record<Currency, number>;

export interface WatchItem {
  id: string;
  number: string;
  numIndex: number;
  name: string;
  collection: string;
  statement: string;
  description: string;
  easyExplanation: string;
  image: string;
  basePriceUSD: number; // Canonical internal reference price (USD)
  prices: CountryPriceMatrix; // Explicit country-by-country retail pricing matrix
  caseDiameter: string;
  thickness: string;
  powerReserve: string;
  waterResistance: string;
  movementType: string;
  bestForWrist: string;
  visualTags: string[];
  tagColor: string;
  mood: string;
  dominantColor: string;
  bgGradient: string;
  accentColor: string;
  layoutPattern: 'image-left' | 'image-right' | 'image-center';
  isPinned?: boolean;
}

export const WATCHES: WatchItem[] = [
  {
    id: 'eclipse',
    number: '01 / 09',
    numIndex: 1,
    name: 'ÉCLIPSE',
    collection: 'THE SCULPTURAL SERIES',
    statement: 'Clean sculptural beauty crafted in surgical steel.',
    description: 'A striking minimalist study in light and shadow. The satin-brushed steel case catches ambient light with quiet confidence, making it effortless to wear with formal or casual attire.',
    easyExplanation: 'Lightweight brushed surgical steel that feels sleek on your wrist with water resistance for worry-free everyday wear.',
    image: '/images/beautiful-rendering-steel-object.jpg',
    basePriceUSD: 199,
    prices: {
      INR: 14995,
      USD: 199,
      GBP: 189,
      EUR: 219,
      CHF: 219,
      JPY: 32800,
      CAD: 299,
      AUD: 349,
      SGD: 299,
      AED: 899,
    },
    caseDiameter: '40 mm',
    thickness: '9.4 mm (Ultra-Slim)',
    powerReserve: '70 Hours (3 Days)',
    waterResistance: '50 Metres (Daily Swim Safe)',
    movementType: 'Automatic Mechanical',
    bestForWrist: 'Small to Medium (15–18 cm / 6.0–7.1 in)',
    visualTags: ['SURGICAL STEEL', 'ULTRA-SLIM', 'TIMELESS MINIMAL'],
    tagColor: '#38BDF8',
    mood: 'sculptural / dark / silver',
    dominantColor: 'Graphite & Platinum',
    bgGradient: '#070708',
    accentColor: '#38BDF8',
    layoutPattern: 'image-left',
    isPinned: false,
  },
  {
    id: 'aurelia',
    number: '02 / 09',
    numIndex: 2,
    name: 'AURELIA',
    collection: 'THE OPENWORKED SERIES',
    statement: 'Watch the living heartbeat of mechanical gold.',
    description: 'An open skeleton dial revealing the intricate dance of 18K solid yellow gold gears and rubies. Each component is hand-polished so you can see the precise inner mechanics in real-time.',
    easyExplanation: 'A see-through gold skeleton dial that lets you watch the tiny wheels and ticking heart work without any batteries.',
    image: '/images/close-up-clock-with-time-change.jpg',
    basePriceUSD: 599,
    prices: {
      INR: 48995,
      USD: 599,
      GBP: 539,
      EUR: 629,
      CHF: 629,
      JPY: 96800,
      CAD: 899,
      AUD: 999,
      SGD: 899,
      AED: 2699,
    },
    caseDiameter: '42 mm',
    thickness: '10.2 mm',
    powerReserve: '72 Hours (Weekend-Proof)',
    waterResistance: '50 Metres (5 ATM)',
    movementType: 'Skeleton Openwork Automatic',
    bestForWrist: 'Medium to Large (16–20 cm / 6.3–7.9 in)',
    visualTags: ['18K SOLID GOLD', 'OPENWORKED DIAL', 'SWISS CHRONOMETER'],
    tagColor: '#F59E0B',
    mood: 'gold / mechanical / openworked',
    dominantColor: 'Champagne Gold',
    bgGradient: '#0B0906',
    accentColor: '#E5C378',
    layoutPattern: 'image-right',
    isPinned: true,
  },
  {
    id: 'meridien',
    number: '03 / 09',
    numIndex: 3,
    name: 'MÉRIDIEN',
    collection: 'THE REFLECTIVE SERIES',
    statement: 'Sparkling diamond markers on deep obsidian glass.',
    description: 'Subtle cyan reflections dance across an obsidian crystal dial accented with genuine baguette-cut diamond indices. Paired with soft Italian black leather for a comfortable, luxurious fit.',
    easyExplanation: 'Deep dark crystal face with subtle teal glow and brilliant diamond hour marks that catch the light effortlessly.',
    image: '/images/closeup-shot-hand-watch-with-bstrap-reflective-surface.jpg',
    basePriceUSD: 399,
    prices: {
      INR: 34995,
      USD: 399,
      GBP: 369,
      EUR: 429,
      CHF: 429,
      JPY: 64800,
      CAD: 599,
      AUD: 679,
      SGD: 599,
      AED: 1799,
    },
    caseDiameter: '41 mm',
    thickness: '9.8 mm',
    powerReserve: '65 Hours',
    waterResistance: '50 Metres (5 ATM)',
    movementType: 'Precision Swiss Automatic',
    bestForWrist: 'All Wrists (15–19 cm / 5.9–7.5 in)',
    visualTags: ['OBSIDIAN GLASS', 'DIAMOND INDICES', 'SUPPLE LEATHER'],
    tagColor: '#2DD4BF',
    mood: 'dark / teal / reflective',
    dominantColor: 'Reflective Slate & Teal',
    bgGradient: '#060809',
    accentColor: '#2DD4BF',
    layoutPattern: 'image-center',
    isPinned: false,
  },
  {
    id: 'nocturne',
    number: '04 / 09',
    numIndex: 4,
    name: 'NOCTURNE',
    collection: 'THE OBSIDIAN SERIES',
    statement: 'Bold all-black titanium with rich satin gold pushers.',
    description: 'Built from aerospace Grade 5 titanium coated in scratch-proof Diamond-Like Carbon. High-contrast champagne gold subdials let you track elapsed minutes and seconds with precision stopwatch feel.',
    easyExplanation: 'Ultra-tough, scratch-resistant all-black titanium watch with built-in stopwatch and glowing night-time hands.',
    image: '/frames/nocturne/frame_120.jpg',
    basePriceUSD: 499,
    prices: {
      INR: 41995,
      USD: 499,
      GBP: 449,
      EUR: 529,
      CHF: 529,
      JPY: 79800,
      CAD: 749,
      AUD: 849,
      SGD: 749,
      AED: 2249,
    },
    caseDiameter: '44 mm',
    thickness: '11.8 mm',
    powerReserve: '72 Hours',
    waterResistance: '100 Metres (10 ATM Swim & Sports)',
    movementType: 'Column-Wheel Chronograph',
    bestForWrist: 'Medium to Large (16.5–21 cm / 6.5–8.3 in)',
    visualTags: ['SCRATCH-PROOF DLC', 'CHRONOGRAPH STOPWATCH', 'NIGHT LUMINOUS'],
    tagColor: '#F59E0B',
    mood: 'black / gold / dramatic chronograph',
    dominantColor: 'Obsidian & Gold',
    bgGradient: '#080705',
    accentColor: '#E5C378',
    layoutPattern: 'image-left',
    isPinned: true,
  },
  {
    id: 'vangarde',
    number: '05 / 09',
    numIndex: 5,
    name: 'VANGARDE',
    collection: 'THE AVIATOR SERIES',
    statement: 'Engineered for adventure, flight, and outdoor motion.',
    description: 'Tactical matte ceramic casing paired with an ultra-comfortable military olive canvas strap. High-contrast large Arabic numerals guarantee instant readability from any angle.',
    easyExplanation: 'A rugged ceramic pilot watch that is super easy to read at a single glance, fitted with tough olive fabric.',
    image: '/images/montre-daviateur-chronographe-top-gun-miramar2.jpg',
    basePriceUSD: 299,
    prices: {
      INR: 22995,
      USD: 299,
      GBP: 269,
      EUR: 319,
      CHF: 319,
      JPY: 48800,
      CAD: 449,
      AUD: 499,
      SGD: 449,
      AED: 1349,
    },
    caseDiameter: '43 mm',
    thickness: '11.2 mm',
    powerReserve: '68 Hours',
    waterResistance: '100 Metres (Adventure Ready)',
    movementType: 'Pilot Chronograph Automatic',
    bestForWrist: 'Medium to Large (16–20 cm / 6.3–7.9 in)',
    visualTags: ['MATTE CERAMIC', 'OLIVE CANVAS', 'HIGH READABILITY'],
    tagColor: '#34D399',
    mood: 'aviation / military / olive / black',
    dominantColor: 'Tactical Olive & Titanium',
    bgGradient: '#070A08',
    accentColor: '#34D399',
    layoutPattern: 'image-right',
    isPinned: false,
  },
  {
    id: 'seraphine',
    number: '06 / 09',
    numIndex: 6,
    name: 'SERAPHINE',
    collection: 'THE CLASSIQUE SERIES',
    statement: 'Pure classic warmth with exposed flying tourbillon.',
    description: 'A warm cream textured dial with a mesmerizing open tourbillon window at 6 o’clock that counteracts gravity. Complemented by handcrafted cognac alligator leather with saddle stitching.',
    easyExplanation: 'A warm classic dress watch with a mesmerizing spinning balance wheel at the bottom and rich cognac leather.',
    image: '/images/pat-taylor-12V36G17IbQ-unsplash.jpg',
    basePriceUSD: 699,
    prices: {
      INR: 58995,
      USD: 699,
      GBP: 629,
      EUR: 739,
      CHF: 739,
      JPY: 112800,
      CAD: 1049,
      AUD: 1179,
      SGD: 1049,
      AED: 3149,
    },
    caseDiameter: '41 mm',
    thickness: '10.5 mm',
    powerReserve: '80 Hours (Extended)',
    waterResistance: '30 Metres (Splash Proof)',
    movementType: 'Flying Tourbillon Manual Wind',
    bestForWrist: 'Small to Medium (15–18.5 cm / 5.9–7.3 in)',
    visualTags: ['FLYING TOURBILLON', 'CREAM DIAL', 'COGNAC LEATHER'],
    tagColor: '#F97316',
    mood: 'silver / openworked / warm leather',
    dominantColor: 'Espresso & Cognac',
    bgGradient: '#0A0807',
    accentColor: '#FB923C',
    layoutPattern: 'image-center',
    isPinned: false,
  },
  {
    id: 'nova',
    number: '07 / 09',
    numIndex: 7,
    name: 'NOVA',
    collection: 'THE FUTURE SERIES',
    statement: 'The modern future of timekeeping in vivid cyan.',
    description: 'Anodized lightweight aluminum-titanium alloy framing a futuristic electric-cyan display. Engineered for visionary creators who love innovative aesthetics and ultra-lightweight wrist comfort.',
    easyExplanation: 'Featherlight futuristic watch with glowing electric cyan accents that turns heads in any room.',
    image: '/images/rendering-smart-home-device.jpg',
    basePriceUSD: 349,
    prices: {
      INR: 27995,
      USD: 349,
      GBP: 319,
      EUR: 369,
      CHF: 369,
      JPY: 56800,
      CAD: 519,
      AUD: 589,
      SGD: 519,
      AED: 1549,
    },
    caseDiameter: '42 mm',
    thickness: '9.6 mm (Featherlight 72g)',
    powerReserve: '72 Hours',
    waterResistance: '50 Metres (5 ATM)',
    movementType: 'Avant-Garde Kinetic Mechanical',
    bestForWrist: 'All Wrists (15–19.5 cm / 5.9–7.7 in)',
    visualTags: ['ELECTRIC CYAN', 'FEATHERLIGHT 72G', 'AVANT-GARDE'],
    tagColor: '#38BDF8',
    mood: 'futuristic / black / turquoise',
    dominantColor: 'Turquoise & Anodized Black',
    bgGradient: '#05090A',
    accentColor: '#38BDF8',
    layoutPattern: 'image-right',
    isPinned: false,
  },
  {
    id: 'solenne',
    number: '08 / 09',
    numIndex: 8,
    name: 'SOLENNE',
    collection: 'THE SIGNATURE SERIES',
    statement: 'The ultimate crowning masterpiece of ÉLVARA.',
    description: 'The pinnacle flagship timepiece combining 18K solid gold openwork architecture with a high-precision tourbillon regulator. Limited strictly to 9 pieces worldwide, each registered in Geneva archives.',
    easyExplanation: 'Our most prestigious collector watch: pure 18K gold openwork mechanics with museum-grade hand finishing.',
    image: '/images/watch1.jpg',
    basePriceUSD: 799,
    prices: {
      INR: 69995,
      USD: 799,
      GBP: 719,
      EUR: 849,
      CHF: 849,
      JPY: 128000,
      CAD: 1199,
      AUD: 1349,
      SGD: 1199,
      AED: 3599,
    },
    caseDiameter: '42.5 mm',
    thickness: '10.8 mm',
    powerReserve: '90 Hours (Near 4 Days)',
    waterResistance: '50 Metres (5 ATM)',
    movementType: 'Grand Tourbillon Openwork',
    bestForWrist: 'Medium to Large (16–20 cm / 6.3–7.9 in)',
    visualTags: ['FLAGSHIP TOURBILLON', '18K SOLID GOLD', '1 OF 9 WORLDWIDE'],
    tagColor: '#E5C378',
    mood: 'gold / black / haute horlogerie',
    dominantColor: 'Signature Black & Gold',
    bgGradient: '#090806',
    accentColor: '#E5C378',
    layoutPattern: 'image-left',
    isPinned: true,
  },
  {
    id: 'azurel',
    number: '09 / 09',
    numIndex: 9,
    name: 'AZUREL',
    collection: 'THE MIDNIGHT SERIES',
    statement: 'Deep midnight blue with graceful rose gold hands.',
    description: 'A rich deep navy sunburst dial that changes hue under different lighting conditions. Slim polished rose gold hands sweep across hand-applied markers, creating an aura of timeless European luxury.',
    easyExplanation: 'A gorgeous midnight blue dial with elegant rose-gold hands that shines gracefully in direct sunlight.',
    image: '/images/watch2.jpg',
    basePriceUSD: 249,
    prices: {
      INR: 17995,
      USD: 249,
      GBP: 229,
      EUR: 259,
      CHF: 259,
      JPY: 39800,
      CAD: 369,
      AUD: 419,
      SGD: 369,
      AED: 1099,
    },
    caseDiameter: '40.5 mm',
    thickness: '9.2 mm (Super Slim)',
    powerReserve: '68 Hours',
    waterResistance: '50 Metres (5 ATM)',
    movementType: 'Ultra-Thin Automatic',
    bestForWrist: 'Small to Medium (14.5–18 cm / 5.7–7.1 in)',
    visualTags: ['MIDNIGHT SUNBURST', 'ROSE GOLD HANDS', 'SLIM DRESS WATCH'],
    tagColor: '#818CF8',
    mood: 'midnight blue / black / elegant',
    dominantColor: 'Midnight Blue & Slate',
    bgGradient: '#06070B',
    accentColor: '#818CF8',
    layoutPattern: 'image-center',
    isPinned: false,
  },
];

/**
 * Normalizes string by stripping diacritics, special symbols, and casing
 */
export const normalizeWatchName = (str: string): string => {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
};

const WATCH_ALIASES: Record<string, string> = {
  vanguard: 'vangarde',
  aviation: 'vangarde',
  aviator: 'vangarde',
  solaris: 'solenne',
  celeste: 'azurel',
  chronos: 'nocturne',
  astral: 'nova',
};

/**
 * Single source of truth helper to resolve any watch name, keyword, ID, number,
 * or conversational query into a matching canonical WatchItem.
 */
export const resolveWatch = (input: string): WatchItem | null => {
  if (!input || typeof input !== 'string') return null;
  const clean = normalizeWatchName(input);
  if (!clean) return null;

  // 1. Direct match by ID
  const byId = WATCHES.find((w) => normalizeWatchName(w.id) === clean);
  if (byId) return byId;

  // 2. Direct match by Name
  const byName = WATCHES.find((w) => normalizeWatchName(w.name) === clean);
  if (byName) return byName;

  // 3. Alias dictionary match
  if (WATCH_ALIASES[clean]) {
    const aliased = WATCHES.find((w) => w.id === WATCH_ALIASES[clean]);
    if (aliased) return aliased;
  }

  // 4. Match by number (e.g. "01 / 09", "01", "1", "N° 01")
  const numOnly = clean.replace(/[^0-9]/g, '');
  if (numOnly && (clean.startsWith('0') || clean.includes('n°') || clean.includes('/') || /^\d+$/.test(clean))) {
    const byNum = WATCHES.find((w) => {
      const wNum = normalizeWatchName(w.number).replace(/[^0-9]/g, '');
      return wNum.startsWith(numOnly) || String(w.numIndex) === numOnly;
    });
    if (byNum) return byNum;
  }

  // 5. Word boundary / whole token check
  for (const watch of WATCHES) {
    const normName = normalizeWatchName(watch.name);
    const normId = normalizeWatchName(watch.id);
    const regex = new RegExp(`\\b(${normName}|${normId})\\b`, 'i');
    if (regex.test(clean)) {
      return watch;
    }
  }

  // 6. Substring inclusion check
  for (const watch of WATCHES) {
    const normName = normalizeWatchName(watch.name);
    const normId = normalizeWatchName(watch.id);
    if (clean.includes(normName) || clean.includes(normId)) {
      return watch;
    }
  }

  // 7. Check aliases in substring
  for (const [alias, targetId] of Object.entries(WATCH_ALIASES)) {
    if (clean.includes(alias)) {
      const aliased = WATCHES.find((w) => w.id === targetId);
      if (aliased) return aliased;
    }
  }

  return null;
};

/**
 * Single source of truth helper to get formatted price for any watch in any currency
 */
export const getWatchPrice = (
  watchIdOrItem: string | WatchItem,
  currency: Currency = 'INR'
): string => {
  const watch = typeof watchIdOrItem === 'string'
    ? WATCHES.find((w) => w.id === watchIdOrItem)
    : watchIdOrItem;
  if (!watch) return '';

  const exactLocalAmount = watch.prices[currency];
  if (typeof exactLocalAmount === 'number') {
    return formatRawPrice(exactLocalAmount, currency);
  }

  return formatPrice(watch.basePriceUSD, currency);
};

/**
 * Single source of truth helper to get converted numeric price for any watch in any currency
 */
export const getWatchNumericPrice = (
  watchIdOrItem: string | WatchItem,
  currency: Currency = 'INR'
): number => {
  const watch = typeof watchIdOrItem === 'string'
    ? WATCHES.find((w) => w.id === watchIdOrItem)
    : watchIdOrItem;
  if (!watch) return 0;

  const exactLocalAmount = watch.prices[currency];
  if (typeof exactLocalAmount === 'number') {
    return exactLocalAmount;
  }

  return watch.basePriceUSD;
};

