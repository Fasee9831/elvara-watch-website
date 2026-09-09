import React, { useCallback, useState, useEffect } from 'react';
import { SmoothScrollProvider } from '@/animations/smoothScroll';
import { initTextReveals } from '@/animations/textReveal';
import { Preloader } from '@/components/Preloader';
import { CustomCursor } from '@/components/CustomCursor';
import { Navigation } from '@/components/Navigation';
import { ScrollProgressHUD } from '@/components/ScrollProgressHUD';
import { PrivateConcierge } from '@/components/PrivateConcierge';
import { CinematicHero } from '@/sections/CinematicHero';
import { BrandStatement } from '@/sections/BrandStatement';
import { MovementReveal } from '@/sections/MovementReveal';
import { CraftsmanshipEditorial } from '@/sections/CraftsmanshipEditorial';
import { NocturneScene } from '@/sections/NocturneScene';
import { CollectionStrip } from '@/sections/CollectionStrip';
import { WatchCustomizer } from '@/sections/WatchCustomizer';
import { WatchComparator } from '@/sections/WatchComparator';
import { WristSizeGuide } from '@/sections/WristSizeGuide';
import { DesignerSpotlight } from '@/sections/DesignerSpotlight';
import { CollectorReviews } from '@/sections/CollectorReviews';
import { Footer } from '@/sections/Footer';

import { CurrencyProvider } from '@/context/CurrencyContext';

export const App: React.FC = () => {
  const [isPreloaderComplete, setIsPreloaderComplete] = useState(false);
  const [isPreloaderVisible, setIsPreloaderVisible] = useState(true);
  const handlePreloaderReveal = useCallback(() => setIsPreloaderComplete(true), []);
  const handlePreloaderComplete = useCallback(() => setIsPreloaderVisible(false), []);

  useEffect(() => {
    const cleanup = initTextReveals();
    return cleanup;
  }, []);

  return (
    <CurrencyProvider>
      <SmoothScrollProvider>
        <div className="site-shell relative min-h-screen w-full max-w-none bg-[#070706] text-[var(--color-text-primary)] select-none overflow-x-clip">
        {/* Cinematic Preloader */}
        {isPreloaderVisible && (
          <Preloader
            onReveal={handlePreloaderReveal}
            onComplete={handlePreloaderComplete}
          />
        )}

        {/* Desktop Luxury Follower Cursor */}
        <CustomCursor />

        {/* Floating Responsive Navigation */}
        <Navigation />

        {/* Persistent Top-to-Bottom Luxury Vertical Scroll Rail */}
        <ScrollProgressHUD />

        {/* Floating Fixed Corner Private Concierge */}
        <PrivateConcierge />

        {/* 🎬 SCENE 01: AURELIA 1 — Primary Opening Watch Film (180-frame canvas scrub) */}
        <div id="hero" data-section="hero" className={isPreloaderComplete ? 'hero-intro-ready' : 'hero-intro-target'}>
          <CinematicHero />
        </div>

        {/* 📖 SCENE 02: Philosophy & Controlled Editorial Stillness */}
        <div id="philosophy" data-section="philosophy">
          <BrandStatement />
        </div>

        {/* ⚙️ SCENE 03: AURELIA 2 — Movement Assembly & Illumination (180-frame canvas scrub) */}
        <div id="movement" data-section="movement">
          <MovementReveal />
        </div>

        {/* 💎 SCENE 04: The Craft & Materiality — Asymmetric Parallax Installation */}
        <div id="craftsmanship" data-section="craftsmanship">
          <CraftsmanshipEditorial />
        </div>

        {/* 🌑 SCENE 05: NOCTURNE — Grand Obsidian Climax Watch Film (180-frame canvas scrub) */}
        <div id="nocturne" data-section="nocturne">
          <NocturneScene />
        </div>

        {/* 🏛️ SCENE 06: The Nine — Pinned Horizontal Exhibition Gallery */}
        <div id="collection" data-section="collection">
          <CollectionStrip />
        </div>

        {/* 🎨 SCENE 07: Interactive Bespoke Watch Customizer Studio */}
        <div id="customizer" data-section="customizer">
          <WatchCustomizer />
        </div>

        {/* ⚖️ SCENE 08: Side-by-Side Model Comparator */}
        <div id="comparator" data-section="comparator">
          <WatchComparator />
        </div>

        {/* 📏 SCENE 09: Interactive Wrist Fit & Proportion Guide */}
        <div id="wrist-guide" data-section="wrist-guide">
          <WristSizeGuide />
        </div>

        {/* 👑 SCENE 10: Designer & Developer Spotlight — Faseeha Zulaika N */}
        <div id="designer" data-section="designer">
          <DesignerSpotlight />
        </div>

        {/* 💬 SCENE 11: Collector Testimonials & Verified Impressions */}
        <div id="reviews" data-section="reviews">
          <CollectorReviews />
        </div>

        {/* ✨ SCENE 12: Private Atelier & Campaign Climax */}
        <div id="footer-anchor" data-section="footer">
          <Footer />
        </div>
      </div>
    </SmoothScrollProvider>
  </CurrencyProvider>
  );
};

export default App;
