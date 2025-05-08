import React from 'react';
import { useLanguage, Language } from '../../contexts/language-context';
import { Button } from './button';
import { Globe } from 'lucide-react';

interface LanguageSwitcherProps {
  variant?: 'default' | 'minimal';
}

export function LanguageSwitcher({ variant = 'default' }: LanguageSwitcherProps) {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    const newLanguage: Language = language === 'en' ? 'es' : 'en';
    setLanguage(newLanguage);
  };

  if (variant === 'minimal') {
    return (
      <button
        onClick={toggleLanguage}
        className="flex items-center text-sm font-medium text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-slate-300"
      >
        <Globe className="mr-1 h-4 w-4" />
        <span className="uppercase">{language}</span>
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={language === 'en' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setLanguage('en')}
        className="w-12"
      >
        EN
      </Button>
      <Button
        variant={language === 'es' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setLanguage('es')}
        className="w-12"
      >
        ES
      </Button>
    </div>
  );
}
