// Luxury Easing Curves & Timing Configurations
export const EASINGS = {
  // Ultra-luxurious cubic-bezier curves for Framer Motion & CSS
  expoOut: [0.16, 1, 0.3, 1] as const,
  luxurious: [0.25, 1, 0.5, 1] as const,
  smooth: [0.4, 0, 0.2, 1] as const,
  
  // Corresponding GSAP ease strings
  gsapExpoOut: 'power4.out',
  gsapLuxurious: 'power3.out',
  gsapSmooth: 'power2.out',
};

export const DURATIONS = {
  fast: 0.4,
  normal: 0.8,
  slow: 1.2,
  luxurious: 1.6,
};

export const SPRINGS = {
  gentle: { stiffness: 120, damping: 20, mass: 1 },
  subtle: { stiffness: 200, damping: 25, mass: 1 },
  hover: { stiffness: 400, damping: 30 },
};

/**
 * Checks if the user prefers reduced motion for accessibility
 */
export const isReducedMotionPreferred = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};
