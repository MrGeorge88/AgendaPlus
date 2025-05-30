import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { queryKeys, invalidateQueries } from '../lib/query-client';
import { clientsService } from '../services/clients';
import { useAuth } from '../contexts/auth-context';
import type { Client, CreateClientData, UpdateClientData } from '../types/client';

/**
 * Hook para obtener todos los clientes de un usuario
 */
export const useClients = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: queryKeys.clientsByUser(user?.id || ''),
    queryFn: () => clientsService.getClients(user!.id),
    enabled: !!user?.id,
    staleTime: 10 * 60 * 1000, // 10 minutos - los clientes no cambian frecuentemente
  });
};

/**
 * Hook para obtener un cliente específico
 */
export const useClient = (clientId: string) => {
  return useQuery({
    queryKey: queryKeys.client(clientId),
    queryFn: () => clientsService.getClient(clientId),
    enabled: !!clientId,
    staleTime: 15 * 60 * 1000, // 15 minutos
  });
};

/**
 * Hook para crear un nuevo cliente
 */
export const useCreateClient = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateClientData) => 
      clientsService.createClient({ ...data, user_id: user!.id }),
    onSuccess: (newClient) => {
      // Invalidar queries relacionadas
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: queryKeys.clientsByUser(user.id) });
      }
      
      // Actualizar caché optimísticamente
      queryClient.setQueryData(
        queryKeys.clientsByUser(user!.id),
        (oldData: Client[] | undefined) => {
          if (!oldData) return [newClient];
          return [...oldData, newClient];
        }
      );
      
      toast.success('Cliente creado exitosamente');
    },
    onError: (error: any) => {
      console.error('Error creating client:', error);
      toast.error(`Error al crear el cliente: ${error.message || 'Error desconocido'}`);
    },
  });
};

/**
 * Hook para actualizar un cliente
 */
export const useUpdateClient = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateClientData }) =>
      clientsService.updateClient(id, data),
    onSuccess: (updatedClient, { id }) => {
      // Invalidar queries relacionadas
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: queryKeys.clientsByUser(user.id) });
        // También invalidar citas ya que pueden estar relacionadas
        invalidateQueries.appointmentRelated(user.id);
      }
      
      // Actualizar caché específico
      queryClient.setQueryData(queryKeys.client(id), updatedClient);
      
      // Actualizar lista de clientes
      queryClient.setQueryData(
        queryKeys.clientsByUser(user!.id),
        (oldData: Client[] | undefined) => {
          if (!oldData) return [updatedClient];
          return oldData.map(client => 
            client.id === id ? updatedClient : client
          );
        }
      );
      
      toast.success('Cliente actualizado exitosamente');
    },
    onError: (error: any) => {
      console.error('Error updating client:', error);
      toast.error(`Error al actualizar el cliente: ${error.message || 'Error desconocido'}`);
    },
  });
};

/**
 * Hook para eliminar un cliente
 */
export const useDeleteClient = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (clientId: string) => clientsService.deleteClient(clientId),
    onSuccess: (_, clientId) => {
      // Invalidar queries relacionadas
      if (user?.id) {
        queryClient.invalidateQueries({ queryKey: queryKeys.clientsByUser(user.id) });
        // También invalidar citas ya que pueden estar relacionadas
        invalidateQueries.appointmentRelated(user.id);
      }
      
      // Remover de caché optimísticamente
      queryClient.setQueryData(
        queryKeys.clientsByUser(user!.id),
        (oldData: Client[] | undefined) => {
          if (!oldData) return [];
          return oldData.filter(client => client.id !== clientId);
        }
      );
      
      toast.success('Cliente eliminado exitosamente');
    },
    onError: (error: any) => {
      console.error('Error deleting client:', error);
      toast.error(`Error al eliminar el cliente: ${error.message || 'Error desconocido'}`);
    },
  });
};

/**
 * Hook para buscar clientes
 */
export const useSearchClients = (searchTerm: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['clients', 'search', user?.id, searchTerm],
    queryFn: () => clientsService.searchClients(user!.id, searchTerm),
    enabled: !!user?.id && searchTerm.length >= 2,
    staleTime: 5 * 60 * 1000, // 5 minutos para búsquedas
  });
};

/**
 * Hook para obtener clientes frecuentes
 */
export const useFrequentClients = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['clients', 'frequent', user?.id],
    queryFn: () => clientsService.getFrequentClients(user!.id),
    enabled: !!user?.id,
    staleTime: 15 * 60 * 1000, // 15 minutos para estadísticas
  });
};

/**
 * Hook para obtener estadísticas de clientes
 */
export const useClientStats = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['stats', 'clients', user?.id],
    queryFn: () => clientsService.getClientStats(user!.id),
    enabled: !!user?.id,
    staleTime: 10 * 60 * 1000, // 10 minutos para estadísticas
  });
};

/**
 * Hook para obtener el historial de citas de un cliente
 */
export const useClientAppointmentHistory = (clientId: string) => {
  return useQuery({
    queryKey: ['clients', clientId, 'appointments'],
    queryFn: () => clientsService.getClientAppointmentHistory(clientId),
    enabled: !!clientId,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};
