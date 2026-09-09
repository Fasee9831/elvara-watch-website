import React from 'react';

export type SurfaceVariant = 'default' | 'elevated' | 'glass' | 'editorial';

export interface SurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: SurfaceVariant;
  padding?: 'none' | 'small' | 'default' | 'large';
  as?: React.ElementType;
  children: React.ReactNode;
  className?: string;
}

const variantMap: Record<SurfaceVariant, string> = {
  default: 'bg-[var(--color-surface)] border border-[var(--color-border)]',
  elevated: 'bg-[var(--color-bg-elevated)] border border-[var(--color-border-subtle)] shadow-2xl',
  glass: 'glass-dark border border-[var(--color-border)]',
  editorial: 'bg-[var(--color-bg)] border-y border-[var(--color-border-subtle)]',
};

const paddingMap = {
  none: 'p-0',
  small: 'p-4 md:p-6',
  default: 'p-6 md:p-10',
  large: 'p-8 md:p-14 lg:p-20',
};

export const Surface: React.FC<SurfaceProps> = ({
  variant = 'default',
  padding = 'default',
  as: Component = 'div',
  children,
  className = '',
  ...props
}) => {
  const combinedClassName = `relative transition-colors duration-300 ${variantMap[variant]} ${paddingMap[padding]} ${className}`.trim();

  return (
    <Component className={combinedClassName} {...props}>
      {children}
    </Component>
  );
};

export default Surface;
