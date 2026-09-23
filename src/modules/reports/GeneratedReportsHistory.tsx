import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Eye, 
  Search, 
  Filter, 
  MoreVertical, 
  CheckCircle2, 
  XCircle, 
  Clock,
  FileText,
  FileSpreadsheet,
  Info
} from 'lucide-react';
import { reportService } from '../../services/reportService';
import { ReportRun, DataTableColumn } from '../../types';
import { useTranslation } from '../../hooks/useTranslation';
import { useToast } from '../../components/ui/Toast';
import { useAuth } from '../auth/AuthContext';

export const GeneratedReportsHistory: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { info } = useToast();
  const [history, setHistory] = useState<ReportRun[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showMetadata, setShowMetadata] = useState<ReportRun | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const dept = user?.role === 'Department Head' ? user?.department : undefined;
        const response = await reportService.listHistory(dept);
        if (response.success) {
          setHistory(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch report history', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, [user]);

  const filteredHistory = history.filter(item => {
    const matchesSearch = (item.reportName && item.reportName.toLowerCase().includes((searchTerm || '').toLowerCase())) || 
                         (item.generatedBy && item.generatedBy.toLowerCase().includes((searchTerm || '').toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const columns: DataTableColumn<ReportRun>[] = [
    {
      header: t('reports_name'),
      accessor: (row) => (
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${
            row.format === 'PDF' ? 'bg-rose-50 text-rose-500' : 'bg-emerald-50 text-emerald-500'
          }`}>
            {row.format === 'PDF' ? <FileText className="w-4 h-4" /> : <FileSpreadsheet className="w-4 h-4" />}
          </div>
          <div>
            <p className="font-bold text-text-primary">{t(row.reportName as any)}</p>
            <p className="text-[10px] text-text-secondary uppercase tracking-wider font-semibold">{row.category ? t(`reports_${row.category.toLowerCase()}` as any) : ''}</p>
          </div>
        </div>
      )
    },
    {
      header: t('reports_generated_by'),
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-bg-main flex items-center justify-center text-[10px] font-bold text-brand-primary-start">
            {row.generatedBy.split(' ').map(n => n[0]).join('')}
          </div>
          <span className="text-sm text-text-secondary">{row.generatedBy}</span>
        </div>
      )
    },
    {
      header: t('reports_generated_at'),
      accessor: (row) => (
        <div className="text-sm">
          <p className="text-text-primary font-medium">{row.generatedAt.split(' ')[0]}</p>
          <p className="text-[10px] text-text-secondary">{row.generatedAt.split(' ')[1]}</p>
        </div>
      )
    },
    {
      header: t('reports_scope_dept'),
      accessor: (row) => (
        <span className="px-2.5 py-1 rounded-lg bg-bg-main text-text-secondary text-xs font-medium border border-border-base">
          {row.scopeDept ? t(row.scopeDept.toLowerCase() as any) : ''}
        </span>
      )
    },
    {
      header: t('status'),
      accessor: (row) => (
        <div className="flex items-center gap-1.5">
          {row.status === 'Completed' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          ) : row.status === 'Failed' ? (
            <XCircle className="w-4 h-4 text-rose-500" />
          ) : (
            <Clock className="w-4 h-4 text-amber-500 animate-pulse" />
          )}
          <span className={`text-xs font-bold ${
            row.status === 'Completed' ? 'text-emerald-600' : 
            row.status === 'Failed' ? 'text-rose-600' : 'text-amber-600'
          }`}>
            {row.status ? t(row.status.toLowerCase() as any) : ''}
          </span>
        </div>
      )
    },
    {
      header: t('actions'),
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowMetadata(row)}
            className="p-2 rounded-lg hover:bg-bg-main text-text-secondary hover:text-brand-primary-start transition-colors"
            title={t('reports_metadata')}
          >
            <Info className="w-4 h-4" />
          </button>
          <button 
            disabled={row.status !== 'Completed'}
            onClick={() => info(t('feature_coming_soon'))}
            className="p-2 rounded-lg hover:bg-bg-main text-text-secondary hover:text-brand-primary-start transition-colors disabled:opacity-30"
            title={t('download')}
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-border-base shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <input
            type="text"
            placeholder={t('reports_search_placeholder')}
            className="w-full ps-10 pe-4 py-2 rounded-xl border border-border-base focus:outline-none focus:ring-2 focus:ring-brand-primary-start/20 focus:border-brand-primary-start transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select 
            className="p-2 rounded-xl border border-border-base text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-primary-start/20"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="All">{t('reports_all_categories')}</option>
            <option value="Executive">{t('reports_executive')}</option>
            <option value="Financial">{t('reports_financial')}</option>
            <option value="Compliance">{t('reports_compliance')}</option>
            <option value="Operational">{t('reports_operational')}</option>
          </select>
          <button className="p-2 rounded-xl border border-border-base text-text-secondary hover:bg-bg-main transition-colors">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-3xl border border-border-base shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary-start"></div>
          </div>
        ) : (
          <table className="w-full text-start text-sm">
            <thead className="bg-bg-main border-b border-border-base">
              <tr>
                {columns.map((col, idx) => (
                  <th key={idx} className="px-6 py-4 font-bold text-text-primary text-start">{col.header}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border-base">
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-12 text-center text-text-secondary">
                    {t('reports_no_reports_found')}
                  </td>
                </tr>
              ) : (
                filteredHistory.map((row, idx) => (
                  <tr key={idx} className="hover:bg-bg-main transition-colors">
                    {columns.map((col, colIdx) => (
                      <td key={colIdx} className="px-6 py-4">
                        {typeof col.accessor === 'function' ? col.accessor(row) : (row[col.accessor] as React.ReactNode)}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Metadata Modal */}
      {showMetadata && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl border border-border-base shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-border-base flex items-center justify-between bg-bg-main">
              <h3 className="font-bold text-text-primary">{t('reports_metadata')}</h3>
              <button onClick={() => setShowMetadata(null)} className="p-2 rounded-xl hover:bg-white transition-colors">
                <XCircle className="w-5 h-5 text-text-secondary" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">{t('reports_id_label')}</p>
                  <p className="text-sm font-mono text-text-primary">{showMetadata.id}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">{t('reports_format')}</p>
                  <p className="text-sm text-text-primary">{showMetadata.format}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">{t('reports_period')}</p>
                  <p className="text-sm text-text-primary">{showMetadata.metadata?.period || 'N/A'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">{t('reports_filters_applied')}</p>
                  <p className="text-sm text-text-primary">{showMetadata.metadata?.filters || 'None'}</p>
                </div>
              </div>
              <div className="pt-4 border-t border-border-base">
                <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-2">{t('reports_immutable_note_title')}</p>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {t('reports_immutable_note_text')}
                </p>
              </div>
            </div>
            <div className="p-4 bg-bg-main border-t border-border-base flex justify-end">
              <button 
                onClick={() => setShowMetadata(null)}
                className="px-6 py-2 rounded-xl bg-white border border-border-base text-sm font-bold text-text-primary hover:bg-bg-main transition-colors"
              >
                {t('close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
