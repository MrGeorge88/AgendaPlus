import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useIsMobile } from '../../hooks/use-media-query';

export interface ToastProps {
  id: string;
  title?: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose: (id: string) => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const toastIcons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const toastStyles = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
};

const iconStyles = {
  success: 'text-green-600',
  error: 'text-red-600',
  warning: 'text-yellow-600',
  info: 'text-blue-600',
};

export const Toast: React.FC<ToastProps> = ({
  id,
  title,
  message,
  type = 'info',
  duration = 5000,
  onClose,
  action
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const isMobile = useIsMobile();
  
  const Icon = toastIcons[type];

  useEffect(() => {
    // Mostrar el toast
    const showTimer = setTimeout(() => setIsVisible(true), 100);
    
    // Auto-cerrar después de la duración especificada
    const hideTimer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose(id);
    }, 300);
  };

  return (
    <div
      className={cn(
        'pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg border shadow-lg transition-all duration-300',
        toastStyles[type],
        isVisible && !isLeaving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0',
        isMobile && 'max-w-none mx-4'
      )}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Icon className={cn('h-5 w-5', iconStyles[type])} />
          </div>
          
          <div className="ml-3 w-0 flex-1">
            {title && (
              <p className="text-sm font-medium">
                {title}
              </p>
            )}
            <p className={cn('text-sm', title && 'mt-1')}>
              {message}
            </p>
            
            {action && (
              <div className="mt-3">
                <button
                  onClick={action.onClick}
                  className={cn(
                    'text-sm font-medium underline hover:no-underline focus:outline-none',
                    iconStyles[type]
                  )}
                >
                  {action.label}
                </button>
              </div>
            )}
          </div>
          
          <div className="ml-4 flex flex-shrink-0">
            <button
              onClick={handleClose}
              className={cn(
                'inline-flex rounded-md p-1.5 transition-colors',
                'hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-offset-2',
                iconStyles[type]
              )}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Contenedor de toasts
interface ToastContainerProps {
  toasts: ToastProps[];
  onClose: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onClose }) => {
  const isMobile = useIsMobile();

  return (
    <div
      className={cn(
        'fixed z-50 flex flex-col space-y-2 pointer-events-none',
        isMobile 
          ? 'top-4 left-0 right-0' 
          : 'top-4 right-4'
      )}
    >
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={onClose}
        />
      ))}
    </div>
  );
};

// Hook para manejar toasts
export const useToast = () => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const addToast = (toast: Omit<ToastProps, 'id' | 'onClose'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { ...toast, id, onClose: removeToast }]);
    return id;
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const clearToasts = () => {
    setToasts([]);
  };

  // Métodos de conveniencia
  const success = (message: string, options?: Partial<ToastProps>) => 
    addToast({ ...options, message, type: 'success' });

  const error = (message: string, options?: Partial<ToastProps>) => 
    addToast({ ...options, message, type: 'error' });

  const warning = (message: string, options?: Partial<ToastProps>) => 
    addToast({ ...options, message, type: 'warning' });

  const info = (message: string, options?: Partial<ToastProps>) => 
    addToast({ ...options, message, type: 'info' });

  return {
    toasts,
    addToast,
    removeToast,
    clearToasts,
    success,
    error,
    warning,
    info,
  };
};

// Componente provider para toasts
interface ToastProviderProps {
  children: React.ReactNode;
}

const ToastContext = React.createContext<ReturnType<typeof useToast> | null>(null);

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const toast = useToast();

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toast.toasts} onClose={toast.removeToast} />
    </ToastContext.Provider>
  );
};

export const useToastContext = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
};
