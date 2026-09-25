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
  const { t, language } = useTranslation();
  const [activeTab, setActiveTab] = useState('requests');

  if (!user) return null;

  const isPayrollReader = user.role === 'Payroll Officer';
  const roleHeader = isPayrollReader
    ? { title: language === 'ar' ? 'سجلات الإجازات' : 'Leave records', subtitle: language === 'ar' ? 'اطّلع على طلبات الإجازات والأرصدة ذات الصلة بالرواتب.' : 'View leave requests and balances relevant to payroll.' }
    : user.role === 'Employee'
      ? { title: language === 'ar' ? 'إجازاتي' : 'My leave', subtitle: language === 'ar' ? 'قدّم طلباتك وتابع حالة إجازاتك ورصيدك.' : 'Submit requests and check your leave status and balance.' }
      : user.role === 'Department Head'
        ? { title: language === 'ar' ? 'إجازات القسم' : 'Department leave', subtitle: language === 'ar' ? 'راجع طلبات فريقك وقدّم توصية المرحلة الأولى.' : 'Review team requests and provide the first-stage recommendation.' }
        : user.role === 'HR Officer'
          ? { title: language === 'ar' ? 'مراجعة الإجازات' : 'Leave review', subtitle: language === 'ar' ? 'راجع الطلبات وتابع الأرصدة؛ الاعتماد النهائي للمدير.' : 'Review requests and balances; final approval remains with the HR Manager.' }
          : null;
  const tabs = [
    { id: 'requests', label: 'Leave Requests', icon: <FileText className="w-4 h-4" />, translationKey: 'leave_requests' as const },
    { id: 'calendar', label: 'Leave Calendar', icon: <Calendar className="w-4 h-4" />, translationKey: 'leave_calendar' as const },
    { id: 'balances', label: 'Leave Balances', icon: <Wallet className="w-4 h-4" />, translationKey: 'leave_balances' as const },
    { id: 'policies', label: 'Types & Policies', icon: <Settings className="w-4 h-4" />, translationKey: 'types_policies' as const },
  ].filter(tab => !isPayrollReader || ['requests', 'balances'].includes(tab.id));

  return (
    <div className="space-y-6">
      <PageHeader 
        title={roleHeader?.title || 'Leave Management'}
        titleKey={roleHeader ? undefined : 'leave_mgmt'}
        subtitle={roleHeader?.subtitle}
        subtitleKey={roleHeader ? undefined : 'leave_subtitle'}
      />

      {/* Tabs Navigation */}
      <div className="card-base p-1 inline-flex bg-bg-main/50">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} variant="pill" />
      </div>

      {/* Content Area */}
      <div className="mt-2">
        {activeTab === 'requests' && <LeaveRequests currentRole={user.role} currentUser={user} />}
        {activeTab === 'calendar' && <LeaveCalendar currentRole={user.role} currentUserId={user.employeeId || ''} department={user.department} />}
        {activeTab === 'balances' && <LeaveBalances currentRole={user.role} />}
        {activeTab === 'policies' && <LeavePolicies />}
      </div>
    </div>
  );
};
