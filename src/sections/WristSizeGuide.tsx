import React, { useState, useRef, useEffect, useCallback } from 'react';
import { WATCHES } from '@/data/watches';
import { ScrollTrigger, useGSAP } from '@/animations/gsap';
import { isReducedMotionPreferred } from '@/animations/presets';
import { navigateToSection } from '@/utils/navigation';

export const WristSizeGuide: React.FC = () => {
  const [wristCircumferenceCM, setWristCircumferenceCM] = useState<number>(17.5);

  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const cardsHeaderRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const currentProgressRef = useRef<number>(0);

  const wristInches = (wristCircumferenceCM / 2.54).toFixed(1);

  const getFitCategory = (cm: number) => {
    if (cm < 15.5) {
      return {
        label: 'Petite / Slim Wrist',
        caseSizes: '38 mm – 41 mm',
        tips: 'Slim profiles and tapered lugs sit flat with ideal ergonomic balance.',
        recommendedIds: ['eclipse', 'azurel', 'meridien', 'seraphine'],
      };
    } else if (cm <= 18.5) {
      return {
        label: 'Universal / Standard',
        caseSizes: '40 mm – 43 mm',
        tips: 'Both classic dress watches and openwork skeleton calibres fit with distinction.',
        recommendedIds: ['aurelia', 'seraphine', 'nova', 'eclipse'],
      };
    } else {
      return {
        label: 'Athletic / Broad Wrist',
        caseSizes: '42 mm – 46 mm',
        tips: 'Commanding high-complication timepieces feel balanced and proportional.',
        recommendedIds: ['nocturne', 'solenne', 'vangarde', 'aurelia'],
      };
    }
  };

  const currentFit = getFitCategory(wristCircumferenceCM);
  const recommendedWatches = WATCHES.filter((w) => currentFit.recommendedIds.includes(w.id));

  // Progressive scroll-driven reveal (Multi-stage Chapter IX choreography)
  const handleProgress = useCallback((p: number) => {
    if (isReducedMotionPreferred()) {
      if (headerRef.current) {
        headerRef.current.style.opacity = '1';
        headerRef.current.style.transform = 'translate3d(0, 0, 0)';
      }
      if (panelRef.current) {
        panelRef.current.style.opacity = '1';
        panelRef.current.style.transform = 'translate3d(0, 0, 0) scale(1)';
      }
      if (cardsHeaderRef.current) {
        cardsHeaderRef.current.style.opacity = '1';
        cardsHeaderRef.current.style.transform = 'translate3d(0, 0, 0)';
      }
      if (cardsContainerRef.current) {
        Array.from(cardsContainerRef.current.children).forEach((child) => {
          (child as HTMLElement).style.opacity = '1';
          (child as HTMLElement).style.transform = 'translate3d(0, 0, 0) scale(1)';
        });
      }
      return;
    }

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    // STAGE 0: Chapter Header & Badge (0.00 -> 0.14)
    if (headerRef.current) {
      const tHeader = Math.min(1, Math.max(0, p / 0.14));
      const eHeader = easeOutCubic(tHeader);
      headerRef.current.style.opacity = String(0.4 + eHeader * 0.6);
      headerRef.current.style.transform = `translate3d(0, ${(1 - eHeader) * -15}px, 0)`;
    }

    // STAGE 1: Left Measurement Studio Panel (0.04 -> 0.34)
    if (panelRef.current) {
      if (p < 0.04) {
        panelRef.current.style.opacity = '0.2';
        panelRef.current.style.transform = 'translate3d(0, 35px, 0) scale(0.95)';
      } else if (p < 0.34) {
        const t = easeOutCubic((p - 0.04) / 0.30);
        panelRef.current.style.opacity = String(0.2 + t * 0.8);
        panelRef.current.style.transform = `translate3d(0, ${(1 - t) * 35}px, 0) scale(${0.95 + t * 0.05})`;
      } else {
        panelRef.current.style.opacity = '1';
        panelRef.current.style.transform = 'translate3d(0, 0, 0) scale(1)';
      }
    }

    // STAGE 2: Right Matched Timepieces Header (0.20 -> 0.42)
    if (cardsHeaderRef.current) {
      if (p < 0.20) {
        cardsHeaderRef.current.style.opacity = '0';
        cardsHeaderRef.current.style.transform = 'translate3d(0, -10px, 0)';
      } else if (p < 0.42) {
        const t = easeOutCubic((p - 0.20) / 0.22);
        cardsHeaderRef.current.style.opacity = String(t);
        cardsHeaderRef.current.style.transform = `translate3d(0, ${(1 - t) * -10}px, 0)`;
      } else {
        cardsHeaderRef.current.style.opacity = '1';
        cardsHeaderRef.current.style.transform = 'translate3d(0, 0, 0)';
      }
    }

    // STAGE 3: 4 Curated Watch Cards Staggered Reveal (0.28 -> 0.76)
    if (cardsContainerRef.current) {
      const cardNodes = Array.from(cardsContainerRef.current.children) as HTMLElement[];
      const cardDelays = [0.28, 0.36, 0.44, 0.52];
      const duration = 0.24;

      cardNodes.forEach((card, idx) => {
        const start = cardDelays[idx] || 0.28;
        if (p < start) {
          card.style.opacity = '0';
          card.style.transform = 'translate3d(0, 28px, 0) scale(0.93)';
        } else if (p < start + duration) {
          const t = easeOutCubic((p - start) / duration);
          card.style.opacity = String(t);
          card.style.transform = `translate3d(0, ${(1 - t) * 28}px, 0) scale(${0.93 + t * 0.07})`;
        } else {
          card.style.opacity = '1';
          card.style.transform = 'translate3d(0, 0, 0) scale(1)';
        }
      });
    }
  }, []);

  // Sync animation whenever recommended watches change
  useEffect(() => {
    handleProgress(currentProgressRef.current);
  }, [wristCircumferenceCM, handleProgress]);

  // Dual Driver 1: RAF Native Wheel/Scroll for immediate, stutter-free frame lock
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

  const handleCardClick = (e: React.MouseEvent, watchId: string) => {
    e.preventDefault();
    navigateToSection('collection', { watchId });
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-[300vh] bg-[#070706] text-white border-t border-b border-white/10"
      aria-label="Chapter IX: Wrist Proportion Guide"
    >
      {/* Sticky Fullscreen Viewport — Locked in place across scrub progression */}
      <div className="viewport-pinned-stage px-4 sm:px-6 md:px-8 bg-[#070706] flex items-center">
        {/* Radiant Background Aura */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_40%,rgba(200,180,138,0.04)_0%,transparent_65%)]" />

        <div className="viewport-usable-shell max-w-5xl mx-auto flex flex-col justify-between py-1 sm:py-2.5 w-full my-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 sm:gap-4 lg:gap-6 items-center w-full">
            
            {/* Left Column: Interactive Tailoring Controls */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <div
                ref={headerRef}
                className="will-change-[transform,opacity]"
              >
                {/* Chapter Badge */}
                <div className="inline-flex items-center space-x-1.5 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full mb-1 w-fit">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] animate-pulse" />
                  <span className="font-metadata text-[0.44rem] sm:text-[0.5rem] tracking-[0.2em] text-[var(--color-accent)] font-medium uppercase">
                    CHAPTER IX • WRIST PROPORTION
                  </span>
                </div>

                <h2 className="text-gold-gradient font-cinzel text-base sm:text-xl md:text-2xl font-normal leading-tight text-shadow-cinematic mb-0.5 sm:mb-1 tracking-[0.08em] uppercase">
                  Find Your Ideal Match
                </h2>
                
                <p className="font-sans text-[0.52rem] sm:text-[0.6rem] text-white/60 font-light leading-snug mb-1.5 sm:mb-2.5 max-w-sm">
                  Calibrate your wrist measurement to preview recommended dial sizes and matched timepieces in real time.
                </p>
              </div>

              {/* Studio Measurement Panel */}
              <div
                ref={panelRef}
                className="bg-[#0B0B0A]/95 border border-white/10 rounded-xl p-2 sm:p-2.5 md:p-3 shadow-xl backdrop-blur-md"
              >
                {/* Metric & Classification Row */}
                <div className="flex justify-between items-center mb-1.5 sm:mb-2">
                  <div>
                    <span className="font-metadata text-[0.42rem] sm:text-[0.5rem] text-white/45 block tracking-wider mb-0.5 uppercase">
                      WRIST MEASUREMENT
                    </span>
                    <div className="flex items-baseline space-x-1.5">
                      <span className="font-mono-num text-lg sm:text-2xl text-white font-bold tracking-tight">
                        {wristCircumferenceCM} cm
                      </span>
                      <span className="font-body text-[0.6rem] sm:text-xs text-white/50">
                        / {wristInches}"
                      </span>
                    </div>
                  </div>

                  <div className="text-right bg-white/[0.04] border border-white/10 px-2 py-0.5 rounded-md">
                    <span className="font-metadata text-[0.4rem] sm:text-[0.45rem] text-white/40 block tracking-wider uppercase">FIT PROFILE</span>
                    <span className="font-cinzel text-[0.58rem] sm:text-[0.68rem] text-gold-bright font-medium">
                      {currentFit.label}
                    </span>
                  </div>
                </div>

                {/* Slider Input */}
                <div className="space-y-0.5 mb-1.5 sm:mb-2">
                  <input
                    type="range"
                    min="14"
                    max="21"
                    step="0.5"
                    value={wristCircumferenceCM}
                    onChange={(e) => setWristCircumferenceCM(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[var(--color-accent)]"
                    aria-label="Calibrate wrist circumference in centimeters"
                  />
                  <div className="flex justify-between font-mono text-[0.4rem] sm:text-[0.46rem] text-white/30">
                    <span>14 cm (5.5")</span>
                    <span>17.5 cm</span>
                    <span>21 cm (8.3")</span>
                  </div>
                </div>

                {/* Recommendations Callout */}
                <div className="bg-white/[0.03] border border-white/10 rounded-lg p-1.5 sm:p-2">
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="font-metadata text-[0.42rem] sm:text-[0.48rem] text-[var(--color-accent)] font-semibold tracking-wider uppercase">
                      RECOMMENDED CASE
                    </span>
                    <span className="font-mono-num text-[0.52rem] sm:text-[0.62rem] text-white font-semibold">
                      {currentFit.caseSizes}
                    </span>
                  </div>
                  <p className="text-[0.48rem] sm:text-[0.55rem] text-white/60 font-light leading-snug">
                    {currentFit.tips}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Curated Matched Timepieces (Compact 2x2 Grid) */}
            <div className="lg:col-span-7">
              <div
                ref={cardsHeaderRef}
                className="flex justify-between items-center mb-1 sm:mb-1.5 px-0.5"
              >
                <span className="font-metadata text-[0.44rem] sm:text-[0.52rem] text-white/50 tracking-widest uppercase">
                  MATCHED TIMEPIECES ({recommendedWatches.length} CURATIONS)
                </span>
                <a
                  href="#collection"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateToSection('collection');
                  }}
                  className="font-metadata text-[0.46rem] sm:text-[0.54rem] text-[var(--color-accent)] hover:underline tracking-wider uppercase cursor-pointer"
                >
                  VIEW COLLECTION →
                </a>
              </div>

              <div ref={cardsContainerRef} className="grid grid-cols-2 gap-1.5 sm:gap-2.5">
                {recommendedWatches.map((watch) => {
                  return (
                    <a
                      key={watch.id}
                      href="#collection"
                      onClick={(e) => handleCardClick(e, watch.id)}
                      className="group bg-[#0A0A09]/95 border border-white/10 hover:border-[var(--color-accent)]/45 rounded-xl p-1.5 sm:p-2.5 transition-all duration-300 flex flex-col justify-between shadow-lg cursor-pointer"
                    >
                      <div className="aspect-[16/10] w-full max-h-[70px] xs:max-h-[85px] sm:max-h-[100px] md:max-h-[115px] rounded-lg overflow-hidden bg-[#141413] border border-white/10 relative mb-1 sm:mb-1.5">
                        <div className="absolute inset-0 image-loading-placeholder pointer-events-none z-0" />
                        <img
                          src={watch.image}
                          alt={watch.name}
                          loading="lazy"
                          decoding="async"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = '/images/watch1.jpg';
                          }}
                          className="w-full h-full object-cover filter contrast-[1.05] group-hover:scale-105 transition-transform duration-500 relative z-[1]"
                        />
                        <span className="absolute top-1 left-1 font-metadata text-[0.4rem] sm:text-[0.46rem] bg-black/80 px-1.5 py-0.5 rounded text-white/70 border border-white/10 z-[2]">
                          {watch.number}
                        </span>
                        <span className="absolute bottom-1 right-1 font-mono-num text-[0.4rem] sm:text-[0.48rem] bg-black/80 px-1.5 py-0.5 rounded text-[var(--color-accent)] border border-[var(--color-accent)]/30 font-semibold z-[2]">
                          {watch.caseDiameter}
                        </span>
                      </div>

                      <div className="flex justify-between items-center px-0.5">
                        <div className="min-w-0 flex-1">
                          <h4 className="font-cinzel text-[0.6rem] xs:text-[0.65rem] sm:text-[0.72rem] text-white group-hover:text-gold-bright transition-colors font-medium leading-tight truncate">
                            {watch.name}
                          </h4>
                          <span className="font-sans text-[0.42rem] sm:text-[0.5rem] text-white/45 block leading-tight truncate mt-0.5">
                            {watch.movementType}
                          </span>
                        </div>
                        <span className="font-metadata text-[0.48rem] sm:text-[0.58rem] text-[var(--color-accent)] group-hover:translate-x-0.5 transition-transform font-bold ml-1 flex-shrink-0">
                          →
                        </span>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default WristSizeGuide;
