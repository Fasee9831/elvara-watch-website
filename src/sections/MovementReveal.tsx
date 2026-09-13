import React, { useRef, useState, useCallback } from 'react';
import { CinematicFrameSequence, type CameraTransform } from '@/components/CinematicFrameSequence';

interface AssemblyPhase {
  id: string;
  step: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  description: string;
  specs: { label: string; value: string }[];
}

const PHASES: AssemblyPhase[] = [
  {
    id: 'phase-1',
    step: '01 / 04',
    eyebrow: 'PHASE 1: SKELETON BASE',
    title: 'Pure Gold Architecture',
    subtitle: '18K Solid Gold Openwork Foundation',
    description:
      'We carve away all unnecessary metal by hand, leaving behind a lightweight solid gold sculpture. You can look right through the watch and watch the gears spin freely.',
    specs: [
      { label: 'MATERIAL', value: '18K Solid Gold' },
      { label: 'HAND FINISH', value: 'Diamond Beveled Edges' },
      { label: 'PRECISION', value: '± 0.002 mm Micro-fit' },
    ],
  },
  {
    id: 'phase-2',
    step: '02 / 04',
    eyebrow: 'PHASE 2: THE HEARTBEAT',
    title: 'The Gliding Second Hand',
    subtitle: '28,800 Beats Per Hour Balance Wheel',
    description:
      'Ticking 8 times every second, this beating spring creates a super-smooth continuous sweep across the dial while maintaining atomic-level Swiss timekeeping accuracy.',
    specs: [
      { label: 'BEAT SPEED', value: '28,800 VPH (8 beats/sec)' },
      { label: 'ACCURACY', value: 'COSC Chronometer Grade' },
      { label: 'JEWEL BEARINGS', value: '33 Frictionless Rubies' },
    ],
  },
  {
    id: 'phase-3',
    step: '03 / 04',
    eyebrow: 'PHASE 3: STORED POWER',
    title: '72-Hour Energy Reserve',
    subtitle: 'Twin Mainspring Autonomous Barrels',
    description:
      'Two internal spring barrels store 3 full days of mechanical power. Take the watch off on Friday evening, and it is still running accurately on Monday morning without winding.',
    specs: [
      { label: 'POWER RUNTIME', value: '72 Hours (3 Full Days)' },
      { label: 'BATTERIES NEEDED', value: 'Zero (100% Mechanical)' },
      { label: 'ENERGY EFFICIENCY', value: '98.4% Torque Transfer' },
    ],
  },
  {
    id: 'phase-4',
    step: '04 / 04',
    eyebrow: 'PHASE 4: FINAL ASSEMBLY',
    title: 'Tough, Sealed & Ready',
    subtitle: 'Grade 5 Titanium & Sapphire Glass',
    description:
      'The movement is hermetically sealed inside an ultra-light titanium case topped with scratch-proof sapphire crystal and fitted with supple French leather.',
    specs: [
      { label: 'WATER SAFE', value: '50 Metres (5 ATM)' },
      { label: 'GLASS TYPE', value: 'Anti-Reflective Sapphire' },
      { label: 'STRAP CRAFT', value: 'Hand-Stitched Leather' },
    ],
  },
];

/**
 * MovementReveal — Split-Screen Calibre Assembly Studio.
 * Left: Sticky 180-frame canvas scrubbing through assembly film.
 * Right: 4-phase narrative assembly stream with dynamic glowing telemetry cards.
 */
export const MovementReveal: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  // Dynamic camera transform for macro zoom into the balance wheel
  const getCameraTransform = useCallback((p: number): CameraTransform => {
    if (p < 0.25) {
      const t = p / 0.25;
      return { scale: 1.0 + t * 0.08, y: -t * 5 };
    } else if (p < 0.65) {
      const t = (p - 0.25) / 0.4;
      return {
        scale: 1.08 + Math.sin(t * Math.PI) * 0.12,
        y: -5 - Math.sin(t * Math.PI) * 10,
      };
    } else {
      const t = (p - 0.65) / 0.35;
      return { scale: 1.08 - t * 0.08, y: -5 * (1 - t) };
    }
  }, []);

  // Determine active phase (0..3)
  const activePhaseIdx = Math.min(
    PHASES.length - 1,
    Math.max(0, Math.floor(progress * PHASES.length))
  );

  return (
    <div
      ref={sectionRef}
      className="relative w-full h-[450vh] bg-[#070706] text-[var(--color-text-primary)]"
    >
      {/* Sticky Fullscreen Viewport */}
      <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center bg-[#070706]">
        {/* Full-Screen 180-Frame Assembly Video Scrubber */}
        <CinematicFrameSequence
          folderPath="/frames/aurelia-2"
          frameCount={180}
          fallbackImage="/frames/aurelia-2/frame_001.webp"
          triggerRef={sectionRef}
          bgColor="#070706"
          accentColor="rgba(212, 175, 55, 0.4)"
          objectFit="cover"
          dynamicTransform={getCameraTransform}
          onUpdateProgress={setProgress}
        />

        {/* Cinematic Studio Radial Glow & Vignette */}
        <div
          className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-500"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, rgba(212, 175, 55, 0.10) 0%, rgba(212, 175, 55, 0.02) 50%, rgba(7,7,6,0.85) 100%)',
          }}
        />

        {/* Atmospheric Top & Bottom Seamless Shading */}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#070706] via-[#070706]/80 to-transparent pointer-events-none z-15" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#070706] via-[#070706]/80 to-transparent pointer-events-none z-15" />

        {/* Floating Luxury UI & Telemetry Overlay (Clears Fixed Navigation) */}
        <div className="scene-overlay-hud">
          {/* Top HUD: Assembly Title & Interactive Phase Jump Rail */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-1.5 sm:gap-4">
            <div className="flex items-center space-x-2 sm:space-x-3 bg-black/60 backdrop-blur-2xl px-2.5 xs:px-3.5 sm:px-5 py-1 sm:py-2 border border-white/10 rounded-full shadow-2xl">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[var(--color-accent)] animate-pulse shrink-0" />
              <span className="font-metadata text-[0.48rem] xs:text-[0.55rem] sm:text-xs tracking-[0.14em] sm:tracking-[0.2em] text-[var(--color-text-primary)]">
                CHAPTER III • CALIBRE 02-AU
              </span>
              <span className="text-white/20">|</span>
              <span className="font-metadata text-[0.48rem] xs:text-[0.55rem] sm:text-xs text-[var(--color-accent)] font-medium whitespace-nowrap">
                28,800 VPH
              </span>
            </div>

            {/* Step Jump Rail */}
            <div className="flex items-center space-x-1.5 xs:space-x-2 sm:space-x-3 bg-black/60 backdrop-blur-2xl px-2.5 xs:px-3.5 sm:px-6 py-1 sm:py-2 border border-white/10 rounded-full shadow-2xl">
              {PHASES.map((phase, idx) => {
                const isActive = activePhaseIdx === idx;
                const isPast = activePhaseIdx > idx;

                return (
                  <div key={phase.id} className="flex items-center space-x-1.5 xs:space-x-2 sm:space-x-3">
                    <div className="flex flex-col space-y-0.5 sm:space-y-1 items-center">
                      <div className="h-[2px] sm:h-[3px] w-6 xs:w-8 sm:w-14 md:w-16 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 rounded-full ${
                            isActive
                              ? 'w-full bg-[var(--color-accent)]'
                              : isPast
                              ? 'w-full bg-white/50'
                              : 'w-0'
                          }`}
                        />
                      </div>
                      <span
                        className={`font-metadata text-[0.42rem] xs:text-[0.48rem] sm:text-[0.55rem] tracking-wider text-center ${
                          isActive
                            ? 'text-[var(--color-accent)] font-semibold'
                            : 'text-[var(--color-text-muted)]'
                        }`}
                      >
                        0{idx + 1}
                      </span>
                    </div>
                    {idx < PHASES.length - 1 && (
                      <span className="text-white/20 text-[0.55rem]">•</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Center-Left / Bottom Floating Dynamic Narrative Glass Card */}
          <div className="relative max-w-md self-start my-auto pointer-events-auto w-full sm:w-auto max-h-[calc(100dvh-var(--header-safe-top)-90px)] overflow-y-auto custom-scrollbar">
            {PHASES.map((phase, idx) => {
              const isActive = activePhaseIdx === idx;

              return (
                <div
                  key={phase.id}
                  className={`glass-panel-luxury p-3.5 sm:p-5 shadow-2xl phase-narrative-card ${
                    isActive
                      ? 'opacity-100 translate-y-0 relative phase-card-active'
                      : 'opacity-0 translate-y-6 absolute inset-0 pointer-events-none phase-card-inactive'
                  }`}
                >
                  {/* Step & Eyebrow Badge (0.06s delay) */}
                  <div className="flex items-center space-x-2 mb-1.5 sm:mb-2 phase-text-item phase-text-badge">
                    <span className="font-metadata text-[0.54rem] sm:text-[0.62rem] text-[var(--color-accent)] border border-white/15 px-2 py-0.5 bg-white/5 rounded-full">
                      {phase.step}
                    </span>
                    <span className="font-eyebrow text-[0.54rem] sm:text-[0.62rem] tracking-[0.2em] text-[var(--color-text-muted)]">
                      {phase.eyebrow}
                    </span>
                  </div>

                  {/* Title with Directional Reveal (0.13s delay) */}
                  <h3 className="font-cinzel text-base sm:text-xl lg:text-2xl text-gold-bright font-light leading-tight mb-1 text-shadow-cinematic phase-text-item phase-text-title">
                    {phase.title}
                  </h3>

                  {/* Subtitle (0.21s delay) */}
                  <p className="font-display italic text-[0.68rem] sm:text-xs lg:text-[0.82rem] text-[var(--color-accent)] mb-1.5 sm:mb-2 phase-text-item phase-text-subtitle">
                    {phase.subtitle}
                  </p>

                  {/* Narrative Body Description (0.29s delay, directional reveal) */}
                  <p className="font-body text-[0.68rem] sm:text-[0.76rem] text-[var(--color-text-secondary)] font-light leading-relaxed mb-2.5 sm:mb-3 phase-text-item phase-text-desc">
                    {phase.description}
                  </p>

                  {/* Micro Specs Staggered Chips (0.37s, 0.45s, 0.53s delay) */}
                  <div className="grid grid-cols-3 gap-1.5 sm:gap-2 pt-0.5">
                    {phase.specs.map((spec, sIdx) => (
                      <div
                        key={sIdx}
                        className="bg-white/[0.04] border border-white/10 p-1.5 sm:p-2 rounded-lg shadow-inner phase-text-item phase-chip"
                      >
                        <span className="font-metadata block text-[0.46rem] sm:text-[0.54rem] text-[var(--color-text-muted)] mb-0.5 truncate">
                          {spec.label}
                        </span>
                        <span className="font-mono-num text-[0.6rem] sm:text-[0.72rem] text-[var(--color-text-primary)] font-medium truncate block">
                          {spec.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom HUD: Horological Metrics */}
          <div className="flex justify-end items-end w-full">
            <div className="hidden sm:flex items-center space-x-6 bg-black/60 backdrop-blur-2xl px-6 py-2.5 border border-white/10 rounded-2xl shadow-xl">
              <div>
                <span className="font-metadata block text-[0.58rem] text-[var(--color-text-muted)]">
                  TORQUE STABILITY
                </span>
                <span className="font-mono-num text-xs text-[var(--color-text-secondary)] font-medium">
                  99.2% LINEAR
                </span>
              </div>
              <div className="h-6 w-[1px] bg-white/10" />
              <div>
                <span className="font-metadata block text-[0.58rem] text-[var(--color-text-muted)]">
                  FREQUENCY
                </span>
                <span className="font-mono-num text-xs text-[var(--color-accent)] font-semibold">
                  28,800 VPH (4 HZ)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovementReveal;
