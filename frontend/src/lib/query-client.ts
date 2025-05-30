import { QueryClient } from '@tanstack/react-query';

// Configuración optimizada de React Query
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos - datos considerados frescos
      gcTime: 10 * 60 * 1000, // 10 minutos - tiempo en caché
      retry: (failureCount, error: any) => {
        // No reintentar en errores 404 o de autenticación
        if (error?.status === 404 || error?.status === 401 || error?.status === 403) {
          return false;
        }
        // Máximo 3 reintentos para otros errores
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false, // No refetch automático al enfocar ventana
      refetchOnReconnect: true, // Sí refetch al reconectar internet
    },
    mutations: {
      retry: (failureCount, error: any) => {
        // No reintentar mutaciones en errores de cliente
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        // Máximo 2 reintentos para errores de servidor
        return failureCount < 2;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    },
  },
});

// Claves de query organizadas
export const queryKeys = {
  // Usuarios
  users: ['users'] as const,
  user: (id: string) => ['users', id] as const,
  
  // Clientes
  clients: ['clients'] as const,
  client: (id: string) => ['clients', id] as const,
  clientsByUser: (userId: string) => ['clients', 'user', userId] as const,
  
  // Servicios
  services: ['services'] as const,
  service: (id: string) => ['services', id] as const,
  servicesByUser: (userId: string) => ['services', 'user', userId] as const,
  
  // Staff
  staff: ['staff'] as const,
  staffMember: (id: string) => ['staff', id] as const,
  staffByUser: (userId: string) => ['staff', 'user', userId] as const,
  
  // Citas
  appointments: ['appointments'] as const,
  appointment: (id: string) => ['appointments', id] as const,
  appointmentsByUser: (userId: string) => ['appointments', 'user', userId] as const,
  appointmentsByDate: (userId: string, date: string) => ['appointments', 'user', userId, 'date', date] as const,
  appointmentsByDateRange: (userId: string, startDate: string, endDate: string) => 
    ['appointments', 'user', userId, 'range', startDate, endDate] as const,
  
  // Estadísticas
  stats: ['stats'] as const,
  incomeStats: (userId: string) => ['stats', 'income', userId] as const,
  dashboardStats: (userId: string) => ['stats', 'dashboard', userId] as const,
} as const;

// Utilidades para invalidar queries
export const invalidateQueries = {
  // Invalidar todos los datos de un usuario
  allUserData: (userId: string) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.clientsByUser(userId) });
    queryClient.invalidateQueries({ queryKey: queryKeys.servicesByUser(userId) });
    queryClient.invalidateQueries({ queryKey: queryKeys.staffByUser(userId) });
    queryClient.invalidateQueries({ queryKey: queryKeys.appointmentsByUser(userId) });
    queryClient.invalidateQueries({ queryKey: queryKeys.incomeStats(userId) });
    queryClient.invalidateQueries({ queryKey: queryKeys.dashboardStats(userId) });
  },
  
  // Invalidar datos relacionados con citas
  appointmentRelated: (userId: string) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.appointmentsByUser(userId) });
    queryClient.invalidateQueries({ queryKey: queryKeys.incomeStats(userId) });
    queryClient.invalidateQueries({ queryKey: queryKeys.dashboardStats(userId) });
  },
  
  // Invalidar estadísticas
  stats: (userId: string) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.incomeStats(userId) });
    queryClient.invalidateQueries({ queryKey: queryKeys.dashboardStats(userId) });
  },
};
