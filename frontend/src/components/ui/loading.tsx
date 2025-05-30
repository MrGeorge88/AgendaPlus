import React from 'react';
import { cn } from '../../lib/utils';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ 
  size = 'md', 
  className 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12',
  };

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-slate-300 border-t-primary',
        sizeClasses[size],
        className
      )}
    />
  );
};

interface LoadingDotsProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingDots: React.FC<LoadingDotsProps> = ({ 
  size = 'md', 
  className 
}) => {
  const sizeClasses = {
    sm: 'h-1 w-1',
    md: 'h-2 w-2',
    lg: 'h-3 w-3',
  };

  return (
    <div className={cn('flex space-x-1', className)}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            'animate-pulse rounded-full bg-primary',
            sizeClasses[size]
          )}
          style={{
            animationDelay: `${i * 0.2}s`,
            animationDuration: '1s',
          }}
        />
      ))}
    </div>
  );
};

interface LoadingBarProps {
  progress?: number;
  indeterminate?: boolean;
  className?: string;
}

export const LoadingBar: React.FC<LoadingBarProps> = ({
  progress,
  indeterminate = false,
  className
}) => {
  return (
    <div className={cn('w-full bg-slate-200 rounded-full h-2', className)}>
      <div
        className={cn(
          'h-2 bg-primary rounded-full transition-all duration-300',
          indeterminate && 'animate-pulse'
        )}
        style={{
          width: indeterminate ? '100%' : `${progress || 0}%`,
        }}
      />
    </div>
  );
};

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  children?: React.ReactNode;
  className?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isVisible,
  message = 'Cargando...',
  children,
  className
}) => {
  if (!isVisible) return null;

  return (
    <div className={cn(
      'fixed inset-0 z-50 flex items-center justify-center',
      'bg-black/50 backdrop-blur-sm',
      className
    )}>
      <div className="bg-white rounded-lg p-6 shadow-xl max-w-sm w-full mx-4">
        <div className="flex flex-col items-center space-y-4">
          <Spinner size="lg" />
          <p className="text-slate-700 text-center">{message}</p>
          {children}
        </div>
      </div>
    </div>
  );
};

interface InlineLoadingProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const InlineLoading: React.FC<InlineLoadingProps> = ({
  message = 'Cargando...',
  size = 'md',
  className
}) => {
  return (
    <div className={cn('flex items-center space-x-3', className)}>
      <Spinner size={size} />
      <span className="text-slate-600">{message}</span>
    </div>
  );
};

interface SkeletonProps {
  className?: string;
  lines?: number;
  avatar?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  lines = 1,
  avatar = false
}) => {
  return (
    <div className={cn('animate-pulse', className)}>
      {avatar && (
        <div className="flex items-center space-x-4 mb-4">
          <div className="rounded-full bg-slate-300 h-10 w-10" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-slate-300 rounded w-3/4" />
            <div className="h-3 bg-slate-300 rounded w-1/2" />
          </div>
        </div>
      )}
      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'h-4 bg-slate-300 rounded',
              i === lines - 1 ? 'w-2/3' : 'w-full'
            )}
          />
        ))}
      </div>
    </div>
  );
};

interface CardSkeletonProps {
  count?: number;
  className?: string;
}

export const CardSkeleton: React.FC<CardSkeletonProps> = ({
  count = 1,
  className
}) => {
  return (
    <div className={cn('space-y-4', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="border rounded-lg p-4">
          <Skeleton lines={3} avatar />
        </div>
      ))}
    </div>
  );
};

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({
  rows = 5,
  columns = 4,
  className
}) => {
  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="h-4 bg-slate-300 rounded animate-pulse" />
        ))}
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, j) => (
            <div key={j} className="h-4 bg-slate-200 rounded animate-pulse" />
          ))}
        </div>
      ))}
    </div>
  );
};

interface ButtonLoadingProps {
  loading: boolean;
  children: React.ReactNode;
  className?: string;
}

export const ButtonLoading: React.FC<ButtonLoadingProps> = ({
  loading,
  children,
  className
}) => {
  return (
    <div className={cn('flex items-center space-x-2', className)}>
      {loading && <Spinner size="sm" />}
      <span>{children}</span>
    </div>
  );
};

// Hook para manejar estados de loading
export const useLoading = (initialState = false) => {
  const [isLoading, setIsLoading] = React.useState(initialState);

  const startLoading = React.useCallback(() => setIsLoading(true), []);
  const stopLoading = React.useCallback(() => setIsLoading(false), []);
  const toggleLoading = React.useCallback(() => setIsLoading(prev => !prev), []);

  return {
    isLoading,
    startLoading,
    stopLoading,
    toggleLoading,
    setLoading: setIsLoading,
  };
};
