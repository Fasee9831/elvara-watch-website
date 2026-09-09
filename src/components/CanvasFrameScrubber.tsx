import React, { useRef, useEffect, useState, useCallback } from 'react';
import { gsap, useGSAP } from '@/animations/gsap';
import { isReducedMotionPreferred } from '@/animations/presets';

export interface CameraTransform {
  scale?: number;
  x?: number; // percentage or px
  y?: number;
  rotate?: number;
  opacity?: number;
}

export interface CanvasFrameScrubberProps {
  folderPath: string; // e.g. "/frames/nocturne"
  frameCount?: number; // 180
  fallbackImage?: string;
  triggerRef: React.RefObject<HTMLDivElement | null>;
  endScrollPx?: number; // 4800
  accentColor?: string;
  className?: string;
  dynamicTransform?: (progress: number) => CameraTransform;
  onUpdateProgress?: (progress: number) => void;
}

export const CanvasFrameScrubber: React.FC<CanvasFrameScrubberProps> = ({
  folderPath,
  frameCount = 180,
  fallbackImage = '/frames/nocturne/frame_001.jpg',
  triggerRef,
  endScrollPx = 4800,
  accentColor = 'var(--color-accent)',
  className = '',
  dynamicTransform,
  onUpdateProgress,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentIndexRef = useRef<number>(0);
  const currentProgressRef = useRef<number>(0);
  const lastDrawnIdxRef = useRef<number>(-1);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [loadPercent, setLoadPercent] = useState<number>(0);

  // Helper to find the nearest loaded image if exact frame is not ready
  const getNearestLoadedImage = useCallback((targetIdx: number): HTMLImageElement | null => {
    const images = imagesRef.current;
    if (!images || images.length === 0) return null;
    
    // Check exact match
    if (images[targetIdx] && images[targetIdx].complete && images[targetIdx].naturalWidth > 0) {
      return images[targetIdx];
    }

    // Search outwards for nearest completed frame
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

    return null;
  }, [frameCount]);

  // Helper to draw image onto canvas with crisp DPR and dynamic transforms
  const drawImageToCanvas = useCallback((img: HTMLImageElement, progress: number = 0) => {
    const canvas = canvasRef.current;
    if (!canvas || !img.complete || img.naturalWidth === 0) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    const imageAspect = iw / ih;
    const canvasAspect = cw / ch;

    let baseWidth = cw;
    let baseHeight = ch;
    let offsetX = 0;
    let offsetY = 0;

    // Responsive contain fit with subtle crop margin
    if (canvasAspect > imageAspect) {
      baseWidth = ch * imageAspect;
      offsetX = (cw - baseWidth) / 2;
    } else {
      baseHeight = cw / imageAspect;
      offsetY = (ch - baseHeight) / 2;
    }

    // Apply optional dynamic camera transforms based on scroll progress
    const transform = dynamicTransform ? dynamicTransform(progress) : {};
    const scale = transform.scale ?? 1.0;
    const panX = transform.x ?? 0;
    const panY = transform.y ?? 0;
    const rotation = transform.rotate ?? 0;
    const opacity = transform.opacity ?? 1.0;

    ctx.clearRect(0, 0, cw, ch);
    ctx.save();

    // Center pivot, apply scale/translation, and render frame
    ctx.globalAlpha = opacity;
    ctx.translate(cw / 2 + panX, ch / 2 + panY);
    if (rotation !== 0) {
      ctx.rotate((rotation * Math.PI) / 180);
    }
    ctx.scale(scale, scale);
    ctx.translate(-cw / 2, -ch / 2);

    ctx.drawImage(img, offsetX, offsetY, baseWidth, baseHeight);
    ctx.restore();
  }, [dynamicTransform]);

  // Draw frame by index safely
  const renderFrameIndex = useCallback((idx: number, progress: number) => {
    const safeIdx = Math.min(frameCount - 1, Math.max(0, idx));
    currentIndexRef.current = safeIdx;
    const img = getNearestLoadedImage(safeIdx);
    if (img) {
      drawImageToCanvas(img, progress);
      lastDrawnIdxRef.current = safeIdx;
    }
  }, [frameCount, getNearestLoadedImage, drawImageToCanvas]);

  // Preload frame images efficiently with progressive buffer readiness
  useEffect(() => {
    let isMounted = true;
    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;

    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      const numStr = String(i).padStart(3, '0');
      img.src = `${folderPath}/frame_${numStr}.jpg`;

      img.onload = () => {
        if (!isMounted) return;
        loadedCount++;
        setLoadPercent(Math.round((loadedCount / frameCount) * 100));

        if (loadedCount >= Math.min(10, frameCount)) {
          setIsLoaded(true);
        }

        // Draw initial frame as soon as frame 1 arrives
        if (i === 1 || currentIndexRef.current === i - 1) {
          renderFrameIndex(currentIndexRef.current, currentProgressRef.current);
        }
      };

      img.onerror = () => {
        if (!isMounted) return;
        loadedCount++;
      };

      loadedImages.push(img);
    }

    imagesRef.current = loadedImages;

    return () => {
      isMounted = false;
    };
  }, [folderPath, frameCount, renderFrameIndex]);

  // Canvas DPR resizing
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = (rect.width || window.innerWidth) * dpr;
      canvas.height = (rect.height || window.innerHeight) * dpr;

      renderFrameIndex(currentIndexRef.current, currentProgressRef.current);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [renderFrameIndex]);

  // GSAP ScrollTrigger timeline for weighted scrub
  useGSAP(
    () => {
      const trigger = triggerRef.current;
      if (!trigger) return;
      if (isReducedMotionPreferred()) return;

      const isMobile = window.innerWidth < 768;
      const actualEndScrollPx = isMobile ? Math.min(endScrollPx, 2400) : endScrollPx;

      const frameObj = { frame: 0 };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: trigger,
          start: 'top top',
          end: `+=${actualEndScrollPx}`,
          pin: true,
          pinSpacing: true,
          scrub: 0.2, // Ultra-responsive zero-lag continuous scrub
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            currentProgressRef.current = self.progress;
            if (onUpdateProgress) {
              onUpdateProgress(self.progress);
            }
          },
        },
      });

      tl.to(frameObj, {
        frame: frameCount - 1,
        snap: 'frame',
        ease: 'none',
        onUpdate: () => {
          const idx = Math.round(frameObj.frame);
          renderFrameIndex(idx, currentProgressRef.current);
        },
      });
    },
    { scope: triggerRef, dependencies: [frameCount, endScrollPx] }
  );

  return (
    <div className={`relative w-full h-full flex items-center justify-center overflow-hidden bg-[#050505] ${className}`}>
      {/* High-Performance Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full object-contain pointer-events-none select-none filter contrast-[1.05] brightness-[0.98]"
      />

      {/* Dynamic Studio Spotlight Glow */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20 blur-3xl z-10 transition-opacity duration-700"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, ${accentColor} 0%, transparent 65%)`,
        }}
      />

      {/* Atmospheric Vignette Overlay */}
      <div className="absolute inset-0 pointer-events-none z-10 bg-[radial-gradient(ellipse_75%_65%_at_50%_50%,transparent_35%,rgba(5,5,5,0.85)_100%)]" />

      {/* Progressive Loading State */}
      {!isLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#050505] text-[var(--color-text-muted)] space-y-4 z-30 transition-opacity duration-500">
          <img
            src={fallbackImage}
            alt="ÉLVARA Horology Timepiece"
            className="absolute inset-0 w-full h-full object-contain filter brightness-[0.4] blur-sm"
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

export default CanvasFrameScrubber;
