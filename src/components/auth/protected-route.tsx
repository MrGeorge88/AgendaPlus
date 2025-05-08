import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/auth-context';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    // Mostrar un indicador de carga mientras se verifica la autenticación
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    // Redirigir al inicio de sesión si no hay usuario autenticado
    return <Navigate to="/login" replace />;
  }

  // Renderizar los hijos si el usuario está autenticado
  return <>{children}</>;
}
