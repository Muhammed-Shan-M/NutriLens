import React from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { Bot, Sparkles, MessageSquare } from 'lucide-react';

export const AiCoachCard: React.FC = () => {
  return (
    <Card variant="glass" className="relative overflow-hidden border border-slate-800 bg-gradient-to-br from-surface-medium to-surface-high p-6 flex flex-col justify-between group h-full">
      {/* Background Soft Glow Decoration */}
      <div className="absolute -right-4 -bottom-4 h-32 w-32 bg-primary/5 rounded-full filter blur-xl group-hover:bg-primary/10 transition-all duration-300" />
      
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/10 text-purple-400">
            <Bot className="h-6 w-6" />
          </div>
          
          <Badge variant="secondary" className="bg-purple-500/10 text-purple-400 border-purple-500/20 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5">
            Coming Soon
          </Badge>
        </div>

        <div className="space-y-2">
          <h3 className="text-base font-extrabold text-slate-100 flex items-center gap-1.5">
            AI Nutrition Coach
            <Sparkles className="h-4 w-4 text-purple-400" />
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Consult our conversational nutritionist to receive instant feedback on meal planning, healthy alternatives, and recipe suggestions.
          </p>
        </div>
      </div>

      <button className="mt-6 flex items-center justify-center gap-2 w-full py-3 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-slate-500 cursor-not-allowed">
        <MessageSquare className="h-4 w-4" />
        Start Conversation
      </button>
    </Card>
  );
};

export default AiCoachCard;
