import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { queryKeys, invalidateQueries } from '../lib/query-client';
import { servicesService } from '../services/services';
import { useAuth } from '../contexts/auth-context';
import type { Service, CreateServiceData, UpdateServiceData } from '../types/service';

/**
 * Hook para obtener todos los servicios de un usuario
 */
export const useServices = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: queryKeys.servicesByUser(user?.id || ''),
    queryFn: () => servicesService.getServices(user!.id),
    enabled: !!user?.id,
    staleTime: 10 * 60 * 1000, // 10 minutos - los servicios no cambian frecuentemente
  });
};

/**
 * Hook para obtener un servicio específico
 */
export const useService = (serviceId: string) => {
  return useQuery({
    queryKey: queryKeys.service(serviceId),
    queryFn: () => servicesService.getService(serviceId),
    enabled: !!serviceId,
    staleTime: 15 * 60 * 1000, // 15 minutos
  });
};

/**
 * Hook para crear un nuevo servicio
 */
export const useCreateService = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateServiceData) => 
      servicesService.createService({ ...data, user_id: user!.id }),
    onSuccess: (newService) => {
      // Invalidar queries relacionadas
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: queryKeys.servicesByUser(user.id) });
      }
      
      // Actualizar caché optimísticamente
      queryClient.setQueryData(
        queryKeys.servicesByUser(user!.id),
        (oldData: Service[] | undefined) => {
          if (!oldData) return [newService];
          return [...oldData, newService];
        }
      );
      
      toast.success('Servicio creado exitosamente');
    },
    onError: (error: any) => {
      console.error('Error creating service:', error);
      toast.error(`Error al crear el servicio: ${error.message || 'Error desconocido'}`);
    },
  });
};

/**
 * Hook para actualizar un servicio
 */
export const useUpdateService = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateServiceData }) =>
      servicesService.updateService(id, data),
    onSuccess: (updatedService, { id }) => {
      // Invalidar queries relacionadas
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: queryKeys.servicesByUser(user.id) });
        // También invalidar citas ya que pueden estar relacionadas
        invalidateQueries.appointmentRelated(user.id);
      }
      
      // Actualizar caché específico
      queryClient.setQueryData(queryKeys.service(id), updatedService);
      
      // Actualizar lista de servicios
      queryClient.setQueryData(
        queryKeys.servicesByUser(user!.id),
        (oldData: Service[] | undefined) => {
          if (!oldData) return [updatedService];
          return oldData.map(service => 
            service.id === id ? updatedService : service
          );
        }
      );
      
      toast.success('Servicio actualizado exitosamente');
    },
    onError: (error: any) => {
      console.error('Error updating service:', error);
      toast.error(`Error al actualizar el servicio: ${error.message || 'Error desconocido'}`);
    },
  });
};

/**
 * Hook para eliminar un servicio
 */
export const useDeleteService = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (serviceId: string) => servicesService.deleteService(serviceId),
    onSuccess: (_, serviceId) => {
      // Invalidar queries relacionadas
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: queryKeys.servicesByUser(user.id) });
        // También invalidar citas ya que pueden estar relacionadas
        invalidateQueries.appointmentRelated(user.id);
      }
      
      // Remover de caché optimísticamente
      queryClient.setQueryData(
        queryKeys.servicesByUser(user!.id),
        (oldData: Service[] | undefined) => {
          if (!oldData) return [];
          return oldData.filter(service => service.id !== serviceId);
        }
      );
      
      toast.success('Servicio eliminado exitosamente');
    },
    onError: (error: any) => {
      console.error('Error deleting service:', error);
      toast.error(`Error al eliminar el servicio: ${error.message || 'Error desconocido'}`);
    },
  });
};

/**
 * Hook para obtener servicios más populares
 */
export const usePopularServices = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['services', 'popular', user?.id],
    queryFn: () => servicesService.getPopularServices(user!.id),
    enabled: !!user?.id,
    staleTime: 15 * 60 * 1000, // 15 minutos para estadísticas
  });
};

/**
 * Hook para buscar servicios
 */
export const useSearchServices = (searchTerm: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['services', 'search', user?.id, searchTerm],
    queryFn: () => servicesService.searchServices(user!.id, searchTerm),
    enabled: !!user?.id && searchTerm.length >= 2,
    staleTime: 5 * 60 * 1000, // 5 minutos para búsquedas
  });
};

/**
 * Hook para obtener estadísticas de servicios
 */
export const useServiceStats = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['stats', 'services', user?.id],
    queryFn: () => servicesService.getServiceStats(user!.id),
    enabled: !!user?.id,
    staleTime: 10 * 60 * 1000, // 10 minutos para estadísticas
  });
};
