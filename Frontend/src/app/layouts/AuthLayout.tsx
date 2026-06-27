import React from 'react';
import { Outlet } from 'react-router-dom';
import { Camera, Sparkles, CheckCircle2, Flame } from 'lucide-react';

export const AuthLayout: React.FC = () => {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-4 py-8 lg:py-12">
      {/* Premium background gradient effects */}
      <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-secondary/5 blur-[120px] pointer-events-none" />
      
      {/* Responsive Grid Container */}
      <div className="w-full max-w-md lg:max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center z-10 my-auto">
        
        {/* Left Side: Brand, welcome text, and mock visual */}
        <div className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left gap-6 animate-in fade-in slide-in-from-left-4 duration-300">
          
          {/* Logo & title */}
          <div className="flex flex-col lg:flex-row items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary to-secondary p-2.5 shadow-lg shadow-primary/10">
              <Camera className="h-6 w-6 text-background font-bold" />
            </div>
            <div className="flex flex-col items-center lg:items-start">
              <h1 className="text-2xl font-black tracking-wider bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                NutriLens
              </h1>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                AI Nutrition Tracker
              </p>
            </div>
          </div>

          <div className="space-y-2.5 max-w-sm lg:max-w-none">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-100 leading-tight">
              Start Tracking in <span className="text-primary font-bold">Seconds</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
              Join thousands of health-focused individuals scanning plates, identifying ingredients, and logging dynamic calorie targets daily using advanced computer vision.
            </p>
          </div>

          {/* Premium mockup visual details (Desktop only) */}
          <div className="hidden lg:flex flex-col gap-4 w-full pt-4">
            <div className="glass-panel border-slate-800/80 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-slate-900/60 pb-3">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                  Live Plate Analysis
                </span>
                <span className="text-[9px] uppercase tracking-wider font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 rounded-full flex items-center gap-1 select-none">
                  Analyzed <CheckCircle2 className="h-3 w-3" />
                </span>
              </div>

              {/* Progress visual rings mock */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-900/40 border border-slate-900 rounded-xl p-3 flex flex-col gap-1.5 items-center text-center">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Calories</span>
                  <div className="text-sm font-black text-slate-200">450 <span className="text-[8px] font-normal text-slate-500">kcal</span></div>
                  <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-primary h-full rounded-full" style={{ width: '65%' }} />
                  </div>
                </div>

                <div className="bg-slate-900/40 border border-slate-900 rounded-xl p-3 flex flex-col gap-1.5 items-center text-center">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Protein</span>
                  <div className="text-sm font-black text-slate-200">38g</div>
                  <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-secondary h-full rounded-full" style={{ width: '80%' }} />
                  </div>
                </div>

                <div className="bg-slate-900/40 border border-slate-900 rounded-xl p-3 flex flex-col gap-1.5 items-center text-center">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Fats</span>
                  <div className="text-sm font-black text-slate-200">12g</div>
                  <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-warning h-full rounded-full" style={{ width: '45%' }} />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 text-[10px] text-slate-400 font-medium">
                <span>🥑 Avocado Salad</span> • <span>🍗 Grilled Chicken Breast</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2.5 text-xs text-slate-500 font-semibold pl-2">
              <Flame className="h-4 w-4 text-warning" />
              Maintain a healthy diet. Log your targets dynamically.
            </div>
          </div>

        </div>

        {/* Right Side: The Outlet wrapped in the Card */}
        <main className="lg:col-span-7 w-full flex items-center justify-center z-10 animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="glass-panel w-full rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl shadow-black/60 border border-slate-800/80">
            <Outlet />
          </div>
        </main>

      </div>

      {/* Footer */}
      <footer className="mt-12 lg:mt-16 text-center text-xs text-slate-500 z-10 w-full border-t border-slate-900/40 pt-4 max-w-5xl">
        &copy; {new Date().getFullYear()} NutriLens. All rights reserved.
      </footer>
    </div>
  );
};

export default AuthLayout;
