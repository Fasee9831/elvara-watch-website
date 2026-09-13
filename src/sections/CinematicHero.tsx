import React, { useRef, useState, useCallback } from 'react';
import { CinematicFrameSequence, type CameraTransform } from '@/components/CinematicFrameSequence';

/**
 * CinematicHero — Primary Opening Watch Film (AURELIA 1).
 * Driven directly by the 180-frame sequence extracted from AURELIA 1.mp4.
 * 
 * Choreography:
 * Beat 1 (0–22%): Watch establishes from shadow, split typography reveal (ÉLVARA / HAUTE HORLOGERIE)
 * Beat 2 (22–50%): Camera push & rotational movement as openworked architectural calibre explodes into mechanical view
 * Beat 3 (50–78%): Technical micro-telemetry HUD (18K Solid Gold Bridges, 28,800 VPH, Column Wheel)
 * Beat 4 (78–100%): Precision unification into complete stately silhouette, seamless handoff
 */
export const CinematicHero: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef1 = useRef<HTMLDivElement>(null);
  const textRef2 = useRef<HTMLDivElement>(null);
  const textRef3 = useRef<HTMLDivElement>(null);
  const telemetryRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Dynamic camera transform for physical 3D depth across the scroll
  const getCameraTransform = useCallback((progress: number): CameraTransform => {
    if (progress < 0.25) {
      const t = progress / 0.25;
      return {
        scale: 1.0 + t * 0.1,
        y: -t * 8,
      };
    } else if (progress < 0.65) {
      const t = (progress - 0.25) / 0.4;
      return {
        scale: 1.1 + Math.sin(t * Math.PI) * 0.08,
        y: -8 - Math.sin(t * Math.PI) * 12,
      };
    } else {
      const t = (progress - 0.65) / 0.35;
      return {
        scale: 1.1 - t * 0.1,
        y: -8 * (1 - t),
      };
    }
  }, []);

  const handleProgress = useCallback((progress: number) => {
    setScrollProgress(progress);

    // 1. Brand Header (0-28%)
    if (textRef1.current) {
      if (progress < 0.18) {
        textRef1.current.style.opacity = '1';
        textRef1.current.style.transform = 'translate3d(0, 0, 0)';
      } else if (progress < 0.28) {
        const fade = 1 - (progress - 0.18) / 0.10;
        textRef1.current.style.opacity = String(Math.max(0, fade));
        textRef1.current.style.transform = `translate3d(0, ${-(1 - fade) * 30}px, 0)`;
      } else {
        textRef1.current.style.opacity = '0';
      }
    }

    // Scroll indicator: fades smoothly after 8%
    if (scrollIndicatorRef.current) {
      scrollIndicatorRef.current.style.opacity = progress < 0.08 ? '0.75' : '0';
    }

    // 2. Aurelia Architectural Title (22-55%)
    if (textRef2.current) {
      if (progress < 0.22) {
        textRef2.current.style.opacity = '0';
        textRef2.current.style.transform = 'translate3d(0, 25px, 0)';
      } else if (progress < 0.32) {
        const fadeIn = (progress - 0.22) / 0.10;
        textRef2.current.style.opacity = String(fadeIn);
        textRef2.current.style.transform = `translate3d(0, ${(1 - fadeIn) * 25}px, 0)`;
      } else if (progress < 0.45) {
        textRef2.current.style.opacity = '1';
        textRef2.current.style.transform = 'translate3d(0, 0, 0)';
      } else if (progress < 0.55) {
        const fadeOut = 1 - (progress - 0.45) / 0.10;
        textRef2.current.style.opacity = String(Math.max(0, fadeOut));
        textRef2.current.style.transform = `translate3d(0, ${-(1 - fadeOut) * 30}px, 0)`;
      } else {
        textRef2.current.style.opacity = '0';
      }
    }

    // 3. Technical Telemetry Callouts (45-78%)
    if (telemetryRef.current) {
      if (progress < 0.45) {
        telemetryRef.current.style.opacity = '0';
      } else if (progress < 0.55) {
        const fadeIn = (progress - 0.45) / 0.10;
        telemetryRef.current.style.opacity = String(fadeIn);
      } else if (progress < 0.68) {
        telemetryRef.current.style.opacity = '1';
      } else if (progress < 0.78) {
        const fadeOut = 1 - (progress - 0.68) / 0.10;
        telemetryRef.current.style.opacity = String(Math.max(0, fadeOut));
      } else {
        telemetryRef.current.style.opacity = '0';
      }
    }

    // 4. Gold Glow Ambience
    if (glowRef.current) {
      if (progress < 0.25) {
        glowRef.current.style.opacity = '0.08';
      } else if (progress < 0.50) {
        const rise = (progress - 0.25) / 0.25;
        glowRef.current.style.opacity = String(0.08 + rise * 0.35);
      } else if (progress < 0.80) {
        const fall = (progress - 0.50) / 0.30;
        glowRef.current.style.opacity = String(0.43 - fall * 0.3);
      } else {
        glowRef.current.style.opacity = '0.08';
      }
    }

    // 5. Final Climax Tagline (70-100%)
    if (textRef3.current) {
      if (progress < 0.70) {
        textRef3.current.style.opacity = '0';
        textRef3.current.style.transform = 'translate3d(0, 25px, 0)';
      } else if (progress < 0.80) {
        const fadeIn = (progress - 0.70) / 0.10;
        textRef3.current.style.opacity = String(fadeIn);
        textRef3.current.style.transform = `translate3d(0, ${(1 - fadeIn) * 25}px, 0)`;
      } else if (progress < 0.92) {
        textRef3.current.style.opacity = '1';
        textRef3.current.style.transform = 'translate3d(0, 0, 0)';
      } else {
        const fadeOut = 1 - (progress - 0.92) / 0.08;
        textRef3.current.style.opacity = String(Math.max(0, fadeOut));
      }
    }
  }, []);

  return (
    <div ref={sectionRef} className="relative w-full h-[450vh] bg-[#070706]">
      {/* Sticky Fullscreen Viewport */}
      <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center bg-[#070706]">
        {/* Frame Scrubber Canvas using AURELIA 1 (180 frames) */}
        <CinematicFrameSequence
          folderPath="/frames/aurelia-1"
          frameCount={180}
          fallbackImage="/frames/aurelia-1/frame_001.webp"
          triggerRef={sectionRef}
          bgColor="#070706"
          accentColor="rgba(212, 175, 55, 0.4)"
          objectFit="cover"
          dynamicTransform={getCameraTransform}
          onUpdateProgress={handleProgress}
        />

        {/* Cinematic Studio Radial Glow & Vignette (Harmonized with #070706) */}
        <div
          ref={glowRef}
          className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-500"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, rgba(212, 175, 55, 0.10) 0%, rgba(212, 175, 55, 0.02) 50%, rgba(7,7,6,0.85) 100%)',
          }}
        />

        {/* Atmospheric Top & Bottom Seamless Shading */}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#070706] via-[#070706]/80 to-transparent pointer-events-none z-15" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#070706] via-[#070706]/80 to-transparent pointer-events-none z-15" />

        {/* Cinematic HUD & Overlays */}
        <div className="hero-hud-container pointer-events-none">
          {/* Top HUD: Coordinates & Chapter */}
          <div className="hero-secondary-bar text-xs font-metadata tracking-[0.25em]">
            <div className="hero-secondary-badge">
              <span className="inline-block w-2 h-2 rounded-full bg-[var(--color-accent)] animate-pulse flex-shrink-0" />
              <span className="text-[var(--color-text-primary)] font-medium whitespace-nowrap">46°12′09″N 6°09′28″E</span>
              <span className="text-white/20">•</span>
              <span className="whitespace-nowrap">GENÈVE</span>
            </div>
            <div className="hero-secondary-badge">
              <span className="text-[var(--color-accent)] font-semibold whitespace-nowrap">CHAPTER I</span>
              <span className="text-white/30">•</span>
              <span className="whitespace-nowrap">ARCHITECTURE & CALIBRE</span>
            </div>
          </div>

          {/* Center Stage: Split Line Headlines */}
          <div className="relative flex-1 flex flex-col items-center justify-center">
            {/* BEAT 1: Brand Wordmark with Deep Contrast Protection (0-28%) */}
            <div
              ref={textRef1}
              className="hero-center-backdrop flex flex-col items-center text-center transition-transform duration-100 ease-out max-w-4xl px-4"
            >
              <div className="flex items-center space-x-3 mb-4">
                <span className="h-[1px] w-8 bg-[var(--color-accent)]/50" />
                <span className="hero-subheading">
                  MANUFACTURE DE HAUTE HORLOGERIE
                </span>
                <span className="h-[1px] w-8 bg-[var(--color-accent)]/50" />
              </div>

              <h1 className="hero-brand-title mb-4">
                ÉLVARA
              </h1>

              {/* Ultra-Minimalist Technical Inscription */}
              <div className="technical-inscription">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] animate-pulse flex-shrink-0" />
                <p className="technical-inscription-text">
                  CALIBRE 02-AU <span className="technical-inscription-bullet">•</span> 18K SOLID GOLD ARCHITECTURE
                </p>
              </div>
            </div>

            {/* BEAT 2: Aurelia Architectural Title & Exploded View Features (22-55%) */}
            <div
              ref={textRef2}
              className="relative flex flex-col items-center text-center transition-transform duration-100 ease-out max-w-4xl px-4 w-full"
              style={{ opacity: 0 }}
            >
              {/* Deep Background Watermark (Pushed behind watch visuals) */}
              <h2 className="aurelia-watermark font-cinzel font-light tracking-[0.2em] text-6xl sm:text-8xl md:text-9xl text-gold-bright">
                AURELIA
              </h2>

              <div className="glass-pill-luxury px-5 py-1.5 mb-5 rounded-md">
                <span className="font-eyebrow text-[var(--color-accent)] tracking-[0.35em] text-[0.68rem]">
                  THE OPENWORKED CALIBRE
                </span>
              </div>

              {/* Ultra-Sheer Horizontal Feature Badge Strip */}
              <div className="feature-glass-strip">
                <span className="feature-strip-item">
                  18K SOLID GOLD BRIDGES
                </span>
                <span className="feature-strip-bullet">•</span>
                <span className="feature-strip-item">
                  HAND-CHAMFERED ANGLAGE
                </span>
                <span className="feature-strip-bullet">•</span>
                <span className="feature-strip-item">
                  CÔTES DE GENÈVE
                </span>
              </div>
            </div>

            {/* BEAT 3: Horological Telemetry Grid (45-78%) - Floating Paired Spec Cards */}
            <div
              ref={telemetryRef}
              className="floating-card-container transition-opacity duration-300"
              style={{ opacity: 0 }}
            >
              {/* Left Telemetry Card */}
              <div className="spec-card spec-card-left">
                <span className="spec-eyebrow flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
                  PRECISION MECHANICS
                </span>

                <div>
                  <span className="spec-metric">28,800 VPH (4.0 Hz)</span>
                  <p className="spec-subtext">Continuous sweeping seconds gliding with zero stutter across the dial.</p>
                </div>

                <div className="pt-3 border-t border-white/10">
                  <span className="spec-metric text-[var(--color-accent)]">COSC ± 1.5s / 24h</span>
                  <p className="spec-subtext mb-0">Independently certified for unyielding atomic chronometer accuracy.</p>
                </div>
              </div>

              {/* Right Telemetry Card */}
              <div className="spec-card spec-card-right">
                <span className="spec-eyebrow flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse flex-shrink-0" />
                  HANDMADE ARCHITECTURE
                </span>

                <div>
                  <span className="spec-metric">198 Hand-Polished Parts</span>
                  <p className="spec-subtext">Sculpted in 18K solid yellow gold with 33 synthetic ruby bearings.</p>
                </div>

                <div className="pt-3 border-t border-white/10">
                  <span className="spec-metric text-[var(--color-accent)]">Geneva Seal Registered</span>
                  <p className="spec-subtext mb-0">Hand-chamfered anglage and bespoke Côtes de Genève finishing.</p>
                </div>
              </div>
            </div>

            {/* BEAT 4: Climax Statement (70-100%) */}
            <div
              ref={textRef3}
              className="absolute flex flex-col items-center text-center transition-transform duration-100 ease-out max-w-2xl px-4 pointer-events-none"
              style={{ opacity: 0 }}
            >
              <div className="bg-[#070706]/90 backdrop-blur-2xl border border-white/15 px-6 sm:px-10 py-5 sm:py-7 rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.15)] flex flex-col items-center">
                {/* Eyebrow Pill */}
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[var(--color-accent)]/15 border border-[var(--color-accent)]/40 mb-3 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] animate-pulse" />
                  <span className="font-metadata text-[0.58rem] sm:text-[0.64rem] text-gold-bright tracking-[0.28em] font-semibold uppercase">
                    THE ART OF TIME
                  </span>
                </div>

                {/* Main High-Contrast Statement */}
                <p className="text-white tracking-[0.02em] font-light leading-relaxed mb-4 font-cinzel text-xl sm:text-2xl md:text-3xl italic text-shadow-cinematic max-w-xl">
                  "Time isn’t just measured by hands on a clock. It is felt in <span className="text-gold-gradient font-normal not-italic">every handcrafted gear</span>."
                </p>

                {/* Edition Pill Badge */}
                <div className="inline-flex items-center space-x-2.5 bg-black/85 border border-white/20 px-4 py-1.5 rounded-full shadow-lg pointer-events-auto">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
                  <span className="font-metadata text-[0.55rem] sm:text-[0.62rem] text-white tracking-[0.22em] font-medium uppercase">
                    ÉLVARA AURELIA <span className="text-[var(--color-accent)]">•</span> N° 02 / 09
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom HUD: Progress Scrubber Bar & Frame Counter */}
          <div className="flex justify-between items-end w-full px-3 xs:px-4 sm:px-[4vw] max-w-[1600px] mx-auto box-border gap-2">
            {/* Real-time perspective counter */}
            <div className="bg-black/60 backdrop-blur-2xl px-3 sm:px-5 py-1.5 sm:py-2.5 border border-white/10 rounded-xl sm:rounded-2xl shadow-xl">
              <span className="font-metadata text-[0.48rem] sm:text-[0.62rem] text-[var(--color-text-muted)] tracking-wider sm:tracking-[0.2em] block">
                ATELIER PERSPECTIVE
              </span>
              <div className="font-mono-num text-xs sm:text-sm text-[var(--color-text-primary)] font-medium">
                <span className="text-[var(--color-accent)] font-semibold">
                  {String(Math.min(180, Math.max(1, Math.round(scrollProgress * 179) + 1))).padStart(3, '0')}°
                </span>
                <span className="text-white/30"> / 180°</span>
              </div>
            </div>

            {/* Center Exploration Prompt */}
            <div
              ref={scrollIndicatorRef}
              className="hidden sm:flex flex-col items-center transition-opacity duration-500 bg-black/50 backdrop-blur-2xl px-6 py-2.5 border border-white/10 rounded-full shadow-lg"
            >
              <span className="font-metadata text-[var(--color-text-secondary)] tracking-[0.3em] text-[0.6rem] mb-1 uppercase">
                EXPLORE TIMEPIECE
              </span>
              <div className="w-[1px] h-6 bg-gradient-to-b from-[var(--color-accent)] to-transparent animate-pulse" />
            </div>

            {/* Calibre Reference Code */}
            <div className="bg-black/60 backdrop-blur-2xl px-3 sm:px-5 py-1.5 sm:py-2.5 border border-white/10 rounded-xl sm:rounded-2xl text-right shadow-xl">
              <span className="font-metadata text-[0.48rem] sm:text-[0.62rem] text-[var(--color-text-muted)] tracking-wider sm:tracking-[0.2em] block">
                CALIBRE REF.
              </span>
              <span className="font-mono-num text-[0.52rem] sm:text-xs text-[var(--color-accent)] font-medium tracking-widest whitespace-nowrap">
                CAL. 02-AU GOLD
              </span>
            </div>
          </div>
        </div>

        {/* Seamless Scene Departure Vignette */}
        <div
          className="absolute bottom-0 inset-x-0 h-48 z-15 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, transparent 0%, rgba(7, 7, 6, 0.7) 50%, #070706 100%)',
          }}
        />
      </div>
    </div>
  );
};

export default CinematicHero;
