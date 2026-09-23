import React, { useEffect, useState } from 'react';
import { dashboardService } from '../../services/dashboardService';
import { useAuth } from '../auth/AuthContext';
import { Alert } from '../../types';
import { AlertCircle, CheckCircle2, ChevronRight } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { TranslationKey } from '../../i18n/translations';
import { useNavigation } from '../../context/NavigationContext';

interface AlertsCenterProps {
  department?: string;
}

export const AlertsCenter: React.FC<AlertsCenterProps> = ({ department: filterDepartment }) => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { navigate } = useNavigation();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getAlertTypeKey = (type: string): TranslationKey => {
    switch (type) {
      case 'Document Expiry': return 'license_expiry';
      case 'Understaffed': return 'understaffed';
      case 'Conflict': return 'conflicts_detected';
      case 'Data Issue': return 'issue';
      default: return 'issue';
    }
  };

  const getSeverityKey = (severity: string): TranslationKey => {
    switch (severity.toLowerCase()) {
      case 'high': return 'high';
      case 'medium': return 'medium';
      case 'low': return 'low';
      default: return 'medium';
    }
  };

  const handleAlertClick = (alert: Alert) => {
    switch (alert.type) {
      case 'Document Expiry':
        navigate('/licenses');
        break;
      case 'Understaffed':
      case 'Conflict':
        navigate('/scheduling');
        break;
      case 'Data Issue':
        if (alert.message.toLowerCase().includes('payroll')) {
          navigate('/payroll');
        } else if (alert.message.toLowerCase().includes('employee')) {
          navigate('/employees');
        }
        break;
      default:
        // Default navigation or just mark as seen
        break;
    }
  };

  useEffect(() => {
    const fetchAlerts = async () => {
      setIsLoading(true);
      try {
        const department = filterDepartment || (user?.role === 'Department Head' ? user.department : undefined);
        const response = await dashboardService.listAlerts(department);
        if (response.success) {
          let filteredAlerts = response.data;
          
          // Role-based filtering for Employee
          if (user?.role === 'Employee') {
            // Employees only see alerts that are not department-wide or specific to others
            // For now, we'll filter by message content or just show a subset
            filteredAlerts = filteredAlerts.filter(a => 
              a.type === 'Document Expiry' || 
              a.message.toLowerCase().includes('your') ||
              a.message.toLowerCase().includes(user.name.toLowerCase())
            );
          }
          
          setAlerts(filteredAlerts);
        }
      } catch (error) {
        console.error('Failed to fetch alerts', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAlerts();
  }, [user, filterDepartment]);

  const handleMarkAsSeen = async (id: string) => {
    try {
      const response = await dashboardService.markAlertAsSeen(id);
      if (response.success) {
        setAlerts(prev => prev.map(a => a.id === id ? { ...a, isSeen: true } : a));
      }
    } catch (error) {
      console.error('Failed to mark alert as seen', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="w-8 h-8 border-4 border-brand-primary-start border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text-primary">{t('urgent_alerts')}</h2>
        <button className="text-sm text-brand-primary-end font-medium hover:underline">{t('mark_all_seen')}</button>
      </div>

      <div className="space-y-3">
        {alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-xl border border-dashed border-border-light">
            <div className="p-4 bg-bg-main rounded-full mb-4">
              <CheckCircle2 className="w-8 h-8 text-text-secondary" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-1">{t('no_alerts_found')}</h3>
            <p className="text-sm text-text-secondary max-w-xs">{t('all_caught_up')}</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div 
              key={alert.id} 
              onClick={() => handleAlertClick(alert)}
              className={`card-base p-4 flex items-start gap-4 transition-all hover:shadow-md cursor-pointer border-s-4 ${
                alert.severity === 'High' ? 'border-s-rose-500' : 
                alert.severity === 'Medium' ? 'border-s-amber-500' : 'border-s-blue-500'
              } ${alert.isSeen ? 'opacity-60' : 'opacity-100'}`}
            >
              <div className={`p-2 rounded-lg ${
                alert.severity === 'High' ? 'bg-rose-50 text-rose-600' : 
                alert.severity === 'Medium' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
              }`}>
                <AlertCircle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">{t(getAlertTypeKey(alert.type))}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase ${
                    alert.severity === 'High' ? 'bg-rose-100 text-rose-700' : 
                    alert.severity === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {t(getSeverityKey(alert.severity))}
                  </span>
                  {!alert.isSeen && <div className="w-1.5 h-1.5 rounded-full bg-brand-primary-end" />}
                </div>
                <p className="text-sm font-medium text-text-primary">{alert.message}</p>
                <p className="text-[10px] text-text-secondary mt-2">{alert.date}</p>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMarkAsSeen(alert.id);
                  }}
                  className="p-2 hover:bg-bg-main rounded-lg transition-colors text-text-secondary" 
                  title={t('mark_as_seen')}
                >
                  <CheckCircle2 className="w-4 h-4" />
                </button>
                <ChevronRight className="w-4 h-4 text-text-secondary rtl:rotate-180" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
