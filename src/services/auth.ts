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

export const authService = {
  // Iniciar sesión con email y contraseña
  signIn: async (email: string, password: string): Promise<AuthResponse> => {
    try {
      // En una implementación real, esto sería una llamada a Supabase
      // const { data, error } = await supabase.auth.signInWithPassword({
      //   email,
      //   password,
      // });
      // if (error) throw error;
      // return { user: data.user, error: null };

      // Por ahora, simulamos el inicio de sesión
      return {
        user: {
          id: '1',
          email,
          name: 'Usuario Demo',
          avatar_url: 'https://github.com/shadcn.png',
        },
        error: null,
      };
    } catch (error) {
      return {
        user: null,
        error: error as Error,
      };
    }
  },

  // Registrar un nuevo usuario
  signUp: async (email: string, password: string): Promise<AuthResponse> => {
    try {
      // En una implementación real, esto sería una llamada a Supabase
      // const { data, error } = await supabase.auth.signUp({
      //   email,
      //   password,
      // });
      // if (error) throw error;
      // return { user: data.user, error: null };

      // Por ahora, simulamos el registro
      return {
        user: {
          id: '1',
          email,
          name: 'Usuario Demo',
          avatar_url: 'https://github.com/shadcn.png',
        },
        error: null,
      };
    } catch (error) {
      return {
        user: null,
        error: error as Error,
      };
    }
  },

  // Cerrar sesión
  signOut: async (): Promise<{ error: Error | null }> => {
    try {
      // En una implementación real, esto sería una llamada a Supabase
      // const { error } = await supabase.auth.signOut();
      // if (error) throw error;
      // return { error: null };

      // Por ahora, simulamos el cierre de sesión
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  },

  // Obtener el usuario actual
  getCurrentUser: async (): Promise<AuthResponse> => {
    try {
      // En una implementación real, esto sería una llamada a Supabase
      // const { data, error } = await supabase.auth.getUser();
      // if (error) throw error;
      // return { user: data.user, error: null };

      // Por ahora, simulamos la obtención del usuario actual
      return {
        user: {
          id: '1',
          email: 'usuario@demo.com',
          name: 'Usuario Demo',
          avatar_url: 'https://github.com/shadcn.png',
        },
        error: null,
      };
    } catch (error) {
      return {
        user: null,
        error: error as Error,
      };
    }
  },
};
