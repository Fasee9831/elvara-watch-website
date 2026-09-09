import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ScrollTrigger } from '@/animations/gsap';
import { getLenis } from '@/animations/smoothScroll';
import { GoldStardustLogo } from './GoldStardustLogo';

interface PreloaderProps {
  onReveal: () => void;
  onComplete: () => void;
}

const FRAMES_TO_PRELOAD = 15;
const EXIT_DURATION = 800;
const MIN_INTRO_DURATION_MS = 4200; // Target visual sequence window

export const Preloader: React.FC<PreloaderProps> = ({ onReveal, onComplete }) => {
  const preloaderRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [displayProgress, setDisplayProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  // Discrete state tracking
  const [assetsReady, setAssetsReady] = useState(false);
  const [logoReady, setLogoReady] = useState(false);
  const [logoComplete, setLogoComplete] = useState(false);
  const [minTimeReached, setMinTimeReached] = useState(false);

  const startTimeRef = useRef<number | null>(null);
  const animationFrameId = useRef<number | null>(null);

  // 1. Asset preloading (Critical opening watch frames)
  useEffect(() => {
    if (!isVisible) return;
    document.body.classList.add('is-loading');

    let loadedCount = 0;
    const totalToLoad = FRAMES_TO_PRELOAD;

    for (let frame = 1; frame <= totalToLoad; frame += 1) {
      const img = new Image();
      img.onload = img.onerror = () => {
        loadedCount += 1;
        if (loadedCount >= totalToLoad) {
          setAssetsReady(true);
        }
      };
      img.src = `/frames/aurelia-1/frame_${String(frame).padStart(3, '0')}.webp`;
    }

    // Fallback if image network requests hang
    const assetTimeout = window.setTimeout(() => {
      setAssetsReady(true);
    }, 2000);

    return () => {
      window.clearTimeout(assetTimeout);
    };
  }, [isVisible]);

  // 2. Background video playback initialization with fail-safe autoplay
  useEffect(() => {
    if (!isVisible) return;
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay handled smoothly with poster fallback
        });
      }
    }
  }, [isVisible]);

  // 3. Minimum intro duration tracking
  useEffect(() => {
    if (!isVisible) return;
    const timer = window.setTimeout(() => {
      setMinTimeReached(true);
    }, MIN_INTRO_DURATION_MS);

    return () => window.clearTimeout(timer);
  }, [isVisible]);

  // 4. Smooth, cinematic progress pacing coordinated with animation phases
  useEffect(() => {
    if (!isVisible) return;

    const step = (now: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = now;
      }

      const elapsed = now - startTimeRef.current;
      const timeRatio = Math.min(1, elapsed / MIN_INTRO_DURATION_MS);

      // Multi-stage cinematic progress curve matching logo stardust phases:
      // 0.0s - 0.6s: 0% -> 14% (Quiet Darkness & Sparks)
      // 0.6s - 1.5s: 14% -> 40% (Particle Emergence & Drift)
      // 1.5s - 2.5s: 40% -> 74% (Magnetic Convergence)
      // 2.5s - 3.3s: 74% -> 92% (Letterform Assembly)
      // 3.3s - 3.8s: 92% -> 98% (Solidification)
      // 3.8s - 4.2s: 98% -> 100% (Final Shimmer & Ready)
      let targetProgress = 0;
      if (timeRatio <= 0.14) {
        targetProgress = (timeRatio / 0.14) * 14;
      } else if (timeRatio <= 0.35) {
        targetProgress = 14 + ((timeRatio - 0.14) / 0.21) * 26;
      } else if (timeRatio <= 0.6) {
        targetProgress = 40 + ((timeRatio - 0.35) / 0.25) * 34;
      } else if (timeRatio <= 0.78) {
        targetProgress = 74 + ((timeRatio - 0.6) / 0.18) * 18;
      } else if (timeRatio <= 0.9) {
        targetProgress = 92 + ((timeRatio - 0.78) / 0.12) * 6;
      } else {
        targetProgress = 98 + ((timeRatio - 0.9) / 0.1) * 2;
      }

      // Hold at 99% until ALL readiness criteria are truly satisfied
      const isReadyToComplete = assetsReady && logoReady && logoComplete && minTimeReached;
      if (!isReadyToComplete) {
        targetProgress = Math.min(99, targetProgress);
      } else {
        targetProgress = 100;
      }

      setDisplayProgress((prev) => {
        const next = Math.max(prev, targetProgress);
        return Math.min(100, Math.round(next * 10) / 10);
      });

      if (!isReadyToComplete || elapsed < MIN_INTRO_DURATION_MS) {
        animationFrameId.current = window.requestAnimationFrame(step);
      } else {
        setDisplayProgress(100);
      }
    };

    animationFrameId.current = window.requestAnimationFrame(step);

    return () => {
      if (animationFrameId.current) {
        window.cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isVisible, assetsReady, logoReady, logoComplete, minTimeReached]);

  // 5. Safe and graceful handoff to the main website
  const isPreloadComplete =
    assetsReady && logoReady && logoComplete && minTimeReached && displayProgress >= 100;

  useEffect(() => {
    if (!isVisible || !isPreloadComplete) return;

    // Subtle 250ms hold on 100% for luxury satisfaction
    const exitTimer = window.setTimeout(() => {
      onReveal();
      setIsExiting(true);
    }, 250);

    const removeTimer = window.setTimeout(() => {
      document.body.classList.remove('is-loading');
      setIsVisible(false);
      onComplete();
      window.setTimeout(() => {
        ScrollTrigger.refresh();
        getLenis()?.resize();
      }, 50);
    }, EXIT_DURATION + 250);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(removeTimer);
    };
  }, [isVisible, isPreloadComplete, onComplete, onReveal]);

  // 6. Unconditional safety fallback (preloader will never trap the user)
  useEffect(() => {
    if (!isVisible) return;
    const safetyTimer = window.setTimeout(() => {
      setAssetsReady(true);
      setLogoReady(true);
      setLogoComplete(true);
      setMinTimeReached(true);
      setDisplayProgress(100);
    }, 5500);

    return () => window.clearTimeout(safetyTimer);
  }, [isVisible]);

  const handleLogoReady = useCallback(() => {
    setLogoReady(true);
  }, []);

  const handleLogoAnimationComplete = useCallback(() => {
    setLogoComplete(true);
  }, []);

  if (!isVisible) return null;

  const roundedVal = Math.min(100, Math.round(displayProgress));

  return (
    <aside
      ref={preloaderRef}
      className={`preloader-container ${isExiting ? 'preloader-exiting' : ''}`}
      aria-label="ÉLVARA Haute Horlogerie"
      role="status"
    >
      {/* 1. Full-Bleed Dark Cinematic Watch Background Video with Zero-Flash Poster */}
      {!videoFailed && (
        <div className="preloader-video-wrap" aria-hidden="true">
          <video
            ref={videoRef}
            className="preloader-video"
            poster="/images/preload_poster.webp"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            disablePictureInPicture
            onError={() => setVideoFailed(true)}
          >
            <source src="/videos/preload_video.mp4" type="video/mp4" />
          </video>
          {/* Subtle Vignette & Contrast Control Overlay */}
          <div className="preloader-video-overlay" />
        </div>
      )}

      {/* 2. Soft Specular Ambient Center Aura */}
      <div className="preloader-ambient" aria-hidden="true" />

      {/* 3. Pure Editorial Brand & Progress Core */}
      <div className="preloader-core">
        {/* Subtle Brand Provenance */}
        <p className="preloader-descriptor">
          MANUFACTURE DE HAUTE HORLOGERIE
        </p>

        {/* ÉLVARA Wordmark — Cinematic Gold Stardust Reveal & Solidification */}
        <GoldStardustLogo
          progress={displayProgress}
          onReady={handleLogoReady}
          onAnimationComplete={handleLogoAnimationComplete}
        />

        {/* Minimal Precision Gauge Line */}
        <div className="preloader-meter" aria-hidden="true">
          <div className="preloader-line-track">
            <div
              className="preloader-line-fill"
              style={{ width: `${displayProgress}%` }}
            />
          </div>

          {/* Understated Readout */}
          <div className="preloader-meta">
            <span className="preloader-origin">GENÈVE</span>
            <output className="preloader-percent" aria-live="polite">
              {String(roundedVal).padStart(3, '0')}%
            </output>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Preloader;
