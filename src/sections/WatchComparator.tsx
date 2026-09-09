import React, { useState, useRef, useEffect, useCallback } from 'react';
import { WATCHES } from '@/data/watches';
import { ScrollTrigger, useGSAP } from '@/animations/gsap';
import { isReducedMotionPreferred } from '@/animations/presets';
import { useCurrency } from '@/context/CurrencyContext';

// Custom bespoke luxury dropdown to replace native HTML select
const LuxuryDropdown: React.FC<{
  value: string;
  onChange: (val: string) => void;
  accentClass: string;
  options: typeof WATCHES;
}> = ({ value, onChange, accentClass, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((o) => o.id === value) || options[0];
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative z-30" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-36 sm:w-44 bg-black/80 border border-white/15 text-[0.62rem] sm:text-[0.68rem] text-white px-2 py-1 rounded-md hover:border-white/35 transition-all shadow-inner cursor-pointer"
        type="button"
      >
        <span className="truncate font-medium">{selectedOption.number} — {selectedOption.name}</span>
        <svg
          className={`w-3 h-3 transition-transform duration-300 ml-1 flex-shrink-0 text-white/60 ${isOpen ? 'rotate-180 text-[var(--color-accent)]' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 w-52 sm:w-56 bg-[#0C0C0B]/98 backdrop-blur-xl border border-white/15 rounded-lg shadow-2xl overflow-hidden z-50 animate-fade-in-up">
          <div className="max-h-48 overflow-y-auto py-1 divide-y divide-white/5">
            {options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => {
                  onChange(opt.id);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-2.5 py-1.5 text-[0.62rem] transition-colors hover:bg-white/10 flex flex-col cursor-pointer ${
                  opt.id === value ? `${accentClass} bg-white/[0.04]` : 'text-white/80'
                }`}
                type="button"
              >
                <div className="font-semibold">{opt.number} — {opt.name}</div>
                <div className="text-[0.55rem] text-white/45 truncate">{opt.movementType}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const WatchComparator: React.FC = () => {
  const [watchAId, setWatchAId] = useState<string>(WATCHES[1].id); // Aurelia
  const [watchBId, setWatchBId] = useState<string>(WATCHES[3].id); // Nocturne

  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardARef = useRef<HTMLDivElement>(null);
  const cardBRef = useRef<HTMLDivElement>(null);
  const ledgerRef = useRef<HTMLDivElement>(null);
  const currentProgressRef = useRef<number>(0);
  const [progress, setProgress] = useState(0);
  const { format } = useCurrency();
  const watchA = WATCHES.find((w) => w.id === watchAId) || WATCHES[0];
  const watchB = WATCHES.find((w) => w.id === watchBId) || WATCHES[1];

  // Listen for global watch selection requests from navigation / chatbot
  useEffect(() => {
    const handleSelectWatch = (e: Event) => {
      const custom = e as CustomEvent<{ watchId: string }>;
      if (custom.detail?.watchId) {
        const found = WATCHES.find((w) => w.id === custom.detail.watchId);
        if (found) {
          setWatchAId(found.id);
        }
      }
    };
    window.addEventListener('elvara-select-watch', handleSelectWatch);
    return () => window.removeEventListener('elvara-select-watch', handleSelectWatch);
  }, []);

  const compareRows = [
    {
      title: 'Dimensions',
      valA: `${watchA.caseDiameter} • ${watchA.thickness}`,
      valB: `${watchB.caseDiameter} • ${watchB.thickness}`,
    },
    {
      title: 'Power Reserve',
      valA: watchA.powerReserve,
      valB: watchB.powerReserve,
    },
    {
      title: 'Movement Calibre',
      valA: watchA.movementType,
      valB: watchB.movementType,
    },
    {
      title: 'Direct Valuation',
      valA: format(watchA),
      valB: format(watchB),
    },
  ];

  // Progressive scroll-driven reveal (Multi-stage Chapter VIII choreography)
  const handleProgress = useCallback((p: number) => {
    setProgress(p);

    if (isReducedMotionPreferred()) {
      if (headerRef.current) {
        headerRef.current.style.opacity = '1';
        headerRef.current.style.transform = 'translate3d(0, 0, 0)';
      }
      if (cardARef.current) {
        cardARef.current.style.opacity = '1';
        cardARef.current.style.transform = 'translate3d(0, 0, 0) scale(1)';
      }
      if (cardBRef.current) {
        cardBRef.current.style.opacity = '1';
        cardBRef.current.style.transform = 'translate3d(0, 0, 0) scale(1)';
      }
      if (ledgerRef.current) {
        ledgerRef.current.style.opacity = '1';
        ledgerRef.current.style.transform = 'translate3d(0, 0, 0) scale(1)';
      }
      return;
    }

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    // 1. Header reveal (0.00 -> 0.12)
    if (headerRef.current) {
      const tHeader = Math.min(1, Math.max(0, p / 0.12));
      const eHeader = easeOutCubic(tHeader);
      headerRef.current.style.opacity = String(0.4 + eHeader * 0.6);
      headerRef.current.style.transform = `translate3d(0, ${(1 - eHeader) * -15}px, 0)`;
    }

    // 2. Timepiece A Card (Gold) from Left (-45px -> 0px, 0.02 -> 0.32)
    if (cardARef.current) {
      if (p < 0.02) {
        cardARef.current.style.opacity = '0.2';
        cardARef.current.style.transform = 'translate3d(-45px, 0, 0) scale(0.96)';
      } else if (p < 0.32) {
        const t = easeOutCubic((p - 0.02) / 0.30);
        cardARef.current.style.opacity = String(0.2 + t * 0.8);
        cardARef.current.style.transform = `translate3d(${(1 - t) * -45}px, 0, 0) scale(${0.96 + t * 0.04})`;
      } else {
        cardARef.current.style.opacity = '1';
        cardARef.current.style.transform = 'translate3d(0, 0, 0) scale(1)';
      }
    }

    // 3. Timepiece B Card (Titanium) from Right (45px -> 0px, 0.24 -> 0.54)
    if (cardBRef.current) {
      if (p < 0.24) {
        cardBRef.current.style.opacity = '0';
        cardBRef.current.style.transform = 'translate3d(45px, 0, 0) scale(0.96)';
      } else if (p < 0.54) {
        const t = easeOutCubic((p - 0.24) / 0.30);
        cardBRef.current.style.opacity = String(t);
        cardBRef.current.style.transform = `translate3d(${(1 - t) * 45}px, 0, 0) scale(${0.96 + t * 0.04})`;
      } else {
        cardBRef.current.style.opacity = '1';
        cardBRef.current.style.transform = 'translate3d(0, 0, 0) scale(1)';
      }
    }

    // 4. Specification Ledger from Bottom (30px -> 0px, 0.46 -> 0.76)
    if (ledgerRef.current) {
      if (p < 0.46) {
        ledgerRef.current.style.opacity = '0';
        ledgerRef.current.style.transform = 'translate3d(0, 30px, 0) scale(0.96)';
      } else if (p < 0.76) {
        const t = easeOutCubic((p - 0.46) / 0.30);
        ledgerRef.current.style.opacity = String(t);
        ledgerRef.current.style.transform = `translate3d(0, ${(1 - t) * 30}px, 0) scale(${0.96 + t * 0.04})`;
      } else {
        ledgerRef.current.style.opacity = '1';
        ledgerRef.current.style.transform = 'translate3d(0, 0, 0) scale(1)';
      }
    }
  }, []);

  // Dual Driver 1: RAF Native Window Scroll Listener
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        ticking = false;
        const trigger = sectionRef.current;
        if (!trigger) return;

        const rect = trigger.getBoundingClientRect();
        const totalScrollable = trigger.offsetHeight - window.innerHeight;

        if (totalScrollable <= 0) return;

        const scrollDistance = -rect.top;
        const p = Math.min(1, Math.max(0, scrollDistance / totalScrollable));

        if (Math.abs(p - currentProgressRef.current) > 0.0005) {
          currentProgressRef.current = p;
          handleProgress(p);
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleProgress]);

  // Dual Driver 2: GSAP ScrollTrigger Integration for Fluid Scrubbing
  useGSAP(
    () => {
      const trigger = sectionRef.current;
      if (!trigger) return;
      if (isReducedMotionPreferred()) return;

      const st = ScrollTrigger.create({
        trigger: trigger,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.1,
        onUpdate: (self) => {
          currentProgressRef.current = self.progress;
          handleProgress(self.progress);
        },
      });

      return () => {
        st.kill();
      };
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-[280vh] bg-[#070706] text-white border-t border-b border-white/10"
      aria-label="Chapter VIII: Watch Comparator"
    >
      {/* Sticky Fullscreen Viewport — Locked in place across progressive comparison */}
      <div className="viewport-pinned-stage px-4 sm:px-6 bg-[#070706]">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_40%,rgba(212,175,55,0.04)_0%,transparent_70%)]" />

        <div className="viewport-usable-shell max-w-4xl mx-auto luxury-container">
          {/* Header */}
          <div
            ref={headerRef}
            className="text-center max-w-lg mx-auto mb-1.5 sm:mb-2 will-change-[transform,opacity]"
          >
            <div className="inline-flex items-center space-x-1.5 bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] animate-pulse" />
              <span className="font-metadata text-[0.52rem] sm:text-[0.56rem] tracking-[0.2em] text-[var(--color-accent)] font-medium uppercase">
                CHAPTER VIII • SIDE-BY-SIDE COMPARATOR
              </span>
            </div>
            <h2 className="text-gold-gradient font-cinzel text-base sm:text-xl md:text-2xl font-normal leading-tight text-shadow-cinematic mb-0.5">
              Compare Models Side-by-Side
            </h2>
            <p className="font-sans text-[0.6rem] sm:text-[0.66rem] text-white/65 max-w-sm mx-auto font-light leading-snug">
              Select any two timepieces to compare wrist presence, power reserve, and architecture.
            </p>
          </div>

          {/* Watch Cards Row (Compact 2-Column) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5 mb-1.5 sm:mb-2">
            {/* Watch A Card (Gold Theme) */}
            <div
              ref={cardARef}
              className="comparator-card bg-[#0B0B0A]/90 border border-[var(--color-accent)]/25 rounded-xl p-2 sm:p-2.5 flex flex-col justify-between shadow-lg"
            >
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-metadata text-[0.54rem] text-[var(--color-accent)] font-semibold tracking-wider flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-[var(--color-accent)]" />
                    TIMEPIECE A
                  </span>
                  <LuxuryDropdown
                    value={watchAId}
                    onChange={setWatchAId}
                    accentClass="text-[var(--color-accent)]"
                    options={WATCHES}
                  />
                </div>

                <div className="h-16 sm:h-20 w-full rounded-lg overflow-hidden mb-1 bg-[#141413] border border-white/10 relative">
                  <div className="absolute inset-0 image-loading-placeholder pointer-events-none z-0" />
                  <img
                    key={watchA.id}
                    src={watchA.image}
                    alt={watchA.name}
                    loading="eager"
                    decoding="async"
                    className="w-full h-full object-cover filter contrast-[1.05] relative z-[1]"
                  />
                </div>

                <div className="flex items-baseline justify-between">
                  <h3 className="font-cinzel text-xs sm:text-sm text-gold-bright font-medium truncate">
                    {watchA.name}
                  </h3>
                  <div className="font-mono-num text-[0.64rem] text-white font-semibold whitespace-nowrap">
                    {format(watchA)}
                  </div>
                </div>
              </div>
            </div>

            {/* Watch B Card (Platinum/Titanium Theme) */}
            <div
              ref={cardBRef}
              className="comparator-card bg-[#0B0B0A]/90 border border-white/15 rounded-xl p-2 sm:p-2.5 flex flex-col justify-between shadow-lg"
            >
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-metadata text-[0.54rem] text-white/75 font-semibold tracking-wider flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-white/60" />
                    TIMEPIECE B
                  </span>
                  <LuxuryDropdown
                    value={watchBId}
                    onChange={setWatchBId}
                    accentClass="text-white font-medium"
                    options={WATCHES}
                  />
                </div>

                <div className="h-16 sm:h-20 w-full rounded-lg overflow-hidden mb-1 bg-[#141413] border border-white/10 relative">
                  <div className="absolute inset-0 image-loading-placeholder pointer-events-none z-0" />
                  <img
                    key={watchB.id}
                    src={watchB.image}
                    alt={watchB.name}
                    loading="eager"
                    decoding="async"
                    className="w-full h-full object-cover filter contrast-[1.05] relative z-[1]"
                  />
                </div>

                <div className="flex items-baseline justify-between">
                  <h3 className="font-cinzel text-xs sm:text-sm text-white font-medium truncate">
                    {watchB.name}
                  </h3>
                  <div className="font-mono-num text-[0.64rem] text-white font-semibold whitespace-nowrap">
                    {format(watchB)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Compact Technical Specification Ledger */}
          <div
            ref={ledgerRef}
            className="comparator-ledger bg-[#090908]/95 border border-white/10 rounded-xl p-2 sm:p-2.5 shadow-xl backdrop-blur-md"
          >
            {/* Header Row */}
            <div className="grid grid-cols-12 gap-2 pb-1 border-b border-white/15 text-[0.52rem] sm:text-[0.58rem] tracking-[0.14em] uppercase font-cinzel font-semibold">
              <div className="col-span-4 text-white/40">CRITERIA</div>
              <div className="col-span-4 text-[var(--color-accent)] truncate">{watchA.name}</div>
              <div className="col-span-4 text-white/90 truncate">{watchB.name}</div>
            </div>

            {/* Data Rows */}
            <div className="divide-y divide-white/[0.05]">
              {compareRows.map((row, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-12 gap-2 py-0.5 sm:py-1 px-1 rounded hover:bg-white/[0.03] transition-colors items-center text-[0.58rem] sm:text-[0.64rem]"
                >
                  <div className="col-span-4 font-mono text-[0.5rem] sm:text-[0.55rem] tracking-wider text-white/50 uppercase">
                    {row.title}
                  </div>
                  <div className="col-span-4 text-[var(--color-accent-bright)]/90 truncate font-sans font-medium">
                    {row.valA}
                  </div>
                  <div className="col-span-4 text-white/75 truncate font-sans">
                    {row.valB}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Interactive Progress Rail */}
          <div className="flex items-center justify-center space-x-3 mt-2 sm:mt-2.5">
            {[
              { label: '01 TIMEPIECE A', start: 0.08, end: 0.38 },
              { label: '02 TIMEPIECE B', start: 0.32, end: 0.62 },
              { label: '03 SPEC LEDGER', start: 0.58, end: 0.88 },
            ].map((step, idx) => {
              const active = progress >= step.start;
              const pct = Math.min(100, Math.max(0, ((progress - step.start) / (step.end - step.start)) * 100));

              return (
                <div key={idx} className="flex items-center space-x-1.5">
                  <div className="w-10 sm:w-14 h-[2px] bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[var(--color-accent)] transition-all duration-100"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span
                    className={`font-metadata text-[0.48rem] tracking-wider transition-colors duration-200 ${
                      active ? 'text-[var(--color-accent)] font-medium' : 'text-white/30'
                    }`}
                  >
                    0{idx + 1}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WatchComparator;
