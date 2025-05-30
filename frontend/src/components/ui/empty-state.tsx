import React from 'react';
import { Button } from './button';
import { 
  Users, 
  Calendar, 
  Briefcase, 
  DollarSign, 
  FileText, 
  Search,
  Plus,
  AlertCircle,
  Inbox,
  UserPlus,
  Settings,
  Clock,
  TrendingUp
} from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'secondary';
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  secondaryAction,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
      <div className="mb-4 rounded-full bg-slate-100 p-6 dark:bg-slate-800">
        {icon || <Inbox className="h-12 w-12 text-slate-400" />}
      </div>
      
      <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
        {title}
      </h3>
      
      <p className="mb-6 max-w-md text-sm text-slate-500 dark:text-slate-400">
        {description}
      </p>
      
      <div className="flex flex-col gap-2 sm:flex-row">
        {action && (
          <Button 
            onClick={action.onClick}
            variant={action.variant || 'default'}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            {action.label}
          </Button>
        )}
        
        {secondaryAction && (
          <Button 
            onClick={secondaryAction.onClick}
            variant="outline"
            className="flex items-center gap-2"
          >
            {secondaryAction.label}
          </Button>
        )}
      </div>
    </div>
  );
};

// Estados vacíos específicos para cada sección
export const EmptyClients: React.FC<{
  onAddClient: () => void;
  onImportClients?: () => void;
}> = ({ onAddClient, onImportClients }) => (
  <EmptyState
    icon={<Users className="h-12 w-12 text-slate-400" />}
    title="No tienes clientes aún"
    description="Comienza agregando tu primer cliente para gestionar sus citas y información de contacto."
    action={{
      label: 'Agregar primer cliente',
      onClick: onAddClient
    }}
    secondaryAction={onImportClients ? {
      label: 'Importar clientes',
      onClick: onImportClients
    } : undefined}
  />
);

export const EmptyServices: React.FC<{
  onAddService: () => void;
  onViewTemplates?: () => void;
}> = ({ onAddService, onViewTemplates }) => (
  <EmptyState
    icon={<Briefcase className="h-12 w-12 text-slate-400" />}
    title="No tienes servicios configurados"
    description="Define los servicios que ofreces, sus precios y duración para poder programar citas."
    action={{
      label: 'Crear primer servicio',
      onClick: onAddService
    }}
    secondaryAction={onViewTemplates ? {
      label: 'Ver plantillas',
      onClick: onViewTemplates
    } : undefined}
  />
);

export const EmptyStaff: React.FC<{
  onAddStaff: () => void;
  onInviteStaff?: () => void;
}> = ({ onAddStaff, onInviteStaff }) => (
  <EmptyState
    icon={<UserPlus className="h-12 w-12 text-slate-400" />}
    title="No tienes personal registrado"
    description="Agrega miembros de tu equipo para asignarles citas y gestionar sus horarios."
    action={{
      label: 'Agregar personal',
      onClick: onAddStaff
    }}
    secondaryAction={onInviteStaff ? {
      label: 'Invitar por email',
      onClick: onInviteStaff
    } : undefined}
  />
);

export const EmptyAppointments: React.FC<{
  onCreateAppointment: () => void;
  onViewCalendar?: () => void;
}> = ({ onCreateAppointment, onViewCalendar }) => (
  <EmptyState
    icon={<Calendar className="h-12 w-12 text-slate-400" />}
    title="No hay citas programadas"
    description="Programa tu primera cita para comenzar a gestionar tu agenda y clientes."
    action={{
      label: 'Programar primera cita',
      onClick: onCreateAppointment
    }}
    secondaryAction={onViewCalendar ? {
      label: 'Ver calendario',
      onClick: onViewCalendar
    } : undefined}
  />
);

export const EmptyIncome: React.FC<{
  onCreateAppointment?: () => void;
  onViewReports?: () => void;
}> = ({ onCreateAppointment, onViewReports }) => (
  <EmptyState
    icon={<DollarSign className="h-12 w-12 text-slate-400" />}
    title="No hay ingresos registrados"
    description="Completa algunas citas para comenzar a ver tus métricas de ingresos y rendimiento."
    action={onCreateAppointment ? {
      label: 'Programar cita',
      onClick: onCreateAppointment
    } : undefined}
    secondaryAction={onViewReports ? {
      label: 'Ver reportes',
      onClick: onViewReports
    } : undefined}
  />
);

export const EmptyExpenses: React.FC<{
  onAddExpense: () => void;
  onViewCategories?: () => void;
}> = ({ onAddExpense, onViewCategories }) => (
  <EmptyState
    icon={<FileText className="h-12 w-12 text-slate-400" />}
    title="No hay gastos registrados"
    description="Registra tus gastos para tener un control completo de la rentabilidad de tu negocio."
    action={{
      label: 'Registrar primer gasto',
      onClick: onAddExpense
    }}
    secondaryAction={onViewCategories ? {
      label: 'Ver categorías',
      onClick: onViewCategories
    } : undefined}
  />
);

export const EmptySearchResults: React.FC<{
  searchTerm: string;
  onClearSearch: () => void;
  onCreateNew?: () => void;
  entityName?: string;
}> = ({ searchTerm, onClearSearch, onCreateNew, entityName = 'elemento' }) => (
  <EmptyState
    icon={<Search className="h-12 w-12 text-slate-400" />}
    title={`No se encontraron resultados para "${searchTerm}"`}
    description={`No hay ${entityName}s que coincidan con tu búsqueda. Intenta con otros términos o crea uno nuevo.`}
    action={onCreateNew ? {
      label: `Crear ${entityName}`,
      onClick: onCreateNew
    } : undefined}
    secondaryAction={{
      label: 'Limpiar búsqueda',
      onClick: onClearSearch
    }}
  />
);

export const EmptyDashboard: React.FC<{
  onQuickStart: () => void;
  onViewTutorial?: () => void;
}> = ({ onQuickStart, onViewTutorial }) => (
  <EmptyState
    icon={<TrendingUp className="h-12 w-12 text-slate-400" />}
    title="¡Bienvenido a AgendaPlus!"
    description="Configura tu negocio agregando servicios, personal y clientes para comenzar a gestionar tus citas."
    action={{
      label: 'Configuración rápida',
      onClick: onQuickStart
    }}
    secondaryAction={onViewTutorial ? {
      label: 'Ver tutorial',
      onClick: onViewTutorial
    } : undefined}
  />
);

export const EmptyCalendar: React.FC<{
  onCreateAppointment: () => void;
  onChangeView?: () => void;
  selectedDate?: string;
}> = ({ onCreateAppointment, onChangeView, selectedDate }) => (
  <EmptyState
    icon={<Clock className="h-12 w-12 text-slate-400" />}
    title={selectedDate ? `No hay citas para ${selectedDate}` : 'No hay citas en este período'}
    description="Este día está libre. ¿Quieres programar una nueva cita?"
    action={{
      label: 'Programar cita',
      onClick: onCreateAppointment
    }}
    secondaryAction={onChangeView ? {
      label: 'Cambiar vista',
      onClick: onChangeView
    } : undefined}
  />
);

export const EmptyError: React.FC<{
  onRetry: () => void;
  onGoBack?: () => void;
  errorMessage?: string;
}> = ({ onRetry, onGoBack, errorMessage }) => (
  <EmptyState
    icon={<AlertCircle className="h-12 w-12 text-red-400" />}
    title="Algo salió mal"
    description={errorMessage || 'Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo.'}
    action={{
      label: 'Reintentar',
      onClick: onRetry,
      variant: 'default'
    }}
    secondaryAction={onGoBack ? {
      label: 'Volver',
      onClick: onGoBack
    } : undefined}
  />
);

// Hook para determinar qué estado vacío mostrar
export const useEmptyState = (
  items: any[],
  loading: boolean,
  error: string | null,
  searchTerm: string = ''
) => {
  if (loading) return null;
  if (error) return 'error';
  if (searchTerm && items.length === 0) return 'search';
  if (items.length === 0) return 'empty';
  return null;
};
