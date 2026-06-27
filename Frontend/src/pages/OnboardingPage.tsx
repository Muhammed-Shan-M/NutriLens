import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { Sparkles, Calendar, Scale, Ruler, Award } from 'lucide-react';
import toast from 'react-hot-toast';
import { onboardingSchema } from '@/validators/auth.validator';
import type { OnboardingInput } from '@/validators/auth.validator';
import axiosInstance from '@/lib/axios';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import PageContainer from '@/components/ui/PageContainer';
import SectionTitle from '@/components/ui/SectionTitle';

export const OnboardingPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OnboardingInput>({
    resolver: zodResolver(onboardingSchema) as any,
    defaultValues: {
      age: 25,
      gender: 'male',
      weight: 70,
      height: 175,
      activityLevel: 'moderately_active',
      goal: 'maintain_weight',
    },
  });

  const onSubmit = async (data: OnboardingInput) => {
    setLoading(true);
    try {
      // API call to backend to calculate and save onboarding profile
      const res = await axiosInstance.put('/auth/metrics', data);
      
      // Update Query cache for currentUser with calculated metrics
      queryClient.setQueryData(['currentUser'], res.data.data);
      
      toast.success('Health profile computed successfully!');
      
      // Navigate to personalized nutrition plan page
      navigate('/nutrition-plan');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save health metrics. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <div className="max-w-4xl mx-auto py-8">
        <SectionTitle
          title="Set Up Your Profile"
          subtitle="Provide your details to help us calculate your custom daily calorie and nutrient requirements."
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* Metric Form Container */}
          <Card variant="glass" className="lg:col-span-2">
            <Card.Content className="p-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    {...register('age', { valueAsNumber: true })}
                    label="Age (Years)"
                    type="number"
                    placeholder="25"
                    error={errors.age?.message}
                    leftIcon={<Calendar className="h-4 w-4" />}
                  />

                  <div className="flex flex-col gap-1.5 w-full">
                    <label className="text-xs font-semibold text-slate-400 tracking-wider uppercase ml-1">
                      Gender
                    </label>
                    <select
                      {...register('gender')}
                      className="w-full bg-surface-medium border border-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/10 transition-all duration-200"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.gender && (
                      <span className="text-[11px] font-medium text-warning mt-0.5 ml-1">
                        {errors.gender.message}
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    {...register('weight', { valueAsNumber: true })}
                    label="Weight (kg)"
                    type="number"
                    step="0.1"
                    placeholder="70"
                    error={errors.weight?.message}
                    leftIcon={<Scale className="h-4 w-4" />}
                  />

                  <Input
                    {...register('height', { valueAsNumber: true })}
                    label="Height (cm)"
                    type="number"
                    placeholder="175"
                    error={errors.height?.message}
                    leftIcon={<Ruler className="h-4 w-4" />}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5 w-full">
                    <label className="text-xs font-semibold text-slate-400 tracking-wider uppercase ml-1">
                      Activity Level
                    </label>
                    <select
                      {...register('activityLevel')}
                      className="w-full bg-surface-medium border border-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/10 transition-all duration-200"
                    >
                      <option value="sedentary">Sedentary (Little to no exercise)</option>
                      <option value="lightly_active">Lightly Active (1-3 days/week)</option>
                      <option value="moderately_active">Moderately Active (3-5 days/week)</option>
                      <option value="very_active">Very Active (6-7 days/week)</option>
                      <option value="extra_active">Extra Active (Very heavy exercise / physical job)</option>
                    </select>
                    {errors.activityLevel && (
                      <span className="text-[11px] font-medium text-warning mt-0.5 ml-1">
                        {errors.activityLevel.message}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5 w-full">
                    <label className="text-xs font-semibold text-slate-400 tracking-wider uppercase ml-1">
                      Fitness Goal
                    </label>
                    <select
                      {...register('goal')}
                      className="w-full bg-surface-medium border border-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/10 transition-all duration-200"
                    >
                      <option value="lose_weight">Lose Weight</option>
                      <option value="maintain_weight">Maintain Weight</option>
                      <option value="gain_weight">Gain Weight</option>
                    </select>
                    {errors.goal && (
                      <span className="text-[11px] font-medium text-warning mt-0.5 ml-1">
                        {errors.goal.message}
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full md:w-auto"
                    isLoading={loading}
                    rightIcon={<Award className="h-4 w-4" />}
                  >
                    Calculate Nutrition Plan
                  </Button>
                </div>
              </form>
            </Card.Content>
          </Card>

          {/* Why this matters Card */}
          <Card variant="default" className="bg-gradient-to-br from-surface-medium to-surface-high border border-slate-800 h-fit">
            <Card.Header>
              <Card.Title className="flex items-center text-primary text-base font-bold">
                <Sparkles className="h-5 w-5 mr-2" />
                Tailored Caloric Target
              </Card.Title>
            </Card.Header>
            <Card.Content className="space-y-4 p-5 pt-0">
              <p className="text-sm text-slate-300 leading-relaxed">
                We use standard formulas combined with active adjustments calculated using your metrics:
              </p>
              
              <div className="space-y-4 pt-2">
                <div className="flex gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">Basal Metabolic Rate (BMR)</h4>
                    <p className="text-[11px] text-slate-400">Energy consumed by your body at rest.</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="h-6 w-6 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-bold text-xs shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">Active Expenditure (TDEE)</h4>
                    <p className="text-[11px] text-slate-400">Total expenditure adjusted according to your daily activities.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="h-6 w-6 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-xs shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">Goal Correction</h4>
                    <p className="text-[11px] text-slate-400">Caloric deficit or surplus applied to match weight target.</p>
                  </div>
                </div>
              </div>
            </Card.Content>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};

export default OnboardingPage;
