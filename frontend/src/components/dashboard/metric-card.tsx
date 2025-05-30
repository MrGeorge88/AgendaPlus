import { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

interface TrendData {
  value: number;
  isPositive: boolean;
  period: string;
}

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
  trend?: TrendData;
  subtitle?: string;
  className?: string;
  loading?: boolean;
}

export function MetricCard({
  title,
  value,
  icon: Icon,
  iconColor = '#4f46e5',
  iconBgColor = 'rgba(79, 70, 229, 0.1)',
  trend,
  subtitle,
  className,
  loading = false
}: MetricCardProps) {
  if (loading) {
    return (
      <div className={cn("card p-4 animate-pulse", className)}>
        <div className="flex items-center">
          <div 
            className="mr-4 rounded-full p-3"
            style={{ backgroundColor: iconBgColor }}
          >
            <div className="h-6 w-6 bg-gray-300 rounded"></div>
          </div>
          <div className="flex-1">
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("card p-4 hover:shadow-md transition-shadow", className)}>
      <div className="flex items-center">
        <div 
          className="mr-4 rounded-full p-3"
          style={{ backgroundColor: iconBgColor }}
        >
          <Icon className="h-6 w-6" style={{ color: iconColor }} />
        </div>
        <div className="flex-1">
          <p className="text-sm text-slate-500 mb-1">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
            {trend && (
              <span 
                className={cn(
                  "text-sm font-medium",
                  trend.isPositive ? "text-green-600" : "text-red-600"
                )}
              >
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
          )}
          {trend && (
            <p className="text-xs text-slate-400 mt-1">
              vs {trend.period}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Variantes predefinidas para métricas comunes
export const MetricCardVariants = {
  revenue: {
    iconColor: '#4f46e5',
    iconBgColor: 'rgba(79, 70, 229, 0.1)'
  },
  growth: {
    iconColor: '#ec4899',
    iconBgColor: 'rgba(236, 72, 153, 0.1)'
  },
  success: {
    iconColor: '#22c55e',
    iconBgColor: 'rgba(34, 197, 94, 0.1)'
  },
  info: {
    iconColor: '#3b82f6',
    iconBgColor: 'rgba(59, 130, 246, 0.1)'
  },
  warning: {
    iconColor: '#f59e0b',
    iconBgColor: 'rgba(245, 158, 11, 0.1)'
  },
  purple: {
    iconColor: '#a855f7',
    iconBgColor: 'rgba(168, 85, 247, 0.1)'
  }
};
