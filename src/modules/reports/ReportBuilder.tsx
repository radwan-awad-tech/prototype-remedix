import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  Eye, 
  Download, 
  CheckCircle2, 
  FileText, 
  FileSpreadsheet, 
  Loader2,
  Calendar,
  Building2,
  User as UserIcon,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { reportService } from '../../services/reportService';
import { ReportTemplate, ReportFilters } from '../../types';
import { useTranslation } from '../../hooks/useTranslation';
import { useToast } from '../../components/ui/Toast';
import { useAuth } from '../auth/AuthContext';

interface ReportBuilderProps {
  initialReport?: ReportTemplate | null;
  onCancel: () => void;
}

type Step = 'Type' | 'Filters' | 'Preview' | 'Generate';

export const ReportBuilder: React.FC<ReportBuilderProps> = ({ initialReport, onCancel }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { info } = useToast();
  const [currentStep, setCurrentStep] = useState<Step>(initialReport ? 'Filters' : 'Type');
  const [selectedReport, setSelectedReport] = useState<ReportTemplate | null>(initialReport || null);
  const [filters, setFilters] = useState<ReportFilters>({
    department: user?.role === 'Department Head' ? user.department || 'All' : 'All',
    startDate: '',
    endDate: '',
    status: 'All',
    employeeId: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);

  const steps: Step[] = ['Type', 'Filters', 'Preview', 'Generate'];
  const stepTranslationKeys: Record<Step, any> = {
    'Type': 'reports_step_type',
    'Filters': 'reports_step_filters',
    'Preview': 'reports_step_preview',
    'Generate': 'reports_step_generate'
  };
  const currentStepIdx = steps.indexOf(currentStep);

  const handleNext = () => {
    if (currentStepIdx < steps.length - 1) {
      setCurrentStep(steps[currentStepIdx + 1]);
    }
  };

  const handleBack = () => {
    if (currentStepIdx > 0) {
      setCurrentStep(steps[currentStepIdx - 1]);
    } else {
      onCancel();
    }
  };

  const handleGenerate = async () => {
    if (!selectedReport) return;
    setIsGenerating(true);
    try {
      const response = await reportService.generateReport(selectedReport.id, filters);
      if (response.success) {
        setIsGenerating(false);
        setIsGenerated(true);
        handleNext();
      } else {
        // In a real app, show error toast
        setIsGenerating(false);
      }
    } catch (error) {
      console.error('Failed to generate report', error);
      setIsGenerating(false);
    }
  };

  // Mock preview data
  const previewData = Array.from({ length: 10 }).map((_, i) => ({
    id: i + 1,
    name: `Employee ${i + 1}`,
    dept: ['Nursing', 'Radiology', 'Emergency', 'HR'][Math.floor(Math.random() * 4)],
    status: ['Active', 'Inactive', 'Pending'][Math.floor(Math.random() * 3)],
    value: Math.floor(Math.random() * 10000)
  }));

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={handleBack}
            className="p-2 rounded-xl bg-white border border-border-base hover:bg-bg-main transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-text-secondary" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-text-primary">{t('report_builder')}</h2>
            <p className="text-sm text-text-secondary">
              {selectedReport 
                ? t('reports_customizing', { name: selectedReport.name }) 
                : t('reports_configure_custom')}
            </p>
          </div>
        </div>
        
        {/* Progress Stepper */}
        <div className="hidden md:flex items-center gap-2">
          {steps.map((step, idx) => (
            <React.Fragment key={step}>
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  idx <= currentStepIdx 
                    ? 'bg-gradient-primary text-white shadow-md' 
                    : 'bg-bg-main text-text-secondary border border-border-base'
                }`}>
                  {idx + 1}
                </div>
                <span className={`text-xs font-semibold ${
                  idx <= currentStepIdx ? 'text-text-primary' : 'text-text-secondary'
                }`}>
                  {t(stepTranslationKeys[step])}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div className={`w-8 h-px ${idx < currentStepIdx ? 'bg-brand-primary-start' : 'bg-border-base'}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-3xl border border-border-base shadow-sm overflow-hidden min-h-[500px] flex flex-col">
        <div className="flex-1 p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {currentStep === 'Type' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {['Workforce', 'Financial', 'Compliance', 'Operational'].map(type => (
                      <button
                        key={type}
                        className="p-6 rounded-2xl border border-border-base hover:border-brand-primary-start hover:bg-bg-main transition-all text-start flex items-center gap-4 group"
                        onClick={() => {
                          const mockTemplate: ReportTemplate = {
                            id: `custom-${type.toLowerCase()}`,
                            name: `${type} Report`,
                            category: type as any,
                            description: `Custom ${type.toLowerCase()} report generated by user.`,
                            type: 'Custom'
                          };
                          setSelectedReport(mockTemplate);
                          handleNext();
                        }}
                      >
                        <div className="p-3 rounded-xl bg-bg-main text-brand-primary-start group-hover:bg-gradient-primary group-hover:text-white transition-all">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-bold text-text-primary">{type ? t(`reports_${type.toLowerCase()}` as any) : ''} {t('report')}</h4>
                          <p className="text-sm text-text-secondary">{t('reports_standardized_templates', { type: type ? t(`reports_${type.toLowerCase()}` as any).toLowerCase() : '' })}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 'Filters' && (
                <div className="space-y-8 max-w-2xl mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-text-primary flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-brand-primary-start" />
                        {t('department')}
                      </label>
                      <select 
                        className="w-full p-3 rounded-xl border border-border-base focus:ring-2 focus:ring-brand-primary-start/20 outline-none disabled:bg-bg-main disabled:cursor-not-allowed"
                        value={filters.department}
                        onChange={(e) => setFilters({...filters, department: e.target.value})}
                        disabled={user?.role === 'Department Head'}
                      >
                        {user?.role !== 'Department Head' && <option value="All">{t('reports_all_departments')}</option>}
                        <option value="Nursing">{t('nursing')}</option>
                        <option value="Radiology">{t('radiology')}</option>
                        <option value="Emergency">{t('emergency')}</option>
                        <option value="Human Resources">{t('hr')}</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-text-primary flex items-center gap-2">
                        <Activity className="w-4 h-4 text-brand-primary-start" />
                        {t('status')}
                      </label>
                      <select 
                        className="w-full p-3 rounded-xl border border-border-base focus:ring-2 focus:ring-brand-primary-start/20 outline-none"
                        value={filters.status}
                        onChange={(e) => setFilters({...filters, status: e.target.value})}
                      >
                        <option value="All">{t('reports_all_statuses')}</option>
                        <option value="Active">{t('active')}</option>
                        <option value="Inactive">{t('inactive')}</option>
                        <option value="Pending">{t('pending')}</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-text-primary flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-brand-primary-start" />
                        {t('start_date')}
                      </label>
                      <input 
                        type="date"
                        className="w-full p-3 rounded-xl border border-border-base focus:ring-2 focus:ring-brand-primary-start/20 outline-none"
                        value={filters.startDate}
                        onChange={(e) => setFilters({...filters, startDate: e.target.value})}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-text-primary flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-brand-primary-start" />
                        {t('end_date')}
                      </label>
                      <input 
                        type="date"
                        className="w-full p-3 rounded-xl border border-border-base focus:ring-2 focus:ring-brand-primary-start/20 outline-none"
                        value={filters.endDate}
                        onChange={(e) => setFilters({...filters, endDate: e.target.value})}
                      />
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <label className="text-sm font-bold text-text-primary flex items-center gap-2">
                        <UserIcon className="w-4 h-4 text-brand-primary-start" />
                        {t('reports_employee_optional')}
                      </label>
                      <input 
                        type="text"
                        placeholder={t('reports_search_employee_placeholder')}
                        className="w-full ps-3 pe-3 p-3 rounded-xl border border-border-base focus:ring-2 focus:ring-brand-primary-start/20 outline-none"
                        value={filters.employeeId}
                        onChange={(e) => setFilters({...filters, employeeId: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 'Preview' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-text-primary flex items-center gap-2">
                      <Eye className="w-5 h-5 text-brand-primary-start" />
                      {t('reports_data_preview')}
                    </h4>
                    <span className="text-xs text-text-secondary bg-bg-main px-3 py-1 rounded-full">
                      {t('reports_mock_data_note')}
                    </span>
                  </div>
                  
                  <div className="overflow-x-auto border border-border-base rounded-2xl">
                    <table className="w-full text-start text-sm">
                      <thead className="bg-bg-main border-b border-border-base">
                        <tr>
                          <th className="px-6 py-4 font-bold text-text-primary text-start">{t('reports_id')}</th>
                          <th className="px-6 py-4 font-bold text-text-primary text-start">{t('reports_name')}</th>
                          <th className="px-6 py-4 font-bold text-text-primary text-start">{t('department')}</th>
                          <th className="px-6 py-4 font-bold text-text-primary text-start">{t('status')}</th>
                          <th className="px-6 py-4 font-bold text-text-primary text-end">{t('reports_value')}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border-base">
                        {previewData.map(row => (
                          <tr key={row.id} className="hover:bg-bg-main transition-colors">
                            <td className="px-6 py-4 text-text-secondary">#{row.id}</td>
                            <td className="px-6 py-4 font-medium text-text-primary">{row.name}</td>
                            <td className="px-6 py-4 text-text-secondary">{row.dept ? t(row.dept.toLowerCase() as any) : ''}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                                row.status === 'Active' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                              }`}>
                                {row.status ? t(row.status.toLowerCase() as any) : ''}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-end font-mono text-text-primary">${row.value.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {currentStep === 'Generate' && (
                <div className="flex flex-col items-center justify-center py-12 space-y-8 text-center">
                  {isGenerated ? (
                    <>
                      <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-4 animate-bounce">
                        <CheckCircle2 className="w-10 h-10" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-text-primary">{t('reports_generated_success')}</h3>
                        <p className="text-text-secondary mt-2">{t('reports_ready_for_download')}</p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                        <button 
                          onClick={() => info(t('feature_coming_soon'))}
                          className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-gradient-primary text-white font-bold shadow-lg hover:shadow-xl transition-all"
                        >
                          <Download className="w-5 h-5" />
                          {t('reports_download_pdf')}
                        </button>
                        <button 
                          onClick={() => info(t('feature_coming_soon'))}
                          className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white border border-border-base text-text-primary font-bold hover:bg-bg-main transition-all"
                        >
                          <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                          {t('reports_download_excel')}
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-20 h-20 rounded-full bg-bg-main flex items-center justify-center text-brand-primary-start mb-4">
                        <Activity className="w-10 h-10" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-text-primary">{t('reports_ready_to_generate')}</h3>
                        <p className="text-text-secondary mt-2">{t('reports_compile_data_note')}</p>
                      </div>
                      <button 
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-primary text-white font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            {t('reports_generating')}
                          </>
                        ) : (
                          <>
                            <Activity className="w-5 h-5" />
                            {t('reports_generate_full')}
                          </>
                        )}
                      </button>
                    </>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Actions */}
        <div className="px-8 py-6 bg-bg-main border-t border-border-base flex items-center justify-between">
          <button 
            onClick={handleBack}
            className="px-6 py-2.5 rounded-xl text-text-secondary font-bold hover:text-text-primary transition-colors"
          >
            {currentStep === 'Type' ? t('cancel') : t('back')}
          </button>
          
          {currentStep !== 'Generate' && (
            <button 
              onClick={handleNext}
              disabled={currentStep === 'Type' && !selectedReport}
              className="flex items-center gap-2 px-8 py-2.5 rounded-xl bg-gradient-primary text-white font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50"
            >
              {t('next')}
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
