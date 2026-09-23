import React, { useState } from 'react';
import { Tabs } from '../components/ui/Tabs';
import { PageHeader } from '../components/ui/PageHeader';
import { LeaveRequests } from '../modules/leaves/LeaveRequests';
import { LeaveCalendar } from '../modules/leaves/LeaveCalendar';
import { LeaveBalances } from '../modules/leaves/LeaveBalances';
import { LeavePolicies } from '../modules/leaves/LeavePolicies';
import { FileText, Calendar, Wallet, Settings } from 'lucide-react';
import { useAuth } from '../modules/auth/AuthContext';

import { useTranslation } from '../hooks/useTranslation';

export const LeavesPage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('requests');

  if (!user) return null;

  const tabs = [
    { id: 'requests', label: 'Leave Requests', icon: <FileText className="w-4 h-4" />, translationKey: 'leave_requests' as const },
    { id: 'calendar', label: 'Leave Calendar', icon: <Calendar className="w-4 h-4" />, translationKey: 'leave_calendar' as const },
    { id: 'balances', label: 'Leave Balances', icon: <Wallet className="w-4 h-4" />, translationKey: 'leave_balances' as const },
    { id: 'policies', label: 'Types & Policies', icon: <Settings className="w-4 h-4" />, translationKey: 'types_policies' as const },
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Leave Management" 
        titleKey="leave_mgmt"
        subtitle="Track, approve, and manage employee leave requests and balances."
        subtitleKey="leave_subtitle"
      />

      {/* Tabs Navigation */}
      <div className="card-base p-1 inline-flex bg-bg-main/50">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} variant="pill" />
      </div>

      {/* Content Area */}
      <div className="mt-2">
        {activeTab === 'requests' && <LeaveRequests currentRole={user.role} currentUser={user} />}
        {activeTab === 'calendar' && <LeaveCalendar currentRole={user.role} currentUserId={user.id} />}
        {activeTab === 'balances' && <LeaveBalances currentRole={user.role} />}
        {activeTab === 'policies' && <LeavePolicies />}
      </div>
    </div>
  );
};
