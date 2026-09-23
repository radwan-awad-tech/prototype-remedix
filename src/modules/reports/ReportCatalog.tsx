import React, { useState, useEffect } from 'react';
import { Search, FileText, ChevronRight } from 'lucide-react';
import { reportService } from '../../services/reportService';
import { ReportTemplate, ReportCategory } from '../../types';
import { useTranslation } from '../../hooks/useTranslation';

interface ReportCatalogProps {
  onSelectReport: (report: ReportTemplate) => void;
}

export const ReportCatalog: React.FC<ReportCatalogProps> = ({ onSelectReport }) => {
  const { t } = useTranslation();
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ReportCategory | 'All'>('All');

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await reportService.listTemplates();
        if (response.success) {
          setTemplates(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch report templates', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTemplates();
  }, []);

  const categories: { id: ReportCategory | 'All', labelKey: any }[] = [
    { id: 'All', labelKey: 'reports_all_categories' },
    { id: 'Executive', labelKey: 'reports_executive' },
    { id: 'Operational', labelKey: 'reports_operational' },
    { id: 'Compliance', labelKey: 'reports_compliance' },
    { id: 'Financial', labelKey: 'reports_financial' }
  ];

  const filteredReports = templates.filter(report => {
    const matchesSearch = (report.name && report.name.toLowerCase().includes((searchTerm || '').toLowerCase())) || 
                         (report.description && report.description.toLowerCase().includes((searchTerm || '').toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || report.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
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
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-gradient-primary text-white shadow-md'
                  : 'bg-bg-main text-text-secondary hover:bg-bg-hover'
              }`}
            >
              {t(cat.labelKey)}
            </button>
          ))}
        </div>
      </div>

      {/* Report Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary-start"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map(report => (
            <div 
              key={report.id}
              className="group bg-white rounded-2xl border border-border-base p-6 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col h-full"
              onClick={() => onSelectReport(report)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-bg-main text-brand-primary-start group-hover:bg-gradient-primary group-hover:text-white transition-all">
                  <FileText className="w-6 h-6" />
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  report.category === 'Executive' ? 'bg-purple-100 text-purple-600' :
                  report.category === 'Financial' ? 'bg-emerald-100 text-emerald-600' :
                  report.category === 'Compliance' ? 'bg-amber-100 text-amber-600' :
                  'bg-blue-100 text-blue-600'
                }`}>
                  {report.category ? t(`reports_${report.category.toLowerCase()}` as any) : ''}
                </span>
              </div>
              <h3 className="text-lg font-bold text-text-primary mb-2 group-hover:text-brand-primary-start transition-colors">
                {t(report.name as any)}
              </h3>
              <p className="text-sm text-text-secondary flex-1">
                {t(report.description as any)}
              </p>
              <div className="mt-6 pt-4 border-t border-border-base flex items-center justify-between text-brand-primary-start font-semibold text-sm">
                <span>{t('reports_open_in_builder')}</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && filteredReports.length === 0 && (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-border-base">
          <FileText className="w-12 h-12 text-text-secondary mx-auto mb-4 opacity-20" />
          <h3 className="text-lg font-medium text-text-primary">{t('reports_no_reports_found')}</h3>
          <p className="text-text-secondary">{t('reports_adjust_filters')}</p>
        </div>
      )}
    </div>
  );
};
