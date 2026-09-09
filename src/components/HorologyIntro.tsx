import React, { useRef } from 'react';
import { gsap, useGSAP } from '@/animations/gsap';
import { isReducedMotionPreferred } from '@/animations/presets';
import { Container } from '@/components/Container';
import { Typography } from '@/components/Typography';

export const HorologyIntro: React.FC = () => {
  const introRef = useRef<HTMLDivElement | null>(null);
  const line1Ref = useRef<HTMLDivElement | null>(null);
  const line2Ref = useRef<HTMLDivElement | null>(null);
  const line3Ref = useRef<HTMLDivElement | null>(null);
  const copyRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      if (!introRef.current) return;
      if (isReducedMotionPreferred()) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: introRef.current,
          start: 'top 70%',
          end: 'bottom 40%',
          scrub: 0.8,
        },
      });

      tl.fromTo(
        line1Ref.current,
        { opacity: 0, y: 80 },
        { opacity: 1, y: 0, ease: 'power2.out' },
        0
      )
        .fromTo(
          line2Ref.current,
          { opacity: 0, y: 100 },
          { opacity: 1, y: 0, ease: 'power2.out' },
          0.15
        )
        .fromTo(
          line3Ref.current,
          { opacity: 0, y: 120 },
          { opacity: 1, y: 0, ease: 'power2.out' },
          0.3
        )
        .fromTo(
          copyRef.current,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, ease: 'power2.out' },
          0.45
        );
    },
    { dependencies: [] }
  );

  return (
    <section
      ref={introRef}
      id="art-of-time"
      className="relative min-h-[110vh] w-full flex flex-col justify-center items-center bg-[var(--color-bg)] text-[var(--color-text-primary)] border-t border-[var(--color-border)]/40 overflow-hidden py-24 select-none"
    >
      {/* Studio Lighting Atmosphere */}
      <div className="absolute inset-0 pointer-events-none lighting-studio opacity-40 z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-radial from-[var(--color-accent)]/10 via-transparent to-transparent blur-3xl opacity-30 pointer-events-none" />

      <Container width="default" className="relative z-10 text-center max-w-5xl mx-auto space-y-12">
        {/* Intro Subtitle & Eyebrow */}
        <div className="space-y-3">
          <Typography variant="eyebrow" className="text-[var(--color-accent)] tracking-[0.35em] block">
            ÉLVARA / HOROLOGY
          </Typography>
          <div className="w-12 h-[1px] bg-[var(--color-accent)]/50 mx-auto" />
          <Typography variant="metadata" className="text-[var(--color-text-muted)] tracking-[0.3em] block text-[11px]">
            THE ART OF TIME
          </Typography>
        </div>

        {/* Enormous Display Headline */}
        <h2 className="font-display font-light leading-[0.9] tracking-tight text-[var(--color-text-primary)] space-y-2">
          <div ref={line1Ref} className="overflow-hidden" style={{ opacity: 0, transform: 'translate3d(0, 80px, 0)' }}>
            <span className="block text-5xl sm:text-7xl lg:text-[7.5rem] xl:text-[9.5rem]">
              PRECISION
            </span>
          </div>
          <div ref={line2Ref} className="overflow-hidden" style={{ opacity: 0, transform: 'translate3d(0, 100px, 0)' }}>
            <span className="block text-5xl sm:text-7xl lg:text-[7.5rem] xl:text-[9.5rem] text-[var(--color-accent)]">
              BECOMES
            </span>
          </div>
          <div ref={line3Ref} className="overflow-hidden" style={{ opacity: 0, transform: 'translate3d(0, 120px, 0)' }}>
            <span className="block text-5xl sm:text-7xl lg:text-[7.5rem] xl:text-[9.5rem]">
              POETRY.
            </span>
          </div>
        </h2>

        {/* Supporting Editorial Statement */}
        <div ref={copyRef} className="max-w-xl mx-auto pt-6" style={{ opacity: 0, transform: 'translate3d(0, 40px, 0)' }}>
          <Typography variant="bodyL" className="text-[var(--color-text-secondary)] font-light leading-relaxed">
            Behind every ÉLVARA timepiece lies a choreography of precision, proportion, and mechanical restraint.
          </Typography>
        </div>
      </Container>
    </section>
  );
};

export default HorologyIntro;
