import { useSettings } from '../context/SettingsContext';
import { interpolateTranslation, translations, TranslationKey } from '../i18n/translations';

export const useTranslation = () => {
  const { language } = useSettings();

  const t = (key: TranslationKey, params?: Record<string, string | number>): string => {
    return interpolateTranslation(translations[language][key] || key, params);
  };

  return { t, language };
};
