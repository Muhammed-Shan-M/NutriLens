import React from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { Compass, TrendingUp } from 'lucide-react';

interface HealthSummaryCardProps {
  bmi?: number;
  bmiCategory?: string;
  goal?: string;
  activityLevel?: string;
}

export const HealthSummaryCard: React.FC<HealthSummaryCardProps> = ({
  bmi = 0,
  bmiCategory = 'Normal Weight',
  goal = 'maintain_weight',
  activityLevel = 'moderately_active',
}) => {
  const getBmiBadgeStyle = (category: string) => {
    switch (category.toLowerCase()) {
      case 'underweight':
        return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case 'normal weight':
        return 'text-primary bg-primary/10 border-primary/20';
      case 'overweight':
        return 'text-warning bg-warning/10 border-warning/20';
      case 'obese':
        return 'text-red-400 bg-red-400/10 border-red-400/20';
      default:
        return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  const formatText = (text: string) => {
    return text
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <Card variant="glass" className="border border-slate-800 p-6 flex flex-col justify-between h-full">
      <div className="border-b border-slate-900/60 pb-3 mb-4">
        <h3 className="text-slate-300 text-xs font-semibold tracking-wider uppercase flex items-center gap-1.5">
          <Compass className="h-4 w-4 text-accent" />
          Health Summary
        </h3>
      </div>

      <div className="space-y-4 py-1">
        {/* BMI Rating row */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-slate-200">BMI Rating</span>
            <p className="text-[10px] text-slate-500">Based on height & weight</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-base font-extrabold text-slate-200">{bmi}</span>
            <span className={`text-[9px] font-bold px-2 py-0.5 border rounded-full ${getBmiBadgeStyle(bmiCategory)}`}>
              {bmiCategory}
            </span>
          </div>
        </div>

        {/* Goal row */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-slate-200">Program Target</span>
            <p className="text-[10px] text-slate-500">Caloric deficit or surplus goal</p>
          </div>
          <Badge variant="primary" className="text-[10px] px-2 py-0.5 font-bold flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            {formatText(goal)}
          </Badge>
        </div>

        {/* Activity Level row */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-slate-200">Activity Multiplier</span>
            <p className="text-[10px] text-slate-500">TDEE adjustment factor</p>
          </div>
          <Badge variant="secondary" className="text-[10px] px-2 py-0.5 font-bold capitalize">
            {formatText(activityLevel)}
          </Badge>
        </div>
      </div>
    </Card>
  );
};

export default HealthSummaryCard;
