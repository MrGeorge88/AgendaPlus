import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useServices, useCreateService, useUpdateService, useDeleteService } from '../use-services';
import { servicesService } from '../../services/services';
import { mockService, mockUser, createMockQueryClient } from '../../test/utils';

// Mock del servicio
vi.mock('../../services/services', () => ({
  servicesService: {
    getServices: vi.fn(),
    createService: vi.fn(),
    updateService: vi.fn(),
    deleteService: vi.fn(),
  },
}));

// Mock del contexto de autenticación
vi.mock('../../contexts/auth-context', () => ({
  useAuth: () => ({
    user: mockUser,
  }),
}));

// Mock de toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('useServices', () => {
  let queryClient: QueryClient;
  let wrapper: React.FC<{ children: React.ReactNode }>;

  beforeEach(() => {
    queryClient = createMockQueryClient();
    wrapper = ({ children }) => (
      React.createElement(QueryClientProvider, { client: queryClient }, children)
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  describe('useServices', () => {
    it('should fetch services successfully', async () => {
      const mockServices = [mockService];
      vi.mocked(servicesService.getServices).mockResolvedValue(mockServices);

      const { result } = renderHook(() => useServices(), { wrapper });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockServices);
      expect(servicesService.getServices).toHaveBeenCalledWith(mockUser.id);
    });

    it('should handle error when fetching services', async () => {
      const errorMessage = 'Failed to fetch services';
      vi.mocked(servicesService.getServices).mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useServices(), { wrapper });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error?.message).toBe(errorMessage);
    });

    it('should not fetch when user is not available', () => {
      // Mock sin usuario
      vi.doMock('../../contexts/auth-context', () => ({
        useAuth: () => ({
          user: null,
        }),
      }));

      const { result } = renderHook(() => useServices(), { wrapper });

      expect(result.current.isLoading).toBe(false);
      expect(servicesService.getServices).not.toHaveBeenCalled();
    });
  });

  describe('useCreateService', () => {
    it('should create service successfully', async () => {
      const newService = { ...mockService, id: '2', name: 'Nuevo Servicio' };
      vi.mocked(servicesService.createService).mockResolvedValue(newService);

      const { result } = renderHook(() => useCreateService(), { wrapper });

      const serviceData = {
        name: 'Nuevo Servicio',
        category: 'corte',
        description: 'Descripción del servicio',
        price: 30,
        duration: 45,
      };

      await result.current.mutateAsync(serviceData);

      expect(servicesService.createService).toHaveBeenCalledWith({
        ...serviceData,
        user_id: mockUser.id,
      });
    });

    it('should handle error when creating service', async () => {
      const errorMessage = 'Failed to create service';
      vi.mocked(servicesService.createService).mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useCreateService(), { wrapper });

      const serviceData = {
        name: 'Nuevo Servicio',
        category: 'corte',
        description: 'Descripción del servicio',
        price: 30,
        duration: 45,
      };

      try {
        await result.current.mutateAsync(serviceData);
      } catch (error) {
        expect(error.message).toBe(errorMessage);
      }

      expect(result.current.isError).toBe(true);
    });
  });

  describe('useUpdateService', () => {
    it('should update service successfully', async () => {
      const updatedService = { ...mockService, name: 'Servicio Actualizado' };
      vi.mocked(servicesService.updateService).mockResolvedValue(updatedService);

      const { result } = renderHook(() => useUpdateService(), { wrapper });

      const updateData = {
        name: 'Servicio Actualizado',
        price: 35,
      };

      await result.current.mutateAsync({
        id: mockService.id,
        data: updateData,
      });

      expect(servicesService.updateService).toHaveBeenCalledWith(mockService.id, updateData);
    });

    it('should handle error when updating service', async () => {
      const errorMessage = 'Failed to update service';
      vi.mocked(servicesService.updateService).mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useUpdateService(), { wrapper });

      try {
        await result.current.mutateAsync({
          id: mockService.id,
          data: { name: 'Updated' },
        });
      } catch (error) {
        expect(error.message).toBe(errorMessage);
      }

      expect(result.current.isError).toBe(true);
    });
  });

  describe('useDeleteService', () => {
    it('should delete service successfully', async () => {
      vi.mocked(servicesService.deleteService).mockResolvedValue(undefined);

      const { result } = renderHook(() => useDeleteService(), { wrapper });

      await result.current.mutateAsync(mockService.id);

      expect(servicesService.deleteService).toHaveBeenCalledWith(mockService.id);
    });

    it('should handle error when deleting service', async () => {
      const errorMessage = 'Failed to delete service';
      vi.mocked(servicesService.deleteService).mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useDeleteService(), { wrapper });

      try {
        await result.current.mutateAsync(mockService.id);
      } catch (error) {
        expect(error.message).toBe(errorMessage);
      }

      expect(result.current.isError).toBe(true);
    });
  });

  describe('cache invalidation', () => {
    it('should invalidate services cache after creating a service', async () => {
      const newService = { ...mockService, id: '2' };
      vi.mocked(servicesService.createService).mockResolvedValue(newService);

      // Primero cargar servicios
      const { result: servicesResult } = renderHook(() => useServices(), { wrapper });
      await waitFor(() => expect(servicesResult.current.isSuccess).toBe(true));

      // Luego crear un nuevo servicio
      const { result: createResult } = renderHook(() => useCreateService(), { wrapper });
      await createResult.current.mutateAsync({
        name: 'Nuevo Servicio',
        category: 'corte',
        description: '',
        price: 30,
        duration: 45,
      });

      // Verificar que se invalidó la caché
      await waitFor(() => {
        expect(servicesResult.current.isFetching).toBe(true);
      });
    });
  });
});
