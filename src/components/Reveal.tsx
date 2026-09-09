import React, { useRef } from 'react';
import { useGSAP, fadeUp, fadeIn, subtleScale, imageReveal, textReveal, staggeredReveal } from '@/animations/gsap';
import { isReducedMotionPreferred } from '@/animations/presets';

export interface RevealProps {
  children: React.ReactNode;
  variant?: 'fadeUp' | 'fadeIn' | 'scale' | 'image' | 'text' | 'stagger';
  delay?: number;
  duration?: number;
  stagger?: number;
  className?: string;
  as?: React.ElementType;
}

export const Reveal: React.FC<RevealProps> = ({
  children,
  variant = 'fadeUp',
  delay = 0,
  duration,
  stagger,
  className = '',
  as: Component = 'div',
}) => {
  const containerRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;
      if (isReducedMotionPreferred()) return;

      const element = containerRef.current;
      const opts = {
        trigger: element,
        delay,
        duration,
        stagger,
      };

      switch (variant) {
        case 'fadeIn':
          fadeIn(element, opts);
          break;
        case 'scale':
          subtleScale(element, opts);
          break;
        case 'image':
          imageReveal(element, opts);
          break;
        case 'text':
          textReveal(element.children.length > 0 ? element.children : element, opts);
          break;
        case 'stagger':
          staggeredReveal(element.children.length > 0 ? element.children : element, opts);
          break;
        case 'fadeUp':
        default:
          fadeUp(element, opts);
          break;
      }
    },
    { dependencies: [variant, delay, duration, stagger] }
  );

  return (
    <Component ref={containerRef} className={className}>
      {children}
    </Component>
  );
};

export default Reveal;
