import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authService, User, AuthResponse } from '../services/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name?: string) => Promise<AuthResponse>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay un usuario autenticado al cargar la aplicación
    const checkUser = async () => {
      setLoading(true);
      try {
        const { user } = await authService.getCurrentUser();
        setUser(user);
      } catch (error) {
        console.error('Error al obtener el usuario actual:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { user, error } = await authService.signIn(email, password);
      if (error) throw error;
      setUser(user);
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string = '') => {
    setLoading(true);
    try {
      const response = await authService.signUp(email, password, name);
      if (response.error) throw response.error;

      // If there's a message, it means email confirmation is required
      if (response.message) {
        // Don't set the user yet, they need to confirm their email
        return response;
      }

      setUser(response.user);
      return response;
    } catch (error) {
      console.error('Error al registrarse:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      const { error } = await authService.signOut();
      if (error) throw error;
      setUser(null);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}
