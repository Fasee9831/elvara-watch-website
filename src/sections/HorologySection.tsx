import React from 'react';
import { AureliaIntroScene } from '@/components/AureliaIntroScene';
import { AureliaMovementScene } from '@/components/AureliaMovementScene';
import { NocturneScene } from '@/components/NocturneScene';
import { PhilosophyStatement } from '@/components/PhilosophyStatement';

export const HorologySection: React.FC = () => {
  return (
    <section id="art-of-time" aria-label="The Art of Time — Horological Experience" className="relative w-full overflow-hidden bg-[#050505]">
      {/* Cinematic Chapter 1: AURELIA 1 Video Scrub */}
      <AureliaIntroScene />

      {/* Cinematic Chapter 2: AURELIA 2 Video Scrub & Mechanical Callouts */}
      <AureliaMovementScene />

      {/* Cinematic Chapter 3: NOCTURNE Video Scrub */}
      <NocturneScene />

      {/* Visual Breathing Space before Philosophy Sign-Off */}
      <div className="w-full h-32 md:h-48 bg-gradient-to-b from-[#050505] via-[#050505] to-[#050505] pointer-events-none" />

      {/* Emotional Philosophy Sign-off */}
      <PhilosophyStatement />
    </section>
  );
};

export default HorologySection;
