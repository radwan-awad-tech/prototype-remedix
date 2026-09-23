import React from 'react';
import { Search, Filter } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { TranslationKey } from '../../i18n/translations';

interface FilterBarProps {
  onSearch?: (value: string) => void;
  onFilterClick?: () => void;
  placeholder?: string;
  placeholderKey?: TranslationKey;
  extraActions?: React.ReactNode;
  searchValue?: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({ 
  onSearch, 
  onFilterClick, 
  placeholder = "Search...", 
  placeholderKey,
  extraActions,
  searchValue
}) => {
  const { t } = useTranslation();

  return (
    <div className="p-4 border-b border-border-base flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
        <input
          type="text"
          value={searchValue}
          placeholder={placeholderKey ? t(placeholderKey) : placeholder}
          onChange={(e) => onSearch?.(e.target.value)}
          className="input-base ps-10 w-full"
        />
      </div>
      <div className="flex items-center gap-2">
        {onFilterClick && (
          <button 
            onClick={onFilterClick}
            className="btn-secondary flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            {t('filter')}
          </button>
        )}
        {extraActions}
      </div>
    </div>
  );
};
