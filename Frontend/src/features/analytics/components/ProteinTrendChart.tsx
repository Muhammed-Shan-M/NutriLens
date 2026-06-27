import React from 'react';
import Card from '@/components/ui/Card';
import type { MacroChartDto } from '@/types/analytics.types';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, type TooltipContentProps } from 'recharts';

interface ProteinTrendChartProps {
  data: MacroChartDto[];
}

const CustomTooltip = ({ active, payload, label }: Partial<TooltipContentProps<number, string>>) => {
  if (active && payload && payload.length && label) {
    return (
      <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700 p-3 rounded-lg shadow-xl">
        <p className="text-xs text-slate-400 mb-1">{new Date(label).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
        <p className="text-sm font-bold text-white flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-red-500 inline-block"></span>
          Protein: {payload[0].value}g
        </p>
      </div>
    );
  }
  return null;
};

const ProteinTrendChart: React.FC<ProteinTrendChartProps> = ({ data }) => {
  return (
    <Card variant="default" className="border border-slate-800 h-full flex flex-col">
      <Card.Header className="pb-4">
        <Card.Title className="text-xs font-bold text-slate-400 tracking-wider uppercase">Protein Trend</Card.Title>
      </Card.Header>
      <Card.Content className="p-4 pt-0 min-h-[300px] flex-1 w-full">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-sm text-slate-500">No data available</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorProteinOnly" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
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
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#334155', strokeWidth: 1, strokeDasharray: '4 4' }} />
              <Area type="monotone" dataKey="protein" name="Protein" stroke="#ef4444" fillOpacity={1} fill="url(#colorProteinOnly)" animationDuration={1500} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </Card.Content>
    </Card>
  );
};

export default ProteinTrendChart;
