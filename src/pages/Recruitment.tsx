import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import JobOpenings from '../modules/recruitment/JobOpenings';
import CandidatePipeline from '../modules/recruitment/CandidatePipeline';
import Interviews from '../modules/recruitment/Interviews';
import Offers from '../modules/recruitment/Offers';
import { Tabs } from '../components/ui/Tabs';
import { PageHeader } from '../components/ui/PageHeader';
import { useAuth } from '../modules/auth/AuthContext';
import { useTranslation } from '../hooks/useTranslation';

const RecruitmentPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('Job Openings');

  const allTabs = [
    { id: 'Job Openings', label: t('recruitment_job_openings'), translationKey: 'job_openings' as const, roles: ['*'] },
    { id: 'Pipeline', label: t('recruitment_candidate_pipeline'), translationKey: 'candidates' as const, roles: ['Senior Manager', 'HR Manager', 'HR Officer', 'System Admin', 'Department Head'] },
    { id: 'Interviews', label: t('recruitment_interviews'), translationKey: 'interviews' as const, roles: ['Senior Manager', 'HR Manager', 'HR Officer', 'System Admin', 'Department Head'] },
    { id: 'Offers', label: t('recruitment_offers'), translationKey: 'offers' as const, roles: ['Senior Manager', 'HR Manager', 'HR Officer', 'System Admin'] },
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
      case 'Job Openings':
        return <JobOpenings onNavigateToPipeline={() => setActiveTab('Pipeline')} />;
      case 'Pipeline':
        return <CandidatePipeline />;
      case 'Interviews':
        return <Interviews />;
      case 'Offers':
        return <Offers />;
      default:
        return <JobOpenings onNavigateToPipeline={() => setActiveTab('Pipeline')} />;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Recruitment" 
        titleKey="recruitment"
        subtitle="Manage internal job openings, candidates, and hiring process."
        subtitleKey="recruitment_subtitle"
      />

      <Tabs 
        tabs={tabs} 
        activeTab={activeTab} 
        onChange={setActiveTab} 
        variant="pill"
      />

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="mt-2"
      >
        {renderContent()}
      </motion.div>
    </div>
  );
};

export default RecruitmentPage;
