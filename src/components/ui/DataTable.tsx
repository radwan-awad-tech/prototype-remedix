import React, { useState, useEffect, useMemo } from 'react';
import { MoreVertical, ChevronLeft, ChevronRight, Settings2, Check, Search } from 'lucide-react';
import { DataTableColumn } from '../../types';
import { FilterBar } from './FilterBar';
import { EmptyState } from './EmptyState';
import { useTranslation } from '../../hooks/useTranslation';
import { TranslationKey } from '../../i18n/translations';

interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  onRowClick?: (row: T) => void;
  isLoading?: boolean;
  searchPlaceholder?: string;
  searchTranslationKey?: TranslationKey;
  onSearch?: (value: string) => void;
  searchValue?: string;
  onFilterClick?: () => void;
  headerActions?: React.ReactNode;
  tableId?: string; // Unique ID for column persistence
  rowActions?: (row: T) => { label: string; onClick: () => void; icon?: React.ReactNode; variant?: 'default' | 'danger' }[];
}

export function DataTable<T>({ 
  data, 
  columns, 
  onRowClick, 
  isLoading,
  searchPlaceholder,
  searchTranslationKey,
  onSearch,
  searchValue,
  onFilterClick,
  headerActions,
  tableId,
  rowActions
}: DataTableProps<T>) {
  const { t } = useTranslation();
  const [showColumnChooser, setShowColumnChooser] = useState(false);
  const [visibleColumnIds, setVisibleColumnIds] = useState<string[]>([]);
  const [openMenuRowIdx, setOpenMenuRowIdx] = useState<number | null>(null);

  // Initialize visible columns from localStorage or default to all
  useEffect(() => {
    if (tableId) {
      const saved = localStorage.getItem(`dt_cols_${tableId}`);
      if (saved) {
        try {
          setVisibleColumnIds(JSON.parse(saved));
          return;
        } catch (e) {
          console.error('Failed to parse saved columns', e);
        }
      }
    }
    setVisibleColumnIds(columns.map(c => c.header));
  }, [tableId, columns]);

  // Persist visible columns when they change
  useEffect(() => {
    if (tableId && visibleColumnIds.length > 0) {
      localStorage.setItem(`dt_cols_${tableId}`, JSON.stringify(visibleColumnIds));
    }
  }, [tableId, visibleColumnIds]);

  const toggleColumn = (header: string) => {
    setVisibleColumnIds(prev => 
      prev.includes(header) 
        ? prev.filter(id => id !== header) 
        : [...prev, header]
    );
  };

  const visibleColumns = useMemo(() => {
    return columns.filter(col => visibleColumnIds.includes(col.header));
  }, [columns, visibleColumnIds]);

  return (
    <div className="card-base overflow-hidden">
      {/* Header Actions */}
      <FilterBar 
        onSearch={onSearch}
        searchValue={searchValue}
        onFilterClick={onFilterClick}
        placeholder={searchPlaceholder}
        placeholderKey={searchTranslationKey}
        extraActions={
          <div className="flex items-center gap-2">
            {headerActions}
            {tableId && (
              <div className="relative">
                <button 
                  onClick={() => setShowColumnChooser(!showColumnChooser)}
                  className={`p-2 rounded-lg border border-border-base transition-all hover:bg-bg-main ${showColumnChooser ? 'bg-bg-main border-brand-primary-start' : 'bg-white'}`}
                  title={t('choose_columns')}
                >
                  <Settings2 className="w-4 h-4 text-text-secondary" />
                </button>

                {showColumnChooser && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setShowColumnChooser(false)} 
                    />
                    <div className="absolute end-0 mt-2 w-56 bg-white rounded-xl border border-border-base shadow-xl z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                      <div className="p-3 border-b border-border-base bg-bg-main/30">
                        <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">{t('display_columns')}</span>
                      </div>
                      <div className="max-h-64 overflow-y-auto p-1">
                        {columns.map((col) => (
                          <button
                            key={col.header}
                            onClick={() => toggleColumn(col.header)}
                            className="w-full flex items-center justify-between px-3 py-2 text-sm text-text-primary hover:bg-bg-main rounded-lg transition-colors group"
                          >
                            <span>{col.translationKey ? t(col.translationKey) : col.header}</span>
                            {visibleColumnIds.includes(col.header) && (
                              <Check className="w-4 h-4 text-brand-primary-start" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        }
      />

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-start border-collapse">
          <thead>
            <tr className="bg-bg-main/50">
              {visibleColumns.map((col, idx) => (
                <th key={idx} className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  {col.translationKey ? t(col.translationKey) : col.header}
                </th>
              ))}
              <th className="px-6 py-4 text-end"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-base">
            {isLoading ? (
              <tr>
                <td colSpan={visibleColumns.length + 1} className="px-6 py-24 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-brand-primary-start/20 border-t-brand-primary-start rounded-full animate-spin" />
                    <span className="text-sm font-medium text-text-secondary">{t('loading_data')}</span>
                  </div>
                </td>
              </tr>
            ) : !Array.isArray(data) || data.length === 0 ? (
              <tr>
                <td colSpan={visibleColumns.length + 1} className="p-0">
                  <EmptyState 
                    title={t('no_records_found')} 
                    description={t('adjust_filters')}
                    icon={<Search className="w-8 h-8 text-text-secondary opacity-50" />}
                  />
                </td>
              </tr>
            ) : (
              data.map((row, rowIdx) => (
                <tr
                  key={rowIdx}
                  onClick={() => onRowClick?.(row)}
                  className={`hover:bg-bg-main/40 transition-colors cursor-pointer group`}
                >
                  {visibleColumns.map((col, colIdx) => (
                    <td key={colIdx} className={`px-6 py-4 text-sm text-text-primary ${col.className || ''}`}>
                      {typeof col.accessor === 'function' ? col.accessor(row) : (row[col.accessor] as React.ReactNode)}
                    </td>
                  ))}
                  <td className="px-6 py-4 text-end relative">
                    {rowActions && (
                      <div className="flex justify-end">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuRowIdx(openMenuRowIdx === rowIdx ? null : rowIdx);
                          }}
                          className={`p-1.5 rounded-lg transition-colors text-text-secondary hover:bg-bg-main ${openMenuRowIdx === rowIdx ? 'bg-bg-main text-brand-primary-start' : 'opacity-0 group-hover:opacity-100'}`}
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        
                        {openMenuRowIdx === rowIdx && (
                          <>
                            <div 
                              className="fixed inset-0 z-10" 
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenMenuRowIdx(null);
                              }} 
                            />
                            <div className="absolute end-6 mt-8 w-48 bg-white rounded-xl border border-border-base shadow-xl z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-200 py-1">
                              {rowActions(row).map((action, actionIdx) => (
                                <button
                                  key={actionIdx}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    action.onClick();
                                    setOpenMenuRowIdx(null);
                                  }}
                                  className={`w-full flex items-center gap-2 px-4 py-2 text-sm transition-colors hover:bg-bg-main ${action.variant === 'danger' ? 'text-rose-600' : 'text-text-primary'}`}
                                >
                                  {action.icon}
                                  {action.label}
                                </button>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-4 border-t border-border-base flex items-center justify-between bg-white">
        <p className="text-xs text-text-secondary">
          {t('showing_results', { 
            start: !Array.isArray(data) || data.length === 0 ? 0 : 1, 
            end: Array.isArray(data) ? data.length : 0, 
            total: Array.isArray(data) ? data.length : 0 
          })}
        </p>
        <div className="flex items-center gap-2">
          <button className="p-2 border border-border-base rounded-lg hover:bg-bg-main disabled:opacity-50 transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="p-2 border border-border-base rounded-lg hover:bg-bg-main disabled:opacity-50 transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
