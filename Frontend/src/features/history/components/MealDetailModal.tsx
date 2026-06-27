import React from 'react';
import { X, CalendarDays, Clock, Info, CheckCircle2 } from 'lucide-react';
import type { MealHistoryItemDto } from '@/types/history.types';
import Badge from '@/components/ui/Badge';

interface MealDetailModalProps {
  meal: MealHistoryItemDto;
  isOpen: boolean;
  onClose: () => void;
}

export const MealDetailModal: React.FC<MealDetailModalProps> = ({ meal, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-surface border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header Image Area */}
        <div className="relative h-64 w-full shrink-0 bg-slate-900 border-b border-slate-800">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-10 h-8 w-8 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-black/70 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>

          {meal.imageUrl ? (
            <img 
              src={meal.imageUrl} 
              alt={meal.mealName} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-600">
              <span className="text-sm font-bold uppercase tracking-widest">No Image Available</span>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent pointer-events-none" />

          <div className="absolute bottom-4 left-6 right-6">
            <div className="flex items-center gap-3 mb-2">
              <Badge variant="primary" className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5">
                {meal.mealType}
              </Badge>
              {meal.confidence > 0 && (
                <Badge variant="outline" className="bg-white/10 border-white/20 text-white text-[10px] uppercase font-bold tracking-wider px-2 py-0.5">
                  <CheckCircle2 className="h-3 w-3 inline mr-1" />
                  {Math.round(meal.confidence * 100)}% AI Match
                </Badge>
              )}
            </div>
            <h2 className="text-3xl font-black text-white drop-shadow-lg">{meal.mealName}</h2>
          </div>
        </div>

        {/* Scrollable Details */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Metadata Row */}
          <div className="flex items-center gap-6 text-slate-400 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              <span className="text-xs font-bold">{meal.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="text-xs font-bold">{meal.time}</span>
            </div>
          </div>

          {/* Primary Macros */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Info className="h-4 w-4" /> Primary Nutrition
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-surface-medium border border-slate-800 rounded-xl p-4 text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Calories</span>
                <span className="text-xl font-black text-warning">{meal.calories}</span>
                <span className="text-xs font-bold text-warning/70 ml-1">kcal</span>
              </div>
              <div className="bg-surface-medium border border-slate-800 rounded-xl p-4 text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Protein</span>
                <span className="text-xl font-black text-red-400">{meal.protein}</span>
                <span className="text-xs font-bold text-red-400/70 ml-1">g</span>
              </div>
              <div className="bg-surface-medium border border-slate-800 rounded-xl p-4 text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Carbs</span>
                <span className="text-xl font-black text-amber-400">{meal.carbohydrates}</span>
                <span className="text-xs font-bold text-amber-400/70 ml-1">g</span>
              </div>
              <div className="bg-surface-medium border border-slate-800 rounded-xl p-4 text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Fat</span>
                <span className="text-xl font-black text-blue-400">{meal.fat}</span>
                <span className="text-xs font-bold text-blue-400/70 ml-1">g</span>
              </div>
            </div>
          </div>

          {/* Secondary Macros Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Secondary Nutrients</h3>
              <div className="bg-surface-medium border border-slate-800 rounded-xl divide-y divide-slate-800/60">
                <div className="flex justify-between p-3 text-sm">
                  <span className="text-slate-400 font-medium">Dietary Fiber</span>
                  <span className="font-bold text-slate-200">{meal.fiber}g</span>
                </div>
                <div className="flex justify-between p-3 text-sm">
                  <span className="text-slate-400 font-medium">Sugars</span>
                  <span className="font-bold text-slate-200">{meal.sugar}g</span>
                </div>
                <div className="flex justify-between p-3 text-sm">
                  <span className="text-slate-400 font-medium">Sodium</span>
                  <span className="font-bold text-slate-200">{meal.sodium}mg</span>
                </div>
              </div>
            </div>

            {/* Detected Ingredients */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Detected Ingredients</h3>
              {meal.detectedFoods && meal.detectedFoods.length > 0 ? (
                <div className="bg-surface-medium border border-slate-800 rounded-xl divide-y divide-slate-800/60 max-h-48 overflow-y-auto">
                  {meal.detectedFoods.map((food, idx) => (
                    <div key={idx} className="p-3 text-sm flex items-start justify-between gap-4">
                      <div>
                        <span className="font-bold text-slate-200 block">{food.name}</span>
                        <span className="text-xs text-slate-500">{food.quantity}</span>
                      </div>
                      <span className="font-bold text-slate-400 shrink-0">{food.calories} kcal</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-surface-medium border border-slate-800 rounded-xl p-6 text-center">
                  <span className="text-xs text-slate-500 font-medium">No ingredient breakdown available</span>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default MealDetailModal;
