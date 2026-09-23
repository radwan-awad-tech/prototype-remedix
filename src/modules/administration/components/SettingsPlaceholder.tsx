import React, { useState } from 'react';
import { Settings, Shield, Globe, Bell, Database, Lock, AlertCircle, Save, X } from 'lucide-react';
import { useTranslation } from '../../../hooks/useTranslation';
import { Drawer } from '../../../components/ui/Drawer';
import { useToast } from '../../../components/ui/Toast';

type SettingCategory = 'general' | 'security' | 'notifications' | 'data' | 'privacy';

export const SettingsPlaceholder: React.FC = () => {
  const { t } = useTranslation();
  const { success } = useToast();
  const [activeCategory, setActiveCategory] = useState<SettingCategory | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setActiveCategory(null);
      success(t('save_settings_success'));
    }, 1000);
  };

  const renderCategoryForm = () => {
    switch (activeCategory) {
      case 'general':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-text-primary uppercase tracking-wider">{t('branding_settings')}</h4>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-secondary uppercase">{t('hospital_name_label')}</label>
                  <input type="text" defaultValue={t('hospital_name')} className="w-full px-4 py-2 bg-bg-main border border-border-base rounded-xl text-sm" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-secondary uppercase">{t('system_logo')}</label>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center text-white font-bold text-xl">O</div>
                    <button className="px-4 py-2 bg-bg-main border border-border-base rounded-xl text-xs font-bold hover:bg-border-base transition-colors">{t('upload_new')}</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-border-base">
              <h4 className="text-sm font-bold text-text-primary uppercase tracking-wider">{t('localization_settings')}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-secondary uppercase">{t('default_language')}</label>
                  <select className="w-full px-4 py-2 bg-bg-main border border-border-base rounded-xl text-sm">
                    <option value="en">{t('english')}</option>
                    <option value="ar">{t('arabic')}</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-secondary uppercase">{t('timezone')}</label>
                  <select className="w-full px-4 py-2 bg-bg-main border border-border-base rounded-xl text-sm">
                    <option value="GST">{t('gulf_standard_time')}</option>
                    <option value="AST">{t('arabian_standard_time')}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );
      case 'security':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-text-primary uppercase tracking-wider">{t('security_settings')}</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-bg-main rounded-2xl border border-border-base">
                  <div>
                    <p className="text-sm font-bold text-text-primary">{t('two_factor_auth')}</p>
                    <p className="text-xs text-text-secondary">{t('two_factor_subtitle')}</p>
                  </div>
                  <div className="w-12 h-6 bg-emerald-500 rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-secondary uppercase">{t('password_policy')}</label>
                  <select className="w-full px-4 py-2 bg-bg-main border border-border-base rounded-xl text-sm">
                    <option>{t('strong')}</option>
                    <option>{t('medium')}</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-secondary uppercase">{t('session_timeout')} (min)</label>
                  <input type="number" defaultValue={30} className="w-full px-4 py-2 bg-bg-main border border-border-base rounded-xl text-sm" />
                </div>
              </div>
            </div>
          </div>
        );
      case 'notifications':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-text-primary uppercase tracking-wider">{t('notification_settings')}</h4>
              <div className="space-y-3">
                {[
                  { key: 'email_notifications', label: t('email_notifications') },
                  { key: 'sms_alerts', label: t('sms_alerts') },
                  { key: 'push_notifications', label: t('push_notifications') }
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between p-3 bg-bg-main rounded-xl border border-border-base">
                    <span className="text-sm font-medium text-text-primary">{item.label}</span>
                    <div className="w-10 h-5 bg-emerald-500 rounded-full relative cursor-pointer">
                      <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'privacy':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-text-primary uppercase tracking-wider">{t('privacy_settings')}</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-bg-main rounded-2xl border border-border-base">
                  <div>
                    <p className="text-sm font-bold text-text-primary">{t('gdpr_compliance')}</p>
                    <p className="text-xs text-text-secondary">{t('gdpr_compliance_desc')}</p>
                  </div>
                  <div className="w-12 h-6 bg-emerald-500 rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-secondary uppercase">{t('data_retention')}</label>
                  <input type="number" defaultValue={7} className="w-full px-4 py-2 bg-bg-main border border-border-base rounded-xl text-sm" />
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-bold text-amber-800">{t('system_configuration')}</h4>
          <p className="text-xs text-amber-700 mt-1 leading-relaxed">
            {t('system_settings_read_only_msg')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-border-base p-6 hover:shadow-md transition-all group cursor-pointer" onClick={() => setActiveCategory('general')}>
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 mb-4 group-hover:scale-110 transition-transform">
            <Globe className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-text-primary mb-2">{t('general_settings')}</h3>
          <p className="text-xs text-text-secondary leading-relaxed mb-4">
            {t('general_settings_desc')}
          </p>
          <button className="text-xs font-bold text-brand-primary-start hover:underline">{t('manage_settings')} →</button>
        </div>

        <div className="bg-white rounded-2xl border border-border-base p-6 hover:shadow-md transition-all group cursor-pointer" onClick={() => setActiveCategory('security')}>
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-500 mb-4 group-hover:scale-110 transition-transform">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-text-primary mb-2">{t('security_auth')}</h3>
          <p className="text-xs text-text-secondary leading-relaxed mb-4">
            {t('security_auth_desc')}
          </p>
          <button className="text-xs font-bold text-brand-primary-start hover:underline">{t('manage_security')} →</button>
        </div>

        <div className="bg-white rounded-2xl border border-border-base p-6 hover:shadow-md transition-all group cursor-pointer" onClick={() => setActiveCategory('notifications')}>
          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 mb-4 group-hover:scale-110 transition-transform">
            <Bell className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-text-primary mb-2">{t('notifications')}</h3>
          <p className="text-xs text-text-secondary leading-relaxed mb-4">
            {t('notifications_desc')}
          </p>
          <button className="text-xs font-bold text-brand-primary-start hover:underline">{t('manage_notifications')} →</button>
        </div>

        <div className="bg-white rounded-2xl border border-border-base p-6 hover:shadow-md transition-all group cursor-pointer" onClick={() => setActiveCategory('privacy')}>
          <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500 mb-4 group-hover:scale-110 transition-transform">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-text-primary mb-2">{t('privacy_gdpr')}</h3>
          <p className="text-xs text-text-secondary leading-relaxed mb-4">
            {t('privacy_gdpr_desc')}
          </p>
          <button className="text-xs font-bold text-brand-primary-start hover:underline">{t('manage_privacy')} →</button>
        </div>
      </div>

      <Drawer
        isOpen={activeCategory !== null}
        onClose={() => setActiveCategory(null)}
        title={t(`${activeCategory}_settings` as any)}
      >
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto p-6">
            {renderCategoryForm()}
          </div>
          <div className="p-6 border-t border-border-base bg-bg-main/50 flex items-center gap-3">
            <button
              onClick={() => setActiveCategory(null)}
              className="flex-1 px-4 py-2 bg-white border border-border-base rounded-xl text-sm font-bold text-text-secondary hover:bg-bg-main transition-colors"
            >
              {t('cancel')}
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 px-4 py-2 bg-gradient-primary text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <Save className="w-4 h-4" />
              )}
              {t('save_changes')}
            </button>
          </div>
        </div>
      </Drawer>
    </div>
  );
};
