import React, { useRef, useState } from 'react';
import { gsap, useGSAP } from '@/animations/gsap';
import { isReducedMotionPreferred } from '@/animations/presets';

/**
 * FormDialScene — Scene 02: Form & Dial Macro Plunge.
 * A 400vh pinned sticky scene where the camera physically moves from
 * full watch silhouette directly into the micro-engraved dial heart,
 * then pulls back into negative space.
 */
export const FormDialScene: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const watchImgRef = useRef<HTMLImageElement>(null);
  const dialImgRef = useRef<HTMLImageElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useGSAP(
    () => {
      if (isReducedMotionPreferred() || !sectionRef.current) return;

      const isMobile = window.innerWidth < 768;
      const scrollDist = isMobile ? 2200 : 3600;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: `+=${scrollDist}`,
          pin: true,
          pinSpacing: true,
          scrub: 0.3,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            setProgress(self.progress);
          },
        },
      });

      // 1. Initial full watch zoom
      tl.fromTo(
        watchImgRef.current,
        { scale: 0.9, opacity: 1, filter: 'brightness(0.9) contrast(1.05)' },
        { scale: 1.8, opacity: 0, duration: 1.2, ease: 'power2.in' }
      );

      // 2. Crossfade & Plunge into macro dial
      tl.fromTo(
        dialImgRef.current,
        { scale: 0.8, opacity: 0, filter: 'blur(8px) brightness(0.6)' },
        { scale: 1.4, opacity: 1, filter: 'blur(0px) brightness(1.0)', duration: 1.5, ease: 'power2.out' },
        '-=0.8'
      );

      // 3. Deep macro inspection & gentle camera drift
      tl.to(dialImgRef.current, {
        scale: 1.9,
        xPercent: -4,
        yPercent: -6,
        duration: 1.8,
        ease: 'power1.inOut',
      });

      // 4. Pull camera back into full watch silhouette
      tl.to(dialImgRef.current, {
        scale: 2.4,
        opacity: 0,
        filter: 'blur(6px)',
        duration: 1.2,
        ease: 'power2.in',
      }).fromTo(
        watchImgRef.current,
        { scale: 1.6, opacity: 0 },
        { scale: 1.0, opacity: 1, duration: 1.2, ease: 'power3.out' },
        '-=0.8'
      );
    },
    { dependencies: [] }
  );

  const getOpacity = (start: number, peakStart: number, peakEnd: number, end: number) => {
    if (progress < start) return 0;
    if (progress < peakStart) return (progress - start) / (peakStart - start);
    if (progress <= peakEnd) return 1;
    if (progress < end) return 1 - (progress - peakEnd) / (end - peakEnd);
    return 0;
  };

  return (
    <section ref={sectionRef} className="relative w-full min-h-screen pb-[15vh] bg-[#060605] overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(200,180,138,0.08)_0%,transparent_70%)]" />

      {/* Center Camera Viewport */}
      <div ref={containerRef} className="relative w-full h-full flex items-center justify-center overflow-hidden">
        {/* Layer 1: Full Watch Form */}
        <img
          ref={watchImgRef}
          src="/images/beautiful-rendering-steel-object.jpg"
          alt="ÉLVARA Form & Proportion"
          className="absolute max-w-[85vw] max-h-[85vh] object-contain will-change-transform filter contrast-[1.06] select-none pointer-events-none"
        />

        {/* Layer 2: Deep Openworked Dial Macro Detail */}
        <img
          ref={dialImgRef}
          src="/images/close-up-clock-with-time-change.jpg"
          alt="ÉLVARA Macro Dial Finishing"
          className="absolute max-w-[90vw] max-h-[90vh] object-contain will-change-transform filter contrast-[1.08] select-none pointer-events-none opacity-0"
        />

        {/* Atmospheric Vignette */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_75%_65%_at_50%_50%,transparent_30%,rgba(6,6,5,0.9)_100%)]" />
      </div>

      {/* Cinematic HUD & Telemetry Overlays */}
      <div ref={hudRef} className="absolute inset-0 z-20 flex flex-col justify-between p-6 md:p-12 lg:p-16 pointer-events-none">
        {/* Top HUD */}
        <div className="flex justify-between items-center w-full font-metadata text-[var(--color-text-muted)] text-[0.65rem] tracking-[0.25em]">
          <span className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] animate-pulse" />
            <span>OPTICAL MACRO ZOOM</span>
          </span>
          <span>SCENE 02 • THE DIAL & FORM</span>
        </div>

        {/* Center Stage Floating Texts */}
        <div className="relative flex-1 flex flex-col items-center justify-center">
          {/* Phase 1: Form Intro (0–22%) */}
          <div
            className="absolute flex flex-col items-center text-center transition-transform duration-100 ease-out"
            style={{
              opacity: getOpacity(0, 0.04, 0.14, 0.22),
              transform: `translate3d(0, ${(1 - Math.min(1, progress / 0.1)) * 25}px, 0)`,
            }}
          >
            <span className="font-eyebrow text-[var(--color-accent)] mb-3 tracking-[0.35em] text-xs">
              SCULPTURAL GEOMETRY
            </span>
            <h2
              className="text-[var(--color-text-primary)] tracking-[0.1em]"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.5rem, 6vw, 4.75rem)',
                fontWeight: 300,
                lineHeight: 1.05,
              }}
            >
              The Form
            </h2>
            <p className="font-body-s text-[var(--color-text-secondary)] mt-3 max-w-sm tracking-wider">
              Beveled titanium facets sculpted to capture every ray of ambient light.
            </p>
          </div>

          {/* Phase 2: Macro Dial Plunge Callouts (35–70%) */}
          <div
            className="absolute inset-x-0 flex justify-between items-center px-4 md:px-12 pointer-events-none transition-opacity duration-200"
            style={{ opacity: getOpacity(0.35, 0.44, 0.65, 0.74) }}
          >
            <div className="hidden md:flex flex-col space-y-2 text-left bg-black/50 backdrop-blur-md border border-[var(--color-border-accent)] p-4 rounded-sm max-w-[220px]">
              <span className="font-metadata text-[0.65rem] text-[var(--color-accent)]">GUILLOCHÉ FINISHING</span>
              <h4 className="font-display text-lg text-[var(--color-text-primary)] font-light">Clous de Paris</h4>
              <p className="font-body-s text-[0.72rem] text-[var(--color-text-secondary)] leading-relaxed">
                Hand-turned on a vintage rose engine lathe with 0.05mm pitch precision.
              </p>
            </div>

            <div className="hidden md:flex flex-col space-y-2 text-right bg-black/50 backdrop-blur-md border border-[var(--color-border-accent)] p-4 rounded-sm max-w-[220px]">
              <span className="font-metadata text-[0.65rem] text-[var(--color-accent)]">SAPPHIRE APERTURE</span>
              <h4 className="font-display text-lg text-[var(--color-text-primary)] font-light">Exposed Heartbeat</h4>
              <p className="font-body-s text-[0.72rem] text-[var(--color-text-secondary)] leading-relaxed">
                Framing the free-sprung gold balance wheel through multi-layered anti-reflective crystal.
              </p>
            </div>
          </div>

          {/* Phase 3: Silhouette Return (78–98%) */}
          <div
            className="absolute flex flex-col items-center text-center transition-transform duration-100 ease-out"
            style={{
              opacity: getOpacity(0.78, 0.86, 0.94, 0.99),
              transform: `translate3d(0, ${(1 - getOpacity(0.78, 0.86, 0.94, 0.99)) * 20}px, 0)`,
            }}
          >
            <span className="font-eyebrow text-[var(--color-accent)] mb-2 tracking-[0.3em] text-xs">
              EQUILIBRIUM
            </span>
            <h3
              className="text-[var(--color-text-primary)] tracking-[0.08em]"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.75rem, 4vw, 3rem)',
                fontWeight: 300,
              }}
            >
              Proportion in Silence
            </h3>
            <p className="font-body-s text-[var(--color-text-muted)] mt-2 tracking-wider">
              41mm Grade 5 Titanium • 9.8mm Profile
            </p>
          </div>
        </div>

        {/* Bottom HUD */}
        <div className="flex justify-between items-end w-full">
          <div className="font-metadata text-[var(--color-text-muted)] text-[0.68rem] tracking-[0.2em]">
            <span>MAGNIFICATION: </span>
            <span className="text-[var(--color-accent)]">
              {progress < 0.25 ? '1.0X' : progress < 0.75 ? '8.5X MACRO' : '1.0X'}
            </span>
          </div>

          <div className="font-metadata text-[var(--color-text-muted)] text-[0.68rem] tracking-[0.2em]">
            <span>FOCAL DEPTH: </span>
            <span className="text-[var(--color-accent)]">
              {Math.round(progress * 100)}%
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FormDialScene;
