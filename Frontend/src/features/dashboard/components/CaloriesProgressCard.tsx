import React from 'react';
import Card from '@/components/ui/Card';
import { Flame } from 'lucide-react';

interface CaloriesProgressCardProps {
  target: number;
  consumed: number;
}

export const CaloriesProgressCard: React.FC<CaloriesProgressCardProps> = ({
  target,
  consumed,
}) => {
  const remaining = Math.max(0, target - consumed);
  const percentage = Math.min(100, Math.round((consumed / target) * 100)) || 0;

  // SVG parameters
  const radius = 60;
  const stroke = 6;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <Card variant="glass" className="border border-slate-800 flex flex-col justify-between">
      <Card.Header className="pb-2">
        <Card.Title className="text-slate-300 text-xs font-semibold tracking-wider uppercase flex items-center gap-2">
          <Flame className="h-4 w-4 text-warning animate-pulse" />
          Active Calories
        </Card.Title>
      </Card.Header>
      <Card.Content className="flex flex-col items-center justify-center p-6 space-y-5">
        {/* SVG Circular Ring */}
        <div className="relative flex items-center justify-center h-32 w-32">
          <svg className="absolute h-full w-full transform -rotate-90">
            <circle
              stroke="#1C2A20"
              fill="transparent"
              strokeWidth={stroke}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
            <circle
              stroke="#4AC882"
              fill="transparent"
              strokeWidth={stroke}
              strokeDasharray={circumference + ' ' + circumference}
              style={{ strokeDashoffset }}
              strokeLinecap="round"
              r={normalizedRadius}
              cx={radius}
              cy={radius}
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          <div className="flex flex-col items-center text-center">
            <span className="text-2xl font-black text-slate-100">{consumed}</span>
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
              kcal logged
            </span>
          </div>
        </div>

        {/* Text descriptions */}
        <div className="w-full grid grid-cols-2 gap-4 border-t border-slate-900/60 pt-4 text-center">
          <div>
            <span className="text-[10px] text-slate-400 block font-medium">Remaining</span>
            <span className="text-sm font-bold text-slate-200">{remaining} kcal</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-medium">Daily Target</span>
            <span className="text-sm font-bold text-slate-200">{target} kcal</span>
          </div>
        </div>
      </Card.Content>
    </Card>
  );
};

export default CaloriesProgressCard;
