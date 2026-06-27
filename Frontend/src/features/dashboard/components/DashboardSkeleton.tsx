import React from 'react';
import Card from '@/components/ui/Card';

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse p-1">
      
      {/* Header Skeleton */}
      <div className="flex justify-between items-center pb-6 border-b border-slate-900/60">
        <div className="space-y-2">
          <div className="h-7 w-48 bg-slate-800 rounded-lg" />
          <div className="h-4 w-32 bg-slate-800/60 rounded-md" />
        </div>
        <div className="flex gap-3">
          <div className="h-10 w-10 bg-slate-800 rounded-2xl" />
          <div className="h-10 w-10 bg-slate-800 rounded-2xl" />
        </div>
      </div>

      {/* Stats Cards Skeleton Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <Card key={idx} variant="glass">
            <Card.Content className="p-5 flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-3 w-16 bg-slate-800/80 rounded" />
                <div className="h-6 w-24 bg-slate-800 rounded-md" />
              </div>
              <div className="h-10 w-10 bg-slate-800 rounded-2xl" />
            </Card.Content>
          </Card>
        ))}
      </div>

      {/* Progress Cards Skeleton Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Circle Progress Card */}
        <Card variant="glass" className="p-6 flex flex-col items-center justify-center space-y-6">
          <div className="h-32 w-32 rounded-full border-8 border-slate-850 bg-transparent flex items-center justify-center">
            <div className="h-12 w-12 bg-slate-800 rounded-md" />
          </div>
          <div className="w-full grid grid-cols-2 gap-4 pt-4 border-t border-slate-900/60">
            <div className="space-y-1.5 flex flex-col items-center">
              <div className="h-2 w-12 bg-slate-800/60 rounded" />
              <div className="h-4 w-16 bg-slate-800 rounded-md" />
            </div>
            <div className="space-y-1.5 flex flex-col items-center">
              <div className="h-2 w-12 bg-slate-800/60 rounded" />
              <div className="h-4 w-16 bg-slate-800 rounded-md" />
            </div>
          </div>
        </Card>

        {/* Macro split and timeline skeletons */}
        <Card variant="glass" className="md:col-span-2 p-6 space-y-6">
          <div className="h-4 w-32 bg-slate-800 rounded mb-2" />
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex justify-between">
                <div className="h-4 w-20 bg-slate-800 rounded-md" />
                <div className="h-4 w-12 bg-slate-800 rounded-md" />
              </div>
              <div className="h-2 w-full bg-slate-850 rounded-full" />
            </div>
          ))}
        </Card>

      </div>

      {/* Timeline and Charts Skeleton Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card variant="glass" className="p-6 h-64 bg-slate-900/10" />
        <Card variant="glass" className="p-6 h-64 bg-slate-900/10" />
      </div>

    </div>
  );
};

export default DashboardSkeleton;
