import React, { useRef, useState, useCallback } from 'react';
import { CanvasFrameScrubber, type CameraTransform } from '@/components/CanvasFrameScrubber';

/**
 * CalibreExploded — Chapter II: The Exploded Calibre Architecture (Aurelia 1).
 * 
 * Choreography:
 * - 0–22%: Assembled golden timepiece & chapter title
 * - 22–50%: Mechanical expansion with floating spatial micro-callouts
 * - 50–75%: Maximum dispersion, micro-engineering telemetry & depth
 * - 75–100%: Precision lock & unification into final completed architecture
 */
export const CalibreExploded: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  // Dynamic camera transform: expands camera scale as components fly outwards
  const getCameraTransform = useCallback((p: number): CameraTransform => {
    if (p < 0.2) {
      return { scale: 1.0, y: 0 };
    } else if (p < 0.55) {
      // Zoom out slightly to let the exploded pieces fill the spatial canvas
      const t = (p - 0.2) / 0.35;
      return {
        scale: 1.0 + Math.sin(t * Math.PI) * 0.12,
        y: Math.sin(t * Math.PI) * -8,
      };
    } else if (p < 0.8) {
      const t = (p - 0.55) / 0.25;
      return {
        scale: 1.12 - t * 0.08,
        y: -8 * (1 - t),
      };
    } else {
      return { scale: 1.0, y: 0 };
    }
  }, []);

  // Smooth opacity helper
  const getOpacity = (start: number, peakStart: number, peakEnd: number, end: number) => {
    if (progress < start) return 0;
    if (progress < peakStart) return (progress - start) / (peakStart - start);
    if (progress <= peakEnd) return 1;
    if (progress < end) return 1 - (progress - peakEnd) / (end - peakEnd);
    return 0;
  };

  return (
    <section ref={sectionRef} className="relative min-h-screen pb-[15vh] bg-[#050505] overflow-hidden">
      <div className="relative w-full min-h-screen">
        {/* Frame Scrubber Canvas */}
        <CanvasFrameScrubber
          folderPath="/frames/aurelia-1"
          frameCount={180}
          fallbackImage="/frames/aurelia-1/frame_001.jpg"
          triggerRef={sectionRef}
          endScrollPx={4800}
          accentColor="rgba(212, 175, 55, 0.3)"
          dynamicTransform={getCameraTransform}
          onUpdateProgress={setProgress}
        />

        {/* Cinematic HUD Overlays */}
        <div className="absolute inset-0 z-20 flex flex-col justify-between p-6 md:p-12 pointer-events-none">
          {/* Top Bar HUD */}
          <div className="flex justify-between items-center w-full font-metadata text-[var(--color-text-muted)] text-[0.65rem] tracking-[0.25em]">
            <span className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
              <span>AURELIA • CAL. 02-AU</span>
            </span>
            <span>CHAPTER II • ARCHITECTURE</span>
          </div>

          {/* Center Stage Floating Overlays */}
          <div className="relative flex-1 flex flex-col items-center justify-center">
            {/* Stage 1: Chapter Intro (0–22%) */}
            <div
              className="absolute flex flex-col items-center text-center transition-transform duration-75 ease-out"
              style={{
                opacity: getOpacity(0, 0.04, 0.14, 0.22),
                transform: `translate3d(0, ${(1 - Math.min(1, progress / 0.1)) * 25}px, 0)`,
              }}
            >
              <span className="font-eyebrow text-[#D4AF37] mb-3 tracking-[0.35em] text-xs">
                CALIBRE ARCHITECTURE
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
                The Architecture
              </h2>
              <p className="font-body-s text-[var(--color-text-secondary)] mt-3 max-w-sm tracking-wider">
                Every microscopic bridge, jewel, and wheel exposed in brilliant 18K gold.
              </p>
            </div>

            {/* Stage 2 & 3: Floating Exploded Telemetry Callouts (26–74%) */}
            <div
              className="absolute inset-x-0 inset-y-8 flex justify-between items-center pointer-events-none transition-opacity duration-200"
              style={{ opacity: getOpacity(0.26, 0.34, 0.65, 0.74) }}
            >
              {/* Left Exploded Callout */}
              <div className="hidden md:flex flex-col space-y-3 bg-black/40 backdrop-blur-md border border-[var(--color-border-accent)] p-4 rounded-sm max-w-[240px]">
                <div className="flex items-center space-x-2 text-[0.6rem] font-metadata text-[#D4AF37]">
                  <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full" />
                  <span>COMPONENT 01</span>
                </div>
                <h4 className="font-display text-lg text-[var(--color-text-primary)] font-normal leading-tight">
                  Hand-Beveled Bridges
                </h4>
                <p className="font-body-s text-[var(--color-text-secondary)] text-[0.75rem] leading-relaxed">
                  Solid 18K yellow gold bridges finished with traditional anglage hand-polishing.
                </p>
              </div>

              {/* Right Exploded Callout */}
              <div className="hidden md:flex flex-col space-y-3 bg-black/40 backdrop-blur-md border border-[var(--color-border-accent)] p-4 rounded-sm max-w-[240px] text-right">
                <div className="flex items-center justify-end space-x-2 text-[0.6rem] font-metadata text-[#D4AF37]">
                  <span>COMPONENT 02</span>
                  <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full" />
                </div>
                <h4 className="font-display text-lg text-[var(--color-text-primary)] font-normal leading-tight">
                  Column Wheel Chrono
                </h4>
                <p className="font-body-s text-[var(--color-text-secondary)] text-[0.75rem] leading-relaxed">
                  Precision-machined to 2 microns tolerance for silk-smooth pusher activation.
                </p>
              </div>
            </div>

            {/* Stage 4: Reassembly Complete (76–98%) */}
            <div
              className="absolute flex flex-col items-center text-center transition-transform duration-75 ease-out"
              style={{
                opacity: getOpacity(0.76, 0.84, 0.94, 0.99),
                transform: `translate3d(0, ${(1 - getOpacity(0.76, 0.84, 0.94, 0.99)) * 20}px, 0)`,
              }}
            >
              <span className="font-eyebrow text-[#D4AF37] mb-2 tracking-[0.3em] text-xs">
                PRECISION UNIFIED
              </span>
              <h3
                className="text-[var(--color-text-primary)] tracking-[0.08em]"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.75rem, 4vw, 3rem)',
                  fontWeight: 300,
                }}
              >
                Aurelia Calibre Locked
              </h3>
              <p className="font-body-s text-[var(--color-text-muted)] mt-2 tracking-wider">
                198 Individual Components • 33 Jewels
              </p>
            </div>
          </div>

          {/* Bottom HUD Bar */}
          <div className="flex justify-start items-end w-full">
            <div className="font-metadata text-[var(--color-text-muted)] text-[0.68rem] tracking-[0.2em]">
              <span>EXPLODED STATE: </span>
              <span className="text-[#D4AF37]">
                {progress > 0.25 && progress < 0.75 ? 'DISPERSED 3D' : 'ASSEMBLED'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CalibreExploded;
