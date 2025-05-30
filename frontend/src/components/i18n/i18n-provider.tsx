import React, { useState, useEffect, ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n, { i18nConfig } from '../../i18n';

interface I18nProviderProps {
  children: ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Initialize i18n and wait for it to be ready
    const initializeI18n = async () => {
      try {
        if (!i18n.isInitialized) {
          await i18n.init(i18nConfig);
        }
        setIsReady(true);
      } catch (error) {
        console.error('Error initializing i18n:', error);
        // Even if there's an error, we'll continue to avoid blocking the app
        setIsReady(true);
      }
    };

    initializeI18n();
  }, []);

  // Show loading while i18n is initializing
  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Cargando AgendaPlus...</p>
        </div>
      </div>
    );
  }

  return (
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  );
}
