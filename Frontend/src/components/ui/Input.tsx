import React, { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, rightIcon, className = '', containerClassName = '', type = 'text', ...props }, ref) => {
    return (
      <div className={`flex flex-col w-full gap-1.5 ${containerClassName}`}>
        {label && (
          <label className="text-xs font-semibold text-slate-400 tracking-wider uppercase ml-1">
            {label}
          </label>
        )}
        
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-4 text-slate-500 pointer-events-none flex items-center">
              {leftIcon}
            </div>
          )}
          
          <input
            type={type}
            ref={ref}
            className={`w-full bg-surface-medium border rounded-2xl px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-all duration-200
              ${leftIcon ? 'pl-11' : ''} 
              ${rightIcon ? 'pr-11' : ''} 
              ${error 
                ? 'border-warning/50 focus:border-warning focus:ring-1 focus:ring-warning/20' 
                : 'border-slate-800 focus:border-primary/50 focus:ring-1 focus:ring-primary/10'
              }
              ${className}
            `}
            {...props}
          />
          
          {rightIcon && (
            <div className="absolute right-4 text-slate-500 flex items-center z-10">
              {rightIcon}
            </div>
          )}
        </div>
        
        {error && (
          <span className="text-[11px] font-medium text-warning mt-0.5 ml-1">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
