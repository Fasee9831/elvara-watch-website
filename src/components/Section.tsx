import React from 'react';

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  bg?: 'default' | 'elevated' | 'surface';
  padding?: 'none' | 'small' | 'default' | 'large';
  as?: React.ElementType;
  children: React.ReactNode;
  className?: string;
}

export const Section = React.forwardRef<HTMLElement, SectionProps>(({
  bg = 'default',
  padding = 'default',
  as: Component = 'section',
  children,
  className = '',
  ...props
}, ref) => {
  const bgClasses = {
    default: 'bg-[var(--color-bg)]',
    elevated: 'bg-[var(--color-bg-elevated)]',
    surface: 'bg-[var(--color-surface)]',
  };

  const paddingClasses = {
    none: 'py-0',
    small: 'py-10 md:py-16',
    default: 'py-16 md:py-24 lg:py-32',
    large: 'py-24 md:py-36 lg:py-48',
  };

  const combinedClassName = `relative w-full ${bgClasses[bg]} ${paddingClasses[padding]} ${className}`.trim();

  return (
    <Component ref={ref} className={combinedClassName} {...props}>
      {children}
    </Component>
  );
});

Section.displayName = 'Section';

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 6 | 12;
  gap?: 'small' | 'default' | 'large';
  children: React.ReactNode;
  className?: string;
}

export const Grid: React.FC<GridProps> = ({
  cols = 12,
  gap = 'default',
  children,
  className = '',
  ...props
}) => {
  const gapClasses = {
    small: 'gap-4 md:gap-6',
    default: 'gap-6 md:gap-8 lg:gap-10',
    large: 'gap-8 md:gap-12 lg:gap-16',
  };

  const colsClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    6: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
    12: 'grid-cols-12',
  };

  const combinedClassName = `grid ${colsClasses[cols]} ${gapClasses[gap]} ${className}`.trim();

  return (
    <div className={combinedClassName} {...props}>
      {children}
    </div>
  );
};

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: 'small' | 'default' | 'large';
  align?: 'start' | 'center' | 'end';
  children: React.ReactNode;
  className?: string;
}

export const Stack: React.FC<StackProps> = ({
  gap = 'default',
  align = 'start',
  children,
  className = '',
  ...props
}) => {
  const gapClasses = {
    small: 'space-y-3 md:space-y-4',
    default: 'space-y-6 md:space-y-8',
    large: 'space-y-10 md:space-y-14',
  };

  const alignClasses = {
    start: 'items-start text-left',
    center: 'items-center text-center',
    end: 'items-end text-right',
  };

  const combinedClassName = `flex flex-col ${alignClasses[align]} ${gapClasses[gap]} ${className}`.trim();

  return (
    <div className={combinedClassName} {...props}>
      {children}
    </div>
  );
};

export default Section;
