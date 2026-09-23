import { useSettings } from '../context/SettingsContext';
import { translations, TranslationKey } from '../i18n/translations';

export const useTranslation = () => {
  const { language } = useSettings();

  const t = (key: TranslationKey, params?: Record<string, string | number>): string => {
    let text = translations[language][key] || key;
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, String(v));
      });
    }
    return text;
  };

  return { t, language };
};
