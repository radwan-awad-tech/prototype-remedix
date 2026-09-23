import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { Lock, Mail, User, ShieldCheck, Eye, EyeOff, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { useTranslation } from '../../hooks/useTranslation';
import { useSettings } from '../../context/SettingsContext';
import { ForceLTR } from '../../components/ForceLTR';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { t, language } = useTranslation();
  const { setLanguage } = useSettings();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('HR Manager');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [view, setView] = useState<'login' | 'forgot-password'>('login');
  const [resetEmail, setResetEmail] = useState('');
  const [isResetSent, setIsResetSent] = useState(false);

  const roles = [
    { id: 'HR Manager', translationKey: 'hr_manager' as const },
    { id: 'HR Officer', translationKey: 'hr_officer' as const },
    { id: 'Department Head', translationKey: 'dept_head' as const },
    { id: 'System Admin', translationKey: 'system_admin' as const },
    { id: 'Payroll Officer', translationKey: 'payroll_officer' as const },
    { id: 'Accountant', translationKey: 'accountant' as const },
    { id: 'Occupational Health Officer', translationKey: 'oho' as const },
    { id: 'Employee', translationKey: 'employee' as const }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Simulate network delay
    setTimeout(() => {
      if (!identifier || !password) {
        setError(t('login_error_empty'));
        setIsSubmitting(false);
        return;
      }

      // For demo purposes, any non-empty credentials work
      login(identifier, selectedRole);
      setIsSubmitting(false);
    }, 800);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Simulate network delay
    setTimeout(() => {
      if (!resetEmail) {
        setError(t('login_error_empty'));
        setIsSubmitting(false);
        return;
      }

      setIsResetSent(true);
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-bg-main flex items-center justify-center p-4 relative">
      {/* Language Toggle */}
      <div className="absolute top-4 end-4 flex gap-2">
        <button
          onClick={() => setLanguage('en')}
          className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${
            language === 'en' 
              ? 'bg-brand-deep-teal text-white shadow-sm'
              : 'bg-white text-text-secondary hover:bg-gray-50'
          }`}
        >
          EN
        </button>
        <button
          onClick={() => setLanguage('ar')}
          className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${
            language === 'ar' 
              ? 'bg-brand-deep-teal text-white shadow-sm'
              : 'bg-white text-text-secondary hover:bg-gray-50'
          }`}
        >
          AR
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center rounded-2xl border border-brand-light-gray bg-white px-8 py-5 shadow-sm mb-5">
            <img src="/brand/remedix-logo.png" alt="REMEDIX" className="w-56 max-w-full" />
          </div>
          <p className="brand-eyebrow"><ForceLTR>REMEDIX</ForceLTR></p>
          <p className="text-text-secondary mt-2">{t('hospital_mgmt_system')}</p>
        </div>

        {/* Login Card */}
        <div className="card-base p-8 shadow-[0_18px_50px_rgba(0,77,77,0.12)] border border-border-base bg-white overflow-hidden relative">
          <AnimatePresence mode="wait">
            {view === 'login' ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-text-primary">{t('welcome_back')}</h2>
                  <p className="text-sm text-text-secondary mt-1">{t('sign_in_subtitle')}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && (
                    <div className="p-3 rounded-lg bg-rose-50 border border-rose-100 text-rose-600 text-sm animate-in fade-in slide-in-from-top-1">
                      {error}
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-text-primary" htmlFor="identifier">
                      {t('username_or_email')}
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none text-text-secondary group-focus-within:text-brand-deep-teal transition-colors">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        id="identifier"
                        type="text"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        className="input-base ps-10 w-full"
                        placeholder="name@medistaff.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-text-primary" htmlFor="password">
                        {t('password')}
                      </label>
                      <button 
                        type="button"
                        className="text-xs font-medium text-brand-deep-teal hover:underline"
                        onClick={() => {
                          setView('forgot-password');
                          setError('');
                        }}
                      >
                        {t('forgot_password')}
                      </button>
                    </div>
                    <div className="relative group">
                      <div className="absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none text-text-secondary group-focus-within:text-brand-deep-teal transition-colors">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input-base ps-10 pe-10 w-full"
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 end-0 pe-3 flex items-center text-text-secondary hover:text-text-primary transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-text-primary" htmlFor="role">
                      {t('select_role_demo')}
                    </label>
                    <select
                      id="role"
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="input-base w-full"
                    >
                      {roles.map(role => (
                        <option key={role.id} value={role.id}>{t(role.translationKey)}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-border-base text-brand-deep-teal focus:ring-brand-deep-teal transition-all cursor-pointer"
                    />
                    <label htmlFor="remember-me" className="ms-2 block text-sm text-text-secondary cursor-pointer">
                      {t('remember_me')}
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-brand-deep-teal hover:bg-[#003B3B] text-white rounded-xl py-2.5 flex items-center justify-center gap-2 shadow-md shadow-brand-deep-teal/20 transition-colors disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>{t('sign_in')}</span>
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="forgot-password"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-text-primary">{t('reset_password_title')}</h2>
                  <p className="text-sm text-text-secondary mt-1">{t('reset_password_subtitle')}</p>
                </div>

                {isResetSent ? (
                  <div className="space-y-6 py-4">
                    <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm flex flex-col items-center text-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                        <ShieldCheck className="w-6 h-6" />
                      </div>
                      <p className="font-medium">{t('reset_link_sent')}</p>
                    </div>
                    <button
                      onClick={() => {
                        setView('login');
                        setIsResetSent(false);
                        setResetEmail('');
                      }}
                      className="w-full bg-brand-deep-teal hover:bg-[#003B3B] text-white rounded-xl py-2.5 transition-colors"
                    >
                      {t('back_to_login')}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleResetPassword} className="space-y-5">
                    {error && (
                      <div className="p-3 rounded-lg bg-rose-50 border border-rose-100 text-rose-600 text-sm">
                        {error}
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-text-primary" htmlFor="reset-email">
                        {t('email_address')}
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none text-text-secondary group-focus-within:text-brand-deep-teal transition-colors">
                          <Mail className="w-4 h-4" />
                        </div>
                        <input
                          id="reset-email"
                          type="email"
                          value={resetEmail}
                          onChange={(e) => setResetEmail(e.target.value)}
                          className="input-base ps-10 w-full"
                          placeholder="name@medistaff.com"
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-brand-deep-teal hover:bg-[#003B3B] text-white rounded-xl py-2.5 flex items-center justify-center gap-2 shadow-md shadow-brand-deep-teal/20 transition-colors disabled:opacity-70"
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <span>{t('send_reset_link')}</span>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setView('login');
                        setError('');
                      }}
                      className="w-full py-2.5 text-sm font-bold text-text-secondary hover:text-text-primary transition-colors"
                    >
                      {t('back_to_login')}
                    </button>
                  </form>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-8 pt-6 border-t border-border-base text-center">
            <p className="text-xs text-text-secondary">
              &copy; 2026 <ForceLTR>REMEDIX</ForceLTR>. {t('all_rights_reserved')}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
