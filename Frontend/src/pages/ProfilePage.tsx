import React, { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Mail, Scale, Ruler, Flame, Settings, LogOut, CheckCircle, Activity, Target, Beef, Droplet, Croissant } from 'lucide-react';
import PageContainer from '@/components/ui/PageContainer';
import SectionTitle from '@/components/ui/SectionTitle';
import Card from '@/components/ui/Card';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import { getProfile, updateProfile } from '@/lib/profile.api';
import { useAuth } from '@/features/auth/hooks/useAuth';
import type { UpdateProfileInput } from '@/types/profile.types';

const profileSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(50, 'Too long'),
  age: z.coerce.number().min(12, 'Min age is 12').max(120, 'Max age is 120'),
  height: z.coerce.number().min(100, 'Min 100 cm').max(250, 'Max 250 cm'),
  weight: z.coerce.number().min(30, 'Min 30 kg').max(300, 'Max 300 kg'),
  activityLevel: z.enum(['sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extra_active']),
  goal: z.enum(['lose_weight', 'maintain_weight', 'gain_weight']),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export const ProfilePage: React.FC = () => {
  const queryClient = useQueryClient();
  const { logout } = useAuth();

  const { data: profile, isLoading, isError } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema) as any,
  });

  useEffect(() => {
    if (profile) {
      reset({
        fullName: profile.fullName || '',
        age: profile.age || 0,
        height: profile.height || 0,
        weight: profile.weight || 0,
        activityLevel: (profile.activityLevel as any) || 'sedentary',
        goal: (profile.goal as any) || 'maintain_weight',
      });
    }
  }, [profile, reset]);

  const updateMutation = useMutation({
    mutationFn: (data: UpdateProfileInput) => updateProfile(data),
    onSuccess: () => {
      toast.success('Profile updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update profile.');
    },
  });

  const onSubmit = (data: ProfileFormValues) => {
    updateMutation.mutate(data);
  };

  const handleLogout = () => {
    logout();
    queryClient.clear();
    toast.success('Logged out successfully');
  };

  if (isLoading) {
    return (
      <PageContainer>
        <SectionTitle title="My Profile" subtitle="Loading your profile data..." />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="flex flex-col gap-6">
            <Card variant="glass" className="flex flex-col items-center p-6 text-center h-[340px]">
              <Skeleton variant="circular" className="h-24 w-24 mb-4" />
              <Skeleton variant="text" className="w-32 h-6 mb-2" />
              <Skeleton variant="text" className="w-48 h-4 mb-6" />
              <div className="w-full border-t border-slate-900/60 pt-6 space-y-4">
                <Skeleton variant="text" className="w-full h-4" />
                <Skeleton variant="text" className="w-full h-4" />
                <Skeleton variant="text" className="w-full h-4" />
              </div>
            </Card>
          </div>
          <div className="lg:col-span-2 flex flex-col gap-6">
            <Card variant="default" className="h-[400px]">
              <Card.Content className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4 mt-8">
                   <Skeleton className="h-12 w-full" />
                   <Skeleton className="h-12 w-full" />
                </div>
                <div className="grid grid-cols-3 gap-4 mt-8">
                   <Skeleton className="h-12 w-full" />
                   <Skeleton className="h-12 w-full" />
                   <Skeleton className="h-12 w-full" />
                </div>
              </Card.Content>
            </Card>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (isError || !profile) {
    return (
      <PageContainer>
        <SectionTitle title="My Profile" subtitle="Error loading profile." />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <SectionTitle
        title="My Profile"
        subtitle="Manage your physical metrics, activity levels, and daily nutritional goals."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Card */}
        <div className="flex flex-col gap-6">
          <Card variant="glass" className="flex flex-col items-center p-6 text-center h-fit">
            <Avatar size="xl" name={profile.fullName} className="mb-4 shadow-xl border-2 border-primary/20" />
            
            <h3 className="text-lg font-bold text-slate-100 mb-1">{profile.fullName}</h3>
            <p className="text-xs text-slate-400 mb-4">{profile.email}</p>
            
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              <Badge variant="primary" className="capitalize">{profile.goal?.replace('_', ' ')}</Badge>
              <Badge variant="slate">Joined {new Date(profile.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}</Badge>
              {profile.bmiCategory && (
                <Badge variant={profile.bmiCategory === 'Normal Weight' ? 'success' : 'warning'}>
                  {profile.bmiCategory} (BMI: {profile.bmi})
                </Badge>
              )}
            </div>

            <div className="w-full border-t border-slate-900/60 pt-6 space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 flex items-center"><Scale className="h-3.5 w-3.5 mr-2 text-secondary" /> Weight</span>
                <span className="font-bold text-slate-200">{profile.weight} kg</span>
              </div>
              
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 flex items-center"><Ruler className="h-3.5 w-3.5 mr-2 text-accent" /> Height</span>
                <span className="font-bold text-slate-200">{profile.height} cm</span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 flex items-center"><Flame className="h-3.5 w-3.5 mr-2 text-primary" /> Daily Target</span>
                <span className="font-bold text-primary">{profile.dailyCalories} kcal</span>
              </div>
            </div>
          </Card>

          {/* Account Actions */}
          <Card variant="outlined">
            <Card.Header>
              <Card.Title className="text-sm">Account Actions</Card.Title>
            </Card.Header>
            <Card.Content>
              <Button variant="outline" className="w-full justify-center text-red-500 hover:text-red-400 border-red-900/50 hover:bg-red-900/20" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </Card.Content>
          </Card>
        </div>

        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Detailed Metrics Options */}
          <Card variant="default">
            <Card.Header>
              <Card.Title className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-slate-400" />
                Profile Information
              </Card.Title>
            </Card.Header>
            <Card.Content>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-slate-400 uppercase">Full Name</span>
                    <input
                      {...register('fullName')}
                      type="text"
                      className="bg-surface-high border border-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-100 outline-none focus:border-primary/50 transition"
                    />
                    {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-slate-400 uppercase">Email Address</span>
                    <div className="relative flex items-center">
                      <Mail className="absolute left-4 h-4 w-4 text-slate-500" />
                      <input
                        type="email"
                        disabled
                        value={profile.email}
                        className="w-full bg-surface-high border border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-sm text-slate-400 outline-none cursor-not-allowed opacity-60"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-900/60 pt-6">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-slate-400 uppercase">Age</span>
                    <input
                      {...register('age')}
                      type="number"
                      className="bg-surface-high border border-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-100 outline-none focus:border-primary/50 transition"
                    />
                    {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age.message}</p>}
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-slate-400 uppercase">Weight (kg)</span>
                    <input
                      {...register('weight')}
                      type="number"
                      step="0.1"
                      className="bg-surface-high border border-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-100 outline-none focus:border-primary/50 transition"
                    />
                    {errors.weight && <p className="text-red-500 text-xs mt-1">{errors.weight.message}</p>}
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-slate-400 uppercase">Height (cm)</span>
                    <input
                      {...register('height')}
                      type="number"
                      className="bg-surface-high border border-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-100 outline-none focus:border-primary/50 transition"
                    />
                    {errors.height && <p className="text-red-500 text-xs mt-1">{errors.height.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-slate-400 uppercase">Activity Level</span>
                    <div className="relative">
                      <Activity className="absolute left-4 top-3 h-4 w-4 text-slate-500" />
                      <select
                        {...register('activityLevel')}
                        className="w-full appearance-none bg-surface-high border border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-sm text-slate-100 outline-none focus:border-primary/50 transition"
                      >
                        <option value="sedentary">Sedentary (Little or no exercise)</option>
                        <option value="lightly_active">Lightly Active (1-3 days/week)</option>
                        <option value="moderately_active">Moderately Active (3-5 days/week)</option>
                        <option value="very_active">Very Active (6-7 days/week)</option>
                        <option value="extra_active">Extra Active (Very hard exercise/job)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-slate-400 uppercase">Goal</span>
                    <div className="relative">
                      <Target className="absolute left-4 top-3 h-4 w-4 text-slate-500" />
                      <select
                        {...register('goal')}
                        className="w-full appearance-none bg-surface-high border border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-sm text-slate-100 outline-none focus:border-primary/50 transition"
                      >
                        <option value="lose_weight">Lose Weight</option>
                        <option value="maintain_weight">Maintain Weight</option>
                        <option value="gain_weight">Gain Muscle/Weight</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-900/40 flex items-center justify-between">
                  <p className="text-xs text-slate-500">
                    Updating these metrics will automatically recalculate your nutritional targets.
                  </p>
                  <Button 
                    type="submit" 
                    variant="primary" 
                    disabled={!isDirty || updateMutation.isPending}
                    className="min-w-[140px] justify-center"
                  >
                    {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            </Card.Content>
          </Card>

          {/* Health Summary - Read Only */}
          <h3 className="text-sm font-bold text-slate-300 mt-2 mb-1 flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-primary" />
            Calculated Targets
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card variant="glass" className="p-4 flex flex-col items-center justify-center text-center">
              <span className="text-xs font-semibold text-slate-400 uppercase mb-1">BMR</span>
              <span className="text-xl font-bold text-white">{profile.bmr} <span className="text-xs text-slate-500">kcal</span></span>
            </Card>
            <Card variant="glass" className="p-4 flex flex-col items-center justify-center text-center">
              <span className="text-xs font-semibold text-slate-400 uppercase mb-1 flex items-center gap-1"><Beef className="h-3 w-3 text-red-400"/> Protein</span>
              <span className="text-xl font-bold text-white">{profile.protein} <span className="text-xs text-slate-500">g</span></span>
            </Card>
            <Card variant="glass" className="p-4 flex flex-col items-center justify-center text-center">
              <span className="text-xs font-semibold text-slate-400 uppercase mb-1 flex items-center gap-1"><Croissant className="h-3 w-3 text-amber-400"/> Carbs</span>
              <span className="text-xl font-bold text-white">{profile.carbs} <span className="text-xs text-slate-500">g</span></span>
            </Card>
            <Card variant="glass" className="p-4 flex flex-col items-center justify-center text-center">
              <span className="text-xs font-semibold text-slate-400 uppercase mb-1 flex items-center gap-1"><Droplet className="h-3 w-3 text-blue-400"/> Fat</span>
              <span className="text-xl font-bold text-white">{profile.fat} <span className="text-xs text-slate-500">g</span></span>
            </Card>
          </div>
          
        </div>
      </div>
    </PageContainer>
  );
};

export default ProfilePage;
