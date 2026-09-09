import React, { useRef } from 'react';
import { gsap, useGSAP } from '@/animations/gsap';
import { isReducedMotionPreferred } from '@/animations/presets';
import { navigateToSection } from '@/utils/navigation';

/**
 * Footer — Chapter XII: Private Atelier.
 * Premium scroll-triggered reveal choreography.
 * Exactly preserves existing layout, typography, dimensions, and UI components.
 */
export const Footer: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const ruleRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelLeftRef = useRef<HTMLDivElement>(null);
  const panelInfoRef = useRef<HTMLDivElement>(null);
  const craftRef = useRef<HTMLDivElement>(null);
  const signatureRef = useRef<HTMLDivElement>(null);
  const sigTitleRef = useRef<HTMLHeadingElement>(null);
  const sigSubRef = useRef<HTMLSpanElement>(null);
  const footerBarRef = useRef<HTMLDivElement>(null);

  // Pure scroll-triggered reveal choreography
  useGSAP(
    () => {
      const trigger = sectionRef.current;
      if (!trigger) return;

      if (isReducedMotionPreferred()) {
        gsap.set(
          [
            glowRef.current,
            headerRef.current,
            eyebrowRef.current,
            titleRef.current,
            ruleRef.current,
            descRef.current,
            panelRef.current,
            panelLeftRef.current ? Array.from(panelLeftRef.current.children) : [],
            panelInfoRef.current ? Array.from(panelInfoRef.current.children) : [],
            craftRef.current,
            signatureRef.current,
            sigTitleRef.current,
            sigSubRef.current,
            footerBarRef.current,
          ],
          { opacity: 1, y: 0, scaleX: 1, clearProps: 'all' }
        );
        return;
      }

      // Seamless, luxury-grade 12-step continuous entrance timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: trigger,
          start: 'top 75%',
          toggleActions: 'play none none none',
          once: true,
        },
      });

      // Ambient atmosphere
      if (glowRef.current) {
        tl.fromTo(
          glowRef.current,
          { opacity: 0 },
          { opacity: 0.5, duration: 1.2, ease: 'power2.out' },
          0
        );
      }

      // STEP 1: CHAPTER LABEL (0ms)
      if (eyebrowRef.current) {
        tl.fromTo(
          eyebrowRef.current,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
          0
        );
      }

      // STEP 2: MAIN TITLE (100ms)
      if (titleRef.current) {
        tl.fromTo(
          titleRef.current,
          { opacity: 0, y: 22 },
          { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' },
          0.10
        );
      }

      // STEP 3: SMALL GOLD DIVIDER / LINE (250ms)
      if (ruleRef.current) {
        tl.fromTo(
          ruleRef.current,
          { opacity: 0, scaleX: 0, transformOrigin: 'center' },
          { opacity: 1, scaleX: 1, duration: 0.5, ease: 'power3.out' },
          0.25
        );
      }

      // STEP 4: DESCRIPTION TEXT (350ms)
      if (descRef.current) {
        tl.fromTo(
          descRef.current,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
          0.35
        );
      }

      // STEP 5: MAIN ATELIER PANEL (500ms)
      if (panelRef.current) {
        tl.fromTo(
          panelRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
          0.50
        );
      }

      // STEP 6: PANEL INTERNAL CONTENT (700ms)
      if (panelLeftRef.current) {
        tl.fromTo(
          panelLeftRef.current.children,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.55, stagger: 0.08, ease: 'power3.out' },
          0.70
        );
      }

      // STEP 7: GENÈVE / CONCIERGE REVEAL (850ms)
      if (panelInfoRef.current) {
        tl.fromTo(
          panelInfoRef.current.children,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.55, stagger: 0.08, ease: 'power3.out' },
          0.85
        );
      }

      // STEP 8: CRAFTSMANSHIP STATEMENT (1000ms)
      if (craftRef.current) {
        tl.fromTo(
          craftRef.current,
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
          1.00
        );
      }

      // STEP 9: ÉLVARA SIGNATURE (1200ms)
      if (sigTitleRef.current) {
        tl.fromTo(
          sigTitleRef.current,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' },
          1.20
        );
      }

      // STEP 10: HAUTE HORLOGERIE · GENÈVE (1280ms)
      if (sigSubRef.current) {
        tl.fromTo(
          sigSubRef.current,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' },
          1.28
        );
      }

      // STEP 11: FINAL LEGAL / FOOTER INFORMATION (1350ms)
      if (footerBarRef.current) {
        tl.fromTo(
          footerBarRef.current,
          { opacity: 0, y: 4 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
          1.35
        );
      }

      return () => {
        tl.kill();
      };
    },
    { dependencies: [] }
  );

  return (
    <footer
      id="footer"
      ref={sectionRef}
      className="relative w-full h-[260vh] bg-[#070706] text-[#F2EEE5] border-t border-white/10"
      aria-label="Chapter XII: Private Atelier"
    >
      {/* Sticky Fullscreen Viewport — Locked in place */}
      <div className="viewport-pinned-stage px-4 sm:px-6 md:px-8 bg-[#070706] flex items-center">
        {/* Subtle Atmospheric Radial Glow */}
        <div
          ref={glowRef}
          className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_25%,rgba(200,180,138,0.06)_0%,transparent_65%)]"
        />

        {/* Usable Viewport Shell — Proportioned to fit gracefully within 100vh with zero clipping */}
        <div className="viewport-usable-shell max-w-4xl mx-auto flex flex-col justify-between py-1 sm:py-2 w-full my-auto">
          
          {/* =========================================================
              1. INTRODUCTION — Centered Editorial Opening
             ========================================================= */}
          <div
            ref={headerRef}
            className="flex flex-col items-center text-center max-w-xl mx-auto mb-1.5 sm:mb-2 shrink-0"
          >
            {/* Chapter Eyebrow */}
            <div
              ref={eyebrowRef}
              className="inline-flex items-center space-x-1.5 bg-white/[0.04] border border-white/10 px-2.5 py-0.5 rounded-full mb-1"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] animate-pulse" />
              <span className="font-metadata text-[0.44rem] sm:text-[0.48rem] uppercase tracking-[0.22em] text-[var(--color-accent)] font-medium">
                CHAPTER XII · PRIVATE ATELIER
              </span>
            </div>

            {/* Main Headline */}
            <h2
              ref={titleRef}
              className="text-gold-gradient font-cinzel text-lg sm:text-xl md:text-2xl font-normal leading-tight text-shadow-cinematic mb-0.5 tracking-[0.08em] uppercase"
            >
              Time, Made Personal
            </h2>

            {/* Thin Gold Accent Rule */}
            <div
              ref={ruleRef}
              className="w-8 h-px bg-[var(--color-accent)]/50 my-0.5"
            />

            {/* Supporting Statement */}
            <p
              ref={descRef}
              className="font-sans text-[0.52rem] sm:text-[0.58rem] text-white/70 font-light leading-snug max-w-sm"
            >
              Discover the ÉLVARA private atelier — where collectors,
              craftsmanship, and mechanical expression meet.
            </p>
          </div>

          {/* =========================================================
              2. ATELIER FEATURE PANEL — Sophisticated Horizontal Card
             ========================================================= */}
          <div
            ref={panelRef}
            className="bg-[#0B0B0A]/95 border border-[var(--color-accent)]/20 rounded-xl p-3 sm:p-4 md:p-5 shadow-2xl backdrop-blur-md my-1"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-6 items-center">
              
              {/* Left Side: Private Consultation Overview */}
              <div
                ref={panelLeftRef}
                className="md:col-span-6 flex flex-col justify-center md:border-r border-white/[0.08] md:pr-5"
              >
                <div>
                  <span className="font-metadata text-[0.44rem] sm:text-[0.48rem] uppercase tracking-[0.2em] text-[var(--color-accent)] font-semibold block mb-0.5">
                    THE ÉLVARA ATELIER
                  </span>
                  <h3 className="font-cinzel text-sm sm:text-base md:text-lg font-normal text-white tracking-[0.08em] leading-tight mb-1">
                    Private Consultation
                  </h3>
                  <p className="font-sans text-[0.5rem] sm:text-[0.55rem] text-white/65 font-light leading-relaxed">
                    For collectors seeking a deeper understanding of our
                    movements, materials, and bespoke possibilities,
                    our atelier welcomes private appointments.
                  </p>
                </div>
              </div>

              {/* Right Side: Genève Concierge Info */}
              <div
                ref={panelInfoRef}
                className="md:col-span-6 flex items-center justify-between sm:justify-around gap-4 md:pl-3"
              >
                <div>
                  <span className="font-metadata text-[0.42rem] sm:text-[0.45rem] uppercase tracking-[0.18em] text-white/40 block mb-0.5">
                    GENÈVE
                  </span>
                  <address className="font-sans text-[0.48rem] sm:text-[0.52rem] text-white/70 not-italic leading-tight">
                    Rue du Rhône 42<br />
                    1204 Genève
                  </address>
                </div>

                <div className="text-right">
                  <span className="font-metadata text-[0.42rem] sm:text-[0.45rem] uppercase tracking-[0.18em] text-white/40 block mb-0.5">
                    PRIVATE CONCIERGE
                  </span>
                  <a
                    href="mailto:atelier@elvara.com"
                    className="font-sans text-[0.48rem] sm:text-[0.52rem] text-white/75 hover:text-[var(--color-accent)] transition-colors block leading-tight"
                  >
                    atelier@elvara.com
                  </a>
                  <a
                    href="tel:+41228190000"
                    className="font-mono-num text-[0.48rem] sm:text-[0.52rem] text-[var(--color-accent)] hover:underline block leading-tight mt-0.5"
                  >
                    +41 22 819 00 00
                  </a>
                </div>
              </div>

            </div>
          </div>

          {/* =========================================================
              3. CRAFTSMANSHIP STATEMENT — Subtle Restrained Credo
             ========================================================= */}
          <div
            ref={craftRef}
            className="flex flex-col items-center text-center my-1 shrink-0"
          >
            <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 text-[0.44rem] sm:text-[0.48rem] uppercase tracking-[0.22em] text-white/50 font-light font-sans">
              <span>SCULPTED IN GENEVA.</span>
              <span className="text-[var(--color-accent)]/50">•</span>
              <span>FINISHED BY HAND.</span>
              <span className="text-[var(--color-accent)]/50">•</span>
              <span>MADE FOR A LIFETIME.</span>
            </div>
          </div>

          {/* =========================================================
              4. BRAND SIGNATURE — Low-Contrast Closing Signature
             ========================================================= */}
          <div
            ref={signatureRef}
            className="flex flex-col items-center text-center my-0.5 shrink-0"
          >
            <h3
              ref={sigTitleRef}
              className="font-cinzel text-xl sm:text-2xl md:text-3xl font-normal tracking-[0.22em] leading-none mb-0.5 select-none uppercase text-white/[0.22]"
            >
              ÉLVARA
            </h3>
            <span
              ref={sigSubRef}
              className="font-sans text-[0.42rem] sm:text-[0.46rem] uppercase tracking-[0.26em] text-white/35 font-light"
            >
              HAUTE HORLOGERIE · GENÈVE
            </span>
          </div>

          {/* =========================================================
              5. MINIMAL LEGAL FOOTER STRIP
             ========================================================= */}
          <div
            ref={footerBarRef}
            className="border-t border-white/[0.08] pt-1 sm:pt-1.5 shrink-0 mt-0.5"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-1 text-[0.42rem] sm:text-[0.46rem] text-white/40">
              <span className="font-light text-center sm:text-left">
                © {new Date().getFullYear()} ÉLVARA HAUTE HORLOGERIE GENÈVE. ALL RIGHTS RESERVED.
              </span>

              <div className="flex items-center gap-3 tracking-widest uppercase font-metadata text-[0.4rem] sm:text-[0.44rem]">
                <a href="#footer" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors">PRIVACY</a>
                <span className="text-white/15">·</span>
                <a href="#footer" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors">TERMS</a>
                <span className="text-white/15">·</span>
                <a href="#footer" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors">AUTHENTICITY</a>
              </div>

              <button
                onClick={() => navigateToSection('hero')}
                className="hover:text-[var(--color-accent)] transition-colors cursor-pointer font-metadata tracking-[0.2em] text-[0.42rem] sm:text-[0.46rem] uppercase inline-flex items-center space-x-0.5"
                type="button"
              >
                <span>↑ TOP</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
