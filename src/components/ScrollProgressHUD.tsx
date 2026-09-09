import React, { useEffect, useState, useRef } from 'react';
import { navigateToSection } from '@/utils/navigation';

interface Chapter {
  id: string;
  numeral: string;
  label: string;
}

const CHAPTERS: Chapter[] = [
  { id: 'hero', numeral: 'I', label: 'ARCHITECTURE' },
  { id: 'philosophy', numeral: 'II', label: 'PHILOSOPHY' },
  { id: 'movement', numeral: 'III', label: 'CALIBRE ASSEMBLY' },
  { id: 'craftsmanship', numeral: 'IV', label: 'HAUTE CRAFT' },
  { id: 'nocturne', numeral: 'V', label: 'OBSIDIAN NOCTURNE' },
  { id: 'collection', numeral: 'VI', label: 'THE NINE' },
  { id: 'customizer', numeral: 'VII', label: 'BESPOKE ATELIER' },
  { id: 'comparator', numeral: 'VIII', label: 'COMPARATOR' },
  { id: 'wrist-guide', numeral: 'IX', label: 'WRIST FIT' },
  { id: 'designer', numeral: 'X', label: 'DESIGNER TRIBUTE' },
  { id: 'reviews', numeral: 'XI', label: 'COLLECTOR REVIEWS' },
  { id: 'footer', numeral: 'XII', label: 'ATELIER' },
];

/**
 * ScrollProgressHUD — Persistent Vertical Luxury Scrubber Rail.
 * Provides instant top-to-bottom scroll feedback, chapter awareness, and smooth jump navigation.
 */
export const ScrollProgressHUD: React.FC = () => {
  const [activeChapter, setActiveChapter] = useState('hero');
  const activeChapterRef = useRef('hero');

  useEffect(() => {
    let ticking = false;

    const updateScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        ticking = false;
        const currentScroll = window.scrollY;
        const scrollPos = currentScroll + window.innerHeight * 0.35;

        for (let i = CHAPTERS.length - 1; i >= 0; i--) {
          const chapter = CHAPTERS[i];
          const el = document.getElementById(chapter.id);
          if (el) {
            const top = el.getBoundingClientRect().top + window.scrollY;
            if (scrollPos >= top) {
              if (activeChapterRef.current !== chapter.id) {
                activeChapterRef.current = chapter.id;
                setActiveChapter(chapter.id);
              }
              break;
            }
          }
        }
      });
    };

    const handleNavChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ section: string }>;
      if (customEvent.detail?.section) {
        activeChapterRef.current = customEvent.detail.section;
        setActiveChapter(customEvent.detail.section);
      }
    };

    window.addEventListener('scroll', updateScroll, { passive: true });
    window.addEventListener('elvara-nav-change', handleNavChange);
    updateScroll();

    return () => {
      window.removeEventListener('scroll', updateScroll);
      window.removeEventListener('elvara-nav-change', handleNavChange);
    };
  }, []);

  const scrollToSection = (id: string) => {
    setActiveChapter(id);
    navigateToSection(id);
  };

  const activeIndex = CHAPTERS.findIndex((chapter) => chapter.id === activeChapter);
  const fillScale = activeIndex < 0 ? 0 : activeIndex / (CHAPTERS.length - 1);

  return (
    <aside
      aria-label="Chapter Navigation & Progress"
      className="chapter-rail fixed right-6 md:right-12 top-1/2 z-[90] hidden lg:block select-none"
    >
      <div className="chapter-rail-track" aria-hidden="true">
        <span className="chapter-rail-fill" style={{ transform: `scaleY(${fillScale})` }} />
      </div>
      <nav className="chapter-rail-ticks" aria-label="Chapter list">
        {CHAPTERS.map((chapter) => {
          const isActive = activeChapter === chapter.id;

          return (
            <button
              key={chapter.id}
              type="button"
              onClick={() => scrollToSection(chapter.id)}
              className={`chapter-rail-tick ${isActive ? 'active' : ''}`}
              aria-label={`${chapter.numeral}: ${chapter.label}`}
              aria-current={isActive ? 'true' : undefined}
            >
              <span>{chapter.numeral}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default ScrollProgressHUD;
