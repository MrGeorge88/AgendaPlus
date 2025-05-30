// Configuración de la API
// Este archivo centraliza la configuración para las llamadas a la API

// URL base para las solicitudes a la API
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Debug: Log the API URL in development
if (import.meta.env.DEV) {
  console.log('🔗 API Base URL:', API_BASE_URL);
}

// Endpoints de la API
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },
  // Clientes
  CLIENTS: {
    BASE: '/clients',
    BY_ID: (id: number) => `/clients/${id}`,
  },
  // Servicios
  SERVICES: {
    BASE: '/services',
    BY_ID: (id: number) => `/services/${id}`,
  },
  // Personal
  STAFF: {
    BASE: '/staff',
    BY_ID: (id: number) => `/staff/${id}`,
  },
  // Citas
  APPOINTMENTS: {
    BASE: '/appointments',
    BY_ID: (id: string) => `/appointments/${id}`,
  },
};

// Función para construir URLs completas
export const buildUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
};

// Opciones por defecto para fetch
export const defaultFetchOptions: RequestInit = {
  headers: {
    'Content-Type': 'application/json',
  },
};

// Función para realizar solicitudes a la API
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = buildUrl(endpoint);

  // Añadir token de autenticación si existe y no se ha proporcionado en las opciones
  const token = localStorage.getItem('auth_token');
  const headers: HeadersInit = {
    ...defaultFetchOptions.headers,
    ...options.headers,
  };

  // Si hay un token y no se ha proporcionado Authorization en las opciones, añadirlo
  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Combinar opciones por defecto con las proporcionadas
  const fetchOptions: RequestInit = {
    ...defaultFetchOptions,
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, fetchOptions);

    // Verificar si la respuesta es exitosa
    if (!response.ok) {
      // Si el error es 401 (No autorizado), limpiar el token
      if (response.status === 401) {
        localStorage.removeItem('auth_token');
      }

      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Error ${response.status}: ${response.statusText}`
      );
    }

    // Parsear la respuesta como JSON
    const data = await response.json();
    return data as T;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
}

// Funciones de ayuda para diferentes métodos HTTP
export const api = {
  get: <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
    return apiRequest<T>(endpoint, {
      method: 'GET',
      ...options,
    });
  },

  post: <T>(endpoint: string, data: any, options: RequestInit = {}): Promise<T> => {
    return apiRequest<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options,
    });
  },

  put: <T>(endpoint: string, data: any, options: RequestInit = {}): Promise<T> => {
    return apiRequest<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options,
    });
  },

  patch: <T>(endpoint: string, data: any, options: RequestInit = {}): Promise<T> => {
    return apiRequest<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
      ...options,
    });
  },

  delete: <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
    return apiRequest<T>(endpoint, {
      method: 'DELETE',
      ...options,
    });
  },
};
