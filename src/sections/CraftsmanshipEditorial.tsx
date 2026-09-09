import React, { useRef } from 'react';
import { gsap, useGSAP } from '@/animations/gsap';
import { isReducedMotionPreferred } from '@/animations/presets';

interface CraftItem {
  id: string;
  number: string;
  category: string;
  title: string;
  description: string;
  badge: string;
  badgeAccent?: boolean;
  image: string;
  aspect: string;
}

const CRAFT_ITEMS: CraftItem[] = [
  // Column 1
  {
    id: 'craft-1',
    number: '01 / ARCHITECTURE',
    category: 'SURGICAL GRADE METALLURGY',
    title: 'Surgical Steel & Titanium',
    description: 'Lightweight, rust-proof, and comfortable all day with hand-brushed satin facets.',
    badge: '50M WR',
    image: '/images/beautiful-rendering-steel-object.jpg',
    aspect: 'aspect-[3/4]',
  },
  {
    id: 'craft-2',
    number: '02 / METALLURGY',
    category: 'DIAMOND-LIKE CARBON',
    title: 'Vacuum DLC Hardening',
    description: 'Micro-crystalline carbon bonded at 400°C for exceptional daily scratch resistance.',
    badge: '2000 VHN',
    badgeAccent: true,
    image: '/images/rendering-smart-home-device.jpg',
    aspect: 'aspect-[4/5]',
  },
  {
    id: 'craft-3',
    number: '03 / MIRROR POLISH',
    category: 'BLACK POLISHING',
    title: 'Hand-Chamfered Mirror Anglage',
    description: 'Every internal edge is beveled with gentian wood paste to a flawless optical shine.',
    badge: 'ANGLAGE',
    image: '/images/watch1.jpg',
    aspect: 'aspect-[16/10]',
  },

  // Column 2
  {
    id: 'craft-4',
    number: '04 / FINISHING',
    category: '18K SOLID GOLD SKELETON',
    title: 'Hand-Polished Openwork',
    description: 'Mirror-polished solid gold bridges reflect ambient light at every wrist angle.',
    badge: '18K GOLD',
    badgeAccent: true,
    image: '/images/close-up-clock-with-time-change.jpg',
    aspect: 'aspect-[4/5]',
  },
  {
    id: 'craft-5',
    number: '05 / HAND SEWN',
    category: 'FRENCH SADDLERY',
    title: 'French Patinated Leather',
    description: 'Hand-waxed linen stitching and vegetal-tanned leather that molds softly to your wrist.',
    badge: 'GENÈVE',
    image: '/images/watch2.jpg',
    aspect: 'aspect-[16/10]',
  },
  {
    id: 'craft-6',
    number: '06 / CERTIFICATION',
    category: 'CHRONOMETRIC EXCELLENCE',
    title: 'Geneva Seal Verification',
    description: 'Independently tested for 12 days across 5 positions and 3 temperatures to COSC standards.',
    badge: 'COSC CERTIFIED',
    image: '/images/images.jpg',
    aspect: 'aspect-[3/4]',
  },

  // Column 3
  {
    id: 'craft-7',
    number: '07 / REGULATOR',
    category: 'GRAVITY CANCELLATION',
    title: 'Flying Tourbillon Cage',
    description: 'Ultralight 0.28g titanium carriage rotates 360° every minute for flawless accuracy.',
    badge: 'TOURBILLON',
    image: '/images/pat-taylor-12V36G17IbQ-unsplash.jpg',
    aspect: 'aspect-[3/4]',
  },
  {
    id: 'craft-8',
    number: '08 / BRILLIANCE',
    category: 'HIGH JEWELLERY',
    title: 'Diamond Hour Markers',
    description: 'Flawless baguette-cut natural diamonds invisibly set into deep obsidian glass dials.',
    badge: 'BAGUETTES',
    badgeAccent: true,
    image: '/images/closeup-shot-hand-watch-with-bstrap-reflective-surface.jpg',
    aspect: 'aspect-[4/5]',
  },
  {
    id: 'craft-9',
    number: '09 / CHRONOMETRY',
    category: 'HIGH-BEAT COLUMN WHEEL',
    title: 'Tactile Mechanical Actuation',
    description: 'A solid column wheel delivers an immediate, silky mechanical snap upon actuation.',
    badge: '28,800 VPH',
    image: '/images/montre-daviateur-chronographe-top-gun-miramar2.jpg',
    aspect: 'aspect-[16/10]',
  },
];

interface CraftCardProps {
  item: CraftItem;
  onMouseEnter: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const CraftCard: React.FC<CraftCardProps> = ({
  item,
  onMouseEnter,
  onMouseMove,
  onMouseLeave,
}) => {
  const [isLoaded, setIsLoaded] = React.useState(false);

  return (
    <div
      className={`editorial-card group overflow-hidden rounded-2xl border transition-[border-color,box-shadow] duration-500 ease-out cursor-pointer bg-[#0E0E0D] shadow-2xl ${
        item.badgeAccent
          ? 'border-[var(--color-accent)]/30 hover:border-[var(--color-accent)]/70 hover:shadow-[0_12px_40px_rgba(229,195,120,0.12)]'
          : 'border-white/10 hover:border-white/30 hover:shadow-[0_12px_40px_rgba(0,0,0,0.8)]'
      }`}
      onMouseEnter={onMouseEnter}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <div className={`parallax-img-wrapper ${item.aspect} overflow-hidden rounded-t-2xl bg-[#141413] relative`}>
        {/* Subtle Luxury Image Skeleton Placeholder */}
        {!isLoaded && (
          <div className="absolute inset-0 image-loading-placeholder pointer-events-none z-0" />
        )}
        <div className="parallax-inner w-full h-[120%] relative z-[1]">
          <img
            src={item.image}
            alt={item.title}
            onLoad={() => setIsLoaded(true)}
            ref={(el) => {
              if (el && el.complete && el.naturalWidth > 0 && !isLoaded) {
                setIsLoaded(true);
              }
            }}
            className={`w-full h-full object-cover filter contrast-[1.06] transition-opacity duration-500 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            loading="eager"
            decoding="async"
          />
        </div>
        {/* Subtle Bottom Shadow Sheen */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0D0D0C] to-transparent pointer-events-none z-[2]" />
      </div>
      <div
        className={`p-3.5 sm:p-4 flex justify-between items-center bg-[#0D0D0C] rounded-b-2xl border-t ${
          item.badgeAccent ? 'border-[var(--color-accent)]/15' : 'border-white/5'
        }`}
      >
        <div className="pr-2.5 flex-1">
          <span
            className={`font-metadata block text-[0.58rem] sm:text-[0.62rem] tracking-wider mb-0.5 ${
              item.badgeAccent ? 'text-[var(--color-accent)] font-medium' : 'text-white/50'
            }`}
          >
            {item.number}
          </span>
          <h4 className="font-serif text-sm sm:text-[0.95rem] text-white font-medium tracking-tight leading-snug">{item.title}</h4>
          <p className="font-sans text-[0.7rem] sm:text-[0.74rem] text-white/65 mt-0.5 leading-relaxed">{item.description}</p>
        </div>
        <span
          className={`font-metadata tracking-wider text-[0.56rem] sm:text-[0.6rem] border px-2.5 py-1 rounded-full font-semibold shadow-md whitespace-nowrap ml-2 ${
            item.badgeAccent
              ? 'text-gold-bright border-[var(--color-accent)]/40 bg-[var(--color-accent)]/10'
              : 'text-white border-white/20 bg-white/5'
          }`}
        >
          {item.badge}
        </span>
      </div>
    </div>
  );
};

/**
 * CraftsmanshipEditorial — Asymmetric 3-Column Luxury Watch Gallery (All 9 Items).
 * Provides rich multi-layered spatial depth, tactile micro-interactions, and 100% reachable items.
 */
export const CraftsmanshipEditorial: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleContainerRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const ruleRef = useRef<HTMLDivElement>(null);
  const col1Ref = useRef<HTMLDivElement>(null);
  const col2Ref = useRef<HTMLDivElement>(null);
  const col3Ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (isReducedMotionPreferred() || !sectionRef.current) return;

      // Header sequential reveal timeline
      if (titleContainerRef.current) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: titleContainerRef.current,
            start: 'top 88%',
            toggleActions: 'play none none none',
            once: true,
          },
        });

        // 1. Chapter Pill Badge
        if (badgeRef.current) {
          tl.fromTo(
            badgeRef.current,
            { opacity: 0, y: 15, scale: 0.95 },
            { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power3.out' }
          );
        }

        // 2. Headline Line Reveal (Clean, crisp, no blur)
        if (headlineRef.current) {
          tl.fromTo(
            headlineRef.current,
            { opacity: 0, y: 32 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
            '-=0.3'
          );
        }

        // 3. Description Reveal
        if (descRef.current) {
          tl.fromTo(
            descRef.current,
            { opacity: 0, y: 22 },
            { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out' },
            '-=0.45'
          );
        }

        // 4. Accent Rule Expand
        if (ruleRef.current) {
          tl.fromTo(
            ruleRef.current,
            { scaleX: 0, opacity: 0 },
            { scaleX: 1, opacity: 1, duration: 0.7, ease: 'power3.out' },
            '-=0.35'
          );
        }
      }

      // Column 1 (left): Silky upward parallax scrub
      if (col1Ref.current) {
        gsap.fromTo(
          col1Ref.current,
          { y: 30 },
          {
            y: -30,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.5,
            },
          }
        );
      }

      // Column 2 (center): Subtle counter-rhythm parallax scrub
      if (col2Ref.current) {
        gsap.fromTo(
          col2Ref.current,
          { y: -20 },
          {
            y: 20,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.5,
            },
          }
        );
      }

      // Column 3 (right): Dynamic parallax scrub
      if (col3Ref.current) {
        gsap.fromTo(
          col3Ref.current,
          { y: 40 },
          {
            y: -40,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.5,
            },
          }
        );
      }

      // Inner image smooth depth scrub (scoped to section trigger for maximum performance)
      const imgs = sectionRef.current.querySelectorAll('.parallax-inner');
      if (imgs.length > 0) {
        gsap.fromTo(
          imgs,
          { yPercent: -8, scale: 1.06 },
          {
            yPercent: 8,
            scale: 1.0,
            ease: 'none',
            stagger: {
              each: 0.02,
              from: 'start',
            },
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.5,
            },
          }
        );
      }

      // Smooth luxury card entrance reveals
      const cards = sectionRef.current.querySelectorAll('.editorial-card');
      cards.forEach((card, i) => {
        gsap.fromTo(
          card,
          {
            opacity: 0,
            y: 40,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            delay: (i % 3) * 0.08,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 92%',
              toggleActions: 'play none none none',
              once: true,
            },
          }
        );
      });
    },
    { scope: sectionRef }
  );

  // Subtle 3D mouse tilt handler with cached rect & RAF throttle
  const tiltRafRef = useRef<number | null>(null);
  const currentCardRectRef = useRef<DOMRect | null>(null);

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isReducedMotionPreferred()) return;
    currentCardRectRef.current = e.currentTarget.getBoundingClientRect();
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isReducedMotionPreferred()) return;
    const card = e.currentTarget;
    const clientX = e.clientX;
    const clientY = e.clientY;

    if (tiltRafRef.current) cancelAnimationFrame(tiltRafRef.current);
    tiltRafRef.current = requestAnimationFrame(() => {
      let rect = currentCardRectRef.current;
      if (!rect) {
        rect = card.getBoundingClientRect();
        currentCardRectRef.current = rect;
      }
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -3;
      const rotateY = ((x - centerX) / centerX) * 3;

      gsap.to(card, {
        rotationX: rotateX,
        rotationY: rotateY,
        transformPerspective: 800,
        duration: 0.3,
        ease: 'power1.out',
        overwrite: 'auto',
      });
    });
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    currentCardRectRef.current = null;
    if (isReducedMotionPreferred()) return;
    if (tiltRafRef.current) cancelAnimationFrame(tiltRafRef.current);
    gsap.to(e.currentTarget, {
      rotationX: 0,
      rotationY: 0,
      transformPerspective: 800,
      duration: 0.5,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  };

  React.useEffect(() => {
    CRAFT_ITEMS.forEach((item) => {
      const img = new Image();
      img.src = item.image;
    });
  }, []);

  const col1Items = CRAFT_ITEMS.slice(0, 3);
  const col2Items = CRAFT_ITEMS.slice(3, 6);
  const col3Items = CRAFT_ITEMS.slice(6, 9);

  const renderCard = (item: CraftItem) => (
    <CraftCard
      key={item.id}
      item={item}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    />
  );

  return (
    <section
      ref={sectionRef}
      className="relative py-12 md:py-16 overflow-hidden bg-gradient-to-b from-[#070706] via-[#0D0D0C] to-[#070706]"
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_30%,rgba(200,180,138,0.04)_0%,transparent_60%)]" />

      {/* Section Header */}
      <div ref={titleContainerRef} className="text-center mb-8 md:mb-10 px-6 max-w-2xl mx-auto">
        <div
          ref={badgeRef}
          className="inline-flex items-center space-x-1.5 bg-black/60 backdrop-blur-2xl px-3 py-0.5 border border-white/10 rounded-full shadow-2xl mb-2"
          style={{ opacity: isReducedMotionPreferred() ? 1 : 0 }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] animate-pulse" />
          <span className="font-metadata text-[0.58rem] sm:text-[0.62rem] tracking-[0.2em] text-[var(--color-accent)] font-medium">
            CHAPTER IV • THE CRAFT & MATERIALITY
          </span>
        </div>

        <div className="overflow-hidden mb-1.5">
          <h2
            ref={headlineRef}
            className="text-gold-gradient font-cinzel text-xl sm:text-2xl md:text-3xl font-normal leading-tight text-shadow-cinematic"
          >
            Where patience becomes permanence.
          </h2>
        </div>

        <div className="overflow-hidden">
          <p
            ref={descRef}
            className="font-sans text-[0.72rem] sm:text-xs text-white/75 max-w-lg mx-auto font-light leading-relaxed"
          >
            450 hours of uncompromising hand-finishing, aerospace metallurgy, and Geneva Seal chronometric precision.
          </p>
        </div>

        <div
          ref={ruleRef}
          className="w-14 h-[1px] bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent mx-auto mt-3 origin-center"
        />
      </div>

      {/* Asymmetric 3-column balanced editorial gallery (All 9 Items) */}
      <div className="luxury-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 lg:gap-8 items-start">
          {/* Column 1: Items 1, 2, 3 */}
          <div ref={col1Ref} className="flex flex-col space-y-5 sm:space-y-6 will-change-transform">
            {col1Items.map(renderCard)}
          </div>

          {/* Column 2: Items 4, 5, 6 (Offset for editorial elegance) */}
          <div ref={col2Ref} className="flex flex-col space-y-5 sm:space-y-6 md:pt-8 will-change-transform">
            {col2Items.map(renderCard)}
          </div>

          {/* Column 3: Items 7, 8, 9 */}
          <div ref={col3Ref} className="flex flex-col space-y-5 sm:space-y-6 md:pt-4 will-change-transform">
            {col3Items.map(renderCard)}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CraftsmanshipEditorial;
