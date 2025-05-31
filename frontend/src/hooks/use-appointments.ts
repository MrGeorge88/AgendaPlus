import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { queryKeys, invalidateQueries } from '../lib/query-client';
import { appointmentsService } from '../services/appointments';
import { useAuth } from '../contexts/auth-context';
import { useLanguage } from '../contexts/language-context';
import type { Appointment, CreateAppointmentData, UpdateAppointmentData } from '../types/appointment';

/**
 * Hook para obtener todas las citas de un usuario
 */
export const useAppointments = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: queryKeys.appointmentsByUser(user?.id || ''),
    queryFn: () => appointmentsService.getAppointments(user!.id),
    enabled: !!user?.id,
    staleTime: 2 * 60 * 1000, // 2 minutos - las citas cambian frecuentemente
  });
};

/**
 * Hook para obtener citas por rango de fechas
 */
export const useAppointmentsByDateRange = (startDate: string, endDate: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: queryKeys.appointmentsByDateRange(user?.id || '', startDate, endDate),
    queryFn: () => appointmentsService.getAppointmentsByDateRange(user!.id, startDate, endDate),
    enabled: !!user?.id && !!startDate && !!endDate,
    staleTime: 1 * 60 * 1000, // 1 minuto para vista de calendario
  });
};

/**
 * Hook para obtener citas de una fecha específica
 */
export const useAppointmentsByDate = (date: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: queryKeys.appointmentsByDate(user?.id || '', date),
    queryFn: () => appointmentsService.getAppointmentsByDate(user!.id, date),
    enabled: !!user?.id && !!date,
    staleTime: 1 * 60 * 1000, // 1 minuto
  });
};

/**
 * Hook para obtener una cita específica
 */
export const useAppointment = (appointmentId: string) => {
  return useQuery({
    queryKey: queryKeys.appointment(appointmentId),
    queryFn: () => appointmentsService.getAppointment(appointmentId),
    enabled: !!appointmentId,
  });
};

/**
 * Hook para crear una nueva cita
 */
export const useCreateAppointment = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAppointmentData) => 
      appointmentsService.createAppointment({ ...data, user_id: user!.id }),
    onSuccess: (newAppointment) => {
      // Invalidar queries relacionadas
      if (user?.id) {
        invalidateQueries.appointmentRelated(user.id);
      }
      
      // Actualizar caché optimísticamente
      queryClient.setQueryData(
        queryKeys.appointmentsByUser(user!.id),
        (oldData: Appointment[] | undefined) => {
          if (!oldData) return [newAppointment];
          return [...oldData, newAppointment];
        }
      );
      
      toast.success(t('notifications.success.appointmentCreated'));
    },
    onError: (error: any) => {
      console.error('Error creating appointment:', error);
      toast.error(`${t('notifications.error.appointmentCreate')}: ${error.message || t('notifications.error.unknownError')}`);
    },
  });
};

/**
 * Hook para actualizar una cita
 */
export const useUpdateAppointment = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAppointmentData }) =>
      appointmentsService.updateAppointment(id, data),
    onSuccess: (updatedAppointment, { id }) => {
      // Invalidar queries relacionadas
      if (user?.id) {
        invalidateQueries.appointmentRelated(user.id);
      }
      
      // Actualizar caché específico
      queryClient.setQueryData(queryKeys.appointment(id), updatedAppointment);
      
      // Actualizar lista de citas
      queryClient.setQueryData(
        queryKeys.appointmentsByUser(user!.id),
        (oldData: Appointment[] | undefined) => {
          if (!oldData) return [updatedAppointment];
          return oldData.map(appointment => 
            appointment.id === id ? updatedAppointment : appointment
          );
        }
      );
      
      toast.success(t('notifications.success.appointmentUpdated'));
    },
    onError: (error: any) => {
      console.error('Error updating appointment:', error);
      toast.error(`${t('notifications.error.appointmentUpdate')}: ${error.message || t('notifications.error.unknownError')}`);
    },
  });
};

/**
 * Hook para eliminar una cita
 */
export const useDeleteAppointment = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (appointmentId: string) => appointmentsService.deleteAppointment(appointmentId),
    onSuccess: (_, appointmentId) => {
      // Invalidar queries relacionadas
      if (user?.id) {
        invalidateQueries.appointmentRelated(user.id);
      }
      
      // Remover de caché optimísticamente
      queryClient.setQueryData(
        queryKeys.appointmentsByUser(user!.id),
        (oldData: Appointment[] | undefined) => {
          if (!oldData) return [];
          return oldData.filter(appointment => appointment.id !== appointmentId);
        }
      );
      
      toast.success(t('notifications.success.appointmentDeleted'));
    },
    onError: (error: any) => {
      console.error('Error deleting appointment:', error);
      toast.error(`${t('notifications.error.appointmentDelete')}: ${error.message || t('notifications.error.unknownError')}`);
    },
  });
};

/**
 * Hook para cambiar el estado de una cita
 */
export const useUpdateAppointmentStatus = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      appointmentsService.updateAppointmentStatus(id, status),
    onSuccess: (updatedAppointment, { id }) => {
      // Invalidar queries relacionadas
      if (user?.id) {
        invalidateQueries.appointmentRelated(user.id);
      }
      
      // Actualizar caché
      queryClient.setQueryData(queryKeys.appointment(id), updatedAppointment);
      
      toast.success(t('notifications.success.appointmentUpdated'));
    },
    onError: (error: any) => {
      console.error('Error updating appointment status:', error);
      toast.error(`${t('notifications.error.appointmentStatus')}: ${error.message || t('notifications.error.unknownError')}`);
    },
  });
};

/**
 * Hook para obtener estadísticas de citas
 */
export const useAppointmentStats = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: queryKeys.dashboardStats(user?.id || ''),
    queryFn: () => appointmentsService.getAppointmentStats(user!.id),
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutos para estadísticas
  });
};
