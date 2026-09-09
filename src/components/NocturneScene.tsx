import React, { useRef, useState } from 'react';
import { Container } from '@/components/Container';
import { Typography } from '@/components/Typography';
import { CanvasFrameScrubber } from '@/components/CanvasFrameScrubber';

export const NocturneScene: React.FC = () => {
  const pinRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState<number>(0);

  const currentFrame = Math.min(120, Math.max(1, Math.floor(progress * 119) + 1));
  const formattedFrame = String(currentFrame).padStart(3, '0');
  const progressPercent = Math.round(progress * 100);

  // Stage opacities based on scroll progress
  const stage1Opacity = progress < 0.40 ? 1 : Math.max(0, 1 - (progress - 0.40) * 5);
  const stage2Opacity = progress >= 0.35 && progress < 0.80 
    ? Math.min(1, (progress - 0.35) * 5) * (progress > 0.70 ? Math.max(0, 1 - (progress - 0.70) * 5) : 1) 
    : 0;
  const stage3Opacity = progress >= 0.75 ? Math.min(1, (progress - 0.75) * 4) : 0;

  return (
    <div ref={pinRef} className="relative w-full min-h-screen pb-[15vh] bg-[#050505] text-[var(--color-text-primary)] overflow-hidden select-none">
      
      {/* 60fps Canvas Frame Scrubber (120 High-Res Frames) */}
      <CanvasFrameScrubber
        folderPath="/frames/nocturne"
        frameCount={120}
        fallbackImage="/images/watch1.jpg"
        triggerRef={pinRef}
        endScrollPx={2400}
        accentColor="#C8B48A"
        onUpdateProgress={setProgress}
        className="absolute inset-0 z-0"
      />

      {/* Obsidian Dark Luxury Telemetry HUD Overlay */}
      <div className="absolute inset-0 pointer-events-none z-10 p-6 md:p-12 flex flex-col justify-between">
        
        {/* Top Telemetry Header */}
        <div className="flex justify-between items-start border-b border-white/10 pb-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#C8B48A] animate-pulse" />
              <Typography variant="eyebrow" className="text-[#C8B48A] text-[10px] tracking-[0.35em] block">
                THE OBSIDIAN SERIES
              </Typography>
            </div>
            <Typography variant="metadata" className="text-white/40 text-[9px] tracking-[0.3em] block">
              BLACK DLC MATTE FINISH • SCHWARZ EDITION
            </Typography>
          </div>

          <div className="text-right space-y-1">
            <Typography variant="eyebrow" className="text-[#C8B48A] text-[10px] tracking-[0.35em] block">
              CHAPTER 03 / 03
            </Typography>
            <Typography variant="metadata" className="text-white/40 text-[9px] tracking-[0.3em] block">
              NOCTURNE — SHADOW & LIGHT
            </Typography>
          </div>
        </div>

        {/* Dynamic Center Editorial Content */}
        <Container width="default" className="relative z-20 my-auto text-center pointer-events-none">
          {/* Stage 1 */}
          <div
            className="space-y-4 transition-all duration-500 transform"
            style={{ 
              opacity: stage1Opacity,
              transform: `translateY(${(1 - stage1Opacity) * -20}px)`,
              display: stage1Opacity > 0 ? 'block' : 'none'
            }}
          >
            <Typography variant="eyebrow" className="text-[#C8B48A] tracking-[0.4em] block text-xs md:text-sm">
              THE NOCTURNE
            </Typography>
            <Typography variant="displayXL" className="font-light tracking-tight text-white leading-tight font-serif text-3xl md:text-6xl">
              BORN FROM SHADOW.
            </Typography>
            <Typography variant="bodyL" className="text-white/60 max-w-lg mx-auto text-xs md:text-sm tracking-widest uppercase">
              Diamond-Like Carbon (DLC) Monobloc Architecture
            </Typography>
          </div>

          {/* Stage 2 */}
          <div
            className="space-y-4 transition-all duration-500 transform"
            style={{ 
              opacity: stage2Opacity,
              transform: `translateY(${(1 - stage2Opacity) * 20}px)`,
              display: stage2Opacity > 0 ? 'block' : 'none'
            }}
          >
            <Typography variant="displayXL" className="font-light tracking-tight text-white leading-tight font-serif text-4xl md:text-7xl">
              DARKNESS MEETS UNCOMPROMISING PRECISION.
            </Typography>
            <Typography variant="eyebrow" className="text-[#C8B48A] tracking-[0.35em] block text-xs">
              HAND-BEVELED SCHWARZ BRIDGES & SKELETON ROTOR
            </Typography>
          </div>

          {/* Stage 3 */}
          <div
            className="space-y-3 transition-all duration-500 transform"
            style={{ 
              opacity: stage3Opacity,
              transform: `translateY(${(1 - stage3Opacity) * 20}px)`,
              display: stage3Opacity > 0 ? 'block' : 'none'
            }}
          >
            <Typography variant="displayL" className="font-light tracking-tight text-white leading-tight font-serif text-2xl md:text-4xl">
              THE ÉLVARA LEGACY CONTINUES
            </Typography>
            <Typography variant="bodyL" className="text-[#C8B48A] max-w-md mx-auto text-xs tracking-widest uppercase">
              LIMITED MANUFACTURE OF 25 NUMBERED TIMEPIECES
            </Typography>
          </div>
        </Container>

        {/* Bottom Telemetry Footer */}
        <div className="border-t border-white/10 pt-4 flex flex-col md:flex-row justify-between items-center text-[10px] font-mono tracking-widest text-white/50 space-y-3 md:space-y-0">
          {/* Scroll & Frame Counter */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <span className="text-[#C8B48A]">FRAME:</span>
              <span className="text-white font-bold">{formattedFrame} / 120</span>
            </div>
            <div className="w-24 h-[2px] bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#C8B48A] transition-all duration-100"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-[#C8B48A]">PROGRESS:</span>
              <span className="text-white font-bold">{progressPercent}%</span>
            </div>
          </div>

          {/* Caliber Spec Badge */}
          <div className="flex items-center space-x-3 bg-white/5 backdrop-blur-md px-3 py-1.5 rounded border border-white/10 text-white/80">
            <span className="text-[#C8B48A] font-bold">CAL. ÉL-9900 DLC</span>
            <span>|</span>
            <span>OBSIDIAN FINISH</span>
            <span>|</span>
            <span>LIMITED EDITION</span>
          </div>
        </div>

        {/* Corner HUD Crosshairs */}
        <div className="absolute top-4 left-4 w-3 h-3 border-t-2 border-l-2 border-[#C8B48A]/40 pointer-events-none" />
        <div className="absolute top-4 right-4 w-3 h-3 border-t-2 border-r-2 border-[#C8B48A]/40 pointer-events-none" />
        <div className="absolute bottom-4 left-4 w-3 h-3 border-b-2 border-l-2 border-[#C8B48A]/40 pointer-events-none" />
        <div className="absolute bottom-4 right-4 w-3 h-3 border-b-2 border-r-2 border-[#C8B48A]/40 pointer-events-none" />

      </div>
    </div>
  );
};

export default NocturneScene;
