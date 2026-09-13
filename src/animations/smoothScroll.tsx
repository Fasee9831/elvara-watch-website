import React, { createContext, useContext, useEffect, useState } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from './gsap';
import { isReducedMotionPreferred } from './presets';
import { navigateToSection } from '@/utils/navigation';

let lenisInstance: Lenis | null = null;

/**
 * Returns the current active Lenis instance
 */
export const getLenis = (): Lenis | null => lenisInstance;

export interface SmoothScrollOptions {
  lerp?: number;
  duration?: number;
  smoothWheel?: boolean;
}

/**
 * Initializes Lenis smooth scrolling and syncs with GSAP ScrollTrigger
 */
export const initSmoothScroll = (options: SmoothScrollOptions = {}): Lenis | null => {
  if (typeof window === 'undefined') return null;

  // Respect reduced motion preference by not initializing Lenis
  if (isReducedMotionPreferred()) {
    if (lenisInstance) {
      lenisInstance.destroy();
      lenisInstance = null;
    }
    return null;
  }

  if (lenisInstance) {
    return lenisInstance;
  }

  const lenis = new Lenis({
    duration: options.duration ?? 1.4,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: options.smoothWheel ?? true,
    wheelMultiplier: 0.9,
    touchMultiplier: 1.6,
    infinite: false,
  });

  lenisInstance = lenis;

  // Update ScrollTrigger on Lenis scroll
  const onScroll = () => {
    ScrollTrigger.update();
  };
  lenis.on('scroll', onScroll);

  // Sync Lenis RAF with GSAP Ticker
  const updateTicker = (time: number) => {
    lenis.raf(time * 1000);
  };
  gsap.ticker.add(updateTicker);
  gsap.ticker.lagSmoothing(0);

  // Smooth scroll for anchor links using centralized navigation engine
  const handleAnchorClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement | null;
    const anchor = target?.closest<HTMLAnchorElement>('a[href^="#"]');
    if (anchor) {
      const href = anchor.getAttribute('href');
      if (href && href.length > 1) {
        e.preventDefault();
        navigateToSection(href);
      }
    }
  };

  const handleResize = () => {
    lenis.resize();
    ScrollTrigger.refresh();
  };

  document.addEventListener('click', handleAnchorClick);
  window.addEventListener('resize', handleResize);

  // Initial deep link hash landing
  if (typeof window !== 'undefined' && window.location.hash) {
    setTimeout(() => {
      navigateToSection(window.location.hash);
    }, 150);
  }

  (lenis as any)._cleanup = () => {
    lenis.off('scroll', onScroll);
    gsap.ticker.remove(updateTicker);
    document.removeEventListener('click', handleAnchorClick);
    window.removeEventListener('resize', handleResize);
  };

  return lenis;
};

/**
 * Safely destroys Lenis smooth scroll instance and removes listeners
 */
export const destroySmoothScroll = (): void => {
  if (lenisInstance) {
    if ((lenisInstance as any)._cleanup) {
      (lenisInstance as any)._cleanup();
    }
    lenisInstance.destroy();
    lenisInstance = null;
  }
};

const SmoothScrollContext = createContext<Lenis | null>(null);

/**
 * Hook to access Lenis instance in React components
 */
export const useLenis = (): Lenis | null => useContext(SmoothScrollContext);

/**
 * React Provider component to manage global smooth scroll lifecycle cleanly
 */
export const SmoothScrollProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const instance = initSmoothScroll();
    setLenis(instance);

    return () => {
      destroySmoothScroll();
      setLenis(null);
    };
  }, []);

  return (
    <SmoothScrollContext.Provider value={lenis}>
      {children}
    </SmoothScrollContext.Provider>
  );
};
