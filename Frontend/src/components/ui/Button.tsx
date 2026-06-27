import React from 'react';
import type { ButtonHTMLAttributes } from 'react';
import Spinner from './Spinner';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'warning' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  leftIcon,
  rightIcon,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-2xl transition-all duration-250 active:scale-98 disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 cursor-pointer';

  const sizeStyles = {
    sm: 'px-3.5 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base',
  };

  const variantStyles = {
    primary: 'bg-primary text-background hover:bg-primary/95 shadow-md shadow-primary/10 hover:shadow-primary/20 hover:-translate-y-0.5',
    secondary: 'bg-secondary text-background hover:bg-secondary/95 shadow-md shadow-secondary/10 hover:shadow-secondary/20 hover:-translate-y-0.5',
    accent: 'bg-accent text-background hover:bg-accent/95 shadow-md shadow-accent/10 hover:shadow-accent/20 hover:-translate-y-0.5',
    warning: 'bg-warning text-background hover:bg-warning/95 shadow-md shadow-warning/10 hover:shadow-warning/20 hover:-translate-y-0.5',
    outline: 'border border-slate-800 text-slate-200 hover:bg-slate-900/50 hover:border-slate-700',
    ghost: 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {isLoading && (
        <Spinner className="mr-2 h-4 w-4 text-current" />
      )}
      
      {!isLoading && leftIcon && (
        <span className="mr-2 inline-flex">{leftIcon}</span>
      )}
      
      {children}
      
      {!isLoading && rightIcon && (
        <span className="ml-2 inline-flex">{rightIcon}</span>
      )}
    </button>
  );
};

export default Button;
