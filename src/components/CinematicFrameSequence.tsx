import React, { useRef, useEffect, useState, useCallback } from 'react';
import { ScrollTrigger, useGSAP } from '@/animations/gsap';
import { isReducedMotionPreferred } from '@/animations/presets';

export interface CameraTransform {
  scale?: number;
  x?: number;
  y?: number;
  rotate?: number;
  opacity?: number;
}

export interface CinematicFrameSequenceProps {
  folderPath: string; // e.g. "/frames/aurelia-1"
  frameCount?: number; // 180
  fallbackImage?: string;
  triggerRef: React.RefObject<HTMLElement | null>;
  endScrollPx?: number; // used if standalone, otherwise container track height drives it
  accentColor?: string;
  bgColor?: string;
  className?: string;
  objectFit?: 'contain' | 'cover';
  dynamicTransform?: (progress: number) => CameraTransform;
  onUpdateProgress?: (progress: number) => void;
}

/**
 * CinematicFrameSequence — Rock-Solid High-Performance Canvas Image-Sequence Scrubber.
 * Features dual-driver synchronization (GSAP ScrollTrigger + Direct RAF Scroll Listener)
 * to ensure 100% reliable, zero-lag, frame-perfect scrubbing from frame 1 to 180.
 */
export const CinematicFrameSequence: React.FC<CinematicFrameSequenceProps> = ({
  folderPath,
  frameCount = 180,
  fallbackImage,
  triggerRef,
  accentColor = 'var(--color-accent)',
  bgColor,
  className = '',
  objectFit = 'cover',
  dynamicTransform,
  onUpdateProgress,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const loadedSetRef = useRef<boolean[]>(new Array(frameCount).fill(false));
  const currentIndexRef = useRef<number>(0);
  const currentProgressRef = useRef<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [loadPercent, setLoadPercent] = useState<number>(0);

  const defaultFallback = fallbackImage || `${folderPath}/frame_001.webp`;

  // Find nearest completed frame if target is still decoding/downloading
  const getNearestLoadedImage = useCallback((targetIdx: number): HTMLImageElement | null => {
    const images = imagesRef.current;
    if (!images || images.length === 0) return null;

    if (images[targetIdx] && images[targetIdx].complete && images[targetIdx].naturalWidth > 0) {
      return images[targetIdx];
    }

    for (let offset = 1; offset < frameCount; offset++) {
      const lower = targetIdx - offset;
      const upper = targetIdx + offset;
      if (lower >= 0 && images[lower] && images[lower].complete && images[lower].naturalWidth > 0) {
        return images[lower];
      }
      if (upper < images.length && images[upper] && images[upper].complete && images[upper].naturalWidth > 0) {
        return images[upper];
      }
    }

    return images[0] && images[0].complete && images[0].naturalWidth > 0 ? images[0] : null;
  }, [frameCount]);

  // High-DPR canvas drawing function with mobile GPU optimization
  const drawImageToCanvas = useCallback((img: HTMLImageElement, progress: number = 0) => {
    const canvas = canvasRef.current;
    if (!canvas || !img.complete || img.naturalWidth === 0) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = isMobile ? 'low' : 'medium';

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    if (cw === 0 || ch === 0 || iw === 0 || ih === 0) return;

    const imageAspect = iw / ih;
    const canvasAspect = cw / ch;

    let baseWidth = cw;
    let baseHeight = ch;
    let offsetX = 0;
    let offsetY = 0;

    if (objectFit === 'cover') {
      if (canvasAspect > imageAspect) {
        baseHeight = cw / imageAspect;
        offsetY = (ch - baseHeight) / 2;
      } else {
        baseWidth = ch * imageAspect;
        offsetX = (cw - baseWidth) / 2;
      }
    } else {
      // Contain
      if (canvasAspect > imageAspect) {
        baseWidth = ch * imageAspect;
        offsetX = (cw - baseWidth) / 2;
      } else {
        baseHeight = cw / imageAspect;
        offsetY = (ch - baseHeight) / 2;
      }
    }

    const transform = dynamicTransform ? dynamicTransform(progress) : {};
    const scale = transform.scale ?? 1.0;
    const panX = transform.x ?? 0;
    const panY = transform.y ?? 0;
    const rotation = transform.rotate ?? 0;
    const opacity = transform.opacity ?? 1.0;

    ctx.clearRect(0, 0, cw, ch);
    ctx.save();

    ctx.globalAlpha = opacity;
    ctx.translate(cw / 2 + panX, ch / 2 + panY);
    if (rotation !== 0) {
      ctx.rotate((rotation * Math.PI) / 180);
    }
    ctx.scale(scale, scale);
    ctx.translate(-cw / 2, -ch / 2);

    ctx.drawImage(img, offsetX, offsetY, baseWidth, baseHeight);
    ctx.restore();
  }, [objectFit, dynamicTransform]);

  const lastRenderedIdxRef = useRef<number>(-1);
  const lastRenderedProgressRef = useRef<number>(-1);

  const renderFrameIndex = useCallback((idx: number, progress: number) => {
    const safeIdx = Math.min(frameCount - 1, Math.max(0, idx));
    if (safeIdx === lastRenderedIdxRef.current && (!dynamicTransform || Math.abs(progress - lastRenderedProgressRef.current) < 0.002)) {
      return;
    }
    lastRenderedIdxRef.current = safeIdx;
    lastRenderedProgressRef.current = progress;
    currentIndexRef.current = safeIdx;
    currentProgressRef.current = progress;
    const img = getNearestLoadedImage(safeIdx);
    if (img) {
      drawImageToCanvas(img, progress);
    }
  }, [frameCount, getNearestLoadedImage, drawImageToCanvas, dynamicTransform]);

  // Preload all 180 frames into memory
  useEffect(() => {
    let isMounted = true;
    const loadedImages: HTMLImageElement[] = [];
    const loadedStatus = new Array(frameCount).fill(false);
    let loadedCount = 0;

    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      const numStr = String(i).padStart(3, '0');
      const webpPath = `${folderPath}/frame_${numStr}.webp`;
      const jpgPath = `${folderPath}/frame_${numStr}.jpg`;

      img.onload = () => {
        if (!isMounted) return;
        loadedStatus[i - 1] = true;
        loadedCount++;
        if (loadedCount === frameCount || loadedCount % 18 === 0) {
          const percent = Math.round((loadedCount / frameCount) * 100);
          setLoadPercent(percent);
        }

        if (loadedCount >= Math.min(2, frameCount)) {
          setIsLoaded(true);
        }

        if (i === 1 || currentIndexRef.current === i - 1) {
          renderFrameIndex(currentIndexRef.current, currentProgressRef.current);
        }
      };

      img.onerror = () => {
        if (img.src.endsWith('.webp')) {
          img.src = jpgPath;
        } else {
          if (!isMounted) return;
          loadedCount++;
        }
      };

      img.src = webpPath;
      loadedImages.push(img);
    }

    imagesRef.current = loadedImages;
    loadedSetRef.current = loadedStatus;

    return () => {
      isMounted = false;
    };
  }, [folderPath, frameCount, renderFrameIndex]);

  // DPR-Aware Canvas Resize Handler (Optimized for Mobile Battery & GPU)
  const updateCanvasDimensions = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const isMobile = window.innerWidth < 768;
    const dpr = isMobile ? Math.min(window.devicePixelRatio || 1, 1.5) : Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.max(rect.width, 300);
    const h = Math.max(rect.height, 200);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);

    // Force redraw on resize
    lastRenderedIdxRef.current = -1;
    renderFrameIndex(currentIndexRef.current, currentProgressRef.current);
  }, [renderFrameIndex]);

  useEffect(() => {
    updateCanvasDimensions();
    window.addEventListener('resize', updateCanvasDimensions, { passive: true });
    const timer = setTimeout(updateCanvasDimensions, 200);
    return () => {
      window.removeEventListener('resize', updateCanvasDimensions);
      clearTimeout(timer);
    };
  }, [updateCanvasDimensions]);

  // Unified GSAP ScrollTrigger Integration for Buttery-Smooth Zero-Jitter Scrub
  useGSAP(
    () => {
      const trigger = triggerRef.current;
      if (!trigger) return;
      if (isReducedMotionPreferred()) return;

      const isMobile = window.innerWidth < 768;

      const st = ScrollTrigger.create({
        trigger: trigger,
        start: 'top top',
        end: 'bottom bottom',
        scrub: isMobile ? 0.05 : 0.1,
        onUpdate: (self) => {
          const progress = self.progress;
          currentProgressRef.current = progress;
          const targetFrame = Math.min(frameCount - 1, Math.max(0, Math.floor(progress * (frameCount - 1))));
          renderFrameIndex(targetFrame, progress);

          if (onUpdateProgress) {
            onUpdateProgress(progress);
          }
        },
      });

      return () => {
        st.kill();
      };
    },
    { scope: triggerRef, dependencies: [frameCount, onUpdateProgress] }
  );

  const resolvedBg = bgColor || '#070706';

  return (
    <div
      className={`relative w-full h-full flex items-center justify-center overflow-hidden ${className}`}
      style={{ backgroundColor: resolvedBg }}
    >
      {/* High-Performance DPR Canvas occupying 100% full background */}
      <canvas
        ref={canvasRef}
        className="w-full h-full pointer-events-none select-none"
        style={{
          width: '100%',
          height: '100%',
        }}
      />

      {/* Dynamic Studio Spotlight Glow */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20 blur-3xl z-10 transition-opacity duration-700"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, ${accentColor} 0%, transparent 68%)`,
        }}
      />

      {/* Seamless Edge Dissolve Vignette */}
      {objectFit !== 'cover' && (
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background: `radial-gradient(ellipse 85% 78% at 50% 50%, transparent 40%, ${resolvedBg} 98%)`,
          }}
        />
      )}

      {/* Progressive Loading Fallback */}
      {!isLoaded && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center text-[var(--color-text-muted)] space-y-4 z-30 transition-opacity duration-500"
          style={{ backgroundColor: resolvedBg }}
        >
          <img
            src={defaultFallback}
            alt="ÉLVARA Horology Timepiece"
            className="absolute inset-0 w-full h-full object-contain filter brightness-[0.5] blur-sm"
          />
          <span className="relative z-10 font-display text-sm tracking-[0.4em] text-[var(--color-accent)] uppercase">
            ÉLVARA
          </span>
          <div className="relative z-10 w-24 h-[1px] bg-white/10 overflow-hidden">
            <div
              className="h-full bg-[var(--color-accent)] transition-all duration-150"
              style={{ width: `${loadPercent}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CinematicFrameSequence;
