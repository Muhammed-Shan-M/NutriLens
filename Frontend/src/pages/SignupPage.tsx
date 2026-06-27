import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, UserPlus, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { signupSchema } from '@/validators/auth.validator';
import type { SignupInput } from '@/validators/auth.validator';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import AuthHeader from '@/components/ui/AuthHeader';

import { useAuth } from '@/features/auth/hooks/useAuth';
import type { ApiError } from '@/types/api.types';
import FRONTEND_ROUTES from '../app/router/routes.constants';

export const SignupPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { signup } = useAuth();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: SignupInput) => {
    setLoading(true);
    try {
      await signup({
        fullName: data.name,
        email: data.email,
        password: data.password,
      });
      
      toast.success('Account created successfully!');
      
      // Redirect new users to onboarding and replace history
      navigate(FRONTEND_ROUTES.ONBOARDING, { replace: true });
    } catch (err: unknown) {
      const apiError = err as ApiError;
      if (apiError.errors && Array.isArray(apiError.errors)) {
        apiError.errors.forEach((validationErr) => {
          // Map backend 'fullName' error back to frontend 'name' field
          const field = validationErr.field === 'fullName' ? 'name' : (validationErr.field as 'name' | 'email' | 'password' | 'confirmPassword');
          setError(field, {
            type: 'server',
            message: validationErr.message,
          });
        });
      } else {
        toast.error(apiError.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex flex-col gap-6 w-full max-w-sm mx-auto">
      <AuthHeader 
        title="Create Account" 
        subtitle="Get started with your personalized health tracker" 
      />

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* Full Name field */}
        <Input
          {...register('name')}
          label="Full Name"
          placeholder="John Doe"
          type="text"
          error={errors.name?.message}
          leftIcon={<User className="h-4 w-4 text-slate-500" />}
          autoComplete="name"
        />

        {/* Email field */}
        <Input
          {...register('email')}
          label="Email Address"
          placeholder="john@example.com"
          type="email"
          error={errors.email?.message}
          leftIcon={<Mail className="h-4 w-4 text-slate-500" />}
          autoComplete="email"
        />

        {/* Password field */}
        <Input
          {...register('password')}
          label="Password"
          placeholder="••••••••"
          type={showPassword ? 'text' : 'password'}
          error={errors.password?.message}
          leftIcon={<Lock className="h-4 w-4 text-slate-500" />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-slate-500 hover:text-slate-300 transition-colors p-1 focus:outline-none cursor-pointer"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
          autoComplete="new-password"
        />

        {/* Confirm Password field */}
        <Input
          {...register('confirmPassword')}
          label="Confirm Password"
          placeholder="••••••••"
          type={showConfirmPassword ? 'text' : 'password'}
          error={errors.confirmPassword?.message}
          leftIcon={<Lock className="h-4 w-4 text-slate-500" />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="text-slate-500 hover:text-slate-300 transition-colors p-1 focus:outline-none cursor-pointer"
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
          autoComplete="new-password"
        />

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          className="w-full mt-2 hover:scale-[1.01] transition-transform duration-250"
          isLoading={loading}
          rightIcon={<UserPlus className="h-4 w-4" />}
        >
          Create Account
        </Button>
      </form>

      {/* Footer Navigation */}
      <div className="text-center text-xs text-slate-400 mt-2 font-normal">
        Already have an account?{' '}
        <Link to={FRONTEND_ROUTES.LOGIN} className="text-primary hover:text-primary/80 hover:underline font-semibold transition-all">
          Sign in
        </Link>
      </div>
    </div>
  );
};

export default SignupPage;
