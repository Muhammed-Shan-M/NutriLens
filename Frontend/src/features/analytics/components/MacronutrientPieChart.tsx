import React from 'react';
import Card from '@/components/ui/Card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, type TooltipContentProps } from 'recharts';

interface MacronutrientPieChartProps {
  data: {
    protein: number;
    carbohydrates: number;
    fat: number;
  };
}

const COLORS = ['#ef4444', '#f59e0b', '#3b82f6']; // Red (Protein), Amber (Carbs), Blue (Fat)

const CustomTooltip = ({ active, payload }: Partial<TooltipContentProps<number, string>>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700 p-3 rounded-lg shadow-xl">
        <p className="text-sm font-bold text-white flex items-center gap-2">
          <span className="h-2 w-2 rounded-full inline-block" style={{ backgroundColor: payload[0].payload.fill }}></span>
          {payload[0].name}: {payload[0].value}g
        </p>
      </div>
    );
  }
  return null;
};

const MacronutrientPieChart: React.FC<MacronutrientPieChartProps> = ({ data }) => {
  const chartData = [
    { name: 'Protein', value: data.protein },
    { name: 'Carbs', value: data.carbohydrates },
    { name: 'Fat', value: data.fat },
  ].filter(d => d.value > 0);

  return (
    <Card variant="default" className="border border-slate-800 h-full flex flex-col">
      <Card.Header className="pb-0">
        <Card.Title className="text-xs font-bold text-slate-400 tracking-wider uppercase">Macronutrient Split</Card.Title>
      </Card.Header>
      <Card.Content className="p-4 min-h-[250px] flex-1 w-full">
        {chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-sm text-slate-500">No data available</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
                animationDuration={1500}
              >
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                height={36} 
                iconType="circle"
                formatter={(value) => <span className="text-xs text-slate-300 ml-1">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </Card.Content>
    </Card>
  );
};

export default MacronutrientPieChart;
