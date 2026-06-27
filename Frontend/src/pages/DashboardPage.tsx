import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, Beef, Croissant, Droplet, Camera } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getDashboardSummary } from '@/lib/dashboard.api';
import PageContainer from '@/components/ui/PageContainer';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import DashboardHeader from '@/features/dashboard/components/DashboardHeader';
import StatCard from '@/features/dashboard/components/StatCard';
import CaloriesProgressCard from '@/features/dashboard/components/CaloriesProgressCard';
import MacronutrientProgress from '@/features/dashboard/components/MacronutrientProgress';
import MealTimeline from '@/features/dashboard/components/MealTimeline';
import QuickActions from '@/features/dashboard/components/QuickActions';
import WeeklyChart from '@/features/dashboard/components/WeeklyChart';
import HealthSummaryCard from '@/features/dashboard/components/HealthSummaryCard';
import DashboardSkeleton from '@/features/dashboard/components/DashboardSkeleton';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['dashboardSummary'],
    queryFn: getDashboardSummary,
  });

  if (isLoading || isError || !data) {
    return <PageContainer><DashboardSkeleton /></PageContainer>;
  }

  const { userSummary, nutritionSummary, todayMeals, healthSummary } = data;
  const firstName = userSummary.fullName.split(' ')[0] ?? 'there';
  const formatGoal = (g: string) => g ? g.split('_').map(w => w[0].toUpperCase() + w.slice(1)).join(' ') : '—';

  return (
    <PageContainer>
      <div className="space-y-8">
        {/* Top Header */}
        <DashboardHeader userName={firstName} />

        {/* Welcome Banner */}
        <Card variant="glass" className="border border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 overflow-hidden relative">
          <div className="absolute -top-12 -right-12 h-40 w-40 bg-primary/10 rounded-full filter blur-3xl pointer-events-none" />
          <Card.Content className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] font-bold text-primary tracking-widest uppercase">Daily Check-In</span>
              </div>
              <h2 className="text-lg font-extrabold text-slate-100">
                You're on track, {firstName}! 🎯
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                Your {formatGoal(userSummary.goal)} program is active. Log your first meal to start building your daily nutrition log.
              </p>
            </div>
            <div className="flex flex-col sm:items-end gap-3 shrink-0">
              <Badge variant="primary" className="self-start sm:self-auto text-[9px] font-bold uppercase px-2 py-0.5">
                {formatGoal(userSummary.goal)}
              </Badge>
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/meals')}
                rightIcon={<Camera className="h-4 w-4" />}
              >
                Upload Meal
              </Button>
            </div>
          </Card.Content>
        </Card>

        {/* Daily Stats Grid (Targets vs Consumed) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Daily Calories"
            value={nutritionSummary.calories.target}
            unit="kcal"
            icon={<Flame className="h-5 w-5" />}
            iconColorClass="bg-warning/10 text-warning border-warning/20"
          />
          <StatCard
            title="Protein"
            value={nutritionSummary.protein.target}
            unit="g"
            icon={<Beef className="h-5 w-5" />}
            iconColorClass="bg-red-500/10 text-red-400 border-red-500/20"
          />
          <StatCard
            title="Carbohydrates"
            value={nutritionSummary.carbohydrates.target}
            unit="g"
            icon={<Croissant className="h-5 w-5" />}
            iconColorClass="bg-amber-500/10 text-amber-400 border-amber-500/20"
          />
          <StatCard
            title="Fat"
            value={nutritionSummary.fat.target}
            unit="g"
            icon={<Droplet className="h-5 w-5" />}
            iconColorClass="bg-blue-500/10 text-blue-400 border-blue-500/20"
          />
        </div>

        {/* Progress Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CaloriesProgressCard target={nutritionSummary.calories.target} consumed={nutritionSummary.calories.consumed} />
          <div className="md:col-span-2">
            <MacronutrientProgress
              proteinTarget={nutritionSummary.protein.target}
              carbsTarget={nutritionSummary.carbohydrates.target}
              fatTarget={nutritionSummary.fat.target}
              proteinConsumed={nutritionSummary.protein.consumed}
              carbsConsumed={nutritionSummary.carbohydrates.consumed}
              fatConsumed={nutritionSummary.fat.consumed}
            />
          </div>
        </div>

        {/* Remaining Nutrition */}
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 mb-4">
            Remaining Today
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Calories', remaining: nutritionSummary.calories.remaining, unit: 'kcal', dotClass: 'bg-warning' },
              { label: 'Protein', remaining: nutritionSummary.protein.remaining, unit: 'g', dotClass: 'bg-red-400' },
              { label: 'Carbs', remaining: nutritionSummary.carbohydrates.remaining, unit: 'g', dotClass: 'bg-amber-400' },
              { label: 'Fat', remaining: nutritionSummary.fat.remaining, unit: 'g', dotClass: 'bg-blue-400' },
            ].map((item) => (
              <Card key={item.label} variant="default" className="border border-slate-800 hover:border-slate-700/80 transition-all duration-200">
                <Card.Content className="p-4 flex items-center gap-3">
                  <span className={`block h-2 w-2 rounded-full shrink-0 ${item.dotClass}`} />
                  <div>
                    <span className="text-[10px] text-slate-500 font-medium block">{item.label}</span>
                    <span className="text-sm font-extrabold text-slate-200">{item.remaining} {item.unit}</span>
                  </div>
                </Card.Content>
              </Card>
            ))}
          </div>
        </div>

        {/* Timeline + Weekly Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MealTimeline meals={todayMeals} />
          <WeeklyChart targetCalories={nutritionSummary.calories.target} />
        </div>

        {/* Quick Actions */}
        <QuickActions />

        {/* Health Summary */}
        <div className="grid grid-cols-1 gap-6">
          <HealthSummaryCard
            bmi={healthSummary.bmi}
            bmiCategory={healthSummary.bmiCategory}
            goal={healthSummary.goal}
            activityLevel={healthSummary.activityLevel}
          />
        </div>
      </div>
    </PageContainer>
  );
};

export default DashboardPage;
