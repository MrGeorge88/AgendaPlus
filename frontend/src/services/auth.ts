import { api, API_ENDPOINTS } from '../config/api';
import { supabase } from '../lib/supabase';

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
}

export interface AuthResponse {
  user: User | null;
  error: Error | null;
}

// Interfaz para la respuesta del backend
interface BackendAuthResponse {
  user: {
    id: string;
    email: string;
    name?: string;
    avatar_url?: string;
  };
  session?: {
    access_token: string;
    refresh_token: string;
    expires_at: string;
  };
}

export const authService = {
  // Iniciar sesión con email y contraseña
  signIn: async (email: string, password: string): Promise<AuthResponse> => {
    try {
      // Intentar iniciar sesión con la API del backend
      try {
        const response = await api.post<BackendAuthResponse>(
          API_ENDPOINTS.AUTH.LOGIN,
          { email, password }
        );

        // Guardar el token en localStorage para futuras solicitudes
        if (response.session?.access_token) {
          localStorage.setItem('auth_token', response.session.access_token);
        }

        return {
          user: response.user,
          error: null
        };
      } catch (apiError) {
        console.log('Error al conectar con la API, usando datos simulados:', apiError);

        // Fallback a datos simulados si la API falla
        console.log('Iniciando sesión con:', email);
        return {
          user: {
            id: '1',
            email,
            name: 'Usuario Demo',
            avatar_url: 'https://github.com/shadcn.png',
          },
          error: null,
        };
      }
    } catch (error) {
      console.error('Error en signIn:', error);
      return {
        user: null,
        error: error as Error,
      };
    }
  },

  // Registrar un nuevo usuario
  signUp: async (email: string, password: string, name: string = ''): Promise<AuthResponse> => {
    try {
      // Intentar registrar con la API del backend
      try {
        const response = await api.post<BackendAuthResponse>(
          API_ENDPOINTS.AUTH.REGISTER,
          { email, password, name }
        );

        // Guardar el token en localStorage para futuras solicitudes
        if (response.session?.access_token) {
          localStorage.setItem('auth_token', response.session.access_token);
        }

        return {
          user: response.user,
          error: null
        };
      } catch (apiError) {
        console.log('Error al conectar con la API, usando datos simulados:', apiError);

        // Fallback a datos simulados si la API falla
        console.log('Registrando usuario con:', email);
        return {
          user: {
            id: '1',
            email,
            name: name || 'Usuario Demo',
            avatar_url: 'https://github.com/shadcn.png',
          },
          error: null,
        };
      }
    } catch (error) {
      console.error('Error en signUp:', error);
      return {
        user: null,
        error: error as Error,
      };
    }
  },

  // Cerrar sesión
  signOut: async (): Promise<{ error: Error | null }> => {
    try {
      // Intentar cerrar sesión con la API del backend
      try {
        await api.post(API_ENDPOINTS.AUTH.LOGOUT, {});

        // Eliminar el token del localStorage
        localStorage.removeItem('auth_token');

        return { error: null };
      } catch (apiError) {
        console.log('Error al conectar con la API, usando datos simulados:', apiError);

        // Fallback a datos simulados si la API falla
        console.log('Cerrando sesión');
        localStorage.removeItem('auth_token');
        return { error: null };
      }
    } catch (error) {
      console.error('Error en signOut:', error);
      return { error: error as Error };
    }
  },

  // Obtener el usuario actual
  getCurrentUser: async (): Promise<AuthResponse> => {
    try {
      // Obtener el token de autenticación
      const token = localStorage.getItem('auth_token');

      // Si no hay token, no hay usuario autenticado
      if (!token) {
        return { user: null, error: null };
      }

      // Intentar obtener el usuario actual con la API del backend
      try {
        const user = await api.get<User>(API_ENDPOINTS.AUTH.ME);

        return {
          user,
          error: null
        };
      } catch (apiError) {
        console.log('Error al conectar con la API, usando datos simulados:', apiError);

        // Fallback a datos simulados si la API falla
        console.log('Obteniendo usuario actual');
        return {
          user: {
            id: '1',
            email: 'usuario@demo.com',
            name: 'Usuario Demo',
            avatar_url: 'https://github.com/shadcn.png',
          },
          error: null,
        };
      }
    } catch (error) {
      console.error('Error en getCurrentUser:', error);
      return {
        user: null,
        error: error as Error,
      };
    }
  },
};
