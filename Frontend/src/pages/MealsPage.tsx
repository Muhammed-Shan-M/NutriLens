import React, { useState, useEffect, useRef, useCallback, type DragEvent, type ChangeEvent } from 'react';
import { 
  Upload, 
  X, 
  Sparkles, 
  Camera, 
  Apple, 
  Sun, 
  Moon, 
  Clock
} from 'lucide-react';
import toast from 'react-hot-toast';
import { analyzeMeal, getTodayMeals, updateMeal } from '@/lib/meal.api';
import type { MealResponseDto } from '@/types/meal.types';
import { useQueryClient } from '@tanstack/react-query';
import type { ApiError } from '@/types/api.types';
import PageContainer from '@/components/ui/PageContainer';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import Skeleton from '@/components/ui/Skeleton';

type PageState = 'idle' | 'preview' | 'loading' | 'editing' | 'saving';

export const MealsPage: React.FC = () => {
  const queryClient = useQueryClient();

  // Page States
  const [state, setState] = useState<PageState>('idle');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // AI & Form values
  const [currentMealId, setCurrentMealId] = useState<string | null>(null);
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState<number>(0);
  const [protein, setProtein] = useState<number>(0);
  const [carbs, setCarbs] = useState<number>(0);
  const [fat, setFat] = useState<number>(0);
  const [sugar, setSugar] = useState<number>(0);
  const [portionSize, setPortionSize] = useState('350g');
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('lunch');

  // Today's Logs
  const [todayLogs, setTodayLogs] = useState<MealResponseDto[]>([]);
  const [logsLoading, setLogsLoading] = useState(true);

  // Fetch logged meals
  const loadTodayLogs = async () => {
    try {
      const logs = await getTodayMeals();
      setTodayLogs(logs);
    } catch (err) {
      console.error('Failed to load today logs:', err);
    } finally {
      setLogsLoading(false);
    }
  };

  useEffect(() => {
    loadTodayLogs();
  }, []);

  const handleFile = useCallback((selected: File) => {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(selected.type)) {
      toast.error('Only JPEG, PNG, and WEBP images are supported.');
      return;
    }
    if (selected.size > 10 * 1024 * 1024) {
      toast.error('Image must be under 10MB.');
      return;
    }
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setState('preview');
  }, []);

  const onDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFile(dropped);
  }, [handleFile]);

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) handleFile(selected);
  };

  const handleRemove = () => {
    setFile(null);
    setPreview(null);
    setCurrentMealId(null);
    setState('idle');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setState('loading');
    try {
      const data = await analyzeMeal(file);
      
      // Load response into editing form fields
      setCurrentMealId(data.id);
      setFoodName(data.mealName);
      setCalories(data.totalCalories);
      setProtein(data.protein);
      setCarbs(data.carbohydrates);
      setFat(data.fat);
      setSugar(data.sugar);
      
      // Fallback portion size estimation
      const portionEst = data.detectedFoods && data.detectedFoods.length > 0
        ? data.detectedFoods.map(f => `${f.name} (${f.quantity})`).join(', ')
        : '1 serving';
      setPortionSize(portionEst);
      setMealType('lunch'); // Default
      
      setState('editing');
      toast.success('AI Analysis Complete! Please review details below.');
    } catch (err: unknown) {
      const apiError = err as ApiError;
      const msg = apiError.message || 'AI analysis failed. Please try again.';

      setState('idle');
      toast.error(msg);
    }
  };

  const handleSaveMeal = async () => {
    if (!currentMealId) return;
    setState('saving');
    try {
      await updateMeal(currentMealId, {
        mealName: foodName,
        mealType: mealType,
        totalCalories: Number(calories),
        protein: Number(protein),
        carbohydrates: Number(carbs),
        fat: Number(fat),
        sugar: Number(sugar),
      });

      toast.success('Meal saved successfully!', { icon: '💾' });
      
      // Reset state & reload timeline
      handleRemove();
      await loadTodayLogs();
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary'] });
    } catch (err: unknown) {
      const apiError = err as ApiError;
      toast.error(apiError.message || 'Failed to save meal.');
      setState('editing');
    }
  };

  // Group meals
  const groupedMeals = {
    breakfast: todayLogs.filter(m => m.mealType === 'breakfast'),
    lunch: todayLogs.filter(m => m.mealType === 'lunch'),
    dinner: todayLogs.filter(m => m.mealType === 'dinner'),
    snack: todayLogs.filter(m => m.mealType === 'snack'),
  };

  const getMealTypeIcon = (type: string) => {
    switch (type) {
      case 'breakfast': return <Apple className="h-4 w-4 text-amber-400" />;
      case 'lunch': return <Sun className="h-4 w-4 text-primary" />;
      case 'dinner': return <Moon className="h-4 w-4 text-blue-400" />;
      default: return <Clock className="h-4 w-4 text-purple-400" />;
    }
  };

  // Calculate totals
  const totalCalories = todayLogs.reduce((sum, m) => sum + m.totalCalories, 0);
  const totalProtein = todayLogs.reduce((sum, m) => sum + m.protein, 0);
  const totalCarbs = todayLogs.reduce((sum, m) => sum + m.carbohydrates, 0);
  const totalFat = todayLogs.reduce((sum, m) => sum + m.fat, 0);

  return (
    <PageContainer>
      <div className="w-full max-w-4xl mx-auto space-y-8">
        
        {/* Title */}
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-slate-100 tracking-tight">Meals & Nutrition Log</h1>
          <p className="text-xs text-slate-400">Record your meals manually or utilize AI image recognition to auto-fill calorie counts.</p>
        </div>

        {/* ── SECTION 1: AI FOOD RECOGNITION ──────────────────────────────── */}
        <Card variant="glass" className="border border-slate-800">
          <Card.Header className="pb-2">
            <Card.Title className="text-xs font-bold text-slate-400 tracking-wider uppercase flex items-center gap-1.5">
              <Camera className="h-4 w-4 text-primary" />
              AI Food Recognition
            </Card.Title>
          </Card.Header>
          <Card.Content className="p-6">
            
            {/* Idle upload dropzone */}
            {state === 'idle' && (
              <div
                className={`border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 ${
                  isDragging
                    ? 'border-primary bg-primary/5 scale-[1.01]'
                    : 'border-slate-800 bg-surface-medium/40 hover:border-slate-700 hover:bg-surface-medium/70'
                }`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="h-14 w-14 rounded-2xl bg-slate-850 border border-slate-800 flex items-center justify-center text-slate-400 mb-3">
                  <Upload className="h-6 w-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-200 mb-1">
                  Drag & drop your food photo here
                </h4>
                <p className="text-[10px] text-slate-500 mb-3">Supports JPEG, PNG, WEBP · Max 10MB</p>
                <Button size="sm" variant="primary" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>
                  Choose Image
                </Button>
                <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={onFileChange} />
              </div>
            )}

            {/* Preview image */}
            {state === 'preview' && preview && (
              <div className="space-y-4">
                <div className="relative rounded-2xl overflow-hidden max-h-64 border border-slate-800">
                  <img src={preview} alt="Upload preview" className="w-full object-cover max-h-64" />
                  <button
                    onClick={handleRemove}
                    className="absolute top-3 right-3 h-8 w-8 rounded-full bg-black/70 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-all"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="ghost" size="sm" onClick={handleRemove}>Cancel</Button>
                  <Button variant="primary" size="sm" onClick={handleAnalyze} rightIcon={<Sparkles className="h-4 w-4" />}>
                    Analyze Meal
                  </Button>
                </div>
              </div>
            )}

            {/* AI thinking progress */}
            {state === 'loading' && (
              <div className="flex flex-col items-center justify-center py-10 space-y-4">
                <div className="relative h-16 w-16">
                  <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-ping" />
                  <div className="h-full w-full rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-primary animate-spin" style={{ animationDuration: '3s' }} />
                  </div>
                </div>
                <div className="text-center space-y-1">
                  <h4 className="text-xs font-bold text-slate-200">Analyzing Image...</h4>
                  <p className="text-[10px] text-slate-500">Estimating portions & macro balance via OpenRouter</p>
                </div>
              </div>
            )}

            {/* ── SECTION 2: EDITING AI RESULTS ────────────────────────────── */}
            {(state === 'editing' || state === 'saving') && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
                
                {/* Visual Thumbnail */}
                <div className="md:col-span-1 space-y-3">
                  <div className="rounded-xl overflow-hidden border border-slate-800 max-h-48 relative">
                    {preview && <img src={preview} alt="Analyzed food" className="w-full object-cover max-h-48" />}
                    <button
                      onClick={handleRemove}
                      className="absolute top-2 right-2 h-6 w-6 rounded-full bg-black/60 flex items-center justify-center text-slate-400 hover:text-white"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="bg-surface-medium/40 border border-slate-800/80 rounded-xl p-3 text-center">
                    <span className="text-[10px] text-slate-500 font-semibold block uppercase">Estimated Weight</span>
                    <span className="text-sm font-black text-slate-200">{portionSize}</span>
                  </div>
                </div>

                {/* Form fields */}
                <div className="md:col-span-2 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Food Name"
                      value={foodName}
                      onChange={(e) => setFoodName(e.target.value)}
                      placeholder="e.g. Chicken Salad"
                    />

                    <div className="flex flex-col gap-1.5 w-full">
                      <label className="text-xs font-semibold text-slate-400 tracking-wider uppercase ml-1">
                        Meal Type
                      </label>
                      <select
                        value={mealType}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setMealType(e.target.value as 'breakfast' | 'lunch' | 'dinner' | 'snack')}
                        className="w-full bg-surface-medium border border-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/10 transition-all duration-200"
                      >
                        <option value="breakfast">Breakfast</option>
                        <option value="lunch">Lunch</option>
                        <option value="dinner">Dinner</option>
                        <option value="snack">Snack</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <Input
                      label="Calories (kcal)"
                      type="number"
                      value={calories}
                      onChange={(e) => setCalories(Number(e.target.value))}
                    />
                    <Input
                      label="Protein (g)"
                      type="number"
                      value={protein}
                      onChange={(e) => setProtein(Number(e.target.value))}
                    />
                    <Input
                      label="Carbs (g)"
                      type="number"
                      value={carbs}
                      onChange={(e) => setCarbs(Number(e.target.value))}
                    />
                    <Input
                      label="Fat (g)"
                      type="number"
                      value={fat}
                      onChange={(e) => setFat(Number(e.target.value))}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Sugar (g)"
                      type="number"
                      value={sugar}
                      onChange={(e) => setSugar(Number(e.target.value))}
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <Button variant="ghost" size="sm" onClick={handleRemove} disabled={state === 'saving'}>
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleSaveMeal}
                      isLoading={state === 'saving'}
                    >
                      Save Meal
                    </Button>
                  </div>
                </div>

              </div>
            )}

          </Card.Content>
        </Card>

        {/* ── SECTION 3: TODAY'S LOGGED MEALS ────────────────────────────── */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-xs font-bold text-slate-400 tracking-wider uppercase">Today's Meals</h3>
            {todayLogs.length > 0 && (
              <span className="text-[10px] text-slate-500">
                Total Calories: <span className="font-bold text-primary">{totalCalories} kcal</span>
              </span>
            )}
          </div>

          {/* Daily Total Macros Summary Banner */}
          {todayLogs.length > 0 && (
            <Card variant="glass" className="border border-slate-900 bg-surface-medium/30 p-4">
              <div className="grid grid-cols-4 gap-4 text-center divide-x divide-slate-800/80">
                <div>
                  <span className="text-[9px] text-slate-500 font-bold block uppercase">Calories</span>
                  <span className="text-sm font-black text-warning">{totalCalories} kcal</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 font-bold block uppercase">Protein</span>
                  <span className="text-sm font-black text-red-400">{totalProtein}g</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 font-bold block uppercase">Carbs</span>
                  <span className="text-sm font-black text-amber-400">{totalCarbs}g</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 font-bold block uppercase">Fat</span>
                  <span className="text-sm font-black text-blue-400">{totalFat}g</span>
                </div>
              </div>
            </Card>
          )}

          {logsLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : (
            <div className="space-y-4">
              {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map((category) => {
                const categoryMeals = groupedMeals[category];
                return (
                  <div key={category} className="space-y-2">
                    {/* Header */}
                    <div className="flex items-center gap-2 px-1 text-xs font-bold text-slate-400 capitalize">
                      {getMealTypeIcon(category)}
                      {category}
                    </div>

                    {categoryMeals.length === 0 ? (
                      <div className="border border-slate-900/60 bg-surface-medium/20 rounded-2xl p-4 flex items-center justify-between text-xs text-slate-500 select-none">
                        <span>No meals recorded for {category} today.</span>
                        <Badge variant="slate" className="text-[8px] uppercase py-0.5">Empty</Badge>
                      </div>
                    ) : (
                      <Card variant="glass" className="divide-y divide-slate-900/60 overflow-hidden">
                        {categoryMeals.map((meal) => (
                          <div key={meal.id} className="p-4 flex items-center justify-between hover:bg-slate-900/10 transition-colors">
                            <div className="flex items-center gap-3">
                              <img src={meal.imageUrl} alt={meal.mealName} className="h-12 w-12 rounded-xl object-cover border border-slate-800" />
                              <div>
                                <span className="text-xs font-bold text-slate-200 block">{meal.mealName}</span>
                                <span className="text-[10px] text-slate-500 block">
                                  P: {meal.protein}g · C: {meal.carbohydrates}g · F: {meal.fat}g
                                </span>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <span className="text-xs font-black text-slate-200 block">{meal.totalCalories} kcal</span>
                              {meal.confidence > 0 && (
                                <span className="text-[8px] text-slate-500">
                                  {Math.round(meal.confidence * 100)}% AI Confidence
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </Card>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </PageContainer>
  );
};

export default MealsPage;
