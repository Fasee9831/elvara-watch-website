import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WATCHES, getWatchPrice, getWatchNumericPrice, resolveWatch, type WatchItem } from '@/data/watches';
import { navigateToSection } from '@/utils/navigation';
import { isReducedMotionPreferred } from '@/animations/presets';
import { useCurrency } from '@/context/CurrencyContext';
import {
  type Currency,
  SUPPORTED_CURRENCIES,
  CURRENCY_CONFIGS,
  formatRawPrice,
} from '@/utils/currency';

interface ChatOption {
  label: string;
  query: string;
  targetSection?: string;
  watchId?: string;
}

interface ChatMessage {
  id: string;
  sender: 'assistant' | 'user';
  text: string;
  displayedText?: string;
  isTyping?: boolean;
  action?: {
    label: string;
    targetSection: string;
  };
  options?: ChatOption[];
  showAction?: boolean;
}

interface QuickPrompt {
  id: string;
  label: string;
  query: string;
  targetSection?: string;
}

const INITIAL_PROMPTS: QuickPrompt[] = [
  { id: 'nine', label: 'EXPLORE WATCHES', query: 'Show me the watches', targetSection: 'collection' },
  { id: 'pricing', label: 'CHECK PRICING', query: 'What are your watch prices?', targetSection: 'collection' },
  { id: 'wrist', label: 'FIND MY WATCH', query: 'Which watch is best for my wrist?', targetSection: 'wrist-guide' },
  { id: 'bespoke', label: 'CUSTOMIZE A WATCH', query: 'Can I customize a watch?', targetSection: 'customizer' },
  { id: 'compare', label: 'COMPARE WATCHES', query: 'How do I compare watches?', targetSection: 'comparator' },
];

const INTRO_TEXT =
  'Welcome to ÉLVARA.\n\nI’m here to help you explore our timepieces, check pricing across global currencies, find the right fit for your wrist, or customize a bespoke commission.';

/**
 * Material summaries in simple English
 */
const WATCH_MATERIALS: Record<string, string> = {
  eclipse: 'satin-brushed surgical steel',
  aurelia: 'solid 18K yellow gold with openwork gears',
  meridien: 'obsidian glass with diamond markers and black Italian leather',
  nocturne: 'DLC obsidian titanium with champagne gold accents',
  vangarde: 'matte ceramic with an olive canvas strap',
  seraphine: 'classic steel and flying tourbillon with cognac leather',
  nova: 'lightweight anodized aluminum-titanium alloy in electric cyan',
  solenne: 'solid 18K yellow gold with tourbillon openwork',
  azurel: 'midnight blue sunburst steel with rose gold hands',
};

/**
 * Extract currency from natural language query
 */
export const extractCurrency = (query: string): Currency | null => {
  const q = query.toLowerCase();

  // Multi-word / compound checks first
  if (/\b(canadian dollar|canadian dollars|canadian|c\$|ca\$)\b/i.test(q)) return 'CAD';
  if (/\b(australian dollar|australian dollars|australian|a\$|au\$)\b/i.test(q)) return 'AUD';
  if (/\b(singapore dollar|singapore dollars|singapore|s\$|sg\$)\b/i.test(q)) return 'SGD';
  if (/\b(swiss franc|swiss francs|switzerland)\b/i.test(q)) return 'CHF';
  if (/\b(british pound|british pounds|uk|quid|sterling)\b/i.test(q)) return 'GBP';
  if (/\b(us dollar|us dollars|usa|america)\b/i.test(q)) return 'USD';

  // Standard code and symbol checks
  if (/\b(inr|rupee|rupees|rs|₹)\b/i.test(q) || q.includes('₹')) return 'INR';
  if (/\b(usd|dollar|dollars|bucks)\b/i.test(q) || (q.includes('$') && !q.includes('c$') && !q.includes('a$') && !q.includes('s$'))) return 'USD';
  if (/\b(gbp|pound|pounds|£)\b/i.test(q) || q.includes('£')) return 'GBP';
  if (/\b(eur|euro|euros|€)\b/i.test(q) || q.includes('€')) return 'EUR';
  if (/\b(chf|franc|francs)\b/i.test(q)) return 'CHF';
  if (/\b(jpy|yen|¥)\b/i.test(q) || q.includes('¥')) return 'JPY';
  if (/\b(cad)\b/i.test(q)) return 'CAD';
  if (/\b(aud)\b/i.test(q)) return 'AUD';
  if (/\b(sgd)\b/i.test(q)) return 'SGD';
  if (/\b(aed|dirham|dirhams|dhs|dhr|uae|dubai)\b/i.test(q)) return 'AED';

  return null;
};

/**
 * Detect price / money / amount / cost / rate intent
 */
export const isPriceQuery = (query: string): boolean => {
  const q = query.toLowerCase();

  const priceKeywords = [
    'price',
    'prices',
    'pricing',
    'cost',
    'costs',
    'costing',
    'amount',
    'amounts',
    'rate',
    'rates',
    'value',
    'valuation',
    'how much',
    'how expensive',
    'what do i pay',
    'what to pay',
    'what is the fee',
    'how much is',
    'what is the price',
    'cheapest',
    'cheaper',
    'lowest price',
    'affordable',
    'starting price',
    'start from',
    'most expensive',
    'priciest',
    'budget',
    'under',
    'below',
    'less than',
    'around',
    'rupee',
    'rupees',
    'dollar',
    'dollars',
    'euro',
    'euros',
    'pound',
    'pounds',
    'franc',
    'francs',
    'yen',
    'dirham',
    'dirhams',
    'inr',
    'usd',
    'gbp',
    'eur',
    'chf',
    'jpy',
    'cad',
    'aud',
    'sgd',
    'aed',
    '₹',
    '$',
    '£',
    '€',
    '¥',
  ];

  return priceKeywords.some((kw) => q.includes(kw));
};

/**
 * Extract numeric budget and currency from queries like "under ₹30,000", "under $500", "below 40000 inr"
 */
export const extractBudget = (
  query: string
): { amount: number; currency: Currency | null } | null => {
  const q = query.toLowerCase();

  // Look for budget trigger words
  if (!/(under|below|less than|budget|within|up to|max)\b/i.test(q)) {
    return null;
  }

  const detectedCurr = extractCurrency(q);

  // Match numbers like 30,000, 30000, 30k, 500, 1000
  const matchK = q.match(/(\d+(?:\.\d+)?)\s*k\b/i);
  if (matchK) {
    const val = parseFloat(matchK[1]) * 1000;
    return { amount: val, currency: detectedCurr };
  }

  const matchNum = q.match(/(?:under|below|less than|budget|within|up to|max)\s*[:=]?\s*([₹$£€¥A-Z]{1,4})?\s*([\d,]+)/i);
  if (matchNum) {
    const rawVal = matchNum[2].replace(/,/g, '');
    const val = parseFloat(rawVal);
    if (!isNaN(val) && val > 0) {
      return { amount: val, currency: detectedCurr };
    }
  }

  return null;
};

/**
 * Standard list of currency quick options
 */
const getCurrencyOptions = (watchName?: string): ChatOption[] => {
  return SUPPORTED_CURRENCIES.map((code) => {
    const config = CURRENCY_CONFIGS[code];
    return {
      label: config.code === 'AED' || config.code === 'CHF' ? config.code : `${config.code} ${config.symbol.trim()}`,
      query: watchName ? `${watchName} in ${code}` : `Prices in ${code}`,
    };
  });
};

/**
 * Intelligent Concierge Response Engine with Smart Multi-Currency Support
 */
export const generateConciergeResponse = (
  input: string,
  activeCurrency: Currency = 'USD',
  contextWatchId: string | null = null,
  contextCurrency: Currency | null = null
): {
  text: string;
  action?: { label: string; targetSection: string };
  options?: ChatOption[];
  nextWatchId?: string | null;
  nextCurrency?: Currency | null;
} => {
  const query = input.toLowerCase().trim();
  const detectedCurrency = extractCurrency(query);
  const isPrice = isPriceQuery(query);

  // 1. Identify any mentioned watches in this query using resolveWatch
  const resolvedDirect = resolveWatch(query);
  let mentionedWatches = WATCHES.filter(
    (w) =>
      query.includes(w.name.toLowerCase()) ||
      query.includes(w.id) ||
      (w.number && query.includes(w.number.replace(/\s+/g, '')))
  );

  if (resolvedDirect && !mentionedWatches.some((w) => w.id === resolvedDirect.id)) {
    mentionedWatches.push(resolvedDirect);
  }

  // If no watch explicitly in this query, but user query is a follow-up (e.g. "in EUR", "Rupees", "what about gold?")
  // use the contextWatchId from conversational memory
  let activeWatch: WatchItem | null = null;
  if (resolvedDirect) {
    activeWatch = resolvedDirect;
  } else if (mentionedWatches.length === 1) {
    activeWatch = mentionedWatches[0];
  } else if (mentionedWatches.length === 0 && contextWatchId) {
    const matched = WATCHES.find((w) => w.id === contextWatchId);
    if (matched) {
      activeWatch = matched;
    }
  }

  // Determine the effective currency for this response
  const targetCurrency: Currency = detectedCurrency || contextCurrency || activeCurrency;

  // =========================================================================
  // 2. BUDGET FILTER (e.g. "Watches under ₹30,000", "Under $500", "Below 400 EUR")
  // =========================================================================
  const budget = extractBudget(query);
  if (budget) {
    const filterCurr = budget.currency || targetCurrency;
    const matchingWatches = WATCHES.filter(
      (w) => getWatchNumericPrice(w, filterCurr) <= budget.amount
    );

    const formattedBudget = formatRawPrice(budget.amount, filterCurr);

    if (matchingWatches.length > 0) {
      const listText = matchingWatches
        .map((w) => `• ${w.name.toUpperCase()} — ${getWatchPrice(w, filterCurr)} (${w.caseDiameter})`)
        .join('\n');

      return {
        text: `Here are the ÉLVARA timepieces available under ${formattedBudget}:\n\n${listText}`,
        action: {
          label: 'EXPLORE WATCHES →',
          targetSection: 'collection',
        },
        options: matchingWatches.slice(0, 3).map((w) => ({
          label: `VIEW ${w.name.toUpperCase()}`,
          query: `Tell me about ${w.name}`,
        })),
        nextCurrency: filterCurr,
      };
    } else {
      const cheapest = WATCHES[0];
      return {
        text: `We do not have timepieces listed below ${formattedBudget}.\n\nOur most accessible timepiece is ${cheapest.name.toUpperCase()} at ${getWatchPrice(cheapest, filterCurr)}.`,
        action: {
          label: `VIEW ${cheapest.name.toUpperCase()} →`,
          targetSection: 'collection',
        },
        options: [
          { label: `VIEW ${cheapest.name.toUpperCase()}`, query: `Tell me about ${cheapest.name}` },
          { label: 'ALL PRICES', query: `Prices in ${filterCurr}` },
        ],
        nextCurrency: filterCurr,
      };
    }
  }

  // =========================================================================
  // 3. STARTING / ENTRY PRICE (e.g. "cheapest watch", "starting price", "lowest price")
  // =========================================================================
  if (
    isPrice &&
    (query.includes('cheapest') ||
      query.includes('lowest') ||
      query.includes('starting') ||
      query.includes('start from') ||
      query.includes('entry') ||
      query.includes('affordable') ||
      query.includes('least expensive'))
  ) {
    const entryWatch = WATCHES[0]; // ÉCLIPSE is lowest priced
    const formattedPrice = getWatchPrice(entryWatch, targetCurrency);
    return {
      text: `ÉLVARA pricing starts at ${formattedPrice} for ${entryWatch.name.toUpperCase()} (${entryWatch.caseDiameter}, surgical steel automatic mechanical).`,
      action: {
        label: `VIEW ${entryWatch.name.toUpperCase()} →`,
        targetSection: 'collection',
      },
      options: [
        { label: `CUSTOMIZE ${entryWatch.name.toUpperCase()}`, query: `Customize ${entryWatch.name}` },
        { label: 'SEE ALL PRICES', query: `What are all prices in ${targetCurrency}` },
        { label: 'CHANGE CURRENCY', query: 'What currencies do you support?' },
      ],
      nextWatchId: entryWatch.id,
      nextCurrency: targetCurrency,
    };
  }

  // =========================================================================
  // 4. MOST EXPENSIVE / PINNACLE (e.g. "most expensive", "highest price", "flagship price")
  // =========================================================================
  if (
    isPrice &&
    (query.includes('most expensive') ||
      query.includes('highest') ||
      query.includes('pinnacle') ||
      query.includes('top tier') ||
      query.includes('priciest'))
  ) {
    const pinnacleWatch = WATCHES.find((w) => w.id === 'solenne') || WATCHES[WATCHES.length - 1];
    const formattedPrice = getWatchPrice(pinnacleWatch, targetCurrency);
    return {
      text: `${pinnacleWatch.name.toUpperCase()} is our pinnacle piece at ${formattedPrice}, crafted in solid 18K yellow gold with an exhibition sapphire back.`,
      action: {
        label: `VIEW ${pinnacleWatch.name.toUpperCase()} →`,
        targetSection: 'collection',
      },
      options: [
        { label: `EXPLORE ${pinnacleWatch.name.toUpperCase()}`, query: `Tell me about ${pinnacleWatch.name}` },
        { label: 'COMPARE ALL', query: 'Compare watches' },
      ],
      nextWatchId: pinnacleWatch.id,
      nextCurrency: targetCurrency,
    };
  }

  // =========================================================================
  // 5. COMPARISON BETWEEN TWO WATCHES
  // =========================================================================
  if (
    (query.includes('compare') ||
      query.includes('versus') ||
      query.includes('difference') ||
      query.includes(' vs ') ||
      query.includes('cheaper') ||
      query.includes('better')) &&
    mentionedWatches.length >= 2
  ) {
    const w1 = mentionedWatches[0];
    const w2 = mentionedWatches[1];
    const p1 = getWatchPrice(w1, targetCurrency);
    const p2 = getWatchPrice(w2, targetCurrency);

    return {
      text: `${w1.name.toUpperCase()} · ${p1}\n${w1.caseDiameter} · ${w1.movementType}\n\n${w2.name.toUpperCase()} · ${p2}\n${w2.caseDiameter} · ${w2.movementType}`,
      action: {
        label: 'COMPARE SIDE BY SIDE →',
        targetSection: 'comparator',
      },
      options: [
        { label: `VIEW ${w1.name.toUpperCase()}`, query: `Tell me about ${w1.name}` },
        { label: `VIEW ${w2.name.toUpperCase()}`, query: `Tell me about ${w2.name}` },
      ],
      nextWatchId: w1.id,
      nextCurrency: targetCurrency,
    };
  }

  // =========================================================================
  // 6. SPECIFIC WATCH INTENTS
  // =========================================================================
  if (activeWatch) {
    const watch = activeWatch;
    const upperName = watch.name.toUpperCase();

    // 6A. PRICE / AMOUNT / RATE / COST INQUIRY
    if (isPrice || detectedCurrency !== null) {
      // RULE: If watch is known but currency is NOT specified in this turn nor in previous context,
      // prompt the user with interactive currency options without defaulting to any single currency.
      if (!detectedCurrency && !contextCurrency) {
        return {
          text: `${upperName} is currently listed in multiple regional currencies.\n\nWhat currency would you like to see the amount in?`,
          action: {
            label: `VIEW ${upperName} →`,
            targetSection: 'collection',
          },
          options: getCurrencyOptions(watch.name),
          nextWatchId: watch.id,
        };
      }

      // Currency is specified or known in context
      const formattedPrice = getWatchPrice(watch, targetCurrency);
      return {
        text: `${upperName} is ${formattedPrice}.\n\nHand-finished in surgical metallurgy with a 5-year international warranty and complimentary insured worldwide delivery.`,
        action: {
          label: `VIEW ${upperName} →`,
          targetSection: 'collection',
        },
        options: [
          { label: `CUSTOMIZE ${upperName}`, query: `Customize ${watch.name}` },
          { label: 'USD ($)', query: `${watch.name} in USD` },
          { label: 'EUR (€)', query: `${watch.name} in EUR` },
          { label: 'INR (₹)', query: `${watch.name} in INR` },
          { label: 'GBP (£)', query: `${watch.name} in GBP` },
        ],
        nextWatchId: watch.id,
        nextCurrency: targetCurrency,
      };
    }

    // 6B. Size / Diameter / Thickness
    if (
      query.includes('size') ||
      query.includes('diameter') ||
      query.includes('dimension') ||
      query.includes('thick') ||
      query.includes('how big') ||
      query.includes('mm')
    ) {
      return {
        text: `${watch.name} has a ${watch.caseDiameter} case with a thickness of ${watch.thickness.split('(')[0].trim()}.\nBest for ${watch.bestForWrist.toLowerCase()}.`,
        action: {
          label: `VIEW ${upperName} →`,
          targetSection: 'collection',
        },
        options: [
          { label: `PRICE IN ${targetCurrency}`, query: `${watch.name} price in ${targetCurrency}` },
          { label: 'CALIBRATE WRIST FIT', query: 'Wrist sizing guide' },
        ],
        nextWatchId: watch.id,
      };
    }

    // 6C. Material / Build
    if (
      query.includes('material') ||
      query.includes('made of') ||
      query.includes('metal') ||
      query.includes('steel') ||
      query.includes('gold') ||
      query.includes('titanium') ||
      query.includes('ceramic')
    ) {
      const materialDesc = WATCH_MATERIALS[watch.id] || 'premium materials and sapphire crystal';
      return {
        text: `${upperName} is crafted in ${materialDesc} with anti-reflective sapphire crystal.`,
        action: {
          label: `VIEW ${upperName} →`,
          targetSection: 'collection',
        },
        options: [
          { label: `CUSTOMIZE ${upperName}`, query: `Customize ${watch.name}` },
          { label: `CHECK PRICE`, query: `${watch.name} price` },
        ],
        nextWatchId: watch.id,
      };
    }

    // 6D. Movement / Battery / Power Reserve
    if (
      query.includes('movement') ||
      query.includes('power') ||
      query.includes('reserve') ||
      query.includes('automatic') ||
      query.includes('battery') ||
      query.includes('wind')
    ) {
      return {
        text: `${watch.name} is powered by a high-grade ${watch.movementType.toLowerCase()} movement with a ${watch.powerReserve.toLowerCase()} power reserve.`,
        action: {
          label: `VIEW ${upperName} →`,
          targetSection: 'collection',
        },
        options: [
          { label: `CHECK PRICE`, query: `${watch.name} price` },
          { label: 'VIEW MOVEMENTS', query: 'Tell me about ÉLVARA movements' },
        ],
        nextWatchId: watch.id,
      };
    }

    // 6E. Water resistance
    if (
      query.includes('water') ||
      query.includes('swim') ||
      query.includes('atm') ||
      query.includes('depth') ||
      query.includes('shower')
    ) {
      return {
        text: `${watch.name} is rated water resistant to ${watch.waterResistance.toLowerCase()}.`,
        action: {
          label: `VIEW ${upperName} →`,
          targetSection: 'collection',
        },
        options: [
          { label: `CHECK PRICE`, query: `${watch.name} price` },
          { label: `VIEW ${upperName}`, query: `Show me ${watch.name}` },
        ],
        nextWatchId: watch.id,
      };
    }

    // 6F. Wrist fit for this watch
    if (query.includes('wrist') || query.includes('fit') || query.includes('wear')) {
      return {
        text: `${watch.name} features a ${watch.caseDiameter} case diameter and is optimized for ${watch.bestForWrist.toLowerCase()}.`,
        action: {
          label: 'CALIBRATE WRIST FIT →',
          targetSection: 'wrist-guide',
        },
        options: [
          { label: `PRICE IN ${targetCurrency}`, query: `${watch.name} in ${targetCurrency}` },
          { label: 'WRIST SIZING GUIDE', query: 'Find my watch' },
        ],
        nextWatchId: watch.id,
      };
    }

    // 6G. General watch question fallback
    return {
      text: `${upperName}\n\n${watch.caseDiameter} · ${watch.movementType}\n${watch.easyExplanation || watch.statement}`,
      action: {
        label: `VIEW ${upperName} →`,
        targetSection: 'collection',
      },
      options: [
        { label: `CHECK PRICE`, query: `${watch.name} price` },
        { label: `CUSTOMIZE ${upperName}`, query: `Customize ${watch.name}` },
      ],
      nextWatchId: watch.id,
    };
  }

  // =========================================================================
  // 7. CURRENCY SPECIFIED, BUT NO WATCH IDENTIFIED
  // e.g. "What are your prices in Euros?", "How much in INR?", "Prices in GBP"
  // =========================================================================
  if (detectedCurrency && isPrice) {
    const minP = getWatchPrice('eclipse', detectedCurrency);
    const maxP = getWatchPrice('solenne', detectedCurrency);

    return {
      text: `In ${detectedCurrency}, our nine timepieces range from ${minP} (ÉCLIPSE) to ${maxP} (SOLENNE).\n\nWhich watch would you like the exact price for?`,
      action: {
        label: 'EXPLORE COLLECTION →',
        targetSection: 'collection',
      },
      options: WATCHES.slice(0, 4).map((w) => ({
        label: `${w.name.toUpperCase()} (${getWatchPrice(w, detectedCurrency)})`,
        query: `${w.name} in ${detectedCurrency}`,
      })),
      nextCurrency: detectedCurrency,
    };
  }

  // =========================================================================
  // 8. GENERAL PRICING OVERVIEW (NO WATCH & NO CURRENCY)
  // =========================================================================
  if (isPrice) {
    return {
      text: 'Our nine timepieces are priced according to local regional markets.\n\nWhich currency would you like to view the prices in?',
      action: {
        label: 'EXPLORE COLLECTION →',
        targetSection: 'collection',
      },
      options: getCurrencyOptions(),
    };
  }

  // =========================================================================
  // 9. WRIST SIZING WITH SPECIFIC NUMBERS (e.g. "17.5 cm", "16cm", "7 inches")
  // =========================================================================
  const numMatch = query.match(/(\d+(\.\d+)?)\s*(cm|mm|in|inch|inches)?/);
  if (
    (query.includes('wrist') || query.includes('size') || query.includes('fit')) &&
    numMatch &&
    parseFloat(numMatch[1]) >= 12 &&
    parseFloat(numMatch[1]) <= 25
  ) {
    const val = parseFloat(numMatch[1]);
    let suggestion = 'around 40–43 mm';
    if (val < 16) {
      suggestion = 'around 39–40 mm (such as ÉCLIPSE or AZUREL)';
    } else if (val > 18.5) {
      suggestion = 'around 42–44 mm (such as NOCTURNE or VANGARDE)';
    }
    return {
      text: `For a wrist circumference of ${numMatch[0]}, our horological fitting guide recommends ${suggestion}.`,
      action: {
        label: 'CALIBRATE WRIST FIT →',
        targetSection: 'wrist-guide',
      },
      options: [
        { label: 'FIND MY WATCH', query: 'Which watch is best for my wrist?' },
        { label: 'EXPLORE COLLECTION', query: 'Show me the watches' },
      ],
    };
  }

  // =========================================================================
  // 10. GENERAL WRIST & SIZING QUESTIONS
  // =========================================================================
  if (
    query.includes('wrist') ||
    query.includes('size') ||
    query.includes('fit') ||
    query.includes('dimension') ||
    query.includes('diameter') ||
    query.includes('small wrist') ||
    query.includes('big wrist') ||
    query.includes('large wrist')
  ) {
    if (query.includes('small')) {
      return {
        text: 'For smaller wrists (15–17 cm), we recommend 39–40 mm cases like ÉCLIPSE or AZUREL for balanced proportions.',
        action: {
          label: 'FIND MY WATCH →',
          targetSection: 'wrist-guide',
        },
        options: [
          { label: 'ÉCLIPSE (40 mm)', query: 'Tell me about Eclipse' },
          { label: 'AZUREL (40 mm)', query: 'Tell me about Azurel' },
        ],
      };
    }
    if (query.includes('large') || query.includes('big')) {
      return {
        text: 'For larger wrists (18–20+ cm), bolder 43–44 mm cases like NOCTURNE or VANGARDE provide commanding wrist presence.',
        action: {
          label: 'FIND MY WATCH →',
          targetSection: 'wrist-guide',
        },
        options: [
          { label: 'NOCTURNE (43 mm)', query: 'Tell me about Nocturne' },
          { label: 'VANGARDE (44 mm)', query: 'Tell me about Vangarde' },
        ],
      };
    }
    return {
      text: 'Case sizes range from 39 mm to 44 mm. You can use our interactive wrist guide to find the perfect ergonomic match for your wrist.',
      action: {
        label: 'OPEN WRIST GUIDE →',
        targetSection: 'wrist-guide',
      },
    };
  }

  // =========================================================================
  // 11. BESPOKE CUSTOMIZER
  // =========================================================================
  if (
    query.includes('custom') ||
    query.includes('bespoke') ||
    query.includes('build') ||
    query.includes('engrav') ||
    query.includes('strap')
  ) {
    return {
      text: 'Our Atelier Customizer allows you to tailor metallurgies, select openwork calibres, and commission bespoke monogram engravings.',
      action: {
        label: 'OPEN CUSTOMIZER →',
        targetSection: 'customizer',
      },
      options: [
        { label: 'OPEN CUSTOMIZER', query: 'Can I customize a watch?' },
        { label: 'EXPLORE BASE WATCHES', query: 'Show me the watches' },
      ],
    };
  }

  // =========================================================================
  // 12. COMPARATOR GENERAL
  // =========================================================================
  if (
    query.includes('compare') ||
    query.includes('difference') ||
    query.includes('versus') ||
    query.includes('side by side')
  ) {
    return {
      text: 'You can compare any two ÉLVARA timepieces side by side to examine diameters, thickness, movement calibres, and pricing.',
      action: {
        label: 'COMPARE WATCHES →',
        targetSection: 'comparator',
      },
    };
  }

  // =========================================================================
  // 13. CRAFTSMANSHIP & ATELIER
  // =========================================================================
  if (
    query.includes('craft') ||
    query.includes('finish') ||
    query.includes('polish') ||
    query.includes('handmade') ||
    query.includes('made') ||
    query.includes('quality')
  ) {
    return {
      text: 'Every ÉLVARA timepiece combines precision CNC hand-finishing with openwork mechanical architecture engineered to chronometric standards.',
      action: {
        label: 'DISCOVER CRAFTSMANSHIP →',
        targetSection: 'craftsmanship',
      },
    };
  }

  // =========================================================================
  // 14. ATELIER LOCATION & VISITS
  // =========================================================================
  if (
    query.includes('where') ||
    query.includes('visit') ||
    query.includes('atelier') ||
    query.includes('store') ||
    query.includes('shop') ||
    query.includes('appointment') ||
    query.includes('geneva')
  ) {
    return {
      text: 'Our flagship private atelier is situated in Geneva:\n\nRue du Rhône 42\n1204 Genève, Switzerland\natelier@elvara.com · +41 22 819 00 00',
      action: {
        label: 'REQUEST A PRIVATE VISIT →',
        targetSection: 'footer',
      },
    };
  }

  // =========================================================================
  // 15. MOVEMENTS & CALIBRES
  // =========================================================================
  if (
    query.includes('movement') ||
    query.includes('calibre') ||
    query.includes('battery') ||
    query.includes('automatic') ||
    query.includes('accuracy') ||
    query.includes('cosc')
  ) {
    return {
      text: 'All ÉLVARA timepieces are 100% mechanical and battery-free. They feature 65–90 hour power reserves with precision automatic calibres.',
      action: {
        label: 'EXPLORE MOVEMENTS →',
        targetSection: 'movement',
      },
    };
  }

  // =========================================================================
  // 16. COLLECTION & CATALOG
  // =========================================================================
  if (
    query.includes('collection') ||
    query.includes('nine') ||
    query.includes('models') ||
    query.includes('watches') ||
    query.includes('timepieces') ||
    query.includes('catalog') ||
    query.includes('show me') ||
    query.includes('all')
  ) {
    return {
      text: 'The ÉLVARA collection comprises nine distinct mechanical timepieces, each representing a unique study in metallurgy, dial architecture, and chronometry.',
      action: {
        label: 'EXPLORE THE NINE →',
        targetSection: 'collection',
      },
      options: [
        { label: 'CHECK PRICING', query: 'What are your watch prices?' },
        { label: 'FIND MY WRIST SIZE', query: 'Which watch is best for my wrist?' },
      ],
    };
  }

  // =========================================================================
  // 17. SHIPPING & WARRANTY
  // =========================================================================
  if (
    query.includes('shipping') ||
    query.includes('deliver') ||
    query.includes('warranty') ||
    query.includes('guarantee') ||
    query.includes('return')
  ) {
    return {
      text: 'We provide complimentary worldwide courier delivery with full insurance and a 5-year international manufacturer warranty on every timepiece.',
      action: {
        label: 'VIEW ATELIER DETAILS →',
        targetSection: 'footer',
      },
    };
  }

  // =========================================================================
  // 18. FALLBACK RESPONSE
  // =========================================================================
  return {
    text: 'I can assist you with watch details, regional pricing, wrist sizing calibrations, or bespoke custom commissions.\n\nHow may I assist your exploration today?',
    action: {
      label: 'EXPLORE WATCHES →',
      targetSection: 'collection',
    },
    options: [
      { label: 'EXPLORE WATCHES', query: 'Show me the watches' },
      { label: 'CHECK PRICING', query: 'What are your watch prices?' },
      { label: 'FIND MY WATCH', query: 'Which watch is best for my wrist?' },
    ],
  };
};

export const PrivateConcierge: React.FC = () => {
  const { currency } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [activeTypingId, setActiveTypingId] = useState<string | null>(null);

  // Conversational Context Memory
  const [contextWatchId, setContextWatchId] = useState<string | null>(null);
  const [contextCurrency, setContextCurrency] = useState<Currency | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimerRef = useRef<number | null>(null);
  const hasInitializedIntroRef = useRef(false);

  const reduced = isReducedMotionPreferred();

  // Smooth scroll to bottom of chat list
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isThinking, isOpen, scrollToBottom]);

  // Handle character-by-character typing animation
  const typeOutMessage = useCallback(
    (messageId: string, fullText: string) => {
      if (reduced) {
        // Reduced motion: instant display
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId
              ? { ...msg, displayedText: fullText, isTyping: false, showAction: true }
              : msg
          )
        );
        setActiveTypingId(null);
        return;
      }

      setActiveTypingId(messageId);
      let currentIndex = 0;

      const typeNextChar = () => {
        if (currentIndex <= fullText.length) {
          const currentText = fullText.slice(0, currentIndex);
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === messageId ? { ...msg, displayedText: currentText, isTyping: true } : msg
            )
          );

          if (currentIndex === fullText.length) {
            // Typing complete: finalize and reveal action buttons & options
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === messageId
                  ? { ...msg, displayedText: fullText, isTyping: false, showAction: true }
                  : msg
              )
            );
            setActiveTypingId(null);
            return;
          }

          const char = fullText[currentIndex];
          currentIndex++;

          // Fast, natural human cadence: brisk typing with light punctuation pauses
          let delay = 12 + Math.floor(Math.random() * 8); // 12-20ms baseline
          if (char === '.' || char === '!' || char === '?') {
            delay = 90;
          } else if (char === ',' || char === ':' || char === ';') {
            delay = 50;
          } else if (char === '\n') {
            delay = 90;
          }

          typingTimerRef.current = window.setTimeout(typeNextChar, delay);
        }
      };

      typeNextChar();
    },
    [reduced]
  );

  // Trigger intro typing on first open
  useEffect(() => {
    if (isOpen && !hasInitializedIntroRef.current) {
      hasInitializedIntroRef.current = true;
      const introMsgId = 'intro-welcome';
      const initialMsg: ChatMessage = {
        id: introMsgId,
        sender: 'assistant',
        text: INTRO_TEXT,
        displayedText: '',
        isTyping: true,
        showAction: false,
      };

      setMessages([initialMsg]);

      // Slight initial breathing delay (180ms) before concierge begins typing
      const initTimer = window.setTimeout(() => {
        typeOutMessage(introMsgId, INTRO_TEXT);
      }, 180);

      return () => clearTimeout(initTimer);
    }
  }, [isOpen, typeOutMessage]);

  // Clean up typing timers on unmount
  useEffect(() => {
    return () => {
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
      }
    };
  }, []);

  // Keyboard navigation & accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        launcherRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      const focusTimer = window.setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
      return () => clearTimeout(focusTimer);
    }
  }, [isOpen]);

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputValue;
    if (!query.trim() || activeTypingId !== null || isThinking) return;

    // 1. Add user message immediately
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query.trim(),
      displayedText: query.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsThinking(true);

    // 2. Concierge thinking phase (400ms target)
    window.setTimeout(() => {
      const response = generateConciergeResponse(
        query,
        currency,
        contextWatchId,
        contextCurrency
      );

      // Update conversational context memory
      if (response.nextWatchId !== undefined) {
        setContextWatchId(response.nextWatchId);
      }
      if (response.nextCurrency !== undefined) {
        setContextCurrency(response.nextCurrency);
      }

      const asstMsgId = `asst-${Date.now()}`;

      const assistantMsg: ChatMessage = {
        id: asstMsgId,
        sender: 'assistant',
        text: response.text,
        displayedText: '',
        isTyping: true,
        action: response.action,
        options: response.options,
        showAction: false,
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setIsThinking(false);

      // 3. Start typing assistant character-by-character
      typeOutMessage(asstMsgId, response.text);
    }, 400);
  };

  const handleActionClick = (targetSection: string) => {
    setIsOpen(false);
    setTimeout(() => {
      navigateToSection(targetSection, { watchId: contextWatchId || undefined });
    }, 60);
  };

  const handleOptionClick = (opt: ChatOption) => {
    // 1. If option explicitly defines targetSection and/or watchId
    if (opt.watchId || (opt.targetSection && opt.targetSection !== 'collection')) {
      const targetSec = opt.targetSection || 'collection';
      setIsOpen(false);
      setTimeout(() => {
        navigateToSection(targetSec, { watchId: opt.watchId });
      }, 60);
      return;
    }

    // 2. Resolve watch from label or query
    const matchedWatch = resolveWatch(opt.label) || resolveWatch(opt.query);

    const isCurrencyQuery =
      opt.query.includes(' in ') ||
      opt.query.toLowerCase().startsWith('prices in') ||
      opt.query.toLowerCase().startsWith('price in') ||
      opt.query.toLowerCase().includes('what currencies') ||
      opt.label.includes('($)') ||
      opt.label.includes('(₹)') ||
      opt.label.includes('(€)') ||
      opt.label.includes('(£)') ||
      opt.label.includes('(¥)');

    const isWristQuery =
      opt.query.toLowerCase().includes('calibrate wrist') ||
      opt.query.toLowerCase().includes('wrist sizing guide') ||
      opt.query.toLowerCase().includes('find my watch');

    if (matchedWatch && !isCurrencyQuery && !isWristQuery) {
      if (opt.query.toLowerCase().includes('custom')) {
        setIsOpen(false);
        setTimeout(() => {
          navigateToSection('customizer', { watchId: matchedWatch.id });
        }, 60);
        return;
      }
      if (opt.query.toLowerCase().includes('compar')) {
        setIsOpen(false);
        setTimeout(() => {
          navigateToSection('comparator', { watchId: matchedWatch.id });
        }, 60);
        return;
      }
      // Pure watch selection (e.g. "[MÉRIDIEN]", "[VIEW MÉRIDIEN]", "[ÉCLIPSE]", "[AURELIA]", "[NOCTURNE]")
      setIsOpen(false);
      setTimeout(() => {
        navigateToSection('collection', { watchId: matchedWatch.id });
      }, 60);
      return;
    }

    // 3. Otherwise, pass as query to continue conversational concierge
    handleSend(opt.query);
  };

  const isAnyMessageTyping = activeTypingId !== null;

  const panelVariants = {
    closed: {
      opacity: 0,
      y: reduced ? 0 : 12,
      scale: reduced ? 1 : 0.97,
      transition: { duration: 0.22, ease: 'easeInOut' as const },
    },
    open: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: reduced ? 0.15 : 0.35,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  return (
    <>
      {/* =========================================================
          1. FLOATING CHAT PANEL OVERLAY (FIXED, COMPACT & ISOLATED)
         ========================================================= */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={panelVariants}
            initial="closed"
            animate="open"
            exit="closed"
            role="dialog"
            aria-label="ÉLVARA Private Concierge"
            className="fixed z-[96] right-3 sm:right-6 bottom-[calc(4.5rem+env(safe-area-inset-bottom,0px))] sm:bottom-20 w-[calc(100vw-24px)] sm:w-[360px] h-[430px] max-h-[calc(100vh-90px)] max-h-[calc(100dvh-90px)] bg-[#0C0C0B]/98 backdrop-blur-2xl border border-[var(--color-accent)]/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-white font-sans"
            style={{
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.92), 0 0 32px rgba(229, 195, 120, 0.08)',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#080807] border-b border-white/10 shrink-0 sticky top-0 z-10">
              <style>{`
                @keyframes elvara-chatbot-online-pulse {
                  0%, 100% { opacity: 1; transform: scale(1); }
                  50% { opacity: 0.4; transform: scale(0.85); }
                }
              `}</style>
              <div className="flex flex-col">
                <div className="flex items-center space-x-2">
                  <span className="font-cinzel text-xs tracking-[0.18em] font-medium text-white uppercase leading-tight">
                    ÉLVARA ASSISTANT
                  </span>
                  <div className="flex items-center space-x-1 pl-1.5 border-l border-white/15">
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] inline-block shrink-0"
                      style={{
                        boxShadow: '0 0 6px rgba(229, 195, 120, 0.6)',
                        animation: 'elvara-chatbot-online-pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                      }}
                    />
                    <span className="font-metadata text-[0.46rem] tracking-[0.16em] text-[var(--color-accent)] uppercase font-semibold leading-tight">
                      ONLINE
                    </span>
                  </div>
                </div>
                <span className="font-metadata text-[0.44rem] tracking-[0.08em] text-white/40 block mt-0.5 leading-tight">
                  Here to help you explore ÉLVARA.
                </span>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="w-5 h-5 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-white/60 hover:text-white flex items-center justify-center text-[0.65rem] transition-colors cursor-pointer shrink-0"
                aria-label="Close concierge"
                type="button"
              >
                ✕
              </button>
            </div>

            {/* Conversation Messages Body */}
            <div className="flex-1 min-h-0 overflow-y-auto px-3.5 py-3 space-y-3 custom-scrollbar text-[0.76rem] leading-relaxed">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[92%] px-3 py-2 rounded-xl whitespace-pre-line text-left transition-all ${
                      msg.sender === 'user'
                        ? 'bg-[var(--color-accent)]/15 border border-[var(--color-accent)]/40 text-white rounded-br-xs'
                        : 'bg-[#131312] border border-white/10 text-white/90 rounded-bl-xs'
                    }`}
                  >
                    {msg.sender === 'assistant' ? (
                      <>
                        <span>{msg.displayedText !== undefined ? msg.displayedText : msg.text}</span>
                        {/* Elegant trailing cursor indicator while typing */}
                        {msg.isTyping && (
                          <span className="inline-block w-[5px] h-[12px] ml-1 bg-[var(--color-accent)] align-middle animate-pulse" />
                        )}
                      </>
                    ) : (
                      <span>{msg.text}</span>
                    )}
                  </div>

                  {/* Contextual Options & Action Buttons (Revealed only after response completes typing) */}
                  {msg.showAction && (
                    <div className="space-y-1.5 mt-1.5 max-w-[95%]">
                      {/* Action Link Button */}
                      {msg.action && (
                        <motion.div
                          initial={{ opacity: 0, y: 3 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.25 }}
                        >
                          <button
                            onClick={() => handleActionClick(msg.action!.targetSection)}
                            className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-[var(--color-accent)]/10 hover:bg-[var(--color-accent)]/25 border border-[var(--color-accent)]/40 hover:border-[var(--color-accent)] text-[var(--color-accent)] hover:text-white rounded-md font-metadata text-[0.52rem] tracking-[0.16em] uppercase font-semibold transition-all cursor-pointer shadow-sm group"
                            type="button"
                          >
                            <span>{msg.action.label}</span>
                          </button>
                        </motion.div>
                      )}

                      {/* Interactive Option Chips */}
                      {msg.options && msg.options.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 3 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.25, delay: 0.05 }}
                          className="flex flex-wrap gap-1.5 pt-0.5"
                        >
                          {msg.options.map((opt, i) => (
                            <button
                              key={i}
                              onClick={() => handleOptionClick(opt)}
                              className="px-2 py-0.5 rounded-md bg-[#161615] hover:bg-[var(--color-accent)]/20 border border-white/10 hover:border-[var(--color-accent)]/60 text-[0.62rem] text-white/80 hover:text-white transition-all cursor-pointer font-metadata uppercase tracking-wider"
                              type="button"
                            >
                              {opt.label}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {/* Concierge Thinking State */}
              {isThinking && (
                <div className="flex items-center space-x-2 px-3 py-1.5 bg-[#131312] border border-white/10 rounded-xl rounded-bl-xs w-fit">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] animate-pulse" />
                  <span className="font-metadata text-[0.48rem] text-[var(--color-accent)] tracking-[0.18em] uppercase font-semibold">
                    CONSULTING ATELIER...
                  </span>
                </div>
              )}

              {/* Quick Actions (Revealed when not typing and after initial intro) */}
              {messages.length === 1 && !isAnyMessageTyping && !isThinking && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.1 }}
                  className="pt-1.5"
                >
                  <span className="font-metadata text-[0.46rem] tracking-[0.2em] text-white/40 uppercase block mb-1.5">
                    SUGGESTED EXPLORATIONS
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {INITIAL_PROMPTS.map((prompt) => (
                      <button
                        key={prompt.id}
                        onClick={() => handleSend(prompt.query)}
                        className="text-left px-2.5 py-1 rounded-md bg-[#111110] hover:bg-white/[0.08] border border-white/10 hover:border-[var(--color-accent)]/50 text-[0.62rem] text-white/75 hover:text-white transition-all cursor-pointer font-sans"
                        type="button"
                      >
                        {prompt.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-2.5 bg-[#080807] border-t border-white/10 flex items-center gap-2 shrink-0"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isAnyMessageTyping || isThinking}
                placeholder={
                  isAnyMessageTyping || isThinking
                    ? 'Typing...'
                    : 'Ask about watches, prices, currencies...'
                }
                className="flex-1 bg-[#121211] border border-white/15 focus:border-[var(--color-accent)] rounded-lg px-2.5 py-1.5 text-xs text-white placeholder:text-white/35 focus:outline-none transition-colors disabled:opacity-50"
                aria-label="Message ÉLVARA Concierge"
              />

              <button
                type="submit"
                disabled={!inputValue.trim() || isAnyMessageTyping || isThinking}
                className="px-3 py-1.5 bg-[var(--color-accent)]/20 hover:bg-[var(--color-accent)] disabled:opacity-25 border border-[var(--color-accent)]/40 hover:border-[var(--color-accent)] text-[var(--color-accent)] hover:text-[#0A0A09] rounded-lg text-xs font-semibold transition-all cursor-pointer disabled:cursor-not-allowed flex items-center justify-center"
                aria-label="Send message"
              >
                →
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================================
          2. FLOATING CONCIERGE LAUNCHER BUTTON (FIXED BOTTOM-RIGHT)
         ========================================================= */}
      <div className="fixed z-[95] right-3 sm:right-6 bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] sm:bottom-6 select-none">
        {/* Hover Tooltip */}
        <AnimatePresence>
          {isTooltipVisible && !isOpen && (
            <motion.div
              initial={{ opacity: 0, x: 6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 6 }}
              transition={{ duration: 0.2 }}
              className="absolute right-full top-1/2 -translate-y-1/2 mr-2.5 px-2.5 py-1 bg-[#0C0C0B]/95 border border-[var(--color-accent)]/40 rounded-md shadow-xl backdrop-blur-md pointer-events-none whitespace-nowrap hidden sm:block"
            >
              <span className="font-metadata text-[0.5rem] tracking-[0.2em] text-[var(--color-accent)] uppercase font-semibold">
                PRIVATE CONCIERGE
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          ref={launcherRef}
          onClick={() => setIsOpen(!isOpen)}
          onMouseEnter={() => setIsTooltipVisible(true)}
          onMouseLeave={() => setIsTooltipVisible(false)}
          className={`w-11 sm:w-13 h-11 sm:h-13 rounded-full bg-[#0C0C0B] border transition-all duration-300 shadow-2xl flex items-center justify-center cursor-pointer group ${
            isOpen
              ? 'border-[var(--color-accent)] shadow-[0_0_24px_rgba(229,195,120,0.35)] scale-105'
              : 'border-[var(--color-accent)]/50 hover:border-[var(--color-accent)] hover:shadow-[0_0_20px_rgba(229,195,120,0.25)] hover:scale-105'
          }`}
          aria-label={isOpen ? 'Close ÉLVARA Concierge' : 'Open ÉLVARA Private Concierge'}
          aria-expanded={isOpen}
          type="button"
        >
          {isOpen ? (
            <span className="text-white text-sm font-light transition-transform group-hover:rotate-90 duration-300">
              ✕
            </span>
          ) : (
            <div className="flex flex-col items-center justify-center">
              {/* Refined Custom É Monogram */}
              <span className="font-cinzel text-base sm:text-lg text-[var(--color-accent)] font-semibold tracking-tighter leading-none group-hover:scale-110 transition-transform duration-300">
                É
              </span>
              <span className="w-1 h-1 rounded-full bg-[var(--color-accent)] mt-0.5 opacity-80" />
            </div>
          )}
        </button>
      </div>
    </>
  );
};

export default PrivateConcierge;
