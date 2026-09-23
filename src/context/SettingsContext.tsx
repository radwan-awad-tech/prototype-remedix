import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'ar';

export interface ThemePreset {
  id: string;
  name: string;
  start: string;
  end: string;
}

export const THEME_PRESETS: ThemePreset[] = [
  { id: 'medical', name: 'REMEDIX Core', start: '#004D4D', end: '#14B8A6' },
  { id: 'sky', name: 'Digital Teal', start: '#0F766E', end: '#2DD4BF' },
  { id: 'royal', name: 'Deep Ocean', start: '#003B49', end: '#14B8A6' },
  { id: 'teal', name: 'Aqua Signal', start: '#006B68', end: '#5EEAD4' },
  { id: 'sunset', name: 'Warm Contrast', start: '#115E59', end: '#F59E0B' },
  { id: 'forest', name: 'Clinical Green', start: '#065F46', end: '#14B8A6' },
  { id: 'indigo', name: 'Night Interface', start: '#111827', end: '#14B8A6' },
  { id: 'berry', name: 'Teal Violet', start: '#164E63', end: '#A78BFA' },
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
