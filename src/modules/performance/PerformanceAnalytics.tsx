import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, Filter, TrendingUp, Users, Target, Award, Star } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { useToast } from '../../components/ui/Toast';
import { useAuth } from '../auth/AuthContext';
import { performanceService } from '../../services/performanceService';

export const PerformanceAnalytics: React.FC = () => {
  const { t, language } = useTranslation();
  const { user } = useAuth();
  const isRTL = language === 'ar';
  const { info, showToast } = useToast();
  const [analyticsData, setAnalyticsData] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const dept = user?.role === 'Department Head' ? user?.department : undefined;
        const response = await performanceService.getPerformanceAnalytics(dept);
        if (response.success) {
          setAnalyticsData(response.data);
        } else {
          showToast(response.message || t('error_fetching_analytics'), 'error');
        }
      } catch (error) {
        showToast(t('error_fetching_analytics'), 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalytics();
  }, [t, showToast, user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary-end"></div>
      </div>
    );
  }

  if (!analyticsData) return null;

  const COLORS = ['var(--primary-gradient-end)', '#E5E7EB'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center text-start">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{t('performance_analytics_title')}</h2>
          <p className="text-sm text-gray-500">{t('performance_analytics_subtitle')}</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
            <Filter className="w-4 h-4" />
            {t('filter')}
          </button>
          <button 
            onClick={() => info(t('feature_coming_soon'))}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Download className="w-4 h-4" />
            {t('export')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {analyticsData.stats.map((stat: any, i: number) => {
          const Icon = stat.type === 'score' ? TrendingUp : stat.type === 'participants' ? Users : stat.type === 'completion' ? Target : Award;
          const color = stat.type === 'score' ? 'text-green-600' : stat.type === 'participants' ? 'text-brand-primary-end' : stat.type === 'completion' ? 'text-brand-primary-end' : 'text-purple-600';
          const bg = stat.type === 'score' ? 'bg-green-50' : stat.type === 'participants' ? 'bg-brand-primary-start/10' : stat.type === 'completion' ? 'bg-brand-primary-start/10' : 'bg-purple-50';
          
          return (
            <div key={i} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <div className={`p-2 ${bg} rounded-lg`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <span className={`text-xs font-medium ${color}`}>{stat.trend}</span>
              </div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Score Distribution */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm text-start">
          <h3 className="text-sm font-semibold text-gray-900 mb-6 uppercase tracking-wider">{t('performance_score_distribution')}</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData.scoreDistribution}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="range" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: '#F9FAFB' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {analyticsData.scoreDistribution.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Averages */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm text-start">
          <h3 className="text-sm font-semibold text-gray-900 mb-6 uppercase tracking-wider">{t('performance_dept_averages')}</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData.deptAverages} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F3F4F6" />
                <XAxis type="number" domain={[0, 5]} axisLine={false} tickLine={false} orientation={isRTL ? "top" : "bottom"} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={80} orientation={isRTL ? "right" : "left"} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="score" fill="var(--primary-gradient-end)" radius={isRTL ? [4, 0, 0, 4] : [0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Completion Progress */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm text-start">
          <h3 className="text-sm font-semibold text-gray-900 mb-6 uppercase tracking-wider">{t('performance_cycle_progress')}</h3>
          <div className="flex items-center justify-center h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analyticsData.completionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {analyticsData.completionData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-bold text-gray-900">45%</span>
              <span className="text-xs text-gray-500 uppercase">{t('performance_completion')}</span>
            </div>
          </div>
        </div>

        {/* Top Performers List */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm text-start">
          <h3 className="text-sm font-semibold text-gray-900 mb-6 uppercase tracking-wider">{t('performance_top_rated_employees')}</h3>
          <div className="space-y-4">
            {analyticsData.topPerformers.map((emp: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-brand-primary-start/10 rounded-full flex items-center justify-center text-brand-primary-end font-bold text-xs">
                    {emp.name.split(' ').map((n: string) => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{emp.name}</p>
                    <p className="text-xs text-gray-500">{emp.dept}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-brand-primary-end font-bold">
                  <Star className="w-4 h-4 fill-brand-primary-end" />
                  {emp.score}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
