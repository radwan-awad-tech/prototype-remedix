import React, { useEffect, useState } from 'react';
import { Tabs } from '../components/ui/Tabs';
import { PageHeader } from '../components/ui/PageHeader';
import { CheckInOut } from '../modules/attendance/CheckInOut';
import { AttendanceLog } from '../modules/attendance/AttendanceLog';
import { CorrectionRequests } from '../modules/attendance/CorrectionRequests';
import { OvertimeSummary } from '../modules/attendance/OvertimeSummary';
import { RoleType } from '../types';
import { useTranslation } from '../hooks/useTranslation';

interface AttendancePageProps {
  userRole?: RoleType;
  canPunch?: boolean;
}

export const AttendancePage: React.FC<AttendancePageProps> = ({ userRole = 'HR Manager', canPunch = false }) => {
  const { language } = useTranslation();
  const allTabs = [
    { id: 'check-in', label: 'Check-in / Out', translationKey: 'check_in_out' as const },
    { id: 'log', label: 'Attendance Log', translationKey: 'attendance_log' as const },
    { id: 'corrections', label: 'Correction Requests', translationKey: 'correction_requests' as const },
    { id: 'summary', label: 'Overtime & Late Summary', translationKey: 'overtime_late_summary' as const },
  ];

  const tabs = allTabs.filter(tab => {
    if (userRole === 'Employee') return ['check-in', 'log', 'corrections'].includes(tab.id);
    if (tab.id === 'check-in') return canPunch;
    if (tab.id === 'summary') return ['Senior Manager', 'HR Manager', 'HR Officer'].includes(userRole);
    if (tab.id === 'corrections') return ['Senior Manager', 'HR Manager', 'HR Officer', 'Department Head', 'Employee'].includes(userRole);
    return true;
  });

  const [activeTab, setActiveTab] = useState(userRole === 'Employee' ? 'check-in' : 'log');
  useEffect(() => {
    if (!tabs.some(tab => tab.id === activeTab)) setActiveTab(tabs[0]?.id || 'log');
  }, [activeTab, tabs]);
  const roleHeader = userRole === 'Employee'
    ? { title: language === 'ar' ? 'حضوري' : 'My attendance', subtitle: language === 'ar' ? 'سجّل حضورك وراجع سجل دوامك الشخصي.' : 'Record your punches and review your own attendance history.' }
    : userRole === 'Department Head'
      ? { title: language === 'ar' ? 'حضور القسم' : 'Department attendance', subtitle: language === 'ar' ? 'راجع دوام فريقك وطلبات تصحيح الحضور ضمن قسمك.' : 'Review your team’s attendance and correction requests within your department.' }
      : userRole === 'Payroll Officer'
        ? { title: language === 'ar' ? 'سجلات الحضور' : 'Attendance records', subtitle: language === 'ar' ? 'سجّل حضورك واطّلع على بيانات الدوام المستخدمة في الرواتب.' : 'Record your own attendance and view workforce time records used for payroll.' }
        : userRole === 'HR Officer'
          ? { title: language === 'ar' ? 'مراجعة الحضور' : 'Attendance review', subtitle: language === 'ar' ? 'راجع سجلات الحضور والتصحيحات ومؤشرات التأخير.' : 'Review attendance records, corrections, and lateness indicators.' }
          : { title: language === 'ar' ? 'إدارة الحضور' : 'Attendance Management', subtitle: language === 'ar' ? 'تابع سجلات الدوام والتصحيحات والإضافي.' : 'Track attendance, corrections, and overtime across the organization.' };

  return (
    <div className="space-y-6">
      <PageHeader 
        title={roleHeader.title}
        titleKey={['Employee', 'Department Head', 'Payroll Officer', 'HR Officer'].includes(userRole) ? undefined : 'attendance_mgmt'}
        subtitle={roleHeader.subtitle}
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
        {activeTab === 'check-in' && <CheckInOut />}
        {activeTab === 'log' && <AttendanceLog userRole={userRole} />}
        {activeTab === 'corrections' && <CorrectionRequests userRole={userRole} />}
        {activeTab === 'summary' && <OvertimeSummary userRole={userRole} />}
      </div>
    </div>
  );
};
