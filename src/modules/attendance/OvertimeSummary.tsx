import React, { useState, useEffect } from 'react';
import { Download, Send, Filter } from 'lucide-react';
import { DataTable } from '../../components/ui/DataTable';
import { attendanceService } from '../../services/attendanceService';
import { RoleType } from '../../types';
import { useToast } from '../../components/ui/Toast';
import { useTranslation } from '../../hooks/useTranslation';

interface OvertimeSummaryProps {
  userRole: RoleType;
}

export const OvertimeSummary: React.FC<OvertimeSummaryProps> = ({ userRole }) => {
  const { t } = useTranslation();
  const [monthFilter, setMonthFilter] = useState('2026-03');
  const [departmentFilter, setDepartmentFilter] = useState('All Departments');
  const [summaryData, setSummaryData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchSummary = async () => {
      setIsLoading(true);
      try {
        const response = await attendanceService.getAttendanceSummary(monthFilter, departmentFilter === 'All Departments' ? undefined : departmentFilter);
        if (response.success) {
          setSummaryData(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch attendance summary', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSummary();
  }, [monthFilter, departmentFilter]);

  const handleSendToPayroll = () => {
    showToast('Attendance summary sent to Payroll module successfully.', 'success');
  };

  const columns = [
    { header: t('employee'), accessor: 'employeeName' },
    { header: t('department'), accessor: 'department' },
    { header: t('total_worked'), accessor: (row: any) => `${row.totalWorked}${t('hours_short')}` },
    { header: t('overtime'), accessor: (row: any) => (
      <span className={row.totalOvertime > 0 ? 'text-emerald-600 font-bold' : ''}>{row.totalOvertime}{t('hours_short')}</span>
    )},
    { header: `${t('late')} (${t('minutes_short')})`, accessor: (row: any) => (
      <span className={row.totalLate > 30 ? 'text-rose-600 font-bold' : ''}>{row.totalLate}{t('minutes_short')}</span>
    )},
    { header: t('missing_checkouts'), accessor: (row: any) => (
      <span className={row.missingCheckouts > 0 ? 'text-amber-600 font-bold' : ''}>{row.missingCheckouts}</span>
    )},
    { header: t('absences'), accessor: (row: any) => (
      <span className={row.absences > 0 ? 'text-rose-600 font-bold' : ''}>{row.absences}</span>
    )},
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-400" />
            <input 
              type="month" 
              className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary-start/20"
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
            />
          </div>
          <select 
            className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary-start/20"
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
          >
            <option value="All Departments">{t('reports_all_departments')}</option>
            <option value="Emergency">{t('emergency')}</option>
            <option value="Nursing">{t('nursing')}</option>
            <option value="Radiology">{t('radiology')}</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all text-sm font-medium">
            <Download size={18} />
            {t('export_csv')}
          </button>
          {userRole === 'HR Manager' && (
            <button 
              onClick={handleSendToPayroll}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all text-sm font-medium shadow-sm"
            >
              <Send size={18} />
              {t('send_to_payroll')}
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
          <h3 className="font-semibold text-gray-900">{t('attendance_monthly_summary')}</h3>
          <p className="text-xs text-gray-500">{t('attendance_manual_entry_hint')}</p>
        </div>
        <DataTable
          columns={columns}
          data={summaryData}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};
