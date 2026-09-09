import React from 'react';

export interface ProductVisualProps {
  imageSrc?: string;
  alt?: string;
  className?: string;
  model?: string;
  accentColor?: string;
  priority?: boolean;
}

export const WATCH_IMAGES: Record<string, string> = {
  nocturne: '/images/watch1.jpg',
  aurelia: '/images/close-up-clock-with-time-change.jpg',
  eclat: '/images/beautiful-rendering-steel-object.jpg',
  vellum: '/images/closeup-shot-hand-watch-with-bstrap-reflective-surface.jpg',
  avenir: '/images/montre-daviateur-chronographe-top-gun-miramar2.jpg',
  solenne: '/images/pat-taylor-12V36G17IbQ-unsplash.jpg',
  lumiere: '/images/rendering-smart-home-device.jpg',
  terra: '/images/images.jpg',
  astra: '/images/watch2.jpg',
};

export const ProductVisual: React.FC<ProductVisualProps> = ({
  imageSrc,
  alt = 'ÉLVARA Timepiece',
  className = '',
  model = 'nocturne',
  accentColor = 'var(--color-accent)',
}) => {
  const selectedImage = imageSrc || WATCH_IMAGES[model] || WATCH_IMAGES.nocturne;
  const [isLoaded, setIsLoaded] = React.useState(false);

  return (
    <div
      className={`relative w-full max-w-[460px] lg:max-w-[540px] aspect-square mx-auto flex items-center justify-center select-none ${className}`}
    >
      {/* Layer 1: Ambient Backlight & Studio Halo */}
      <div
        className="absolute inset-0 rounded-full bg-radial blur-3xl opacity-50 transform scale-110 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, ${accentColor} 0%, rgba(200, 180, 138, 0.04) 50%, transparent 70%)`,
        }}
      />

      {/* Layer 2: Outer Architectural Accent Frame */}
      <div className="absolute -inset-2 rounded-3xl border border-[var(--color-border-accent)]/20 pointer-events-none" />

      {/* Layer 3: High-Quality Luxury Watch Photography Frame */}
      <div className="relative z-10 w-full h-full rounded-2xl overflow-hidden border border-[var(--color-border)] shadow-[0_25px_60px_rgba(0,0,0,0.85)] bg-[var(--color-surface)]">
        {/* Subtle Luxury Image Skeleton Placeholder */}
        {!isLoaded && (
          <div className="absolute inset-0 image-loading-placeholder pointer-events-none z-0" />
        )}
        <img
          key={selectedImage}
          src={selectedImage}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          ref={(el) => {
            if (el && el.complete && el.naturalWidth > 0 && !isLoaded) {
              setIsLoaded(true);
            }
          }}
          className={`w-full h-full object-cover object-center filter contrast-[1.05] brightness-[0.98] transition-all duration-500 ease-out pointer-events-auto relative z-[1] ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading="eager"
          decoding="async"
        />
        {/* Soft Dark Vignette Overlay for Seamless Dark Luxury Integration */}
        <div className="absolute inset-0 bg-radial from-transparent via-black/10 to-black/50 pointer-events-none z-[2]" />
      </div>

      {/* Layer 4: Subtle Edge Highlight */}
      <div className="absolute inset-0 rounded-2xl border border-[var(--color-text-primary)]/10 pointer-events-none lighting-edge z-20" />
    </div>
  );
};

export default ProductVisual;
