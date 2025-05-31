import { useState, useCallback } from 'react';
import { useLanguage } from '../contexts/language-context';

export interface ConfirmationOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

export interface ConfirmationState {
  isOpen: boolean;
  options: ConfirmationOptions | null;
  onConfirm: (() => void) | null;
  onCancel: (() => void) | null;
}

export const useConfirmation = () => {
  const { t } = useLanguage();
  const [state, setState] = useState<ConfirmationState>({
    isOpen: false,
    options: null,
    onConfirm: null,
    onCancel: null,
  });

  const confirm = useCallback((
    options: ConfirmationOptions,
    onConfirm?: () => void,
    onCancel?: () => void
  ): Promise<boolean> => {
    return new Promise((resolve) => {
      setState({
        isOpen: true,
        options: {
          confirmText: t('buttons.actions.confirm'),
          cancelText: t('buttons.actions.cancel'),
          type: 'info',
          ...options,
        },
        onConfirm: () => {
          onConfirm?.();
          resolve(true);
          setState(prev => ({ ...prev, isOpen: false }));
        },
        onCancel: () => {
          onCancel?.();
          resolve(false);
          setState(prev => ({ ...prev, isOpen: false }));
        },
      });
    });
  }, []);

  const close = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: false }));
  }, []);

  return {
    ...state,
    confirm,
    close,
  };
};

// Hook específico para confirmaciones de eliminación
export const useDeleteConfirmation = () => {
  const confirmation = useConfirmation();

  const confirmDelete = useCallback((
    itemName: string,
    onConfirm?: () => void
  ): Promise<boolean> => {
    return confirmation.confirm(
      {
        title: t('modal.confirmDelete'),
        message: `¿Estás seguro de que quieres eliminar "${itemName}"? Esta acción no se puede deshacer.`,
        confirmText: t('buttons.actions.delete'),
        cancelText: t('buttons.actions.cancel'),
        type: 'danger',
      },
      onConfirm
    );
  }, [confirmation]);

  return {
    ...confirmation,
    confirmDelete,
  };
};
