import React from 'react';
import type { ReactNode } from 'react';
import Button from './Button.tsx';
import { AlertCircle } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  retryLabel?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  description = 'An error occurred while loading this section. Please try again.',
  icon = <AlertCircle className="h-10 w-10 text-warning" />,
  retryLabel = 'Try Again',
  onRetry,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 md:p-12 text-center bg-warning/5 border border-dashed border-warning/20 rounded-3xl w-full ${className}`}>
      <div className="mb-4 p-4 rounded-full bg-slate-900/60 border border-slate-850">
        {icon}
      </div>
      
      <h3 className="text-base font-bold text-slate-200 mb-1">
        {title}
      </h3>
      
      <p className="text-sm text-slate-400 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>

      {onRetry && (
        <Button variant="warning" onClick={onRetry}>
          {retryLabel}
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
