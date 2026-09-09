import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { isReducedMotionPreferred } from '@/animations/presets';
import { navigateToSection } from '@/utils/navigation';

import { CurrencySelector } from '@/context/CurrencyContext';

export interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  items: { label: string; href: string }[];
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, items }) => {
  // Handle Escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleItemClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    onClose();
    setTimeout(() => {
      navigateToSection(href);
    }, 100);
  };

  const reduced = isReducedMotionPreferred();

  const backdropVariants = {
    closed: { opacity: 0 },
    open: { opacity: 1, transition: { duration: reduced ? 0.2 : 0.4 } },
  };

  const itemVariants = {
    closed: { opacity: 0, y: reduced ? 0 : 20 },
    open: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: reduced ? 0 : 0.1 + i * 0.08,
        duration: reduced ? 0.2 : 0.5,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    }),
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={backdropVariants}
          initial="closed"
          animate="open"
          exit="closed"
          className="fixed inset-0 z-50 bg-[var(--color-bg)]/98 backdrop-blur-2xl flex flex-col justify-between p-6 sm:p-8 md:p-12 overflow-y-auto overscroll-contain"
          style={{
            paddingTop: 'max(1.5rem, calc(env(safe-area-inset-top, 0px) + 0.75rem))',
            paddingBottom: 'max(1.5rem, calc(env(safe-area-inset-bottom, 0px) + 0.75rem))',
            paddingLeft: 'max(1.5rem, calc(env(safe-area-inset-left, 0px) + 0.5rem))',
            paddingRight: 'max(1.5rem, calc(env(safe-area-inset-right, 0px) + 0.5rem))',
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between shrink-0">
            <span className="font-eyebrow text-xs text-[var(--color-accent)] tracking-widest font-semibold">
              ÉLVARA • GENÈVE
            </span>
            <div className="flex items-center space-x-3">
              <CurrencySelector variant="full" />
              <button
                onClick={onClose}
                className="p-2.5 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-accent)] cursor-pointer bg-white/5 border border-white/10 rounded-lg min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Close menu"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="my-auto py-6 sm:py-8 flex flex-col space-y-2 sm:space-y-3 md:space-y-4">
            {items.map((item, i) => (
              <motion.div key={item.label} custom={i} variants={itemVariants}>
                <a
                  href={item.href}
                  onClick={(e) => handleItemClick(e, item.href)}
                  className="block font-display text-2xl xs:text-3xl sm:text-4xl text-white hover:text-[var(--color-accent)] transition-colors font-light tracking-wide py-1 focus-visible:outline-none"
                  style={{ fontSize: 'clamp(1.4rem, 5.5vw, 2.25rem)' }}
                >
                  {item.label}
                </a>
              </motion.div>
            ))}
          </nav>

          {/* Footer Info & Creator Credit */}
          <div className="border-t border-white/10 pt-5 sm:pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0">
            <div>
              <span className="font-eyebrow text-xs tracking-widest text-[var(--color-accent)] block mb-1">
                DESIGNED & DEVELOPED BY
              </span>
              <p className="font-body text-sm font-semibold text-white">
                Faseeha Zulaika N
              </p>
              <span className="font-metadata text-[0.68rem] text-white/60 block mt-0.5">
                Manufacture de Haute Horlogerie Genève
              </span>
            </div>
            <a
              href="#footer"
              onClick={(e) => handleItemClick(e, '#footer')}
              className="w-full sm:w-auto px-6 py-3 bg-[var(--color-accent)] text-[#0A0A09] font-metadata text-xs font-semibold tracking-widest uppercase rounded-full text-center min-h-[44px] flex items-center justify-center cursor-pointer"
            >
              Request Consultation
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
