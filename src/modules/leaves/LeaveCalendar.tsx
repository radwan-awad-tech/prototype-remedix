import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MOCK_LEAVE_REQUESTS } from '../../mockData';
import { RoleType } from '../../types';
import { useTranslation } from '../../hooks/useTranslation';

interface LeaveCalendarProps {
  currentRole: RoleType;
  currentUserId: string;
  department?: string;
}

export const LeaveCalendar: React.FC<LeaveCalendarProps> = ({ currentRole, currentUserId, department }) => {
  const { language } = useTranslation();
  const [currentMonth, setCurrentMonth] = useState(new Date(2024, 2, 1)); // March 2024

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  const locale = language === 'ar' ? 'ar-SA' : 'en-US';
  const monthName = currentMonth.toLocaleString(locale, { month: 'long' });
  const year = currentMonth.getFullYear();
  const changeMonth = (offset: number) => setCurrentMonth(month => new Date(month.getFullYear(), month.getMonth() + offset, 1));

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const filteredRequests = MOCK_LEAVE_REQUESTS.filter(req => {
    if (req.status !== 'Approved') return false;
    if (currentRole === 'Employee') return req.employeeId === currentUserId;
    if (currentRole === 'Department Head') return req.department === department;
    return true;
  });

  const getLeavesForDay = (day: number) => {
    const dateStr = `${year}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return filteredRequests.filter(req => {
      return dateStr >= req.startDate && dateStr <= req.endDate;
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-text-primary">{monthName} {year}</h2>
          <div className="flex items-center gap-1">
            <button onClick={() => changeMonth(-1)} aria-label={language === 'ar' ? 'الشهر السابق' : 'Previous month'} className="p-2 hover:bg-bg-main rounded-lg border border-border-base text-text-secondary transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={() => changeMonth(1)} aria-label={language === 'ar' ? 'الشهر التالي' : 'Next month'} className="p-2 hover:bg-bg-main rounded-lg border border-border-base text-text-secondary transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="card-base overflow-hidden">
        <div className="grid grid-cols-7 bg-bg-main/50 border-b border-border-base">
          {Array.from({ length: 7 }, (_, day) => new Date(2024, 2, 3 + day).toLocaleDateString(locale, { weekday: 'short' })).map((d, index) => (
            <div key={`${d}-${index}`} className="p-3 text-center text-[10px] font-bold text-text-secondary uppercase tracking-widest">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {blanks.map(b => (
            <div key={`blank-${b}`} className="min-h-[120px] p-2 border-b border-r border-border-base bg-bg-main/10" />
          ))}
          {days.map(day => {
            const leaves = getLeavesForDay(day);
            return (
              <div key={day} className="min-h-[120px] p-2 border-b border-r border-border-base relative group hover:bg-bg-main/5 transition-colors">
                <span className="text-xs font-bold text-text-secondary">{day}</span>
                <div className="mt-2 space-y-1">
                  {leaves.map((leave, i) => (
                    <div 
                      key={i} 
                      className="px-2 py-1 rounded-md bg-brand-primary-start/10 border border-brand-primary-start/20 text-[9px] font-bold text-brand-primary-end truncate cursor-pointer hover:bg-brand-primary-start/20 transition-all"
                      title={`${leave.employeeName}: ${leave.leaveType}`}
                    >
                      {leave.employeeName}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
