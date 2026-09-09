import React from 'react';

export type DividerVariant = 'subtle' | 'accent' | 'editorial';

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: DividerVariant;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export const Divider: React.FC<DividerProps> = ({
  variant = 'subtle',
  orientation = 'horizontal',
  className = '',
  ...props
}) => {
  const variantClasses: Record<DividerVariant, string> = {
    subtle: 'bg-[var(--color-border)]',
    accent: 'bg-[var(--color-accent)]/30',
    editorial: 'bg-[var(--color-border-accent)]',
  };

  const orientationClasses =
    orientation === 'horizontal' ? 'w-full h-[1px] my-6 md:my-10' : 'h-full w-[1px] mx-6 md:mx-10';

  const combinedClassName = `${orientationClasses} ${variantClasses[variant]} ${className}`.trim();

  return <div className={combinedClassName} role="separator" aria-orientation={orientation} {...props} />;
};

export default Divider;
