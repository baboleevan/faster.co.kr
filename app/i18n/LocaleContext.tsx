'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Locale = 
  | 'ko' 
  | 'en' 
  | 'zh' 
  | 'es' 
  | 'hi' 
  | 'bn' 
  | 'pt' 
  | 'fr' 
  | 'de' 
  | 'vi' 
  | 'ta' 
  | 'yue' 
  | 'ur' 
  | 'ar';

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>('ko');

  useEffect(() => {
    // 브라우저 언어 설정 확인
    const browserLang = navigator.language.split('-')[0];
    const storedLocale = localStorage.getItem('locale');
    
    if (storedLocale && isValidLocale(storedLocale)) {
      setLocale(storedLocale as Locale);
    } else if (isValidLocale(browserLang)) {
      setLocale(browserLang as Locale);
    }
  }, []);

  const handleSetLocale = (newLocale: Locale) => {
    setLocale(newLocale);
    localStorage.setItem('locale', newLocale);
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale: handleSetLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
}

function isValidLocale(locale: string): locale is Locale {
  return ['ko', 'en', 'zh', 'es', 'hi', 'bn', 'pt', 'fr', 'de', 'vi', 'ta', 'yue', 'ur', 'ar'].includes(locale);
} 