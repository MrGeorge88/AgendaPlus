import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { queryKeys, invalidateQueries } from '../lib/query-client';
import { staffService } from '../services/staff';
import { useAuth } from '../contexts/auth-context';
import { useLanguage } from '../contexts/language-context';
import type { Staff, CreateStaffData, UpdateStaffData } from '../types/staff';

/**
 * Hook para obtener todo el staff de un usuario
 */
export const useStaff = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: queryKeys.staffByUser(user?.id || ''),
    queryFn: () => staffService.getStaff(user!.id),
    enabled: !!user?.id,
    staleTime: 10 * 60 * 1000, // 10 minutos - el staff no cambia frecuentemente
  });
};

/**
 * Hook para obtener un miembro del staff específico
 */
export const useStaffMember = (staffId: string) => {
  return useQuery({
    queryKey: queryKeys.staffMember(staffId),
    queryFn: () => staffService.getStaffMember(staffId),
    enabled: !!staffId,
    staleTime: 15 * 60 * 1000, // 15 minutos
  });
};

/**
 * Hook para crear un nuevo miembro del staff
 */
export const useCreateStaff = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateStaffData) => 
      staffService.createStaff({ ...data, user_id: user!.id }),
    onSuccess: (newStaff) => {
      // Invalidar queries relacionadas
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: queryKeys.staffByUser(user.id) });
      }
      
      // Actualizar caché optimísticamente
      queryClient.setQueryData(
        queryKeys.staffByUser(user!.id),
        (oldData: Staff[] | undefined) => {
          if (!oldData) return [newStaff];
          return [...oldData, newStaff];
        }
      );
      
      toast.success(t('notifications.success.staffCreated'));
    },
    onError: (error: any) => {
      console.error('Error creating staff:', error);
      toast.error(`${t('notifications.error.staffCreate')}: ${error.message || t('notifications.error.unknownError')}`);
    },
  });
};

/**
 * Hook para actualizar un miembro del staff
 */
export const useUpdateStaff = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStaffData }) =>
      staffService.updateStaff(id, data),
    onSuccess: (updatedStaff, { id }) => {
      // Invalidar queries relacionadas
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: queryKeys.staffByUser(user.id) });
        // También invalidar citas ya que pueden estar relacionadas
        invalidateQueries.appointmentRelated(user.id);
      }
      
      // Actualizar caché específico
      queryClient.setQueryData(queryKeys.staffMember(id), updatedStaff);
      
      // Actualizar lista de staff
      queryClient.setQueryData(
        queryKeys.staffByUser(user!.id),
        (oldData: Staff[] | undefined) => {
          if (!oldData) return [updatedStaff];
          return oldData.map(staff => 
            staff.id === id ? updatedStaff : staff
          );
        }
      );
      
      toast.success(t('notifications.success.staffUpdated'));
    },
    onError: (error: any) => {
      console.error('Error updating staff:', error);
      toast.error(`${t('notifications.error.staffUpdate')}: ${error.message || t('notifications.error.unknownError')}`);
    },
  });
};

/**
 * Hook para eliminar un miembro del staff
 */
export const useDeleteStaff = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (staffId: string) => staffService.deleteStaff(staffId),
    onSuccess: (_, staffId) => {
      // Invalidar queries relacionadas
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: queryKeys.staffByUser(user.id) });
        // También invalidar citas ya que pueden estar relacionadas
        invalidateQueries.appointmentRelated(user.id);
      }
      
      // Remover de caché optimísticamente
      queryClient.setQueryData(
        queryKeys.staffByUser(user!.id),
        (oldData: Staff[] | undefined) => {
          if (!oldData) return [];
          return oldData.filter(staff => staff.id !== staffId);
        }
      );
      
      toast.success(t('notifications.success.staffDeleted'));
    },
    onError: (error: any) => {
      console.error('Error deleting staff:', error);
      toast.error(`${t('notifications.error.staffDelete')}: ${error.message || t('notifications.error.unknownError')}`);
    },
  });
};

/**
 * Hook para obtener staff disponible en una fecha/hora específica
 */
export const useAvailableStaff = (date: string, time: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['staff', 'available', user?.id, date, time],
    queryFn: () => staffService.getAvailableStaff(user!.id, date, time),
    enabled: !!user?.id && !!date && !!time,
    staleTime: 2 * 60 * 1000, // 2 minutos para disponibilidad
  });
};

/**
 * Hook para obtener estadísticas de rendimiento del staff
 */
export const useStaffPerformance = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['stats', 'staff', user?.id],
    queryFn: () => staffService.getStaffPerformance(user!.id),
    enabled: !!user?.id,
    staleTime: 15 * 60 * 1000, // 15 minutos para estadísticas
  });
};

/**
 * Hook para obtener el horario de un miembro del staff
 */
export const useStaffSchedule = (staffId: string, date: string) => {
  return useQuery({
    queryKey: ['staff', staffId, 'schedule', date],
    queryFn: () => staffService.getStaffSchedule(staffId, date),
    enabled: !!staffId && !!date,
    staleTime: 5 * 60 * 1000, // 5 minutos para horarios
  });
};
