import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '../../test/setup';
import userEvent from '@testing-library/user-event';
import { Services } from '../services';
import { servicesService } from '../../services/services';
import { mockService, mockUser } from '../../test/utils';

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

// Mock de React Router
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useLocation: () => ({
      pathname: '/services',
    }),
  };
});

// Mock de toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('Services Page Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('loads and displays services', async () => {
    const mockServices = [
      mockService,
      { ...mockService, id: '2', name: 'Coloración', category: 'color', price: 50 },
    ];

    vi.mocked(servicesService.getServices).mockResolvedValue(mockServices);

    render(<Services />);

    // Verificar que se muestra el loading inicialmente
    expect(screen.getByText('Cargando...')).toBeInTheDocument();

    // Esperar a que carguen los servicios
    await waitFor(() => {
      expect(screen.getByText('Corte de Cabello')).toBeInTheDocument();
      expect(screen.getByText('Coloración')).toBeInTheDocument();
    });

    // Verificar que se llamó al servicio con el ID del usuario
    expect(servicesService.getServices).toHaveBeenCalledWith(mockUser.id);
  });

  it('shows empty state when no services', async () => {
    vi.mocked(servicesService.getServices).mockResolvedValue([]);

    render(<Services />);

    await waitFor(() => {
      expect(screen.getByText(/no hay servicios/i)).toBeInTheDocument();
    });
  });

  it('handles error state', async () => {
    const errorMessage = 'Failed to load services';
    vi.mocked(servicesService.getServices).mockRejectedValue(new Error(errorMessage));

    render(<Services />);

    await waitFor(() => {
      expect(screen.getByText(/error al cargar servicios/i)).toBeInTheDocument();
    });
  });

  it('opens create service modal', async () => {
    const user = userEvent.setup();
    vi.mocked(servicesService.getServices).mockResolvedValue([]);

    render(<Services />);

    // Esperar a que cargue la página
    await waitFor(() => {
      expect(screen.getByText(/nuevo servicio/i)).toBeInTheDocument();
    });

    // Click en el botón de nuevo servicio
    const newServiceButton = screen.getByRole('button', { name: /nuevo servicio/i });
    await user.click(newServiceButton);

    // Verificar que se abre el modal
    await waitFor(() => {
      expect(screen.getByText(/crear servicio/i)).toBeInTheDocument();
    });
  });

  it('creates a new service', async () => {
    const user = userEvent.setup();
    const newService = { ...mockService, id: '2', name: 'Nuevo Servicio' };
    
    vi.mocked(servicesService.getServices).mockResolvedValue([mockService]);
    vi.mocked(servicesService.createService).mockResolvedValue(newService);

    render(<Services />);

    // Esperar a que cargue
    await waitFor(() => {
      expect(screen.getByText('Corte de Cabello')).toBeInTheDocument();
    });

    // Abrir modal de creación
    const newServiceButton = screen.getByRole('button', { name: /nuevo servicio/i });
    await user.click(newServiceButton);

    // Llenar el formulario
    await waitFor(() => {
      expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
    });

    await user.type(screen.getByLabelText(/nombre/i), 'Nuevo Servicio');
    await user.selectOptions(screen.getByLabelText(/categoría/i), 'corte');
    await user.type(screen.getByLabelText(/precio/i), '35');
    await user.type(screen.getByLabelText(/duración/i), '45');

    // Enviar formulario
    const submitButton = screen.getByRole('button', { name: /guardar/i });
    await user.click(submitButton);

    // Verificar que se llamó al servicio
    await waitFor(() => {
      expect(servicesService.createService).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Nuevo Servicio',
          category: 'corte',
          price: 35,
          duration: 45,
        }),
        mockUser.id
      );
    });
  });

  it('edits an existing service', async () => {
    const user = userEvent.setup();
    const updatedService = { ...mockService, name: 'Servicio Actualizado' };
    
    vi.mocked(servicesService.getServices).mockResolvedValue([mockService]);
    vi.mocked(servicesService.updateService).mockResolvedValue(updatedService);

    render(<Services />);

    // Esperar a que cargue
    await waitFor(() => {
      expect(screen.getByText('Corte de Cabello')).toBeInTheDocument();
    });

    // Click en el botón de editar
    const editButton = screen.getByRole('button', { name: /editar/i });
    await user.click(editButton);

    // Verificar que se abre el modal con datos pre-llenados
    await waitFor(() => {
      expect(screen.getByDisplayValue('Corte de Cabello')).toBeInTheDocument();
    });

    // Modificar el nombre
    const nameInput = screen.getByDisplayValue('Corte de Cabello');
    await user.clear(nameInput);
    await user.type(nameInput, 'Servicio Actualizado');

    // Enviar formulario
    const updateButton = screen.getByRole('button', { name: /actualizar/i });
    await user.click(updateButton);

    // Verificar que se llamó al servicio de actualización
    await waitFor(() => {
      expect(servicesService.updateService).toHaveBeenCalledWith(
        mockService.id,
        expect.objectContaining({
          name: 'Servicio Actualizado',
        })
      );
    });
  });

  it('deletes a service with confirmation', async () => {
    const user = userEvent.setup();
    
    vi.mocked(servicesService.getServices).mockResolvedValue([mockService]);
    vi.mocked(servicesService.deleteService).mockResolvedValue(undefined);

    // Mock de window.confirm
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);

    render(<Services />);

    // Esperar a que cargue
    await waitFor(() => {
      expect(screen.getByText('Corte de Cabello')).toBeInTheDocument();
    });

    // Click en el botón de eliminar
    const deleteButton = screen.getByRole('button', { name: /eliminar/i });
    await user.click(deleteButton);

    // Verificar que se muestra la confirmación
    expect(confirmSpy).toHaveBeenCalled();

    // Verificar que se llamó al servicio de eliminación
    await waitFor(() => {
      expect(servicesService.deleteService).toHaveBeenCalledWith(mockService.id);
    });

    confirmSpy.mockRestore();
  });

  it('cancels service deletion', async () => {
    const user = userEvent.setup();
    
    vi.mocked(servicesService.getServices).mockResolvedValue([mockService]);

    // Mock de window.confirm que retorna false
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);

    render(<Services />);

    // Esperar a que cargue
    await waitFor(() => {
      expect(screen.getByText('Corte de Cabello')).toBeInTheDocument();
    });

    // Click en el botón de eliminar
    const deleteButton = screen.getByRole('button', { name: /eliminar/i });
    await user.click(deleteButton);

    // Verificar que se muestra la confirmación pero no se elimina
    expect(confirmSpy).toHaveBeenCalled();
    expect(servicesService.deleteService).not.toHaveBeenCalled();

    confirmSpy.mockRestore();
  });

  it('filters services by search term', async () => {
    const user = userEvent.setup();
    const mockServices = [
      mockService,
      { ...mockService, id: '2', name: 'Coloración', category: 'color' },
      { ...mockService, id: '3', name: 'Manicure', category: 'manicure' },
    ];

    vi.mocked(servicesService.getServices).mockResolvedValue(mockServices);

    render(<Services />);

    // Esperar a que carguen los servicios
    await waitFor(() => {
      expect(screen.getByText('Corte de Cabello')).toBeInTheDocument();
      expect(screen.getByText('Coloración')).toBeInTheDocument();
      expect(screen.getByText('Manicure')).toBeInTheDocument();
    });

    // Buscar por "color"
    const searchInput = screen.getByPlaceholderText(/buscar/i);
    await user.type(searchInput, 'color');

    // Verificar que solo se muestra el servicio de coloración
    await waitFor(() => {
      expect(screen.getByText('Coloración')).toBeInTheDocument();
      expect(screen.queryByText('Corte de Cabello')).not.toBeInTheDocument();
      expect(screen.queryByText('Manicure')).not.toBeInTheDocument();
    });
  });

  it('handles form validation errors', async () => {
    const user = userEvent.setup();
    
    vi.mocked(servicesService.getServices).mockResolvedValue([]);

    render(<Services />);

    // Abrir modal de creación
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /nuevo servicio/i })).toBeInTheDocument();
    });

    const newServiceButton = screen.getByRole('button', { name: /nuevo servicio/i });
    await user.click(newServiceButton);

    // Intentar enviar formulario vacío
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /guardar/i })).toBeInTheDocument();
    });

    const submitButton = screen.getByRole('button', { name: /guardar/i });
    await user.click(submitButton);

    // Verificar que se muestran errores de validación
    await waitFor(() => {
      expect(screen.getByText(/nombre.*obligatorio/i)).toBeInTheDocument();
    });

    // Verificar que no se llamó al servicio
    expect(servicesService.createService).not.toHaveBeenCalled();
  });
});
