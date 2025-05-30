import { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface MetricGridProps {
  children: ReactNode;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export function MetricGrid({ 
  children, 
  columns = 4, 
  className 
}: MetricGridProps) {
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  return (
    <div className={cn(
      "grid gap-4",
      gridClasses[columns],
      className
    )}>
      {children}
    </div>
  );
}

// Componente para métricas con skeleton loading
interface MetricGridSkeletonProps {
  count?: number;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export function MetricGridSkeleton({ 
  count = 4, 
  columns = 4, 
  className 
}: MetricGridSkeletonProps) {
  return (
    <MetricGrid columns={columns} className={className}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="card p-4 animate-pulse">
          <div className="flex items-center">
            <div className="mr-4 rounded-full bg-gray-200 p-3">
              <div className="h-6 w-6 bg-gray-300 rounded"></div>
            </div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      ))}
    </MetricGrid>
  );
}
