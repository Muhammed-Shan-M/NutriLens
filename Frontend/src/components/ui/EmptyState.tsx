import React from 'react';
import type { ReactNode } from 'react';
import Button from './Button';
import { Database } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No records found',
  description = 'There is no data to show here right now.',
  icon = <Database className="h-10 w-10 text-slate-500" />,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 md:p-12 text-center bg-surface-medium/30 border border-dashed border-slate-800 rounded-3xl w-full ${className}`}>
      <div className="mb-4 p-4 rounded-full bg-slate-900/60 border border-slate-850">
        {icon}
      </div>
      
      <h3 className="text-base font-bold text-slate-200 mb-1">
        {title}
      </h3>
      
      <p className="text-sm text-slate-400 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>

      {actionLabel && onAction && (
        <Button variant="outline" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
