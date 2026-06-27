import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { 
  Sparkles, 
  Activity, 
  Flame, 
  Beef, 
  Croissant, 
  Droplet, 
  UserCheck, 
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/features/auth/hooks/useAuth';
import axiosInstance from '@/lib/axios';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import PageContainer from '@/components/ui/PageContainer';

export const NutritionPlanPage: React.FC = () => {
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleStartTracking = async () => {
    setSubmitting(true);
    try {
      // API call to backend to set isOnboarded = true
      const res = await axiosInstance.put('/auth/complete-onboarding');
      
      // Update Query cache for currentUser
      queryClient.setQueryData(['currentUser'], res.data.data);
      
      toast.success('Ready to track! Loading your dashboard...', { icon: '🚀' });
      
      // Redirect to dashboard page and replace history
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      toast.error(err.message || 'Failed to complete onboarding. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) return null;

  // Formatting strings
  const formatEnumText = (text?: string) => {
    if (!text) return '';
    return text
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // BMI Status Badge Style
  const getBmiCategoryColor = (category?: string) => {
    switch (category?.toLowerCase()) {
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

  // Calories breakdown
  const pCal = (user.protein || 0) * 4;
  const fCal = (user.fat || 0) * 9;
  const cCal = (user.carbs || 0) * 4;
  const totalCal = pCal + fCal + cCal || 1;

  const pPct = Math.round((pCal / totalCal) * 100);
  const fPct = Math.round((fCal / totalCal) * 100);
  const cPct = Math.round((cCal / totalCal) * 100);

  return (
    <PageContainer>
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
        
        {/* Header Presentation Block */}
        <div className="flex flex-col items-center text-center space-y-4 mb-10 animate-fade-in">
          <div className="inline-flex p-3 rounded-full bg-primary/10 border border-primary/20 text-primary">
            <Sparkles className="h-6 w-6 animate-pulse" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
            Your Personalized Health Blueprint
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-xl">
            Welcome, <span className="text-primary font-semibold">{user.fullName}</span>! Based on your body metrics and targets, we have computed your scientific nutritional plan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Daily Calories & Progress Circular Visualization */}
          <Card variant="glass" className="md:col-span-1 border border-slate-800 flex flex-col justify-between">
            <Card.Header className="pb-2">
              <Card.Title className="text-slate-300 text-sm font-semibold tracking-wider uppercase flex items-center gap-2">
                <Flame className="h-4 w-4 text-warning" />
                Daily Target
              </Card.Title>
            </Card.Header>
            <Card.Content className="flex flex-col items-center justify-center p-6 space-y-6">
              {/* Pulse Ring Visualizer Container */}
              <div className="relative flex items-center justify-center h-44 w-44 rounded-full border border-slate-800 bg-surface-medium/50 shadow-inner">
                {/* SVG Progress Ring */}
                <svg className="absolute h-full w-full transform -rotate-90">
                  <circle
                    cx="88"
                    cy="88"
                    r="80"
                    stroke="#1C2A20"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="88"
                    cy="88"
                    r="80"
                    stroke="#4AC882"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 80}
                    strokeDashoffset={2 * Math.PI * 80 * 0.25} // 75% target ring
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                
                <div className="flex flex-col items-center text-center z-10">
                  <span className="text-4xl font-extrabold text-slate-100 tracking-tighter">
                    {user.dailyCalories}
                  </span>
                  <span className="text-xs font-medium text-slate-400 tracking-wider uppercase mt-1">
                    kcal / day
                  </span>
                </div>
              </div>

              <div className="text-center w-full bg-surface-medium/40 border border-slate-800/60 rounded-xl py-3 px-4">
                <span className="text-xs text-slate-400 font-medium">BMR: </span>
                <span className="text-sm font-bold text-slate-200">{user.bmr} kcal</span>
                <span className="mx-2 text-slate-600">|</span>
                <span className="text-xs text-slate-400 font-medium">TDEE: </span>
                <span className="text-sm font-bold text-slate-200">{user.tdee} kcal</span>
              </div>
            </Card.Content>
          </Card>

          {/* Macros Distribution */}
          <Card variant="glass" className="md:col-span-2 border border-slate-800 flex flex-col justify-between">
            <Card.Header className="pb-2">
              <Card.Title className="text-slate-300 text-sm font-semibold tracking-wider uppercase flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                Macronutrients Splits
              </Card.Title>
            </Card.Header>
            <Card.Content className="p-6 space-y-6">
              
              {/* Protein Bar */}
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-red-500/10 text-red-400">
                      <Beef className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-slate-200">Protein</span>
                      <p className="text-[10px] text-slate-500">2g per kg of bodyweight</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-extrabold text-slate-200">{user.protein}g</span>
                    <span className="text-xs text-slate-500 ml-1">({pPct}%)</span>
                  </div>
                </div>
                <div className="h-3 w-full bg-slate-800/80 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-red-400 rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${pPct}%` }}
                  />
                </div>
              </div>

              {/* Carbohydrates Bar */}
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                      <Croissant className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-slate-200">Carbohydrates</span>
                      <p className="text-[10px] text-slate-500">Energy source target balance</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-extrabold text-slate-200">{user.carbs}g</span>
                    <span className="text-xs text-slate-500 ml-1">({cPct}%)</span>
                  </div>
                </div>
                <div className="h-3 w-full bg-slate-800/80 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-400 rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${cPct}%` }}
                  />
                </div>
              </div>

              {/* Fat Bar */}
              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
                      <Droplet className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-slate-200">Fat</span>
                      <p className="text-[10px] text-slate-500">25% of total calorie target</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-extrabold text-slate-200">{user.fat}g</span>
                    <span className="text-xs text-slate-500 ml-1">({fPct}%)</span>
                  </div>
                </div>
                <div className="h-3 w-full bg-slate-800/80 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-400 rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${fPct}%` }}
                  />
                </div>
              </div>

            </Card.Content>
          </Card>
          
        </div>

        {/* BMI & Body Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          
          {/* BMI Card */}
          <Card variant="glass" className="border border-slate-800 p-6 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Body Mass Index (BMI)</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-4xl font-black text-slate-100">{user.bmi}</span>
                  <span className="text-sm text-slate-500">kg / m²</span>
                </div>
              </div>
              
              <div className={`text-xs font-bold px-3 py-1.5 border rounded-full ${getBmiCategoryColor(user.bmiCategory)}`}>
                {user.bmiCategory}
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed mt-4">
              Your BMI of <span className="text-slate-200 font-medium">{user.bmi}</span> falls into the <span className="text-slate-200 font-medium">{user.bmiCategory}</span> category. We have scaled your macro splits and calorie deficit threshold to match these characteristics safely.
            </p>
          </Card>

          {/* User Parameters Summary */}
          <Card variant="glass" className="border border-slate-800 p-6">
            <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase flex items-center gap-1.5 mb-3">
              <UserCheck className="h-4 w-4 text-accent" />
              Physical Parameters Summary
            </span>

            <div className="grid grid-cols-2 gap-x-4 gap-y-3 pt-2 text-xs">
              <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
                <span className="text-slate-500 font-medium">Height</span>
                <span className="text-slate-200 font-bold">{user.height} cm</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
                <span className="text-slate-500 font-medium">Weight</span>
                <span className="text-slate-200 font-bold">{user.weight} kg</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
                <span className="text-slate-500 font-medium">Age</span>
                <span className="text-slate-200 font-bold">{user.age} Years</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/60 pb-1.5">
                <span className="text-slate-500 font-medium">Gender</span>
                <span className="text-slate-200 font-bold capitalize">{user.gender}</span>
              </div>
              <div className="flex justify-between col-span-2 border-b border-slate-800/60 pb-1.5">
                <span className="text-slate-500 font-medium">Activity Level</span>
                <span className="text-slate-200 font-bold truncate max-w-[180px]">{formatEnumText(user.activityLevel)}</span>
              </div>
              <div className="flex justify-between col-span-2 pb-1">
                <span className="text-slate-500 font-medium">Program Target</span>
                <span className="text-accent font-bold flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  {formatEnumText(user.goal)}
                </span>
              </div>
            </div>
          </Card>

        </div>

        {/* CTA Button Block */}
        <div className="flex flex-col items-center mt-10">
          <Button
            onClick={handleStartTracking}
            variant="primary"
            size="lg"
            isLoading={submitting}
            className="w-full sm:w-auto px-12 py-4 rounded-2xl text-base font-extrabold tracking-wide shadow-lg shadow-primary/10 hover:shadow-primary/20 hover:scale-[1.02] transform transition-all duration-200"
            rightIcon={<ArrowRight className="h-5 w-5" />}
          >
            Start Tracking
          </Button>
          <p className="text-[11px] text-slate-500 mt-3">
            By clicking "Start Tracking", you lock in this calorie and nutrient profile.
          </p>
        </div>

      </div>
    </PageContainer>
  );
};

export default NutritionPlanPage;
