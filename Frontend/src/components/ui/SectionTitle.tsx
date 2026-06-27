import React from 'react';
import type { ReactNode } from 'react';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  subtitle,
  action,
  className = '',
}) => {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full mb-2 ${className}`}>
      <div className="space-y-1">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-100">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-slate-400">
            {subtitle}
          </p>
        )}
      </div>
      
      {action && (
        <div className="flex items-center shrink-0">
          {action}
        </div>
      )}
    </div>
  );
};

export default SectionTitle;
