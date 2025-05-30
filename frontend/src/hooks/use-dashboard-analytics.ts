import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/auth-context';
import { incomeService } from '../services/income';
import { queryKeys } from '../lib/query-client';

/**
 * Hook para obtener datos de ingresos por período para gráficos
 */
export const useRevenueByPeriod = (period: 'week' | 'month' | 'year' = 'month') => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['analytics', 'revenue-by-period', user?.id, period],
    queryFn: () => incomeService.getRevenueByPeriod(user!.id, period),
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

/**
 * Hook para obtener distribución de citas por estado
 */
export const useAppointmentsByStatus = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['analytics', 'appointments-by-status', user?.id],
    queryFn: () => incomeService.getAppointmentsByStatus(user!.id),
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook para obtener rendimiento del personal
 */
export const useStaffPerformance = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['analytics', 'staff-performance', user?.id],
    queryFn: () => incomeService.getStaffPerformance(user!.id),
    enabled: !!user?.id,
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
};

/**
 * Hook para obtener todas las métricas del dashboard
 */
export const useDashboardMetrics = () => {
  const { user } = useAuth();
  
  // Usar el hook existente de estadísticas de ingresos
  const incomeStats = useQuery({
    queryKey: queryKeys.incomeStats(user?.id || ''),
    queryFn: () => incomeService.getIncomeStats(user!.id),
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000,
  });

  // Datos adicionales para el dashboard
  const revenueByPeriod = useRevenueByPeriod('month');
  const appointmentsByStatus = useAppointmentsByStatus();
  const staffPerformance = useStaffPerformance();

  return {
    incomeStats,
    revenueByPeriod,
    appointmentsByStatus,
    staffPerformance,
    isLoading: incomeStats.isLoading || revenueByPeriod.isLoading || 
               appointmentsByStatus.isLoading || staffPerformance.isLoading,
    error: incomeStats.error || revenueByPeriod.error || 
           appointmentsByStatus.error || staffPerformance.error
  };
};

/**
 * Hook para obtener métricas comparativas (tendencias)
 */
export const useTrendMetrics = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['analytics', 'trends', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      // Obtener datos del mes actual y anterior
      const currentMonth = await incomeService.getRevenueByPeriod(user.id, 'month');
      const previousMonth = await incomeService.getRevenueByPeriod(user.id, 'month');
      
      // Calcular tendencias
      const currentTotal = currentMonth.reduce((sum, item) => sum + item.revenue, 0);
      const previousTotal = previousMonth.reduce((sum, item) => sum + item.revenue, 0);
      
      const revenueTrend = previousTotal > 0 
        ? ((currentTotal - previousTotal) / previousTotal) * 100 
        : 0;

      const currentAppointments = currentMonth.reduce((sum, item) => sum + item.appointments, 0);
      const previousAppointments = previousMonth.reduce((sum, item) => sum + item.appointments, 0);
      
      const appointmentsTrend = previousAppointments > 0 
        ? ((currentAppointments - previousAppointments) / previousAppointments) * 100 
        : 0;

      return {
        revenue: {
          current: currentTotal,
          previous: previousTotal,
          trend: revenueTrend,
          isPositive: revenueTrend >= 0
        },
        appointments: {
          current: currentAppointments,
          previous: previousAppointments,
          trend: appointmentsTrend,
          isPositive: appointmentsTrend >= 0
        }
      };
    },
    enabled: !!user?.id,
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
};

/**
 * Hook para obtener datos de servicios más populares
 */
export const useTopServices = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['analytics', 'top-services', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const stats = await incomeService.getIncomeStats(user.id);
      return stats.topServices.map(service => ({
        name: service.name,
        count: service.count,
        revenue: service.income
      }));
    },
    enabled: !!user?.id,
    staleTime: 15 * 60 * 1000, // 15 minutos
  });
};
