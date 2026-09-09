import React, { createContext, useContext, useState, useMemo } from 'react';
import {
  type Currency,
  CURRENCY_CONFIGS,
  SUPPORTED_CURRENCIES,
  DEFAULT_CURRENCY,
  formatPrice,
  formatRawPrice,
  convertPriceFromUSD,
} from '@/utils/currency';
import { type WatchItem, getWatchPrice } from '@/data/watches';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  format: (val: number | WatchItem) => string;
  formatWatch: (watch: WatchItem) => string;
  formatRaw: (amount: number) => string;
  convert: (amountUSD: number) => number;
  currencies: Currency[];
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: DEFAULT_CURRENCY,
  setCurrency: () => {},
  format: (val: number | WatchItem) => {
    if (typeof val === 'object' && val !== null) {
      return getWatchPrice(val, DEFAULT_CURRENCY);
    }
    return formatPrice(val, DEFAULT_CURRENCY);
  },
  formatWatch: (watch: WatchItem) => getWatchPrice(watch, DEFAULT_CURRENCY),
  formatRaw: (amount: number) => formatRawPrice(amount, DEFAULT_CURRENCY),
  convert: (amountUSD: number) => convertPriceFromUSD(amountUSD, DEFAULT_CURRENCY),
  currencies: SUPPORTED_CURRENCIES,
});

const STORAGE_KEY = 'elvara_currency_pref';

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<Currency>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY) as Currency;
        if (saved && SUPPORTED_CURRENCIES.includes(saved)) {
          return saved;
        }
      } catch {
        // localStorage unavailable
      }
    }
    return DEFAULT_CURRENCY;
  });

  const setCurrency = (c: Currency) => {
    if (SUPPORTED_CURRENCIES.includes(c)) {
      setCurrencyState(c);
      try {
        localStorage.setItem(STORAGE_KEY, c);
      } catch {
        // localStorage unavailable
      }
    }
  };

  const value = useMemo(
    () => ({
      currency,
      setCurrency,
      format: (val: number | WatchItem) => {
        if (typeof val === 'object' && val !== null) {
          return getWatchPrice(val, currency);
        }
        return formatPrice(val, currency);
      },
      formatWatch: (watch: WatchItem) => getWatchPrice(watch, currency),
      formatRaw: (amount: number) => formatRawPrice(amount, currency),
      convert: (amountUSD: number) => convertPriceFromUSD(amountUSD, currency),
      currencies: SUPPORTED_CURRENCIES,
    }),
    [currency]
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
};

export const useCurrency = (): CurrencyContextType => {
  return useContext(CurrencyContext);
};

/**
 * Reusable component to render a watch or price in the current active currency
 */
export const FormattedPrice: React.FC<{
  watch?: WatchItem;
  amountUSD?: number;
  className?: string;
}> = ({ watch, amountUSD, className }) => {
  const { format } = useCurrency();
  if (watch) {
    return <span className={className}>{format(watch)}</span>;
  }
  return <span className={className}>{format(amountUSD ?? 0)}</span>;
};

/**
 * Elegant luxury currency selector dropdown
 */
export const CurrencySelector: React.FC<{
  className?: string;
  variant?: 'compact' | 'minimal' | 'full';
}> = ({ className = '', variant = 'compact' }) => {
  const { currency, setCurrency, currencies } = useCurrency();

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value as Currency)}
        className="bg-white/5 hover:bg-white/10 border border-white/15 focus:border-[var(--color-accent)] text-white font-metadata text-[0.62rem] sm:text-[0.68rem] tracking-wider rounded-lg px-2 py-1 cursor-pointer transition-colors focus:outline-none appearance-none pr-5"
        aria-label="Select currency"
      >
        {currencies.map((c) => (
          <option key={c} value={c} className="bg-[#121210] text-white">
            {variant === 'full' ? `${c} (${CURRENCY_CONFIGS[c].symbol.trim()})` : c}
          </option>
        ))}
      </select>
      <div className="absolute right-1.5 pointer-events-none text-white/50 text-[0.55rem]">
        ▼
      </div>
    </div>
  );
};
