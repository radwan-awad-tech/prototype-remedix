import React, { useState, useEffect, useMemo } from 'react';
import { schedulingService } from '../../services/schedulingService';
import { employeeService } from '../../services/employeeService';
import { Employee, ShiftType } from '../../types';
import { ChevronLeft, ChevronRight, Plus, AlertTriangle, ShieldAlert } from 'lucide-react';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { useTranslation } from '../../hooks/useTranslation';
import { useAuth } from '../auth/AuthContext';

export const ShiftsCalendar: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [shiftTypes, setShiftTypes] = useState<ShiftType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<'Day' | 'Week' | 'Month'>('Week');
  const [status, setStatus] = useState<'Draft' | 'Published'>('Draft');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dept = user?.role === 'Department Head' ? user?.department : undefined;
        const [empResponse, shiftResponse] = await Promise.all([
          employeeService.listEmployees(dept),
          schedulingService.listShiftTypes()
        ]);
        if (empResponse.success) {
          let filteredEmps = empResponse.data;
          
          // Role-based filtering
          if (user?.role === 'Employee') {
            filteredEmps = filteredEmps.filter(e => e.id === user.id);
          }
          
          setEmployees(filteredEmps);
        }
        if (shiftResponse.success) {
          setShiftTypes(shiftResponse.data);
        }
      } catch (error) {
        console.error('Failed to fetch scheduling data', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [user]);

  // Mock days for a week
  const days = ['Mon 04', 'Tue 05', 'Wed 06', 'Thu 07', 'Fri 08', 'Sat 09', 'Sun 10'];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-280px)]">
        <div className="w-8 h-8 border-4 border-brand-primary-start border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex gap-6 h-[calc(100vh-280px)]">
      {/* Main Calendar Area */}
      <div className="flex-1 flex flex-col card-base overflow-hidden">
        {/* Calendar Header */}
        <div className="p-4 border-b border-border-base flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 p-1 bg-bg-main rounded-lg">
              {['Day', 'Week', 'Month'].map(v => (
                <button
                  key={v}
                  onClick={() => setView(v as any)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                    view === v ? 'bg-white shadow-sm text-brand-primary-end' : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {v ? t(v.toLowerCase() as any) : ''}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-bg-main rounded-lg border border-border-base text-text-secondary"><ChevronLeft className="w-4 h-4" /></button>
              <span className="text-sm font-bold text-text-primary">Mar 04 - Mar 10, 2024</span>
              <button className="p-2 hover:bg-bg-main rounded-lg border border-border-base text-text-secondary"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-100 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">{t('draft_mode')}</span>
            </div>
            <button className="btn-gradient-primary px-4 py-2 rounded-lg text-sm font-medium">
              {t('publish_schedule')}
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="flex-1 overflow-auto custom-scrollbar">
          <table className="w-full border-collapse">
            <thead className="sticky top-0 z-10 bg-white">
              <tr>
                <th className="p-4 border-b border-r border-border-base bg-bg-main/30 w-64 text-left text-xs font-bold text-text-secondary uppercase tracking-widest">
                  {t('employee')}
                </th>
                {days.map(day => (
                  <th key={day} className="p-4 border-b border-r border-border-base min-w-[120px] text-center">
                    <p className="text-xs font-bold text-text-primary">{day}</p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {employees.map((emp, idx) => (
                <tr key={emp.id} className="group hover:bg-bg-main/10">
                  <td className="p-4 border-b border-r border-border-base sticky left-0 bg-white group-hover:bg-bg-main/10 z-[5]">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-brand-primary-start/10 text-brand-primary-end flex items-center justify-center text-xs font-bold">
                        {emp.firstName[0]}{emp.lastName[0]}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-text-primary">{emp.firstName} {emp.lastName}</p>
                        <p className="text-[10px] text-text-secondary">{emp.position}</p>
                      </div>
                    </div>
                  </td>
                  {days.map((day, dIdx) => {
                    const hasShift = (idx + dIdx) % 3 === 0;
                    const shiftType = shiftTypes[dIdx % 3] || shiftTypes[0];
                    if (!shiftType) return <td key={day} className="p-2 border-b border-r border-border-base relative group/cell" />;
                    return (
                      <td key={day} className="p-2 border-b border-r border-border-base relative group/cell">
                        {hasShift ? (
                          <div className={`p-2 rounded-lg border text-xs font-medium cursor-pointer transition-all hover:scale-105 hover:shadow-md ${
                            shiftType.code === 'MOR' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' :
                            shiftType.code === 'EVE' ? 'bg-blue-50 border-blue-100 text-blue-700' :
                            'bg-brand-primary-start/10 border-brand-primary-start/20 text-brand-primary-end'
                          }`}>
                            <div className="flex items-center justify-between mb-1">
                              <span>{shiftType.code}</span>
                              <span className="text-[10px] opacity-70">{shiftType.startTime}</span>
                            </div>
                            <p className="text-[9px] truncate">{shiftType.name}</p>
                          </div>
                        ) : (
                          <button className="w-full h-12 rounded-lg border-2 border-dashed border-transparent hover:border-border-base hover:bg-bg-main/50 flex items-center justify-center transition-all opacity-0 group-cell-hover:opacity-100">
                            <Plus className="w-4 h-4 text-text-secondary" />
                          </button>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right Panels */}
      <div className="w-80 flex flex-col gap-6">
        {/* Coverage Panel */}
        <div className="card-base p-5 flex flex-col">
          <h3 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-brand-primary-end" />
            {t('coverage_analysis')}
          </h3>
          <div className="space-y-4">
            <div className="p-3 bg-bg-main rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-text-secondary">{t('overall_coverage')}</span>
                <span className="text-xs font-bold text-emerald-600">92%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: '92%' }} />
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">{t('understaffed_shifts')}</p>
              <div className="p-3 border border-rose-100 bg-rose-50 rounded-xl">
                <p className="text-xs font-bold text-rose-800">Night Shift • Wed 06</p>
                <p className="text-[10px] text-rose-700 mt-1">Missing 2 Nurses</p>
                <button className="mt-2 text-[10px] font-bold text-rose-600 hover:underline">{t('quick_assign')}</button>
              </div>
            </div>
          </div>
        </div>

        {/* Conflicts Panel */}
        <div className="card-base p-5 flex flex-col">
          <h3 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            {t('conflicts_detected')}
          </h3>
          <div className="space-y-3">
            <div className="p-3 border border-amber-100 bg-amber-50 rounded-xl">
              <p className="text-xs font-bold text-amber-800">{t('leave_overlap')}</p>
              <p className="text-[10px] text-amber-700 mt-1">John Doe assigned to MOR on Fri 08 while on Annual Leave.</p>
            </div>
            <div className="p-3 border border-border-base rounded-xl">
              <p className="text-xs font-bold text-text-primary">{t('policy_violation')}</p>
              <p className="text-[10px] text-text-secondary mt-1">Jane Smith exceeds 48h/week limit.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
