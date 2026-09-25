import React, { useState, useEffect } from 'react';
import { EvaluationTemplates } from '../modules/performance/EvaluationTemplates';
import { EvaluationCycles } from '../modules/performance/EvaluationCycles';
import { EvaluationRecords } from '../modules/performance/EvaluationRecords';
import { PerformanceAnalytics } from '../modules/performance/PerformanceAnalytics';
import { Tabs } from '../components/ui/Tabs';
import { PageHeader } from '../components/ui/PageHeader';
import { useAuth } from '../modules/auth/AuthContext';

const PerformancePage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('Employee Reviews');

  const allTabs = [
    { id: 'Evaluation Forms', label: 'Evaluation Forms', translationKey: 'eval_templates' as const, roles: ['Senior Manager', 'HR Manager', 'HR Officer', 'System Admin'] },
    { id: 'Evaluation Cycles', label: 'Evaluation Cycles', translationKey: 'eval_cycles' as const, roles: ['Senior Manager', 'HR Manager', 'HR Officer', 'System Admin'] },
    { id: 'Employee Reviews', label: 'Employee Reviews', translationKey: 'employee_reviews' as const, roles: ['*'] },
    { id: 'Results & Analytics', label: 'Results & Analytics', translationKey: 'results_analytics' as const, roles: ['Senior Manager', 'HR Manager', 'HR Officer', 'System Admin', 'Department Head'] },
  ];

  const tabs = allTabs.filter(tab => 
    tab.roles.includes('*') || (user && tab.roles.includes(user.role))
  );

  useEffect(() => {
    if (tabs.length > 0 && !tabs.find(t => t.id === activeTab)) {
      setActiveTab(tabs[0].id);
    }
  }, [tabs, activeTab]);

  const renderContent = () => {
    switch (activeTab) {
      case 'Evaluation Forms':
        return <EvaluationTemplates />;
      case 'Evaluation Cycles':
        return <EvaluationCycles />;
      case 'Employee Reviews':
        return <EvaluationRecords />;
      case 'Results & Analytics':
        return <PerformanceAnalytics />;
      default:
        return <EvaluationTemplates />;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Performance Management" 
        titleKey="performance_mgmt"
        subtitle="Manage evaluation templates, cycles, and employee performance reviews."
        subtitleKey="performance_subtitle"
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

export default PerformancePage;
