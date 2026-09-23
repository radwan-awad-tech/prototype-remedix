import React from 'react';
import { 
  Users, Clock, Calendar, FileText, AlertCircle, TrendingUp, 
  Briefcase, Shield, Activity, DollarSign, CheckCircle, BarChart3
} from 'lucide-react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { useTranslation } from '../../../hooks/useTranslation';
import { TranslationKey } from '../../../i18n/translations';
import { DashboardWidget } from './DashboardWidget';
import { useNavigation } from '../../../context/NavigationContext';
import { User } from '../../../types';
import { ForceLTR } from '../../../components/ForceLTR';

const COLORS = ['var(--primary-gradient-start)', 'var(--primary-gradient-end)', '#6ABFF3', '#6985FF', '#A5B4FC'];

interface ManagementOverviewProps {
  stats: any;
  chartsData: any;
  user: User | null;
}

export const ManagementOverview: React.FC<ManagementOverviewProps> = ({ stats, chartsData, user }) => {
  const { t } = useTranslation();
  const { navigate } = useNavigation();

  const role = user?.role || 'Employee';

  const isHR = role === 'HR Manager' || role === 'HR Officer';
  const isPayroll = role === 'Payroll Manager' || role === 'Payroll Officer';
  const isDeptHead = role === 'Department Head';
  const isAdmin = role === 'Admin';

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* KPI Grid - Dynamic based on role */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {(isHR || isAdmin) && (
          <KPICard 
            title={t('headcount')} value={<ForceLTR>{stats?.headcount.toLocaleString()}</ForceLTR>} 
            change={{ value: 2.4, isPositive: true }} 
            icon={<Users className="w-5 h-5" />} 
            onClick={() => navigate('/employees')}
            className="cursor-pointer hover:shadow-md transition-shadow"
          />
        )}
        
        {(isHR || isDeptHead || isAdmin) && (
          <KPICard 
            title={isDeptHead ? t('dept_attendance') : t('attendance')} value={<ForceLTR>{stats?.attendance}%</ForceLTR>} 
            change={{ value: 1.1, isPositive: false }} 
            icon={<TrendingUp className="w-5 h-5" />} 
            onClick={() => navigate('/attendance')}
            className="cursor-pointer hover:shadow-md transition-shadow"
          />
        )}

        {(isHR || isDeptHead || isPayroll || isAdmin) && (
          <KPICard 
            title={t('pending_leaves')} value={<ForceLTR>{stats?.pendingLeaves}</ForceLTR>} 
            icon={<Clock className="w-5 h-5" />} 
            onClick={() => navigate('/leaves')}
            className="cursor-pointer hover:shadow-md transition-shadow"
          />
        )}

        {(isHR || isDeptHead || isAdmin) && (
          <KPICard 
            title={t('understaffed')} value={<ForceLTR>{stats?.understaffed}</ForceLTR>} 
            icon={<AlertCircle className="w-5 h-5 text-rose-500" />} 
            onClick={() => navigate('/scheduling')}
            className="cursor-pointer hover:shadow-md transition-shadow"
          />
        )}

        {(isHR || isAdmin) && (
          <KPICard 
            title={t('expiring_docs')} value={<ForceLTR>{stats?.expiringDocs}</ForceLTR>} 
            icon={<FileText className="w-5 h-5" />} 
            onClick={() => navigate('/licenses')}
            className="cursor-pointer hover:shadow-md transition-shadow"
          />
        )}

        {(isPayroll || isAdmin) && (
          <KPICard 
            title={t('payroll_status')} value={stats?.payrollStatus} 
            icon={<Calendar className="w-5 h-5" />} 
            onClick={() => navigate('/payroll')}
            className="cursor-pointer hover:shadow-md transition-shadow"
          />
        )}

        {isHR && (
          <KPICard 
            title={t('recruitment')} value={<ForceLTR>{stats?.recruitment}</ForceLTR>} 
            icon={<Briefcase className="w-5 h-5" />} 
            onClick={() => navigate('/recruitment')}
            className="cursor-pointer hover:shadow-md transition-shadow"
          />
        )}

        {isAdmin && (
          <>
            <KPICard 
              title={t('active_users')} value={<ForceLTR>{stats?.activeUsers || 0}</ForceLTR>} 
              icon={<Shield className="w-5 h-5" />} 
              onClick={() => navigate('/settings')}
              className="cursor-pointer hover:shadow-md transition-shadow"
            />
            <KPICard 
              title={t('system_uptime')} value={<ForceLTR>{stats?.systemUptime || 99.9}%</ForceLTR>} 
              icon={<Activity className="w-5 h-5" />} 
              className="cursor-default"
            />
          </>
        )}

        {isPayroll && (
          <KPICard 
            title={t('net_payroll')} value={<ForceLTR>SAR {stats?.netPayroll?.toLocaleString() || 0}</ForceLTR>} 
            icon={<DollarSign className="w-5 h-5" />} 
            onClick={() => navigate('/payroll')}
            className="cursor-pointer hover:shadow-md transition-shadow"
          />
        )}
      </div>

      {/* Quick Actions Bar - Horizontal for better balance */}
      <DashboardWidget noPadding>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-px bg-border-base">
          {isHR && (
            <>
              <button onClick={() => navigate('/employees')} className="p-4 bg-white flex items-center justify-center gap-2 hover:bg-brand-primary-start/5 transition-colors group">
                <Users className="w-4 h-4 text-brand-primary-end" />
                <span className="text-xs font-bold text-text-primary">{t('add_employee')}</span>
              </button>
              <button onClick={() => navigate('/recruitment')} className="p-4 bg-white flex items-center justify-center gap-2 hover:bg-brand-primary-start/5 transition-colors group">
                <Briefcase className="w-4 h-4 text-brand-primary-end" />
                <span className="text-xs font-bold text-text-primary">{t('new_request')}</span>
              </button>
            </>
          )}
          {isPayroll && (
            <>
              <button onClick={() => navigate('/payroll')} className="p-4 bg-white flex items-center justify-center gap-2 hover:bg-brand-primary-start/5 transition-colors group">
                <DollarSign className="w-4 h-4 text-brand-primary-end" />
                <span className="text-xs font-bold text-text-primary">{t('process_payroll')}</span>
              </button>
              <button onClick={() => navigate('/payroll')} className="p-4 bg-white flex items-center justify-center gap-2 hover:bg-brand-primary-start/5 transition-colors group">
                <BarChart3 className="w-4 h-4 text-brand-primary-end" />
                <span className="text-xs font-bold text-text-primary">{t('payroll_report')}</span>
              </button>
            </>
          )}
          {isDeptHead && (
            <>
              <button onClick={() => navigate('/scheduling')} className="p-4 bg-white flex items-center justify-center gap-2 hover:bg-brand-primary-start/5 transition-colors group">
                <Calendar className="w-4 h-4 text-brand-primary-end" />
                <span className="text-xs font-bold text-text-primary">{t('publish_schedule')}</span>
              </button>
              <button onClick={() => navigate('/leaves')} className="p-4 bg-white flex items-center justify-center gap-2 hover:bg-brand-primary-start/5 transition-colors group">
                <CheckCircle className="w-4 h-4 text-brand-primary-end" />
                <span className="text-xs font-bold text-text-primary">{t('approve_leaves')}</span>
              </button>
            </>
          )}
          {isAdmin && (
            <>
              <button onClick={() => navigate('/settings')} className="p-4 bg-white flex items-center justify-center gap-2 hover:bg-brand-primary-start/5 transition-colors group">
                <Shield className="w-4 h-4 text-brand-primary-end" />
                <span className="text-xs font-bold text-text-primary">{t('manage_security')}</span>
              </button>
              <button onClick={() => navigate('/settings')} className="p-4 bg-white flex items-center justify-center gap-2 hover:bg-brand-primary-start/5 transition-colors group">
                <Activity className="w-4 h-4 text-brand-primary-end" />
                <span className="text-xs font-bold text-text-primary">{t('audit_logs')}</span>
              </button>
            </>
          )}
        </div>
      </DashboardWidget>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {(isHR || isAdmin) && (
          <>
            {/* Left Column - Primary Charts/Status */}
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DashboardWidget title={t('dept_distribution')}>
                  {chartsData?.deptDistribution && chartsData.deptDistribution.length > 0 ? (
                    <>
                      <div className="h-[250px]" dir="ltr">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={chartsData.deptDistribution}
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                              onClick={() => navigate('/employees')}
                              className="cursor-pointer"
                            >
                              {chartsData.deptDistribution.map((entry: any, index: number) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} name={t(entry.name.toLowerCase() as TranslationKey)} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-4">
                        {chartsData.deptDistribution.map((dept: any, i: number) => (
                          <div 
                            key={dept.name} 
                            className="flex items-center gap-2 text-xs text-text-secondary cursor-pointer hover:text-text-primary transition-colors"
                            onClick={() => navigate('/employees')}
                          >
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                            <span>{t(dept.name.toLowerCase() as TranslationKey)} (<ForceLTR>{dept.value}</ForceLTR>)</span>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="h-[250px] flex flex-col items-center justify-center text-center text-text-secondary">
                      <AlertCircle className="w-8 h-8 mb-2 opacity-20" />
                      <p className="text-sm">{t('no_data_available')}</p>
                    </div>
                  )}
                </DashboardWidget>

                <DashboardWidget title={t('attendance_trend')}>
                  {chartsData?.attendanceTrend && chartsData.attendanceTrend.length > 0 ? (
                    <div className="h-[250px]" dir="ltr">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart 
                          data={chartsData.attendanceTrend.map((d: any) => ({ ...d, day: t(d.day.toLowerCase() as TranslationKey) }))}
                          onClick={() => navigate('/attendance')}
                          className="cursor-pointer"
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5EAF2" />
                          <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} domain={[80, 100]} />
                          <Tooltip />
                          <Line 
                            type="monotone" 
                            dataKey="rate" 
                            stroke="var(--primary-gradient-end)" 
                            strokeWidth={3} 
                            dot={{ r: 4, fill: 'var(--primary-gradient-end)', strokeWidth: 2, stroke: '#fff' }} 
                            activeDot={{ r: 6 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="h-[250px] flex flex-col items-center justify-center text-center text-text-secondary">
                      <AlertCircle className="w-8 h-8 mb-2 opacity-20" />
                      <p className="text-sm">{t('no_data_available')}</p>
                    </div>
                  )}
                </DashboardWidget>
              </div>

              {isAdmin && (
                <DashboardWidget title={t('user_activity_trend')}>
                  <div className="h-[300px]" dir="ltr">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={[
                        { time: '08:00', users: 5 },
                        { time: '10:00', users: 18 },
                        { time: '12:00', users: 24 },
                        { time: '14:00', users: 22 },
                        { time: '16:00', users: 15 },
                        { time: '18:00', users: 8 },
                      ]}>
                        <defs>
                          <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--primary-gradient-end)" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="var(--primary-gradient-end)" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5EAF2" />
                        <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                        <Tooltip />
                        <Area type="monotone" dataKey="users" stroke="var(--primary-gradient-end)" fillOpacity={1} fill="url(#colorUsers)" strokeWidth={3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </DashboardWidget>
              )}
            </div>

            {/* Right Column - Secondary Info */}
            <div className="space-y-6">
              <DashboardWidget title={t('expiring_this_week')}>
                <div className="space-y-3">
                  {chartsData?.expiringDocs && chartsData.expiringDocs.length > 0 ? (
                    chartsData.expiringDocs.map((alert: any) => (
                      <div 
                        key={alert.id} 
                        onClick={() => navigate('/licenses')} 
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          alert.severity === 'High' ? 'border-amber-100 bg-amber-50 hover:bg-amber-100' : 'border-border-base hover:bg-bg-main'
                        }`}
                      >
                        <p className={`text-xs font-bold ${alert.severity === 'High' ? 'text-amber-800' : 'text-text-primary'}`}>
                          {alert.message.split(' for ')[0]}
                        </p>
                        <p className={`text-[10px] mt-1 ${alert.severity === 'High' ? 'text-amber-700' : 'text-text-secondary'}`}>
                          {alert.message.split(' for ')[1]?.split(' expires ')[0] || ''} • {alert.date}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-text-secondary italic text-center py-2">{t('no_expiring_docs')}</p>
                  )}
                </div>
              </DashboardWidget>

              {isHR && (
                <DashboardWidget title={t('recent_hires')}>
                  <div className="space-y-3">
                    {chartsData?.recentHires && chartsData.recentHires.length > 0 ? (
                      chartsData.recentHires.map((hire: any) => (
                        <div key={hire.id} className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-bg-main flex items-center justify-center text-text-secondary text-[10px] font-bold">
                            {hire.name.split(' ').map((n: string) => n[0]).join('')}
                          </div>
                          <div>
                            <p className="text-xs font-medium text-text-primary">{hire.name}</p>
                            <p className="text-[10px] text-text-secondary">{t(hire.dept.toLowerCase() as TranslationKey)} • {hire.date}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-text-secondary italic text-center py-2">{t('no_recent_hires')}</p>
                    )}
                  </div>
                </DashboardWidget>
              )}

              {isAdmin && (
                <DashboardWidget title={t('security_alerts')}>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-2 bg-rose-50 rounded-lg border border-rose-100">
                      <Shield className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-rose-800">{t('failed_login_attempts')}</p>
                        <p className="text-[10px] text-rose-700">5 attempts from IP 192.168.1.42</p>
                      </div>
                    </div>
                  </div>
                </DashboardWidget>
              )}
            </div>
          </>
        )}

        {isPayroll && (
          <div className="lg:col-span-3">
            <DashboardWidget title={t('payroll_cycle')}>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-text-primary">
                      {new Date().toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                    </p>
                    <p className="text-xs text-text-secondary">{t('cutoff_date')}: 25 {new Date().toLocaleDateString(undefined, { month: 'long' })}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-brand-primary-end">{chartsData?.payrollCycle?.progress || 0}%</p>
                    <p className="text-[10px] text-text-secondary">{t('calculation_progress')}</p>
                  </div>
                </div>
                <div className="w-full h-2 bg-bg-main rounded-full overflow-hidden">
                  <div className="h-full bg-brand-primary-end" style={{ width: `${chartsData?.payrollCycle?.progress || 0}%` }} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                    <p className="text-[10px] text-emerald-700 font-bold uppercase">{t('calculated')}</p>
                    <p className="text-lg font-bold text-emerald-800"><ForceLTR>{chartsData?.payrollCycle?.calculated || 0}</ForceLTR></p>
                  </div>
                  <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
                    <p className="text-[10px] text-amber-700 font-bold uppercase">{t('pending')}</p>
                    <p className="text-lg font-bold text-amber-800"><ForceLTR>{chartsData?.payrollCycle?.pending || 0}</ForceLTR></p>
                  </div>
                  <div className="p-3 bg-rose-50 rounded-lg border border-rose-100">
                    <p className="text-[10px] text-rose-700 font-bold uppercase">{t('exceptions_found')}</p>
                    <p className="text-lg font-bold text-rose-800"><ForceLTR>{chartsData?.payrollCycle?.exceptions || 0}</ForceLTR></p>
                  </div>
                </div>
              </div>
            </DashboardWidget>
          </div>
        )}

        {isDeptHead && (
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            <div className="md:col-span-2 space-y-6">
              <DashboardWidget title={t('team_status_today')}>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 text-center">
                    <p className="text-[10px] text-emerald-700 font-bold uppercase mb-1">{t('clocked_in')}</p>
                    <p className="text-2xl font-bold text-emerald-800"><ForceLTR>{chartsData?.teamStatus?.clockedIn || 0}</ForceLTR></p>
                  </div>
                  <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 text-center">
                    <p className="text-[10px] text-amber-700 font-bold uppercase mb-1">{t('late')}</p>
                    <p className="text-2xl font-bold text-amber-800"><ForceLTR>{chartsData?.teamStatus?.late || 0}</ForceLTR></p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 text-center">
                    <p className="text-[10px] text-blue-700 font-bold uppercase mb-1">{t('on_leave')}</p>
                    <p className="text-2xl font-bold text-blue-800"><ForceLTR>{chartsData?.teamStatus?.onLeave || 0}</ForceLTR></p>
                  </div>
                  <div className="p-4 bg-rose-50 rounded-xl border border-rose-100 text-center">
                    <p className="text-[10px] text-rose-700 font-bold uppercase mb-1">{t('absent')}</p>
                    <p className="text-2xl font-bold text-rose-800"><ForceLTR>{Math.max(0, chartsData?.teamStatus?.absent || 0)}</ForceLTR></p>
                  </div>
                </div>
              </DashboardWidget>

              <DashboardWidget title={t('roster_summary')}>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex items-center justify-between p-3 bg-bg-main rounded-lg">
                    <span className="text-sm text-text-secondary">{t('morning_shift')}</span>
                    <span className="text-sm font-bold text-text-primary"><ForceLTR>{chartsData?.rosterSummary?.morning || 0}</ForceLTR> {t('assigned')}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-bg-main rounded-lg">
                    <span className="text-sm text-text-secondary">{t('evening_shift')}</span>
                    <span className="text-sm font-bold text-text-primary"><ForceLTR>{chartsData?.rosterSummary?.evening || 0}</ForceLTR> {t('assigned')}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-bg-main rounded-lg border-s-4 border-rose-400">
                    <span className="text-sm text-text-secondary">{t('night_shift')}</span>
                    <span className="text-sm font-bold text-rose-600">
                      {chartsData?.rosterSummary?.night > 0 ? (
                        <><ForceLTR>{chartsData.rosterSummary.night}</ForceLTR> {t('assigned')}</>
                      ) : (
                        <>{t('understaffed')} (<ForceLTR>-1</ForceLTR>)</>
                      )}
                    </span>
                  </div>
                </div>
              </DashboardWidget>

              <DashboardWidget title={t('attendance_trend')}>
                {chartsData?.attendanceTrend && chartsData.attendanceTrend.length > 0 ? (
                  <div className="h-[200px]" dir="ltr">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart 
                        data={chartsData.attendanceTrend.map((d: any) => ({ ...d, day: t(d.day.toLowerCase() as TranslationKey) }))}
                        onClick={() => navigate('/attendance')}
                        className="cursor-pointer"
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5EAF2" />
                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6B7280' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6B7280' }} domain={[80, 100]} />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="rate" 
                          stroke="var(--primary-gradient-end)" 
                          strokeWidth={2} 
                          dot={{ r: 3, fill: 'var(--primary-gradient-end)', strokeWidth: 2, stroke: '#fff' }} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-[200px] flex flex-col items-center justify-center text-center text-text-secondary">
                    <AlertCircle className="w-8 h-8 mb-2 opacity-20" />
                    <p className="text-sm">{t('no_data_available')}</p>
                  </div>
                )}
              </DashboardWidget>
            </div>

            <div className="space-y-6">
              <DashboardWidget title={t('pending_team_approvals')}>
                <div className="space-y-3">
                  {chartsData?.pendingApprovals && chartsData.pendingApprovals.length > 0 ? (
                    chartsData.pendingApprovals.map((req: any) => (
                      <div 
                        key={req.id} 
                        onClick={() => navigate('/leaves')}
                        className="p-3 border border-border-base rounded-lg hover:bg-bg-main cursor-pointer transition-colors"
                      >
                        <div className="flex justify-between items-start mb-1">
                          <p className="text-xs font-bold text-text-primary">{req.employeeName}</p>
                          <span className="text-[10px] px-1.5 py-0.5 bg-brand-primary-start/10 text-brand-primary-end rounded font-medium">
                            {t(req.type.toLowerCase() as TranslationKey)}
                          </span>
                        </div>
                        <p className="text-[10px] text-text-secondary">{req.details}</p>
                        <p className="text-[10px] text-text-secondary mt-1 italic">{req.date}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-text-secondary italic text-center py-4">{t('no_pending_approvals')}</p>
                  )}
                  <button 
                    onClick={() => navigate('/leaves')}
                    className="w-full py-2 text-xs font-bold text-brand-primary-end hover:bg-brand-primary-start/5 rounded-lg transition-colors border border-dashed border-brand-primary-start/30"
                  >
                    {t('view_all_approvals')}
                  </button>
                </div>
              </DashboardWidget>

              <DashboardWidget title={t('expiring_this_week')}>
                <div className="space-y-3">
                  {chartsData?.expiringDocs && chartsData.expiringDocs.length > 0 ? (
                    chartsData.expiringDocs.map((alert: any) => (
                      <div 
                        key={alert.id} 
                        onClick={() => navigate('/licenses')} 
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          alert.severity === 'High' ? 'border-amber-100 bg-amber-50 hover:bg-amber-100' : 'border-border-base hover:bg-bg-main'
                        }`}
                      >
                        <p className={`text-xs font-bold ${alert.severity === 'High' ? 'text-amber-800' : 'text-text-primary'}`}>
                          {alert.message.split(' for ')[0]}
                        </p>
                        <p className={`text-[10px] mt-1 ${alert.severity === 'High' ? 'text-amber-700' : 'text-text-secondary'}`}>
                          {alert.message.split(' for ')[1]?.split(' expires ')[0] || ''} • {alert.date}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-text-secondary italic text-center py-2">{t('no_expiring_docs')}</p>
                  )}
                </div>
              </DashboardWidget>

              <DashboardWidget title={t('on_leave_today')}>
                <div className="space-y-3">
                  {chartsData?.onLeaveToday && chartsData.onLeaveToday.length > 0 ? (
                    chartsData.onLeaveToday.map((person: any) => (
                      <div key={person.id} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-primary-start/10 flex items-center justify-center text-brand-primary-end text-xs font-bold">
                          {person.initials}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-text-primary">{person.name}</p>
                          <p className="text-[10px] text-text-secondary">{t(person.type.toLowerCase() as TranslationKey)}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-text-secondary italic text-center py-2">{t('no_one_on_leave')}</p>
                  )}
                </div>
              </DashboardWidget>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper components for the KPI Grid
const KPICard: React.FC<{
  title: string;
  value: React.ReactNode;
  change?: { value: number; isPositive: boolean };
  icon: React.ReactNode;
  onClick?: () => void;
  className?: string;
}> = ({ title, value, change, icon, onClick, className }) => {
  const { t } = useTranslation();
  return (
    <div 
      onClick={onClick}
      className={`card-base p-4 flex flex-col justify-between transition-all ${className}`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="p-2 rounded-lg bg-brand-primary-start/10 text-brand-primary-end">
          {icon}
        </div>
        {change && (
          <div className={`text-[10px] font-bold ${change.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
            {change.isPositive ? '↑' : '↓'} {change.value}%
          </div>
        )}
      </div>
      <div>
        <p className="text-[10px] text-text-secondary font-medium uppercase tracking-wider mb-1">{title}</p>
        <h3 className="text-lg font-bold text-text-primary">{value}</h3>
      </div>
    </div>
  );
};
