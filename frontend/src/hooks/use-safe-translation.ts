import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

// Fallback translations for critical UI elements
const fallbackTranslations: Record<string, Record<string, string>> = {
  es: {
    'landing.title': 'AgendaPlus',
    'landing.subtitle': 'Gestiona tus citas de manera profesional',
    'landing.getStarted': 'Comenzar',
    'landing.login': 'Iniciar Sesión',
    'landing.register': 'Registrarse',
    'common.loading': 'Cargando...',
    'common.error': 'Error',
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
    'common.delete': 'Eliminar',
    'common.edit': 'Editar',
    'auth.email': 'Correo electrónico',
    'auth.password': 'Contraseña',
    'auth.login': 'Iniciar Sesión',
    'auth.register': 'Registrarse',
    'auth.forgotPassword': '¿Olvidaste tu contraseña?',
    'nav.agenda': 'Agenda',
    'nav.clients': 'Clientes',
    'nav.services': 'Servicios',
    'nav.staff': 'Personal',
    'nav.income': 'Ingresos',
    'nav.analytics': 'Analíticas',
    'nav.whatsapp': 'WhatsApp'
  },
  en: {
    'landing.title': 'AgendaPlus',
    'landing.subtitle': 'Manage your appointments professionally',
    'landing.getStarted': 'Get Started',
    'landing.login': 'Login',
    'landing.register': 'Register',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.forgotPassword': 'Forgot your password?',
    'nav.agenda': 'Agenda',
    'nav.clients': 'Clients',
    'nav.services': 'Services',
    'nav.staff': 'Staff',
    'nav.income': 'Income',
    'nav.analytics': 'Analytics',
    'nav.whatsapp': 'WhatsApp'
  }
};

export function useSafeTranslation() {
  let t: (key: string) => string;
  let i18n: any;
  let ready = false;

  try {
    const translation = useTranslation();
    t = translation.t;
    i18n = translation.i18n;
    ready = translation.ready;
  } catch (error) {
    console.warn('useTranslation hook failed, using fallback translations');
    // Fallback implementation
    t = (key: string) => {
      const currentLang = localStorage.getItem('agenda-plus-language') || 'es';
      return fallbackTranslations[currentLang]?.[key] || key;
    };
    i18n = {
      language: localStorage.getItem('agenda-plus-language') || 'es',
      changeLanguage: (lang: string) => {
        localStorage.setItem('agenda-plus-language', lang);
        window.location.reload(); // Simple reload to apply language change
      }
    };
    ready = true;
  }

  const getText = useCallback((key: string, fallback?: string) => {
    if (!ready && fallback) return fallback;
    const translation = t(key);
    return translation === key && fallback ? fallback : translation;
  }, [t, ready]);

  return {
    t: getText,
    i18n,
    ready
  };
}
