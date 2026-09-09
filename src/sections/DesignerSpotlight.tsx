import React, { useRef, useState, useCallback, useEffect } from 'react';
import { ScrollTrigger, useGSAP } from '@/animations/gsap';
import { isReducedMotionPreferred } from '@/animations/presets';
import gsap from 'gsap';

interface AtelierDimension {
  id: string;
  tabLabel: string;
  stepNum: string;
  badge: string;
  heroStat: string;
  statLabel: string;
  title: string;
  description: string;
  quote: string;
  highlights: string[];
}

const DIMENSIONS: AtelierDimension[] = [
  {
    id: 'dim-craft',
    tabLabel: '01 • ARTISAN CRAFT',
    stepNum: '01',
    badge: 'GENEVA HERITAGE',
    heroStat: '40+ Hrs',
    statLabel: 'HAND BEVELING PER MOVEMENT',
    title: 'Hand-Finished Anglage & Black Polish',
    description:
      'Every bridge and interior angle is sculpted, chamfered, and mirror-polished by hand using traditional gentian wood pegs to achieve light reflection impossible to produce by machine.',
    quote: 'True luxury is the invisible touch of the human hand in every bevel.',
    highlights: [
      '100% Hand-polished in Geneva',
      'Solid 18K Gold openwork bridges',
      'Mirror-finished screw heads and jewel sinks',
    ],
  },
  {
    id: 'dim-precision',
    tabLabel: '02 • CHRONOMETRY',
    stepNum: '02',
    badge: 'ATOMIC PRECISION',
    heroStat: '-2 / +2s',
    statLabel: 'CERTIFIED DAILY ACCURACY',
    title: 'High-Beat Chronometric Regulation',
    description:
      'Tested across 6 wrist orientations and dynamic temperature cycles over 15 consecutive days, delivering continuous sweeping second-hand chronometry for a lifetime of dependable performance.',
    quote: 'Time measured with unwavering stability, beat after mechanical beat.',
    highlights: [
      '28,800 VPH (4.0 Hz) smooth sweep',
      'COSC & Geneva Seal grade tolerances',
      '33 frictionless synthetic ruby bearings',
    ],
  },
  {
    id: 'dim-service',
    tabLabel: '03 • CONCIERGE',
    stepNum: '03',
    badge: 'LIFETIME PATRONAGE',
    heroStat: 'Lifetime',
    statLabel: 'GLOBAL ATELIER SERVICE',
    title: 'Private Collector Concierge & Vault',
    description:
      'Every ÉLVARA patron receives direct one-on-one access to master watchmakers, complimentary worldwide maintenance, and bespoke custom strap tailoring tailored specifically to your wrist.',
    quote: 'An enduring relationship between the watchmaker and the collector.',
    highlights: [
      'Complimentary international maintenance',
      'Custom bespoke strap atelier fitting',
      'Direct contact with master horologists',
    ],
  },
];

/**
 * Animated word-by-word text reveal component
 */
const TextReveal: React.FC<{
  text: string;
  className?: string;
  isTitle?: boolean;
  delay?: number;
}> = ({ text, className = '', isTitle = false, delay = 0 }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isReducedMotionPreferred() || !containerRef.current) return;

    const words = containerRef.current.querySelectorAll('.reveal-word-item');
    gsap.killTweensOf(words);
    gsap.fromTo(
      words,
      {
        opacity: 0,
        y: isTitle ? 12 : 8,
        filter: 'blur(3px)',
      },
      {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: isTitle ? 0.5 : 0.38,
        stagger: isTitle ? 0.035 : 0.014,
        delay,
        ease: 'power3.out',
      }
    );
  }, [text, delay, isTitle]);

  const words = text.split(' ');

  return (
    <div ref={containerRef} className={`inline-block ${className}`}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="reveal-word-item inline-block mr-[0.24em] will-change-[transform,opacity,filter]"
          style={{ opacity: isReducedMotionPreferred() ? 1 : 0 }}
        >
          {word}
        </span>
      ))}
    </div>
  );
};

export const DesignerSpotlight: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const titleWordsRef = useRef<HTMLHeadingElement>(null);
  const descWordsRef = useRef<HTMLParagraphElement>(null);
  const consoleRef = useRef<HTMLDivElement>(null);
  const leftStatRef = useRef<HTMLDivElement>(null);
  const highlightsRef = useRef<HTMLDivElement>(null);
  const currentProgressRef = useRef<number>(0);
  const [activeTab, setActiveTab] = useState<number>(0);

  // Animate card details whenever activeTab changes
  useEffect(() => {
    if (isReducedMotionPreferred()) return;

    if (leftStatRef.current) {
      gsap.fromTo(
        leftStatRef.current,
        { opacity: 0, x: -10 },
        { opacity: 1, x: 0, duration: 0.45, ease: 'power3.out' }
      );
    }

    if (highlightsRef.current) {
      const items = highlightsRef.current.querySelectorAll('.highlight-item');
      gsap.fromTo(
        items,
        { opacity: 0, x: -12 },
        { opacity: 1, x: 0, duration: 0.4, stagger: 0.06, delay: 0.12, ease: 'power3.out' }
      );
    }
  }, [activeTab]);

  // Sync active dimension with scroll progress
  const handleProgress = useCallback((p: number) => {
    // Dimension switcher based on scroll scrub
    if (p < 0.38) {
      setActiveTab(0);
    } else if (p < 0.68) {
      setActiveTab(1);
    } else {
      setActiveTab(2);
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

  // Dual Driver 2: GSAP ScrollTrigger Integration for Fluid Scrubbing & Text Entrance Reveal
  useGSAP(
    () => {
      const trigger = sectionRef.current;
      if (!trigger) return;

      if (isReducedMotionPreferred()) {
        if (headerRef.current) headerRef.current.style.opacity = '1';
        if (consoleRef.current) consoleRef.current.style.opacity = '1';
        return;
      }

      // 1. Text & Console Entrance Reveal Timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: trigger,
          start: 'top 75%',
          toggleActions: 'play none none none',
          once: true,
        },
      });

      if (eyebrowRef.current) {
        tl.fromTo(
          eyebrowRef.current,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
          0
        );
      }

      if (titleWordsRef.current) {
        tl.fromTo(
          titleWordsRef.current.children,
          { opacity: 0, y: 22, filter: 'blur(4px)' },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.7,
            stagger: 0.08,
            ease: 'power3.out',
          },
          0.15
        );
      }

      if (descWordsRef.current) {
        tl.fromTo(
          descWordsRef.current.children,
          { opacity: 0, y: 12, filter: 'blur(2px)' },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.6,
            stagger: 0.02,
            ease: 'power3.out',
          },
          0.45
        );
      }

      if (consoleRef.current) {
        tl.fromTo(
          consoleRef.current,
          { opacity: 0, y: 26, scale: 0.98 },
          { opacity: 1, y: 0, scale: 1, duration: 0.85, ease: 'power3.out' },
          0.65
        );
      }

      // 2. Scrub Controller
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
        tl.kill();
        st.kill();
      };
    },
    { scope: sectionRef }
  );

  const currentDimension = DIMENSIONS[activeTab];

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-[280vh] bg-[#070706] text-white border-t border-b border-white/10"
      aria-label="Chapter X: The Geneva Atelier Console"
    >
      {/* Sticky Fullscreen Viewport — Locked and completely safe from header overlap */}
      <div className="viewport-pinned-stage px-4 sm:px-6 md:px-8 bg-[#070706]">
        {/* Ambient Warm Golden Aura */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,rgba(229,195,120,0.06),transparent_65%)] pointer-events-none" />

        <div className="viewport-usable-shell max-w-4xl mx-auto flex flex-col justify-between py-1 sm:py-2">
          
          {/* =========================================================
              1. USER-FRIENDLY HEADER with Cinematic Text Reveal
             ========================================================= */}
          <div
            ref={headerRef}
            className="max-w-xl mx-auto text-center shrink-0"
          >
            {/* Chapter Pill */}
            <div
              ref={eyebrowRef}
              className="inline-flex items-center space-x-1.5 bg-white/[0.04] border border-white/10 px-2.5 py-0.5 rounded-full mb-1 shadow-sm"
              style={{ opacity: isReducedMotionPreferred() ? 1 : 0 }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] animate-pulse" />
              <span className="font-metadata text-[0.46rem] sm:text-[0.5rem] tracking-[0.2em] text-[var(--color-accent)] font-medium uppercase">
                CHAPTER X • THE GENEVA ATELIER
              </span>
            </div>

            {/* Main Title with word-by-word reveal */}
            <h2
              ref={titleWordsRef}
              className="font-cinzel text-base sm:text-lg md:text-xl font-normal text-white tracking-[0.14em] leading-tight text-shadow-cinematic mb-0.5 flex flex-wrap justify-center gap-x-2"
            >
              {'WHERE TIME BECOMES ART'.split(' ').map((word, i) => (
                <span
                  key={i}
                  className="inline-block will-change-[transform,opacity,filter]"
                  style={{ opacity: isReducedMotionPreferred() ? 1 : 0 }}
                >
                  {word}
                </span>
              ))}
            </h2>

            {/* Subtitle with word-by-word reveal */}
            <p
              ref={descWordsRef}
              className="font-sans text-[0.52rem] sm:text-[0.58rem] text-white/60 font-light tracking-wide max-w-md mx-auto leading-snug flex flex-wrap justify-center gap-x-1"
            >
              {'Three foundational standards built into every timepiece to guarantee beauty, precision, and longevity.'
                .split(' ')
                .map((word, i) => (
                  <span
                    key={i}
                    className="inline-block will-change-[transform,opacity,filter]"
                    style={{ opacity: isReducedMotionPreferred() ? 1 : 0 }}
                  >
                    {word}
                  </span>
                ))}
            </p>
          </div>

          {/* =========================================================
              2. UNIFIED ATELIER MASTER CONSOLE (Single Cohesive Glass Panel)
             ========================================================= */}
          <div
            ref={consoleRef}
            className="w-full bg-[#0B0B0A]/95 border border-[var(--color-accent)]/30 rounded-xl p-2.5 sm:p-3.5 md:p-4 shadow-2xl backdrop-blur-xl relative my-auto"
          >
            {/* Subtle Gold Ambient Radial Glow */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-[var(--color-accent)]/8 rounded-full blur-3xl pointer-events-none" />

            {/* Console Navigation Bar: Interactive Dimension Tabs */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-1.5 pb-2 border-b border-white/[0.08] mb-2 sm:mb-2.5">
              <div className="flex items-center space-x-1 bg-black/40 border border-white/10 p-0.5 rounded-lg">
                {DIMENSIONS.map((dim, idx) => {
                  const isActive = activeTab === idx;
                  return (
                    <button
                      key={dim.id}
                      onClick={() => setActiveTab(idx)}
                      className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md text-[0.46rem] sm:text-[0.5rem] font-metadata tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                        isActive
                          ? 'bg-[var(--color-accent)] text-[#070706] font-semibold shadow-md'
                          : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
                      }`}
                    >
                      {dim.tabLabel}
                    </button>
                  );
                })}
              </div>

              {/* Status Badge */}
              <div className="flex items-center space-x-1.5 bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 rounded">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-metadata text-[0.42rem] sm:text-[0.46rem] text-emerald-300 tracking-wider font-medium uppercase">
                  ATELIER VERIFIED • {currentDimension.badge}
                </span>
              </div>
            </div>

            {/* Console Body: 2-Column Split inside Single Luxury Plaque */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 sm:gap-3.5 items-stretch">
              
              {/* Left Column: Focal Stat & Quote (5 Cols) */}
              <div
                ref={leftStatRef}
                className="md:col-span-5 bg-black/40 border border-white/[0.06] rounded-lg p-2.5 sm:p-3 flex flex-col justify-between"
              >
                <div>
                  <span className="font-metadata text-[0.42rem] sm:text-[0.46rem] text-[var(--color-accent)] tracking-widest uppercase block mb-0.5">
                    {currentDimension.statLabel}
                  </span>
                  <div className="font-cinzel text-xl sm:text-2xl font-medium text-white tracking-tight mb-1 text-shadow-cinematic">
                    {currentDimension.heroStat}
                  </div>
                </div>

                <blockquote className="border-l-2 border-[var(--color-accent)]/40 pl-2 my-1">
                  <p className="font-serif italic text-[0.56rem] sm:text-[0.62rem] text-white/80 font-light leading-snug">
                    "{currentDimension.quote}"
                  </p>
                </blockquote>

                <div className="mt-1.5 pt-1.5 border-t border-white/[0.06] flex items-center justify-between text-[0.42rem] text-white/40 font-metadata">
                  <span>SWISS ATELIER STANDARD</span>
                  <span className="text-[var(--color-accent)]">STEP {currentDimension.stepNum} / 03</span>
                </div>
              </div>

              {/* Right Column: Title, Narrative & Verified Highlights (7 Cols) */}
              <div className="md:col-span-7 flex flex-col justify-between space-y-1.5">
                <div>
                  <h3 className="font-cinzel text-xs sm:text-sm md:text-base text-white font-medium mb-0.5 tracking-wide text-shadow-cinematic">
                    <TextReveal
                      text={currentDimension.title}
                      isTitle={true}
                      delay={0}
                    />
                  </h3>
                  <div className="font-sans text-[0.54rem] sm:text-[0.58rem] text-white/65 font-light leading-relaxed mb-1.5">
                    <TextReveal
                      text={currentDimension.description}
                      isTitle={false}
                      delay={0.06}
                    />
                  </div>
                </div>

                {/* 3 Inline Bullet Highlights */}
                <div
                  ref={highlightsRef}
                  className="space-y-0.5 bg-white/[0.02] border border-white/[0.05] p-1.5 sm:p-2 rounded-md"
                >
                  {currentDimension.highlights.map((item, i) => (
                    <div key={i} className="highlight-item flex items-center space-x-1.5 py-0.5">
                      <span className="text-[var(--color-accent)] text-[0.48rem] flex-shrink-0">✦</span>
                      <span className="font-sans text-[0.52rem] sm:text-[0.56rem] text-white/80 font-light leading-tight">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

          {/* =========================================================
              3. REFINED BOTTOM STEP PROGRESS INDICATOR
             ========================================================= */}
          <div className="flex items-center justify-center space-x-3 pt-1 shrink-0">
            {DIMENSIONS.map((dim, index) => {
              const isActive = activeTab === index;

              return (
                <button
                  key={dim.id}
                  onClick={() => setActiveTab(index)}
                  className="flex items-center space-x-1.5 group cursor-pointer focus:outline-none"
                >
                  <div className="w-8 sm:w-10 h-[1.5px] bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        isActive ? 'w-full bg-[var(--color-accent)]' : 'w-0 bg-transparent'
                      }`}
                    />
                  </div>
                  <span
                    className={`font-metadata text-[0.42rem] sm:text-[0.46rem] tracking-wider transition-colors duration-200 ${
                      isActive ? 'text-[var(--color-accent)] font-medium' : 'text-white/30 group-hover:text-white/60'
                    }`}
                  >
                    0{index + 1}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DesignerSpotlight;
