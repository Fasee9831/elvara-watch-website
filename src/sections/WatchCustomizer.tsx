import React, { useState, useRef, useEffect } from 'react';
import { watchAudio } from '@/components/Navigation';
import { useGSAP } from '@/animations/gsap';
import { isReducedMotionPreferred } from '@/animations/presets';
import { navigateToSection } from '@/utils/navigation';
import { useCurrency, CurrencySelector } from '@/context/CurrencyContext';
import gsap from 'gsap';

import { formatRawPrice } from '@/utils/currency';
import { type CountryPriceMatrix } from '@/data/watches';

interface AtelierEdition {
  id: string;
  name: string;
  material: string;
  shortMaterial: string;
  colorHex: string;
  glowColor: string;
  basePriceUSD: number;
  prices: CountryPriceMatrix;
  calibre: string;
  powerReserve: string;
  beatSpeed: string;
  handcraftHours: string;
  perspectives: {
    label: string;
    image: string;
    desc: string;
  }[];
}

const EDITIONS: AtelierEdition[] = [
  {
    id: 'yellow-gold',
    name: '18K Solid Yellow Gold',
    material: 'Solid 18K Yellow Gold (750)',
    shortMaterial: '18K Gold (750)',
    colorHex: '#E5C378',
    glowColor: 'rgba(229, 195, 120, 0.25)',
    basePriceUSD: 599,
    prices: {
      INR: 48995,
      USD: 599,
      GBP: 539,
      EUR: 629,
      CHF: 629,
      JPY: 96800,
      CAD: 899,
      AUD: 999,
      SGD: 899,
      AED: 2699,
    },
    calibre: 'Cal. 01-AU Classic',
    powerReserve: '72H Twin Barrel',
    beatSpeed: '28,800 VPH (4.0 Hz)',
    handcraftHours: '450H Hand-Finished',
    perspectives: [
      {
        label: 'SKELETON DIAL',
        image: '/images/close-up-clock-with-time-change.jpg',
        desc: '18K solid yellow gold skeleton dial with hand-beveled bridges.',
      },
      {
        label: 'CALIBRE ARCHITECTURE',
        image: '/frames/aurelia-1/frame_090.webp',
        desc: 'Openworked Calibre 01-AU with 33 synthetic ruby jewel bearings.',
      },
      {
        label: 'FRENCH SADDLERY',
        image: '/frames/aurelia-1/frame_001.webp',
        desc: 'Hand-stitched French saddlery alligator leather with 18K gold clasp.',
      },
    ],
  },
  {
    id: 'royal-rose',
    name: '18K Royal Rose Gold',
    material: '18K Royal Rose Gold (750)',
    shortMaterial: '18K Rose Gold (750)',
    colorHex: '#E0A899',
    glowColor: 'rgba(224, 168, 153, 0.25)',
    basePriceUSD: 649,
    prices: {
      INR: 54995,
      USD: 649,
      GBP: 589,
      EUR: 689,
      CHF: 689,
      JPY: 104800,
      CAD: 979,
      AUD: 1099,
      SGD: 979,
      AED: 2949,
    },
    calibre: 'Cal. 02-AU Squelette',
    powerReserve: '72H Twin Barrel',
    beatSpeed: '28,800 VPH (4.0 Hz)',
    handcraftHours: '480H Hand-Finished',
    perspectives: [
      {
        label: 'SKELETON DIAL',
        image: '/images/watch2.jpg',
        desc: '18K royal rose gold openwork dial with luminous sapphire hands.',
      },
      {
        label: 'CALIBRE ARCHITECTURE',
        image: '/frames/aurelia-2/frame_080.webp',
        desc: 'High-torque twin-barrel architecture delivering 72H power reserve.',
      },
      {
        label: 'FRENCH SADDLERY',
        image: '/frames/aurelia-2/frame_160.webp',
        desc: 'Cognac vegetal-tanned French calfskin with 18K rose gold buckle.',
      },
    ],
  },
  {
    id: 'obsidian-titanium',
    name: 'DLC Obsidian Titanium',
    material: 'Grade 5 DLC Obsidian Titanium',
    shortMaterial: 'DLC Titanium Gr.5',
    colorHex: '#52524E',
    glowColor: 'rgba(100, 100, 95, 0.25)',
    basePriceUSD: 499,
    prices: {
      INR: 41995,
      USD: 499,
      GBP: 449,
      EUR: 529,
      CHF: 529,
      JPY: 79800,
      CAD: 749,
      AUD: 849,
      SGD: 749,
      AED: 2249,
    },
    calibre: 'Cal. 05-NC Obsidian',
    powerReserve: '68H High-Torque',
    beatSpeed: '28,800 VPH (4.0 Hz)',
    handcraftHours: '420H Hand-Finished',
    perspectives: [
      {
        label: 'SKELETON DIAL',
        image: '/images/closeup-shot-hand-watch-with-bstrap-reflective-surface.jpg',
        desc: 'Obsidian black open dial with champagne gold chronograph subdials.',
      },
      {
        label: 'CALIBRE ARCHITECTURE',
        image: '/frames/nocturne/frame_060.webp',
        desc: 'Grade 5 titanium column-wheel stopwatch mechanism.',
      },
      {
        label: 'FRENCH SADDLERY',
        image: '/frames/nocturne/frame_120.webp',
        desc: 'DLC diamond-coated titanium bracelet with micro-adjustment clasp.',
      },
    ],
  },
  {
    id: 'surgical-platinum',
    name: 'Platinum & Surgical Steel',
    material: '316L Surgical Steel & Platinum',
    shortMaterial: 'Platinum & 316L Steel',
    colorHex: '#CBD5E1',
    glowColor: 'rgba(203, 213, 225, 0.25)',
    basePriceUSD: 399,
    prices: {
      INR: 34995,
      USD: 399,
      GBP: 369,
      EUR: 429,
      CHF: 429,
      JPY: 64800,
      CAD: 599,
      AUD: 679,
      SGD: 599,
      AED: 1799,
    },
    calibre: 'Cal. 03-MD Platinum',
    powerReserve: '65H Constant Force',
    beatSpeed: '28,800 VPH (4.0 Hz)',
    handcraftHours: '380H Hand-Finished',
    perspectives: [
      {
        label: 'SKELETON DIAL',
        image: '/images/beautiful-rendering-steel-object.jpg',
        desc: 'Surgical 316L steel & platinum dial with mirror-polished indices.',
      },
      {
        label: 'CALIBRE ARCHITECTURE',
        image: '/images/watch1.jpg',
        desc: 'Constant-force platinum tourbillon movement calibrated to COSC.',
      },
      {
        label: 'FRENCH SADDLERY',
        image: '/images/pat-taylor-12V36G17IbQ-unsplash.jpg',
        desc: 'Milanese woven surgical mesh bracelet conforming to the wrist.',
      },
    ],
  },
];

/**
 * WatchCustomizer — Chapter VII: Atelier Bespoke Commission.
 * Scaled down proportionally to fit gracefully within a single session with refined luxury aesthetics.
 */
export const WatchCustomizer: React.FC = () => {
  const [selectedEdition, setSelectedEdition] = useState<AtelierEdition>(EDITIONS[0]);
  const [activePerspectiveIdx, setActivePerspectiveIdx] = useState<number>(0);
  const [engraving, setEngraving] = useState<string>('ÉLVARA');
  const [isSaved, setIsSaved] = useState(false);

  const { currency } = useCurrency();
  const sectionRef = useRef<HTMLDivElement>(null);

  // Listen for global watch selection requests from navigation / chatbot
  useEffect(() => {
    const handleSelectWatch = (e: Event) => {
      const custom = e as CustomEvent<{ watchId: string }>;
      if (custom.detail?.watchId) {
        const id = custom.detail.watchId.toLowerCase();
        if (id.includes('nocturne')) {
          setSelectedEdition(EDITIONS.find((e) => e.id === 'obsidian-titanium') || EDITIONS[0]);
        } else if (id.includes('aurelia') || id.includes('solenne')) {
          setSelectedEdition(EDITIONS.find((e) => e.id === 'yellow-gold') || EDITIONS[0]);
        } else if (id.includes('rose') || id.includes('azurel')) {
          setSelectedEdition(EDITIONS.find((e) => e.id === 'royal-rose') || EDITIONS[0]);
        } else {
          setSelectedEdition(EDITIONS.find((e) => e.id === 'surgical-platinum') || EDITIONS[0]);
        }
        setActivePerspectiveIdx(0);
      }
    };
    window.addEventListener('elvara-select-watch', handleSelectWatch);
    return () => window.removeEventListener('elvara-select-watch', handleSelectWatch);
  }, []);

  const handleSelectEdition = (edition: AtelierEdition) => {
    setSelectedEdition(edition);
    setActivePerspectiveIdx(0);
    watchAudio.playSingleClick(2400, 0.02);
  };

  const handleSelectPerspective = (idx: number) => {
    setActivePerspectiveIdx(idx);
    watchAudio.playSingleClick(2000, 0.015);
  };

  const handleCommission = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
    navigateToSection('footer');
  };

  // Smooth Staggered Scroll Entrance (Once triggered, remains locked & visible)
  useGSAP(
    () => {
      if (isReducedMotionPreferred()) return;
      const section = sectionRef.current;
      if (!section) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none none',
          once: true,
        },
      });

      tl.fromTo(
        section.querySelector('.customizer-eyebrow'),
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.65, ease: 'power3.out' }
      )
        .fromTo(
          section.querySelector('.customizer-title'),
          { y: 28, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.85, ease: 'power3.out' },
          '-=0.35'
        )
        .fromTo(
          section.querySelector('.customizer-desc'),
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.75, ease: 'power3.out' },
          '-=0.45'
        )
        .fromTo(
          section.querySelectorAll('.customizer-card-anim'),
          { y: 32, opacity: 0, scale: 0.97 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.85,
            ease: 'power3.out',
            stagger: 0.12,
          },
          '-=0.4'
        );
    },
    { dependencies: [] }
  );

  const currentPerspective =
    selectedEdition.perspectives[activePerspectiveIdx] || selectedEdition.perspectives[0];

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[#070706] text-white py-12 sm:py-14 md:py-16 border-t border-b border-white/[0.08] overflow-hidden"
      aria-label="Chapter VII: Atelier Bespoke Commission"
    >
      {/* Ambient Atelier Studio Backlight */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] rounded-full blur-[140px] pointer-events-none transition-colors duration-700 opacity-20 z-0"
        style={{ backgroundColor: selectedEdition.colorHex }}
      />

      {/* Main Centered Proportional Container */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* =========================================================
            1. HEADER (Proportional & Compact with Multi-Element Reveal)
           ========================================================= */}
        <div className="text-center max-w-xl mx-auto mb-5 sm:mb-6">
          <div className="customizer-eyebrow inline-flex items-center space-x-1.5 bg-white/[0.04] border border-white/10 px-2.5 py-0.5 rounded-full mb-1.5 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] animate-pulse" />
            <span className="font-metadata text-[0.5rem] sm:text-[0.55rem] tracking-[0.2em] text-[var(--color-accent)] font-semibold uppercase">
              CHAPTER VII • ATELIER BESPOKE COMMISSION
            </span>
          </div>

          <h2 className="customizer-title font-cinzel text-xl sm:text-2xl md:text-[1.75rem] font-normal text-white tracking-[0.08em] leading-tight text-shadow-cinematic mb-1">
            THE ART OF BESPOKE HOROLOGY
          </h2>

          <p className="customizer-desc font-sans text-[0.62rem] sm:text-[0.68rem] text-white/60 font-light max-w-md mx-auto">
            Tailor metallurgies, openwork calibres, and bespoke monogram engravings.
          </p>
        </div>

        {/* =========================================================
            2. MAIN 2-COLUMN ATELIER SALON (Condensed & Balanced)
           ========================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-4 lg:gap-5 items-stretch">
          
          {/* -------------------------------------------------------
              LEFT: Hero Timepiece Showcase (5 Cols)
             ------------------------------------------------------- */}
          <div className="customizer-card-anim lg:col-span-5 bg-[#0B0B0A]/95 border border-white/10 rounded-xl p-3 sm:p-3.5 flex flex-col justify-between shadow-2xl backdrop-blur-xl relative overflow-hidden group">
            
            {/* Top Micro Badges */}
            <div className="flex justify-between items-center w-full mb-2">
              <span className="font-metadata text-[0.45rem] sm:text-[0.48rem] tracking-wider bg-black/70 border border-white/10 px-2 py-0.5 rounded-full text-white/75 font-medium uppercase">
                GENÈVE ATELIER PRIVÉ
              </span>
              <span className="font-metadata text-[0.45rem] sm:text-[0.48rem] tracking-wider text-[var(--color-accent)] font-semibold bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30 px-2 py-0.5 rounded-full uppercase">
                PIÈCE UNIQUE
              </span>
            </div>

            {/* Central Timepiece Display */}
            <div className="relative w-full aspect-[16/10] max-h-[140px] sm:max-h-[155px] md:max-h-[165px] overflow-hidden rounded-lg border border-white/10 bg-[#141413] shadow-inner my-auto">
              <div className="absolute inset-0 image-loading-placeholder pointer-events-none z-0" />
              <img
                src={currentPerspective.image}
                alt={selectedEdition.name}
                loading="eager"
                decoding="async"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/images/beautiful-rendering-steel-object.jpg';
                }}
                className="w-full h-full object-cover filter contrast-[1.04] brightness-[0.96] transition-all duration-700 ease-out group-hover:scale-105 relative z-[1]"
              />
              <div
                className="absolute inset-1.5 rounded-md border pointer-events-none transition-all duration-500 opacity-40 shadow-sm z-[2]"
                style={{ borderColor: selectedEdition.colorHex }}
              />
            </div>

            {/* Perspective Angle Switcher */}
            <div className="flex justify-center gap-1 mt-2">
              {selectedEdition.perspectives.map((p, idx) => {
                const isActive = activePerspectiveIdx === idx;
                return (
                  <button
                    key={p.label}
                    onClick={() => handleSelectPerspective(idx)}
                    className={`px-2 py-0.5 rounded text-[0.46rem] sm:text-[0.5rem] font-metadata tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-[var(--color-accent)] text-[#070706] font-bold shadow-sm'
                        : 'bg-black/50 text-white/60 hover:text-white border border-white/10'
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>

            {/* Caption */}
            <p className="font-serif text-[0.48rem] sm:text-[0.52rem] text-white/60 text-center mt-1.5 italic leading-snug">
              "{currentPerspective.desc}"
            </p>
          </div>

          {/* -------------------------------------------------------
              RIGHT: Atelier Configurator Suite (7 Cols)
             ------------------------------------------------------- */}
          <div className="customizer-card-anim lg:col-span-7 flex flex-col justify-between space-y-2.5 sm:space-y-3">
            
            {/* 1. Metallurgy Selection (Clean 2x2 Grid) */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-metadata text-[0.5rem] sm:text-[0.54rem] tracking-[0.16em] text-[var(--color-accent)] font-semibold uppercase">
                  01 • SELECT METALLURGY
                </span>
                <span className="font-mono text-[0.46rem] sm:text-[0.5rem] text-white/50">
                  {selectedEdition.material}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                {EDITIONS.map((ed) => {
                  const isSelected = selectedEdition.id === ed.id;
                  return (
                    <button
                      key={ed.id}
                      onClick={() => handleSelectEdition(ed)}
                      className={`p-2 sm:p-2.5 rounded-lg border text-left transition-all duration-200 cursor-pointer flex items-center space-x-2 ${
                        isSelected
                          ? 'bg-[#141412] border-[var(--color-accent)] shadow-[0_0_12px_rgba(229,195,120,0.15)] ring-1 ring-[var(--color-accent)]/40'
                          : 'bg-[#0B0B0A]/80 border-white/10 hover:border-white/20 hover:bg-white/[0.03]'
                      }`}
                    >
                      <div
                        className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border flex-shrink-0 transition-transform ${
                          isSelected ? 'scale-110 border-white shadow-sm ring-1 ring-[var(--color-accent)]/40' : 'border-white/30'
                        }`}
                        style={{ backgroundColor: ed.colorHex }}
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="font-sans text-[0.6rem] sm:text-[0.65rem] font-semibold text-white leading-tight truncate">
                          {ed.name}
                        </h4>
                        <span className="font-metadata text-[0.46rem] sm:text-[0.5rem] text-white/50 block leading-tight truncate">
                          {ed.shortMaterial}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Streamlined Calibre Telemetry Strip */}
            <div className="bg-[#0B0B0A]/90 border border-white/10 rounded-lg p-2 sm:p-2.5">
              <div className="flex justify-between items-center mb-1 pb-0.5 border-b border-white/[0.08]">
                <span className="font-metadata text-[0.46rem] sm:text-[0.5rem] tracking-wider text-[var(--color-accent)] font-semibold uppercase">
                  02 • ATELIER CALIBRE SPECIFICATIONS
                </span>
                <span className="font-mono text-[0.46rem] sm:text-[0.5rem] text-white/70">
                  {selectedEdition.calibre}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 text-center">
                <div className="bg-white/[0.02] border border-white/5 rounded p-1">
                  <span className="font-metadata text-[0.4rem] sm:text-[0.44rem] text-white/40 block uppercase">FREQUENCY</span>
                  <span className="font-mono text-[0.5rem] sm:text-[0.54rem] font-medium text-white">{selectedEdition.beatSpeed}</span>
                </div>
                <div className="bg-white/[0.02] border border-white/5 rounded p-1">
                  <span className="font-metadata text-[0.4rem] sm:text-[0.44rem] text-white/40 block uppercase">AUTONOMY</span>
                  <span className="font-mono text-[0.5rem] sm:text-[0.54rem] font-medium text-white">{selectedEdition.powerReserve}</span>
                </div>
                <div className="bg-white/[0.02] border border-white/5 rounded p-1">
                  <span className="font-metadata text-[0.4rem] sm:text-[0.44rem] text-white/40 block uppercase">METALLURGY</span>
                  <span className="font-sans text-[0.48rem] sm:text-[0.52rem] font-medium text-white truncate block">{selectedEdition.shortMaterial}</span>
                </div>
                <div className="bg-white/[0.02] border border-white/5 rounded p-1">
                  <span className="font-metadata text-[0.4rem] sm:text-[0.44rem] text-white/40 block uppercase">ATELIER WORK</span>
                  <span className="font-mono text-[0.5rem] sm:text-[0.54rem] font-medium text-[var(--color-accent)]">{selectedEdition.handcraftHours}</span>
                </div>
              </div>
            </div>

            {/* 3. Integrated Engraving, Price & Action CTA */}
            <div className="bg-[#0B0B0A]/95 border border-white/10 rounded-lg p-2 sm:p-2.5 flex flex-col space-y-2">
              
              <div className="flex items-center justify-between gap-2">
                {/* Monogram Engraving */}
                <div className="flex items-center space-x-1.5">
                  <span className="font-metadata text-[0.46rem] sm:text-[0.5rem] text-white/60 whitespace-nowrap uppercase">
                    ENGRAVING:
                  </span>
                  <input
                    type="text"
                    maxLength={12}
                    value={engraving}
                    onChange={(e) => setEngraving(e.target.value.toUpperCase())}
                    placeholder="INITIALS"
                    className="bg-white/5 border border-white/15 px-1.5 py-0.5 rounded text-[0.52rem] sm:text-[0.56rem] font-mono tracking-widest text-[var(--color-accent)] focus:outline-none focus:border-[var(--color-accent)] w-20 sm:w-24 uppercase text-center"
                  />
                </div>

                {/* Price & Currency */}
                <div className="flex items-center space-x-2 ml-auto">
                  <CurrencySelector />

                  <span className="font-cinzel text-base sm:text-lg text-gold-bright font-medium tracking-tight whitespace-nowrap">
                    {formatRawPrice(
                      selectedEdition.prices[currency] || selectedEdition.basePriceUSD,
                      currency
                    )}
                  </span>
                </div>
              </div>

              {/* Commission CTA */}
              <button
                onClick={handleCommission}
                className="luxury-btn-primary w-full py-1.5 sm:py-2 px-3 font-sans text-[0.56rem] sm:text-[0.62rem] font-bold tracking-[0.16em] uppercase rounded-md transition-all shadow-md text-center cursor-pointer"
              >
                {isSaved ? 'COMMISSION RECORDED ✓' : 'COMMISSION THIS BESPOKE TIMEPIECE →'}
              </button>

            </div>

            {/* Certification Footer Note */}
            <div className="text-center pt-0.5">
              <span className="font-metadata text-[0.44rem] sm:text-[0.48rem] text-white/35 tracking-[0.22em] uppercase">
                GENÈVE HAUTE HORLOGERIE • POINÇON DE GENÈVE CERTIFIED
              </span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default WatchCustomizer;