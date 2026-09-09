/**
 * ÉLVARA Horology — Centralized Multi-Market Retail Pricing & Valuation Engine
 *
 * Supported Markets:
 * - INDIA (INR ₹) — Accessible premium sweet spot
 * - UNITED STATES (USD $) — Commercial retail sweet spot
 * - UNITED KINGDOM (GBP £) — British luxury retail
 * - EURO AREA (EUR €) — Continental European retail
 * - SWITZERLAND (CHF) — Swiss horological retail
 * - JAPAN (JPY ¥) — Japanese domestic market
 * - CANADA (CAD CA$) — Canadian retail
 * - AUSTRALIA (AUD A$) — Australian retail
 * - SINGAPORE (SGD S$) — Singapore retail
 * - UAE (AED) — Gulf luxury retail
 */

export type Currency =
  | 'INR'
  | 'USD'
  | 'GBP'
  | 'EUR'
  | 'CHF'
  | 'JPY'
  | 'CAD'
  | 'AUD'
  | 'SGD'
  | 'AED';

export interface CurrencyConfig {
  code: Currency;
  name: string;
  symbol: string;
  rate: number; // Indicative reference FX multiplier from 1 USD
  isPrefix: boolean;
  locale: string;
  countryName: string;
}

/**
 * Single source of truth for currency configuration & display
 */
export const CURRENCY_CONFIGS: Record<Currency, CurrencyConfig> = {
  INR: {
    code: 'INR',
    name: 'INR (₹)',
    symbol: '₹',
    rate: 83.5,
    isPrefix: true,
    locale: 'en-IN',
    countryName: 'India',
  },
  USD: {
    code: 'USD',
    name: 'USD ($)',
    symbol: '$',
    rate: 1.0,
    isPrefix: true,
    locale: 'en-US',
    countryName: 'United States',
  },
  GBP: {
    code: 'GBP',
    name: 'GBP (£)',
    symbol: '£',
    rate: 0.79,
    isPrefix: true,
    locale: 'en-GB',
    countryName: 'United Kingdom',
  },
  EUR: {
    code: 'EUR',
    name: 'EUR (€)',
    symbol: '€',
    rate: 0.92,
    isPrefix: true,
    locale: 'de-DE',
    countryName: 'Europe',
  },
  CHF: {
    code: 'CHF',
    name: 'CHF (Fr.)',
    symbol: 'CHF ',
    isPrefix: true,
    rate: 0.89,
    locale: 'de-CH',
    countryName: 'Switzerland',
  },
  JPY: {
    code: 'JPY',
    name: 'JPY (¥)',
    symbol: '¥',
    rate: 155.0,
    isPrefix: true,
    locale: 'ja-JP',
    countryName: 'Japan',
  },
  CAD: {
    code: 'CAD',
    name: 'CAD (CA$)',
    symbol: 'CA$',
    rate: 1.36,
    isPrefix: true,
    locale: 'en-CA',
    countryName: 'Canada',
  },
  AUD: {
    code: 'AUD',
    name: 'AUD (A$)',
    symbol: 'A$',
    rate: 1.52,
    isPrefix: true,
    locale: 'en-AU',
    countryName: 'Australia',
  },
  SGD: {
    code: 'SGD',
    name: 'SGD (S$)',
    symbol: 'S$',
    rate: 1.35,
    isPrefix: true,
    locale: 'en-SG',
    countryName: 'Singapore',
  },
  AED: {
    code: 'AED',
    name: 'AED',
    symbol: 'AED ',
    rate: 3.67,
    isPrefix: true,
    locale: 'en-AE',
    countryName: 'UAE',
  },
};

export const SUPPORTED_CURRENCIES: Currency[] = [
  'INR',
  'USD',
  'GBP',
  'EUR',
  'CHF',
  'JPY',
  'CAD',
  'AUD',
  'SGD',
  'AED',
];

export const DEFAULT_CURRENCY: Currency = 'INR';

/**
 * Formats an exact numeric retail price in the specified currency
 * e.g.:
 *  formatRawPrice(24995, 'INR') -> "₹24,995"
 *  formatRawPrice(299, 'USD') -> "$299"
 *  formatRawPrice(249, 'GBP') -> "£249"
 *  formatRawPrice(44800, 'JPY') -> "¥44,800"
 *  formatRawPrice(1099, 'AED') -> "AED 1,099"
 */
export const formatRawPrice = (amount: number, currency: Currency = 'INR'): string => {
  const config = CURRENCY_CONFIGS[currency] || CURRENCY_CONFIGS.INR;

  const formattedNumber = amount.toLocaleString(config.locale, {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });

  return config.isPrefix
    ? `${config.symbol}${formattedNumber}`
    : `${formattedNumber} ${config.symbol}`.trim();
};

/**
 * Fallback FX converter for dynamic items based on canonical USD base
 */
export const convertPriceFromUSD = (amountUSD: number, targetCurrency: Currency = 'USD'): number => {
  const config = CURRENCY_CONFIGS[targetCurrency] || CURRENCY_CONFIGS.USD;
  const raw = amountUSD * config.rate;

  switch (targetCurrency) {
    case 'INR':
      return Math.round(raw / 100) * 100 - 5; // e.g. 24,995
    case 'JPY':
      return Math.round(raw / 100) * 100;
    case 'AED':
      return Math.round(raw / 50) * 50 - 1; // e.g. 1,099
    case 'USD':
    case 'GBP':
    case 'EUR':
    case 'CHF':
    case 'CAD':
    case 'AUD':
    case 'SGD':
    default:
      return Math.round(raw / 10) * 10 - 1; // e.g. 299, 249
  }
};

/**
 * Formats a canonical USD price into target currency
 */
export const formatPrice = (amountUSD: number, targetCurrency: Currency = 'USD'): string => {
  const numeric = convertPriceFromUSD(amountUSD, targetCurrency);
  return formatRawPrice(numeric, targetCurrency);
};
