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
import FormDivider from '@/components/ui/FormDivider';

import { useAuth } from '@/features/auth/hooks/useAuth';
import type { ApiError } from '@/types/api.types';
import FRONTEND_ROUTES from '../app/router/routes.constants';

export const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
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

  const handleGoogleLogin = () => {
    toast('Google Sign-In is a mock feature for now.', { icon: '🌐' });
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

        {/* Remember Me and Forgot Password row */}
        <div className="flex items-center justify-between text-xs mt-1">
          <label className="flex items-center gap-2 text-slate-400 font-semibold cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded-md border border-slate-800 bg-surface-medium text-primary focus:ring-primary/20 accent-primary"
            />
            Remember Me
          </label>

          <Link
            to="/login"
            className="text-primary hover:text-primary/80 transition-colors font-semibold"
            onClick={(e) => {
              e.preventDefault();
              toast('Password recovery is a mock feature for now.', { icon: '🔑' });
            }}
          >
            Forgot Password?
          </Link>
        </div>

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

      {/* Social login option */}
      <FormDivider />

      <button
        onClick={handleGoogleLogin}
        className="glass-panel border-slate-800/80 rounded-2xl py-3 w-full flex items-center justify-center gap-2.5 hover:bg-slate-900/40 text-slate-300 font-semibold text-sm transition-all duration-250 cursor-pointer active:scale-98 border"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
        </svg>
        Continue with Google
      </button>

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
