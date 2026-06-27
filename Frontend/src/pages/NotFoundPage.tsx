import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';
import { Home, Compass } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      {/* Background shapes */}
      <div className="absolute h-96 w-96 rounded-full bg-primary/5 blur-[100px] pointer-events-none" />
      
      <div className="z-10 space-y-6">
        <h1 className="text-9xl font-black tracking-widest text-primary/20 select-none animate-pulse">
          404
        </h1>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-100">
            Lost in Space?
          </h2>
          <p className="text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
            The page you are looking for does not exist, or has been relocated to another orbit.
          </p>
        </div>

        <div className="flex gap-4 justify-center pt-4">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            leftIcon={<Compass className="h-4 w-4" />}
          >
            Go Back
          </Button>
          <Button
            variant="primary"
            onClick={() => navigate('/dashboard')}
            leftIcon={<Home className="h-4 w-4" />}
          >
            Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
