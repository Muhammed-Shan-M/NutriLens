import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, type TooltipContentProps } from 'recharts';
import Card from '@/components/ui/Card';
import { BarChart3 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getAnalytics } from '@/lib/analytics.api';

interface WeeklyChartProps {
  targetCalories: number;
}

export const WeeklyChart: React.FC<WeeklyChartProps> = ({ targetCalories }) => {
  const { data: analyticsData, isLoading } = useQuery({
    queryKey: ['analytics', '7d'],
    queryFn: () => getAnalytics('7d'),
  });

  const getDayName = (dateStr: string) => {
    const d = new Date(dateStr);
    // Add timezone offset to prevent UTC shifting if dateStr is YYYY-MM-DD
    const tzOffset = d.getTimezoneOffset() * 60000;
    const localDate = new Date(d.getTime() + tzOffset);
    return new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(localDate);
  };

  const data = analyticsData?.dailyCalories?.map(d => ({
    day: getDayName(d.date),
    calories: d.calories,
  })) || [
    { day: 'Mon', calories: 0 },
    { day: 'Tue', calories: 0 },
    { day: 'Wed', calories: 0 },
    { day: 'Thu', calories: 0 },
    { day: 'Fri', calories: 0 },
    { day: 'Sat', calories: 0 },
    { day: 'Sun', calories: 0 },
  ];

  // Custom tooltip style
  const CustomTooltip = ({ active, payload }: Partial<TooltipContentProps<number, string>>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs shadow-xl">
          <p className="font-bold text-slate-300">
            {payload[0].name}: <span className="text-primary">{payload[0].value} kcal</span>
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">Target: {targetCalories} kcal</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card variant="glass" className="border border-slate-800 p-6 flex flex-col justify-between h-full">
      <div className="border-b border-slate-900/60 pb-3 mb-6">
        <Card.Title className="text-slate-300 text-xs font-semibold tracking-wider uppercase flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-accent" />
          Weekly Caloric Intake
        </Card.Title>
      </div>

      {/* Chart container */}
      <div className="h-48 w-full select-none">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <div className="animate-pulse flex items-end space-x-2 h-3/4 w-full px-4">
              {[...Array(7)].map((_, i) => (
                <div
                  key={i}
                  className="bg-slate-800/50 w-full rounded-t-sm"
                  style={{ height: `${Math.random() * 60 + 20}%` }}
                />
              ))}
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#111715" vertical={false} />
              <XAxis
                dataKey="day"
                stroke="#475569"
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#475569"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                domain={[0, targetCalories + 500]}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#111715', opacity: 0.4 }} />
              <Bar
                dataKey="calories"
                name="Calories"
                fill="#4AC882"
                radius={[4, 4, 0, 0]}
                maxBarSize={28}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
};

export default WeeklyChart;
