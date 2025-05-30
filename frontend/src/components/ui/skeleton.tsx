import { cn } from '../../lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'rectangular' | 'circular' | 'text';
  width?: string | number;
  height?: string | number;
}

export const Skeleton = ({ 
  className, 
  variant = 'rectangular',
  width,
  height,
  ...props 
}: SkeletonProps) => {
  return (
    <div
      className={cn(
        'animate-pulse bg-slate-200 dark:bg-slate-700',
        variant === 'circular' && 'rounded-full',
        variant === 'rectangular' && 'rounded',
        variant === 'text' && 'rounded h-4',
        className
      )}
      style={{ width, height }}
      {...props}
    />
  );
};

// Skeleton específicos para diferentes componentes
export const ServiceCardSkeleton = () => (
  <div className="rounded-lg border p-4 space-y-3">
    <div className="flex items-start justify-between">
      <div className="space-y-2 flex-1">
        <Skeleton variant="rectangular" width="60px" height="20px" />
        <Skeleton variant="text" width="80%" />
        <Skeleton variant="text" width="60%" />
      </div>
      <div className="flex space-x-2">
        <Skeleton variant="circular" width="32px" height="32px" />
        <Skeleton variant="circular" width="32px" height="32px" />
      </div>
    </div>
    <div className="border-t pt-3 flex justify-between items-center">
      <Skeleton variant="text" width="60px" />
      <Skeleton variant="text" width="40px" />
    </div>
  </div>
);

export const ServiceListSkeleton = ({ count = 6 }: { count?: number }) => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: count }).map((_, i) => (
      <ServiceCardSkeleton key={i} />
    ))}
  </div>
);

export const AppointmentCardSkeleton = () => (
  <div className="flex items-center space-x-4 p-4 border rounded-lg">
    <Skeleton variant="circular" width={40} height={40} />
    <div className="flex-1 space-y-2">
      <Skeleton variant="text" width="60%" />
      <Skeleton variant="text" width="40%" />
    </div>
    <Skeleton width={80} height={32} />
  </div>
);

export const AppointmentListSkeleton = ({ count = 5 }: { count?: number }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, i) => (
      <AppointmentCardSkeleton key={i} />
    ))}
  </div>
);

export const ClientCardSkeleton = () => (
  <div className="rounded-lg border p-4 space-y-3">
    <div className="flex items-center space-x-3">
      <Skeleton variant="circular" width="48px" height="48px" />
      <div className="space-y-2 flex-1">
        <Skeleton variant="text" width="70%" />
        <Skeleton variant="text" width="50%" />
      </div>
    </div>
    <div className="flex justify-between items-center pt-2 border-t">
      <Skeleton variant="text" width="80px" />
      <div className="flex space-x-2">
        <Skeleton variant="circular" width="32px" height="32px" />
        <Skeleton variant="circular" width="32px" height="32px" />
      </div>
    </div>
  </div>
);

export const ClientListSkeleton = ({ count = 6 }: { count?: number }) => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: count }).map((_, i) => (
      <ClientCardSkeleton key={i} />
    ))}
  </div>
);

export const StaffCardSkeleton = () => (
  <div className="rounded-lg border p-4 space-y-3">
    <div className="flex items-center space-x-3">
      <Skeleton variant="circular" width="48px" height="48px" />
      <div className="space-y-2 flex-1">
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" width="40%" />
      </div>
    </div>
    <div className="space-y-2">
      <Skeleton variant="text" width="80%" />
      <Skeleton variant="text" width="60%" />
    </div>
    <div className="flex justify-end space-x-2 pt-2 border-t">
      <Skeleton variant="circular" width="32px" height="32px" />
      <Skeleton variant="circular" width="32px" height="32px" />
    </div>
  </div>
);

export const StaffListSkeleton = ({ count = 4 }: { count?: number }) => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: count }).map((_, i) => (
      <StaffCardSkeleton key={i} />
    ))}
  </div>
);

export const MetricCardSkeleton = () => (
  <div className="rounded-lg border p-6 flex items-center space-x-4">
    <Skeleton variant="circular" width="48px" height="48px" />
    <div className="space-y-2 flex-1">
      <Skeleton variant="text" width="60%" />
      <Skeleton variant="text" width="40%" height="32px" />
    </div>
  </div>
);

export const DashboardSkeleton = () => (
  <div className="space-y-6">
    {/* Métricas principales */}
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <MetricCardSkeleton key={i} />
      ))}
    </div>
    
    {/* Gráfico */}
    <div className="rounded-lg border p-6">
      <Skeleton variant="text" width="200px" height="24px" className="mb-4" />
      <Skeleton variant="rectangular" width="100%" height="300px" />
    </div>
    
    {/* Listas */}
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-lg border p-6">
        <Skeleton variant="text" width="150px" height="24px" className="mb-4" />
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex justify-between items-center">
              <div className="space-y-1">
                <Skeleton variant="text" width="120px" />
                <Skeleton variant="text" width="80px" />
              </div>
              <Skeleton variant="text" width="60px" />
            </div>
          ))}
        </div>
      </div>
      
      <div className="rounded-lg border p-6">
        <Skeleton variant="text" width="150px" height="24px" className="mb-4" />
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex justify-between items-center">
              <div className="space-y-1">
                <Skeleton variant="text" width="120px" />
                <Skeleton variant="text" width="80px" />
              </div>
              <Skeleton variant="text" width="60px" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export const CalendarSkeleton = () => (
  <div className="space-y-4">
    {/* Header del calendario */}
    <div className="flex justify-between items-center">
      <div className="flex space-x-2">
        <Skeleton variant="circular" width="40px" height="40px" />
        <Skeleton variant="circular" width="40px" height="40px" />
        <Skeleton variant="rectangular" width="100px" height="40px" />
      </div>
      <Skeleton variant="text" width="200px" height="32px" />
      <div className="flex space-x-2">
        <Skeleton variant="rectangular" width="80px" height="40px" />
        <Skeleton variant="rectangular" width="80px" height="40px" />
        <Skeleton variant="rectangular" width="80px" height="40px" />
      </div>
    </div>
    
    {/* Calendario */}
    <Skeleton variant="rectangular" width="100%" height="600px" />
  </div>
);

export const TableSkeleton = ({ 
  rows = 5, 
  columns = 4 
}: { 
  rows?: number; 
  columns?: number; 
}) => (
  <div className="rounded-lg border">
    {/* Header */}
    <div className="border-b p-4">
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} variant="text" width="80%" />
        ))}
      </div>
    </div>
    
    {/* Rows */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="border-b last:border-b-0 p-4">
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} variant="text" width="70%" />
          ))}
        </div>
      </div>
    ))}
  </div>
);

export const FormSkeleton = () => (
  <div className="space-y-4">
    <div>
      <Skeleton variant="text" width="100px" height="16px" className="mb-2" />
      <Skeleton variant="rectangular" width="100%" height="40px" />
    </div>
    <div>
      <Skeleton variant="text" width="80px" height="16px" className="mb-2" />
      <Skeleton variant="rectangular" width="100%" height="40px" />
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Skeleton variant="text" width="60px" height="16px" className="mb-2" />
        <Skeleton variant="rectangular" width="100%" height="40px" />
      </div>
      <div>
        <Skeleton variant="text" width="70px" height="16px" className="mb-2" />
        <Skeleton variant="rectangular" width="100%" height="40px" />
      </div>
    </div>
    <div>
      <Skeleton variant="text" width="90px" height="16px" className="mb-2" />
      <Skeleton variant="rectangular" width="100%" height="80px" />
    </div>
    <div className="flex justify-end space-x-2">
      <Skeleton variant="rectangular" width="80px" height="40px" />
      <Skeleton variant="rectangular" width="80px" height="40px" />
    </div>
  </div>
);
