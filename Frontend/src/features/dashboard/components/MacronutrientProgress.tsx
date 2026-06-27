import React from 'react';
import Card from '@/components/ui/Card';
import { Beef, Croissant, Droplet } from 'lucide-react';

interface MacroBarProps {
  label: string;
  consumed: number;
  target: number;
  icon: React.ReactNode;
  barColorClass: string;
  iconColorClass: string;
}

const MacroBar: React.FC<MacroBarProps> = ({
  label,
  consumed,
  target,
  icon,
  barColorClass,
  iconColorClass,
}) => {
  const percentage = Math.min(100, Math.round((consumed / target) * 100)) || 0;

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg border border-slate-900/60 ${iconColorClass}`}>
            {icon}
          </div>
          <span className="text-xs font-bold text-slate-300">{label}</span>
        </div>
        <div className="text-right">
          <span className="text-xs font-extrabold text-slate-100">{consumed}g</span>
          <span className="text-[10px] text-slate-500 font-semibold ml-1">/ {target}g</span>
        </div>
      </div>
      
      {/* Progress Bar Track */}
      <div className="relative h-2 w-full bg-slate-800/80 rounded-full overflow-hidden">
        <div
          className={`absolute h-full rounded-full transition-all duration-1000 ease-out ${barColorClass}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

interface MacronutrientProgressProps {
  proteinTarget: number;
  carbsTarget: number;
  fatTarget: number;
  proteinConsumed?: number;
  carbsConsumed?: number;
  fatConsumed?: number;
}

export const MacronutrientProgress: React.FC<MacronutrientProgressProps> = ({
  proteinTarget,
  carbsTarget,
  fatTarget,
  proteinConsumed = 0,
  carbsConsumed = 0,
  fatConsumed = 0,
}) => {
  return (
    <Card variant="glass" className="border border-slate-800 p-6 space-y-6">
      <div className="border-b border-slate-900/60 pb-3">
        <h3 className="text-slate-300 text-xs font-semibold tracking-wider uppercase">
          Daily Nutrient Balance
        </h3>
      </div>

      <div className="space-y-4">
        <MacroBar
          label="Protein"
          consumed={proteinConsumed}
          target={proteinTarget}
          icon={<Beef className="h-3.5 w-3.5" />}
          barColorClass="bg-red-400"
          iconColorClass="bg-red-500/10 text-red-400 border-red-500/10"
        />

        <MacroBar
          label="Carbohydrates"
          consumed={carbsConsumed}
          target={carbsTarget}
          icon={<Croissant className="h-3.5 w-3.5" />}
          barColorClass="bg-amber-400"
          iconColorClass="bg-amber-500/10 text-amber-400 border-amber-500/10"
        />

        <MacroBar
          label="Fat"
          consumed={fatConsumed}
          target={fatTarget}
          icon={<Droplet className="h-3.5 w-3.5" />}
          barColorClass="bg-blue-400"
          iconColorClass="bg-blue-500/10 text-blue-400 border-blue-500/10"
        />
      </div>
    </Card>
  );
};

export default MacronutrientProgress;
