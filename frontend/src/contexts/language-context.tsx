import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { translations, Language } from '../lib/translations';

// Define the context type
interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
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
  defaultLanguage = 'es',
  storageKey = 'agenda-plus-language',
  ...props
}: LanguageProviderProps) {
  // Get the stored language or use the default - safe initialization
  const [language, setLanguageState] = useState<Language>(defaultLanguage);

  // Translation function
  const t = (key: string): string => {
    return translations[language]?.[key] || key;
  };

  // Update the language when it changes
  const setLanguage = (newLanguage: Language) => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(storageKey, newLanguage);
      }
      setLanguageState(newLanguage);

      // Dispatch custom event for language change
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('languageChange', {
          detail: { language: newLanguage }
        }));
      }
    } catch (error) {
      console.warn('Error setting language:', error);
      setLanguageState(newLanguage);
    }
  };

  // Initialize the language on mount - safe for SSR
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const storedLanguage = localStorage.getItem(storageKey) as Language;
        const targetLanguage = storedLanguage || defaultLanguage;

        if (!storedLanguage) {
          localStorage.setItem(storageKey, defaultLanguage);
        }

        setLanguageState(targetLanguage);
      }
    } catch (error) {
      console.warn('Error initializing language from localStorage:', error);
      setLanguageState(defaultLanguage);
    }
  }, [defaultLanguage, storageKey]);

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

// Export Language type for compatibility
export type { Language };
