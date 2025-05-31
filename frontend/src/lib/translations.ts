// Simple translation system without react-i18next dependency
import React from 'react';

export type Language = 'en' | 'es';

export const translations = {
  es: {
    // Landing page
    'landing.title': 'AgendaPlus',
    'landing.subtitle': 'Gestiona tus citas de manera profesional',
    'landing.getStarted': 'Comenzar',
    'landing.features.title': 'Características',
    'landing.features.calendar.title': 'Calendario inteligente',
    'landing.features.calendar.description': 'Gestiona tus citas con un calendario intuitivo y fácil de usar.',
    'landing.features.metrics.title': 'Métricas detalladas',
    'landing.features.metrics.description': 'Analiza el rendimiento de tu negocio con reportes completos.',
    'landing.features.payments.title': 'Gestión de pagos',
    'landing.features.payments.description': 'Controla ingresos, pagos y facturación en un solo lugar.',
    'landing.cta.title': '¿Listo para transformar tu negocio?',
    'landing.cta.subtitle': 'Únete a miles de profesionales que ya confían en AgendaPlus.',
    'landing.cta.button': 'Comenzar gratis',
    'landing.footer.subtitle': 'La plataforma todo-en-uno para profesionales.',
    'landing.footer.copyright': 'AgendaPlus. Todos los derechos reservados.',

    // Auth
    'auth.email': 'Correo electrónico',
    'auth.password': 'Contraseña',
    'auth.login': 'Iniciar Sesión',
    'auth.register': 'Registrarse',
    'auth.forgotPassword': '¿Olvidaste tu contraseña?',

    // Navigation
    'nav.agenda': 'Agenda',
    'nav.clients': 'Clientes',
    'nav.services': 'Servicios',
    'nav.staff': 'Personal',
    'nav.income': 'Ingresos',
    'nav.analytics': 'Analíticas',
    'nav.whatsapp': 'WhatsApp',
    'navigation.agenda': 'Agenda',
    'navigation.overview': 'Resumen',
    'navigation.analytics': 'Analytics',
    'navigation.clients': 'Clientes',
    'navigation.services': 'Servicios',
    'navigation.staff': 'Personal',
    'navigation.income': 'Ingresos',
    'navigation.expenses': 'Gastos',
    'navigation.whatsapp': 'WhatsApp',

    // Calendar
    'calendar.manageStaff': 'Gestionar Personal',
    'calendar.newAppointment': 'Nueva Cita',
    'calendar.today': 'Hoy',
    'calendar.day': 'Día',
    'calendar.week': 'Semana',
    'calendar.month': 'Mes',
    'calendar.status': 'Estado',
    'calendar.paymentStatus': 'Estado de Pago',
    'calendar.staff': 'Personal',
    'calendar.dateRange': 'Rango de Fechas',
    'calendar.priceRange': 'Rango de Precios',

    // Appointment Status
    'appointments.status.confirmed': 'Confirmada',
    'appointments.status.completed': 'Completada',
    'appointments.status.cancelled': 'Cancelada',
    'appointments.status.noShow': 'No se presentó',
    'appointments.status.pending': 'Pendiente',

    // Payment Status
    'calendar.paid': 'Pagado',
    'calendar.partial': 'Parcial',
    'calendar.pending': 'Pendiente',

    // Filters
    'Filtros': 'Filtros',
    'calendar.filters': 'Filtros',

    // Common
    'common.clear': 'Limpiar',
    'common.expand': 'Expandir',
    'common.collapse': 'Colapsar',
    'common.loading': 'Cargando...',
    'common.error': 'Error',
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
    'common.delete': 'Eliminar',
    'common.edit': 'Editar',
    'common.add': 'Agregar',
    'common.search': 'Buscar',
    'common.filter': 'Filtrar',
    'common.export': 'Exportar',
    'common.import': 'Importar',
    'common.settings': 'Configuración',
    'common.profile': 'Perfil',
    'common.logout': 'Cerrar Sesión',
    'common.yes': 'Sí',
    'common.no': 'No',
    'common.confirm': 'Confirmar',
    'common.close': 'Cerrar',

    // Pages
    'pages.dashboard': 'Panel de Control',
    'pages.clients': 'Clientes',
    'pages.services': 'Servicios',
    'pages.staff': 'Personal',
    'pages.income': 'Ingresos',
    'pages.analytics': 'Analytics',
    'pages.expenses': 'Gastos',

    // Dashboard
    'dashboard.totalRevenue': 'Ingresos Totales',
    'dashboard.totalAppointments': 'Citas Totales',
    'dashboard.totalClients': 'Clientes Totales',
    'dashboard.averageRevenue': 'Ingreso Promedio',
    'dashboard.revenueChart': 'Gráfico de Ingresos',
    'dashboard.appointmentsChart': 'Gráfico de Citas',
    'dashboard.topServices': 'Servicios Principales',
    'dashboard.staffPerformance': 'Rendimiento del Personal',

    // Clients
    'clients.title': 'Gestión de Clientes',
    'clients.addClient': 'Agregar Cliente',
    'clients.editClient': 'Editar Cliente',
    'clients.deleteClient': 'Eliminar Cliente',
    'clients.name': 'Nombre',
    'clients.email': 'Email',
    'clients.phone': 'Teléfono',
    'clients.notes': 'Notas',
    'clients.search': 'Buscar clientes...',
    'clients.noClients': 'No hay clientes registrados',

    // Services
    'services.title': 'Gestión de Servicios',
    'services.addService': 'Agregar Servicio',
    'services.editService': 'Editar Servicio',
    'services.deleteService': 'Eliminar Servicio',
    'services.name': 'Nombre del Servicio',
    'services.description': 'Descripción',
    'services.duration': 'Duración',
    'services.price': 'Precio',
    'services.category': 'Categoría',
    'services.noServices': 'No hay servicios registrados',

    // Staff
    'staff.title': 'Gestión de Personal',
    'staff.addStaff': 'Agregar Personal',
    'staff.editStaff': 'Editar Personal',
    'staff.deleteStaff': 'Eliminar Personal',
    'staff.name': 'Nombre',
    'staff.email': 'Email',
    'staff.phone': 'Teléfono',
    'staff.role': 'Rol',
    'staff.specialties': 'Especialidades',
    'staff.noStaff': 'No hay personal registrado',

    // Income
    'income.title': 'Gestión de Ingresos',
    'income.totalIncome': 'Ingresos Totales',
    'income.monthlyIncome': 'Ingresos Mensuales',
    'income.weeklyIncome': 'Ingresos Semanales',
    'income.dailyIncome': 'Ingresos Diarios',

    // Forms
    'forms.required': 'Este campo es obligatorio',
    'forms.invalidEmail': 'Email inválido',
    'forms.passwordTooShort': 'La contraseña debe tener al menos 6 caracteres',
    'forms.passwordsDoNotMatch': 'Las contraseñas no coinciden',
  },
  en: {
    // Landing page
    'landing.title': 'AgendaPlus',
    'landing.subtitle': 'Manage your appointments professionally',
    'landing.getStarted': 'Get Started',
    'landing.features.title': 'Features',
    'landing.features.calendar.title': 'Smart Calendar',
    'landing.features.calendar.description': 'Manage your appointments with an intuitive and easy-to-use calendar.',
    'landing.features.metrics.title': 'Detailed Metrics',
    'landing.features.metrics.description': 'Analyze your business performance with comprehensive reports.',
    'landing.features.payments.title': 'Payment Management',
    'landing.features.payments.description': 'Control income, payments and billing in one place.',
    'landing.cta.title': 'Ready to transform your business?',
    'landing.cta.subtitle': 'Join thousands of professionals who already trust AgendaPlus.',
    'landing.cta.button': 'Get Started Free',
    'landing.footer.subtitle': 'The all-in-one platform for professionals.',
    'landing.footer.copyright': 'AgendaPlus. All rights reserved.',

    // Auth
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.forgotPassword': 'Forgot your password?',

    // Navigation
    'nav.agenda': 'Agenda',
    'nav.clients': 'Clients',
    'nav.services': 'Services',
    'nav.staff': 'Staff',
    'nav.income': 'Income',
    'nav.analytics': 'Analytics',
    'nav.whatsapp': 'WhatsApp',
    'navigation.agenda': 'Agenda',
    'navigation.overview': 'Overview',
    'navigation.analytics': 'Analytics',
    'navigation.clients': 'Clients',
    'navigation.services': 'Services',
    'navigation.staff': 'Staff',
    'navigation.income': 'Income',
    'navigation.expenses': 'Expenses',
    'navigation.whatsapp': 'WhatsApp',

    // Calendar
    'calendar.manageStaff': 'Manage Staff',
    'calendar.newAppointment': 'New Appointment',
    'calendar.today': 'Today',
    'calendar.day': 'Day',
    'calendar.week': 'Week',
    'calendar.month': 'Month',
    'calendar.status': 'Status',
    'calendar.paymentStatus': 'Payment Status',
    'calendar.staff': 'Staff',
    'calendar.dateRange': 'Date Range',
    'calendar.priceRange': 'Price Range',

    // Appointment Status
    'appointments.status.confirmed': 'Confirmed',
    'appointments.status.completed': 'Completed',
    'appointments.status.cancelled': 'Cancelled',
    'appointments.status.noShow': 'No Show',
    'appointments.status.pending': 'Pending',

    // Payment Status
    'calendar.paid': 'Paid',
    'calendar.partial': 'Partial',
    'calendar.pending': 'Pending',

    // Filters
    'Filtros': 'Filters',
    'calendar.filters': 'Filters',

    // Common
    'common.clear': 'Clear',
    'common.expand': 'Expand',
    'common.collapse': 'Collapse',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.add': 'Add',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.export': 'Export',
    'common.import': 'Import',
    'common.settings': 'Settings',
    'common.profile': 'Profile',
    'common.logout': 'Logout',
    'common.yes': 'Yes',
    'common.no': 'No',
    'common.confirm': 'Confirm',
    'common.close': 'Close',

    // Pages
    'pages.dashboard': 'Dashboard',
    'pages.clients': 'Clients',
    'pages.services': 'Services',
    'pages.staff': 'Staff',
    'pages.income': 'Income',
    'pages.analytics': 'Analytics',
    'pages.expenses': 'Expenses',

    // Dashboard
    'dashboard.totalRevenue': 'Total Revenue',
    'dashboard.totalAppointments': 'Total Appointments',
    'dashboard.totalClients': 'Total Clients',
    'dashboard.averageRevenue': 'Average Revenue',
    'dashboard.revenueChart': 'Revenue Chart',
    'dashboard.appointmentsChart': 'Appointments Chart',
    'dashboard.topServices': 'Top Services',
    'dashboard.staffPerformance': 'Staff Performance',

    // Clients
    'clients.title': 'Client Management',
    'clients.addClient': 'Add Client',
    'clients.editClient': 'Edit Client',
    'clients.deleteClient': 'Delete Client',
    'clients.name': 'Name',
    'clients.email': 'Email',
    'clients.phone': 'Phone',
    'clients.notes': 'Notes',
    'clients.search': 'Search clients...',
    'clients.noClients': 'No clients registered',

    // Services
    'services.title': 'Service Management',
    'services.addService': 'Add Service',
    'services.editService': 'Edit Service',
    'services.deleteService': 'Delete Service',
    'services.name': 'Service Name',
    'services.description': 'Description',
    'services.duration': 'Duration',
    'services.price': 'Price',
    'services.category': 'Category',
    'services.noServices': 'No services registered',

    // Staff
    'staff.title': 'Staff Management',
    'staff.addStaff': 'Add Staff',
    'staff.editStaff': 'Edit Staff',
    'staff.deleteStaff': 'Delete Staff',
    'staff.name': 'Name',
    'staff.email': 'Email',
    'staff.phone': 'Phone',
    'staff.role': 'Role',
    'staff.specialties': 'Specialties',
    'staff.noStaff': 'No staff registered',

    // Income
    'income.title': 'Income Management',
    'income.totalIncome': 'Total Income',
    'income.monthlyIncome': 'Monthly Income',
    'income.weeklyIncome': 'Weekly Income',
    'income.dailyIncome': 'Daily Income',

    // Forms
    'forms.required': 'This field is required',
    'forms.invalidEmail': 'Invalid email',
    'forms.passwordTooShort': 'Password must be at least 6 characters',
    'forms.passwordsDoNotMatch': 'Passwords do not match',
  }
};

class SimpleTranslationManager {
  private currentLanguage: Language = 'es';

  constructor() {
    // Load language from localStorage (only in browser)
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('agenda-plus-language') as Language;
      if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'es')) {
        this.currentLanguage = savedLanguage;
      }
    }
  }

  getCurrentLanguage(): Language {
    return this.currentLanguage;
  }

  setLanguage(language: Language): void {
    this.currentLanguage = language;
    // Save to localStorage (only in browser)
    if (typeof window !== 'undefined') {
      localStorage.setItem('agenda-plus-language', language);
      // Trigger a custom event to notify components of language change
      window.dispatchEvent(new CustomEvent('languageChanged', { detail: language }));
    }
  }

  translate(key: string, fallback?: string): string {
    const translation = translations[this.currentLanguage]?.[key];
    return translation || fallback || key;
  }

  // Alias for translate
  t(key: string, fallback?: string): string {
    return this.translate(key, fallback);
  }
}

// Create a singleton instance
export const translationManager = new SimpleTranslationManager();

// Export a hook-like function for React components
export function useSimpleTranslation() {
  const [language, setLanguageState] = React.useState(translationManager.getCurrentLanguage());

  React.useEffect(() => {
    const handleLanguageChange = (event: CustomEvent) => {
      setLanguageState(event.detail);
    };

    // Only add event listeners in browser
    if (typeof window !== 'undefined') {
      window.addEventListener('languageChanged', handleLanguageChange as EventListener);
      return () => {
        window.removeEventListener('languageChanged', handleLanguageChange as EventListener);
      };
    }
  }, []);

  const setLanguage = (newLanguage: Language) => {
    translationManager.setLanguage(newLanguage);
  };

  const t = (key: string, fallback?: string) => {
    return translationManager.translate(key, fallback);
  };

  return {
    language,
    setLanguage,
    t,
    ready: true // Always ready
  };
}

// For compatibility with existing code
export { useSimpleTranslation as useSafeTranslation };
export { useSimpleTranslation as useTranslation };

// Also export as useLanguage for backward compatibility
export function useLanguage() {
  const { language, setLanguage, t } = useSimpleTranslation();
  return { language, setLanguage, t };
}
