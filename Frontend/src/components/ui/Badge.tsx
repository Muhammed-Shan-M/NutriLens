import React from 'react';
import type { HTMLAttributes } from 'react';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'warning' | 'success' | 'outline' | 'slate';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className = '',
  variant = 'slate',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide';

  const variantStyles = {
    primary: 'bg-primary/10 text-primary border border-primary/20',
    secondary: 'bg-secondary/10 text-secondary border border-secondary/20',
    accent: 'bg-accent/10 text-accent border border-accent/20',
    warning: 'bg-warning/10 text-warning border border-warning/20',
    success: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    outline: 'border border-slate-800 text-slate-400',
    slate: 'bg-surface-high text-slate-300 border border-slate-800/50',
  };

  return (
    <span className={`${baseStyles} ${variantStyles[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
};

export default Badge;
