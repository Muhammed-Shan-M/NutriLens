import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  History, 
  BarChart3, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Sparkles,
  Camera,
  Utensils
} from 'lucide-react';

import { useAuth } from '@/features/auth/hooks/useAuth';
import toast from 'react-hot-toast';

export const MainLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Meals', path: '/meals', icon: Utensils },
    { name: 'History', path: '/history', icon: History },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Successfully logged out!');
      navigate('/', { replace: true });
    } catch (err: any) {
      toast.error('Logout failed. Please try again.');
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Background soft gradients */}
      <div className="absolute top-0 right-0 h-[400px] w-[400px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-secondary/5 blur-[120px] pointer-events-none" />

      {/* --- Sidebar Desktop --- */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-surface-medium border-r border-slate-900/80 z-20">
        <div className="flex h-16 items-center px-6 gap-3 border-b border-slate-900/80">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-secondary">
            <Camera className="h-5 w-5 text-background" />
          </div>
          <span className="text-xl font-bold tracking-wider bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            NutriLens
          </span>
        </div>

        <div className="flex flex-col flex-1 overflow-y-auto px-4 py-6">
          <nav className="space-y-1.5 flex-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-sm font-medium rounded-2xl transition-all duration-200 ${
                    isActive
                      ? 'bg-primary/10 text-primary border-l-4 border-primary shadow-sm shadow-primary/5'
                      : 'text-slate-400 hover:bg-slate-900/50 hover:text-slate-200'
                  }`
                }
              >
                <item.icon className="mr-3.5 h-5 w-5 shrink-0" />
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* AI Status / Quick Help */}
          <div className="glass-panel p-4 rounded-2xl mb-4 border border-primary/20">
            <div className="flex items-center text-xs font-semibold text-primary mb-1">
              <Sparkles className="h-3.5 w-3.5 mr-1" />
              AI NUTRILENS ACTIVE
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Upload photos of your meals to track nutrients instantly.
            </p>
          </div>

          {/* Logout Section */}
          <div className="border-t border-slate-900/80 pt-4">
            <button
              onClick={handleLogout}
              className="flex w-full items-center px-4 py-3 text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 rounded-2xl transition-all duration-200"
            >
              <LogOut className="mr-3.5 h-5 w-5 shrink-0" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* --- Main Content Area --- */}
      <div className="flex flex-col flex-1 md:pl-64 h-full">
        {/* Top Navbar */}
        <header className="flex h-16 items-center justify-between px-6 bg-surface-medium/50 backdrop-blur-md border-b border-slate-900/80 z-10">
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-900/50 hover:text-slate-200 border border-slate-800"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-semibold tracking-wide text-slate-200">
              Welcome back
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick action button */}
            <button
              onClick={() => navigate('/analytics')}
              className="hidden sm:inline-flex items-center px-3.5 py-1.5 text-xs font-medium bg-primary text-background rounded-full hover:bg-primary/90 transition-all shadow-md shadow-primary/10 hover:-translate-y-0.5"
            >
              <Sparkles className="h-3.5 w-3.5 mr-1.5" />
              Analyze Meal
            </button>
            
            {/* User Profile Mini Badge */}
            <div 
              onClick={() => navigate('/profile')}
              className="flex items-center gap-2 cursor-pointer p-1 pr-3 rounded-full bg-slate-900 hover:bg-slate-850 transition border border-slate-850 group"
            >
              <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs uppercase group-hover:bg-primary/30 transition-colors">
                {user?.fullName?.substring(0, 2) || 'NL'}
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-xs font-medium text-slate-300 leading-tight">{user?.fullName || 'User'}</span>
                <span className="text-[10px] text-slate-500 leading-tight">{user?.email || ''}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Nested Page Content */}
        <main className="flex-1 overflow-y-auto bg-background p-6 md:p-8">
          <div className="mx-auto max-w-6xl w-full">
            <Outlet />
          </div>
        </main>
      </div>

      {/* --- Mobile Menu Drawer --- */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden flex">
          {/* Backdrop overlay */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative flex w-full max-w-xs flex-1 flex-col bg-surface-medium pt-5 pb-4 transition-transform z-50">
            <div className="absolute top-4 right-4">
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-900/50 hover:text-slate-200 border border-slate-800"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Logo */}
            <div className="flex items-center px-6 gap-3 mb-8">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-secondary">
                <Camera className="h-5 w-5 text-background" />
              </div>
              <span className="text-xl font-bold tracking-wider bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                NutriLens
              </span>
            </div>

            {/* Navigation links */}
            <nav className="flex-1 space-y-1 px-4 overflow-y-auto">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3.5 text-sm font-medium rounded-2xl transition-all duration-200 ${
                      isActive
                        ? 'bg-primary/10 text-primary border-l-4 border-primary shadow-sm shadow-primary/5'
                        : 'text-slate-400 hover:bg-slate-900/50 hover:text-slate-200'
                    }`
                  }
                >
                  <item.icon className="mr-3.5 h-5 w-5 shrink-0" />
                  {item.name}
                </NavLink>
              ))}
            </nav>

            {/* Mobile Footer */}
            <div className="border-t border-slate-900/80 px-4 pt-4">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="flex w-full items-center px-4 py-3 text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 rounded-2xl transition-all duration-200"
              >
                <LogOut className="mr-3.5 h-5 w-5 shrink-0" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainLayout;
