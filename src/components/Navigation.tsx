import React, { useState, useEffect, useRef } from 'react';
import { MobileMenu } from './MobileMenu';
import { navigateToSection } from '@/utils/navigation';
import { CurrencySelector } from '@/context/CurrencyContext';

class WatchAudioController {
  private ctx: AudioContext | null = null;
  private isSoundEnabled = false;
  private intervalId: number | null = null;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleSound(): boolean {
    this.isSoundEnabled = !this.isSoundEnabled;
    if (this.isSoundEnabled) {
      this.initContext();
      this.startTicking();
    } else {
      this.stopTicking();
    }
    return this.isSoundEnabled;
  }

  public getIsEnabled(): boolean {
    return this.isSoundEnabled;
  }

  public playSingleClick(tone = 1800, duration = 0.015) {
    if (!this.isSoundEnabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(tone, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + duration);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch {
      // Audio context might be restricted before interaction
    }
  }

  private startTicking() {
    this.stopTicking();
    let tick = true;
    this.intervalId = window.setInterval(() => {
      this.playSingleClick(tick ? 2400 : 1900, 0.02);
      tick = !tick;
    }, 500); // 120 BPM gentle tick
  }

  private stopTicking() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

export const watchAudio = new WatchAudioController();

export interface NavigationProps {
  className?: string;
}

export const Navigation: React.FC<NavigationProps> = ({ className = '' }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  const activeSectionRef = useRef('hero');
  const isScrolledRef = useRef(false);

  useEffect(() => {
    let ticking = false;
    const sections = ['hero', 'philosophy', 'movement', 'craftsmanship', 'nocturne', 'collection', 'customizer', 'comparator', 'wrist-guide', 'designer', 'reviews', 'footer'];

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        ticking = false;
        const currentScroll = window.scrollY;
        const scrolled = currentScroll > 50;
        if (scrolled !== isScrolledRef.current) {
          isScrolledRef.current = scrolled;
          setIsScrolled(scrolled);
        }

        const scrollPosition = currentScroll + window.innerHeight * 0.35;
        for (let i = sections.length - 1; i >= 0; i--) {
          const section = sections[i];
          const el = document.getElementById(section);
          if (el) {
            const top = el.getBoundingClientRect().top + window.scrollY;
            if (scrollPosition >= top) {
              if (activeSectionRef.current !== section) {
                activeSectionRef.current = section;
                setActiveSection(section);
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
        activeSectionRef.current = customEvent.detail.section;
        setActiveSection(customEvent.detail.section);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('elvara-nav-change', handleNavChange);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('elvara-nav-change', handleNavChange);
    };
  }, []);

  const navLinks = [
    { label: 'ARCHITECTURE', href: '#hero', section: 'hero' },
    { label: 'MOVEMENT', href: '#movement', section: 'movement' },
    { label: 'CRAFT', href: '#craftsmanship', section: 'craftsmanship' },
    { label: 'COLLECTION', href: '#collection', section: 'collection' },
    { label: 'CUSTOMIZER', href: '#customizer', section: 'customizer' },
    { label: 'COMPARE', href: '#comparator', section: 'comparator' },
    { label: 'WRIST GUIDE', href: '#wrist-guide', section: 'wrist-guide' },
    { label: 'ATELIER', href: '#footer', section: 'footer' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, section: string) => {
    e.preventDefault();
    setActiveSection(section);
    navigateToSection(section);
  };

  return (
    <>
      <header
        className={`header-sticky-glass transition-all duration-500 ease-out ${
          isScrolled
            ? 'py-2.5 md:py-3 bg-[#0A0A0A]/85 backdrop-blur-xl border-b border-white/10 shadow-2xl'
            : 'py-3.5 md:py-4 bg-[#0A0A0A]/60 backdrop-blur-md border-b border-white/5'
        } ${className}`}
      >
        <div className="nav-header-container">
          {/* Left Container: Brand Wordmark */}
          <div className="flex items-center flex-shrink-0">
            <a
              href="#hero"
              onClick={(e) => handleNavClick(e, 'hero')}
              className="flex items-center space-x-2 text-white group focus-visible:outline-none"
            >
              <span className="font-display text-xl md:text-2xl tracking-[0.2em] font-light text-white group-hover:text-[var(--color-accent)] transition-colors whitespace-nowrap">
                ÉLVARA
              </span>
            </a>
          </div>

          {/* Center Container: Primary Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center justify-center gap-5 xl:gap-7 flex-1 px-4" aria-label="Main Navigation">
            {navLinks.map((item) => {
              const isActive = activeSection === item.section;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.section)}
                  className={`relative font-nav text-[0.68rem] tracking-[0.18em] py-1 transition-all duration-300 whitespace-nowrap ${
                    isActive
                      ? 'text-[var(--color-accent)] font-semibold'
                      : 'text-white/75 hover:text-white'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-[var(--color-accent)] shadow-[0_0_8px_rgba(229,195,120,0.8)] animate-fadeIn" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Right Container: Action Controls */}
          <div className="flex items-center space-x-3 sm:space-x-4 flex-shrink-0">
            {/* Currency Selector */}
            <CurrencySelector className="hidden sm:inline-flex" />

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-white hover:text-[var(--color-accent)] transition-colors cursor-pointer bg-white/5 border border-white/10 rounded-lg"
              aria-label="Open navigation menu"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <line x1="4" y1="8" x2="20" y2="8" />
                <line x1="4" y1="16" x2="20" y2="16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        items={navLinks}
      />
    </>
  );
};

export default Navigation;
