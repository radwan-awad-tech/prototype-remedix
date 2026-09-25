import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Clock, LogIn, LogOut, AlertCircle, Calendar } from 'lucide-react';
import { useToast } from '../../components/ui/Toast';
import { useTranslation } from '../../hooks/useTranslation';
import { attendanceService } from '../../services/attendanceService';
import { useAuth } from '../auth/AuthContext';
import { AttendanceRecord } from '../../types';

export const CheckInOut: React.FC = () => {
  const { t, language } = useTranslation();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [status, setStatus] = useState<'checked_out' | 'checked_in'>('checked_out');
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  const [punch, setPunch] = useState<AttendanceRecord | null>(null);
  const [busy, setBusy] = useState(false);
  const { user } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    attendanceService.getTodayPunch().then(response => {
      if (response.success && response.data) {
        setPunch(response.data);
        setStatus(response.data.checkOut ? 'checked_out' : 'checked_in');
        setCheckInTime(new Date(response.data.checkIn!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      }
    });
  }, []);

  const handleCheckIn = () => {
    setBusy(true);
    void attendanceService.clockIn().then(response => {
      if (!response.success) throw new Error(response.message);
      setPunch(response.data); setStatus('checked_in');
      setCheckInTime(new Date(response.data.checkIn!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      showToast(response.data.lateMinutes ? t('check_in_success_late') : t('check_in_success'), response.data.lateMinutes ? 'info' : 'success');
    }).catch(error => showToast(error.message || (language === 'ar' ? 'تعذر تسجيل الدخول.' : 'Could not record clock-in.'), 'error')).finally(() => setBusy(false));
  };

  const handleCheckOut = () => {
    if (status === 'checked_out') return;
    setBusy(true);
    void attendanceService.clockOut().then(response => {
      if (!response.success) throw new Error(response.message);
      setPunch(response.data); setStatus('checked_out'); showToast(t('check_out_success'), 'success');
    }).catch(error => showToast(error.message || (language === 'ar' ? 'تعذر تسجيل الخروج.' : 'Could not record clock-out.'), 'error')).finally(() => setBusy(false));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Today's Shift Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-primary-start/10 rounded-lg text-brand-primary-end">
              <Calendar size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{t('todays_schedule')}</h3>
              <p className="text-sm text-gray-500">{currentTime.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', { weekday: 'long', month: 'long', day: 'numeric' })}{user?.department ? ` · ${user.department}` : ''}</p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${status === 'checked_in' ? 'bg-brand-muted-teal text-brand-deep-teal' : 'bg-gray-100 text-gray-600'}`}>
            {status === 'checked_in' ? t('checked_in') : t('checked_out')}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
            <p className="text-xs text-gray-500 mb-1">{t('assigned_shift')}</p>
            <p className="font-medium text-gray-900">{t('morning_shift')}</p>
            <p className="text-sm text-brand-primary-end font-medium">08:00 - 16:00</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
            <p className="text-xs text-gray-500 mb-1">{t('check_in_time')}</p>
            <p className="font-medium text-gray-900">{checkInTime || '--:--'}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
            <p className="text-xs text-gray-500 mb-1">{t('current_duration')}</p>
            <p className="font-medium text-gray-900">{punch?.checkOut ? `${punch.totalHours}${t('hours_short')}` : status === 'checked_in' && punch?.checkIn ? `${Math.floor((currentTime.getTime() - new Date(punch.checkIn).getTime()) / 3600000)}${t('hours_short')} ${Math.floor(((currentTime.getTime() - new Date(punch.checkIn).getTime()) % 3600000) / 60000)}${t('minutes_short')}` : `0${t('hours_short')} 0${t('minutes_short')}`}</p>
          </div>
        </div>
      </motion.div>

      {/* Action Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col items-center text-center space-y-6"
        >
          <div className="w-24 h-24 rounded-full bg-brand-primary-start/10 flex items-center justify-center text-brand-primary-end">
            <Clock size={48} className="animate-pulse" />
          </div>
          <div>
            <h2 className="text-4xl font-bold text-gray-900 tracking-tight">
              {currentTime.toLocaleTimeString(language === 'ar' ? 'ar-SA' : 'en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </h2>
            <p className="text-gray-500 mt-2">{t('current_system_time')}</p>
          </div>
          
          <div className="flex gap-4 w-full">
            <button
              onClick={handleCheckIn}
              disabled={status === 'checked_in' || !!punch?.checkIn || busy}
              className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-semibold transition-all ${
                status === 'checked_in' 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'btn-gradient-primary shadow-lg shadow-brand-primary-start/20'
              }`}
            >
              <LogIn size={20} />
              {t('check_in')}
            </button>
            <button
              onClick={handleCheckOut}
              disabled={status === 'checked_out' || busy}
              className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-semibold transition-all ${
                status === 'checked_out' 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-white border-2 border-rose-100 text-rose-600 hover:bg-rose-50'
              }`}
            >
              <LogOut size={20} />
              {t('check_out')}
            </button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-amber-50 rounded-2xl p-8 border border-amber-100 space-y-4"
        >
          <div className="flex items-center gap-2 text-amber-700 font-semibold">
            <AlertCircle size={20} />
            <h3>{t('attendance_reminders')}</h3>
          </div>
          <ul className="space-y-3 text-sm text-amber-800">
            <li className="flex gap-2">
              <span className="font-bold">•</span>
              <span>{t('reminder_checkout')}</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold">•</span>
              <span>{t('reminder_late')}</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold">•</span>
              <span>{t('reminder_missing')}</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold">•</span>
              <span>{t('reminder_policy')}</span>
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};
