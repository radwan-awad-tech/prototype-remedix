import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'ar';

export interface ThemePreset {
  id: string;
  name: string;
  start: string;
  end: string;
}

export const THEME_PRESETS: ThemePreset[] = [
  { id: 'medical', name: 'Medical Green-Blue', start: '#4ED1B2', end: '#5B8CFF' },
  { id: 'sky', name: 'Light Sky Blue', start: '#6ABFF3', end: '#8FD3FF' },
  { id: 'royal', name: 'Royal Blue', start: '#6985FF', end: '#3F5BFF' },
  { id: 'teal', name: 'Teal', start: '#2DD4BF', end: '#60A5FA' },
  { id: 'sunset', name: 'Sunset Orange', start: '#F59E0B', end: '#EF4444' },
  { id: 'forest', name: 'Forest Green', start: '#10B981', end: '#059669' },
  { id: 'indigo', name: 'Indigo Purple', start: '#6366F1', end: '#4F46E5' },
  { id: 'berry', name: 'Berry Rose', start: '#EC4899', end: '#8B5CF6' },
];

interface SettingsContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: ThemePreset;
  setTheme: (theme: ThemePreset) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('medistaff_language');
    return (saved as Language) || 'en';
  });

  const [theme, setTheme] = useState<ThemePreset>(() => {
    const savedId = localStorage.getItem('medistaff_theme_id');
    return THEME_PRESETS.find(p => p.id === savedId) || THEME_PRESETS[0];
  });

  useEffect(() => {
    localStorage.setItem('medistaff_language', language);
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    localStorage.setItem('medistaff_theme_id', theme.id);
    document.documentElement.style.setProperty('--primary-gradient-start', theme.start);
    document.documentElement.style.setProperty('--primary-gradient-end', theme.end);
  }, [theme]);

  return (
    <SettingsContext.Provider value={{ language, setLanguage, theme, setTheme }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
