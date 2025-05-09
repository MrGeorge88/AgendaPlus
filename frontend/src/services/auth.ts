import { api, API_ENDPOINTS } from '../config/api';
import { supabase, supabaseUrl } from '../lib/supabase';

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
}

export interface AuthResponse {
  user: User | null;
  error: Error | null;
  message?: string;
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
      // Intentar iniciar sesión directamente con Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Convertir el usuario de Supabase a nuestro formato de usuario
      const user: User = {
        id: data.user.id,
        email: data.user.email || '',
        name: data.user.user_metadata?.name,
        avatar_url: data.user.user_metadata?.avatar_url,
      };

      return {
        user,
        error: null
      };
    } catch (error) {
      console.error('Error en signIn:', error);

      // No usar datos simulados en producción

      return {
        user: null,
        error: error as Error,
      };
    }
  },

  // Registrar un nuevo usuario
  signUp: async (email: string, password: string, name: string = ''): Promise<AuthResponse> => {
    try {
      // Intentar registrar directamente con Supabase con confirmación de email
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      // Verificar si se requiere confirmación de email
      const needsEmailConfirmation = !data.session;

      // Convertir el usuario de Supabase a nuestro formato de usuario
      const user: User = data.user ? {
        id: data.user.id,
        email: data.user.email || '',
        name: data.user.user_metadata?.name,
        avatar_url: data.user.user_metadata?.avatar_url,
      } : null;

      // Si se requiere confirmación de email, devolver un mensaje específico
      if (needsEmailConfirmation) {
        return {
          user,
          error: null,
          message: 'Por favor, verifica tu correo electrónico para completar el registro.'
        };
      }

      return {
        user,
        error: null
      };
    } catch (error) {
      console.error('Error en signUp:', error);

      // No usar datos simulados en producción

      return {
        user: null,
        error: error as Error,
      };
    }
  },

  // Cerrar sesión
  signOut: async (): Promise<{ error: Error | null }> => {
    try {
      // Cerrar sesión con Supabase
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Eliminar el token del localStorage
      localStorage.removeItem('auth_token');

      return { error: null };
    } catch (error) {
      console.error('Error en signOut:', error);
      return { error: error as Error };
    }
  },

  // Obtener el usuario actual
  getCurrentUser: async (): Promise<AuthResponse> => {
    try {
      // Obtener el usuario actual de Supabase
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;

      if (!data.user) {
        return {
          user: null,
          error: null,
        };
      }

      // Convertir el usuario de Supabase a nuestro formato de usuario
      const user: User = {
        id: data.user.id,
        email: data.user.email || '',
        name: data.user.user_metadata?.name,
        avatar_url: data.user.user_metadata?.avatar_url,
      };

      return {
        user,
        error: null,
      };
    } catch (error) {
      console.error('Error en getCurrentUser:', error);

      // No usar datos simulados en producción

      return {
        user: null,
        error: error as Error,
      };
    }
  },
};
