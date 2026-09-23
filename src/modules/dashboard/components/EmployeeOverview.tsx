import React, { useEffect, useState, useMemo } from 'react';
import { Clock, Calendar, TrendingUp, LogIn, LogOut, FileText, PlusCircle, AlertCircle } from 'lucide-react';
import { useTranslation } from '../../../hooks/useTranslation';
import { DashboardWidget } from './DashboardWidget';
import { useNavigation } from '../../../context/NavigationContext';
import { ForceLTR } from '../../../components/ForceLTR';
import { KPICard } from '../../../components/ui/KPICard';
import { useAuth } from '../../auth/AuthContext';
import { leaveService } from '../../../services/leaveService';
import { attendanceService } from '../../../services/attendanceService';
import { schedulingService } from '../../../services/schedulingService';
import { payrollService } from '../../../services/payrollService';
import { dashboardService } from '../../../services/dashboardService';
import { LeaveBalance, LeaveRequest, AttendanceRecord, ScheduleAssignment, Payslip, Alert } from '../../../types';

export const EmployeeOverview: React.FC = () => {
  const { t } = useTranslation();
  const { navigate } = useNavigation();
  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [leaveBalance, setLeaveBalance] = useState<LeaveBalance | null>(null);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [nextShift, setNextShift] = useState<ScheduleAssignment | null>(null);
  const [recentPayslip, setRecentPayslip] = useState<Payslip | null>(null);
  const [recentAlerts, setRecentAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      if (!user?.id) return;
      setIsLoading(true);
      try {
        const [balancesRes, leavesRes, attendanceRes, correctionsRes, scheduleRes, payslipsRes, alertsRes] = await Promise.all([
          leaveService.listLeaveBalances(),
          leaveService.listLeaveRequests(),
          attendanceService.listAttendanceRecords(),
          attendanceService.listAttendanceCorrections(),
          schedulingService.listScheduleAssignments(new Date().toISOString(), new Date().toISOString()),
          payrollService.listPayslips({ employeeId: user.id }),
          dashboardService.listAlerts()
        ]);

        if (balancesRes.success) {
          setLeaveBalance(balancesRes.data.find(b => b.employeeId === user.id) || null);
        }
        
        let totalPending = 0;
        if (leavesRes.success) {
          totalPending += leavesRes.data.filter(l => l.employeeId === user.id && l.status === 'Pending').length;
        }
        if (correctionsRes.success) {
          totalPending += correctionsRes.data.filter(c => c.employeeId === user.id && c.status === 'Pending').length;
        }
        setPendingRequestsCount(totalPending);

        if (attendanceRes.success) {
          setAttendanceRecords(attendanceRes.data.filter(a => a.employeeId === user.id));
        }
        if (scheduleRes.success) {
          const userShifts = scheduleRes.data.filter(s => s.employeeId === user.id);
          // Sort by date ascending to find the earliest upcoming shift
          const sortedShifts = [...userShifts].sort((a, b) => a.date.localeCompare(b.date));
          setNextShift(sortedShifts[0] || null);
        }
        if (payslipsRes.success) {
          // Sort by period descending to get the most recent payslip
          const sortedPayslips = [...payslipsRes.data].sort((a, b) => b.period.localeCompare(a.period));
          setRecentPayslip(sortedPayslips[0] || null);
        }
        if (alertsRes.success) {
          // Sort by date descending to get the most recent alerts
          const sortedAlerts = [...alertsRes.data].sort((a, b) => b.date.localeCompare(a.date));
          setRecentAlerts(sortedAlerts.slice(0, 3));
        }
      } catch (error) {
        console.error('Failed to fetch employee dashboard data', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployeeData();
  }, [user?.id]);

  const attendanceRate = useMemo(() => {
    if (attendanceRecords.length === 0) return 100;
    const okRecords = attendanceRecords.filter(r => r.status === 'OK' || r.status === 'Late').length;
    return (okRecords / attendanceRecords.length) * 100;
  }, [attendanceRecords]);

  const todayAttendance = useMemo(() => {
    // Sort by date descending to get the most recent record
    const sorted = [...attendanceRecords].sort((a, b) => b.date.localeCompare(a.date));
    return sorted[0] || null;
  }, [attendanceRecords]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary-end"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            {t('welcome_back')}, {user?.name}
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button 
          onClick={() => navigate('/attendance')}
          className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-border-base hover:border-brand-primary-start hover:shadow-sm transition-all group"
        >
          <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center mb-2 group-hover:bg-emerald-100 transition-colors">
            <LogIn className="w-5 h-5 text-emerald-600" />
          </div>
          <span className="text-xs font-bold text-text-primary">{t('clock_in')}</span>
        </button>
        <button 
          onClick={() => navigate('/attendance')}
          className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-border-base hover:border-brand-primary-start hover:shadow-sm transition-all group"
        >
          <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center mb-2 group-hover:bg-rose-100 transition-colors">
            <LogOut className="w-5 h-5 text-rose-600" />
          </div>
          <span className="text-xs font-bold text-text-primary">{t('check_out')}</span>
        </button>
        <button 
          onClick={() => navigate('/leaves')}
          className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-border-base hover:border-brand-primary-start hover:shadow-sm transition-all group"
        >
          <div className="w-10 h-10 rounded-full bg-brand-primary-start/10 flex items-center justify-center mb-2 group-hover:bg-brand-primary-start/20 transition-colors">
            <PlusCircle className="w-5 h-5 text-brand-primary-end" />
          </div>
          <span className="text-xs font-bold text-text-primary">{t('request_leave')}</span>
        </button>
        <button 
          onClick={() => navigate('/payroll')}
          className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-border-base hover:border-brand-primary-start hover:shadow-sm transition-all group"
        >
          <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center mb-2 group-hover:bg-amber-100 transition-colors">
            <FileText className="w-5 h-5 text-amber-600" />
          </div>
          <span className="text-xs font-bold text-text-primary">{t('view_payslip')}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard 
          title={t('my_attendance_rate')} value={<ForceLTR>{attendanceRate.toFixed(1)}%</ForceLTR>} 
          change={{ value: 0.2, isPositive: true }} 
          icon={<TrendingUp className="w-5 h-5" />} 
          onClick={() => navigate('/attendance')}
          className="cursor-pointer hover:shadow-md transition-shadow"
        />
        <KPICard 
          title={t('remaining_leaves')} value={<ForceLTR>{leaveBalance?.annual || 0}</ForceLTR>} 
          icon={<Calendar className="w-5 h-5" />} 
          onClick={() => navigate('/leaves')}
          className="cursor-pointer hover:shadow-md transition-shadow"
        />
        <KPICard 
          title={t('pending_requests')} value={<ForceLTR>{pendingRequestsCount}</ForceLTR>} 
          icon={<Clock className="w-5 h-5" />} 
          onClick={() => navigate('/leaves')}
          className="cursor-pointer hover:shadow-md transition-shadow"
        />
        <KPICard 
          title={t('next_shift')} value={<ForceLTR>{nextShift?.shiftTypeName || t('no_shift_scheduled')}</ForceLTR>} 
          icon={<Clock className="w-5 h-5 text-brand-primary-end" />} 
          onClick={() => navigate('/scheduling')}
          className="cursor-pointer hover:shadow-md transition-shadow"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <DashboardWidget 
          title={t('my_recent_activity')}
          actions={
            <button 
              onClick={() => navigate('/attendance')}
              className="text-[10px] font-bold text-brand-primary-end hover:underline"
            >
              {t('view_all')}
            </button>
          }
        >
          <div className="space-y-4">
            {todayAttendance && (
              <div 
                onClick={() => navigate('/attendance')}
                className="flex items-center justify-between p-3 bg-bg-main rounded-lg cursor-pointer hover:bg-bg-main/80 transition-colors"
              >
                <span className="text-sm text-text-secondary">{t('clock_in')} - {todayAttendance.date}</span>
                <span className="text-sm font-bold text-text-primary"><ForceLTR>{todayAttendance.checkIn}</ForceLTR></span>
              </div>
            )}
            {recentAlerts.map(alert => (
              <div 
                key={alert.id}
                onClick={() => {
                  if (alert.relatedModule) {
                    navigate(`/${alert.relatedModule}`);
                  } else {
                    navigate('/dashboard');
                  }
                }}
                className="flex items-center justify-between p-3 bg-bg-main rounded-lg cursor-pointer hover:bg-bg-main/80 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <AlertCircle className={`w-4 h-4 ${alert.severity === 'High' ? 'text-rose-500' : 'text-amber-500'}`} />
                  <span className="text-sm text-text-secondary truncate max-w-[200px]">{alert.message}</span>
                </div>
                <span className="text-[10px] text-text-secondary">{alert.date}</span>
              </div>
            ))}
            {recentPayslip && (
              <div 
                onClick={() => navigate('/payroll')}
                className="flex items-center justify-between p-3 bg-bg-main rounded-lg cursor-pointer hover:bg-bg-main/80 transition-colors"
              >
                <span className="text-sm text-text-secondary">{t('payslip_available')} - {recentPayslip.period}</span>
                <span className="text-sm font-bold text-brand-primary-end underline">{t('view')}</span>
              </div>
            )}
            {!todayAttendance && !recentPayslip && recentAlerts.length === 0 && (
              <p className="text-sm text-text-secondary text-center py-4 italic">{t('no_recent_activity')}</p>
            )}
          </div>
        </DashboardWidget>

        <DashboardWidget title={t('upcoming_events')}>
          <div className="space-y-3">
            <div className="p-3 border border-border-base rounded-lg">
              <p className="text-xs font-bold text-text-primary">{t('team_meeting')}</p>
              <p className="text-[10px] text-text-secondary mt-1">{t('tomorrow')} • 10:00 AM</p>
            </div>
            <div className="p-3 border border-border-base rounded-lg">
              <p className="text-xs font-bold text-text-primary">{t('hospital_anniversary')}</p>
              <p className="text-[10px] text-text-secondary mt-1">
                {new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric' })} • {t('all_day')}
              </p>
            </div>
          </div>
        </DashboardWidget>
      </div>
    </div>
  );
};
