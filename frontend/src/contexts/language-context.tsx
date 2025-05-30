import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';

// Define supported languages
export type Language = 'en' | 'es';

// Define the context type
interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, options?: object) => string;
}

// Create the context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Define props for the provider
interface LanguageProviderProps {
  children: ReactNode;
  defaultLanguage?: Language;
  storageKey?: string;
}

// Create the provider component
export function LanguageProvider({
  children,
  defaultLanguage = 'es', // Changed default to Spanish
  storageKey = 'agenda-plus-language',
  ...props
}: LanguageProviderProps) {
  // Get the stored language or use the default
  const [language, setLanguageState] = useState<Language>(
    () => (localStorage.getItem(storageKey) as Language) || defaultLanguage
  );

  // Get the translation function from i18next
  const { t, i18n: i18nInstance } = useTranslation();

  // Update the language when it changes
  const setLanguage = (newLanguage: Language) => {
    localStorage.setItem(storageKey, newLanguage);
    i18nInstance.changeLanguage(newLanguage);
    setLanguageState(newLanguage);
  };

  // Initialize the language on mount
  useEffect(() => {
    const storedLanguage = localStorage.getItem(storageKey) as Language;
    const targetLanguage = storedLanguage || defaultLanguage;

    if (i18nInstance.language !== targetLanguage) {
      i18nInstance.changeLanguage(targetLanguage);
    }

    if (!storedLanguage) {
      localStorage.setItem(storageKey, defaultLanguage);
    }

    setLanguageState(targetLanguage);
  }, [defaultLanguage, storageKey, i18nInstance]);

  // Create the context value
  const value = {
    language,
    setLanguage,
    t
  };

  return (
    <LanguageContext.Provider {...props} value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

// Create a hook to use the language context
export function useLanguage() {
  const context = useContext(LanguageContext);

  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }

  return context;
}
