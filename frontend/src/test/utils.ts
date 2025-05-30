import { vi } from 'vitest';
import { QueryClient } from '@tanstack/react-query';

// Mock data factories
export const mockService = {
  id: '1',
  name: 'Corte de Cabello',
  category: 'corte',
  description: 'Corte de cabello profesional',
  price: 25,
  duration: 30,
  user_id: 'user-1',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

export const mockClient = {
  id: '1',
  name: 'Juan Pérez',
  email: 'juan@example.com',
  phone: '+1234567890',
  notes: 'Cliente frecuente',
  user_id: 'user-1',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

export const mockStaff = {
  id: '1',
  name: 'María García',
  email: 'maria@example.com',
  phone: '+1234567890',
  specialties: ['corte', 'color'],
  user_id: 'user-1',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

export const mockAppointment = {
  id: '1',
  client_id: '1',
  service_id: '1',
  staff_id: '1',
  start_time: '2024-01-01T10:00:00Z',
  end_time: '2024-01-01T10:30:00Z',
  status: 'scheduled',
  notes: 'Primera cita',
  price: 25,
  user_id: 'user-1',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

export const mockUser = {
  id: 'user-1',
  email: 'test@example.com',
  name: 'Test User',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

// Mock functions para servicios
export const mockServicesService = {
  getServices: vi.fn(),
  getService: vi.fn(),
  createService: vi.fn(),
  updateService: vi.fn(),
  deleteService: vi.fn(),
  searchServices: vi.fn(),
  getPopularServices: vi.fn(),
  getServiceStats: vi.fn(),
};

export const mockClientsService = {
  getClients: vi.fn(),
  getClient: vi.fn(),
  createClient: vi.fn(),
  updateClient: vi.fn(),
  deleteClient: vi.fn(),
  searchClients: vi.fn(),
  getFrequentClients: vi.fn(),
  getClientStats: vi.fn(),
  getClientAppointmentHistory: vi.fn(),
};

export const mockStaffService = {
  getStaff: vi.fn(),
  getStaffMember: vi.fn(),
  createStaff: vi.fn(),
  updateStaff: vi.fn(),
  deleteStaff: vi.fn(),
  getAvailableStaff: vi.fn(),
  getStaffPerformance: vi.fn(),
  getStaffSchedule: vi.fn(),
};

export const mockAppointmentsService = {
  getAppointments: vi.fn(),
  getAppointment: vi.fn(),
  createAppointment: vi.fn(),
  updateAppointment: vi.fn(),
  deleteAppointment: vi.fn(),
  updateAppointmentStatus: vi.fn(),
  getAppointmentsByDate: vi.fn(),
  getAppointmentsByDateRange: vi.fn(),
  getAppointmentStats: vi.fn(),
};

// Helpers para testing de hooks
export const createMockQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: Infinity,
      },
      mutations: {
        retry: false,
      },
    },
  });
};

// Mock de React Router
export const mockNavigate = vi.fn();
export const mockLocation = {
  pathname: '/dashboard',
  search: '',
  hash: '',
  state: null,
  key: 'default',
};

// Mock de hooks de contexto
export const mockAuthContext = {
  user: mockUser,
  login: vi.fn(),
  logout: vi.fn(),
  register: vi.fn(),
  loading: false,
  error: null,
};

export const mockLanguageContext = {
  language: 'es',
  setLanguage: vi.fn(),
  t: vi.fn((key: string) => key),
};

export const mockThemeContext = {
  theme: 'light',
  setTheme: vi.fn(),
  toggleTheme: vi.fn(),
};

// Helpers para simular eventos
export const createMockEvent = (overrides = {}) => ({
  preventDefault: vi.fn(),
  stopPropagation: vi.fn(),
  target: {
    value: '',
    name: '',
    checked: false,
    ...overrides,
  },
});

export const createMockFormEvent = (formData: Record<string, any>) => {
  const mockFormData = new FormData();
  Object.entries(formData).forEach(([key, value]) => {
    mockFormData.append(key, value);
  });

  return {
    preventDefault: vi.fn(),
    target: {
      elements: formData,
    },
    currentTarget: {
      elements: formData,
    },
  };
};

// Helpers para testing de formularios
export const fillForm = async (user: any, fields: Record<string, string>) => {
  for (const [name, value] of Object.entries(fields)) {
    const field = document.querySelector(`[name="${name}"]`) as HTMLInputElement;
    if (field) {
      await user.clear(field);
      await user.type(field, value);
    }
  }
};

export const submitForm = async (user: any, formSelector = 'form') => {
  const form = document.querySelector(formSelector) as HTMLFormElement;
  if (form) {
    await user.click(form.querySelector('[type="submit"]') || form);
  }
};

// Mock de fetch responses
export const createMockResponse = (data: any, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  json: vi.fn().mockResolvedValue(data),
  text: vi.fn().mockResolvedValue(JSON.stringify(data)),
});

// Helpers para testing de errores
export const expectErrorToBeThrown = async (fn: () => Promise<any>, expectedError?: string) => {
  try {
    await fn();
    throw new Error('Expected function to throw an error');
  } catch (error) {
    if (expectedError) {
      expect(error.message).toContain(expectedError);
    }
  }
};

// Mock de timers
export const advanceTimers = (ms: number) => {
  vi.advanceTimersByTime(ms);
};

export const runAllTimers = () => {
  vi.runAllTimers();
};

// Cleanup helpers
export const resetAllMocks = () => {
  vi.clearAllMocks();
  vi.clearAllTimers();
};

// Wait helpers
export const waitForNextTick = () => new Promise(resolve => setTimeout(resolve, 0));

export const waitFor = (condition: () => boolean, timeout = 1000) => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const check = () => {
      if (condition()) {
        resolve(true);
      } else if (Date.now() - startTime > timeout) {
        reject(new Error('Timeout waiting for condition'));
      } else {
        setTimeout(check, 10);
      }
    };
    check();
  });
};
