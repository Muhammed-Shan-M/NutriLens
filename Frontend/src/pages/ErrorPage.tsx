import React from 'react';
import { useNavigate } from 'react-router-dom';
import ErrorState from '@/components/ui/ErrorState';

export const ErrorPage: React.FC<{ error?: Error }> = ({ error }) => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-red-500/5 blur-[120px] pointer-events-none" />
      <div className="w-full max-w-lg z-10">
        <ErrorState 
          title="Something went wrong"
          description={error?.message || "An unexpected error occurred. Our team has been notified."}
          onRetry={() => window.location.href = '/'}
          retryLabel="Reload Application"
        />
      </div>
    </div>
  );
};

export default ErrorPage;
