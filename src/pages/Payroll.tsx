import React, { useState, useEffect } from 'react';
import { Settings, Play, CheckCircle2, FileText, History } from 'lucide-react';
import { Tabs } from '../components/ui/Tabs';
import { PageHeader } from '../components/ui/PageHeader';
import { PayrollSettings } from '../modules/payroll/PayrollSettings';
import { RunPayroll } from '../modules/payroll/RunPayroll';
import { PayrollReview } from '../modules/payroll/PayrollReview';
import { Payslips } from '../modules/payroll/Payslips';
import { PayrollHistory } from '../modules/payroll/PayrollHistory';
import { useAuth } from '../modules/auth/AuthContext';

export const PayrollPage: React.FC = () => {
  const { user } = useAuth();
  const allTabs = [
    { id: 'settings', label: 'Payroll Settings', icon: <Settings className="w-4 h-4" />, translationKey: 'payroll_settings' as const },
    { id: 'run', label: 'Run Payroll', icon: <Play className="w-4 h-4" />, translationKey: 'process_payroll' as const },
    { id: 'review', label: 'Payroll Review', icon: <CheckCircle2 className="w-4 h-4" />, translationKey: 'payroll_review' as const },
    { id: 'payslips', label: 'Payslips', icon: <FileText className="w-4 h-4" />, translationKey: 'payslips' as const },
    { id: 'history', label: 'Payroll History', icon: <History className="w-4 h-4" />, translationKey: 'payroll_history' as const },
  ];

  const tabs = allTabs.filter(tab => {
    const role = user?.role;
    if (role === 'Employee' || role === 'Occupational Health Officer') return tab.id === 'payslips';
    if (role === 'Department Head') return ['review', 'payslips'].includes(tab.id);
    if (role === 'HR Officer' || role === 'Accountant') return ['review', 'history'].includes(tab.id);
    if (role === 'Payroll Officer') return tab.id !== 'review';
    return true; // Admin, Payroll Officer, Accountant, HR Manager
  });

  const [activeTab, setActiveTab] = useState(tabs[0]?.id || 'payslips');

  useEffect(() => {
    if (!tabs.find(t => t.id === activeTab)) {
      setActiveTab(tabs[0]?.id || 'payslips');
    }
  }, [user?.role, activeTab, tabs]);

  const renderContent = () => {
    // Ensure activeTab is valid for the current user
    const currentTab = tabs.find(t => t.id === activeTab) ? activeTab : tabs[0]?.id;
    
    switch (currentTab) {
      case 'settings':
        return <PayrollSettings />;
      case 'run':
        return <RunPayroll />;
      case 'review':
        return <PayrollReview />;
      case 'payslips':
        return <Payslips />;
      case 'history':
        return <PayrollHistory />;
      default:
        return <PayrollSettings />;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Payroll Management" 
        titleKey="payroll_mgmt"
        subtitle="Manage salary components, process payroll, and view payslips."
        subtitleKey="payroll_subtitle"
      />

      <div className="card-base p-1 inline-flex bg-bg-main/50">
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={setActiveTab}
          variant="pill"
        />
      </div>

      <div className="mt-2">
        {renderContent()}
      </div>
    </div>
  );
};
