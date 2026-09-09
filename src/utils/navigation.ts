import { getLenis } from '@/animations/smoothScroll';
import { isReducedMotionPreferred } from '@/animations/presets';
import { ScrollTrigger } from '@/animations/gsap';
import { WATCHES, resolveWatch } from '@/data/watches';

// Pinned sticky stages: sections with pinned stage wrappers that pin when container enters viewport top
const PINNED_SECTIONS = new Set([
  'hero',
  'philosophy',
  'movement',
  'nocturne',
  'collection',
  'comparator',
  'wrist-guide',
  'designer',
  'reviews',
]);

// Aliases for user-friendly navigation and cross-component routing
const SECTION_ALIASES: Record<string, string> = {
  architecture: 'hero',
  hero: 'hero',
  home: 'hero',
  top: 'hero',
  philosophy: 'philosophy',
  credo: 'philosophy',
  statement: 'philosophy',
  movement: 'movement',
  calibre: 'movement',
  assembly: 'movement',
  craft: 'craftsmanship',
  craftsmanship: 'craftsmanship',
  material: 'craftsmanship',
  materials: 'craftsmanship',
  nocturne: 'nocturne',
  collection: 'collection',
  'the-nine': 'collection',
  nine: 'collection',
  watches: 'collection',
  customizer: 'customizer',
  custom: 'customizer',
  bespoke: 'customizer',
  atelier: 'footer',
  comparator: 'comparator',
  compare: 'comparator',
  comparison: 'comparator',
  'wrist-guide': 'wrist-guide',
  wristguide: 'wrist-guide',
  wrist: 'wrist-guide',
  fit: 'wrist-guide',
  designer: 'designer',
  spotlight: 'designer',
  faseeha: 'designer',
  reviews: 'reviews',
  testimonials: 'reviews',
  footer: 'footer',
  contact: 'footer',
  visit: 'footer',
};

// Set manual browser scroll restoration to prevent landing in stale scroll positions on page reload
if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
  try {
    window.history.scrollRestoration = 'manual';
  } catch {
    // Ignore restricted environments
  }
}

/**
 * Resolves any alias, hash, or raw route ID into canonical section ID
 */
export const getResolvedSectionId = (rawId: string): string => {
  const clean = rawId.replace(/^#/, '').toLowerCase().trim();
  return SECTION_ALIASES[clean] || clean;
};

export interface NavigationOptions {
  onDone?: () => void;
  offset?: number;
  watchId?: string;
  immediate?: boolean;
}

/**
 * Universal, global navigation engine for ÉLVARA
 * Guarantees correct destination, calculated header clearance,
 * true usable beginning, and refreshed animation state.
 */
export const navigateToSection = (
  sectionIdOrHref: string,
  optionsOrDone?: NavigationOptions | (() => void)
): boolean => {
  if (typeof window === 'undefined') return false;

  const options: NavigationOptions =
    typeof optionsOrDone === 'function' ? { onDone: optionsOrDone } : optionsOrDone || {};

  const targetId = getResolvedSectionId(sectionIdOrHref);
  const element =
    document.getElementById(targetId) ||
    document.querySelector(`[data-section="${targetId}"]`) ||
    document.getElementById(targetId.replace('-anchor', ''));

  if (!element) {
    if (import.meta.env?.DEV) {
      console.warn(`[ÉLVARA Navigation] Target section not found: "${sectionIdOrHref}" (resolved as "${targetId}")`);
    }
    return false;
  }

  // Calculate layout coordinates
  const isPinned =
    PINNED_SECTIONS.has(targetId) ||
    element.classList.contains('viewport-pinned-stage') ||
    !!element.querySelector('.viewport-pinned-stage');

  const rect = element.getBoundingClientRect();
  const elementTop = rect.top + window.scrollY;

  let targetScrollY: number;

  if (isPinned) {
    // For pinned sections, entering at elementTop locks the pinned stage at its true beginning (progress = 0)
    targetScrollY = Math.max(0, elementTop);

    // If targeting a specific watch in the horizontal collection, calculate exact scrub offset
    if (targetId === 'collection' && options.watchId) {
      const resolved = resolveWatch(options.watchId);
      if (resolved) {
        const watchIndex = WATCHES.findIndex((w) => w.id === resolved.id);
        if (watchIndex >= 0) {
          const totalCards = WATCHES.length;
          const progress = totalCards > 1 ? watchIndex / (totalCards - 1) : 0;
          const containerHeight = (element as HTMLElement).offsetHeight || rect.height;
          const scrollableDist = Math.max(0, containerHeight - window.innerHeight);
          targetScrollY = elementTop + progress * scrollableDist;
        }
      }
    }
  } else {
    // For flowing content (e.g. craftsmanship, customizer, designer, footer),
    // offset by measured header height + generous breathing room so content is NEVER obscured.
    const header = document.querySelector('header');
    const headerHeight = header ? header.getBoundingClientRect().height : 64;
    const customOffset = options.offset !== undefined ? options.offset : 16;
    targetScrollY = Math.max(0, elementTop - headerHeight - customOffset);
  }

  // Update URL hash safely without triggering native jump
  try {
    if (window.location.hash !== `#${targetId}`) {
      window.history.replaceState(null, '', `#${targetId}`);
    }
  } catch {
    // Ignore history restrictions if in iframe
  }

  // Dispatch synchronized global navigation event for header active state & HUD rail
  window.dispatchEvent(
    new CustomEvent('elvara-nav-change', {
      detail: { section: targetId, watchId: options.watchId },
    })
  );

  // If a specific watch context was requested (e.g. from chatbot "View Aurelia" or card click), broadcast it
  if (options.watchId) {
    window.dispatchEvent(
      new CustomEvent('elvara-select-watch', {
        detail: { watchId: options.watchId },
      })
    );
  }

  const lenis = getLenis();
  const reduced = isReducedMotionPreferred();

  const handleFinish = () => {
    ScrollTrigger.update();
    ScrollTrigger.refresh();
    options.onDone?.();
  };

  if (lenis && !reduced && !options.immediate) {
    lenis.scrollTo(targetScrollY, {
      duration: 1.15,
      immediate: false,
      lock: true,
      onComplete: handleFinish,
    });
  } else {
    window.scrollTo({
      top: targetScrollY,
      behavior: reduced || options.immediate ? 'auto' : 'smooth',
    });
    setTimeout(handleFinish, 400);
  }

  return true;
};
