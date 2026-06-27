import React from 'react';
import { Bell, Search } from 'lucide-react';

interface DashboardHeaderProps {
  userName?: string;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ userName }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getFormattedDate = () => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric' 
    };
    return new Date().toLocaleDateString('en-US', options);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-900/60">
      <div className="space-y-1">
        <h1 className="text-2xl font-black text-slate-100 tracking-tight">
          {getGreeting()}{userName ? `, ${userName}` : ''}
        </h1>
        <p className="text-xs font-semibold text-slate-400">
          {getFormattedDate()}
        </p>
      </div>

      <div className="flex items-center gap-3 self-end sm:self-auto">
        {/* Mock Search Bar */}
        <div className="relative hidden md:block w-64">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search foods, recipes..."
            className="w-full bg-surface-medium border border-slate-800 rounded-full pl-10 pr-4 py-2 text-xs text-slate-100 outline-none focus:border-primary/50 transition-all"
          />
        </div>

        {/* Notifications Button */}
        <button className="relative h-10 w-10 rounded-2xl bg-surface-medium border border-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-100 hover:border-slate-700/80 transition-all cursor-pointer">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-primary ring-2 ring-background animate-pulse" />
        </button>

        {/* Avatar */}
        <div className="h-10 w-10 rounded-2xl border border-slate-800 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-sm font-black text-primary select-none">
          {userName ? userName.charAt(0).toUpperCase() : 'U'}
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
