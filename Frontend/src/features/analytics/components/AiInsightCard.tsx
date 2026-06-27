import React from 'react';
import Card from '@/components/ui/Card';
import { Sparkles, AlertCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getAnalyticsInsight } from '@/lib/analytics.api';

interface AiInsightCardProps {
  period: string;
}

const AiInsightCard: React.FC<AiInsightCardProps> = ({ period }) => {
  const { data: insight, isLoading, isError } = useQuery({
    queryKey: ['analyticsInsight', period],
    queryFn: () => getAnalyticsInsight(period),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1
  });

  const formatInsightToList = (text: string) => {
    // Split by dashes or newlines and clean up
    return text.split('\n')
      .map(line => line.trim().replace(/^-/, '').replace(/\*\*/g, '').trim())
      .filter(line => line.length > 0);
  };

  return (
    <Card variant="glass" className="border border-primary/20 bg-primary/5 relative overflow-hidden">
      <div className="absolute -top-10 -right-10 opacity-5 pointer-events-none">
        <Sparkles className="h-40 w-40 text-primary" />
      </div>
      
      <Card.Content className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            <Sparkles className="h-4 w-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-200 tracking-wider">Ai weekly insight</h3>
        </div>

        {isLoading ? (
          <div className="space-y-3 animate-pulse py-2">
            <div className="h-3 w-3/4 bg-slate-800 rounded"></div>
            <div className="h-3 w-5/6 bg-slate-800 rounded"></div>
            <div className="h-3 w-4/6 bg-slate-800 rounded"></div>
          </div>
        ) : isError ? (
          <div className="flex items-start gap-3 py-2 text-slate-400">
            <AlertCircle className="h-5 w-5 text-slate-500 shrink-0 mt-0.5" />
            <p className="text-sm">Unable to generate AI insights at this time. Please try again later.</p>
          </div>
        ) : insight ? (
          <ul className="space-y-3 text-sm text-slate-300">
            {formatInsightToList(insight).map((point, idx) => (
              <li key={idx} className="flex items-start">
                <span className="text-primary font-bold mr-2 mt-0.5">•</span>
                <span className="leading-relaxed">{point}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </Card.Content>
    </Card>
  );
};

export default AiInsightCard;
