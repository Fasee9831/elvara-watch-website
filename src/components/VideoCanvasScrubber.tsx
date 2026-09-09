import React, { useRef } from 'react';
import { gsap, useGSAP } from '@/animations/gsap';
import { isReducedMotionPreferred } from '@/animations/presets';

export interface VideoCanvasScrubberProps {
  src: string;
  triggerRef: React.RefObject<HTMLDivElement | null>;
  endScrollPx?: number;
  accentColor?: string;
  className?: string;
  onUpdateProgress?: (progress: number) => void;
}

export const VideoCanvasScrubber: React.FC<VideoCanvasScrubberProps> = ({
  src,
  triggerRef,
  endScrollPx = 2000,
  accentColor = 'var(--color-accent)',
  className = '',
  onUpdateProgress,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useGSAP(
    () => {
      const video = videoRef.current;
      const trigger = triggerRef.current;
      if (!video || !trigger) return;
      if (isReducedMotionPreferred()) return;

      const isMobile = window.innerWidth < 768;
      if (isMobile) return;

      const setupScrollScrub = () => {
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
              scrub: 0.5,
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
          // Fallback if browser restricts video.currentTime direct mutation
        }
      };

      if (video.readyState >= 1 && video.duration && !isNaN(video.duration)) {
        setupScrollScrub();
      } else {
        video.addEventListener('loadedmetadata', setupScrollScrub, { once: true });
        video.addEventListener('canplay', setupScrollScrub, { once: true });
      }
    },
    { dependencies: [] }
  );

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {/* Hardware Accelerated Video Element Scrubbed Directly by GSAP */}
      <video
        ref={videoRef}
        src={src}
        preload="auto"
        muted
        playsInline
        disablePictureInPicture
        disableRemotePlayback
        controlsList="nodownload nofullscreen noremoteplayback noplaybackrate"
        onContextMenu={(e) => e.preventDefault()}
        tabIndex={-1}
        aria-hidden="true"
        data-adobe-extension-disable="true"
        className="w-full h-full object-cover filter contrast-[1.04] brightness-[0.98] select-none pointer-events-none"
      />

      {/* Subtle Studio Spotlight Glow */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25 blur-3xl"
        style={{
          backgroundImage: `radial-gradient(circle at center, ${accentColor} 0%, transparent 70%)`,
        }}
      />

      {/* Dark Luxury Vignette Overlay */}
      <div className="absolute inset-0 bg-radial from-transparent via-black/20 to-black/70 pointer-events-none" />
    </div>
  );
};

export default VideoCanvasScrubber;
