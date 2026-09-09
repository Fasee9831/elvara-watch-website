import React, { useRef } from 'react';
import { gsap, useGSAP } from '@/animations/gsap';
import { isReducedMotionPreferred } from '@/animations/presets';
import { Container } from '@/components/Container';
import { Typography } from '@/components/Typography';

export const PhilosophyStatement: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const line1Ref = useRef<HTMLDivElement | null>(null);
  const line2Ref = useRef<HTMLDivElement | null>(null);
  const brandRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;
      if (isReducedMotionPreferred()) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          end: 'bottom 25%',
          scrub: 0.8,
        },
      });

      tl.fromTo(
        line1Ref.current,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, ease: 'power2.out' },
        0
      )
        .fromTo(
          line2Ref.current,
          { opacity: 0, y: 80 },
          { opacity: 1, y: 0, ease: 'power2.out' },
          0.2
        )
        .fromTo(
          brandRef.current,
          { opacity: 0, scale: 0.95 },
          { opacity: 1, scale: 1, ease: 'power2.out' },
          0.4
        );
    },
    { dependencies: [] }
  );

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[120vh] w-full flex flex-col justify-center items-center bg-[#050505] text-[var(--color-text-primary)] border-t border-[var(--color-border)]/40 overflow-hidden py-32 select-none"
    >
      {/* Dark Atmosphere */}
      <div className="absolute inset-0 pointer-events-none lighting-vignette opacity-80 z-0" />

      <Container width="default" className="relative z-10 text-center max-w-5xl mx-auto space-y-20">
        
        {/* Philosophy Headlines */}
        <div className="space-y-6">
          <div ref={line1Ref} className="overflow-hidden" style={{ opacity: 0, transform: 'translate3d(0, 60px, 0)' }}>
            <Typography variant="displayXL" className="font-light tracking-tight text-[var(--color-text-secondary)]">
              "WE DO NOT CHASE TIME.
            </Typography>
          </div>
          <div ref={line2Ref} className="overflow-hidden" style={{ opacity: 0, transform: 'translate3d(0, 80px, 0)' }}>
            <Typography variant="displayXL" className="font-light tracking-tight text-[var(--color-accent)]">
              WE GIVE IT FORM."
            </Typography>
          </div>
        </div>

        {/* Brand Sign-Off */}
        <div ref={brandRef} className="pt-12 space-y-4" style={{ opacity: 0, transform: 'scale(0.95)' }}>
          <Typography variant="displayM" className="font-light tracking-[0.25em] text-[var(--color-text-primary)]">
            ÉLVARA
          </Typography>
          <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent mx-auto" />
          <Typography variant="eyebrow" className="text-[var(--color-text-muted)] tracking-[0.35em] block text-[11px]">
            TIME, REFINED.
          </Typography>
        </div>

      </Container>
    </section>
  );
};

export default PhilosophyStatement;
