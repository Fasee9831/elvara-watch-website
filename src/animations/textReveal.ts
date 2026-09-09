import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Checks if the user prefers reduced motion.
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Initializes Vanilla IntersectionObserver text reveals across all marked DOM elements.
 * Fully immune to missing JS / failed loads because elements default to visible.
 */
export const initTextReveals = (root: Element | Document = document): (() => void) => {
  if (typeof window === 'undefined') return () => {};

  if (prefersReducedMotion()) {
    // Reveal everything immediately for reduced motion
    const elements = root.querySelectorAll('.reveal-clip-ltr, .reveal-clip-rtl, .reveal-fade-up, .reveal-stagger-item');
    elements.forEach((el) => {
      el.classList.add('is-revealed');
      (el as HTMLElement).style.visibility = 'visible';
      (el as HTMLElement).style.opacity = '1';
    });
    return () => {};
  }

  // Mark DOM as ready for enhanced reveals
  document.documentElement.classList.add('js-reveal-ready');

  // Automatically assign stagger indices to children of .reveal-stagger-group
  const staggerGroups = root.querySelectorAll('.reveal-stagger-group');
  staggerGroups.forEach((group) => {
    const items = group.querySelectorAll('.reveal-stagger-item, > *');
    items.forEach((item, idx) => {
      (item as HTMLElement).style.setProperty('--stagger-index', String(idx));
    });
  });

  const observerOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '0px 0px -10% 0px',
    threshold: 0.15,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        // Unobserve once revealed to save CPU cycles
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const revealTargets = root.querySelectorAll(
    '.reveal-clip-ltr, .reveal-clip-rtl, .reveal-fade-up, .reveal-stagger-group, .reveal-stagger-item'
  );

  revealTargets.forEach((el) => observer.observe(el));

  return () => {
    observer.disconnect();
  };
};

/**
 * GSAP ScrollTrigger Text Reveal Helper
 * For programmatic directional reveals using GSAP.
 */
export const animateTextReveal = (
  target: string | Element,
  direction: 'ltr' | 'rtl' | 'up' = 'ltr',
  options: {
    trigger?: string | Element;
    duration?: number;
    delay?: number;
    stagger?: number;
    start?: string;
  } = {}
) => {
  if (typeof window === 'undefined') return;

  const {
    trigger = target,
    duration = 1.1,
    delay = 0,
    stagger = 0.1,
    start = 'top 85%',
  } = options;

  if (prefersReducedMotion()) {
    gsap.set(target, { opacity: 1, visibility: 'visible', clipPath: 'inset(0 0% 0 0)' });
    return;
  }

  let fromClip = 'inset(0 100% 0 0)';
  if (direction === 'rtl') fromClip = 'inset(0 0 0 100%)';
  if (direction === 'up') fromClip = 'inset(100% 0 0 0)';

  gsap.fromTo(
    target,
    {
      clipPath: fromClip,
      opacity: 0.85,
      y: direction === 'up' ? 24 : 0,
    },
    {
      clipPath: 'inset(0 0% 0 0)',
      opacity: 1,
      y: 0,
      visibility: 'visible',
      duration,
      delay,
      stagger,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: trigger as gsap.DOMTarget,
        start,
        toggleActions: 'play none none none',
        once: true,
      },
    }
  );
};
