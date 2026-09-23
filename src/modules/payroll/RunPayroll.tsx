import React, { useState, useEffect } from 'react';
import { Calendar, Calculator, Lock, Unlock, FileText, Download, CheckCircle2, AlertCircle } from 'lucide-react';
import { useToast } from '../../components/ui/Toast';
import { payrollService } from '../../services/payrollService';
import { PayrollRun } from '../../types';

import { useTranslation } from '../../hooks/useTranslation';

export const RunPayroll: React.FC = () => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [currentRun, setCurrentRun] = useState<PayrollRun | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    const fetchRun = async () => {
      try {
        const response = await payrollService.listRuns();
        if (response.success) {
          // For demo, we pick the second one as "current"
          setCurrentRun(response.data[1] || null);
        }
      } catch (error) {
        console.error('Failed to fetch payroll run', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRun();
  }, []);

  const handleImportAttendance = () => {
    showToast(t('attendance_imported_success'), 'success');
    // In a real app, this would trigger a backend process to fetch attendance data
    // and update the payroll run. For now, we just show a success message.
  };

  const handleCalculate = async () => {
    if (!currentRun) return;
    setIsCalculating(true);
    try {
      const response = await payrollService.calculateRun(currentRun.id);
      if (response.success) {
        showToast(t('calc_success'), 'success');
        const runsRes = await payrollService.listRuns();
        if (runsRes.success) {
          setCurrentRun(runsRes.data.find(r => r.id === currentRun.id) || null);
        }
      } else {
        showToast(response.message || t('calc_failed'), 'error');
      }
    } catch (error) {
      showToast(t('calc_failed'), 'error');
    } finally {
      setIsCalculating(false);
    }
  };

  const handleLock = async () => {
    if (currentRun) {
      try {
        const response = await payrollService.lockRun(currentRun.id);
        if (response.success) {
          setCurrentRun({ ...currentRun, status: 'Locked' });
          showToast(t('run_locked_success'), 'success');
        } else {
          showToast(response.message || t('lock_failed'), 'error');
        }
      } catch (error) {
        showToast(t('lock_failed'), 'error');
      }
    }
  };

  const handleUnlock = async () => {
    if (currentRun) {
      try {
        const response = await payrollService.unlockRun(currentRun.id);
        if (response.success) {
          setCurrentRun({ ...currentRun, status: 'Calculated' });
          showToast(t('run_unlocked_success'), 'success');
        } else {
          showToast(response.message || t('unlock_failed'), 'error');
        }
      } catch (error) {
        showToast(t('unlock_failed'), 'error');
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Draft': return 'bg-gray-100 text-gray-700';
      case 'Calculated': return 'bg-brand-primary-start/10 text-brand-primary-end';
      case 'Locked': return 'bg-orange-100 text-orange-700';
      case 'Approved': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleCreateRun = async () => {
    try {
      const response = await payrollService.createRun('march_2024');
      if (response.success) {
        setCurrentRun(response.data);
        showToast(t('run_created_success'), 'success');
      } else {
        showToast(response.message || t('run_create_failed'), 'error');
      }
    } catch (error) {
      showToast(t('run_create_failed'), 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{t('process_payroll')}</h2>
          <p className="text-sm text-gray-500">{t('run_payroll_subtitle')}</p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700">
            <Calendar className="w-4 h-4" />
            {t('february_2024')}
          </div>
          <button 
            onClick={handleCreateRun}
            className="px-4 py-2 btn-gradient-primary rounded-lg text-sm font-medium shadow-sm"
          >
            {t('create_new_run')}
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary-end"></div>
        </div>
      ) : currentRun ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">{t('current_run_status')}</h3>
                  <div className={`mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(currentRun.status)}`}>
                    {currentRun.status === 'Calculated' && <CheckCircle2 className="w-3 h-3" />}
                    {currentRun.status === 'Locked' && <Lock className="w-3 h-3" />}
                    {t(currentRun.status.toLowerCase() as any) || currentRun.status}
                  </div>
                </div>
                <div className="text-end">
                  <p className="text-xs text-gray-500 uppercase">{t('period')}</p>
                  <p className="text-lg font-bold text-gray-900">{t(currentRun.period.toLowerCase() as any)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { label: t('base_salary'), value: `$${currentRun.totalBaseSalary.toLocaleString()}`, color: 'text-gray-900' },
                  { label: t('total_allowances'), value: `$${currentRun.totalAllowances.toLocaleString()}`, color: 'text-green-600' },
                  { label: t('total_deductions'), value: `-$${currentRun.totalDeductions.toLocaleString()}`, color: 'text-red-600' },
                  { label: t('net_payable'), value: `$${currentRun.totalNet.toLocaleString()}`, color: 'text-brand-primary-end' },
                ].map((stat, i) => (
                  <div key={i} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
                    <p className={`text-lg font-bold ${stat.color}`} dir="ltr">{stat.value}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <button 
                  onClick={handleImportAttendance}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  {t('import_attendance')}
                </button>
                <button 
                  onClick={handleCalculate}
                  disabled={isCalculating || currentRun.status === 'Locked'}
                  className="flex items-center gap-2 px-4 py-2 btn-gradient-primary rounded-lg text-sm font-medium shadow-sm disabled:opacity-50"
                >
                  <Calculator className="w-4 h-4" />
                  {isCalculating ? t('calculating') : t('calculate_payroll')}
                </button>
                <button 
                  onClick={handleLock}
                  disabled={currentRun.status !== 'Calculated'}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors disabled:opacity-50"
                >
                  <Lock className="w-4 h-4" />
                  {t('lock_run')}
                </button>
                <button 
                  onClick={handleUnlock}
                  disabled={currentRun.status !== 'Locked'}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  title={t('hr_manager_only')}
                >
                  <Unlock className="w-4 h-4" />
                  {t('unlock_run')}
                </button>
              </div>
            </div>

            <div className="bg-brand-primary-start/10 border border-brand-primary-start/20 p-4 rounded-xl flex gap-3">
              <AlertCircle className="w-5 h-5 text-brand-primary-end shrink-0" />
              <div>
                <p className="text-sm font-medium text-brand-primary-end">{t('next_step_payroll_review')}</p>
                <p className="text-xs text-brand-primary-end/80 mt-1">{t('once_locked_review')}</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">{t('run_checklist')}</h3>
              <div className="space-y-4">
                {[
                  { label: t('attendance_imported'), done: true },
                  { label: t('leave_deductions_applied'), done: true },
                  { label: t('overtime_calculated'), done: true },
                  { label: t('allowances_processed'), done: true },
                  { label: t('tax_social_security'), done: false },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${item.done ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                      {item.done ? <CheckCircle2 className="w-3 h-3" /> : <div className="w-2 h-2 bg-gray-300 rounded-full" />}
                    </div>
                    <span className={`text-sm ${item.done ? 'text-gray-900' : 'text-gray-500'}`}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">{t('quick_links')}</h3>
              <div className="space-y-2">
                <button className="w-full flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg text-sm text-gray-600 transition-colors">
                  <span className="flex items-center gap-2"><FileText className="w-4 h-4" /> {t('view_draft_sheet')}</span>
                  <Download className="w-3 h-3" />
                </button>
                <button className="w-full flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg text-sm text-gray-600 transition-colors">
                  <span className="flex items-center gap-2"><Calculator className="w-4 h-4" /> {t('tax_rules')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-12 rounded-xl border border-gray-100 shadow-sm text-center">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">{t('no_active_payroll_run')}</h3>
          <p className="text-gray-500 mt-2">{t('select_period_create_run')}</p>
          <button className="mt-6 px-6 py-2 btn-gradient-primary rounded-lg font-medium shadow-sm">
            {t('create_new_run')}
          </button>
        </div>
      )}
    </div>
  );
};
