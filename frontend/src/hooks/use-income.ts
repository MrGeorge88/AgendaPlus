import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { queryKeys } from '../lib/query-client';
import { incomeService } from '../services/income';
import { useAuth } from '../contexts/auth-context';
import type { IncomeStats, PaymentData } from '../types/income';

/**
 * Hook para obtener estadísticas de ingresos
 */
export const useIncomeStats = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: queryKeys.incomeStats(user?.id || ''),
    queryFn: () => incomeService.getIncomeStats(user!.id),
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutos - las estadísticas de ingresos cambian frecuentemente
  });
};

/**
 * Hook para obtener ingresos por período
 */
export const useIncomeByPeriod = (period: 'day' | 'week' | 'month' | 'year', date?: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['income', 'period', user?.id, period, date],
    queryFn: () => incomeService.getIncomeByPeriod(user!.id, period, date),
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

/**
 * Hook para obtener ingresos por rango de fechas
 */
export const useIncomeByDateRange = (startDate: string, endDate: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['income', 'range', user?.id, startDate, endDate],
    queryFn: () => incomeService.getIncomeByDateRange(user!.id, startDate, endDate),
    enabled: !!user?.id && !!startDate && !!endDate,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

/**
 * Hook para obtener ingresos mensuales (para gráficos)
 */
export const useMonthlyIncome = (year?: number) => {
  const { user } = useAuth();
  const currentYear = year || new Date().getFullYear();
  
  return useQuery({
    queryKey: ['income', 'monthly', user?.id, currentYear],
    queryFn: () => incomeService.getMonthlyIncome(user!.id, currentYear),
    enabled: !!user?.id,
    staleTime: 10 * 60 * 1000, // 10 minutos para datos mensuales
  });
};

/**
 * Hook para obtener servicios más rentables
 */
export const useTopServices = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['income', 'top-services', user?.id],
    queryFn: () => incomeService.getTopServices(user!.id),
    enabled: !!user?.id,
    staleTime: 15 * 60 * 1000, // 15 minutos para estadísticas
  });
};

/**
 * Hook para obtener staff más rentable
 */
export const useTopStaff = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['income', 'top-staff', user?.id],
    queryFn: () => incomeService.getTopStaff(user!.id),
    enabled: !!user?.id,
    staleTime: 15 * 60 * 1000, // 15 minutos para estadísticas
  });
};

/**
 * Hook para registrar un pago
 */
export const useRegisterPayment = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (paymentData: PaymentData) => 
      incomeService.registerPayment({ ...paymentData, user_id: user!.id }),
    onSuccess: () => {
      // Invalidar todas las estadísticas de ingresos
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: queryKeys.incomeStats(user.id) });
        queryClient.invalidateQueries({ queryKey: ['income'] });
        queryClient.invalidateQueries({ queryKey: queryKeys.appointmentsByUser(user.id) });
      }
      
      toast.success('Pago registrado exitosamente');
    },
    onError: (error: any) => {
      console.error('Error registering payment:', error);
      toast.error(`Error al registrar el pago: ${error.message || 'Error desconocido'}`);
    },
  });
};

/**
 * Hook para obtener historial de pagos
 */
export const usePaymentHistory = (limit?: number) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['payments', 'history', user?.id, limit],
    queryFn: () => incomeService.getPaymentHistory(user!.id, limit),
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

/**
 * Hook para obtener pagos pendientes
 */
export const usePendingPayments = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['payments', 'pending', user?.id],
    queryFn: () => incomeService.getPendingPayments(user!.id),
    enabled: !!user?.id,
    staleTime: 2 * 60 * 1000, // 2 minutos - los pagos pendientes cambian frecuentemente
  });
};

/**
 * Hook para obtener resumen financiero
 */
export const useFinancialSummary = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['financial', 'summary', user?.id],
    queryFn: () => incomeService.getFinancialSummary(user!.id),
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

/**
 * Hook para obtener comparación de ingresos (mes actual vs anterior)
 */
export const useIncomeComparison = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['income', 'comparison', user?.id],
    queryFn: () => incomeService.getIncomeComparison(user!.id),
    enabled: !!user?.id,
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
};
