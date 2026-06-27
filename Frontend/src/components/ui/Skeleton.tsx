import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'rectangular' | 'circular' | 'text';
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', variant = 'rectangular' }) => {
  const baseClasses = 'animate-pulse bg-slate-800/80';
  
  let variantClasses = '';
  switch (variant) {
    case 'circular':
      variantClasses = 'rounded-full';
      break;
    case 'text':
      variantClasses = 'rounded h-4 w-full';
      break;
    case 'rectangular':
    default:
      variantClasses = 'rounded-2xl';
      break;
  }

  return (
    <div className={`${baseClasses} ${variantClasses} ${className}`} />
  );
};

export default Skeleton;
