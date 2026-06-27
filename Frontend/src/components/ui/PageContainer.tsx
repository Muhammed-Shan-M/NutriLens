import React from 'react';
import type { HTMLAttributes } from 'react';

interface PageContainerProps extends HTMLAttributes<HTMLDivElement> {
  animate?: boolean;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  className = '',
  animate = true,
  ...props
}) => {
  const animationStyles = animate ? 'animate-fade-in transition-all duration-300' : '';
  
  return (
    <div
      className={`min-h-full w-full py-4 md:py-6 flex flex-col gap-6 ${animationStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default PageContainer;
