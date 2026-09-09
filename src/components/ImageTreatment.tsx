import React, { useRef } from 'react';
import { useGSAP, imageReveal } from '@/animations/gsap';
import { isReducedMotionPreferred } from '@/animations/presets';

export interface ProductImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  aspectRatio?: 'square' | 'portrait' | 'landscape' | 'cinematic';
  darkEdge?: boolean;
  className?: string;
  containerClassName?: string;
}

export const ProductImage: React.FC<ProductImageProps> = ({
  src,
  alt,
  aspectRatio = 'portrait',
  darkEdge = false,
  className = '',
  containerClassName = '',
  ...props
}) => {
  const [isLoaded, setIsLoaded] = React.useState(false);

  const aspectClasses = {
    square: 'aspect-square',
    portrait: 'aspect-[3/4]',
    landscape: 'aspect-[4/3]',
    cinematic: 'aspect-[16/9]',
  };

  return (
    <div
      className={`relative overflow-hidden bg-[var(--color-surface)] border border-[var(--color-border)] ${aspectClasses[aspectRatio]} ${containerClassName}`}
    >
      {!isLoaded && (
        <div className="absolute inset-0 image-loading-placeholder pointer-events-none z-0" />
      )}
      <img
        src={src}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        ref={(el) => {
          if (el && el.complete && el.naturalWidth > 0 && !isLoaded) {
            setIsLoaded(true);
          }
        }}
        className={`w-full h-full object-cover image-cinematic transition-opacity duration-500 relative z-[1] ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${darkEdge ? 'image-dark-edge' : ''} ${className}`}
        loading={props.loading || "eager"}
        decoding="async"
        {...props}
      />
      <div className="absolute inset-0 pointer-events-none lighting-vignette opacity-60 z-[2]" />
    </div>
  );
};

export interface EditorialImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  caption?: string;
  aspectRatio?: 'square' | 'portrait' | 'landscape' | 'cinematic';
  className?: string;
}

export const EditorialImage: React.FC<EditorialImageProps> = ({
  src,
  alt,
  caption,
  aspectRatio = 'landscape',
  className = '',
  ...props
}) => {
  const [isLoaded, setIsLoaded] = React.useState(false);

  const aspectClasses = {
    square: 'aspect-square',
    portrait: 'aspect-[3/4]',
    landscape: 'aspect-[16/10]',
    cinematic: 'aspect-[21/9]',
  };

  return (
    <figure className={`space-y-3 ${className}`}>
      <div
        className={`relative overflow-hidden bg-[var(--color-bg-elevated)] border border-[var(--color-border)] ${aspectClasses[aspectRatio]}`}
      >
        {!isLoaded && (
          <div className="absolute inset-0 image-loading-placeholder pointer-events-none z-0" />
        )}
        <img
          src={src}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          ref={(el) => {
            if (el && el.complete && el.naturalWidth > 0 && !isLoaded) {
              setIsLoaded(true);
            }
          }}
          className={`w-full h-full object-cover image-cinematic transition-opacity duration-500 relative z-[1] ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading={props.loading || "eager"}
          decoding="async"
          {...props}
        />
        <div className="absolute inset-0 pointer-events-none lighting-vignette opacity-40 z-[2]" />
      </div>
      {caption && (
        <figcaption className="font-caption text-right text-[var(--color-text-muted)]">
          {caption}
        </figcaption>
      )}
    </figure>
  );
};

export interface ImageRevealProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export const ImageReveal: React.FC<ImageRevealProps> = ({
  children,
  delay = 0,
  duration,
  className = '',
}) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      if (!ref.current) return;
      if (isReducedMotionPreferred()) return;

      imageReveal(ref.current, {
        trigger: ref.current,
        delay,
        duration,
      });
    },
    { dependencies: [delay, duration] }
  );

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      {children}
    </div>
  );
};
