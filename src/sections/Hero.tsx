import React, { useRef } from 'react';
import { gsap, useGSAP } from '@/animations/gsap';
import { isReducedMotionPreferred } from '@/animations/presets';
import { Container } from '@/components/Container';
import { Typography } from '@/components/Typography';
import { Button } from '@/components/Button';
import { ProductVisual } from '@/components/ProductVisual';

export const Hero: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const bgRef = useRef<HTMLDivElement | null>(null);
  const eyebrowRef = useRef<HTMLDivElement | null>(null);
  const line1Ref = useRef<HTMLDivElement | null>(null);
  const line2Ref = useRef<HTMLDivElement | null>(null);
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const ctaRef = useRef<HTMLDivElement | null>(null);
  const productRef = useRef<HTMLDivElement | null>(null);
  const scrollIndRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      if (!sectionRef.current) return;
      const reduced = isReducedMotionPreferred();

      if (reduced) {
        // Instant reveal for reduced motion preference
        gsap.set(
          [
            eyebrowRef.current,
            line1Ref.current,
            line2Ref.current,
            bodyRef.current,
            ctaRef.current,
            productRef.current,
            scrollIndRef.current,
          ],
          { opacity: 1, y: 0, scale: 1 }
        );
        return;
      }

      // Initial Entrance Sequence
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

      // 0.00s Background illumination fade
      tl.fromTo(bgRef.current, { opacity: 0 }, { opacity: 1, duration: 1 }, 0);

      // 0.30s Eyebrow
      tl.fromTo(
        eyebrowRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6 },
        0.3
      );

      // 0.45s Headline Line 1
      tl.fromTo(
        line1Ref.current,
        { opacity: 0, y: 35 },
        { opacity: 1, y: 0, duration: 0.8 },
        0.45
      );

      // 0.65s Headline Line 2
      tl.fromTo(
        line2Ref.current,
        { opacity: 0, y: 35 },
        { opacity: 1, y: 0, duration: 0.8 },
        0.65
      );

      // 0.85s Supporting copy
      tl.fromTo(
        bodyRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7 },
        0.85
      );

      // 1.00s CTA Buttons
      tl.fromTo(
        ctaRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7 },
        1.0
      );

      // 1.10s Product Visual Subtle Entrance
      tl.fromTo(
        productRef.current,
        { opacity: 0, scale: 1.04, y: 30 },
        { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: 'power3.out' },
        1.1
      );

      // Scroll Indicator
      tl.fromTo(
        scrollIndRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.8 },
        1.3
      );

      // Responsive ScrollTrigger Parallax Behavior (Desktop Only)
      const isMobile = window.innerWidth < 768;
      if (!isMobile) {
        const scrollTl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.5,
          },
        });

        scrollTl
          .to(bgRef.current, { y: 50, opacity: 0.4 }, 0)
          .to([line1Ref.current, line2Ref.current], { y: -50, opacity: 0.3 }, 0)
          .to(bodyRef.current, { y: -70, opacity: 0.2 }, 0)
          .to(ctaRef.current, { y: -80, opacity: 0.1 }, 0)
          .to(productRef.current, { y: -30, scale: 0.95, opacity: 0.4 }, 0)
          .to(scrollIndRef.current, { opacity: 0, y: -20 }, 0);
      }
    },
    { dependencies: [] }
  );

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full bg-[var(--color-bg)] text-[var(--color-text-primary)] flex flex-col justify-between pt-28 pb-[15vh] lg:pt-36 overflow-hidden select-none"
      aria-label="Hero Section"
    >
      {/* Studio Lighting Background Layers */}
      <div ref={bgRef} className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 lighting-studio opacity-90" />
        <div className="absolute inset-0 lighting-vignette opacity-80" />
        {/* Subtle Radial Atmosphere Behind Timepiece */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-radial from-[var(--color-accent)]/8 via-transparent to-transparent blur-3xl opacity-50" />
      </div>

      <Container width="default" className="relative z-10 my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Typography & Call-To-Actions */}
          <div className="lg:col-span-6 space-y-6 lg:space-y-8 order-1 lg:order-1 text-left">
            
            {/* Eyebrow */}
            <div ref={eyebrowRef} className="opacity-0">
              <Typography variant="eyebrow" className="text-[var(--color-accent)] tracking-[0.3em]">
                ÉLVARA / SWISS HOROLOGY
              </Typography>
            </div>

            {/* Headline */}
            <h1 className="space-y-1">
              <div ref={line1Ref} className="opacity-0 overflow-hidden">
                <span className="block font-display text-5xl sm:text-7xl lg:text-8xl xl:text-[5.75rem] font-light leading-[0.95] tracking-tight text-[var(--color-text-primary)]">
                  TIME,
                </span>
              </div>
              <div ref={line2Ref} className="opacity-0 overflow-hidden">
                <span className="block font-display text-5xl sm:text-7xl lg:text-8xl xl:text-[5.75rem] font-light leading-[0.95] tracking-tight text-[var(--color-accent)]">
                  REFINED.
                </span>
              </div>
            </h1>

            {/* Mobile Product Visual Placement */}
            <div className="block lg:hidden my-6">
              <div ref={productRef} className="opacity-0">
                <ProductVisual model="nocturne" />
              </div>
            </div>

            {/* Supporting Copy */}
            <div ref={bodyRef} className="opacity-0 max-w-md">
              <Typography variant="bodyL" className="text-[var(--color-text-secondary)] font-light leading-relaxed">
                Precision engineered for those who measure moments differently.
              </Typography>
            </div>

            {/* CTAs */}
            <div ref={ctaRef} className="opacity-0 pt-2 flex flex-wrap items-center gap-4 sm:gap-6">
              <Button variant="primary" size="medium" onClick={() => {
                const collection = document.querySelector('#collection');
                if (collection) collection.scrollIntoView({ behavior: 'smooth' });
              }}>
                DISCOVER THE COLLECTION
              </Button>
              
              <Button variant="ghost" size="medium" onClick={() => {
                const explore = document.querySelector('#explore');
                if (explore) explore.scrollIntoView({ behavior: 'smooth' });
              }}>
                EXPLORE
              </Button>
            </div>
          </div>

          {/* Desktop Product Visual Placement */}
          <div className="hidden lg:block lg:col-span-6 order-2">
            <div ref={productRef} className="opacity-0">
              <ProductVisual model="nocturne" />
            </div>
          </div>

        </div>
      </Container>

      {/* Scroll Indicator */}
      <div
        ref={scrollIndRef}
        className="relative z-10 opacity-0 flex flex-col items-center justify-center space-y-3 pt-6 pointer-events-none"
      >
        <Typography variant="metadata" className="text-[var(--color-text-muted)] text-[10px] tracking-[0.25em]">
          SCROLL TO EXPLORE
        </Typography>
        <div className="w-[1px] h-8 bg-gradient-to-b from-[var(--color-accent)]/60 to-transparent" />
      </div>
    </section>
  );
};

export default Hero;
