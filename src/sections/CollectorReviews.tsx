import React, { useRef, useCallback, useEffect } from 'react';
import { ScrollTrigger, useGSAP } from '@/animations/gsap';
import { isReducedMotionPreferred } from '@/animations/presets';

interface Review {
  id: string;
  author: string;
  location: string;
  model: string;
  stars: number;
  quote: string;
  highlight: string;
  tag: string;
  initials: string;
}

const REVIEWS: Review[] = [
  {
    id: 'rev-1',
    author: 'Henrietta Vance',
    location: 'Zurich, Switzerland',
    model: 'Aurelia 18K Solid Gold',
    stars: 5,
    quote: 'The skeleton dial is hypnotic. You truly feel the soul of mechanical art.',
    highlight: 'Hand-beveled 18K solid gold bridges catching afternoon sunlight in Geneva.',
    tag: 'VERIFIED COLLECTOR',
    initials: 'HV',
  },
  {
    id: 'rev-2',
    author: 'Marcus Sterling',
    location: 'London, Mayfair',
    model: 'Nocturne Obsidian Chrono',
    stars: 5,
    quote: 'Featherlight on the wrist, yet completely scratch-proof after months of wear.',
    highlight: 'Tactile column-wheel pushers and an immaculate ergonomic wrist fit.',
    tag: 'LIMITED EDITION OWNER',
    initials: 'MS',
  },
  {
    id: 'rev-3',
    author: 'Camille Dubois',
    location: 'Paris, France',
    model: 'Méridien Diamond Dial',
    stars: 5,
    quote: 'The diamond markers against obsidian glass glow with pure refined elegance.',
    highlight: 'Understated, modern, and exceptionally comfortable on the wrist.',
    tag: 'VERIFIED OWNER',
    initials: 'CD',
  },
];

export const CollectorReviews: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const stampRef = useRef<HTMLDivElement>(null);
  const currentProgressRef = useRef<number>(0);
  const [progress, setProgress] = React.useState(0);

  // Progressive scroll-driven reveal (Multi-stage Chapter XI choreography)
  const handleProgress = useCallback((p: number) => {
    setProgress(p);
    if (isReducedMotionPreferred()) {
      if (headerRef.current) {
        headerRef.current.style.opacity = '1';
        headerRef.current.style.transform = 'translate3d(0, 0, 0)';
      }
      if (cardsContainerRef.current) {
        Array.from(cardsContainerRef.current.children).forEach((child) => {
          (child as HTMLElement).style.opacity = '1';
          (child as HTMLElement).style.transform = 'translate3d(0, 0, 0) scale(1)';
        });
      }
      if (stampRef.current) {
        stampRef.current.style.opacity = '1';
      }
      return;
    }

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    // STAGE 0: Header & Badge Reveal (0.00 -> 0.14)
    if (headerRef.current) {
      const tHeader = Math.min(1, Math.max(0, p / 0.14));
      const eHeader = easeOutCubic(tHeader);
      headerRef.current.style.opacity = String(0.4 + eHeader * 0.6);
      headerRef.current.style.transform = `translate3d(0, ${(1 - eHeader) * -15}px, 0)`;
    }

    // STAGE 1, 2, 3: Review Cards (0.08 -> 0.72)
    if (cardsContainerRef.current) {
      const cardNodes = Array.from(cardsContainerRef.current.children) as HTMLElement[];
      const cardDelays = [0.08, 0.28, 0.48];
      const duration = 0.24;

      cardNodes.forEach((card, idx) => {
        const start = cardDelays[idx] || 0.08;
        if (p < start) {
          card.style.opacity = '0';
          card.style.transform = 'translate3d(0, 30px, 0) scale(0.95)';
        } else if (p < start + duration) {
          const t = easeOutCubic((p - start) / duration);
          card.style.opacity = String(t);
          card.style.transform = `translate3d(0, ${(1 - t) * 30}px, 0) scale(${0.95 + t * 0.05})`;
        } else {
          card.style.opacity = '1';
          card.style.transform = 'translate3d(0, 0, 0) scale(1)';
        }
      });
    }

    // STAGE 4: Trust Stamp (0.60 -> 0.80)
    if (stampRef.current) {
      if (p < 0.60) {
        stampRef.current.style.opacity = '0';
      } else if (p < 0.80) {
        const t = (p - 0.60) / 0.20;
        stampRef.current.style.opacity = String(t);
      } else {
        stampRef.current.style.opacity = '1';
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
      aria-label="Chapter XI: Collector Reviews"
    >
      {/* Sticky Fullscreen Viewport */}
      <div className="viewport-pinned-stage px-4 sm:px-6 bg-[#070706] flex items-center justify-center">
        {/* Soft Radial Ambient Studio Backlight */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_40%,rgba(229,195,120,0.04)_0%,transparent_70%)]" />

        <div className="viewport-usable-shell max-w-5xl mx-auto flex flex-col justify-between py-2 sm:py-3 w-full my-auto">
          {/* Chapter Header */}
          <div
            ref={headerRef}
            className="text-center max-w-lg mx-auto mb-2 sm:mb-3 will-change-[transform,opacity]"
          >
            <div className="inline-flex items-center space-x-1.5 bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] animate-pulse" />
              <span className="font-metadata text-[0.48rem] sm:text-[0.52rem] tracking-[0.2em] text-[var(--color-accent)] font-medium uppercase">
                CHAPTER XI • PATRON VOICES
              </span>
            </div>
            <h2 className="text-gold-gradient font-cinzel text-lg sm:text-xl md:text-2xl font-normal leading-tight text-shadow-cinematic mb-0.5">
              Collector Impressions
            </h2>
            <p className="font-sans text-[0.58rem] sm:text-[0.64rem] text-white/60 max-w-md mx-auto font-light leading-snug">
              Verified perspectives from private collectors and horological patrons worldwide.
            </p>
          </div>

          {/* Desktop Review Cards (3-Column Grid) */}
          <div ref={cardsContainerRef} className="hidden md:grid md:grid-cols-3 gap-2.5 sm:gap-3">
            {REVIEWS.map((rev) => (
              <div
                key={rev.id}
                className="bg-[#0B0B0A]/95 border border-white/10 hover:border-[var(--color-accent)]/40 rounded-xl p-3 sm:p-3.5 flex flex-col justify-between shadow-xl backdrop-blur-md transition-all duration-300 group"
              >
                <div>
                  {/* Top Badge & Rating */}
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-metadata text-[0.44rem] sm:text-[0.48rem] text-[var(--color-accent)] bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30 px-2 py-0.5 rounded-full font-semibold">
                      {rev.tag}
                    </span>
                    <div className="flex text-[var(--color-accent)] text-[0.6rem] tracking-tight">
                      {'★'.repeat(rev.stars)}
                    </div>
                  </div>

                  {/* Main Quote */}
                  <p className="font-serif italic text-[0.72rem] sm:text-[0.78rem] text-white/90 leading-relaxed mb-2 font-light">
                    "{rev.quote}"
                  </p>

                  {/* Highlight Callout */}
                  <p className="font-sans text-[0.52rem] sm:text-[0.56rem] text-white/55 leading-snug bg-white/[0.03] border border-white/5 rounded-lg p-2 mb-3">
                    {rev.highlight}
                  </p>
                </div>

                {/* Author Info */}
                <div className="flex items-center space-x-2 pt-2 border-t border-white/10">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/10 border border-white/20 flex items-center justify-center font-cinzel text-[0.55rem] sm:text-[0.6rem] text-[var(--color-accent)] font-semibold flex-shrink-0">
                    {rev.initials}
                  </div>
                  <div className="min-w-0">
                    <div className="font-cinzel text-[0.62rem] sm:text-[0.68rem] text-white font-medium truncate">
                      {rev.author}
                    </div>
                    <div className="font-metadata text-[0.46rem] sm:text-[0.5rem] text-white/45 truncate">
                      {rev.location} · <span className="text-[var(--color-accent)]/80">{rev.model}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Single Active Review Card with Scroll Progression Dots */}
          <div className="md:hidden flex flex-col items-center w-full">
            {(() => {
              const activeIdx = Math.min(2, Math.max(0, Math.floor(progress / 0.33)));
              const rev = REVIEWS[activeIdx] || REVIEWS[0];

              return (
                <div className="w-full bg-[#0B0B0A]/95 border border-[var(--color-accent)]/30 rounded-xl p-3 flex flex-col justify-between shadow-xl backdrop-blur-md">
                  <div>
                    {/* Top Badge & Rating */}
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="font-metadata text-[0.44rem] text-[var(--color-accent)] bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30 px-2 py-0.5 rounded-full font-semibold">
                        {rev.tag}
                      </span>
                      <div className="flex text-[var(--color-accent)] text-[0.58rem] tracking-tight">
                        {'★'.repeat(rev.stars)}
                      </div>
                    </div>

                    {/* Main Quote */}
                    <p className="font-serif italic text-[0.72rem] text-white/90 leading-relaxed mb-1.5 font-light">
                      "{rev.quote}"
                    </p>

                    {/* Highlight Callout */}
                    <p className="font-sans text-[0.52rem] text-white/55 leading-snug bg-white/[0.03] border border-white/5 rounded-lg p-1.5 mb-2">
                      {rev.highlight}
                    </p>
                  </div>

                  {/* Author Info */}
                  <div className="flex items-center space-x-2 pt-1.5 border-t border-white/10">
                    <div className="w-6 h-6 rounded-full bg-white/10 border border-white/20 flex items-center justify-center font-cinzel text-[0.52rem] text-[var(--color-accent)] font-semibold flex-shrink-0">
                      {rev.initials}
                    </div>
                    <div className="min-w-0">
                      <div className="font-cinzel text-[0.62rem] text-white font-medium truncate">
                        {rev.author}
                      </div>
                      <div className="font-metadata text-[0.44rem] text-white/45 truncate">
                        {rev.location} · <span className="text-[var(--color-accent)]/80">{rev.model}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Mobile Progress Dots */}
            <div className="flex items-center space-x-2 mt-2">
              {REVIEWS.map((_, i) => {
                const activeIdx = Math.min(2, Math.max(0, Math.floor(progress / 0.33)));
                const isActive = activeIdx === i;
                return (
                  <div
                    key={i}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      isActive ? 'w-5 bg-[var(--color-accent)]' : 'w-1.5 bg-white/20'
                    }`}
                  />
                );
              })}
            </div>
          </div>

          {/* Bottom Trust Stamp */}
          <div ref={stampRef} className="flex items-center justify-center space-x-2 text-white/40 font-metadata text-[0.44rem] sm:text-[0.5rem] tracking-widest uppercase mt-1.5 sm:mt-2">
            <span>GENEVA REGISTERED ARCHIVE</span>
            <span>•</span>
            <span>100% VERIFIED ACQUISITIONS</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CollectorReviews;
