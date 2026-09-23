import React, { useState } from 'react';
import { Tabs } from '../components/ui/Tabs';
import { PageHeader } from '../components/ui/PageHeader';
import { CheckInOut } from '../modules/attendance/CheckInOut';
import { AttendanceLog } from '../modules/attendance/AttendanceLog';
import { CorrectionRequests } from '../modules/attendance/CorrectionRequests';
import { OvertimeSummary } from '../modules/attendance/OvertimeSummary';
import { RoleType } from '../types';

interface AttendancePageProps {
  userRole?: RoleType;
}

export const AttendancePage: React.FC<AttendancePageProps> = ({ userRole = 'HR Manager' }) => {
  const allTabs = [
    { id: 'check-in', label: 'Check-in / Out', translationKey: 'check_in_out' as const },
    { id: 'log', label: 'Attendance Log', translationKey: 'attendance_log' as const },
    { id: 'corrections', label: 'Correction Requests', translationKey: 'correction_requests' as const },
    { id: 'summary', label: 'Overtime & Late Summary', translationKey: 'overtime_late_summary' as const },
  ];

  const tabs = allTabs.filter(tab => {
    if (userRole === 'Employee') return ['check-in', 'log', 'corrections'].includes(tab.id);
    return true;
  });

  const [activeTab, setActiveTab] = useState(userRole === 'Employee' ? 'check-in' : 'log');

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Attendance Management" 
        titleKey="attendance_mgmt"
        subtitle="Track daily attendance, manage corrections, and monitor overtime."
        subtitleKey="attendance_subtitle"
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
