import React, { useEffect, useRef, useState, useCallback } from 'react';
import { isReducedMotionPreferred } from '@/animations/presets';

interface Particle {
  x: number;
  y: number;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  charIndex: number;
  size: number;
  alpha: number;
  targetAlpha: number;
  color: string;
  depth: number;
  delay: number;
  curlFreq: number;
  curlAmp: number;
  curlPhase: number;
  sparkleSpeed: number;
  sparklePhase: number;
  isInitialSpark: boolean;
}

interface AmbientDust {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  size: number;
  alpha: number;
  color: string;
  depth: number;
  driftSpeedX: number;
  driftSpeedY: number;
  driftPhase: number;
}

interface GoldStardustLogoProps {
  progress?: number;
  onReady?: () => void;
  onAnimationComplete?: () => void;
  className?: string;
}

// Refined champagne, atelier gold, and specular micro-sparkle palette
const GOLD_PALETTE = [
  '#FFFDF8', // Specular micro-sparkle
  '#F7E7CE', // Pale refined champagne
  '#E8C88B', // Soft luminous atelier gold
  '#DFC27D', // Pure horlogerie gold
  '#C5A059', // Warm satin amber gold
  '#E5C378', // Warm champagne gold
];

export const GoldStardustLogo: React.FC<GoldStardustLogoProps> = ({
  progress = 0,
  onReady,
  onAnimationComplete,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const animationFrameId = useRef<number | null>(null);
  const isCompleteRef = useRef(false);

  // Fallback state if canvas cannot render or reduced motion
  const [showSolidLogo, setShowSolidLogo] = useState(() => isReducedMotionPreferred());
  const [solidOpacity, setSolidOpacity] = useState(() => (isReducedMotionPreferred() ? 1 : 0));
  const [shimmerProgress, setShimmerProgress] = useState(0);

  const handleComplete = useCallback(() => {
    if (!isCompleteRef.current) {
      isCompleteRef.current = true;
      onAnimationComplete?.();
    }
  }, [onAnimationComplete]);

  useEffect(() => {
    if (isReducedMotionPreferred()) {
      setShowSolidLogo(true);
      setSolidOpacity(1);
      onReady?.();
      handleComplete();
      return;
    }

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) {
      setShowSolidLogo(true);
      setSolidOpacity(1);
      onReady?.();
      handleComplete();
      return;
    }

    let isMounted = true;
    let particles: Particle[] = [];
    let ambientDust: AmbientDust[] = [];

    const initSequence = async () => {
      // 1. Wait for typography to ensure exact Cinzel serif contours
      if (document.fonts) {
        try {
          await Promise.race([
            document.fonts.load('48px "Cinzel"'),
            document.fonts.ready,
            new Promise((res) => setTimeout(res, 400)),
          ]);
        } catch {
          // Fallback gracefully on font timeout
        }
      }

      if (!isMounted) return;

      const rect = container.getBoundingClientRect();
      const width = Math.max(rect.width || 400, 320);
      const height = Math.max(rect.height || 110, 90);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);

      // Measure computed typography styles from reference element
      let computedFontSize = 48;
      let computedLetterSpacing = 16;
      if (textRef.current) {
        const style = window.getComputedStyle(textRef.current);
        const parsedSize = parseFloat(style.fontSize);
        if (!isNaN(parsedSize) && parsedSize > 12) computedFontSize = parsedSize;
        const parsedSpacing = parseFloat(style.letterSpacing);
        if (!isNaN(parsedSpacing) && parsedSpacing > 0) computedLetterSpacing = parsedSpacing;
      } else {
        const isMobile = window.innerWidth < 640;
        computedFontSize = isMobile ? 33 : Math.min(50, Math.max(36, width * 0.12));
        computedLetterSpacing = computedFontSize * 0.34;
      }

      // 2. Offscreen canvas to sample ÉLVARA serif letterforms
      const offCanvas = document.createElement('canvas');
      offCanvas.width = width;
      offCanvas.height = height;
      const offCtx = offCanvas.getContext('2d', { willReadFrequently: true });

      if (!offCtx) {
        setShowSolidLogo(true);
        setSolidOpacity(1);
        onReady?.();
        handleComplete();
        return;
      }

      const textChars = ['É', 'L', 'V', 'A', 'R', 'A'];
      offCtx.fillStyle = '#FFFFFF';
      offCtx.font = `${Math.round(computedFontSize)}px 'Cinzel', 'Cormorant Garamond', Georgia, serif`;
      offCtx.textAlign = 'left';
      offCtx.textBaseline = 'middle';

      const charWidths = textChars.map((c) => offCtx.measureText(c).width);
      const totalTextWidth =
        charWidths.reduce((a, b) => a + b, 0) + (textChars.length - 1) * computedLetterSpacing;
      let curX = (width - totalTextWidth) / 2;
      const centerY = height / 2;

      const charRanges: { charIdx: number; startX: number; endX: number }[] = [];
      textChars.forEach((c, idx) => {
        const w = charWidths[idx];
        offCtx.fillText(c, curX, centerY);
        charRanges.push({
          charIdx: idx,
          startX: curX - 2,
          endX: curX + w + 2,
        });
        curX += w + computedLetterSpacing;
      });

      // Sample raster pixels with fine horlogerie fidelity
      const imgData = offCtx.getImageData(0, 0, width, height);
      const data = imgData.data;
      const targetPoints: { x: number; y: number; charIdx: number; edgeWeight: number }[] = [];
      const sampleStep = 2;

      for (let y = 0; y < height; y += sampleStep) {
        for (let x = 0; x < width; x += sampleStep) {
          const index = (y * width + x) * 4;
          const alpha = data[index + 3];
          if (alpha > 45) {
            let charIdx = 0;
            for (let i = 0; i < charRanges.length; i++) {
              if (x >= charRanges[i].startX && x <= charRanges[i].endX) {
                charIdx = i;
                break;
              }
            }

            const isEdge = alpha < 200;
            const edgeWeight = isEdge ? 1.25 : 0.95;
            targetPoints.push({ x, y, charIdx, edgeWeight });
          }
        }
      }

      if (targetPoints.length === 0) {
        setShowSolidLogo(true);
        setSolidOpacity(1);
        onReady?.();
        handleComplete();
        return;
      }

      // 3. Build Delicate Micro-Stardust Particle Field
      const isMobile = window.innerWidth < 640;
      const maxParticles = isMobile ? 550 : 900;
      const step = Math.max(1, Math.floor(targetPoints.length / maxParticles));
      const selectedPoints = targetPoints.filter((_, i) => i % step === 0);

      const centerX = width / 2;

      particles = selectedPoints.map((pt, i) => {
        const depth = 0.6 + Math.random() * 0.8;
        const angle = Math.random() * Math.PI * 2;
        const dist = 45 + Math.random() * (isMobile ? 120 : 180);
        const originX = centerX + Math.cos(angle) * dist + (Math.random() - 0.5) * 50;
        const originY = centerY + Math.sin(angle) * (dist * 0.55) + (Math.random() - 0.5) * 35;

        // Progressive harmonic assembly wave from left ('É') to right ('A')
        const letterDelay = (pt.charIdx / 5) * 0.45;
        const randomDelay = Math.random() * 0.35;
        const totalDelay = letterDelay + randomDelay;

        // Initial cluster of sparks in Phase 1 (0.0s - 0.6s)
        const isInitialSpark = i < (isMobile ? 25 : 40);

        return {
          x: originX,
          y: originY,
          startX: originX,
          startY: originY,
          targetX: pt.x,
          targetY: pt.y,
          charIndex: pt.charIdx,
          // Refined delicate particle radius
          size: (0.75 + Math.random() * 0.95) * pt.edgeWeight * Math.min(1.15, depth),
          alpha: 0,
          targetAlpha: 0.75 + Math.random() * 0.25,
          color: GOLD_PALETTE[Math.floor(Math.random() * GOLD_PALETTE.length)],
          depth,
          delay: totalDelay,
          curlFreq: 1.2 + Math.random() * 2.0,
          curlAmp: (14 + Math.random() * 26) * (Math.random() > 0.5 ? 1 : -1),
          curlPhase: Math.random() * Math.PI * 2,
          sparkleSpeed: 2.2 + Math.random() * 3.5,
          sparklePhase: Math.random() * Math.PI * 2,
          isInitialSpark,
        };
      });

      // 4. Subtle Ambient Floating Dust Motes
      const ambientCount = isMobile ? 25 : 45;
      ambientDust = Array.from({ length: ambientCount }).map(() => {
        const depth = 0.5 + Math.random() * 0.9;
        const bx = Math.random() * width;
        const by = Math.random() * height;
        return {
          x: bx,
          y: by,
          baseX: bx,
          baseY: by,
          size: (0.55 + Math.random() * 0.85) * depth,
          alpha: 0.2 + Math.random() * 0.35,
          color: GOLD_PALETTE[Math.floor(Math.random() * GOLD_PALETTE.length)],
          depth,
          driftSpeedX: (Math.random() - 0.5) * 0.12,
          driftSpeedY: (Math.random() - 0.5) * 0.08,
          driftPhase: Math.random() * Math.PI * 2,
        };
      });

      // Signal readiness
      onReady?.();

      // 5. Cinematic Orchestrated Animation Loop
      const animStartTime = performance.now();

      const render = (now: number) => {
        if (!isMounted) return;

        const elapsed = (now - animStartTime) / 1000;
        ctx.clearRect(0, 0, width, height);

        const emergenceStart = 0.55;
        const convergenceStart = 1.45;
        const convergenceDuration = 1.25;
        const solidStart = 3.25;
        const solidDuration = 0.55;
        const shimmerStart = 3.75;
        const shimmerDuration = 0.5;

        // Solid wordmark opacity blend (settles into clean vector typography)
        if (elapsed > solidStart) {
          const sProgress = Math.min(1, (elapsed - solidStart) / solidDuration);
          const easedSolid = 1 - Math.pow(1 - sProgress, 2.8);
          setSolidOpacity(easedSolid);
        }

        // Shimmer sweep progression across polished gold
        if (elapsed > shimmerStart) {
          const shProg = Math.min(1, (elapsed - shimmerStart) / shimmerDuration);
          setShimmerProgress(shProg);
        }

        // Signal completion when full sequence settles
        if (elapsed >= shimmerStart + shimmerDuration && !isCompleteRef.current) {
          handleComplete();
        }

        // 1. Render Ambient Depth Dust
        for (let i = 0; i < ambientDust.length; i++) {
          const amb = ambientDust[i];
          const ambEmergence = Math.min(1, elapsed / 0.7);
          amb.driftPhase += 0.015;
          amb.x = amb.baseX + Math.cos(amb.driftPhase) * 6 * amb.depth + amb.driftSpeedX * elapsed * 20;
          amb.y = amb.baseY + Math.sin(amb.driftPhase * 0.8) * 4 * amb.depth + amb.driftSpeedY * elapsed * 20;

          if (amb.x < 0) amb.baseX += width;
          if (amb.x > width) amb.baseX -= width;
          if (amb.y < 0) amb.baseY += height;
          if (amb.y > height) amb.baseY -= height;

          const currentAlpha =
            amb.alpha *
            ambEmergence *
            (elapsed > solidStart + 0.3 ? Math.max(0, 1 - (elapsed - solidStart - 0.3) / 0.7) : 1);

          if (currentAlpha > 0.01) {
            ctx.save();
            ctx.globalAlpha = currentAlpha;
            ctx.fillStyle = amb.color;
            if (amb.depth > 0.88) {
              ctx.shadowColor = 'rgba(232, 200, 139, 0.4)';
              ctx.shadowBlur = 2.5 * amb.depth;
            }
            ctx.beginPath();
            ctx.arc(amb.x, amb.y, amb.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        }

        // 2. Render Stardust Logo Particles
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];

          if (elapsed < convergenceStart + p.delay) {
            // Phase 1 (0.0s–0.6s) & Phase 2 (0.6s–1.5s): Emergence & Orbital Drift
            if (elapsed < emergenceStart) {
              if (p.isInitialSpark) {
                const sparkProg = Math.min(1, elapsed / emergenceStart);
                const sparkPulse = Math.sin(elapsed * 4 + p.sparklePhase) * 0.18;
                p.alpha = Math.max(0, (0.35 + sparkPulse) * sparkProg);
              } else {
                p.alpha = 0;
              }
            } else {
              const emergeTime = elapsed - emergenceStart;
              const emergeProgress = Math.min(1, emergeTime / 0.7);
              const sparkPulse = Math.sin(elapsed * p.sparkleSpeed + p.sparklePhase) * 0.12;
              p.alpha = Math.min(1, (p.targetAlpha + sparkPulse) * (0.3 + emergeProgress * 0.7));
            }

            const hoverAngle = p.curlPhase + elapsed * 0.85;
            p.x = p.startX + Math.cos(hoverAngle) * 5 * p.depth;
            p.y = p.startY + Math.sin(hoverAngle * 0.8) * 3.5 * p.depth;
          } else {
            // Phase 3 (1.5s–2.5s) & Phase 4 (2.5s–3.3s): Magnetic Pull & Assembly
            const convTime = elapsed - convergenceStart - p.delay;
            const convProgress = Math.min(1, Math.max(0, convTime / convergenceDuration));

            const ease = 1 - Math.pow(1 - convProgress, 3.2);

            const curveDamp = Math.sin(convProgress * Math.PI) * (1 - ease * 0.9);
            const curlX = Math.sin(convProgress * Math.PI * p.curlFreq + p.curlPhase) * p.curlAmp * curveDamp;
            const curlY = Math.cos(convProgress * Math.PI * p.curlFreq + p.curlPhase) * (p.curlAmp * 0.6) * curveDamp;

            const dx = p.targetX - p.startX;
            const dy = p.targetY - p.startY;

            p.x = p.startX + dx * ease + curlX;
            p.y = p.startY + dy * ease + curlY;

            const sparkle = Math.sin(elapsed * p.sparkleSpeed + p.sparklePhase) * 0.16;

            if (elapsed > solidStart) {
              // Phase 5: Fade particles completely as vector wordmark takes over cleanly
              const fadeProg = Math.min(1, (elapsed - solidStart) / (solidDuration * 0.75));
              p.alpha = Math.max(0, (p.targetAlpha + sparkle) * (1 - fadeProg));
            } else {
              p.alpha = Math.min(1, Math.max(0, (p.targetAlpha + sparkle) * (0.65 + ease * 0.35)));
            }
          }

          if (p.alpha > 0.01) {
            ctx.save();
            ctx.globalAlpha = p.alpha;
            ctx.fillStyle = p.color;

            // Restrained champagne-gold glow
            if (p.depth > 0.85) {
              ctx.shadowColor = 'rgba(232, 200, 139, 0.45)';
              ctx.shadowBlur = 3 * p.depth;
            }

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        }

        if (elapsed < shimmerStart + shimmerDuration + 0.8 || !isCompleteRef.current) {
          animationFrameId.current = requestAnimationFrame(render);
        }
      };

      animationFrameId.current = requestAnimationFrame(render);
    };

    initSequence();

    return () => {
      isMounted = false;
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
    };
  }, [handleComplete, onReady]);

  // Shimmer highlight position across the ÉLVARA wordmark
  const shimmerLeft =
    shimmerProgress > 0 && shimmerProgress <= 1
      ? Math.round(shimmerProgress * 140 - 20)
      : -100;

  return (
    <div
      ref={containerRef}
      className={`relative flex items-center justify-center select-none w-full ${className}`}
      style={{ minHeight: '4.25rem' }}
    >
      {/* 1. Hardware-Accelerated Stardust Assembly Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-10 block w-full h-full"
        style={{
          opacity: showSolidLogo ? 0 : 1,
          transition: 'opacity 0.4s ease-out',
        }}
      />

      {/* 2. Exact ÉLVARA Vector Typography (Settles with Polished Metallic Finish) */}
      <h1
        ref={textRef}
        className="preloader-brand relative z-20"
        style={{
          opacity: showSolidLogo ? 1 : solidOpacity,
          transform: `scale(${0.99 + (progress / 100) * 0.01})`,
          transition: 'transform 0.3s ease-out',
          color: '#F8F6F0',
          textShadow: '0 2px 24px rgba(229, 195, 120, 0.15)',
        }}
      >
        ÉLVARA

        {/* 3. Refined Specular Metallic Light Sweep Across Polished Gold */}
        {shimmerProgress > 0 && shimmerProgress <= 1 && (
          <span
            className="absolute inset-0 pointer-events-none overflow-hidden select-none"
            aria-hidden="true"
          >
            <span
              className="absolute inset-0 block"
              style={{
                backgroundImage: `linear-gradient(90deg, transparent 0%, rgba(255, 246, 214, 0) ${Math.max(0, shimmerLeft - 25)}%, rgba(255, 252, 240, 0.95) ${shimmerLeft}%, rgba(229, 195, 120, 0.45) ${shimmerLeft + 12}%, transparent ${Math.min(100, shimmerLeft + 30)}%)`,
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mixBlendMode: 'plus-lighter',
              }}
            >
              ÉLVARA
            </span>
          </span>
        )}
      </h1>
    </div>
  );
};

export default GoldStardustLogo;
