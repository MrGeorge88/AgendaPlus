import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enTranslation from './locales/en.json';
import esTranslation from './locales/es.json';

// Configure i18n but don't initialize yet
i18n
  .use(LanguageDetector)
  .use(initReactI18next);

// Export the configuration for initialization
export const i18nConfig = {
  resources: {
    en: {
      translation: enTranslation
    },
    es: {
      translation: esTranslation
    }
  },
  fallbackLng: 'es',
  lng: 'es', // Set default language to Spanish
  debug: process.env.NODE_ENV === 'development',
  interpolation: {
    escapeValue: false // React already escapes values
  },
  detection: {
    order: ['localStorage', 'navigator'],
    caches: ['localStorage']
  },
  react: {
    useSuspense: false // Disable suspense to avoid hydration issues
  }
};

export default i18n;
