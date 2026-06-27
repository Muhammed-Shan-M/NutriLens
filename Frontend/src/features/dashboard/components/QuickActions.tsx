import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@/components/ui/Card';
import { Camera, History, BarChart3, User, ChevronRight } from 'lucide-react';
import FRONTEND_ROUTES from '../../../app/router/routes.constants';

export const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  const actions = [
    { name: 'Upload Meal', path: FRONTEND_ROUTES.MEALS, desc: 'Scan food using AI scanner', icon: <Camera className="h-4 w-4" />, colorClass: 'text-primary bg-primary/10 border-primary/20' },
    { name: 'View History', path: FRONTEND_ROUTES.HISTORY, desc: 'Review logged foods', icon: <History className="h-4 w-4" />, colorClass: 'text-secondary bg-secondary/10 border-secondary/20' },
    { name: 'Analytics', path: FRONTEND_ROUTES.ANALYTICS, desc: 'Explore monthly charts', icon: <BarChart3 className="h-4 w-4" />, colorClass: 'text-accent bg-accent/10 border-accent/20' },
    { name: 'Profile', path: FRONTEND_ROUTES.PROFILE, desc: 'Manage metrics and goals', icon: <User className="h-4 w-4" />, colorClass: 'text-purple-400 bg-purple-400/10 border-purple-400/20' }
  ];

  return (
    <div className="space-y-3">
      <h3 className="text-slate-400 text-xs font-semibold tracking-wider uppercase ml-1">
        Quick Actions
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {actions.map((act, idx) => (
          <Card 
            key={idx} 
            variant="glass" 
            className="hover:border-slate-700/60 transition-all duration-200 cursor-pointer group"
            onClick={() => navigate(act.path)}
          >
            <Card.Content className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl border ${act.colorClass}`}>
                  {act.icon}
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-200 group-hover:text-primary transition-colors block">
                    {act.name}
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    {act.desc}
                  </span>
                </div>
              </div>

              <ChevronRight className="h-4 w-4 text-slate-600 group-hover:text-slate-400 group-hover:translate-x-0.5 transition-all" />
            </Card.Content>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
