import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, Download, Plus } from 'lucide-react';
import { DataTable } from '../../components/ui/DataTable';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { attendanceService } from '../../services/attendanceService';
import { AttendanceRecord, RoleType } from '../../types';
import { useTranslation } from '../../hooks/useTranslation';
import { useToast } from '../../components/ui/Toast';
import { useAuth } from '../auth/AuthContext';
import { ManualEntryDrawer } from './ManualEntryDrawer';

interface AttendanceLogProps {
  userRole: RoleType;
}

export const AttendanceLog: React.FC<AttendanceLogProps> = ({ userRole }) => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { info } = useToast();
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isManualEntryOpen, setIsManualEntryOpen] = useState(false);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await attendanceService.listAttendanceRecords(
          undefined,
          userRole === 'Department Head' ? user?.department : undefined
        );
        if (response.success) {
          let filteredData = response.data;
          
          // Role-based record-level visibility
          if (userRole === 'Employee') {
            filteredData = filteredData.filter(record => record.employeeId === user?.employeeId);
          }
          
          setAttendance(filteredData);
        }
      } catch (error) {
        console.error('Failed to fetch attendance records', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAttendance();
  }, [userRole, user]);

  const filteredData = useMemo(() => {
    return attendance.filter(record => {
      const matchesSearch = 
        (record.employeeName && record.employeeName.toLowerCase().includes((searchQuery || '').toLowerCase())) ||
        (record.employeeNo && record.employeeNo.toLowerCase().includes((searchQuery || '').toLowerCase()));
      const matchesStatus = statusFilter === 'All' || record.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [attendance, searchQuery, statusFilter]);

  const handleExportAttendance = () => {
    const headers = ['Date', 'Employee No', 'Name', 'Department', 'Check-in', 'Check-out', 'Total Hours', 'Late (min)', 'Status'];
    const rows = filteredData.map(record => [
      record.date,
      record.employeeNo,
      record.employeeName,
      record.department,
      record.checkIn || '--:--',
      record.checkOut || '--:--',
      record.totalHours,
      record.lateMinutes,
      record.status
    ]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `attendance_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    info('Attendance log exported successfully');
  };

  const columns = [
    { header: 'Date', accessor: (row: AttendanceRecord) => row.date, translationKey: 'date' as const },
    { header: 'Employee No', accessor: (row: AttendanceRecord) => row.employeeNo, translationKey: 'employee_no' as const },
    { header: 'Name', accessor: (row: AttendanceRecord) => row.employeeName, translationKey: 'name' as const },
    { header: 'Department', accessor: (row: AttendanceRecord) => row.department, translationKey: 'department' as const },
    { header: 'Check-in', accessor: (row: AttendanceRecord) => row.checkIn || '--:--', translationKey: 'check_in' as const },
    { header: 'Check-out', accessor: (row: AttendanceRecord) => row.checkOut || '--:--', translationKey: 'check_out' as const },
    { header: 'Total Hours', accessor: (row: AttendanceRecord) => `${row.totalHours}h`, translationKey: 'total_hours' as const },
    { header: 'Late (min)', accessor: (row: AttendanceRecord) => row.lateMinutes > 0 ? (
      <span className="text-rose-600 font-medium">{row.lateMinutes}m</span>
    ) : '0m', translationKey: 'late_min' as const },
    { header: 'Status', accessor: (row: AttendanceRecord) => (
      <StatusBadge status={row.status === 'OK' ? 'Approved' : row.status === 'Absent' ? 'Rejected' : 'Pending'} label={row.status} />
    ), translationKey: 'status' as const },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder={t('search_attendance_placeholder')}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary-start/20 focus:border-brand-primary-start transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-400" />
            <select 
              className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary-start/20"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">{t('all_statuses')}</option>
              <option value="OK">{t('ok')}</option>
              <option value="Late">{t('late')}</option>
              <option value="Missing Checkout">{t('missing_checkout')}</option>
              <option value="Absent">{t('absent')}</option>
            </select>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleExportAttendance}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all text-sm font-medium"
          >
            <Download size={18} />
            {t('export')}
          </button>
          {['Senior Manager', 'HR Manager'].includes(userRole) && (
            <button 
              onClick={() => setIsManualEntryOpen(true)}
              className="flex items-center gap-2 px-4 py-2 btn-gradient-primary rounded-lg shadow-sm text-sm font-medium"
            >
              <Plus size={18} />
              {t('manual_entry')}
            </button>
          )}
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredData}
        onRowClick={(row) => console.log('Row clicked:', row)}
        isLoading={isLoading}
      />

      <ManualEntryDrawer
        isOpen={isManualEntryOpen}
        onClose={() => setIsManualEntryOpen(false)}
        onSuccess={(newRecord) => setAttendance(prev => [newRecord, ...prev])}
      />
    </div>
  );
};
