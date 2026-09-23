import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { TranslationKey } from '../../i18n/translations';

interface PageHeaderProps {
  title: string;
  titleKey?: TranslationKey;
  subtitle?: string;
  subtitleKey?: TranslationKey;
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  titleKey, 
  subtitle, 
  subtitleKey, 
  actions 
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">
          {titleKey ? t(titleKey) : title}
        </h1>
        {(subtitleKey || subtitle) && (
          <p className="text-text-secondary text-sm mt-1">
            {subtitleKey ? t(subtitleKey) : subtitle}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-3">
          {actions}
        </div>
      )}
    </div>
  );
};
