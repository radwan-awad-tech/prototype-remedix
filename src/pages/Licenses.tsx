import React, { useState, useMemo } from 'react';
import { Tabs } from '../components/ui/Tabs';
import { PageHeader } from '../components/ui/PageHeader';
import { QualificationsList } from '../modules/licenses/QualificationsList';
import { VerificationQueue } from '../modules/licenses/VerificationQueue';
import { DocumentCenter } from '../modules/licenses/DocumentCenter';
import { RoleType } from '../types';
import { useTranslation } from '../hooks/useTranslation';
import { useAuth } from '../modules/auth/AuthContext';

interface LicensesPageProps {
  userRole?: RoleType;
}

export const LicensesPage: React.FC<LicensesPageProps> = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('licenses');

  const userRole = user?.role as RoleType || 'Employee';

  const tabs = useMemo(() => {
    const baseTabs = [
      { id: 'licenses', label: t('prof_licenses') },
      { id: 'certifications', label: t('cert_training') },
      { id: 'documents', label: t('document_center') },
    ];

    if (['Senior Manager', 'HR Manager', 'System Admin'].includes(userRole)) {
      baseTabs.splice(2, 0, { id: 'verification', label: t('verification_queue') });
    }

    return baseTabs;
  }, [t, userRole]);

  return (
    <div className="space-y-6">
      <PageHeader 
        title={t('compliance_documents')} 
        subtitle={t('compliance_subtitle')}
      />

      <div className="card-base p-1 inline-flex">
        <Tabs 
          tabs={tabs} 
          activeTab={activeTab} 
          onChange={setActiveTab} 
        />
      </div>

      <div className="mt-2">
        {(activeTab === 'licenses' || activeTab === 'certifications') && (
          <QualificationsList 
            type={activeTab === 'licenses' ? 'License' : 'Certification'} 
            userRole={userRole} 
          />
        )}
        {activeTab === 'verification' && <VerificationQueue userRole={userRole} />}
        {activeTab === 'documents' && <DocumentCenter userRole={userRole} />}
      </div>
    </div>
  );
};
