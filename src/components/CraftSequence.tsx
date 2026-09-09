import React, { useRef, useState } from 'react';
import { gsap, useGSAP } from '@/animations/gsap';
import { isReducedMotionPreferred } from '@/animations/presets';
import { Container } from '@/components/Container';
import { Typography } from '@/components/Typography';
import { TechnicalCallout } from '@/components/TechnicalCallout';

export const CraftSequence: React.FC = () => {
  const pinSectionRef = useRef<HTMLDivElement | null>(null);
  const visualContainerRef = useRef<HTMLDivElement | null>(null);
  const lightSweepRef = useRef<HTMLDivElement | null>(null);

  const [activeStage, setActiveStage] = useState<number>(0);

  const stages = [
    {
      step: '01 / THE CASE',
      title: 'Every contour begins with proportion.',
      copy: 'The silhouette of an ÉLVARA timepiece is shaped to balance presence with restraint.',
      image: '/images/watch1.jpg',
      alt: 'ÉLVARA Watch Case Architecture',
    },
    {
      step: '02 / THE DIAL',
      title: 'Where precision becomes expression.',
      copy: 'Every index, surface, and reflection is considered as part of a single visual language.',
      image: '/images/close-up-clock-with-time-change.jpg',
      alt: 'ÉLVARA Openworked Dial Detail',
    },
    {
      step: '03 / THE MOVEMENT',
      title: 'Nothing moves without purpose.',
      copy: 'Mechanical complexity remains hidden until the moment you choose to look closer.',
      image: '/images/watch1.jpg',
      alt: 'ÉLVARA Mechanical Movement Architecture',
    },
  ];

  useGSAP(
    () => {
      if (!pinSectionRef.current) return;
      if (isReducedMotionPreferred()) return;

      const isMobile = window.innerWidth < 768;
      if (isMobile) return;

      // Pinned Desktop Timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinSectionRef.current,
          start: 'top top',
          end: '+=250%',
          pin: true,
          pinSpacing: true,
          scrub: 0.8,
          onUpdate: (self) => {
            const p = self.progress;
            if (p < 0.35) {
              setActiveStage(0);
            } else if (p < 0.7) {
              setActiveStage(1);
            } else {
              setActiveStage(2);
            }
          },
        },
      });

      // Visual transformation sequence
      tl.to(visualContainerRef.current, {
        scale: 1.08,
        y: -20,
        ease: 'none',
      })
        .to(visualContainerRef.current, {
          scale: 1.15,
          y: -35,
          ease: 'none',
        });

      // One-time light sweep shimmer across watch face during Stage 3
      if (lightSweepRef.current) {
        gsap.fromTo(
          lightSweepRef.current,
          { x: '-100%', opacity: 0 },
          {
            x: '200%',
            opacity: 0.6,
            duration: 1.5,
            ease: 'power2.inOut',
            scrollTrigger: {
              trigger: pinSectionRef.current,
              start: 'top+=150% top',
              end: 'top+=200% top',
              scrub: false,
            },
          }
        );
      }
    },
    { dependencies: [] }
  );

  return (
    <div ref={pinSectionRef} className="relative w-full bg-[var(--color-bg)] text-[var(--color-text-primary)]">
      
      {/* ---------------------------------------------------- */}
      {/* DESKTOP PINNED EXPERIENCE                            */}
      {/* ---------------------------------------------------- */}
      <div className="hidden md:flex min-h-screen w-full relative flex-col justify-center items-center overflow-hidden py-16">
        
        {/* Studio Spotlight Atmosphere */}
        <div className="absolute inset-0 pointer-events-none lighting-studio opacity-50 z-0" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-radial from-[var(--color-accent)]/15 via-transparent to-transparent blur-3xl opacity-40 pointer-events-none z-0" />

        {/* Dynamic Technical Callout Overlay (Active during Stage 03) */}
        {activeStage === 2 && <TechnicalCallout className="animate-fade-in" />}

        <Container width="default" className="relative z-20 grid grid-cols-12 gap-12 items-center">
          
          {/* Editorial Content (Left 5 cols) */}
          <div className="col-span-5 space-y-8 text-left">
            
            {/* Step Progress Pill */}
            <div className="flex items-center space-x-3">
              <span className="font-mono text-xs tracking-widest text-[var(--color-accent)] font-semibold">
                {stages[activeStage].step}
              </span>
              <div className="h-[1px] w-12 bg-[var(--color-border-accent)]" />
            </div>

            {/* Title & Copy */}
            <div className="space-y-4 min-h-[160px]">
              <Typography variant="displayL" className="font-light tracking-tight text-[var(--color-text-primary)] transition-all duration-500">
                "{stages[activeStage].title}"
              </Typography>
              <Typography variant="bodyL" className="text-[var(--color-text-secondary)] font-light leading-relaxed transition-all duration-500">
                {stages[activeStage].copy}
              </Typography>
            </div>

            {/* Stage Selector Dots */}
            <div className="flex items-center space-x-3 pt-4">
              {stages.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    activeStage === idx ? 'w-8 bg-[var(--color-accent)]' : 'w-2 bg-[var(--color-border)]'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Visual Container (Right 7 cols) */}
          <div className="col-span-7 flex justify-center items-center">
            <div
              ref={visualContainerRef}
              className="relative w-full max-w-[540px] aspect-square rounded-2xl overflow-hidden border border-[var(--color-border)] shadow-[0_30px_80px_rgba(0,0,0,0.9)] bg-[var(--color-surface)] transition-all duration-700"
            >
              <img
                src={stages[activeStage].image}
                alt={stages[activeStage].alt}
                className="w-full h-full object-cover object-center filter contrast-[1.05] brightness-[0.98] transition-all duration-700"
              />
              
              {/* Light Sweep Metallic Reflection Effect */}
              <div
                ref={lightSweepRef}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 pointer-events-none"
              />

              {/* Dark Vignette Overlay */}
              <div className="absolute inset-0 bg-radial from-transparent via-black/10 to-black/50 pointer-events-none" />
            </div>
          </div>

        </Container>
      </div>

      {/* ---------------------------------------------------- */}
      {/* MOBILE UNPINNED LINEAR STORYTELLING FLOW             */}
      {/* ---------------------------------------------------- */}
      <div className="flex md:hidden flex-col space-y-20 py-16 px-4">
        {stages.map((stage, idx) => (
          <div key={idx} className="space-y-6 text-left">
            <div className="flex items-center space-x-3">
              <span className="font-mono text-xs tracking-widest text-[var(--color-accent)] font-semibold">
                {stage.step}
              </span>
              <div className="h-[1px] w-8 bg-[var(--color-border-accent)]" />
            </div>

            <div className="w-full aspect-square rounded-xl overflow-hidden border border-[var(--color-border)] shadow-xl bg-[var(--color-surface)]">
              <img
                src={stage.image}
                alt={stage.alt}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-2">
              <Typography variant="headingXL" className="font-light tracking-tight text-[var(--color-text-primary)]">
                "{stage.title}"
              </Typography>
              <Typography variant="bodyM" className="text-[var(--color-text-secondary)] font-light leading-relaxed">
                {stage.copy}
              </Typography>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default CraftSequence;
