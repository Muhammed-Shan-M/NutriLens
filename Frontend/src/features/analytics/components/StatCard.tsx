import React from 'react';
import Card from '@/components/ui/Card';

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: React.ReactNode;
  iconColorClass?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, unit, icon, iconColorClass = 'text-primary bg-primary/10' }) => {
  return (
    <Card variant="glass" className="border border-slate-800 h-full">
      <Card.Content className="p-5 flex flex-col justify-center h-full text-center">
        <div className={`h-10 w-10 mx-auto rounded-full flex items-center justify-center mb-3 ${iconColorClass}`}>
          {icon}
        </div>
        <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">{title}</span>
        <div className="mt-1 flex items-baseline justify-center gap-1">
          <span className="text-2xl font-extrabold text-slate-200">{value}</span>
          {unit && <span className="text-sm font-medium text-slate-500">{unit}</span>}
        </div>
      </Card.Content>
    </Card>
  );
};

export default StatCard;
