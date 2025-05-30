import { useCallback } from 'react';
import { toast } from 'sonner';

// Tipos para las notificaciones
export interface NotificationOptions {
  duration?: number;
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  action?: {
    label: string;
    onClick: () => void;
  };
  description?: string;
  important?: boolean;
}

export interface LoadingToastOptions {
  loadingMessage: string;
  successMessage: string;
  errorMessage: string;
}

/**
 * Hook para manejar notificaciones de manera consistente usando Sonner
 */
export const useNotifications = () => {

  const showSuccess = useCallback((message: string, options?: NotificationOptions) => {
    return toast.success(message, {
      duration: options?.duration || 4000,
      description: options?.description,
      action: options?.action ? {
        label: options.action.label,
        onClick: options.action.onClick
      } : undefined,
      important: options?.important
    });
  }, []);

  const showError = useCallback((message: string, options?: NotificationOptions) => {
    return toast.error(message, {
      duration: options?.duration || 6000,
      description: options?.description,
      action: options?.action ? {
        label: options.action.label,
        onClick: options.action.onClick
      } : undefined,
      important: options?.important
    });
  }, []);

  const showWarning = useCallback((message: string, options?: NotificationOptions) => {
    return toast.warning(message, {
      duration: options?.duration || 5000,
      description: options?.description,
      action: options?.action ? {
        label: options.action.label,
        onClick: options.action.onClick
      } : undefined,
      important: options?.important
    });
  }, []);

  const showInfo = useCallback((message: string, options?: NotificationOptions) => {
    return toast.info(message, {
      duration: options?.duration || 4000,
      description: options?.description,
      action: options?.action ? {
        label: options.action.label,
        onClick: options.action.onClick
      } : undefined,
      important: options?.important
    });
  }, []);

  const showLoading = useCallback((message: string) => {
    return toast.loading(message);
  }, []);

  const dismissLoading = useCallback((toastId: string | number) => {
    toast.dismiss(toastId);
  }, []);

  const showPromise = useCallback(async <T>(
    promise: Promise<T>,
    options: LoadingToastOptions
  ): Promise<T> => {
    return toast.promise(promise, {
      loading: options.loadingMessage,
      success: options.successMessage,
      error: (error) => {
        return error instanceof Error ? error.message : options.errorMessage;
      }
    });
  }, []);

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showLoading,
    dismissLoading,
    showPromise
  };
};

/**
 * Hook para notificaciones específicas de operaciones CRUD
 */
export const useCrudNotifications = (entityName: string) => {
  const { showSuccess, showError, showPromise } = useNotifications();

  const notifyCreate = useCallback((name?: string) => {
    showSuccess(`${entityName} ${name ? `"${name}"` : ''} creado exitosamente`);
  }, [showSuccess, entityName]);

  const notifyUpdate = useCallback((name?: string) => {
    showSuccess(`${entityName} ${name ? `"${name}"` : ''} actualizado exitosamente`);
  }, [showSuccess, entityName]);

  const notifyDelete = useCallback((name?: string) => {
    showSuccess(`${entityName} ${name ? `"${name}"` : ''} eliminado exitosamente`);
  }, [showSuccess, entityName]);

  const notifyError = useCallback((operation: 'crear' | 'actualizar' | 'eliminar' | 'cargar', error?: string) => {
    const message = error || `Error al ${operation} ${entityName.toLowerCase()}`;
    showError(message);
  }, [showError, entityName]);

  const executeWithNotification = useCallback(async <T>(
    operation: () => Promise<T>,
    operationType: 'crear' | 'actualizar' | 'eliminar',
    itemName?: string
  ): Promise<T> => {
    return showPromise(operation(), {
      loadingMessage: `${operationType === 'crear' ? 'Creando' : operationType === 'actualizar' ? 'Actualizando' : 'Eliminando'} ${entityName.toLowerCase()}...`,
      successMessage: `${entityName} ${itemName ? `"${itemName}"` : ''} ${operationType === 'crear' ? 'creado' : operationType === 'actualizar' ? 'actualizado' : 'eliminado'} exitosamente`,
      errorMessage: `Error al ${operationType} ${entityName.toLowerCase()}`
    });
  }, [showPromise, entityName]);

  return {
    notifyCreate,
    notifyUpdate,
    notifyDelete,
    notifyError,
    executeWithNotification
  };
};

/**
 * Hook para notificaciones de validación de formularios
 */
export const useFormNotifications = () => {
  const { showError, showWarning } = useNotifications();

  const notifyValidationError = useCallback((field: string, message: string) => {
    showError(`Error en ${field}: ${message}`);
  }, [showError]);

  const notifyFormError = useCallback((message: string = 'Por favor, revisa los campos del formulario') => {
    showError(message);
  }, [showError]);

  const notifyUnsavedChanges = useCallback(() => {
    showWarning('Tienes cambios sin guardar. ¿Estás seguro de que quieres salir?');
  }, [showWarning]);

  const notifyRequiredFields = useCallback((fields: string[]) => {
    const fieldList = fields.join(', ');
    showError(`Los siguientes campos son obligatorios: ${fieldList}`);
  }, [showError]);

  return {
    notifyValidationError,
    notifyFormError,
    notifyUnsavedChanges,
    notifyRequiredFields
  };
};

/**
 * Hook para notificaciones de conexión y sincronización
 */
export const useConnectionNotifications = () => {
  const { showError, showSuccess, showWarning, showInfo } = useNotifications();

  const notifyConnectionError = useCallback(() => {
    showError('Error de conexión. Verifica tu conexión a internet.');
  }, [showError]);

  const notifyConnectionRestored = useCallback(() => {
    showSuccess('Conexión restaurada');
  }, [showSuccess]);

  const notifyOfflineMode = useCallback(() => {
    showWarning('Trabajando en modo offline. Los cambios se sincronizarán cuando se restaure la conexión.');
  }, [showWarning]);

  const notifySyncInProgress = useCallback(() => {
    showInfo('Sincronizando datos...');
  }, [showInfo]);

  const notifySyncComplete = useCallback(() => {
    showSuccess('Datos sincronizados correctamente');
  }, [showSuccess]);

  const notifySyncError = useCallback(() => {
    showError('Error al sincronizar datos. Inténtalo de nuevo.');
  }, [showError]);

  return {
    notifyConnectionError,
    notifyConnectionRestored,
    notifyOfflineMode,
    notifySyncInProgress,
    notifySyncComplete,
    notifySyncError
  };
};
