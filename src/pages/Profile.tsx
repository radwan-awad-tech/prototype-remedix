import React from 'react';
import { useAuth } from '../modules/auth/AuthContext';
import { PageHeader } from '../components/ui/PageHeader';
import { useTranslation } from '../hooks/useTranslation';
import { TranslationKey } from '../i18n/translations';
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Shield, 
  Briefcase,
  IdCard,
  Building2,
  Clock
} from 'lucide-react';
import { ForceLTR } from '../components/ForceLTR';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  if (!user) return null;

  return (
    <div className="space-y-6">
      <PageHeader 
        title={t('profile')} 
        subtitle={t('profile_subtitle')}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-border-base p-8 text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-primary mx-auto flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-lg">
              {user.name.charAt(0)}
            </div>
            <h2 className="text-xl font-bold text-text-primary mb-1">{user.name}</h2>
            <p className="text-sm text-brand-primary-end font-medium mb-4">{user.role ? t(user.role.toLowerCase().replace(' ', '_') as TranslationKey) : ''}</p>
            
            <div className="flex items-center justify-center gap-2">
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                user.status === 'Active' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
              }`}>
                {user.status ? t(user.status.toLowerCase() as any) : t('active')}
              </span>
            </div>
          </div>
        </div>

        {/* Details Sections */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal & Contact Info */}
          <div className="bg-white rounded-2xl shadow-sm border border-border-base overflow-hidden">
            <div className="px-6 py-4 border-b border-border-base bg-bg-main/50">
              <h3 className="font-bold text-text-primary flex items-center gap-2">
                <UserIcon className="w-4 h-4 text-brand-primary-start" />
                {t('personal_information')}
              </h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-xs font-medium text-text-secondary uppercase tracking-wider">{t('email_address')}</p>
                <div className="flex items-center gap-2 text-text-primary">
                  <Mail className="w-4 h-4 text-text-secondary" />
                  <span className="text-sm font-medium"><ForceLTR>{user.email}</ForceLTR></span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-text-secondary uppercase tracking-wider">{t('phone_number')}</p>
                <div className="flex items-center gap-2 text-text-primary">
                  <Phone className="w-4 h-4 text-text-secondary" />
                  <span className="text-sm font-medium"><ForceLTR>{t('mock_phone')}</ForceLTR></span>
                </div>
              </div>
              <div className="space-y-1 md:col-span-2">
                <p className="text-xs font-medium text-text-secondary uppercase tracking-wider">{t('address')}</p>
                <div className="flex items-center gap-2 text-text-primary">
                  <MapPin className="w-4 h-4 text-text-secondary" />
                  <span className="text-sm font-medium">{t('mock_address')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Work Info */}
          <div className="bg-white rounded-2xl shadow-sm border border-border-base overflow-hidden">
            <div className="px-6 py-4 border-b border-border-base bg-bg-main/50">
              <h3 className="font-bold text-text-primary flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-brand-primary-start" />
                {t('work_information')}
              </h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-xs font-medium text-text-secondary uppercase tracking-wider">{t('employee_id')}</p>
                <div className="flex items-center gap-2 text-text-primary">
                  <IdCard className="w-4 h-4 text-text-secondary" />
                  <span className="text-sm font-medium font-mono"><ForceLTR>{t('mock_employee_id')}</ForceLTR></span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-text-secondary uppercase tracking-wider">{t('department')}</p>
                <div className="flex items-center gap-2 text-text-primary">
                  <Building2 className="w-4 h-4 text-text-secondary" />
                  <span className="text-sm font-medium">{t('human_resources')}</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-text-secondary uppercase tracking-wider">{t('position')}</p>
                <div className="flex items-center gap-2 text-text-primary">
                  <Shield className="w-4 h-4 text-text-secondary" />
                  <span className="text-sm font-medium">{user.role ? t(user.role.toLowerCase().replace(' ', '_') as TranslationKey) : ''}</span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-text-secondary uppercase tracking-wider">{t('hire_date')}</p>
                <div className="flex items-center gap-2 text-text-primary">
                  <Calendar className="w-4 h-4 text-text-secondary" />
                  <span className="text-sm font-medium">{t('mock_hire_date')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
