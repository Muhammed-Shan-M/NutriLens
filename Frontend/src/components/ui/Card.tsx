import React from 'react';
import type { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'outlined';
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> & {
  Header: React.FC<HTMLAttributes<HTMLDivElement>>;
  Title: React.FC<HTMLAttributes<HTMLHeadingElement>>;
  Content: React.FC<HTMLAttributes<HTMLDivElement>>;
  Footer: React.FC<HTMLAttributes<HTMLDivElement>>;
} = ({
  children,
  className = '',
  variant = 'default',
  hoverable = false,
  ...props
}) => {
  const baseStyles = 'rounded-3xl overflow-hidden';
  
  const variantStyles = {
    default: 'bg-surface-medium border border-slate-900',
    glass: 'glass-panel',
    outlined: 'border border-slate-800 bg-transparent',
  };

  const hoverStyles = hoverable
    ? 'transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20 hover:border-slate-800'
    : '';

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

const CardHeader: React.FC<HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <div className={`px-6 py-5 border-b border-slate-900/50 ${className}`} {...props}>
    {children}
  </div>
);

const CardTitle: React.FC<HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <h3 className={`text-base font-bold text-slate-100 tracking-wide ${className}`} {...props}>
    {children}
  </h3>
);

const CardContent: React.FC<HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <div className={`p-6 ${className}`} {...props}>
    {children}
  </div>
);

const CardFooter: React.FC<HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <div className={`px-6 py-4 bg-slate-950/20 border-t border-slate-900/40 flex items-center ${className}`} {...props}>
    {children}
  </div>
);

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;
