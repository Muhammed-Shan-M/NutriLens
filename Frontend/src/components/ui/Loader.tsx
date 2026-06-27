import React from 'react';
import Spinner from './Spinner.tsx';

interface LoaderProps {
  fullscreen?: boolean;
  message?: string;
}

export const Loader: React.FC<LoaderProps> = ({ 
  fullscreen = false, 
  message = 'Loading NutriLens...' 
}) => {
  const containerStyles = fullscreen
    ? 'fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-md'
    : 'flex flex-col items-center justify-center p-8 w-full';

  return (
    <div className={containerStyles}>
      <div className="flex flex-col items-center gap-4">
        {/* Triple expanding pulse ring around spinner */}
        <div className="relative flex items-center justify-center h-16 w-16">
          <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping opacity-75" />
          <div className="absolute h-10 w-10 rounded-full bg-secondary/10 animate-pulse" />
          <Spinner className="h-8 w-8 text-primary relative z-10" />
        </div>
        {message && (
          <p className="text-sm font-medium text-slate-400 animate-pulse">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default Loader;
