import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { EASINGS, DURATIONS, isReducedMotionPreferred } from './presets';

// Register ScrollTrigger and useGSAP safely
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export { gsap, ScrollTrigger, useGSAP };

export interface BaseAnimOptions {
  trigger?: string | Element | null;
  delay?: number;
  duration?: number;
  stagger?: number;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  toggleActions?: string;
  onComplete?: () => void;
}

/**
 * GSAP Fade Up Entrance Preset
 */
export const fadeUp = (
  targets: gsap.TweenTarget,
  options: BaseAnimOptions = {}
) => {
  const reduced = isReducedMotionPreferred();
  const {
    trigger,
    delay = 0,
    duration = DURATIONS.normal,
    stagger = 0.1,
    start = 'top 85%',
    toggleActions = 'play none none none',
    onComplete,
  } = options;

  return gsap.fromTo(
    targets,
    {
      opacity: 0,
      y: reduced ? 0 : 40,
    },
    {
      opacity: 1,
      y: 0,
      duration: reduced ? 0.3 : duration,
      delay,
      stagger,
      ease: EASINGS.gsapLuxurious,
      onComplete,
      scrollTrigger: trigger
        ? {
            trigger: trigger as any,
            start,
            toggleActions,
          }
        : undefined,
    }
  );
};

/**
 * GSAP Fade In Preset
 */
export const fadeIn = (
  targets: gsap.TweenTarget,
  options: BaseAnimOptions = {}
) => {
  const {
    trigger,
    delay = 0,
    duration = DURATIONS.normal,
    stagger = 0.1,
    start = 'top 85%',
    toggleActions = 'play none none none',
    onComplete,
  } = options;

  return gsap.fromTo(
    targets,
    { opacity: 0 },
    {
      opacity: 1,
      duration,
      delay,
      stagger,
      ease: 'power2.out',
      onComplete,
      scrollTrigger: trigger
        ? {
            trigger: trigger as any,
            start,
            toggleActions,
          }
        : undefined,
    }
  );
};

/**
 * GSAP Subtle Scale Preset
 */
export const subtleScale = (
  targets: gsap.TweenTarget,
  options: BaseAnimOptions & { scaleFrom?: number; scaleTo?: number } = {}
) => {
  const reduced = isReducedMotionPreferred();
  const {
    trigger,
    delay = 0,
    duration = DURATIONS.slow,
    scaleFrom = 0.95,
    scaleTo = 1,
    start = 'top 85%',
    toggleActions = 'play none none none',
    onComplete,
  } = options;

  return gsap.fromTo(
    targets,
    {
      opacity: 0,
      scale: reduced ? 1 : scaleFrom,
    },
    {
      opacity: 1,
      scale: scaleTo,
      duration: reduced ? 0.3 : duration,
      delay,
      ease: EASINGS.gsapExpoOut,
      onComplete,
      scrollTrigger: trigger
        ? {
            trigger: trigger as any,
            start,
            toggleActions,
          }
        : undefined,
    }
  );
};

/**
 * GSAP Image Reveal Preset (mask/clip-path reveal)
 */
export const imageReveal = (
  container: gsap.TweenTarget,
  options: BaseAnimOptions = {}
) => {
  const reduced = isReducedMotionPreferred();
  const {
    trigger = container,
    delay = 0,
    duration = DURATIONS.luxurious,
    start = 'top 80%',
    toggleActions = 'play none none none',
    onComplete,
  } = options;

  if (reduced) {
    return gsap.fromTo(
      container,
      { opacity: 0 },
      { opacity: 1, duration: 0.4, delay, onComplete }
    );
  }

  const tl = gsap.timeline({
    scrollTrigger: trigger
      ? {
          trigger: trigger as any,
          start,
          toggleActions,
        }
      : undefined,
  });

  tl.fromTo(
    container,
    {
      clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
      opacity: 0,
    },
    {
      clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
      opacity: 1,
      duration,
      delay,
      ease: EASINGS.gsapExpoOut,
      onComplete,
    }
  );

  return tl;
};

/**
 * GSAP Text Reveal Preset
 */
export const textReveal = (
  targets: gsap.TweenTarget,
  options: BaseAnimOptions = {}
) => {
  const reduced = isReducedMotionPreferred();
  const {
    trigger,
    delay = 0,
    duration = DURATIONS.normal,
    stagger = 0.08,
    start = 'top 85%',
    toggleActions = 'play none none none',
    onComplete,
  } = options;

  return gsap.fromTo(
    targets,
    {
      opacity: 0,
      y: reduced ? 0 : '100%',
    },
    {
      opacity: 1,
      y: '0%',
      duration: reduced ? 0.3 : duration,
      delay,
      stagger,
      ease: EASINGS.gsapExpoOut,
      onComplete,
      scrollTrigger: trigger
        ? {
            trigger: trigger as any,
            start,
            toggleActions,
          }
        : undefined,
    }
  );
};

/**
 * GSAP Staggered Children Reveal Preset
 */
export const staggeredReveal = (
  elements: gsap.TweenTarget,
  options: BaseAnimOptions = {}
) => {
  return fadeUp(elements, {
    stagger: 0.15,
    ...options,
  });
};
