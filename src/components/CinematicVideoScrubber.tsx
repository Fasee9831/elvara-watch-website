import React, { useRef, useState } from 'react';
import { gsap, useGSAP } from '@/animations/gsap';
import { isReducedMotionPreferred } from '@/animations/presets';

export interface CinematicVideoScrubberProps {
  src: string;
  fallbackImage?: string;
  triggerRef: React.RefObject<HTMLDivElement | null>;
  endScrollPx?: number;
  accentColor?: string;
  className?: string;
  onUpdateProgress?: (progress: number) => void;
}

export const CinematicVideoScrubber: React.FC<CinematicVideoScrubberProps> = ({
  src,
  fallbackImage = '/images/watch1.jpg',
  triggerRef,
  endScrollPx = 2000,
  accentColor = 'var(--color-accent)',
  className = '',
  onUpdateProgress,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useGSAP(
    () => {
      const video = videoRef.current;
      const trigger = triggerRef.current;
      if (!video || !trigger) return;
      if (isReducedMotionPreferred()) return;

      const isMobile = window.innerWidth < 768;
      if (isMobile) return;

      const bindScrollScrub = () => {
        if (!video || !video.duration || isNaN(video.duration)) return;

        try {
          const duration = video.duration;

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: trigger,
              start: 'top top',
              end: `+=${endScrollPx}`,
              pin: true,
              pinSpacing: true,
              scrub: 0.8,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                if (onUpdateProgress) {
                  onUpdateProgress(self.progress);
                }
              },
            },
          });

          tl.fromTo(
            video,
            { currentTime: 0 },
            { currentTime: duration, ease: 'none' }
          );
        } catch (e) {
          console.warn('ScrollTrigger video scrub error:', e);
        }
      };

      if (video.readyState >= 1 && video.duration && !isNaN(video.duration)) {
        bindScrollScrub();
      } else {
        video.addEventListener('loadedmetadata', bindScrollScrub, { once: true });
        video.addEventListener('canplay', bindScrollScrub, { once: true });
      }
    },
    { dependencies: [] }
  );

  return (
    <div className={`relative w-full h-full flex items-center justify-center overflow-hidden bg-[#050505] ${className}`}>
      {!hasError ? (
        <video
          ref={videoRef}
          src={src}
          muted
          playsInline
          preload="metadata"
          onError={(e) => {
            console.error(`Failed to load video asset at ${src}`, e);
            setHasError(true);
            setErrorMessage(`Failed to load video: ${src}`);
          }}
          className="w-full h-full object-contain pointer-events-none select-none filter contrast-[1.04] brightness-[0.98]"
        />
      ) : (
        <div className="relative w-full h-full flex items-center justify-center bg-[#050505]">
          <img
            src={fallbackImage}
            alt="ÉLVARA Horology Timepiece"
            className="w-full h-full object-contain filter contrast-[1.04]"
          />
          {import.meta.env.DEV && errorMessage && (
            <div className="absolute top-4 left-4 bg-red-900/80 text-red-200 text-xs px-3 py-1 rounded font-mono z-40">
              {errorMessage}
            </div>
          )}
        </div>
      )}

      {/* Subtle Studio Spotlight Glow */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20 blur-3xl z-10"
        style={{
          backgroundImage: `radial-gradient(circle at center, ${accentColor} 0%, transparent 70%)`,
        }}
      />

      {/* Dark Luxury Vignette Overlay */}
      <div className="absolute inset-0 bg-radial from-transparent via-black/20 to-black/60 pointer-events-none z-10" />
    </div>
  );
};

export default CinematicVideoScrubber;
