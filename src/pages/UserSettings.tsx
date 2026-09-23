import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, Palette, User, Shield, Bell, LogOut, Mail, Phone, Lock, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useSettings, THEME_PRESETS, Language } from '../context/SettingsContext';
import { PageHeader } from '../components/ui/PageHeader';
import { useTranslation } from '../hooks/useTranslation';
import { useAuth } from '../modules/auth/AuthContext';
import { ForceLTR } from '../components/ForceLTR';

type SettingsTab = 'profile' | 'appearance' | 'security' | 'notifications';

export const UserSettingsPage: React.FC = () => {
  const { language, setLanguage, theme, setTheme } = useSettings();
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<SettingsTab>('appearance');
  const [showPassword, setShowPassword] = useState(false);
  
  // Form states
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const tabs: { id: SettingsTab; label: string; icon: React.ReactNode; subtitle: string }[] = [
    { id: 'profile', label: t('profile'), icon: <User className="w-5 h-5" />, subtitle: t('profile_settings_subtitle') },
    { id: 'appearance', label: t('appearance'), icon: <Palette className="w-5 h-5" />, subtitle: t('appearance_subtitle') },
    { id: 'security', label: t('security_tab'), icon: <Shield className="w-5 h-5" />, subtitle: t('security_subtitle') },
    { id: 'notifications', label: t('notifications'), icon: <Bell className="w-5 h-5" />, subtitle: t('notifications_subtitle') },
  ];

  const validateSecurity = () => {
    const newErrors: Record<string, string> = {};
    if (!passwords.current) newErrors.current = t('field_required');
    if (!passwords.new) {
      newErrors.new = t('field_required');
    } else if (passwords.new.length < 8) {
      newErrors.new = t('password_too_short');
    }
    if (passwords.new !== passwords.confirm) {
      newErrors.confirm = t('passwords_dont_match');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (activeTab === 'security') {
      if (!validateSecurity()) return;
    }

    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
    
    if (activeTab === 'security') {
      setPasswords({ current: '', new: '', confirm: '' });
    }
  };

  const handlePasswordChange = (field: keyof typeof passwords, value: string) => {
    setPasswords(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const activeTabData = tabs.find(tab => tab.id === activeTab);

  return (
    <div className="space-y-6">
      <PageHeader 
        title={t('settings')} 
        subtitle={activeTabData?.subtitle || t('settings_subtitle')}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar Navigation for Settings */}
        <div className="lg:col-span-1 space-y-2">
          {tabs.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === item.id 
                  ? 'bg-gradient-primary text-white shadow-md' 
                  : 'text-text-secondary hover:bg-white hover:text-text-primary'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
          
          <div className="pt-4">
            <button 
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-500 hover:bg-rose-50 transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">{t('logout')}</span>
            </button>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <section className="card-base p-6">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                        {user?.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-text-primary">{user?.name}</h3>
                        <p className="text-sm text-text-secondary">{user?.role}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-text-primary">{t('name')}</label>
                        <input 
                          type="text" 
                          defaultValue={user?.name}
                          className="w-full px-4 py-2 rounded-lg border border-border-base focus:ring-2 focus:ring-brand-primary-start/20 focus:border-brand-primary-start outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-text-primary">{t('email_address')}</label>
                        <div className="relative">
                          <Mail className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                          <input 
                            type="email" 
                            defaultValue={user?.email}
                            className="w-full ps-10 pe-4 py-2 rounded-lg border border-border-base focus:ring-2 focus:ring-brand-primary-start/20 focus:border-brand-primary-start outline-none transition-all"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-text-primary">{t('phone_number')}</label>
                        <div className="relative">
                          <Phone className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                          <input 
                            type="tel" 
                            placeholder={t('phone_placeholder')}
                            className="w-full ps-10 pe-4 py-2 rounded-lg border border-border-base focus:ring-2 focus:ring-brand-primary-start/20 focus:border-brand-primary-start outline-none transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              )}

              {activeTab === 'appearance' && (
                <div className="space-y-6">
                  {/* Language Section */}
                  <section className="card-base p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                        <Globe className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-text-primary">{t('language')}</h3>
                        <p className="text-sm text-text-secondary">{t('select_language')}</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      {(['en', 'ar'] as Language[]).map((lang) => (
                        <button
                          key={lang}
                          onClick={() => setLanguage(lang)}
                          className={`flex-1 px-4 py-3 rounded-xl border-2 transition-all font-medium ${
                            language === lang 
                              ? 'border-brand-primary-start bg-brand-primary-start/5 text-brand-primary-start' 
                              : 'border-border-base text-text-secondary hover:border-text-secondary/30'
                          }`}
                        >
                          {lang === 'en' ? t('english') : t('arabic')}
                        </button>
                      ))}
                    </div>
                  </section>

                  {/* Theme Section */}
                  <section className="card-base p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                        <Palette className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-text-primary">{t('theme')}</h3>
                        <p className="text-sm text-text-secondary">{t('select_theme')}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {THEME_PRESETS.map((preset) => (
                        <button
                          key={preset.id}
                          onClick={() => setTheme(preset)}
                          className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                            theme.id === preset.id 
                              ? 'border-brand-primary-start bg-brand-primary-start/5' 
                              : 'border-border-base hover:border-text-secondary/30'
                          }`}
                        >
                          <div 
                            className="w-10 h-10 rounded-lg shrink-0" 
                            style={{ backgroundColor: preset.start }}
                          />
                          <div className="text-start">
                            <p className={`font-bold ${theme.id === preset.id ? 'text-brand-primary-start' : 'text-text-primary'}`}>
                              {t(`theme_${preset.id}` as any)}
                            </p>
                            <p className="text-xs text-text-secondary">{t('primary_gradient')}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </section>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6">
                  <section className="card-base p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
                        <Lock className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-text-primary">{t('change_password')}</h3>
                        <p className="text-sm text-text-secondary">{t('security_subtitle')}</p>
                      </div>
                    </div>

                    <div className="space-y-4 max-w-md">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-text-primary">{t('current_password')}</label>
                        <div className="relative">
                          <input 
                            type={showPassword ? 'text' : 'password'} 
                            value={passwords.current}
                            onChange={(e) => handlePasswordChange('current', e.target.value)}
                            className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-brand-primary-start/20 focus:border-brand-primary-start outline-none transition-all ${
                              errors.current ? 'border-rose-500' : 'border-border-base'
                            }`}
                          />
                          <button 
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute end-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {errors.current && (
                          <p className="text-xs text-rose-500 flex items-center gap-1 mt-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.current}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-text-primary">{t('new_password')}</label>
                        <input 
                          type="password" 
                          value={passwords.new}
                          onChange={(e) => handlePasswordChange('new', e.target.value)}
                          className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-brand-primary-start/20 focus:border-brand-primary-start outline-none transition-all ${
                            errors.new ? 'border-rose-500' : 'border-border-base'
                          }`}
                        />
                        {errors.new && (
                          <p className="text-xs text-rose-500 flex items-center gap-1 mt-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.new}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-text-primary">{t('confirm_new_password')}</label>
                        <input 
                          type="password" 
                          value={passwords.confirm}
                          onChange={(e) => handlePasswordChange('confirm', e.target.value)}
                          className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-brand-primary-start/20 focus:border-brand-primary-start outline-none transition-all ${
                            errors.confirm ? 'border-rose-500' : 'border-border-base'
                          }`}
                        />
                        {errors.confirm && (
                          <p className="text-xs text-rose-500 flex items-center gap-1 mt-1">
                            <AlertCircle className="w-3 h-3" />
                            {errors.confirm}
                          </p>
                        )}
                      </div>
                    </div>
                  </section>

                  <section className="card-base p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                          <Shield className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-text-primary">{t('two_factor_auth')}</h3>
                          <p className="text-sm text-text-secondary">{t('two_factor_subtitle')}</p>
                        </div>
                      </div>
                      <button className="px-4 py-2 rounded-lg border-2 border-emerald-600 text-emerald-600 font-bold hover:bg-emerald-50 transition-all">
                        {t('enable_2fa')}
                      </button>
                    </div>
                  </section>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <section className="card-base p-6">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                        <Bell className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-text-primary">{t('notifications')}</h3>
                        <p className="text-sm text-text-secondary">{t('notifications_subtitle')}</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {[
                        { id: 'email', label: t('email_notifications'), desc: t('email_notifications_desc') },
                        { id: 'push', label: t('push_notifications'), desc: t('push_notifications_desc') },
                        { id: 'marketing', label: t('marketing_emails'), desc: t('marketing_emails_desc') },
                        { id: 'security', label: t('security_alerts'), desc: t('security_alerts_desc') },
                      ].map((item) => (
                        <div key={item.id} className="flex items-center justify-between pb-4 border-b border-border-base last:border-0 last:pb-0">
                          <div>
                            <p className="font-bold text-text-primary">{item.label}</p>
                            <p className="text-sm text-text-secondary">{item.desc}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked={item.id === 'security' || item.id === 'email'} />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-brand-primary-start after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              )}

              <div className="flex items-center justify-end gap-4 pt-4">
                {saveSuccess && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 text-emerald-600 font-medium text-sm"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {t('settings_saved_success')}
                  </motion.div>
                )}
                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className={`btn-gradient-primary px-8 py-3 rounded-xl font-bold shadow-lg shadow-brand-primary-start/20 flex items-center gap-2 ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isSaving && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  {t('save_settings')}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
