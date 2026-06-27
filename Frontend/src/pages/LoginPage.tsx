import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { loginSchema } from '@/validators/auth.validator';
import type { LoginInput } from '@/validators/auth.validator';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import AuthHeader from '@/components/ui/AuthHeader';

import { useAuth } from '@/features/auth/hooks/useAuth';
import type { ApiError } from '@/types/api.types';
import FRONTEND_ROUTES from '../app/router/routes.constants';

export const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setLoading(true);
    try {
      await login({
        email: data.email,
        password: data.password,
      });

      toast.success('Welcome back to NutriLens!');
      
      // Navigate to dashboard and replace history stack so back button doesn't go back to login
      navigate(FRONTEND_ROUTES.DASHBOARD, { replace: true });
    } catch (err: unknown) {
      const apiError = err as ApiError;
      if (apiError.errors && Array.isArray(apiError.errors)) {
        apiError.errors.forEach((validationErr) => {
          const field = validationErr.field as 'email' | 'password';
          setError(field, {
            type: 'server',
            message: validationErr.message,
          });
        });
      } else {
        toast.error(apiError.message || 'Authentication failed. Please verify credentials.');
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex flex-col gap-6 w-full max-w-sm mx-auto">
      <AuthHeader 
        title="Sign In" 
        subtitle="Enter your credentials to access your tracking panel" 
      />

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* Email field */}
        <Input
          {...register('email')}
          label="Email Address"
          placeholder="you@example.com"
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
          autoComplete="current-password"
        />

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          className="w-full mt-2 hover:scale-[1.01] transition-transform duration-250"
          isLoading={loading}
          rightIcon={<LogIn className="h-4 w-4" />}
        >
          Sign In
        </Button>
      </form>

      {/* Footer Navigation */}
      <div className="text-center text-xs text-slate-400 mt-2 font-normal">
        Don't have an account?{' '}
        <Link to={FRONTEND_ROUTES.SIGNUP} className="text-primary hover:text-primary/80 hover:underline font-semibold transition-all">
          Sign up
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
