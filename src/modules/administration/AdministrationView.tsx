import React, { useState, useEffect } from 'react';
import { Settings, Users, Network, History, ShieldCheck, AlertCircle, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AdminTab } from './types';
import { SettingsPlaceholder } from './components/SettingsPlaceholder';
import { UsersAccessPlaceholder } from './components/UsersAccessPlaceholder';
import { OrgStructurePlaceholder } from './components/OrgStructurePlaceholder';
import { AuditLogTable } from './components/AuditLogTable';
import { useTranslation } from '../../hooks/useTranslation';
import { PageHeader } from '../../components/ui/PageHeader';
import { Tabs } from '../../components/ui/Tabs';
import { useAuth } from '../auth/AuthContext';

export const AdministrationView: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('audit');

  const isAdmin = ['Senior Manager', 'System Admin'].includes(user?.role || '');

  const tabs = [
    { id: 'settings', label: 'System Settings', icon: <Settings className="w-4 h-4" />, translationKey: 'system_settings' as const },
    { id: 'users', label: 'Users & Access', icon: <Users className="w-4 h-4" />, translationKey: 'users_access' as const },
    { id: 'org', label: 'Org Structure', icon: <Network className="w-4 h-4" />, translationKey: 'org_structure' as const },
    { id: 'audit', label: 'Audit & Activity Log', icon: <History className="w-4 h-4" />, translationKey: 'audit_log' as const },
  ];

  const headerActions = (
    <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-widest border border-emerald-100">
      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
      {t('system_status_healthy')}
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Administration Console" 
        titleKey="admin_console"
        subtitle="Configure system-wide settings, manage user access, define organizational hierarchy, and monitor system activity."
        subtitleKey="admin_subtitle"
        actions={headerActions}
      />

      <div className="card-base p-1 inline-flex bg-bg-main/50">
        <Tabs 
          tabs={tabs} 
          activeTab={activeTab} 
          onChange={(id) => setActiveTab(id as AdminTab)} 
          variant="pill"
        />
      </div>

      {/* Content Section */}
      <div className="relative min-h-[500px] mt-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'settings' && <SettingsPlaceholder />}
            {activeTab === 'users' && <UsersAccessPlaceholder />}
            {activeTab === 'org' && <OrgStructurePlaceholder />}
            {activeTab === 'audit' && <AuditLogTable />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer Info */}
      <div className="pt-6 border-t border-border-base flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-[10px] text-text-secondary font-medium uppercase tracking-widest">
          {t('version')}: 2.4.0-hospital-stable
        </div>
        <div className="flex items-center gap-2 text-text-secondary">
          <AlertCircle className="w-3.5 h-3.5" />
          <span className="text-[10px] font-medium uppercase tracking-widest">
            {t('access_restricted_admin_hr')}
          </span>
        </div>
      </div>
    </div>
  );
};
