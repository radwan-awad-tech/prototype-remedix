import React, { useState, useEffect, useMemo } from 'react';
import { Tabs } from '../components/ui/Tabs';
import { ShiftsCalendar } from '../modules/scheduling/ShiftsCalendar';
import { AIScheduling } from '../modules/scheduling/AIScheduling';
import { Calendar, Settings, Shield, RefreshCw, Filter, Download, Plus, Clock, Users, Brain } from 'lucide-react';
import { DataTable } from '../components/ui/DataTable';
import { Drawer } from '../components/ui/Drawer';
import { schedulingService } from '../services/schedulingService';
import { ShiftType, WorkingHoursPolicy } from '../types';
import { StatusBadge } from '../components/ui/StatusBadge';
import { MOCK_POLICIES } from '../mockData';
import { useTranslation } from '../hooks/useTranslation';
import { TranslationKey } from '../i18n/translations';
import { useToast } from '../components/ui/Toast';
import { useAuth } from '../modules/auth/AuthContext';

export const SchedulingPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { info } = useToast();
  const [activeTab, setActiveTab] = useState('calendar');

  const tabs = useMemo(() => {
    const baseTabs: { id: string; label: string; icon: React.ReactNode; translationKey: TranslationKey }[] = [
      { id: 'calendar', label: t('shifts_calendar'), icon: <Calendar className="w-4 h-4" />, translationKey: 'shifts_calendar' as const },
      { id: 'requests', label: t('swap_requests'), icon: <RefreshCw className="w-4 h-4" />, translationKey: 'swap_requests' as const },
    ];
    
    if (['Senior Manager', 'HR Manager', 'Department Head'].includes(user?.role || '')) {
      baseTabs.push(
        { id: 'ai-scheduling', label: 'AI Scheduling', icon: <Brain className="w-4 h-4" />, translationKey: 'shifts_calendar' as const },
        { id: 'types', label: t('shift_types'), icon: <Settings className="w-4 h-4" />, translationKey: 'shift_types' as const },
        { id: 'policies', label: t('policies'), icon: <Shield className="w-4 h-4" />, translationKey: 'policies' as const }
      );
    }
    
    return baseTabs;
  }, [t, user?.role]);

  const handleExportScheduling = () => {
    const content = `Scheduling Export - ${new Date().toLocaleDateString()}\nCalendar, Shift Types, Policies, Swap Requests`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `scheduling_export_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    info('Scheduling data exported successfully');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">{t('scheduling_title')}</h1>
          <p className="text-text-secondary text-sm">{t('scheduling_subtitle')}</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-border-base rounded-lg text-sm font-medium text-text-primary hover:bg-bg-main transition-colors">
            <Filter className="w-4 h-4" />
            {t('filter')}
          </button>
          <button 
            onClick={handleExportScheduling}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-border-base rounded-lg text-sm font-medium text-text-primary hover:bg-bg-main transition-colors"
          >
            <Download className="w-4 h-4" />
            {t('export')}
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Content Area */}
      <div className="pt-2">
        {activeTab === 'calendar' && <ShiftsCalendar />}
        {activeTab === 'ai-scheduling' && <AIScheduling />}
        {activeTab === 'types' && <ShiftTypeManager />}
        {activeTab === 'policies' && <PolicyManager />}
        {activeTab === 'requests' && <SwapRequests />}
      </div>
    </div>
  );
};

const ShiftTypeManager = () => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [shiftTypes, setShiftTypes] = useState<ShiftType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<ShiftType>>({
    code: '',
    name: '',
    startTime: '08:00',
    endTime: '16:00',
    durationHours: 8,
    minStaffRequired: 1,
    isOvernight: false,
    tags: []
  });

  const fetchShiftTypes = async () => {
    setIsLoading(true);
    try {
      const response = await schedulingService.listShiftTypes();
      if (response.success) {
        setShiftTypes(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch shift types', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchShiftTypes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await schedulingService.createShiftType(formData);
      if (response.success) {
        showToast(t('add_success'), 'success');
        setIsAddDrawerOpen(false);
        setFormData({
          code: '',
          name: '',
          startTime: '08:00',
          endTime: '16:00',
          durationHours: 8,
          minStaffRequired: 1,
          isOvernight: false,
          tags: []
        });
        fetchShiftTypes();
      }
    } catch (error) {
      showToast(t('failed_to_save'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    { header: 'Code', accessor: 'code' as const, className: 'font-mono font-bold text-brand-primary-end', translationKey: 'code' as const },
    { header: 'Name', accessor: 'name' as const, translationKey: 'name' as const },
    { header: 'Time Range', accessor: (row: any) => `${row.startTime} - ${row.endTime}`, translationKey: 'time_range' as const },
    { header: 'Duration', accessor: (row: any) => `${row.durationHours}h`, translationKey: 'duration' as const },
    { header: 'Min Staff', accessor: 'minStaffRequired' as const, translationKey: 'min_staff' as const },
    { 
      header: 'Tags', 
      accessor: (row: any) => (
        <div className="flex gap-1">
          {row.tags?.map((t: string) => <span key={t} className="px-2 py-0.5 bg-bg-main rounded text-[10px] font-bold text-text-secondary uppercase">{t}</span>)}
        </div>
      ),
      translationKey: 'tags' as const
    },
  ];

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text-primary">{t('shift_configurations')}</h2>
        <button 
          onClick={() => setIsAddDrawerOpen(true)}
          className="btn-gradient-primary px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {t('add_shift_type')}
        </button>
      </div>
      <DataTable data={shiftTypes} columns={columns} isLoading={isLoading} />

      <Drawer
        isOpen={isAddDrawerOpen}
        onClose={() => setIsAddDrawerOpen(false)}
        title={t('add_shift_type')}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-text-primary">{t('shift_code')}</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MORNING"
                  className="w-full px-4 py-2 rounded-lg border border-border-base focus:ring-2 focus:ring-brand-primary-start/20 outline-none"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-text-primary">{t('shift_name')}</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Morning Shift"
                  className="w-full px-4 py-2 rounded-lg border border-border-base focus:ring-2 focus:ring-brand-primary-start/20 outline-none"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-text-primary">{t('start_time')}</label>
                <div className="relative">
                  <Clock className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                  <input
                    type="time"
                    required
                    className="w-full ps-10 pe-4 py-2 rounded-lg border border-border-base focus:ring-2 focus:ring-brand-primary-start/20 outline-none"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-text-primary">{t('end_time')}</label>
                <div className="relative">
                  <Clock className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                  <input
                    type="time"
                    required
                    className="w-full ps-10 pe-4 py-2 rounded-lg border border-border-base focus:ring-2 focus:ring-brand-primary-start/20 outline-none"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-text-primary">{t('duration_hours')}</label>
                <input
                  type="number"
                  required
                  min="1"
                  max="24"
                  className="w-full px-4 py-2 rounded-lg border border-border-base focus:ring-2 focus:ring-brand-primary-start/20 outline-none"
                  value={formData.durationHours}
                  onChange={(e) => setFormData({ ...formData, durationHours: parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-text-primary">{t('min_staff')}</label>
                <div className="relative">
                  <Users className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                  <input
                    type="number"
                    required
                    min="1"
                    className="w-full ps-10 pe-4 py-2 rounded-lg border border-border-base focus:ring-2 focus:ring-brand-primary-start/20 outline-none"
                    value={formData.minStaffRequired}
                    onChange={(e) => setFormData({ ...formData, minStaffRequired: parseInt(e.target.value) })}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isOvernight"
                className="w-4 h-4 rounded border-border-base text-brand-primary-end focus:ring-brand-primary-start/20"
                checked={formData.isOvernight}
                onChange={(e) => setFormData({ ...formData, isOvernight: e.target.checked })}
              />
              <label htmlFor="isOvernight" className="text-sm font-medium text-text-primary">
                {t('is_overnight')}
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsAddDrawerOpen(false)}
              className="flex-1 px-4 py-2 border border-border-base rounded-lg text-sm font-medium text-text-secondary hover:bg-bg-main transition-colors"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 btn-gradient-primary rounded-lg text-sm font-medium shadow-sm disabled:opacity-50"
            >
              {isSubmitting ? t('saving') : t('save')}
            </button>
          </div>
        </form>
      </Drawer>
    </div>
  );
};

const PolicyManager = () => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [policies, setPolicies] = useState<WorkingHoursPolicy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<WorkingHoursPolicy>>({
    department: '',
    maxHoursPerDay: 8,
    maxHoursPerWeek: 40,
    overtimeAllowed: true,
    maxOvertimeHours: 10
  });

  const fetchPolicies = async () => {
    setIsLoading(true);
    try {
      const response = await schedulingService.listPolicies();
      if (response.success) {
        setPolicies(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch policies', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await schedulingService.createPolicy(formData);
      if (response.success) {
        showToast(t('add_success'), 'success');
        setIsCreateDrawerOpen(false);
        setFormData({
          department: '',
          maxHoursPerDay: 8,
          maxHoursPerWeek: 40,
          overtimeAllowed: true,
          maxOvertimeHours: 10
        });
        fetchPolicies();
      }
    } catch (error) {
      showToast(t('failed_to_save'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    { header: 'Scope', accessor: (row: any) => row.department || t('global'), className: 'font-semibold', translationKey: 'scope' as const },
    { header: 'Max Hours/Day', accessor: (row: any) => `${row.maxHoursPerDay}h`, translationKey: 'max_hours_day' as const },
    { header: 'Max Hours/Week', accessor: (row: any) => `${row.maxHoursPerWeek}h`, translationKey: 'max_hours_week' as const },
    { 
      header: 'Overtime', 
      accessor: (row: any) => <StatusBadge status={row.overtimeAllowed ? 'Approved' : 'Rejected'} />,
      translationKey: 'overtime' as const
    },
    { header: 'Max OT', accessor: (row: any) => `${row.maxOvertimeHours}h`, translationKey: 'max_ot' as const },
  ];

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text-primary">{t('working_hours_policies')}</h2>
        <button 
          onClick={() => setIsCreateDrawerOpen(true)}
          className="btn-gradient-primary px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {t('create_policy')}
        </button>
      </div>
      <DataTable data={policies} columns={columns} isLoading={isLoading} />

      <Drawer
        isOpen={isCreateDrawerOpen}
        onClose={() => setIsCreateDrawerOpen(false)}
        title={t('create_policy')}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-primary">{t('department')}</label>
              <select
                className="w-full px-4 py-2 rounded-lg border border-border-base focus:ring-2 focus:ring-brand-primary-start/20 outline-none"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              >
                <option value="">{t('global')}</option>
                <option value="Emergency">{t('emergency')}</option>
                <option value="Cardiology">{t('cardiology')}</option>
                <option value="Nursing">{t('nursing')}</option>
                <option value="Administration">{t('administration')}</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-text-primary">{t('max_hours_day')}</label>
                <input
                  type="number"
                  required
                  min="1"
                  max="24"
                  className="w-full px-4 py-2 rounded-lg border border-border-base focus:ring-2 focus:ring-brand-primary-start/20 outline-none"
                  value={formData.maxHoursPerDay}
                  onChange={(e) => setFormData({ ...formData, maxHoursPerDay: parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-text-primary">{t('max_hours_week')}</label>
                <input
                  type="number"
                  required
                  min="1"
                  max="168"
                  className="w-full px-4 py-2 rounded-lg border border-border-base focus:ring-2 focus:ring-brand-primary-start/20 outline-none"
                  value={formData.maxHoursPerWeek}
                  onChange={(e) => setFormData({ ...formData, maxHoursPerWeek: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="overtimeAllowed"
                  className="w-4 h-4 rounded border-border-base text-brand-primary-end focus:ring-brand-primary-start/20"
                  checked={formData.overtimeAllowed}
                  onChange={(e) => setFormData({ ...formData, overtimeAllowed: e.target.checked })}
                />
                <label htmlFor="overtimeAllowed" className="text-sm font-medium text-text-primary">
                  {t('overtime_allowed')}
                </label>
              </div>

              {formData.overtimeAllowed && (
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-text-primary">{t('max_ot')}</label>
                  <input
                    type="number"
                    required
                    min="0"
                    className="w-full px-4 py-2 rounded-lg border border-border-base focus:ring-2 focus:ring-brand-primary-start/20 outline-none"
                    value={formData.maxOvertimeHours}
                    onChange={(e) => setFormData({ ...formData, maxOvertimeHours: parseInt(e.target.value) })}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsCreateDrawerOpen(false)}
              className="flex-1 px-4 py-2 border border-border-base rounded-lg text-sm font-medium text-text-secondary hover:bg-bg-main transition-colors"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 btn-gradient-primary rounded-lg text-sm font-medium shadow-sm disabled:opacity-50"
            >
              {isSubmitting ? t('saving') : t('save')}
            </button>
          </div>
        </form>
      </Drawer>
    </div>
  );
};

const SwapRequests = () => {
  const { t } = useTranslation();
  return (
    <div className="h-[400px] flex items-center justify-center card-base bg-bg-main/20 border-dashed">
      <div className="text-center">
        <RefreshCw className="w-12 h-12 text-text-secondary opacity-20 mx-auto mb-4" />
        <p className="text-sm font-medium text-text-secondary">{t('no_swap_requests')}</p>
        <p className="text-xs text-text-secondary mt-1">{t('swap_requests_desc')}</p>
      </div>
    </div>
  );
};
