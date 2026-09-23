import React, { useState, useEffect } from 'react';
import { Plus, Edit, Archive, CheckCircle, FileText } from 'lucide-react';
import { DataTable } from '../../components/ui/DataTable';
import { Drawer } from '../../components/ui/Drawer';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { performanceService } from '../../services/performanceService';
import { EvaluationTemplate, EvaluationStatus, PeriodType, DataTableColumn } from '../../types';
import { useToast } from '../../components/ui/Toast';
import { useTranslation } from '../../hooks/useTranslation';

export const EvaluationTemplates: React.FC = () => {
  const { t } = useTranslation();
  const [templates, setTemplates] = useState<EvaluationTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<EvaluationTemplate | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await performanceService.listTemplates();
        if (response.success) {
          setTemplates(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch templates', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTemplates();
  }, []);

  const columns: DataTableColumn<EvaluationTemplate>[] = [
    { 
      header: 'Template Name', 
      translationKey: 'performance_template_name',
      accessor: (row: EvaluationTemplate) => (
        <div className="flex items-center gap-3 text-start">
          <div className="p-2 bg-brand-primary-start/10 rounded-lg">
            <FileText className="w-4 h-4 text-brand-primary-end" />
          </div>
          <span className="font-medium text-gray-900">{row.name}</span>
        </div>
      )
    },
    { header: 'Version', translationKey: 'performance_version', accessor: (row: EvaluationTemplate) => row.version },
    { header: 'Period', translationKey: 'performance_period', accessor: (row: EvaluationTemplate) => row.periodType },
    { 
      header: 'Status', 
      translationKey: 'status',
      accessor: (row: EvaluationTemplate) => (
        <StatusBadge status={row.status} />
      )
    },
    { header: 'Created By', translationKey: 'performance_created_by', accessor: (row: EvaluationTemplate) => row.createdBy },
    { header: 'Created At', translationKey: 'performance_created_at', accessor: (row: EvaluationTemplate) => row.createdAt },
    { 
      header: 'Actions', 
      translationKey: 'actions',
      accessor: (row: EvaluationTemplate) => (
        <div className="flex items-center gap-2">
          <button 
            onClick={() => { setSelectedTemplate(row); setIsDrawerOpen(true); }}
            className="p-1 hover:bg-gray-100 rounded text-gray-600"
            title={t('edit')}
          >
            <Edit className="w-4 h-4" />
          </button>
          {row.status === 'Draft' && (
            <button 
              onClick={() => handleStatusChange(row.id, 'Published')}
              className="p-1 hover:bg-green-50 rounded text-green-600"
              title={t('publish')}
            >
              <CheckCircle className="w-4 h-4" />
            </button>
          )}
          {row.status !== 'Archived' && (
            <button 
              onClick={() => handleStatusChange(row.id, 'Archived')}
              className="p-1 hover:bg-red-50 rounded text-red-600"
              title={t('archive')}
            >
              <Archive className="w-4 h-4" />
            </button>
          )}
        </div>
      )
    },
  ];

  const handleStatusChange = async (id: string, status: EvaluationStatus) => {
    try {
      const response = await performanceService.updateTemplateStatus(id, status);
      if (response.success) {
        setTemplates(prev => prev.map(t => t.id === id ? { ...t, status } : t));
        showToast(t('performance_template_status_updated', { status: status ? status.toLowerCase() : '' }), 'success');
      } else {
        showToast(response.message || t('error_updating_status'), 'error');
      }
    } catch (error) {
      showToast(t('error_updating_status'), 'error');
    }
  };

  const handleCreateTemplate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const periodType = formData.get('periodType') as PeriodType;

    if (!name.trim()) {
      showToast(t('performance_template_name_required'), 'error');
      return;
    }

    try {
      const response = await performanceService.createTemplate({ name, periodType });
      if (response.success) {
        setTemplates([response.data, ...templates]);
        setIsDrawerOpen(false);
        showToast(t('performance_template_created'), 'success');
      } else {
        showToast(response.message || t('error_creating_template'), 'error');
      }
    } catch (error) {
      showToast(t('error_creating_template'), 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{t('performance_templates_title')}</h2>
          <p className="text-sm text-gray-500">{t('performance_templates_subtitle')}</p>
        </div>
        <button 
          onClick={() => { setSelectedTemplate(null); setIsDrawerOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 btn-gradient-primary rounded-lg shadow-sm text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          {t('performance_create_template')}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <DataTable data={templates} columns={columns} isLoading={isLoading} />
      </div>

      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={selectedTemplate ? t('performance_edit_template') : t('performance_create_new_template')}
        footer={
          <div className="flex gap-3 w-full">
            <button
              type="button"
              onClick={() => setIsDrawerOpen(false)}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {t('cancel')}
            </button>
            <button
              form="template-form"
              type="submit"
              className="flex-1 px-4 py-2 btn-gradient-primary rounded-lg font-medium shadow-sm"
            >
              {selectedTemplate ? t('performance_update_template') : t('performance_create_template')}
            </button>
          </div>
        }
      >
        <form id="template-form" onSubmit={handleCreateTemplate} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('performance_template_name')}</label>
              <input 
                name="name"
                type="text" 
                required
                defaultValue={selectedTemplate?.name}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary-start/20 focus:border-brand-primary-end"
                placeholder={t('performance_template_placeholder')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('performance_period_type')}</label>
              <select 
                name="periodType"
                required
                defaultValue={selectedTemplate?.periodType}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary-start/20 focus:border-brand-primary-end"
              >
                <option value="Annual">{t('annual')}</option>
                <option value="Quarterly">{t('quarterly')}</option>
              </select>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3">
              <h3 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                {t('performance_fixed_sections')}
              </h3>
              <ul className="text-xs text-gray-600 space-y-2 list-disc list-inside">
                <li>{t('performance_technical_skills')}</li>
                <li>{t('performance_communication')}</li>
                <li>{t('performance_teamwork')}</li>
                <li>{t('performance_discipline')}</li>
                <li>{t('performance_overall_score')}</li>
                <li>{t('performance_manager_comments')}</li>
                <li>{t('performance_development_plan')}</li>
              </ul>
            </div>
          </div>
        </form>
      </Drawer>
    </div>
  );
};
