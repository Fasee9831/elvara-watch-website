import type { Variants, Transition } from 'framer-motion';
import { EASINGS, SPRINGS } from './presets';

// Standard transition definitions
export const transitionExpo: Transition = {
  duration: 0.8,
  ease: EASINGS.expoOut,
};

export const transitionLuxurious: Transition = {
  duration: 1.2,
  ease: EASINGS.luxurious,
};

export const transitionSpringSubtle: Transition = {
  type: 'spring',
  ...SPRINGS.subtle,
};

export const transitionSpringHover: Transition = {
  type: 'spring',
  ...SPRINGS.hover,
};

// Reusable Framer Motion Variants

/**
 * Button Hover & Tap Presets
 */
export const buttonHoverVariants: Variants = {
  initial: {
    scale: 1,
  },
  hover: {
    scale: 1.02,
    transition: transitionSpringHover,
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.1 },
  },
};

/**
 * Navigation Item Hover Presets (subtle position & opacity shift)
 */
export const navHoverVariants: Variants = {
  initial: {
    opacity: 0.7,
    y: 0,
  },
  hover: {
    opacity: 1,
    y: -1,
    transition: { duration: 0.2, ease: 'easeOut' },
  },
};

/**
 * Luxury Card Hover Presets (subtle elevation & gold glow)
 */
export const cardHoverVariants: Variants = {
  initial: {
    y: 0,
    scale: 1,
    boxShadow: '0 0 0 rgba(0, 0, 0, 0)',
  },
  hover: {
    y: -6,
    scale: 1.01,
    boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.5), 0 0 20px 0 rgba(212, 175, 55, 0.1)',
    transition: transitionExpo,
  },
};

/**
 * Subtle Opacity Transition Variants
 */
export const opacityVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: 'easeInOut' },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.4, ease: 'easeInOut' },
  },
};

/**
 * Container Stagger Variants
 */
export const staggerContainerVariants = (staggerChildren = 0.1, delayChildren = 0): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});
