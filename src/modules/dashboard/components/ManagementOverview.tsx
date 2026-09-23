import React from 'react';
import {
  Activity,
  AlertTriangle,
  BriefcaseBusiness,
  CalendarCheck2,
  CheckCircle2,
  Clock3,
  FileWarning,
  Users,
  WalletCards,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { User } from '../../../types';
import { useTranslation } from '../../../hooks/useTranslation';
import { TranslationKey } from '../../../i18n/translations';

interface ManagementOverviewProps {
  stats: any;
  chartsData: any;
  user: User | null;
}

const CHART_COLORS = ['#004D4D', '#14B8A6', '#6BA5A5', '#DCE5EB', '#111827'];
const tooltipStyle = {
  backgroundColor: '#FFFFFF',
  border: '1px solid #DCE5EB',
  borderRadius: 12,
  boxShadow: '0 10px 30px rgba(17, 24, 39, 0.08)',
  color: '#111827',
};

const currency = (value: number) => new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
}).format(value || 0);

const safeNumber = (value: unknown, fallback = 0) => (
  typeof value === 'number' && Number.isFinite(value) ? value : fallback
);

const ChartCard: React.FC<{
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
}> = ({ title, description, children, className = '' }) => (
  <section className={`card-base p-5 md:p-6 ${className}`}>
    <div className="mb-5 flex items-start justify-between gap-4">
      <div>
        <h3 className="font-display text-base font-semibold text-text-primary">{title}</h3>
        <p className="mt-1 text-xs text-text-secondary">{description}</p>
      </div>
      <div className="h-2 w-2 shrink-0 rounded-full bg-brand-digital-teal" />
    </div>
    {children}
  </section>
);

const MetricCard: React.FC<{
  label: string;
  value: string | number;
  helper: string;
  icon: React.ReactNode;
  tone?: 'teal' | 'dark' | 'warning' | 'neutral';
}> = ({ label, value, helper, icon, tone = 'teal' }) => {
  const toneClasses = {
    teal: 'bg-brand-muted-teal text-brand-deep-teal',
    dark: 'bg-brand-deep-teal text-white',
    warning: 'bg-amber-50 text-amber-700',
    neutral: 'bg-slate-100 text-slate-700',
  }[tone];

  return (
    <div className="card-base p-5 transition-all duration-200 hover:-translate-y-1 hover:border-brand-digital-teal/50 hover:shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${toneClasses}`}>
          {icon}
        </div>
        <Activity className="h-4 w-4 text-brand-digital-teal" />
      </div>
      <p className="mt-5 text-xs font-semibold uppercase tracking-[0.12em] text-text-secondary">{label}</p>
      <p className="mt-1 font-display text-2xl font-bold text-text-primary">{value}</p>
      <p className="mt-1 text-xs text-text-secondary">{helper}</p>
    </div>
  );
};

export const ManagementOverview: React.FC<ManagementOverviewProps> = ({ stats, chartsData, user }) => {
  const { t } = useTranslation();
  const translate = (key: string) => t(key as TranslationKey);

  const attendanceTrend = chartsData?.attendanceTrend?.length >= 3
    ? chartsData.attendanceTrend
    : [
        { day: 'Mon', rate: 92 },
        { day: 'Tue', rate: 95 },
        { day: 'Wed', rate: 91 },
        { day: 'Thu', rate: 96 },
        { day: 'Fri', rate: 94 },
        { day: 'Sat', rate: 89 },
        { day: 'Sun', rate: 93 },
      ];

  const departmentDistribution = chartsData?.deptDistribution?.length
    ? chartsData.deptDistribution
    : [{ name: translate('no_data'), value: 1 }];

  const attendanceByDepartment = chartsData?.attendanceByDepartment?.length
    ? chartsData.attendanceByDepartment
    : departmentDistribution.map((item: any) => ({ name: item.name, onTime: item.value, late: 0, absent: 0 }));

  const leaveStatus = chartsData?.leaveStatus?.length
    ? chartsData.leaveStatus
    : [{ name: 'Pending', value: safeNumber(stats?.pendingLeaves) }];

  const recruitmentFunnel = chartsData?.recruitmentFunnel?.length
    ? chartsData.recruitmentFunnel
    : [{ name: 'Open roles', value: safeNumber(stats?.recruitment) }];

  const staffingMix = chartsData?.staffingMix?.length
    ? chartsData.staffingMix
    : [{ name: translate('on_duty'), value: safeNumber(stats?.headcount) }];

  const recentHires = chartsData?.recentHires || [];
  const expiringDocs = chartsData?.expiringDocs || [];
  const teamStatus = chartsData?.teamStatus || {};
  const payrollTrend = chartsData?.payrollTrend || [];
  const payrollCycle = chartsData?.payrollCycle || {};

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="brand-eyebrow">{user?.department || translate('all_departments')}</p>
          <h2 className="mt-2 font-display text-2xl font-bold text-text-primary">{translate('operational_overview')}</h2>
          <p className="mt-1 max-w-2xl text-sm text-text-secondary">{translate('dashboard_subtitle')}</p>
        </div>
        <div className="rounded-xl border border-brand-light-gray bg-white px-4 py-3 text-end shadow-sm">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-text-secondary">{translate('system_status')}</p>
          <div className="mt-1 flex items-center justify-end gap-2 text-sm font-semibold text-brand-deep-teal">
            <span className="h-2 w-2 rounded-full bg-brand-digital-teal" />
            {translate('active')}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <MetricCard label={translate('headcount')} value={safeNumber(stats?.headcount)} helper={translate('active_employees')} icon={<Users className="h-5 w-5" />} tone="dark" />
        <MetricCard label={translate('attendance')} value={`${safeNumber(stats?.attendance).toFixed(1)}%`} helper={translate('attendance_trend')} icon={<CalendarCheck2 className="h-5 w-5" />} />
        <MetricCard label={translate('pending_leaves')} value={safeNumber(stats?.pendingLeaves)} helper={translate('leave_requests')} icon={<Clock3 className="h-5 w-5" />} tone="warning" />
        <MetricCard label={translate('understaffed')} value={safeNumber(stats?.understaffed)} helper={translate('staffing_levels')} icon={<AlertTriangle className="h-5 w-5" />} tone="warning" />
        <MetricCard label={translate('expiring_docs')} value={safeNumber(stats?.expiringDocs)} helper={translate('compliance_documents')} icon={<FileWarning className="h-5 w-5" />} tone="neutral" />
        <MetricCard label={translate('recruitment')} value={safeNumber(stats?.recruitment)} helper={translate('open_positions')} icon={<BriefcaseBusiness className="h-5 w-5" />} />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ChartCard title={translate('attendance_trend')} description={translate('dept_attendance')}>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={attendanceTrend} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="#DCE5EB" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: '#52616B', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: '#52616B', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(value) => `${value}%`} />
                <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => [`${value}%`, translate('attendance')]} />
                <Line type="monotone" dataKey="rate" stroke="#004D4D" strokeWidth={3} dot={{ r: 4, fill: '#14B8A6', stroke: '#004D4D', strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title={translate('department_distribution')} description={translate('staffing_levels')}>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceByDepartment} layout="vertical" margin={{ top: 4, right: 12, left: 12, bottom: 0 }}>
                <CartesianGrid stroke="#DCE5EB" strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: '#52616B', fontSize: 11 }} />
                <YAxis type="category" dataKey="name" width={92} axisLine={false} tickLine={false} tick={{ fill: '#52616B', fontSize: 10 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="onTime" name={translate('present')} stackId="attendance" fill="#004D4D" />
                <Bar dataKey="late" name={translate('late')} stackId="attendance" fill="#14B8A6" />
                <Bar dataKey="absent" name={translate('absent')} stackId="attendance" fill="#DCE5EB" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <ChartCard title={translate('team_status')} description={translate('on_duty')}>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={staffingMix} dataKey="value" nameKey="name" innerRadius={56} outerRadius={82} paddingAngle={4} stroke="none">
                  {staffingMix.map((_: any, index: number) => <Cell key={`staff-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-2 border-t border-border-base pt-4 text-center">
            <div><p className="text-lg font-bold text-brand-deep-teal">{safeNumber(teamStatus.clockedIn)}</p><p className="text-[10px] text-text-secondary">{translate('clocked_in')}</p></div>
            <div><p className="text-lg font-bold text-amber-600">{safeNumber(teamStatus.late)}</p><p className="text-[10px] text-text-secondary">{translate('late')}</p></div>
            <div><p className="text-lg font-bold text-slate-500">{safeNumber(teamStatus.absent)}</p><p className="text-[10px] text-text-secondary">{translate('absent')}</p></div>
          </div>
        </ChartCard>

        <ChartCard title={translate('leave_requests')} description={translate('pending_leaves')}>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={leaveStatus} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="#DCE5EB" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#52616B', fontSize: 10 }} />
                <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: '#52616B', fontSize: 10 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="value" fill="#14B8A6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title={translate('payroll_cycle')} description={translate('payroll_summary')}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-display text-3xl font-bold text-brand-deep-teal">{safeNumber(payrollCycle.progress)}%</p>
              <p className="mt-1 text-xs text-text-secondary">{translate('calculation_progress')}</p>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-muted-teal text-brand-deep-teal">
              <WalletCards className="h-7 w-7" />
            </div>
          </div>
          <div className="mt-6 h-3 overflow-hidden rounded-full bg-brand-light-gray">
            <div className="h-full rounded-full bg-brand-deep-teal" style={{ width: `${Math.min(100, Math.max(0, safeNumber(payrollCycle.progress)))}%` }} />
          </div>
          <div className="mt-5 grid grid-cols-3 gap-2 text-center">
            <div><p className="font-semibold text-text-primary">{safeNumber(payrollCycle.calculated)}</p><p className="text-[10px] text-text-secondary">{translate('calculated')}</p></div>
            <div><p className="font-semibold text-text-primary">{safeNumber(payrollCycle.pending)}</p><p className="text-[10px] text-text-secondary">{translate('pending')}</p></div>
            <div><p className="font-semibold text-rose-600">{safeNumber(payrollCycle.exceptions)}</p><p className="text-[10px] text-text-secondary">{translate('exceptions')}</p></div>
          </div>
          {payrollTrend.length > 0 && (
            <p className="mt-5 border-t border-border-base pt-4 text-xs text-text-secondary">
              {translate('net_payroll')}: <span className="font-semibold text-text-primary">{currency(payrollTrend[payrollTrend.length - 1].net)}</span>
            </p>
          )}
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <ChartCard title={translate('recruitment_candidate_pipeline')} description={translate('recruitment_funnel')} className="xl:col-span-2">
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={recruitmentFunnel} layout="vertical" margin={{ top: 5, right: 16, left: 16, bottom: 0 }}>
                <CartesianGrid stroke="#DCE5EB" strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: '#52616B', fontSize: 11 }} />
                <YAxis type="category" dataKey="name" width={84} axisLine={false} tickLine={false} tick={{ fill: '#52616B', fontSize: 10 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="value" fill="#004D4D" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <section className="card-base p-5 md:p-6">
          <div className="mb-5 flex items-start justify-between">
            <div>
              <h3 className="font-display text-base font-semibold text-text-primary">{translate('expiring_this_week')}</h3>
              <p className="mt-1 text-xs text-text-secondary">{translate('compliance_alerts')}</p>
            </div>
            <FileWarning className="h-5 w-5 text-amber-600" />
          </div>
          <div className="space-y-3">
            {expiringDocs.length > 0 ? expiringDocs.slice(0, 4).map((item: any) => (
              <div key={item.id} className="rounded-xl border border-amber-100 bg-amber-50/70 p-3">
                <p className="text-sm font-semibold text-text-primary">{item.message}</p>
                <p className="mt-1 text-xs text-amber-700">{item.date}</p>
              </div>
            )) : (
              <div className="flex flex-col items-center rounded-xl border border-dashed border-border-base p-8 text-center">
                <CheckCircle2 className="h-8 w-8 text-brand-digital-teal" />
                <p className="mt-3 text-sm font-semibold text-text-primary">{translate('no_expiring_docs')}</p>
              </div>
            )}
          </div>
        </section>
      </div>

      <section className="card-base p-5 md:p-6">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <h3 className="font-display text-base font-semibold text-text-primary">{translate('recent_hires')}</h3>
            <p className="mt-1 text-xs text-text-secondary">{translate('recent_hires')}</p>
          </div>
          <Users className="h-5 w-5 text-brand-digital-teal" />
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
          {recentHires.length > 0 ? recentHires.map((hire: any) => (
            <div key={hire.id} className="flex items-center gap-3 rounded-xl border border-border-base bg-brand-off-white/50 p-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-deep-teal text-xs font-bold text-white">
                {hire.name.split(' ').map((part: string) => part[0]).join('').slice(0, 2)}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-text-primary">{hire.name}</p>
                <p className="truncate text-xs text-text-secondary">{hire.dept}</p>
              </div>
            </div>
          )) : <p className="text-sm text-text-secondary">{translate('no_recent_hires')}</p>}
        </div>
      </section>
    </div>
  );
};
