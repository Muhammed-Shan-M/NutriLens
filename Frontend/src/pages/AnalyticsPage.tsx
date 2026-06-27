import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getAnalytics } from '@/lib/analytics.api';
import PageContainer from '@/components/ui/PageContainer';
import Button from '@/components/ui/Button';
import { Activity, Flame, Beef, Croissant, Droplet, Target, Info } from 'lucide-react';
import WeeklyCaloriesChart from '@/features/analytics/components/WeeklyCaloriesChart';
import MacronutrientPieChart from '@/features/analytics/components/MacronutrientPieChart';
import ProteinTrendChart from '@/features/analytics/components/ProteinTrendChart';
import AiInsightCard from '@/features/analytics/components/AiInsightCard';
import StatCard from '@/features/analytics/components/StatCard';
import AnalyticsSkeleton from '@/features/analytics/components/AnalyticsSkeleton';
import EmptyState from '@/components/ui/EmptyState';
import FRONTEND_ROUTES from '../app/router/routes.constants';

const AnalyticsPage: React.FC = () => {
  const navigate = useNavigate();
  const [period, setPeriod] = useState<string>('7d');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['analytics', period],
    queryFn: () => getAnalytics(period),
  });

  const handlePeriodChange = (newPeriod: string) => {
    setPeriod(newPeriod);
  };

  return (
    <PageContainer>
      <div className="flex flex-col gap-8">
        
        {/* Header & Filters */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">Nutrition Analytics</h1>
            <p className="text-sm text-slate-400 mt-1">Focus on meaningful trends and AI insights.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 bg-slate-900/50 p-1.5 rounded-xl border border-slate-800">
            <Button
              variant={period === 'today' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => handlePeriodChange('today')}
              className={period !== 'today' ? 'text-slate-400 hover:text-white' : ''}
            >
              Today
            </Button>
            <Button
              variant={period === '7d' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => handlePeriodChange('7d')}
              className={period !== '7d' ? 'text-slate-400 hover:text-white' : ''}
            >
              7 Days
            </Button>
            <Button
              variant={period === '30d' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => handlePeriodChange('30d')}
              className={period !== '30d' ? 'text-slate-400 hover:text-white' : ''}
            >
              30 Days
            </Button>
            <Button
              variant={period === '90d' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => handlePeriodChange('90d')}
              className={period !== '90d' ? 'text-slate-400 hover:text-white' : ''}
            >
              90 Days
            </Button>
          </div>
        </div>

        {/* Loading / Error States */}
        {isLoading && <AnalyticsSkeleton />}
        
        {isError && !isLoading && (
          <EmptyState
            icon={<Info className="h-10 w-10 text-slate-500" />}
            title="Could not load analytics"
            description="There was a problem fetching your data. Please try again later."
          />
        )}

        {/* Empty State */}
        {data && data.trends.totalMeals === 0 && (
          <EmptyState
            icon={<Activity className="h-10 w-10 text-primary" />}
            title="No analytics available yet"
            description="Continue tracking your meals to unlock powerful insights about your nutrition habits, macronutrient breakdown, and goal progress."
            actionLabel="Log Your First Meal"
            onAction={() => navigate(FRONTEND_ROUTES.MEALS)}
          />
        )}

        {/* Content */}
        {data && data.trends.totalMeals > 0 && (
          <div className="space-y-6 animate-fade-in">
            
            {/* 1. Meaningful Statistics Row */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
              <StatCard 
                title="Avg Calories" 
                value={data.nutritionSummary.averageCalories} 
                unit="kcal" 
                icon={<Flame className="h-5 w-5" />} 
                iconColorClass="text-warning bg-warning/10" 
              />
              <StatCard 
                title="Avg Protein" 
                value={data.nutritionSummary.averageProtein} 
                unit="g" 
                icon={<Beef className="h-5 w-5" />} 
                iconColorClass="text-red-500 bg-red-500/10" 
              />
              <StatCard 
                title="Avg Carbs" 
                value={data.nutritionSummary.averageCarbohydrates} 
                unit="g" 
                icon={<Croissant className="h-5 w-5" />} 
                iconColorClass="text-amber-500 bg-amber-500/10" 
              />
              <StatCard 
                title="Avg Fat" 
                value={data.nutritionSummary.averageFat} 
                unit="g" 
                icon={<Droplet className="h-5 w-5" />} 
                iconColorClass="text-blue-500 bg-blue-500/10" 
              />
              <StatCard 
                title="Goal Met" 
                value={`${data.goalProgress.percentage}%`}
                icon={<Target className="h-5 w-5" />} 
                iconColorClass="text-primary bg-primary/10" 
              />
            </div>

            {/* 2. Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <MacronutrientPieChart data={data.macronutrientTotals} />
              </div>
              <div className="lg:col-span-2">
                <WeeklyCaloriesChart data={data.dailyCalories} />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-3">
                <ProteinTrendChart data={data.macronutrientTrend} />
              </div>
            </div>

            {/* 3. AI Insight Card */}
            <AiInsightCard period={period} />
            
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default AnalyticsPage;
