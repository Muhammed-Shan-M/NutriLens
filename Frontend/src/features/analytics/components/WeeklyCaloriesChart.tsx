import React from 'react';
import Card from '@/components/ui/Card';
import type { CaloriesChartDto } from '@/types/analytics.types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell, type TooltipContentProps } from 'recharts';

interface WeeklyCaloriesChartProps {
  data: CaloriesChartDto[];
}

const CustomTooltip = ({ active, payload, label }: Partial<TooltipContentProps<number, string>>) => {
  if (active && payload && payload.length && label) {
    return (
      <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700 p-3 rounded-lg shadow-xl">
        <p className="text-xs text-slate-400 mb-1">{new Date(label).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
        <p className="text-sm font-bold text-white flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-primary inline-block"></span>
          {payload[0].value} kcal
        </p>
      </div>
    );
  }
  return null;
};

const WeeklyCaloriesChart: React.FC<WeeklyCaloriesChartProps> = ({ data }) => {
  return (
    <Card variant="default" className="border border-slate-800 h-full flex flex-col">
      <Card.Header className="pb-4">
        <Card.Title className="text-xs font-bold text-slate-400 tracking-wider uppercase">Weekly Calories</Card.Title>
      </Card.Header>
      <Card.Content className="p-4 pt-0 min-h-[300px] flex-1 w-full">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-sm text-slate-500">No data available</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => {
                  const d = new Date(value);
                  return `${d.getDate()} ${d.toLocaleString('default', { month: 'short' })}`;
                }}
                stroke="#475569" 
                fontSize={10} 
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis 
                stroke="#475569" 
                fontSize={10} 
                tickLine={false}
                axisLine={false}
                dx={-10}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#334155', opacity: 0.4 }} />
              <Bar dataKey="calories" radius={[4, 4, 0, 0]} animationDuration={1500} barSize={20}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.calories > 0 ? "var(--color-primary)" : "#334155"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </Card.Content>
    </Card>
  );
};

export default WeeklyCaloriesChart;
