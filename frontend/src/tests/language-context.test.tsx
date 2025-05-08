import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LanguageProvider, useLanguage } from '../contexts/language-context';
import React from 'react';

// Mock component that uses the language context
function TestComponent() {
  const { language, setLanguage, t } = useLanguage();
  
  return (
    <div>
      <div data-testid="current-language">{language}</div>
      <div data-testid="translated-text">{t('common.save')}</div>
      <button 
        data-testid="toggle-language" 
        onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
      >
        Toggle Language
      </button>
    </div>
  );
}

describe('LanguageContext', () => {
  // Mock localStorage
  const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
      getItem: vi.fn((key: string) => store[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        store[key] = value.toString();
      }),
      clear: vi.fn(() => {
        store = {};
      })
    };
  })();

  // Replace the real localStorage with our mock
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
  });

  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('should use default language (en) when no language is stored', () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );

    expect(screen.getByTestId('current-language').textContent).toBe('en');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('agenda-plus-language', 'en');
  });

  it('should use stored language when available', () => {
    localStorageMock.getItem.mockReturnValueOnce('es');
    
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );

    expect(screen.getByTestId('current-language').textContent).toBe('es');
  });

  it('should change language when setLanguage is called', () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );

    // Initial language should be 'en'
    expect(screen.getByTestId('current-language').textContent).toBe('en');
    
    // Toggle language to 'es'
    fireEvent.click(screen.getByTestId('toggle-language'));
    
    // Language should now be 'es'
    expect(screen.getByTestId('current-language').textContent).toBe('es');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('agenda-plus-language', 'es');
  });

  it('should translate text based on current language', () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );

    // Initial translation in English
    expect(screen.getByTestId('translated-text').textContent).toBe('Save');
    
    // Toggle language to Spanish
    fireEvent.click(screen.getByTestId('toggle-language'));
    
    // Translation should now be in Spanish
    expect(screen.getByTestId('translated-text').textContent).toBe('Guardar');
  });
});
