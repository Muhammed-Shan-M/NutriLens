import React from 'react';
import Card from '@/components/ui/Card';

interface StatCardProps {
  title: string;
  value: number;
  unit: string;
  icon: React.ReactNode;
  iconColorClass: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  unit,
  icon,
  iconColorClass,
}) => {
  return (
    <Card variant="glass" className="hover:border-slate-700/60 transition-all duration-200 group">
      <Card.Content className="p-5 flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">
            {title}
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-slate-100 group-hover:text-primary transition-colors">
              {value}
            </span>
            <span className="text-xs font-semibold text-slate-400">
              {unit}
            </span>
          </div>
        </div>

        <div className={`p-3 rounded-2xl border border-slate-800/60 flex items-center justify-center ${iconColorClass}`}>
          {icon}
        </div>
      </Card.Content>
    </Card>
  );
};

export default StatCard;
