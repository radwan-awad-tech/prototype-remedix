import React, { useState, useMemo } from 'react';
import { Tabs } from '../components/ui/Tabs';
import { PageHeader } from '../components/ui/PageHeader';
import { DashboardOverview } from '../modules/dashboard/DashboardOverview';
import { AlertsCenter } from '../modules/dashboard/AlertsCenter';
import { ApprovalsInbox } from '../modules/dashboard/ApprovalsInbox';
import { Filter, Download, Calendar as CalendarIcon, X } from 'lucide-react';
import { Drawer } from '../components/ui/Drawer';

import { useTranslation } from '../hooks/useTranslation';
import { useToast } from '../components/ui/Toast';
import { useAuth } from '../modules/auth/AuthContext';

export const DashboardPage: React.FC = () => {
  const { t, language } = useTranslation();
  const { user } = useAuth();
  const { info } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState<string>('');
  const [tempDept, setTempDept] = useState<string>('');

  const departments = useMemo(() => {
    const allDepts = [
      { id: 'Nursing', label: t('nursing') },
      { id: 'Emergency', label: t('emergency_medicine') },
      { id: 'Radiology', label: t('radiology') },
      { id: 'Pediatrics', label: t('pediatrics') },
      { id: 'Administration', label: t('administration') },
    ];
    
    if (user?.role === 'Department Head' && user.department) {
      return allDepts.filter(d => d.id === user.department);
    }
    
    return allDepts;
  }, [t, user]);

  const canFilter = user?.role !== 'Employee' && user?.role !== 'Department Head';

  const tabs = useMemo(() => {
    const baseTabs = [
      { id: 'overview', label: t('overview') },
      { id: 'alerts', label: t('urgent_alerts') },
    ];
    
    if (user?.role !== 'Employee') {
      baseTabs.push({ id: 'approvals', label: t('approvals_inbox') });
    }
    
    return baseTabs;
  }, [t, user?.role]);

  const formattedDate = new Intl.DateTimeFormat(language === 'ar' ? 'ar-SA' : 'en-US', {
    month: 'short',
    day: 'numeric',
  }).format(new Date());

  const handleExportDashboard = () => {
    const content = `Dashboard Export - ${new Date().toLocaleDateString()}\nOverview, Alerts, Approvals`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dashboard_export_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    info('Dashboard summary exported successfully');
  };

  const handleApplyFilters = () => {
    setSelectedDept(tempDept);
    setIsFilterOpen(false);
    info(t('filters_applied_successfully'));
  };

  const handleResetFilters = () => {
    setTempDept('');
    setSelectedDept('');
    setIsFilterOpen(false);
  };

  const headerActions = (
    <>
      <div className="flex items-center gap-2 px-3 py-2 bg-white border border-border-base rounded-lg text-sm text-text-secondary shadow-sm">
        <CalendarIcon className="w-4 h-4" />
        <span dir="ltr">{t('today')}, {formattedDate}</span>
      </div>
      {canFilter && (
        <button 
          onClick={() => {
            setTempDept(selectedDept);
            setIsFilterOpen(true);
          }}
          className={`p-2 border rounded-lg transition-colors shadow-sm relative ${
            selectedDept 
              ? 'bg-brand-primary-start/10 border-brand-primary-start text-brand-primary-end' 
              : 'bg-white border-border-base text-text-secondary hover:bg-bg-main'
          }`}
        >
          <Filter className="w-4 h-4" />
          {selectedDept && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-brand-primary-end rounded-full border border-white" />
          )}
        </button>
      )}
      <button 
        onClick={handleExportDashboard}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-border-base rounded-lg text-sm font-medium text-text-primary hover:bg-bg-main transition-colors shadow-sm"
      >
        <Download className="w-4 h-4" />
        {t('export')}
      </button>
    </>
  );

  return (
    <div className="space-y-6">
      <PageHeader 
        title={t('dashboard')} 
        subtitle={t('dashboard_subtitle')}
        actions={headerActions}
      />

      {/* Active Filters Bar */}
      {selectedDept && (
        <div className="flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2 px-3 py-1 bg-brand-primary-start/10 text-brand-primary-end rounded-full text-xs font-medium border border-brand-primary-start/20">
            <span>{t('filter_by_dept')}: {departments.find(d => d.id === selectedDept)?.label}</span>
            <button onClick={() => setSelectedDept('')} className="hover:text-brand-primary-start">
              <X className="w-3 h-3" />
            </button>
          </div>
          <button 
            onClick={handleResetFilters}
            className="text-xs text-text-secondary hover:text-text-primary underline"
          >
            {t('reset_filters')}
          </button>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="card-base p-1 inline-flex bg-bg-main/50">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} variant="pill" />
      </div>

      {/* Content Area */}
      <div className="mt-2">
        {activeTab === 'overview' && <DashboardOverview department={selectedDept} />}
        {activeTab === 'alerts' && <AlertsCenter department={selectedDept} />}
        {activeTab === 'approvals' && <ApprovalsInbox department={selectedDept} />}
      </div>

      {/* Filter Drawer */}
      <Drawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        title={t('filter')}
      >
        <div className="flex flex-col h-full">
          <div className="flex-1 space-y-6">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                {t('filter_by_dept')}
              </label>
              <select
                value={tempDept}
                onChange={(e) => setTempDept(e.target.value)}
                className="input-base w-full"
              >
                <option value="">{t('all_departments')}</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-6 border-t border-border-base flex gap-3">
            <button
              onClick={handleApplyFilters}
            className="btn-gradient-primary flex-1 rounded-xl px-4 py-2.5 font-semibold"
            >
              {t('apply_filters')}
            </button>
            <button
              onClick={handleResetFilters}
              className="btn-secondary flex-1"
            >
              {t('reset_filters')}
            </button>
          </div>
        </div>
      </Drawer>
    </div>
  );
};
