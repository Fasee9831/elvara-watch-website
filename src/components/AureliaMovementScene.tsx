import React, { useRef, useState } from 'react';
import { Container } from '@/components/Container';
import { Typography } from '@/components/Typography';
import { CanvasFrameScrubber } from '@/components/CanvasFrameScrubber';
import { TechnicalCallout } from '@/components/TechnicalCallout';

export const AureliaMovementScene: React.FC = () => {
  const pinRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState<number>(0);

  const currentFrame = Math.min(120, Math.max(1, Math.floor(progress * 119) + 1));
  const formattedFrame = String(currentFrame).padStart(3, '0');
  const progressPercent = Math.round(progress * 100);

  const titleOpacity = progress < 0.85 ? Math.min(1, progress * 4) : Math.max(0, 1 - (progress - 0.85) * 5);

  return (
    <div ref={pinRef} className="relative w-full min-h-screen pb-[15vh] bg-[#060606] text-[var(--color-text-primary)] overflow-hidden select-none">
      
      {/* 60fps Canvas Frame Scrubber (120 High-Res Frames) */}
      <CanvasFrameScrubber
        folderPath="/frames/aurelia-2"
        frameCount={120}
        fallbackImage="/images/close-up-clock-with-time-change.jpg"
        triggerRef={pinRef}
        endScrollPx={2400}
        accentColor="#D4AF37"
        onUpdateProgress={setProgress}
        className="absolute inset-0 z-0"
      />

      {/* Synchronized Technical Callout Badges with Dynamic SVG Reticles */}
      <TechnicalCallout progress={progress} className="transition-opacity duration-500" />

      {/* Luxury Telemetry HUD Overlay (Clears Fixed Navigation) */}
      <div className="scene-overlay-hud">
        
        {/* Top Telemetry Header */}
        <div className="flex justify-between items-start border-b border-white/10 pb-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
              <Typography variant="eyebrow" className="text-[#D4AF37] text-[10px] tracking-[0.35em] block">
                MECHANICAL ARCHITECTURE
              </Typography>
            </div>
            <Typography variant="metadata" className="text-white/40 text-[9px] tracking-[0.3em] block">
              EXPOSED HOROLOGICAL MOVEMENT
            </Typography>
          </div>

          <div className="text-right space-y-1">
            <Typography variant="eyebrow" className="text-[#D4AF37] text-[10px] tracking-[0.35em] block">
              CHAPTER 02 / 03
            </Typography>
            <Typography variant="metadata" className="text-white/40 text-[9px] tracking-[0.3em] block">
              AURELIA II — INTERNAL MECHANICS
            </Typography>
          </div>
        </div>

        {/* Pinned Editorial Overlay */}
        <Container width="default" className="relative z-10 my-auto text-center pointer-events-none">
          <div
            className="space-y-4 transition-all duration-300 pointer-events-auto"
            style={{ opacity: titleOpacity }}
          >
            <Typography variant="eyebrow" className="text-[#D4AF37] tracking-[0.4em] block text-xs md:text-sm">
              ENGINEERED IN GENEVA
            </Typography>
            <Typography variant="displayL" className="font-light tracking-tight text-white leading-tight font-serif text-3xl md:text-6xl max-w-4xl mx-auto">
              NOTHING MOVES WITHOUT PURPOSE.
            </Typography>
          </div>
        </Container>

        {/* Bottom Telemetry Footer */}
        <div className="border-t border-white/10 pt-4 flex flex-col md:flex-row justify-between items-center text-[10px] font-mono tracking-widest text-white/50 space-y-3 md:space-y-0">
          {/* Frame Counter & Live Progress */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <span className="text-[#D4AF37]">FRAME:</span>
              <span className="text-white font-bold">{formattedFrame} / 120</span>
            </div>
            <div className="w-24 h-[2px] bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#D4AF37] transition-all duration-100"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-[#D4AF37]">PROGRESS:</span>
              <span className="text-white font-bold">{progressPercent}%</span>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex items-center space-x-3 bg-white/5 backdrop-blur-md px-3 py-1.5 rounded border border-white/10 text-white/80">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-ping" />
            <span className="text-[#D4AF37] font-bold">NOMINAL MOVEMENT SYNC</span>
            <span>|</span>
            <span>CAL. ÉL-8900-B</span>
          </div>
        </div>

        {/* Corner HUD Crosshairs */}
        <div className="absolute top-4 left-4 w-3 h-3 border-t-2 border-l-2 border-[#D4AF37]/40 pointer-events-none" />
        <div className="absolute top-4 right-4 w-3 h-3 border-t-2 border-r-2 border-[#D4AF37]/40 pointer-events-none" />
        <div className="absolute bottom-4 left-4 w-3 h-3 border-b-2 border-l-2 border-[#D4AF37]/40 pointer-events-none" />
        <div className="absolute bottom-4 right-4 w-3 h-3 border-b-2 border-r-2 border-[#D4AF37]/40 pointer-events-none" />

      </div>
    </div>
  );
};

export default AureliaMovementScene;
