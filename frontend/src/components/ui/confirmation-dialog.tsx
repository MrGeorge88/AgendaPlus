import React from 'react';
import { AlertTriangle, Info, AlertCircle } from 'lucide-react';
import { Modal } from './modal';
import { Button } from './button';
import { cn } from '../../lib/utils';

export interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  loading?: boolean;
}

const typeConfig = {
  danger: {
    icon: AlertTriangle,
    iconColor: 'text-red-600',
    iconBg: 'bg-red-100',
    confirmVariant: 'destructive' as const,
  },
  warning: {
    icon: AlertCircle,
    iconColor: 'text-yellow-600',
    iconBg: 'bg-yellow-100',
    confirmVariant: 'default' as const,
  },
  info: {
    icon: Info,
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-100',
    confirmVariant: 'default' as const,
  },
};

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'info',
  loading = false,
}) => {
  const config = typeConfig[type];
  const Icon = config.icon;

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      size="sm"
      showCloseButton={false}
    >
      <div className="space-y-4">
        {/* Icono y título */}
        <div className="flex items-start space-x-4">
          <div className={cn(
            'flex-shrink-0 rounded-full p-3',
            config.iconBg
          )}>
            <Icon className={cn('h-6 w-6', config.iconColor)} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-900">
              {title}
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              {message}
            </p>
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-end space-x-3 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </Button>
          <Button
            variant={config.confirmVariant}
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? 'Procesando...' : confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationDialog;
