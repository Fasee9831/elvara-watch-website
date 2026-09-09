import React, { useRef, useEffect, useCallback } from 'react';

/**
 * CustomCursor — High-precision Haute Horlogerie follower cursor.
 * Features a center pinpoint gold dot and a smoothed lagging bezel ring.
 */
export const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({
    dotX: 0,
    dotY: 0,
    ringX: 0,
    ringY: 0,
    targetX: 0,
    targetY: 0,
  });
  const rafRef = useRef<number>(0);

  const isFinePointer =
    typeof window !== 'undefined' &&
    window.matchMedia('(pointer: fine)').matches;

  const animate = useCallback(() => {
    const pos = posRef.current;
    
    // Dot moves instantly with mouse
    pos.dotX = pos.targetX;
    pos.dotY = pos.targetY;

    // Outer bezel ring follows with smooth weighted luxury lag
    pos.ringX += (pos.targetX - pos.ringX) * 0.16;
    pos.ringY += (pos.targetY - pos.ringY) * 0.16;

    if (dotRef.current) {
      dotRef.current.style.transform = `translate3d(${pos.dotX}px, ${pos.dotY}px, 0) translate(-50%, -50%)`;
    }
    if (ringRef.current) {
      ringRef.current.style.transform = `translate3d(${pos.ringX}px, ${pos.ringY}px, 0) translate(-50%, -50%)`;
    }

    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    if (!isFinePointer) return;

    document.body.classList.add('cursor-active');

    const onMouseMove = (e: MouseEvent) => {
      posRef.current.targetX = e.clientX;
      posRef.current.targetY = e.clientY;
    };

    const onMouseEnter = () => {
      if (dotRef.current) dotRef.current.style.opacity = '1';
      if (ringRef.current) ringRef.current.style.opacity = '1';
    };

    const onMouseLeave = () => {
      if (dotRef.current) dotRef.current.style.opacity = '0';
      if (ringRef.current) ringRef.current.style.opacity = '0';
    };

    let cursorState: 'default' | 'hovering' | 'scrubbing' = 'default';

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target || !ringRef.current) return;

      const isInteractive = target.closest('a, button, [role="button"], .cursor-hover, select, input');
      if (isInteractive) {
        if (cursorState !== 'hovering') {
          cursorState = 'hovering';
          ringRef.current.classList.add('is-hovering');
          ringRef.current.classList.remove('is-scrubbing');
        }
        return;
      }

      const isScrubber = target.closest('canvas, .editorial-card, [data-cursor="scrub"]');
      if (isScrubber) {
        if (cursorState !== 'scrubbing') {
          cursorState = 'scrubbing';
          ringRef.current.classList.add('is-scrubbing');
          ringRef.current.classList.remove('is-hovering');
        }
        return;
      }

      if (cursorState !== 'default') {
        cursorState = 'default';
        ringRef.current.classList.remove('is-hovering', 'is-scrubbing');
      }
    };

    document.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseenter', onMouseEnter);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseover', onMouseOver, { passive: true });

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      document.body.classList.remove('cursor-active');
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseenter', onMouseEnter);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseover', onMouseOver);
      cancelAnimationFrame(rafRef.current);
    };
  }, [isFinePointer, animate]);

  if (!isFinePointer) return null;

  return (
    <>
      {/* Center Pinpoint Gold Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] pointer-events-none z-[9999] opacity-0 transition-opacity duration-300"
      />

      {/* Trailing Horological Bezel Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-7 h-7 rounded-full border border-[var(--color-accent)]/50 pointer-events-none z-[9998] opacity-0 transition-[width,height,background-color,border-color] duration-300 ease-out"
      />
    </>
  );
};

export default CustomCursor;
