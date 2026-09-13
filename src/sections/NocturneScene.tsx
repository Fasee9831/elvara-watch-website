import React, { useRef, useState, useCallback } from 'react';
import { CinematicFrameSequence, type CameraTransform } from '@/components/CinematicFrameSequence';

interface NocturnePhase {
  id: string;
  step: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  description: string;
  specs: { label: string; value: string }[];
}

const NOCTURNE_PHASES: NocturnePhase[] = [
  {
    id: 'nocturne-1',
    step: '01 / 04',
    eyebrow: 'PHASE 1: OBSIDIAN BODY',
    title: 'Scratch-Proof Titanium',
    subtitle: 'Diamond-Coated Carbon Shield',
    description:
      'Infused with diamond-like carbon crystals in a vacuum chamber, this titanium watch resists daily scratches while staying ultralight on your wrist.',
    specs: [
      { label: 'CASE FINISH', value: 'Black Titanium DLC' },
      { label: 'SCRATCH RESISTANCE', value: 'Diamond Hardness' },
      { label: 'WEIGHT', value: '88g Ultralight Feel' },
    ],
  },
  {
    id: 'nocturne-2',
    step: '02 / 04',
    eyebrow: 'PHASE 2: GOLD SUBDIALS',
    title: 'Crystal Clear Readability',
    subtitle: 'High-Contrast Gold Chronograph Dials',
    description:
      'Two warm gold dials record 30-minute intervals and seconds with bright glowing hands so you can read the time instantly day or night.',
    specs: [
      { label: 'SUBDIALS', value: 'Minutes & Seconds' },
      { label: 'NIGHT GLOW', value: 'Swiss Super-LumiNova' },
      { label: 'DIAL BASE', value: 'Deep Velvet Obsidian' },
    ],
  },
  {
    id: 'nocturne-3',
    step: '03 / 04',
    eyebrow: 'PHASE 3: STOPWATCH FEEL',
    title: 'Crisp Mechanical Pushers',
    subtitle: 'Zero-Lag Tactile Actuation',
    description:
      'Gold knurled buttons give you a satisfying, precise mechanical click when you start, stop, or reset the stopwatch function.',
    specs: [
      { label: 'ACTUATION', value: 'Column Wheel Precision' },
      { label: 'PUSHERS', value: '18K Gold Knurled' },
      { label: 'RESOLUTION', value: '1/8th Second' },
    ],
  },
  {
    id: 'nocturne-4',
    step: '04 / 04',
    eyebrow: 'PHASE 4: COLLECTOR EXCLUSIVE',
    title: 'Only 9 Made Worldwide',
    subtitle: 'Strict Numbered Allocation',
    description:
      'Every single Nocturne is individually numbered on the back case and backed by a comprehensive 10-year Geneva manufacture warranty.',
    specs: [
      { label: 'EDITION SIZE', value: 'Strictly 09 Pieces' },
      { label: 'ENGRAVING', value: 'Custom Individual N°' },
      { label: 'WARRANTY', value: '10-Year Full Guarantee' },
    ],
  },
];

/**
 * NocturneScene — Inverted Split-Screen Obsidian Chronograph Studio.
 * Left: 4-phase obsidian narrative stream with champagne gold accents.
 * Right: Sticky 180-frame canvas scrubbing through the Nocturne film.
 */
export const NocturneScene: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  const getCameraTransform = useCallback((p: number): CameraTransform => {
    if (p < 0.25) {
      const t = p / 0.25;
      return { scale: 1.0 + t * 0.08, y: -t * 5 };
    } else if (p < 0.65) {
      const t = (p - 0.25) / 0.4;
      return {
        scale: 1.08 + Math.sin(t * Math.PI) * 0.1,
        y: -5 - Math.sin(t * Math.PI) * 8,
      };
    } else {
      const t = (p - 0.65) / 0.35;
      return { scale: 1.08 - t * 0.08, y: -5 * (1 - t) };
    }
  }, []);

  // Determine active phase (0..3)
  const activePhaseIdx = Math.min(
    NOCTURNE_PHASES.length - 1,
    Math.max(0, Math.floor(progress * NOCTURNE_PHASES.length))
  );

  return (
    <div
      ref={sectionRef}
      className="relative w-full h-[450vh] bg-[#070706] text-[var(--color-text-primary)]"
    >
      {/* Sticky Fullscreen Viewport */}
      <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center bg-[#070706]">
        {/* Full-Screen 180-Frame Nocturne Film Scrubber */}
        <CinematicFrameSequence
          folderPath="/frames/nocturne"
          frameCount={180}
          fallbackImage="/frames/nocturne/frame_001.webp"
          triggerRef={sectionRef}
          bgColor="#070706"
          accentColor="rgba(200, 180, 138, 0.35)"
          objectFit="cover"
          dynamicTransform={getCameraTransform}
          onUpdateProgress={setProgress}
        />

        {/* Obsidian & Gold Ambient Atmosphere */}
        <div
          className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-500"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, rgba(200, 180, 138, 0.10) 0%, rgba(200, 180, 138, 0.02) 50%, rgba(7,7,6,0.85) 100%)',
          }}
        />

        {/* Atmospheric Top & Bottom Seamless Shading */}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#070706] via-[#070706]/80 to-transparent pointer-events-none z-15" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#070706] via-[#070706]/80 to-transparent pointer-events-none z-15" />

        {/* Floating Luxury Obsidian UI & Telemetry Overlay (Clears Fixed Navigation) */}
        <div className="scene-overlay-hud">
          {/* Top HUD: Chapter & Act Jump Rail */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-1.5 sm:gap-4">
            <div className="flex items-center space-x-2 sm:space-x-3 bg-black/60 backdrop-blur-2xl px-2.5 xs:px-3.5 sm:px-5 py-1 sm:py-2 border border-white/10 rounded-full shadow-2xl">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[var(--color-accent)] animate-pulse shrink-0" />
              <span className="font-metadata text-[0.48rem] xs:text-[0.55rem] sm:text-xs tracking-[0.16em] sm:tracking-[0.25em] text-[var(--color-text-primary)]">
                CHAPTER V • NOCTURNE OBSIDIAN
              </span>
              <span className="text-white/20">|</span>
              <span className="font-metadata text-[0.48rem] xs:text-[0.55rem] sm:text-xs text-[var(--color-accent)] font-medium whitespace-nowrap">
                LIMITED 09
              </span>
            </div>

            {/* Act Jump Rail */}
            <div className="flex items-center space-x-1.5 xs:space-x-2 sm:space-x-3 bg-black/60 backdrop-blur-2xl px-2.5 xs:px-3.5 sm:px-6 py-1 sm:py-2 border border-white/10 rounded-full shadow-2xl">
              {NOCTURNE_PHASES.map((phase, idx) => {
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
                    {idx < NOCTURNE_PHASES.length - 1 && (
                      <span className="text-white/20 text-[0.55rem]">•</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Center-Right / Bottom Floating Dynamic Narrative Glass Card */}
          <div className="relative max-w-md self-start sm:self-end my-auto pointer-events-auto w-full sm:w-auto max-h-[calc(100dvh-var(--header-safe-top)-90px)] overflow-y-auto custom-scrollbar">
            {NOCTURNE_PHASES.map((phase, idx) => {
              const isActive = activePhaseIdx === idx;

              return (
                <div
                  key={phase.id}
                  className={`glass-panel-luxury p-3.5 sm:p-5 shadow-2xl transition-all duration-500 transform ${
                    isActive
                      ? 'opacity-100 translate-y-0 relative'
                      : 'opacity-0 translate-y-6 absolute inset-0 pointer-events-none'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-1.5 sm:mb-2">
                    <span className="font-metadata text-[0.54rem] sm:text-[0.62rem] text-[var(--color-accent)] border border-white/15 px-2 py-0.5 bg-white/5 rounded-full">
                      {phase.step}
                    </span>
                    <span className="font-eyebrow text-[0.54rem] sm:text-[0.62rem] tracking-[0.2em] text-[var(--color-text-muted)]">
                      {phase.eyebrow}
                    </span>
                  </div>

                  <h3 className="font-cinzel text-base sm:text-xl lg:text-2xl text-gold-bright font-light leading-tight mb-1 text-shadow-cinematic">
                    {phase.title}
                  </h3>

                  <p className="font-display italic text-[0.68rem] sm:text-xs lg:text-[0.82rem] text-[var(--color-accent)] mb-1.5 sm:mb-2">
                    {phase.subtitle}
                  </p>

                  <p className="font-body text-[0.68rem] sm:text-[0.76rem] text-[var(--color-text-secondary)] font-light leading-relaxed mb-2.5 sm:mb-3">
                    {phase.description}
                  </p>

                  {/* Micro Specs Rounded Chip Grid */}
                  <div className="grid grid-cols-3 gap-1.5 sm:gap-2 pt-0.5">
                    {phase.specs.map((spec, sIdx) => (
                      <div
                        key={sIdx}
                        className="bg-white/[0.04] border border-white/10 p-1.5 sm:p-2 rounded-lg shadow-inner"
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

          {/* Bottom HUD: Horological Spec Badges */}
          <div className="flex justify-end items-end w-full">
            <div className="hidden sm:flex items-center space-x-6 bg-black/60 backdrop-blur-2xl px-6 py-2.5 border border-white/10 rounded-2xl shadow-xl">
              <div>
                <span className="font-metadata block text-[0.65rem] text-[var(--color-text-muted)]">
                  SURFACE HARDNESS
                </span>
                <span className="font-mono-num text-xs text-[var(--color-accent)] font-semibold">
                  3,200 VICKERS
                </span>
              </div>
              <div className="h-6 w-[1px] bg-white/10" />
              <div>
                <span className="font-metadata block text-[0.65rem] text-[var(--color-text-muted)]">
                  TOTAL RESERVE
                </span>
                <span className="font-mono-num text-xs text-[var(--color-text-primary)] font-medium">
                  72 HOURS
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NocturneScene;
