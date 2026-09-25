import React, { useState, useMemo, useEffect } from 'react';
import { 
  LayoutGrid, 
  PlusCircle, 
  History,
  Download,
  ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ReportCatalog } from '../modules/reports/ReportCatalog';
import { ReportBuilder } from '../modules/reports/ReportBuilder';
import { GeneratedReportsHistory } from '../modules/reports/GeneratedReportsHistory';
import { ReportTemplate } from '../types';
import { useTranslation } from '../hooks/useTranslation';
import { useToast } from '../components/ui/Toast';
import { PageHeader } from '../components/ui/PageHeader';
import { Tabs } from '../components/ui/Tabs';
import { useAuth } from '../modules/auth/AuthContext';

type ReportsTab = 'catalog' | 'builder' | 'history';

const ReportsPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { info } = useToast();
  const [activeTab, setActiveTab] = useState<ReportsTab>('catalog');
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);

  const isAuthorized = useMemo(() => {
    return ['Senior Manager', 'HR Manager', 'System Admin', 'Accountant'].includes(user?.role || '');
  }, [user?.role]);

  const handleSelectReport = (report: ReportTemplate) => {
    setSelectedTemplate(report);
    setActiveTab('builder');
  };

  const handleCancelBuilder = () => {
    setSelectedTemplate(null);
    setActiveTab('catalog');
  };

  const tabs = [
    { id: 'catalog', label: 'Report Catalog', icon: <LayoutGrid className="w-4 h-4" />, translationKey: 'report_catalog' as const },
    { id: 'builder', label: 'Report Builder', icon: <PlusCircle className="w-4 h-4" />, translationKey: 'report_builder' as const },
    { id: 'history', label: 'Generated Reports', icon: <History className="w-4 h-4" />, translationKey: 'generated_reports' as const },
  ];

  const handleExportReports = () => {
    const content = `Reports Export - ${new Date().toLocaleDateString()}\nCatalog, Builder, History`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `reports_export_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    info('Reports catalog exported successfully');
  };

  const headerActions = (
    <>
      <button 
        onClick={handleExportReports}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-border-base text-text-secondary font-medium hover:bg-bg-main transition-all"
      >
        <Download className="w-4 h-4" />
        {t('export')}
      </button>
      <button 
        onClick={() => {
          setSelectedTemplate(null);
          setActiveTab('builder');
        }}
        className="btn-gradient-primary flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium shadow-md hover:shadow-lg transition-all"
      >
        <PlusCircle className="w-4 h-4" />
        {t('new_custom_report')}
      </button>
    </>
  );

  return (
    <div className="space-y-6 pb-20">
      <PageHeader 
        title={t('reports')} 
        titleKey="reports"
        subtitle={t('reports_subtitle')}
        subtitleKey="reports_subtitle"
        actions={headerActions}
      />

      {/* Tabs */}
      <div className="card-base p-1 inline-flex bg-bg-main/50">
        <Tabs 
          tabs={tabs} 
          activeTab={activeTab} 
          onChange={(id) => {
            if (id === 'catalog') setSelectedTemplate(null);
            setActiveTab(id as ReportsTab);
          }} 
          variant="pill"
        />
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="mt-2"
        >
          {activeTab === 'catalog' && (
            <ReportCatalog onSelectReport={handleSelectReport} />
          )}
          {activeTab === 'builder' && (
            <ReportBuilder 
              initialReport={selectedTemplate} 
              onCancel={handleCancelBuilder} 
            />
          )}
          {activeTab === 'history' && (
            <GeneratedReportsHistory />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ReportsPage;
