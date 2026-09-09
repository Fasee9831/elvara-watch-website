import React, { useRef, useState } from 'react';
import { Container } from '@/components/Container';
import { Typography } from '@/components/Typography';
import { CanvasFrameScrubber } from '@/components/CanvasFrameScrubber';

export const AureliaIntroScene: React.FC = () => {
  const pinRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState<number>(0);

  const currentFrame = Math.min(120, Math.max(1, Math.floor(progress * 119) + 1));
  const formattedFrame = String(currentFrame).padStart(3, '0');
  const progressPercent = Math.round(progress * 100);

  // Stage opacities based on scroll progress
  const stage1Opacity = progress < 0.35 ? 1 : Math.max(0, 1 - (progress - 0.35) * 5);
  const stage2Opacity = progress >= 0.30 && progress < 0.75 
    ? Math.min(1, (progress - 0.30) * 5) * (progress > 0.65 ? Math.max(0, 1 - (progress - 0.65) * 5) : 1) 
    : 0;
  const stage3Opacity = progress >= 0.70 ? Math.min(1, (progress - 0.70) * 4) : 0;

  return (
    <div ref={pinRef} className="relative w-full min-h-screen pb-[15vh] bg-[#050505] text-[var(--color-text-primary)] overflow-hidden select-none">
      
      {/* 60fps Canvas Frame Scrubber (120 High-Res Frames) */}
      <CanvasFrameScrubber
        folderPath="/frames/aurelia-1"
        frameCount={120}
        fallbackImage="/images/close-up-clock-with-time-change.jpg"
        triggerRef={pinRef}
        endScrollPx={2400}
        accentColor="#D4AF37"
        onUpdateProgress={setProgress}
        className="absolute inset-0 z-0"
      />

      {/* Futuristic Luxury HUD Grid & Crosshairs */}
      <div className="absolute inset-0 pointer-events-none z-10 p-6 md:p-12 flex flex-col justify-between">
        
        {/* Top Telemetry Header */}
        <div className="flex justify-between items-start border-b border-white/10 pb-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
              <Typography variant="eyebrow" className="text-[#D4AF37] text-[10px] tracking-[0.35em] block">
                ÉLVARA / HAUTE HORLOGERIE
              </Typography>
            </div>
            <Typography variant="metadata" className="text-white/40 text-[9px] tracking-[0.3em] block">
              GENÈVE MANUFACTURE • EST. 2026
            </Typography>
          </div>

          <div className="text-right space-y-1">
            <Typography variant="eyebrow" className="text-[#D4AF37] text-[10px] tracking-[0.35em] block">
              CHAPTER 01 / 03
            </Typography>
            <Typography variant="metadata" className="text-white/40 text-[9px] tracking-[0.3em] block">
              AURELIA I — TIME PIECE INTRO
            </Typography>
          </div>
        </div>

        {/* Dynamic Center Editorial Content */}
        <Container width="default" className="relative z-20 my-auto text-center pointer-events-none">
          {/* Stage 1: Intro Title */}
          <div
            className="space-y-4 transition-all duration-500 transform"
            style={{ 
              opacity: stage1Opacity,
              transform: `translateY(${(1 - stage1Opacity) * -20}px)`,
              display: stage1Opacity > 0 ? 'block' : 'none'
            }}
          >
            <Typography variant="eyebrow" className="text-[#D4AF37] tracking-[0.4em] block text-xs md:text-sm">
              GRAND COMPLICATION
            </Typography>
            <Typography variant="displayXL" className="font-light tracking-tight text-white leading-tight uppercase font-serif text-3xl md:text-6xl">
              THE AURELIA I
            </Typography>
            <Typography variant="bodyL" className="text-white/60 max-w-lg mx-auto text-xs md:text-sm tracking-widest uppercase">
              Sculpted in Grade 5 Titanium & 18K Warm Gold
            </Typography>
          </div>

          {/* Stage 2: Main Poetry Tagline */}
          <div
            className="space-y-4 transition-all duration-500 transform"
            style={{ 
              opacity: stage2Opacity,
              transform: `translateY(${(1 - stage2Opacity) * 20}px)`,
              display: stage2Opacity > 0 ? 'block' : 'none'
            }}
          >
            <Typography variant="displayXL" className="font-light tracking-tight text-white leading-tight font-serif text-4xl md:text-7xl">
              PRECISION BECOMES POETRY.
            </Typography>
            <Typography variant="eyebrow" className="text-[#D4AF37] tracking-[0.35em] block text-xs">
              120 SYNCHRONIZED ARCHIVAL MOTION FRAMES
            </Typography>
          </div>

          {/* Stage 3: Transition Prompt */}
          <div
            className="space-y-3 transition-all duration-500 transform"
            style={{ 
              opacity: stage3Opacity,
              transform: `translateY(${(1 - stage3Opacity) * 20}px)`,
              display: stage3Opacity > 0 ? 'block' : 'none'
            }}
          >
            <Typography variant="displayL" className="font-light tracking-tight text-white leading-tight font-serif text-2xl md:text-4xl">
              INTERNAL MOVEMENT EXPOSED
            </Typography>
            <Typography variant="bodyL" className="text-[#D4AF37] max-w-md mx-auto text-xs tracking-widest uppercase">
              SCROLL DOWN FOR CALIBER MECHANICS
            </Typography>
          </div>
        </Container>

        {/* Bottom Telemetry Footer */}
        <div className="border-t border-white/10 pt-4 flex flex-col md:flex-row justify-between items-center text-[10px] font-mono tracking-widest text-white/50 space-y-3 md:space-y-0">
          {/* Scroll & Frame Counter */}
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

          {/* Center Scroll Helper Line */}
          <div className="hidden md:flex flex-col items-center space-y-1 opacity-70">
            <span className="text-[9px] text-[#D4AF37] tracking-[0.25em]">SCROLL TO SCRUB</span>
            <div className="w-[1px] h-6 bg-gradient-to-b from-[#D4AF37] to-transparent animate-pulse" />
          </div>

          {/* Caliber Spec Badge */}
          <div className="flex items-center space-x-3 bg-white/5 backdrop-blur-md px-3 py-1.5 rounded border border-white/10 text-white/80">
            <span className="text-[#D4AF37] font-bold">CAL. ÉL-8900</span>
            <span>|</span>
            <span>28,800 VPH</span>
            <span>|</span>
            <span>72H RESERVE</span>
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

export default AureliaIntroScene;
