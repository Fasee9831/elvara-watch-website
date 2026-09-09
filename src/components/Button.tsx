import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { buttonHoverVariants } from '@/animations/motion';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--color-text-primary)] text-[var(--color-bg)] font-medium hover:bg-[var(--color-accent)] hover:text-[var(--color-bg)] border border-[var(--color-text-primary)] hover:border-[var(--color-accent)] shadow-md',
  secondary:
    'bg-transparent text-[var(--color-text-primary)] border border-[var(--color-border)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] hover:bg-[var(--color-accent)]/5',
  ghost:
    'bg-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-white/5 border border-transparent',
};

const sizeClasses: Record<ButtonSize, string> = {
  small: 'px-4 py-2 text-xs tracking-[0.15em] min-h-[38px]',
  medium: 'px-6 py-3 text-xs tracking-[0.2em] min-h-[44px]',
  large: 'px-8 py-4 text-sm tracking-[0.25em] min-h-[52px]',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  children,
  className = '',
  disabled = false,
  ...props
}) => {
  const combinedClassName = `
    inline-flex items-center justify-center
    uppercase font-nav transition-all duration-300
    cursor-pointer select-none
    focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-accent)]
    disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${className}
  `.trim();

  return (
    <motion.button
      variants={buttonHoverVariants}
      initial="initial"
      whileHover={disabled ? undefined : 'hover'}
      whileTap={disabled ? undefined : 'tap'}
      className={combinedClassName}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;
