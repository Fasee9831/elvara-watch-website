import React, { useRef, useState, useCallback, useEffect } from 'react';
import { ScrollTrigger, useGSAP } from '@/animations/gsap';
import { isReducedMotionPreferred } from '@/animations/presets';

interface CharToken {
  id: number;
  char: string;
}

interface WordToken {
  chars: CharToken[];
  isHighlight?: boolean;
}

const buildStructuredLines = () => {
  let globalCharIndex = 0;

  const createWords = (text: string, isHighlight = false): WordToken[] => {
    return text.split(' ').filter(Boolean).map((word) => ({
      isHighlight,
      chars: Array.from(word).map((char) => ({
        id: globalCharIndex++,
        char,
      })),
    }));
  };

  const line1: WordToken[] = [
    ...createWords("Every ÉLVARA timepiece takes over", false),
    ...createWords("450 hours of pure hand craftsmanship.", true),
  ];

  const line2: WordToken[] = createWords(
    "We build watches without compromise — blending the human touch with pure mechanical art",
    false
  );

  const line3: WordToken[] = createWords(
    "so every tick feels personal and meaningful on your wrist.",
    false
  );

  return [line1, line2, line3];
};

const STRUCTURED_LINES = buildStructuredLines();

/**
 * BrandStatement — Chapter II: The Philosophy & Atelier Ethos.
 * Follows Chapter 1's exact pinned scroll-storytelling, content-tracking,
 * and synchronized release lifecycle across scroll progress 0.0 -> 1.0.
 */
export const BrandStatement: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const watermarkRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const title1Ref = useRef<HTMLHeadingElement>(null);
  const title2Ref = useRef<HTMLHeadingElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const highlightGlowRef = useRef<HTMLSpanElement>(null);
  const badgesRef = useRef<HTMLDivElement>(null);
  const inscriptionRef = useRef<HTMLDivElement>(null);
  const currentProgressRef = useRef<number>(0);

  const [, setScrollProgress] = useState(0);

  // Synchronized storytelling progression across scroll progress (0.0 -> 1.0)
  const handleProgress = useCallback((progress: number) => {
    setScrollProgress(progress);

    if (isReducedMotionPreferred()) return;

    // 1. Watermark Upward Parallax Scroll
    if (watermarkRef.current) {
      const yShift = -progress * 80; // scrolls upward smoothly across the chapter scroll
      watermarkRef.current.style.transform = `translate3d(0, ${yShift}px, 0)`;
      watermarkRef.current.style.opacity = String(0.035 + Math.sin(progress * Math.PI) * 0.025);
    }

    // 2. Ambient Studio Glow (0.0 -> 1.0)
    if (glowRef.current) {
      if (progress < 0.2) {
        const rise = progress / 0.2;
        glowRef.current.style.opacity = String(0.2 + rise * 0.4);
      } else if (progress < 0.85) {
        glowRef.current.style.opacity = '0.6';
      } else {
        const fade = 1 - (progress - 0.85) / 0.15;
        glowRef.current.style.opacity = String(Math.max(0, 0.6 * fade));
      }
    }

    // 3. Eyebrow Badge (0.0 -> 0.9)
    if (eyebrowRef.current) {
      if (progress < 0.12) {
        const fadeIn = progress / 0.12;
        eyebrowRef.current.style.opacity = String(fadeIn);
        eyebrowRef.current.style.transform = `translate3d(0, ${(1 - fadeIn) * -15}px, 0)`;
      } else if (progress < 0.88) {
        eyebrowRef.current.style.opacity = '1';
        eyebrowRef.current.style.transform = 'translate3d(0, 0, 0)';
      } else {
        const fadeOut = 1 - (progress - 0.88) / 0.12;
        eyebrowRef.current.style.opacity = String(Math.max(0, fadeOut));
        eyebrowRef.current.style.transform = `translate3d(0, ${-(1 - fadeOut) * 20}px, 0)`;
      }
    }

    // 4. Headline 1: "Time is not measured." (0.05 -> 0.90)
    if (title1Ref.current) {
      if (progress < 0.06) {
        title1Ref.current.style.opacity = '0';
        title1Ref.current.style.transform = 'translate3d(0, 30px, 0)';
      } else if (progress < 0.18) {
        const fadeIn = (progress - 0.06) / 0.12;
        title1Ref.current.style.opacity = String(fadeIn);
        title1Ref.current.style.transform = `translate3d(0, ${(1 - fadeIn) * 30}px, 0)`;
      } else if (progress < 0.88) {
        title1Ref.current.style.opacity = '1';
        title1Ref.current.style.transform = 'translate3d(0, 0, 0)';
      } else {
        const fadeOut = 1 - (progress - 0.88) / 0.12;
        title1Ref.current.style.opacity = String(Math.max(0, fadeOut));
        title1Ref.current.style.transform = `translate3d(0, ${-(1 - fadeOut) * 20}px, 0)`;
      }
    }

    // 5. Headline 2: "It is experienced." (0.12 -> 0.90)
    if (title2Ref.current) {
      if (progress < 0.12) {
        title2Ref.current.style.opacity = '0';
        title2Ref.current.style.transform = 'translate3d(0, 30px, 0)';
      } else if (progress < 0.26) {
        const fadeIn = (progress - 0.12) / 0.14;
        title2Ref.current.style.opacity = String(fadeIn);
        title2Ref.current.style.transform = `translate3d(0, ${(1 - fadeIn) * 30}px, 0)`;
      } else if (progress < 0.88) {
        title2Ref.current.style.opacity = '1';
        title2Ref.current.style.transform = 'translate3d(0, 0, 0)';
      } else {
        const fadeOut = 1 - (progress - 0.88) / 0.12;
        title2Ref.current.style.opacity = String(Math.max(0, fadeOut));
        title2Ref.current.style.transform = `translate3d(0, ${-(1 - fadeOut) * 20}px, 0)`;
      }
    }

    // 6. Gold Hairline Divider (0.18 -> 0.90)
    if (lineRef.current) {
      if (progress < 0.18) {
        lineRef.current.style.opacity = '0';
        lineRef.current.style.transform = 'scaleX(0)';
      } else if (progress < 0.32) {
        const expand = (progress - 0.18) / 0.14;
        lineRef.current.style.opacity = String(expand);
        lineRef.current.style.transform = `scaleX(${expand})`;
      } else if (progress < 0.88) {
        lineRef.current.style.opacity = '1';
        lineRef.current.style.transform = 'scaleX(1)';
      } else {
        const fadeOut = 1 - (progress - 0.88) / 0.12;
        lineRef.current.style.opacity = String(Math.max(0, fadeOut));
        lineRef.current.style.transform = `scaleX(${fadeOut})`;
      }
    }

    // 7. Statement Typing Reveal (0.20 -> 0.58)
    if (descRef.current) {
      const chars = descRef.current.querySelectorAll<HTMLElement>('.statement-char');
      const totalCount = chars.length;

      if (progress < 0.20) {
        descRef.current.style.opacity = '0';
        for (let i = 0; i < totalCount; i++) {
          chars[i].style.opacity = '0';
          chars[i].style.transform = 'translate3d(0, 3px, 0)';
        }
        if (cursorRef.current) {
          cursorRef.current.style.opacity = '0';
        }
      } else if (progress <= 0.58) {
        const fadeInWrapper = Math.min(1, (progress - 0.20) / 0.05);
        descRef.current.style.opacity = String(fadeInWrapper);
        descRef.current.style.transform = 'translate3d(0, 0, 0)';

        const t = (progress - 0.20) / 0.38;
        const visibleCount = Math.min(totalCount, Math.floor(t * totalCount));

        for (let i = 0; i < totalCount; i++) {
          if (i < visibleCount) {
            chars[i].style.opacity = '1';
            chars[i].style.transform = 'translate3d(0, 0, 0)';
          } else {
            chars[i].style.opacity = '0';
            chars[i].style.transform = 'translate3d(0, 3px, 0)';
          }
        }

        if (cursorRef.current) {
          cursorRef.current.style.opacity = '1';
          if (visibleCount > 0 && visibleCount <= totalCount) {
            const targetChar = chars[visibleCount - 1];
            if (targetChar && targetChar.parentNode && cursorRef.current.previousSibling !== targetChar) {
              targetChar.after(cursorRef.current);
            }
          } else if (chars[0] && chars[0].parentNode && cursorRef.current.nextSibling !== chars[0]) {
            chars[0].before(cursorRef.current);
          }
        }
      } else if (progress < 0.88) {
        descRef.current.style.opacity = '1';
        descRef.current.style.transform = 'translate3d(0, 0, 0)';
        for (let i = 0; i < totalCount; i++) {
          chars[i].style.opacity = '1';
          chars[i].style.transform = 'translate3d(0, 0, 0)';
        }
        if (cursorRef.current) {
          cursorRef.current.style.opacity = '0.75';
          const lastChar = chars[totalCount - 1];
          if (lastChar && lastChar.parentNode && cursorRef.current.previousSibling !== lastChar) {
            lastChar.after(cursorRef.current);
          }
        }
      } else {
        const fadeOut = 1 - (progress - 0.88) / 0.12;
        descRef.current.style.opacity = String(Math.max(0, fadeOut));
        descRef.current.style.transform = `translate3d(0, ${-(1 - fadeOut) * 20}px, 0)`;
        if (cursorRef.current) {
          cursorRef.current.style.opacity = String(Math.max(0, fadeOut));
        }
      }
    }

    // 8. 450-Hour Craft Highlight Glow Beam (0.35 -> 0.90)
    if (highlightGlowRef.current) {
      if (progress < 0.35) {
        highlightGlowRef.current.style.opacity = '0';
        highlightGlowRef.current.style.transform = 'scaleX(0)';
      } else if (progress < 0.48) {
        const pulse = (progress - 0.35) / 0.13;
        highlightGlowRef.current.style.opacity = String(pulse * 0.85);
        highlightGlowRef.current.style.transform = `scaleX(${pulse})`;
      } else if (progress < 0.88) {
        highlightGlowRef.current.style.opacity = '0.5';
        highlightGlowRef.current.style.transform = 'scaleX(1)';
      } else {
        const fadeOut = 1 - (progress - 0.88) / 0.12;
        highlightGlowRef.current.style.opacity = String(Math.max(0, 0.5 * fadeOut));
      }
    }

    // 9. Micro Credo Badges (Left & Right staggered entrance: 0.52 -> 0.70)
    if (badgesRef.current) {
      const b1 = badgesRef.current.querySelector<HTMLElement>('.credo-badge-left');
      const b2 = badgesRef.current.querySelector<HTMLElement>('.credo-badge-right');
      const b3 = badgesRef.current.querySelector<HTMLElement>('.credo-badge-center');

      const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

      // Badge 1 (Left: "100% HAND ASSEMBLED") -> Reveals from Left (-60px -> 0px)
      if (b1) {
        const start = 0.52;
        const end = 0.64;
        if (progress < start) {
          b1.style.opacity = '0';
          b1.style.transform = 'translate3d(-60px, 0, 0)';
        } else if (progress < end) {
          const t = easeOut((progress - start) / (end - start));
          b1.style.opacity = String(t);
          b1.style.transform = `translate3d(${(1 - t) * -60}px, 0, 0)`;
        } else if (progress < 0.88) {
          b1.style.opacity = '1';
          b1.style.transform = 'translate3d(0, 0, 0)';
        } else {
          const fadeOut = 1 - (progress - 0.88) / 0.12;
          b1.style.opacity = String(Math.max(0, fadeOut));
          b1.style.transform = `translate3d(${-(1 - fadeOut) * 25}px, 0, 0)`;
        }
      }

      // Badge 2 (Right: "LIFETIME ARCHIVE REGISTERED") -> Reveals from Right (60px -> 0px)
      if (b2) {
        const start = 0.55;
        const end = 0.67;
        if (progress < start) {
          b2.style.opacity = '0';
          b2.style.transform = 'translate3d(60px, 0, 0)';
        } else if (progress < end) {
          const t = easeOut((progress - start) / (end - start));
          b2.style.opacity = String(t);
          b2.style.transform = `translate3d(${(1 - t) * 60}px, 0, 0)`;
        } else if (progress < 0.88) {
          b2.style.opacity = '1';
          b2.style.transform = 'translate3d(0, 0, 0)';
        } else {
          const fadeOut = 1 - (progress - 0.88) / 0.12;
          b2.style.opacity = String(Math.max(0, fadeOut));
          b2.style.transform = `translate3d(${(1 - fadeOut) * 25}px, 0, 0)`;
        }
      }

      // Badge 3 (Certified: "GENEVA SEAL CERTIFIED") -> Bottom-Up rise & scale
      if (b3) {
        const start = 0.58;
        const end = 0.70;
        if (progress < start) {
          b3.style.opacity = '0';
          b3.style.transform = 'translate3d(0, 24px, 0) scale(0.92)';
        } else if (progress < end) {
          const t = easeOut((progress - start) / (end - start));
          b3.style.opacity = String(t);
          b3.style.transform = `translate3d(0, ${(1 - t) * 24}px, 0) scale(${0.92 + t * 0.08})`;
        } else if (progress < 0.88) {
          b3.style.opacity = '1';
          b3.style.transform = 'translate3d(0, 0, 0) scale(1)';
        } else {
          const fadeOut = 1 - (progress - 0.88) / 0.12;
          b3.style.opacity = String(Math.max(0, fadeOut));
          b3.style.transform = `translate3d(0, ${-(1 - fadeOut) * 15}px, 0) scale(${1 - (1 - fadeOut) * 0.08})`;
        }
      }
    }

    // 10. Precision Inscription Reveal (CH-1204 GENÈVE • ±0.002 MM • HAUTE HORLOGERIE) (0.68 -> 0.90)
    if (inscriptionRef.current) {
      if (progress < 0.68) {
        inscriptionRef.current.style.opacity = '0';
        inscriptionRef.current.style.transform = 'translate3d(0, 15px, 0)';
      } else if (progress < 0.80) {
        const t = (progress - 0.68) / 0.12;
        inscriptionRef.current.style.opacity = String(t);
        inscriptionRef.current.style.transform = `translate3d(0, ${(1 - t) * 15}px, 0)`;
      } else if (progress < 0.90) {
        inscriptionRef.current.style.opacity = '1';
        inscriptionRef.current.style.transform = 'translate3d(0, 0, 0)';
      } else {
        const fadeOut = 1 - (progress - 0.90) / 0.10;
        inscriptionRef.current.style.opacity = String(Math.max(0, fadeOut));
        inscriptionRef.current.style.transform = `translate3d(0, ${-(1 - fadeOut) * 15}px, 0)`;
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
        const progress = Math.min(1, Math.max(0, scrollDistance / totalScrollable));

        if (Math.abs(progress - currentProgressRef.current) > 0.0005) {
          currentProgressRef.current = progress;
          handleProgress(progress);
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
      className="relative w-full h-[350vh] bg-[#070706] text-[var(--color-text-primary)]"
      aria-label="Chapter II: The Philosophy"
    >
      {/* Sticky Fullscreen Viewport — Stays pinned throughout Chapter 2 */}
      <div className="viewport-pinned-stage bg-[#070706]">
        {/* Editorial Watermark in Background — Perfectly Centered */}
        <div
          ref={watermarkRef}
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden opacity-[0.035] will-change-transform z-0"
        >
          <span className="font-cinzel text-[22vw] leading-none whitespace-nowrap tracking-[0.12em] pl-[0.12em] text-[#F2EEE5] select-none text-center">
            ÉLVARA
          </span>
        </div>

        {/* Ambient Studio Backlight & Radial Glow */}
        <div
          ref={glowRef}
          className="absolute inset-0 studio-glow pointer-events-none transition-opacity duration-300 opacity-20"
        />

        {/* Floating Luxury UI: Unified Single-Scene Centerpiece within Safe Viewport */}
        <div className="viewport-usable-shell max-w-3xl mx-auto px-4 pointer-events-none">
          {/* Unified Content Group: Optically Centered within the Usable Viewport */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center w-full pointer-events-auto">
            
            {/* 1. Chapter Eyebrow & Provenance Marker */}
            <div
              ref={eyebrowRef}
              className="inline-flex items-center space-x-2 bg-black/70 backdrop-blur-2xl px-3 py-0.5 border border-white/10 rounded-full shadow-2xl mb-2 transition-all duration-300"
              style={{ opacity: 0, transform: 'translate3d(0, -15px, 0)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] animate-pulse" />
              <span className="font-metadata text-[0.56rem] sm:text-[0.62rem] tracking-[0.2em] text-[var(--color-text-primary)] font-medium">
                CHAPTER II • THE PHILOSOPHY
              </span>
              <span className="text-white/20">|</span>
              <span className="font-metadata text-[0.56rem] sm:text-[0.62rem] text-[var(--color-accent)] font-medium">
                HAUTE HORLOGERIE ETHOS
              </span>
            </div>

            {/* 2. Masked Headline 1: "Time is not measured." */}
            <div className="overflow-hidden mb-0.5">
              <h2
                ref={title1Ref}
                className="font-serif text-xl sm:text-2xl md:text-3xl lg:text-[2.25rem] text-[var(--color-text-primary)] font-light italic text-shadow-cinematic will-change-transform leading-tight m-0"
                style={{ transform: 'translate3d(0, 30px, 0)', opacity: 0 }}
              >
                Time is not measured.
              </h2>
            </div>

            {/* 3. Masked Headline 2: "It is experienced." */}
            <div className="overflow-hidden mb-2 sm:mb-2.5">
              <h2
                ref={title2Ref}
                className="font-cinzel text-gold-gradient text-lg sm:text-xl md:text-2xl lg:text-[1.85rem] font-normal tracking-[0.08em] text-shadow-cinematic will-change-transform leading-tight m-0"
                style={{ transform: 'translate3d(0, 30px, 0)', opacity: 0 }}
              >
                It is experienced.
              </h2>
            </div>

            {/* 4. Gold Hairline Divider */}
            <div
              ref={lineRef}
              className="w-12 sm:w-16 h-[1px] bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent mx-auto mb-2.5 sm:mb-3 origin-center"
              style={{ transform: 'scaleX(0)', opacity: 0 }}
            />

            {/* 5. Editorial Meditation: 450-Hour Craftsmanship Typing Reveal */}
            <div
              ref={descRef}
              className="max-w-xl sm:max-w-2xl mx-auto text-white/90 font-light leading-relaxed text-xs sm:text-[0.82rem] md:text-[0.88rem] tracking-wide mb-3 text-center font-sans select-none"
            >
              {STRUCTURED_LINES.map((lineWords, lineIdx) => (
                <span key={lineIdx} className="statement-line-wrap block overflow-visible my-0.5 leading-relaxed">
                  {lineWords.map((w, wIdx) => (
                    <span
                      key={wIdx}
                      className={`inline-block whitespace-nowrap mr-[0.28em] ${
                        w.isHighlight ? 'craft-highlight text-[var(--color-accent)] font-medium relative' : ''
                      }`}
                    >
                      {w.chars.map((c) => (
                        <span
                          key={c.id}
                          data-char-idx={c.id}
                          className="statement-char inline-block will-change-[opacity,transform] transition-[opacity,transform] duration-75"
                          style={{ opacity: 0, transform: 'translate3d(0, 3px, 0)' }}
                        >
                          {c.char}
                        </span>
                      ))}
                      {w.isHighlight && (
                        <span ref={highlightGlowRef} className="craft-highlight-glow" aria-hidden="true" style={{ opacity: 0, transform: 'scaleX(0)' }} />
                      )}
                    </span>
                  ))}
                </span>
              ))}
              <span
                ref={cursorRef}
                className="typewriter-cursor inline-block w-[2px] h-[1.15em] bg-[var(--color-accent)] ml-[2px] align-middle shadow-[0_0_8px_rgba(229,195,120,0.9)] animate-pulse pointer-events-none"
                style={{ opacity: 0 }}
                aria-hidden="true"
              />
            </div>

            {/* 6. Micro Credo Pillars: Single-Row Architectural Glass Badges with Left/Right Reveals */}
            <div
              ref={badgesRef}
              className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2.5 max-w-2xl mx-auto mb-2 overflow-hidden px-3 py-1"
            >
              <div
                className="credo-badge credo-badge-left bg-black/70 backdrop-blur-2xl px-2.5 sm:px-3 py-0.5 border border-[var(--color-accent)]/40 rounded-full shadow-xl will-change-[transform,opacity] transition-all duration-300"
                style={{ opacity: 0, transform: 'translate3d(-60px, 0, 0)' }}
              >
                <span className="font-metadata text-[0.56rem] sm:text-[0.62rem] text-[var(--color-accent)] tracking-wider font-semibold whitespace-nowrap">
                  100% HAND ASSEMBLED
                </span>
              </div>
              <div
                className="credo-badge credo-badge-right bg-black/70 backdrop-blur-2xl px-2.5 sm:px-3 py-0.5 border border-white/20 rounded-full shadow-xl will-change-[transform,opacity] transition-all duration-300"
                style={{ opacity: 0, transform: 'translate3d(60px, 0, 0)' }}
              >
                <span className="font-metadata text-[0.56rem] sm:text-[0.62rem] text-white tracking-wider font-medium whitespace-nowrap">
                  LIFETIME ARCHIVE REGISTERED
                </span>
              </div>
              <div
                className="credo-badge credo-badge-center bg-black/70 backdrop-blur-2xl px-2.5 sm:px-3 py-0.5 border border-emerald-500/40 rounded-full shadow-xl will-change-[transform,opacity] transition-all duration-300"
                style={{ opacity: 0, transform: 'translate3d(0, 24px, 0) scale(0.92)' }}
              >
                <span className="font-metadata text-[0.56rem] sm:text-[0.62rem] text-emerald-400 tracking-wider font-medium whitespace-nowrap">
                  GENEVA SEAL CERTIFIED
                </span>
              </div>
            </div>

            {/* 7. Subtle Atelier Precision Metric Inscription (Scroll-Choreographed) */}
            <div
              ref={inscriptionRef}
              className="hidden xs:flex items-center space-x-2 text-white/40 font-metadata text-[0.52rem] sm:text-[0.56rem] tracking-widest transition-transform duration-100 will-change-transform"
              style={{ opacity: 0, transform: 'translate3d(0, 15px, 0)' }}
            >
              <span>CH-1204 GENÈVE</span>
              <span>•</span>
              <span>CRAFT TOLERANCE ± 0.002 MM</span>
              <span>•</span>
              <span className="text-[var(--color-accent)] font-medium">HAUTE HORLOGERIE</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandStatement;
