import React from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { Apple, Sun, Moon, Sparkles, Clock, CalendarDays } from 'lucide-react';
import type { MealHistoryItemDto } from '@/types/history.types';

interface MealHistoryCardProps {
  meal: MealHistoryItemDto;
  onClick: (meal: MealHistoryItemDto) => void;
}

const getMealTypeIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'breakfast': return <Apple className="h-4 w-4 text-amber-400" />;
    case 'lunch': return <Sun className="h-4 w-4 text-primary" />;
    case 'dinner': return <Moon className="h-4 w-4 text-blue-400" />;
    case 'snack': return <Sparkles className="h-4 w-4 text-purple-400" />;
    default: return <Sparkles className="h-4 w-4 text-slate-400" />;
  }
};

export const MealHistoryCard: React.FC<MealHistoryCardProps> = ({ meal, onClick }) => {
  return (
    <Card 
      variant="glass" 
      className="border border-slate-800 hover:border-primary/40 transition-all duration-300 cursor-pointer overflow-hidden group hover:shadow-[0_0_20px_-5px_rgba(74,200,130,0.1)] flex flex-col h-full"
      onClick={() => onClick(meal)}
    >
      <div className="relative h-48 w-full overflow-hidden bg-slate-900 border-b border-slate-800">
        {meal.imageUrl ? (
          <img 
            src={meal.imageUrl} 
            alt={meal.mealName} 
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-600">
            <span className="text-xs uppercase tracking-wider font-bold">No Image</span>
          </div>
        )}
        
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge variant="outline" className="bg-black/60 backdrop-blur-md border-white/10 text-white px-2 py-1 text-[10px] font-bold tracking-wide uppercase flex items-center gap-1.5 shadow-xl">
            {getMealTypeIcon(meal.mealType)}
            {meal.mealType}
          </Badge>
        </div>

        {meal.confidence > 0 && (
          <div className="absolute top-3 right-3">
            <Badge variant="outline" className="bg-primary/20 backdrop-blur-md border-primary/30 text-primary-light px-2 py-1 text-[9px] font-extrabold tracking-widest uppercase shadow-xl">
              {Math.round(meal.confidence * 100)}% AI
            </Badge>
          </div>
        )}
        
        <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />
        
        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
          <h3 className="text-white font-extrabold text-lg truncate drop-shadow-md pr-4">{meal.mealName}</h3>
          <span className="text-primary font-black text-lg drop-shadow-md shrink-0">{meal.calories} <span className="text-[10px] font-bold text-primary-light uppercase tracking-wider">kcal</span></span>
        </div>
      </div>

      <Card.Content className="p-4 flex-1 flex flex-col justify-between space-y-4">
        {/* Macros */}
        <div className="grid grid-cols-3 gap-2 text-center divide-x divide-slate-800/80">
          <div>
            <span className="text-[9px] text-slate-500 font-bold block uppercase tracking-wider">Protein</span>
            <span className="text-sm font-black text-red-400 drop-shadow-sm">{meal.protein}g</span>
          </div>
          <div>
            <span className="text-[9px] text-slate-500 font-bold block uppercase tracking-wider">Carbs</span>
            <span className="text-sm font-black text-amber-400 drop-shadow-sm">{meal.carbohydrates}g</span>
          </div>
          <div>
            <span className="text-[9px] text-slate-500 font-bold block uppercase tracking-wider">Fat</span>
            <span className="text-sm font-black text-blue-400 drop-shadow-sm">{meal.fat}g</span>
          </div>
        </div>

        {/* Timestamps */}
        <div className="flex items-center justify-between border-t border-slate-900/60 pt-3">
          <div className="flex items-center gap-1.5 text-slate-400">
            <CalendarDays className="h-3.5 w-3.5" />
            <span className="text-[10px] font-bold tracking-wide">{meal.date}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <Clock className="h-3.5 w-3.5" />
            <span className="text-[10px] font-bold tracking-wide">{meal.time}</span>
          </div>
        </div>
      </Card.Content>
    </Card>
  );
};

export default MealHistoryCard;
