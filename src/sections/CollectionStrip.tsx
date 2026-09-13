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
          className="w-full px-4 sm:px-6 md:px-14 lg:px-20 z-20 will-change-[transform,opacity] shrink-0"
        >
          <div className="flex justify-between items-end pb-2 sm:pb-4 lg:pb-5">
            <div>
              <span className="font-eyebrow text-[0.52rem] sm:text-xs tracking-[0.25em] sm:tracking-[0.3em] text-[var(--color-accent)] block mb-0.5 sm:mb-1">
                COLLECTION EXHIBITION
              </span>
              <h2 className="font-display text-xl sm:text-2xl md:text-4xl lg:text-[2.75rem] text-[var(--color-text-primary)] font-light leading-none">
                THE NINE
              </h2>
            </div>

            {/* Active Timepiece Counter */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="hidden md:flex flex-col text-right">
                <span className="font-metadata text-[0.58rem] text-[var(--color-text-muted)] tracking-widest">
                  CURRENT TIMEPIECE
                </span>
                <span className="font-display text-base text-[var(--color-accent)]">
                  {WATCHES[activeIndex]?.name}
                </span>
              </div>
              <div className="font-metadata text-[0.62rem] sm:text-xs tracking-[0.2em] text-[var(--color-text-primary)] border border-white/15 px-2.5 sm:px-3 py-0.5 sm:py-1 bg-black/60 backdrop-blur-xl rounded-full shadow-lg">
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
          className="self-start flex h-[62vh] max-h-[500px] min-h-[380px] sm:h-[60vh] sm:max-h-[520px] lg:h-[58vh] lg:max-h-none w-max flex-nowrap items-center space-x-3.5 xs:space-x-4 sm:space-x-6 md:space-x-8 px-4 xs:px-6 md:px-14 lg:px-20 will-change-transform z-10 my-auto"
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
                className={`flex-shrink-0 h-full flex flex-col lg:flex-row shadow-2xl overflow-hidden bg-[#0F0F0D]/90 backdrop-blur-3xl border border-white/10 hover:border-[var(--color-accent)]/50 transition-all duration-500 rounded-xl sm:rounded-2xl relative group cursor-pointer ${
                  isHeroCard
                    ? 'w-[84vw] xs:w-[82vw] sm:w-[68vw] md:w-[64vw] lg:w-[54vw]'
                    : 'w-[78vw] xs:w-[76vw] sm:w-[58vw] md:w-[54vw] lg:w-[44vw]'
                }`}
                style={{
                  background: `linear-gradient(135deg, ${watch.bgGradient} 0%, #0A0A09 100%)`,
                  transform: index === 0 ? 'scale(1)' : 'scale(0.96)',
                  opacity: index === 0 ? 1 : 0.82,
                }}
              >
                {/* Watch Image Showcase */}
                <div className="w-full lg:w-[55%] h-[42%] xs:h-[44%] sm:h-[48%] lg:h-full overflow-hidden relative bg-[#141413] shrink-0">
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
                  <div className="absolute inset-x-0 bottom-0 h-16 sm:h-24 bg-gradient-to-t from-black/95 via-black/60 to-transparent pointer-events-none z-[3]" />

                  {/* Number Badge */}
                  <div className="absolute top-2.5 xs:top-3.5 left-2.5 xs:left-3.5 font-metadata text-[0.48rem] xs:text-[0.58rem] tracking-[0.16em] sm:tracking-[0.2em] bg-black/75 backdrop-blur-2xl px-2 xs:px-2.5 py-0.5 xs:py-1 border border-white/20 text-white rounded-full shadow-lg font-semibold z-[4]">
                    N° {watch.number}
                  </div>
                </div>

                {/* Editorial Details Column */}
                <div className="w-full lg:w-[45%] h-[58%] xs:h-[56%] sm:h-[52%] lg:h-full p-2.5 xs:p-3 sm:p-4 md:p-5 lg:p-5 flex flex-col justify-between relative bg-[#0D0D0B]/95 backdrop-blur-md">
                  {/* Accent Top Border */}
                  <div
                    className="absolute top-0 left-0 w-full lg:w-[2.5px] lg:h-full h-[2px] lg:h-full transition-all duration-300"
                    style={{ backgroundColor: watch.accentColor }}
                  />

                  <div className="min-h-0 flex-1 flex flex-col justify-start">
                    {/* Collection Category & Price Row */}
                    <div className="flex items-center justify-between gap-1 mb-1 sm:mb-1.5 shrink-0">
                      <span className="font-eyebrow text-[0.5rem] xs:text-[0.56rem] md:text-[0.65rem] tracking-[0.16em] sm:tracking-[0.2em] text-[var(--color-accent)] font-semibold truncate pr-1">
                        {watch.collection}
                      </span>
                      
                      <div className="inline-flex items-center gap-1 font-sans text-[0.52rem] xs:text-[0.58rem] sm:text-[0.62rem] tracking-wider text-white/95 bg-[#141414]/90 backdrop-blur-xl border border-white/10 px-1.5 xs:px-2 py-0.5 rounded font-medium shadow-md whitespace-nowrap shrink-0">
                        <FormattedPrice watch={watch} />
                      </div>
                    </div>

                    {/* Model Name */}
                    <h3 className="font-cinzel text-sm xs:text-base sm:text-xl md:text-2xl text-gold-bright font-light tracking-wide mb-0.5 sm:mb-1 leading-tight truncate shrink-0">
                      {watch.name}
                    </h3>

                    {/* Statement Quote */}
                    <p
                      className="font-display text-[0.56rem] xs:text-[0.64rem] sm:text-xs text-[var(--color-accent)] mb-0.5 sm:mb-1 italic font-normal line-clamp-1 shrink-0"
                    >
                      "{watch.statement}"
                    </p>

                    {/* Description Paragraph */}
                    <p className="font-body text-[0.58rem] xs:text-[0.65rem] sm:text-[0.74rem] md:text-[0.78rem] text-white/75 font-light leading-snug xs:leading-relaxed line-clamp-2 sm:line-clamp-3 md:line-clamp-4">
                      {watch.description}
                    </p>
                  </div>

                  {/* Micro Specs Tags & Action Footer */}
                  <div className="pt-1.5 sm:pt-2.5 flex items-center justify-between border-t border-white/10 shrink-0">
                    <div className="flex gap-1 xs:gap-1.5 flex-wrap">
                      <span className="font-metadata text-[0.46rem] xs:text-[0.52rem] sm:text-[0.58rem] border border-white/20 px-1.5 xs:px-2 sm:px-2.5 py-0.5 text-white bg-white/10 rounded-full font-medium whitespace-nowrap">
                        {watch.caseDiameter}
                      </span>
                      <span className="font-metadata text-[0.46rem] xs:text-[0.52rem] sm:text-[0.58rem] border border-white/20 px-1.5 xs:px-2 sm:px-2.5 py-0.5 text-white bg-white/10 rounded-full font-medium whitespace-nowrap">
                        {watch.waterResistance}
                      </span>
                    </div>
                    <span className="font-metadata text-[0.52rem] xs:text-[0.58rem] sm:text-[0.65rem] text-[var(--color-accent)] tracking-wider group-hover:translate-x-1 transition-transform font-semibold flex items-center gap-0.5 sm:gap-1 whitespace-nowrap pl-1">
                      COMPARE <span className="hidden xs:inline">SPEC</span> →
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Status Bar */}
        <div className="w-full px-4 sm:px-6 md:px-14 lg:px-20 z-20 flex justify-between items-center font-metadata text-white/70 text-[0.46rem] xs:text-[0.52rem] sm:text-xs tracking-[0.14em] sm:tracking-[0.25em] shrink-0 pt-1">
          <span className="hidden sm:inline">HORLOGERIE D'EXCELLENCE</span>
          <span className="text-[var(--color-accent)] font-semibold">SCROLL TO EXPLORE THE COLLECTION</span>
          <span>9 PIECES TOTAL</span>
        </div>
      </div>
    </section>
  );
};

export default CollectionStrip;
