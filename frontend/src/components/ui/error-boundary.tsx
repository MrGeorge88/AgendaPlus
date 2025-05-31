import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { useLanguage } from '../../contexts/language-context';
import { Button } from './button';

interface Props {
  children: ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error capturado por ErrorBoundary:', error, errorInfo);

    this.setState({
      error,
      errorInfo
    });

    // Llamar al callback de error si se proporciona
    this.props.onError?.(error, errorInfo);

    // En desarrollo, mostrar información detallada
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 Error Boundary - Información detallada');
      console.error('Error:', error);
      console.error('Component Stack:', errorInfo.componentStack);
      console.error('Error Stack:', error.stack);
      console.groupEnd();
    }

    // En producción, enviar a servicio de monitoreo (Sentry, LogRocket, etc.)
    if (process.env.NODE_ENV === 'production') {
      // TODO: Integrar con servicio de monitoreo
      // Sentry.captureException(error, { contexts: { react: { componentStack: errorInfo.componentStack } } });
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return <FallbackComponent error={this.state.error!} resetError={this.resetError} />;
    }

    return this.props.children;
  }
}

// Componente de fallback por defecto
interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
}

export const DefaultErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetError }) => {
  const isDevelopment = process.env.NODE_ENV === 'development';

  // Log detailed error information
  console.error('🚨 Error Boundary Caught:', {
    message: error.message,
    stack: error.stack,
    name: error.name,
    cause: error.cause,
    timestamp: new Date().toISOString(),
    url: window.location.href,
    userAgent: navigator.userAgent
  });

  const handleReload = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  const handleReportError = () => {
    // TODO: Implementar reporte de errores
    const errorReport = {
      message: error.message,
      stack: error.stack,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString()
    };

    console.log('Error Report:', errorReport);
    // Aquí se podría enviar a un servicio de reporte de errores
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
        <div className="mb-4">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 mb-2">
            ¡Oops! Algo salió mal
          </h1>
          <p className="text-slate-600 mb-4">
            Ha ocurrido un error inesperado. Nuestro equipo ha sido notificado y está trabajando para solucionarlo.
          </p>
        </div>

        {/* Mostrar información del error temporalmente en producción para debug */}
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-left">
          <h3 className="font-medium text-red-800 mb-2">
            Información del error {isDevelopment ? '(desarrollo)' : '(debug temporal)'}:
          </h3>
          <p className="text-sm text-red-700 font-mono break-all">
            {error.message}
          </p>
          {error.stack && (
            <details className="mt-2">
              <summary className="text-sm text-red-600 cursor-pointer">Ver stack trace</summary>
              <pre className="text-xs text-red-600 mt-2 overflow-auto max-h-32">
                {error.stack}
              </pre>
            </details>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex space-x-3">
            <Button
              onClick={resetError}
              className="flex-1 flex items-center justify-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reintentar</span>
            </Button>
            <Button
              variant="outline"
              onClick={handleReload}
              className="flex-1 flex items-center justify-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Recargar</span>
            </Button>
          </div>

          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={handleGoHome}
              className="flex-1 flex items-center justify-center space-x-2"
            >
              <Home className="w-4 h-4" />
              <span>Ir al inicio</span>
            </Button>
            <Button
              variant="outline"
              onClick={handleReportError}
              className="flex-1 flex items-center justify-center space-x-2"
            >
              <Bug className="w-4 h-4" />
              <span>Reportar</span>
            </Button>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-200">
          <p className="text-xs text-slate-500">
            Si el problema persiste, contacta con soporte técnico.
          </p>
        </div>
      </div>
    </div>
  );
};

// Error Boundary específico para componentes
export const ComponentErrorBoundary: React.FC<{
  children: ReactNode;
  componentName?: string;
}> = ({ children, componentName = 'Componente' }) => {
  return (
    <ErrorBoundary
      fallback={({ error, resetError }) => (
        <div className="p-4 border border-red-200 rounded-lg bg-red-50">
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h3 className="font-medium text-red-800">
              Error en {componentName}
            </h3>
          </div>
          <p className="text-sm text-red-700 mb-3">
            {error.message}
          </p>
          <Button size="sm" onClick={resetError}>
            Reintentar
          </Button>
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  );
};

// Hook para usar Error Boundary programáticamente
export const useErrorHandler = () => {
  const handleError = (error: Error, errorInfo?: string) => {
    console.error('Error manejado:', error);

    // En desarrollo, mostrar en consola
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 Error Handler');
      console.error('Error:', error);
      if (errorInfo) console.error('Info adicional:', errorInfo);
      console.groupEnd();
    }

    // En producción, enviar a servicio de monitoreo
    if (process.env.NODE_ENV === 'production') {
      // TODO: Integrar con servicio de monitoreo
    }

    // Lanzar el error para que sea capturado por Error Boundary
    throw error;
  };

  return { handleError };
};

// Componente para mostrar errores de carga de datos
export const DataErrorFallback: React.FC<{
  error: Error;
  onRetry: () => void;
  title?: string;
}> = ({ error, onRetry, title = 'Error al cargar datos' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <AlertTriangle className="w-8 h-8 text-red-600" />
      </div>
      <h3 className="text-lg font-medium text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 mb-4 max-w-md">
        {error.message || 'Ha ocurrido un error al cargar los datos. Por favor, inténtalo de nuevo.'}
      </p>
      <Button onClick={onRetry} className="flex items-center space-x-2">
        <RefreshCw className="w-4 h-4" />
        <span>Reintentar</span>
      </Button>
    </div>
  );
};

// Componente para errores de formulario
export const FormErrorFallback: React.FC<{
  error: Error;
  onReset: () => void;
}> = ({ error, onReset }) => {
  return (
    <div className="p-4 border border-red-200 rounded-lg bg-red-50">
      <div className="flex items-start space-x-3">
        <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-medium text-red-800 mb-1">
            Error en el formulario
          </h3>
          <p className="text-sm text-red-700 mb-3">
            {error.message}
          </p>
          <Button size="sm" variant="outline" onClick={onReset}>
            Reiniciar formulario
          </Button>
        </div>
      </div>
    </div>
  );
};
