import React, { useRef, useState, useEffect } from 'react';
import { WATCHES, resolveWatch } from '@/data/watches';
import { gsap, useGSAP, ScrollTrigger } from '@/animations/gsap';
import { isReducedMotionPreferred } from '@/animations/presets';
import { getLenis } from '@/animations/smoothScroll';
import { FormattedPrice } from '@/context/CurrencyContext';
import { navigateToSection } from '@/utils/navigation';

/**
 * CollectionStrip — The Nine: Pinned Horizontal Exhibition Gallery.
 * Asymmetric spatial layout, dynamic card scales, interactive dial indicators,
 * and tactile horizontal scrub.
 */
export const CollectionStrip: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const progressLineRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);

  // Preload collection images
  useEffect(() => {
    WATCHES.forEach((w) => {
      const img = new Image();
      img.src = w.image;
    });
  }, []);

  useEffect(() => {
    const handleSelectWatch = (e: Event) => {
      const custom = e as CustomEvent<{ watchId: string }>;
      if (!custom.detail?.watchId || !containerRef.current) return;

      const resolved = resolveWatch(custom.detail.watchId);
      if (!resolved) return;

      const watchIndex = WATCHES.findIndex((w) => w.id === resolved.id);
      if (watchIndex === -1) return;

      // Immediately synchronize active state
      setActiveIndex(watchIndex);
      activeIndexRef.current = watchIndex;

      cardsRef.current.forEach((card, cIdx) => {
        if (!card) return;
        const isActive = cIdx === watchIndex;
        card.style.transform = isActive ? 'scale(1)' : 'scale(0.96)';
        card.style.opacity = isActive ? '1' : '0.82';
      });

      const totalCards = WATCHES.length;
      const progress = totalCards > 1 ? watchIndex / (totalCards - 1) : 0;
      const rect = containerRef.current.getBoundingClientRect();
      const elementTop = rect.top + window.scrollY;
      const containerHeight = containerRef.current.offsetHeight;
      const scrollableDist = Math.max(0, containerHeight - window.innerHeight);
      const targetScrollY = elementTop + progress * scrollableDist;

      const lenis = getLenis();
      if (lenis && !isReducedMotionPreferred()) {
        lenis.scrollTo(targetScrollY, {
          duration: 1.15,
          immediate: false,
          lock: true,
          onComplete: () => {
            ScrollTrigger.update();
            ScrollTrigger.refresh();
          },
        });
      } else {
        window.scrollTo({
          top: targetScrollY,
          behavior: isReducedMotionPreferred() ? 'auto' : 'smooth',
        });
      }
    };

    window.addEventListener('elvara-select-watch', handleSelectWatch);
    return () => window.removeEventListener('elvara-select-watch', handleSelectWatch);
  }, []);

  useGSAP(
    () => {
      if (
        isReducedMotionPreferred() ||
        !containerRef.current ||
        !viewportRef.current ||
        !trackRef.current
      ) return;

      // Header entrance animation
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
              once: true,
            },
          }
        );
      }

      // Precise calculation: starts at 0 (Card 01) and translates smoothly through to Card 09
      const getScrollAmount = () => {
        if (!trackRef.current) return 0;
        const totalScrollable = trackRef.current.scrollWidth - window.innerWidth;
        const extraPadding = window.innerWidth < 768 ? 32 : 80;
        return -Math.max(0, totalScrollable + extraPadding);
      };

      const tl = gsap.to(trackRef.current, {
        x: () => getScrollAmount(),
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.3,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            // Update top progress indicator fill (0% to 100%)
            if (progressLineRef.current) {
              progressLineRef.current.style.transform = `scaleX(${self.progress})`;
            }

            // Map progress smoothly across all 9 cards (index 0 to 8)
            const count = WATCHES.length; // 9 cards
            const rawIndex = self.progress * (count - 1);
            const activeIdx = Math.min(count - 1, Math.max(0, Math.round(rawIndex)));

            if (activeIdx !== activeIndexRef.current) {
              activeIndexRef.current = activeIdx;
              setActiveIndex(activeIdx);
            }

            // Subtly scale active card vs neighboring cards with safe visibility bounds
            cardsRef.current.forEach((card, cIdx) => {
              if (!card) return;
              const isActive = cIdx === activeIdx;
              card.style.transform = isActive ? 'scale(1)' : 'scale(0.96)';
              card.style.opacity = isActive ? '1' : '0.82';
            });
          },
        },
      });

      // Internal image parallax scrub
      cardsRef.current.forEach((card) => {
        if (!card) return;
        const img = card.querySelector('.parallax-img');
        if (!img) return;

        gsap.fromTo(
          img,
          { xPercent: 8 },
          {
            xPercent: -8,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              start: 'left right',
              end: 'right left',
              scrub: true,
              containerAnimation: tl,
            },
          }
        );
      });
    },
    { scope: containerRef }
  );

  const handleCardClick = (watchId: string) => {
    navigateToSection('comparator', { watchId });
  };

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[380vh] min-h-[380vh] bg-[#070706] text-[#F2EEE5]"
    >
      <div
        ref={viewportRef}
        className="viewport-pinned-stage items-start justify-between pb-4 md:pb-6 w-full"
      >
        {/* Top Exhibition Navigation & Progress Bar */}
        <div
          ref={headerRef}
          className="w-full px-6 md:px-14 lg:px-20 z-20 will-change-[transform,opacity]"
        >
          <div className="flex justify-between items-end pb-5">
            <div>
              <span className="font-eyebrow text-[0.58rem] sm:text-xs tracking-[0.3em] text-[var(--color-accent)] block mb-1">
                COLLECTION EXHIBITION
              </span>
              <h2 className="font-display text-2xl md:text-4xl lg:text-[2.75rem] text-[var(--color-text-primary)] font-light">
                THE NINE
              </h2>
            </div>

            {/* Active Timepiece Counter */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex flex-col text-right">
                <span className="font-metadata text-[0.58rem] text-[var(--color-text-muted)] tracking-widest">
                  CURRENT TIMEPIECE
                </span>
                <span className="font-display text-base text-[var(--color-accent)]">
                  {WATCHES[activeIndex]?.name}
                </span>
              </div>
              <div className="font-metadata text-xs tracking-[0.2em] text-[var(--color-text-primary)] border border-white/15 px-3 py-1 bg-black/60 backdrop-blur-xl rounded-full shadow-lg">
                {WATCHES[activeIndex]?.number || '01 / 09'}
              </div>
            </div>
          </div>

          {/* Micro Progress Bar */}
          <div className="w-full h-[1.5px] bg-white/10 rounded-full relative overflow-hidden">
            <div
              ref={progressLineRef}
              className="absolute left-0 top-0 h-full w-full bg-[var(--color-accent)] rounded-full origin-left transition-transform duration-75 ease-out scale-x-0"
            />
          </div>
        </div>

        {/* Horizontal Spatial Exhibition Track */}
        <div
          ref={trackRef}
          className="self-start flex h-[52vh] sm:h-[55vh] md:h-[58vh] w-max flex-nowrap items-center space-x-5 px-6 md:space-x-8 md:px-14 lg:px-20 will-change-transform z-10 my-auto"
        >
          {WATCHES.map((watch, index) => {
            const isHeroCard = index === 0 || index === 3 || index === 7;

            return (
              <div
                key={watch.id}
                ref={(el) => {
                  cardsRef.current[index] = el;
                }}
                onClick={() => handleCardClick(watch.id)}
                className={`flex-shrink-0 h-full flex flex-col lg:flex-row shadow-2xl overflow-hidden bg-[#0F0F0D]/90 backdrop-blur-3xl border border-white/10 hover:border-[var(--color-accent)]/50 transition-all duration-500 rounded-2xl relative group cursor-pointer ${
                  isHeroCard
                    ? 'w-[86vw] md:w-[64vw] lg:w-[54vw]'
                    : 'w-[80vw] md:w-[54vw] lg:w-[44vw]'
                }`}
                style={{
                  background: `linear-gradient(135deg, ${watch.bgGradient} 0%, #0A0A09 100%)`,
                  transform: index === 0 ? 'scale(1)' : 'scale(0.96)',
                  opacity: index === 0 ? 1 : 0.82,
                }}
              >
                {/* Watch Image Showcase */}
                <div className="w-full lg:w-[55%] h-[52%] lg:h-full overflow-hidden relative bg-[#141413]">
                  {/* Subtle Luxury Image Skeleton Placeholder */}
                  <div className="absolute inset-0 image-loading-placeholder pointer-events-none z-0" />
                  <img
                    src={watch.image}
                    alt={watch.name}
                    loading={index < 2 ? "eager" : "lazy"}
                    decoding="async"
                    className="parallax-img absolute inset-0 w-full h-full object-cover filter contrast-[1.06] brightness-[0.92] group-hover:scale-105 transition-transform duration-700 ease-out z-[1]"
                  />
                  {/* Dark gradient overlay protecting text and dials */}
                  <div className="collection-image-gradient absolute inset-0 pointer-events-none z-[2]" />
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/95 via-black/60 to-transparent pointer-events-none z-[3]" />

                  {/* Number Badge */}
                  <div className="absolute top-3.5 left-3.5 font-metadata text-[0.58rem] tracking-[0.2em] bg-black/75 backdrop-blur-2xl px-2.5 py-1 border border-white/20 text-white rounded-full shadow-lg font-semibold z-[4]">
                    N° {watch.number}
                  </div>
                </div>

                {/* Editorial Details Column */}
                <div className="w-full lg:w-[45%] h-[48%] lg:h-full p-4 md:p-5 lg:p-5 flex flex-col justify-between relative bg-[#0D0D0B]/95 backdrop-blur-md">
                  {/* Accent Top Border */}
                  <div
                    className="absolute top-0 left-0 w-full lg:w-[2.5px] lg:h-full h-[2.5px] transition-all duration-300"
                    style={{ backgroundColor: watch.accentColor }}
                  />

                  <div>
                    <div className="flex flex-col xl:flex-row xl:justify-between xl:items-center gap-1.5 mb-2">
                      <span className="font-eyebrow text-[0.58rem] md:text-[0.65rem] tracking-[0.2em] text-[var(--color-accent)] font-semibold truncate pr-2">
                        {watch.collection}
                      </span>
                      
                      <div className="inline-flex items-center gap-1 font-sans text-[0.62rem] tracking-wider text-white/95 bg-[#141414]/90 backdrop-blur-xl border border-white/10 px-2 py-0.5 rounded-md font-medium shadow-md whitespace-nowrap shrink-0">
                        <FormattedPrice watch={watch} />
                      </div>
                    </div>

                    <h3 className="font-cinzel text-lg sm:text-xl md:text-2xl text-gold-bright font-light tracking-wide mb-1">
                      {watch.name}
                    </h3>
                    <p
                      className="font-display text-[0.7rem] md:text-xs text-[var(--color-accent)] mb-1.5 italic font-normal line-clamp-1"
                    >
                      "{watch.statement}"
                    </p>
                    <p className="font-body text-[0.72rem] md:text-[0.78rem] text-white/75 font-light leading-relaxed line-clamp-3 md:line-clamp-4">
                      {watch.description}
                    </p>
                  </div>

                  {/* Micro Specs Tags & Action */}
                  <div className="pt-3 flex items-center justify-between border-t border-white/10">
                    <div className="flex gap-1.5 flex-wrap">
                      <span className="font-metadata text-[0.58rem] border border-white/20 px-2.5 py-0.5 text-white bg-white/10 rounded-full font-medium">
                        {watch.caseDiameter}
                      </span>
                      <span className="font-metadata text-[0.58rem] border border-white/20 px-2.5 py-0.5 text-white bg-white/10 rounded-full font-medium">
                        {watch.waterResistance}
                      </span>
                    </div>
                    <span className="font-metadata text-[0.65rem] text-[var(--color-accent)] tracking-wider group-hover:translate-x-1 transition-transform font-semibold flex items-center gap-1">
                      COMPARE SPEC →
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Status Bar */}
        <div className="w-full px-6 md:px-14 lg:px-20 z-20 flex justify-between items-center font-metadata text-white/70 text-xs tracking-[0.25em]">
          <span>HORLOGERIE D'EXCELLENCE</span>
          <span className="text-[var(--color-accent)] font-semibold">SCROLL TO EXPLORE THE COLLECTION</span>
          <span>9 PIECES TOTAL</span>
        </div>
      </div>
    </section>
  );
};

export default CollectionStrip;
