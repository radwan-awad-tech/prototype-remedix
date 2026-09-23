import React, { useMemo } from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { NAV_ITEMS } from '../../constants/navigation';
import { NavItem } from '../../types';
import { TranslationKey } from '../../i18n/translations';

interface BreadcrumbsProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ currentPath, onNavigate }) => {
  const { t, language } = useTranslation();
  const isRTL = language === 'ar';

  const crumbs = useMemo(() => {
    const findPath = (items: NavItem[], targetPath: string, currentCrumbs: NavItem[] = []): NavItem[] | null => {
      for (const item of items) {
        if (item.path === targetPath) {
          return [...currentCrumbs, item];
        }
        if (item.children) {
          const found = findPath(item.children, targetPath, [...currentCrumbs, item]);
          if (found) return found;
        }
      }
      return null;
    };
    return findPath(NAV_ITEMS, currentPath) || [];
  }, [currentPath]);

  if (currentPath === '/' || crumbs.length === 0) {
    return (
      <div className="flex items-center gap-2 text-text-secondary text-xs mb-2">
        <Home className="w-3.5 h-3.5" />
        <span>{t('dashboard')}</span>
      </div>
    );
  }

  return (
    <nav className="flex items-center gap-2 text-text-secondary text-xs mb-2 overflow-x-auto whitespace-nowrap no-scrollbar">
      <button 
        onClick={() => onNavigate('/')}
        className="hover:text-brand-primary-start transition-colors flex items-center gap-1"
      >
        <Home className="w-3.5 h-3.5" />
        <span>{t('dashboard')}</span>
      </button>
      
      {crumbs.map((crumb, index) => (
        <React.Fragment key={crumb.path}>
          <ChevronRight className={`w-3 h-3 shrink-0 ${isRTL ? 'rotate-180' : ''}`} />
          <button
            onClick={() => onNavigate(crumb.path)}
            disabled={index === crumbs.length - 1}
            className={`transition-colors ${
              index === crumbs.length - 1 
                ? 'text-text-primary font-medium cursor-default' 
                : 'hover:text-brand-primary-start'
            }`}
          >
            {crumb.translationKey ? t(crumb.translationKey as TranslationKey) : crumb.title}
          </button>
        </React.Fragment>
      ))}
    </nav>
  );
};
