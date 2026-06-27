import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import Button from '@/components/ui/Button';

export const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <div className="absolute h-96 w-96 rounded-full bg-warning/5 blur-[100px] pointer-events-none" />
      
      <div className="z-10 space-y-6 flex flex-col items-center">
        <ShieldAlert className="h-24 w-24 text-warning/50 animate-pulse" />
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-100">
            Access Denied
          </h2>
          <p className="text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
            You do not have permission to view this page. Please log in with appropriate credentials or return to the dashboard.
          </p>
        </div>

        <div className="flex gap-4 justify-center pt-4">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            leftIcon={<ArrowLeft className="h-4 w-4" />}
          >
            Go Back
          </Button>
          <Button
            variant="warning"
            onClick={() => navigate('/')}
          >
            Go to Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
