import React from 'react';
import Card from '@/components/ui/Card';

const AnalyticsSkeleton: React.FC = () => {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="h-8 w-48 bg-slate-800 rounded-md mb-2"></div>
          <div className="h-4 w-72 bg-slate-800/60 rounded-md"></div>
        </div>
        <div className="h-10 w-32 bg-slate-800 rounded-lg"></div>
      </div>

      {/* Overview Cards Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <Card key={i} className="h-28 bg-slate-800/40 border-slate-800"></Card>
        ))}
      </div>

      {/* Main Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="h-80 bg-slate-800/40 border-slate-800"></Card>
        <Card className="h-80 bg-slate-800/40 border-slate-800"></Card>
      </div>

      {/* Secondary Row Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="h-64 lg:col-span-1 bg-slate-800/40 border-slate-800"></Card>
        <Card className="h-64 lg:col-span-2 bg-slate-800/40 border-slate-800"></Card>
      </div>
    </div>
  );
};

export default AnalyticsSkeleton;
