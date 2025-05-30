import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '../../lib/utils';

interface TrendIndicatorProps {
  value: number;
  period?: string;
  showIcon?: boolean;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function TrendIndicator({
  value,
  period,
  showIcon = true,
  showPercentage = true,
  size = 'md',
  className
}: TrendIndicatorProps) {
  const isPositive = value > 0;
  const isNeutral = value === 0;
  
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };
  
  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  const getColorClass = () => {
    if (isNeutral) return 'text-slate-500';
    return isPositive ? 'text-green-600' : 'text-red-600';
  };

  const getIcon = () => {
    if (isNeutral) return Minus;
    return isPositive ? TrendingUp : TrendingDown;
  };

  const Icon = getIcon();

  return (
    <div className={cn(
      "flex items-center gap-1 font-medium",
      sizeClasses[size],
      getColorClass(),
      className
    )}>
      {showIcon && (
        <Icon className={iconSizes[size]} />
      )}
      <span>
        {isPositive && !isNeutral && '+'}
        {showPercentage ? `${value}%` : value}
      </span>
      {period && (
        <span className="text-slate-400 font-normal">
          vs {period}
        </span>
      )}
    </div>
  );
}

// Componente para mostrar múltiples tendencias
interface TrendComparisonProps {
  trends: Array<{
    label: string;
    value: number;
    period?: string;
  }>;
  className?: string;
}

export function TrendComparison({ trends, className }: TrendComparisonProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {trends.map((trend, index) => (
        <div key={index} className="flex items-center justify-between">
          <span className="text-sm text-slate-600">{trend.label}</span>
          <TrendIndicator 
            value={trend.value} 
            period={trend.period}
            size="sm"
          />
        </div>
      ))}
    </div>
  );
}
