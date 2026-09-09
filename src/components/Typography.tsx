import React from 'react';

export type TypographyVariant =
  | 'displayXL'
  | 'displayL'
  | 'displayM'
  | 'headingXL'
  | 'headingL'
  | 'headingM'
  | 'bodyL'
  | 'bodyM'
  | 'bodyS'
  | 'caption'
  | 'eyebrow'
  | 'navigation'
  | 'metadata';

export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: TypographyVariant;
  as?: React.ElementType;
  children: React.ReactNode;
  className?: string;
}

const variantClassMap: Record<TypographyVariant, string> = {
  displayXL: 'font-display-xl text-[var(--color-text-primary)]',
  displayL: 'font-display-l text-[var(--color-text-primary)]',
  displayM: 'font-display-m text-[var(--color-text-primary)]',
  headingXL: 'font-heading-xl text-[var(--color-text-primary)]',
  headingL: 'font-heading-l text-[var(--color-text-primary)]',
  headingM: 'font-heading-m text-[var(--color-text-primary)]',
  bodyL: 'font-body-l',
  bodyM: 'font-body-m',
  bodyS: 'font-body-s',
  caption: 'font-caption',
  eyebrow: 'font-eyebrow',
  navigation: 'font-nav text-[var(--color-text-primary)]',
  metadata: 'font-metadata',
};

const defaultTagMap: Record<TypographyVariant, React.ElementType> = {
  displayXL: 'h1',
  displayL: 'h2',
  displayM: 'h3',
  headingXL: 'h3',
  headingL: 'h4',
  headingM: 'h5',
  bodyL: 'p',
  bodyM: 'p',
  bodyS: 'p',
  caption: 'span',
  eyebrow: 'span',
  navigation: 'span',
  metadata: 'span',
};

export const Typography: React.FC<TypographyProps> = ({
  variant = 'bodyM',
  as,
  children,
  className = '',
  ...props
}) => {
  const Component = as || defaultTagMap[variant];
  const combinedClassName = `${variantClassMap[variant]} ${className}`.trim();

  return (
    <Component className={combinedClassName} {...props}>
      {children}
    </Component>
  );
};

export default Typography;
