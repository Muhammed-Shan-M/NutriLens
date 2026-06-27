import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { Search, Filter, CalendarDays, History as HistoryIcon, Target, Camera, ChevronLeft, ChevronRight } from 'lucide-react';
import { getMealHistory } from '@/lib/history.api';
import type { MealHistoryItemDto } from '@/types/history.types';
import PageContainer from '@/components/ui/PageContainer';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import MealHistoryCard from '@/features/history/components/MealHistoryCard';
import MealDetailModal from '@/features/history/components/MealDetailModal';
import EmptyState from '@/components/ui/EmptyState';
import { useDebounce } from '@/hooks/useDebounce';

const HistoryPage: React.FC = () => {
  const navigate = useNavigate();

  // Filters state
  const [page, setPage] = useState(1);
  const limit = 8;
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const [type, setType] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [sort, setSort] = useState('newest');

  // Modal State
  const [selectedMeal, setSelectedMeal] = useState<MealHistoryItemDto | null>(null);

  // Fetch query
  const { data, isLoading, isError } = useQuery({
    queryKey: ['mealHistory', page, debouncedSearch, type, dateRange, sort],
    queryFn: () => getMealHistory({
      page,
      limit,
      search: debouncedSearch || undefined,
      type: type !== 'all' ? type : undefined,
      dateRange: dateRange !== 'all' ? dateRange : undefined,
      sort,
    }),
    placeholderData: keepPreviousData,
  });

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, type, dateRange, sort]);

  // Loading Skeletons
  const renderSkeletons = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="h-80 w-full bg-slate-900/50 rounded-2xl border border-slate-800 animate-pulse flex flex-col">
          <div className="h-48 w-full bg-slate-800/50 rounded-t-2xl" />
          <div className="p-4 space-y-4">
            <div className="h-4 w-1/2 bg-slate-800/50 rounded" />
            <div className="grid grid-cols-3 gap-2">
              <div className="h-10 w-full bg-slate-800/50 rounded" />
              <div className="h-10 w-full bg-slate-800/50 rounded" />
              <div className="h-10 w-full bg-slate-800/50 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <PageContainer>
      <div className="space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-black text-slate-100 tracking-tight flex items-center gap-2">
              <HistoryIcon className="h-6 w-6 text-primary" />
              Meal History
            </h1>
            <p className="text-xs text-slate-400 max-w-xl">
              Browse, search, and analyze your entire meal log history. Click any meal for a detailed nutrition breakdown.
            </p>
          </div>
          <Button variant="primary" size="sm" onClick={() => navigate('/meals')} rightIcon={<Camera className="h-4 w-4" />}>
            Log New Meal
          </Button>
        </div>

        {/* Filters Section */}
        <Card variant="glass" className="border border-slate-800 p-1 bg-surface/50 backdrop-blur-md sticky top-4 z-20 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-2 p-2">
            
            {/* Search */}
            <div className="md:col-span-5 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-500" />
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search meals or ingredients..."
                className="w-full bg-slate-900/50 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
              />
            </div>

            {/* Type Filter */}
            <div className="md:col-span-2 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-3.5 w-3.5 text-slate-500" />
              </div>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-800 rounded-xl pl-9 pr-8 py-2.5 text-sm text-slate-200 appearance-none focus:outline-none focus:border-primary/50 transition-all"
              >
                <option value="all">All Types</option>
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snack">Snack</option>
              </select>
            </div>

            {/* Date Range */}
            <div className="md:col-span-2 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CalendarDays className="h-3.5 w-3.5 text-slate-500" />
              </div>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-800 rounded-xl pl-9 pr-8 py-2.5 text-sm text-slate-200 appearance-none focus:outline-none focus:border-primary/50 transition-all"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
              </select>
            </div>

            {/* Sort */}
            <div className="md:col-span-3 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Target className="h-3.5 w-3.5 text-slate-500" />
              </div>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-800 rounded-xl pl-9 pr-8 py-2.5 text-sm text-slate-200 appearance-none focus:outline-none focus:border-primary/50 transition-all"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="calories_high">Highest Calories</option>
                <option value="calories_low">Lowest Calories</option>
              </select>
            </div>
            
          </div>
        </Card>

        {/* Results Info */}
        <div className="px-2">
          {data && !isLoading && (
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              {data.pagination.totalMeals} Meals Found
            </span>
          )}
        </div>

        {/* Grid or Empty/Loading State */}
        {isLoading ? (
          renderSkeletons()
        ) : isError ? (
          <div className="py-20 text-center">
            <p className="text-red-400">Failed to load history. Please refresh the page.</p>
          </div>
        ) : data?.data.length === 0 ? (
          <EmptyState 
            icon={<Search className="h-8 w-8 text-slate-500" />}
            title="No meals found"
            description={search || type !== 'all' || dateRange !== 'all'
              ? "We couldn't find any meals matching your current filters. Try adjusting your search."
              : "You haven't analyzed any meals yet. Start tracking to build your history."}
            actionLabel={search || type !== 'all' || dateRange !== 'all' ? "Clear Filters" : "Upload Your First Meal"}
            onAction={() => {
              if (search || type !== 'all' || dateRange !== 'all') {
                setSearch(''); setType('all'); setDateRange('all');
              } else {
                navigate('/meals');
              }
            }}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {data?.data.map((meal) => (
                <MealHistoryCard 
                  key={meal.id} 
                  meal={meal} 
                  onClick={(m) => setSelectedMeal(m)} 
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {data && data.pagination.totalPages > 1 && (
              <div className="flex flex-col items-center gap-3 pt-10 pb-6 border-t border-slate-800/60 mt-10">
                <div className="flex items-center gap-1.5">

                  {/* Prev button */}
                  <button
                    disabled={!data.pagination.hasPreviousPage}
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    className="flex items-center justify-center w-9 h-9 rounded-xl border border-slate-800 bg-slate-900/60 text-slate-400 hover:border-primary/50 hover:text-primary hover:bg-primary/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  {/* Page number buttons */}
                  {(() => {
                    const total = data.pagination.totalPages;
                    const current = data.pagination.currentPage;
                    const pages: (number | '...')[] = [];

                    if (total <= 7) {
                      for (let i = 1; i <= total; i++) pages.push(i);
                    } else {
                      pages.push(1);
                      if (current > 4) pages.push('...');
                      const start = Math.max(2, current - 1);
                      const end = Math.min(total - 1, current + 1);
                      for (let i = start; i <= end; i++) pages.push(i);
                      if (current < total - 3) pages.push('...');
                      pages.push(total);
                    }

                    return pages.map((p, idx) =>
                      p === '...' ? (
                        <span key={`ellipsis-${idx}`} className="w-9 h-9 flex items-center justify-center text-slate-600 text-sm font-bold select-none">…</span>
                      ) : (
                        <button
                          key={p}
                          onClick={() => setPage(p as number)}
                          className={`w-9 h-9 rounded-xl border text-xs font-black tracking-wide transition-all duration-200 ${
                            p === current
                              ? 'bg-primary border-primary text-black shadow-[0_0_14px_-4px_rgba(74,200,130,0.7)]'
                              : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-primary/50 hover:text-primary hover:bg-primary/5'
                          }`}
                          aria-label={`Go to page ${p}`}
                          aria-current={p === current ? 'page' : undefined}
                        >
                          {p}
                        </button>
                      )
                    );
                  })()}

                  {/* Next button */}
                  <button
                    disabled={!data.pagination.hasNextPage}
                    onClick={() => setPage(p => p + 1)}
                    className="flex items-center justify-center w-9 h-9 rounded-xl border border-slate-800 bg-slate-900/60 text-slate-400 hover:border-primary/50 hover:text-primary hover:bg-primary/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
                    aria-label="Next page"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>

                {/* Summary text */}
                <p className="text-[11px] text-slate-600 font-semibold tracking-wider uppercase">
                  Page {data.pagination.currentPage} of {data.pagination.totalPages} &middot; {data.pagination.totalMeals} meals total
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Detail Modal */}
      {selectedMeal && (
        <MealDetailModal
          isOpen={true}
          meal={selectedMeal}
          onClose={() => setSelectedMeal(null)}
        />
      )}
    </PageContainer>
  );
};

export default HistoryPage;
