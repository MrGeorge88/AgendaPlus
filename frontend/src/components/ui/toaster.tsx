import React, { useEffect, useState } from 'react';

interface ToastProps {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

interface ToasterContextType {
  toasts: ToastProps[];
  addToast: (toast: Omit<ToastProps, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToasterContext = React.createContext<ToasterContextType | undefined>(undefined);

export function ToasterProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const addToast = (toast: Omit<ToastProps, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);

    // Auto-remove toast after duration
    if (toast.duration !== 0) {
      setTimeout(() => {
        removeToast(id);
      }, toast.duration || 3000);
    }
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToasterContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <Toaster />
    </ToasterContext.Provider>
  );
}

export function useToaster() {
  const context = React.useContext(ToasterContext);
  if (context === undefined) {
    throw new Error('useToaster must be used within a ToasterProvider');
  }
  return context;
}

// Componente para mostrar los toasts
function Toaster() {
  const { toasts, removeToast } = useToaster();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

// Componente individual de toast
function Toast({ toast, onClose }: { toast: ToastProps; onClose: () => void }) {
  const { type, message } = toast;

  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    warning: 'bg-yellow-500',
  }[type];

  return (
    <div
      className={`${bgColor} text-white px-4 py-2 rounded shadow-lg flex justify-between items-center min-w-[300px]`}
    >
      <p>{message}</p>
      <button onClick={onClose} className="ml-4 text-white">
        ✕
      </button>
    </div>
  );
}

// Función para reemplazar sonner
export const toast = {
  success: (message: string) => {
    const context = React.useContext(ToasterContext);
    if (context) {
      context.addToast({ message, type: 'success' });
    } else {
      console.log('Success:', message);
    }
  },
  error: (message: string) => {
    const context = React.useContext(ToasterContext);
    if (context) {
      context.addToast({ message, type: 'error' });
    } else {
      console.error('Error:', message);
    }
  },
  info: (message: string) => {
    const context = React.useContext(ToasterContext);
    if (context) {
      context.addToast({ message, type: 'info' });
    } else {
      console.info('Info:', message);
    }
  },
  warning: (message: string) => {
    const context = React.useContext(ToasterContext);
    if (context) {
      context.addToast({ message, type: 'warning' });
    } else {
      console.warn('Warning:', message);
    }
  },
};
