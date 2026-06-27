import React from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { Apple, Sun, Moon, Sparkles, Inbox } from 'lucide-react';
import type { MealResponseDto } from '@/types/meal.types';

interface MealTimelineProps {
  meals?: MealResponseDto[];
}

export const MealTimeline: React.FC<MealTimelineProps> = ({ meals = [] }) => {
  const breakfastMeals = meals.filter(m => m.mealType === 'breakfast');
  const lunchMeals = meals.filter(m => m.mealType === 'lunch');
  const dinnerMeals = meals.filter(m => m.mealType === 'dinner');
  const snackMeals = meals.filter(m => m.mealType === 'snack');

  const hasMeals = meals.length > 0;

  const timelineItems = [
    {
      type: 'Breakfast',
      name: breakfastMeals.length > 0 ? breakfastMeals.map(m => m.mealName).join(', ') : 'No breakfast recorded',
      calories: breakfastMeals.length > 0 ? `${breakfastMeals.reduce((sum, m) => sum + m.totalCalories, 0)} kcal` : null,
      time: '7:30 AM',
      icon: <Apple className="h-4 w-4" />,
      iconColor: breakfastMeals.length > 0 ? 'text-amber-400 bg-amber-400/10 border-amber-400/20' : 'text-slate-500 bg-slate-800/40 border-slate-700/20',
      logged: breakfastMeals.length > 0,
    },
    {
      type: 'Lunch',
      name: lunchMeals.length > 0 ? lunchMeals.map(m => m.mealName).join(', ') : 'No lunch recorded',
      calories: lunchMeals.length > 0 ? `${lunchMeals.reduce((sum, m) => sum + m.totalCalories, 0)} kcal` : null,
      time: '1:00 PM',
      icon: <Sun className="h-4 w-4" />,
      iconColor: lunchMeals.length > 0 ? 'text-primary bg-primary/10 border-primary/20' : 'text-slate-500 bg-slate-800/40 border-slate-700/20',
      logged: lunchMeals.length > 0,
    },
    {
      type: 'Dinner',
      name: dinnerMeals.length > 0 ? dinnerMeals.map(m => m.mealName).join(', ') : 'No dinner recorded',
      calories: dinnerMeals.length > 0 ? `${dinnerMeals.reduce((sum, m) => sum + m.totalCalories, 0)} kcal` : null,
      time: '7:30 PM',
      icon: <Moon className="h-4 w-4" />,
      iconColor: dinnerMeals.length > 0 ? 'text-blue-400 bg-blue-400/10 border-blue-400/20' : 'text-slate-500 bg-slate-800/40 border-slate-700/20',
      logged: dinnerMeals.length > 0,
    },
    {
      type: 'Snack',
      name: snackMeals.length > 0 ? snackMeals.map(m => m.mealName).join(', ') : 'No snacks recorded',
      calories: snackMeals.length > 0 ? `${snackMeals.reduce((sum, m) => sum + m.totalCalories, 0)} kcal` : null,
      time: 'Any time',
      icon: <Sparkles className="h-4 w-4" />,
      iconColor: snackMeals.length > 0 ? 'text-purple-400 bg-purple-400/10 border-purple-400/20' : 'text-slate-500 bg-slate-800/40 border-slate-700/20',
      logged: snackMeals.length > 0,
    },
  ];

  return (
    <Card variant="glass" className="border border-slate-800 p-6 flex flex-col justify-between h-full">
      <div className="border-b border-slate-900/60 pb-3 mb-4">
        <h3 className="text-slate-300 text-xs font-semibold tracking-wider uppercase">
          Today's Timeline
        </h3>
      </div>

      {!hasMeals && (
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <div className="h-10 w-10 rounded-full bg-slate-800/60 border border-slate-700/40 flex items-center justify-center text-slate-500 mb-2">
            <Inbox className="h-5 w-5" />
          </div>
          <h4 className="text-xs font-bold text-slate-300">No meals logged today</h4>
          <p className="text-[10px] text-slate-500 max-w-[200px] mt-1">
            Upload your first meal using the camera action card to start tracking macros.
          </p>
        </div>
      )}

      <div className="relative pl-6 border-l border-slate-800/80 space-y-4 py-2 mt-2">
        {timelineItems.map((item, idx) => (
          <div key={idx} className="relative group">
            <div className={`absolute -left-[31px] top-1 h-3 w-3 rounded-full bg-slate-900 border-2 transition-colors ${item.logged ? 'border-primary' : 'border-slate-700'}`} />

            <div className="flex justify-between items-start gap-4">
              <div className="flex items-center gap-2.5">
                <div className={`p-1.5 rounded-lg border ${item.iconColor}`}>
                  {item.icon}
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-300">{item.type}</span>
                  <span className={`text-[10px] block ${item.logged ? 'text-slate-400 font-medium' : 'text-slate-500'}`}>{item.name}</span>
                </div>
              </div>

              <div className="text-right flex flex-col items-end gap-1.5">
                <Badge variant={item.logged ? 'primary' : 'slate'} className="text-[8px] tracking-wide font-bold px-1.5 py-0">
                  {item.time}
                </Badge>
                {item.calories && (
                  <span className="text-[10px] font-bold text-slate-400">{item.calories}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default MealTimeline;
