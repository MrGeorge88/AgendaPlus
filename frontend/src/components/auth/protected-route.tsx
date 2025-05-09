import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/auth-context';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // Mostrar un indicador de carga mientras se verifica la autenticación
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    // Redirigir al inicio de sesión si no hay usuario autenticado, preservando la ruta de destino
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Renderizar los hijos si el usuario está autenticado
  return <>{children}</>;
}
