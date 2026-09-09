import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap, useGSAP } from '@/animations/gsap';
import { isReducedMotionPreferred } from '@/animations/presets';
import { Container } from '@/components/Container';
import { Section } from '@/components/Section';
import { Typography } from '@/components/Typography';
import { ProductVisual } from '@/components/ProductVisual';
import { cardHoverVariants } from '@/animations/motion';
import { WATCHES } from '@/data/watches';

export const CollectionShowcase: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeWatchIndex, setActiveWatchIndex] = useState<number>(0);

  // GSAP ScrollTrigger Choreography & Dynamic Accent Updates
  useGSAP(
    () => {
      if (!containerRef.current) return;
      if (isReducedMotionPreferred()) return;

      const chapterEls = containerRef.current.querySelectorAll<HTMLElement>('.watch-chapter');

      chapterEls.forEach((el, index) => {
        const watch = WATCHES[index];

        // Track active chapter & set dynamic CSS variable --collection-accent
        gsap.to(el, {
          scrollTrigger: {
            trigger: el,
            start: 'top 50%',
            end: 'bottom 50%',
            onEnter: () => {
              setActiveWatchIndex(index);
              document.documentElement.style.setProperty('--collection-accent', watch.accentColor);
            },
            onEnterBack: () => {
              setActiveWatchIndex(index);
              document.documentElement.style.setProperty('--collection-accent', watch.accentColor);
            },
          },
        });

        // Entrance & Parallax animation for watch image & editorial copy
        const imageEl = el.querySelector('.chapter-visual');
        const textEl = el.querySelector('.chapter-content');
        const numberEl = el.querySelector('.chapter-number');

        if (imageEl && textEl) {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: el,
              start: 'top 80%',
              end: 'top 20%',
              scrub: 0.6,
            },
          });

          if (numberEl) {
            tl.fromTo(
              numberEl,
              { opacity: 0, x: -20 },
              { opacity: 1, x: 0, ease: 'power2.out' },
              0
            );
          }

          tl.fromTo(
            imageEl,
            { opacity: 0.1, scale: 0.86, y: 60 },
            { opacity: 1, scale: 1, y: 0, ease: 'power2.out' },
            0
          ).fromTo(
            textEl,
            { opacity: 0, y: 45 },
            { opacity: 1, y: 0, ease: 'power2.out' },
            0.15
          );
        }

        // Pinned sticky viewport effect for flagship chapters (AURELIA, NOCTURNE, SOLENNE)
        if (watch.isPinned) {
          gsap.to(imageEl, {
            scale: 1.05,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top top',
              end: '+=80%',
              pin: true,
              pinSpacing: true,
              scrub: 0.8,
            },
          });
        }
      });
    },
    { dependencies: [] }
  );

  const scrollToWatch = (index: number) => {
    const watch = WATCHES[index];
    if (watch) {
      const target = document.getElementById(watch.id);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div ref={containerRef} className="relative bg-[var(--color-bg)] text-[var(--color-text-primary)]">
      
      {/* ---------------------------------------------------- */}
      {/* FIXED COLLECTION NUMBER NAVIGATOR (DESKTOP)          */}
      {/* ---------------------------------------------------- */}
      <nav
        aria-label="Collection Navigation"
        className="fixed right-6 lg:right-10 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center space-y-4 pointer-events-auto select-none"
      >
        <div className="text-[10px] tracking-[0.25em] text-[var(--color-text-muted)] uppercase rotate-90 mb-6 origin-center">
          COLLECTION
        </div>
        {WATCHES.map((watch, idx) => {
          const isActive = activeWatchIndex === idx;
          return (
            <button
              key={watch.id}
              onClick={() => scrollToWatch(idx)}
              className="group flex items-center space-x-3 transition-all duration-300 focus-visible:outline-none"
              title={`${watch.number} — ${watch.name}`}
            >
              <span
                className={`text-[11px] font-mono tracking-widest transition-all duration-300 ${
                  isActive
                    ? 'text-[var(--collection-accent,var(--color-accent))] font-semibold scale-110'
                    : 'text-[var(--color-text-muted)] group-hover:text-[var(--color-text-primary)]'
                }`}
              >
                0{watch.numIndex}
              </span>
              <div
                className={`h-[1px] transition-all duration-300 ${
                  isActive
                    ? 'w-6 bg-[var(--collection-accent,var(--color-accent))]'
                    : 'w-2 bg-[var(--color-border)] group-hover:w-4 group-hover:bg-[var(--color-text-secondary)]'
                }`}
              />
            </button>
          );
        })}
      </nav>

      {/* ---------------------------------------------------- */}
      {/* FIXED MOBILE CHAPTER INDICATOR                       */}
      {/* ---------------------------------------------------- */}
      <div className="fixed bottom-6 right-6 z-40 lg:hidden pointer-events-auto select-none">
        <div className="px-4 py-2 rounded-full bg-[var(--color-surface)]/90 backdrop-blur-md border border-[var(--color-border-accent)]/30 text-xs font-mono tracking-widest text-[var(--color-accent)] shadow-xl">
          0{activeWatchIndex + 1} / 09 — {WATCHES[activeWatchIndex].name}
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 3. COLLECTION INTRO                                  */}
      {/* ---------------------------------------------------- */}
      <Section
        id="collection"
        bg="default"
        padding="large"
        className="relative border-t border-[var(--color-border)] overflow-hidden"
      >
        <div className="absolute inset-0 pointer-events-none lighting-studio opacity-40 z-0" />
        <Container width="default" className="relative z-10 text-center max-w-4xl mx-auto py-16 lg:py-28 space-y-6">
          <Typography variant="eyebrow" className="text-[var(--color-accent)] tracking-[0.35em] block">
            THE ÉLVARA COLLECTION
          </Typography>
          <Typography variant="displayXL" className="font-light tracking-tight">
            TIME, REFINED.
          </Typography>
          <div className="pt-2">
            <Typography variant="bodyL" className="text-[var(--color-text-secondary)] font-light leading-relaxed max-w-xl mx-auto uppercase tracking-widest text-xs">
              NINE EXPRESSIONS OF TIME. ONE ÉLVARA PHILOSOPHY.
            </Typography>
          </div>
          <div className="w-[1px] h-16 bg-gradient-to-b from-[var(--color-accent)]/50 to-transparent mx-auto mt-12" />
        </Container>
      </Section>

      {/* ---------------------------------------------------- */}
      {/* 4. NINE CINEMATIC WATCH CHAPTERS                     */}
      {/* ---------------------------------------------------- */}
      <div className="space-y-0">
        {WATCHES.map((watch) => {
          const isRight = watch.layoutPattern === 'image-right';
          const isCenter = watch.layoutPattern === 'image-center';

          return (
            <section
              key={watch.id}
              id={watch.id}
              aria-label={`ÉLVARA ${watch.name}`}
              className="watch-chapter relative min-h-screen w-full flex items-center py-20 lg:py-32 border-b border-[var(--color-border)]/30 overflow-hidden transition-colors duration-1000"
              style={{
                backgroundColor: watch.bgGradient,
              }}
            >
              {/* Subtle Ambient Color Glow */}
              <div
                className="absolute inset-0 pointer-events-none opacity-20 blur-3xl z-0"
                style={{
                  backgroundImage: `radial-gradient(circle at center, ${watch.accentColor} 0%, transparent 65%)`,
                }}
              />
              <div className="absolute inset-0 lighting-vignette opacity-70 pointer-events-none z-0" />

              <Container width="default" className="relative z-10 w-full">
                
                {/* ---------------------------------------------- */}
                {/* ASYMMETRIC CHAPTER LAYOUT (IMAGE LEFT / RIGHT)  */}
                {/* ---------------------------------------------- */}
                {!isCenter && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                    
                    {/* Visual Column */}
                    <div
                      className={`lg:col-span-7 ${
                        isRight ? 'lg:order-2' : 'lg:order-1'
                      } flex justify-center`}
                    >
                      <motion.div
                        variants={cardHoverVariants}
                        initial="initial"
                        whileHover="hover"
                        className="chapter-visual group w-full max-w-[480px] lg:max-w-[560px]"
                      >
                        <ProductVisual
                          imageSrc={watch.image}
                          alt={`ÉLVARA ${watch.name}`}
                          accentColor={watch.accentColor}
                          className="w-full h-full"
                        />
                      </motion.div>
                    </div>

                    {/* Content Column */}
                    <div
                      className={`chapter-content lg:col-span-5 ${
                        isRight ? 'lg:order-1' : 'lg:order-2'
                      } space-y-6 text-left`}
                    >
                      {/* Chapter Number & Collection */}
                      <div className="chapter-number flex items-center space-x-4">
                        <span className="font-mono text-xs tracking-widest text-[var(--color-accent)] font-semibold">
                          {watch.number}
                        </span>
                        <div className="h-[1px] w-8 bg-[var(--color-border-accent)]" />
                        <Typography variant="eyebrow" className="text-[var(--color-text-muted)] tracking-[0.25em]">
                          {watch.collection}
                        </Typography>
                      </div>

                      {/* Watch Name & Statement */}
                      <div className="space-y-2">
                        <Typography variant="displayL" className="font-light tracking-wide text-[var(--color-text-primary)]">
                          {watch.name}
                        </Typography>
                        <span className="block font-display text-2xl lg:text-3xl italic font-light text-[var(--color-accent-muted)]">
                          "{watch.statement}"
                        </span>
                      </div>

                      {/* Description */}
                      <Typography variant="bodyL" className="text-[var(--color-text-secondary)] font-light leading-relaxed">
                        {watch.description}
                      </Typography>

                      {/* Metadata Badges */}
                      <div className="pt-2 flex flex-wrap gap-2">
                        {watch.visualTags.map((tag, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 text-[10px] font-mono tracking-widest uppercase rounded-sm bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Explore Link */}
                      <div className="pt-4">
                        <a
                          href={`#${watch.id}`}
                          className="inline-flex items-center space-x-3 text-xs tracking-[0.25em] uppercase font-nav text-[var(--color-accent)] hover:text-[var(--color-text-primary)] transition-colors group/link"
                        >
                          <span>EXPLORE {watch.name}</span>
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            className="transform group-hover/link:translate-x-1.5 transition-transform duration-300"
                          >
                            <path d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        </a>
                      </div>

                    </div>

                  </div>
                )}

                {/* ---------------------------------------------- */}
                {/* CENTERED EDITORIAL CHAPTER LAYOUT              */}
                {/* ---------------------------------------------- */}
                {isCenter && (
                  <div className="max-w-5xl mx-auto text-center space-y-12">
                    
                    {/* Header Details */}
                    <div className="chapter-content space-y-4 max-w-2xl mx-auto">
                      <div className="chapter-number flex items-center justify-center space-x-4">
                        <span className="font-mono text-xs tracking-widest text-[var(--color-accent)] font-semibold">
                          {watch.number}
                        </span>
                        <div className="h-[1px] w-8 bg-[var(--color-border-accent)]" />
                        <Typography variant="eyebrow" className="text-[var(--color-text-muted)] tracking-[0.25em]">
                          {watch.collection}
                        </Typography>
                      </div>

                      <Typography variant="displayXL" className="font-light tracking-tight text-[var(--color-text-primary)]">
                        {watch.name}
                      </Typography>
                      <span className="block font-display text-2xl lg:text-3xl italic font-light text-[var(--color-accent-muted)]">
                        "{watch.statement}"
                      </span>
                    </div>

                    {/* Centered Visual */}
                    <div className="flex justify-center my-8">
                      <motion.div
                        variants={cardHoverVariants}
                        initial="initial"
                        whileHover="hover"
                        className="chapter-visual group w-full max-w-[540px] lg:max-w-[620px]"
                      >
                        <ProductVisual
                          imageSrc={watch.image}
                          alt={`ÉLVARA ${watch.name}`}
                          accentColor={watch.accentColor}
                          className="w-full h-full"
                        />
                      </motion.div>
                    </div>

                    {/* Description & Tags */}
                    <div className="chapter-content max-w-2xl mx-auto space-y-6">
                      <Typography variant="bodyL" className="text-[var(--color-text-secondary)] font-light leading-relaxed">
                        {watch.description}
                      </Typography>

                      <div className="flex flex-wrap justify-center gap-2">
                        {watch.visualTags.map((tag, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 text-[10px] font-mono tracking-widest uppercase rounded-sm bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                  </div>
                )}

              </Container>
            </section>
          );
        })}
      </div>

      {/* ---------------------------------------------------- */}
      {/* 5. COLLECTION CLOSING STATEMENT                      */}
      {/* ---------------------------------------------------- */}
      <Section
        bg="default"
        padding="large"
        className="relative border-t border-[var(--color-border)] overflow-hidden"
      >
        <div className="absolute inset-0 pointer-events-none lighting-studio opacity-50 z-0" />
        <Container width="default" className="relative z-10 text-center max-w-4xl mx-auto py-24 lg:py-36 space-y-8">
          <Typography variant="displayL" className="font-light tracking-wider text-[var(--color-text-primary)]">
            NINE EXPRESSIONS.
          </Typography>
          <Typography variant="displayL" className="font-light tracking-wider text-[var(--color-accent)]">
            ONE PHILOSOPHY.
          </Typography>
          <div className="pt-6 space-y-2">
            <Typography variant="displayM" className="font-light tracking-widest text-[var(--color-text-primary)]">
              ÉLVARA
            </Typography>
            <Typography variant="eyebrow" className="text-[var(--color-text-muted)] tracking-[0.35em]">
              TIME, REFINED.
            </Typography>
          </div>
        </Container>
      </Section>

    </div>
  );
};

export default CollectionShowcase;
