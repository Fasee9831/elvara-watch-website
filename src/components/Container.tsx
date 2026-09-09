import React from 'react';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: 'default' | 'narrow' | 'full';
  as?: React.ElementType;
  children: React.ReactNode;
  className?: string;
}

export const Container: React.FC<ContainerProps> = ({
  width = 'default',
  as: Component = 'div',
  children,
  className = '',
  ...props
}) => {
  const widthClasses = {
    default: 'max-w-[1440px]',
    narrow: 'max-w-[800px]',
    full: 'max-w-none',
  };

  const combinedClassName = `w-full mx-auto px-5 md:px-8 lg:px-12 ${widthClasses[width]} ${className}`.trim();

  return (
    <Component className={combinedClassName} {...props}>
      {children}
    </Component>
  );
};

export default Container;
