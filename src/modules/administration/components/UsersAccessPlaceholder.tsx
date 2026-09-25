import React, { useState, useMemo } from 'react';
import { Users, Key, ShieldAlert, UserPlus, Search, AlertCircle, Edit2, ShieldCheck, Save } from 'lucide-react';
import { useTranslation } from '../../../hooks/useTranslation';
import { mockAdminUsers } from '../mockData';
import { AdminUser } from '../types';
import { RoleType } from '../../../types';
import { ROLE_ACCESS_POLICIES, ROLE_ORDER } from '../../auth/permissions';
import { MODULE_NAMES } from '../../../pages/RoleAccess';
import { Drawer } from '../../../components/ui/Drawer';
import { useToast } from '../../../components/ui/Toast';
import { StatusBadge } from '../../../components/ui/StatusBadge';

const ROLE_TRANSLATION_KEYS: Record<RoleType, string> = {
  'Senior Manager': 'senior_manager',
  'System Admin': 'system_admin',
  'HR Manager': 'hr_manager',
  'HR Officer': 'hr_officer',
  'Department Head': 'dept_head',
  'Payroll Officer': 'payroll_officer',
  Accountant: 'accountant',
  'Occupational Health Officer': 'occ_health_officer',
  Employee: 'employee',
};

const MODULE_TRANSLATION_KEYS: Record<string, string> = {
  '/': 'dashboard',
  '/employees': 'employees',
  '/doctors': 'doctors',
  '/scheduling': 'scheduling',
  '/leaves': 'leaves',
  '/attendance': 'attendance',
  '/licenses': 'licenses',
  '/recruitment': 'recruitment',
  '/performance': 'performance',
  '/payroll': 'payroll',
  '/health': 'health',
  '/reports': 'reports',
  '/admin': 'admin',
  '/settings': 'settings',
  '/profile': 'profile',
};

export const UsersAccessPlaceholder: React.FC = () => {
  const { t, language } = useTranslation();
  const { info } = useToast();
  const [users, setUsers] = useState<AdminUser[]>(mockAdminUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [selectedRole, setSelectedRole] = useState<RoleType>('HR Manager');
  const [isSaving, setIsSaving] = useState(false);
  const selectedPolicy = ROLE_ACCESS_POLICIES[selectedRole];

  const roleLabel = (role: RoleType) => role === 'Senior Manager' ? (language === 'ar' ? 'المدير الأعلى' : 'Senior Manager') : t(ROLE_TRANSLATION_KEYS[role] as any);
  const moduleLabel = (path: string) => MODULE_NAMES[path]?.[language === 'ar' ? 0 : 1] || path;
  const accessLabel = (level: string) => level === 'manage' ? (language === 'ar' ? 'إجراءات محددة' : 'Scoped actions') : level === 'review' ? t('approval_review') : t('view');
  const scopeLabel = (scope: string) => scope === 'organization'
    ? t('organization_scope')
    : scope === 'department' ? t('department_scope') : t('own_records');

  const filteredUsers = useMemo(() => {
    return users.filter(user => 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsAddDrawerOpen(false);
      info(language === 'ar' ? 'هذه معاينة فقط؛ إنشاء الحساب الحقيقي غير مربوط بخادم بعد.' : 'Preview only; real account provisioning is not connected yet.');
    }, 1000);
  };

  const handleEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setIsEditDrawerOpen(false);
      info(language === 'ar' ? 'هذه معاينة فقط؛ لم تتغير صلاحيات حساب فعلي.' : 'Preview only; no real account permissions were changed.');
    }, 1000);
  };

  const openEditDrawer = (user: AdminUser) => {
    setSelectedUser(user);
    setIsEditDrawerOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-bold text-blue-800">{t('user_management')}</h4>
          <p className="text-xs text-blue-700 mt-1 leading-relaxed">
            {language === 'ar' ? 'صلاحيات الواجهات والخدمات التجريبية حسب الدور. إدارة الحسابات هنا معاينة فقط ولا تغيّر هوية تسجيل الدخول. يلزم خادم ومصادقة حقيقية قبل الاستخدام الفعلي.' : 'Demo routes and services are role-scoped. Account forms are previews only and do not change login identities. A backend and real authentication are required before production use.'}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <input 
            type="text" 
            placeholder={t('search_users_placeholder')}
            className="w-full pl-10 pr-4 py-2 bg-white border border-border-base rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary-start/20"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button 
          onClick={() => setIsAddDrawerOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-primary text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all"
        >
          <UserPlus className="w-4 h-4" />
          {t('add_new_user')}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-border-base overflow-hidden shadow-sm">
          <div className="p-6 border-b border-border-base flex items-center justify-between bg-bg-main/30">
            <h3 className="font-bold text-text-primary">{t('active_system_users')}</h3>
            <span className="text-xs font-medium px-2 py-1 bg-white border border-border-base rounded-lg text-text-secondary">
              {filteredUsers.length} {t('users')}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-start border-collapse">
              <thead>
                <tr className="bg-bg-main/50 border-b border-border-base">
                  <th className="px-6 py-3 text-[10px] font-bold text-text-secondary uppercase tracking-widest text-start">{t('user')}</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-text-secondary uppercase tracking-widest text-start">{t('role')}</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-text-secondary uppercase tracking-widest text-start">{t('status')}</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-text-secondary uppercase tracking-widest text-end">{t('actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-base">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-bg-main/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-white text-[10px] font-bold">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-text-primary">{user.name}</p>
                          <p className="text-[10px] text-text-secondary">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium text-text-secondary bg-bg-main px-2 py-1 rounded-lg border border-border-base">
                        {user.role === 'System Admin' ? t('system_admin') : 
                         user.role === 'HR Manager' ? t('hr_manager') : 
                         user.role === 'HR Officer' ? t('hr_officer') : 
                         user.role === 'Department Head' ? t('dept_head') : user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={user.status} />
                    </td>
                    <td className="px-6 py-4 text-end">
                      <button 
                        onClick={() => openEditDrawer(user)}
                        className="p-1.5 rounded-lg hover:bg-bg-main text-text-secondary hover:text-brand-primary-start transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-border-base p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-brand-muted-teal flex items-center justify-center text-brand-deep-teal">
                <Key className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-text-primary text-sm">{t('role_permissions')}</h3>
                <p className="text-[10px] text-text-secondary mt-0.5">{t('access_level')}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {ROLE_ORDER.map((role) => {
                const isSelected = selectedRole === role;
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setSelectedRole(role)}
                    className={`flex items-center justify-between gap-3 rounded-xl border p-3 text-start transition-all ${
                      isSelected
                        ? 'border-brand-deep-teal bg-brand-muted-teal/60'
                        : 'border-border-base/70 bg-bg-main/40 hover:border-brand-digital-teal/50'
                    }`}
                  >
                    <span className="text-xs font-bold text-text-primary">{roleLabel(role)}</span>
                    <span className="text-[10px] font-semibold text-text-secondary">
                      {ROLE_ACCESS_POLICIES[role].modules.length} {t('modules_count')}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-5 border-t border-border-base pt-4">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <h4 className="text-sm font-bold text-brand-deep-teal">{roleLabel(selectedRole)}</h4>
                  <p className="text-[10px] text-text-secondary mt-1">{selectedPolicy.modules.length} {t('modules_count')}</p>
                </div>
                <ShieldCheck className="w-5 h-5 text-brand-digital-teal shrink-0" />
              </div>
              <div className="space-y-2 max-h-80 overflow-y-auto pe-1 custom-scrollbar">
                {selectedPolicy.modules.map((access) => (
                  <div key={access.path} className="flex items-center justify-between gap-3 rounded-lg border border-border-base/70 px-3 py-2">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-text-primary truncate">{moduleLabel(access.path)}</p>
                      <p className="text-[10px] text-text-secondary">{t('role_scope')}: {scopeLabel(access.scope)}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-brand-muted-teal px-2 py-1 text-[10px] font-bold text-brand-deep-teal">
                      {accessLabel(access.level)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-border-base p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-text-primary text-sm">{t('access_policies')}</h3>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed mb-4">
              {t('access_policies_desc')}
            </p>
            <button className="w-full py-2 bg-bg-main border border-border-base rounded-xl text-xs font-bold text-text-secondary hover:bg-border-base transition-colors">
              {t('configure_policies')}
            </button>
          </div>
        </div>
      </div>

      {/* Add User Drawer */}
      <Drawer
        isOpen={isAddDrawerOpen}
        onClose={() => setIsAddDrawerOpen(false)}
        title={t('add_new_user')}
      >
        <form onSubmit={handleAddUser} className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">{t('full_name')}</label>
                <input required type="text" className="w-full px-4 py-2 bg-bg-main border border-border-base rounded-xl text-sm focus:ring-2 focus:ring-brand-primary-start/20" placeholder="e.g. John Doe" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">{t('email')}</label>
                <input required type="email" className="w-full px-4 py-2 bg-bg-main border border-border-base rounded-xl text-sm focus:ring-2 focus:ring-brand-primary-start/20" placeholder="john.doe@oryxstaff.com" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">{t('role')}</label>
                <select required className="w-full px-4 py-2 bg-bg-main border border-border-base rounded-xl text-sm focus:ring-2 focus:ring-brand-primary-start/20">
                  <option value="">{t('select_role')}</option>
                  <option value="Senior Manager">{language === 'ar' ? 'المدير الأعلى' : 'Senior Manager'}</option>
                  <option value="System Admin">{t('system_admin')}</option>
                  <option value="HR Manager">{t('hr_manager')}</option>
                  <option value="HR Officer">{t('hr_officer')}</option>
                  <option value="Department Head">{t('dept_head')}</option>
                  <option value="Payroll Officer">{t('payroll_officer')}</option>
                  <option value="Accountant">{t('accountant')}</option>
                  <option value="Occupational Health Officer">{t('occ_health_officer')}</option>
                  <option value="Employee">{t('employee')}</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">{t('department')}</label>
                <select required className="w-full px-4 py-2 bg-bg-main border border-border-base rounded-xl text-sm focus:ring-2 focus:ring-brand-primary-start/20">
                  <option value="">{t('select_department')}</option>
                  <option value="IT">{t('it_dept')}</option>
                  <option value="HR">{t('hr_dept')}</option>
                  <option value="Clinical">{t('clinical_dept')}</option>
                </select>
              </div>
            </div>
          </div>
          <div className="p-6 border-t border-border-base bg-bg-main/50 flex items-center gap-3">
            <button type="button" onClick={() => setIsAddDrawerOpen(false)} className="flex-1 px-4 py-2 bg-white border border-border-base rounded-xl text-sm font-bold text-text-secondary hover:bg-bg-main transition-colors">
              {t('cancel')}
            </button>
            <button type="submit" disabled={isSaving} className="flex-1 px-4 py-2 bg-gradient-primary text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50">
              {isSaving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <UserPlus className="w-4 h-4" />}
              {t('create_user')}
            </button>
          </div>
        </form>
      </Drawer>

      {/* Edit User Drawer */}
      <Drawer
        isOpen={isEditDrawerOpen}
        onClose={() => setIsEditDrawerOpen(false)}
        title={t('edit_user')}
      >
        <form onSubmit={handleEditUser} className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {selectedUser && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">{t('full_name')}</label>
                  <input required type="text" defaultValue={selectedUser.name} className="w-full px-4 py-2 bg-bg-main border border-border-base rounded-xl text-sm focus:ring-2 focus:ring-brand-primary-start/20" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">{t('email')}</label>
                  <input required type="email" defaultValue={selectedUser.email} className="w-full px-4 py-2 bg-bg-main border border-border-base rounded-xl text-sm focus:ring-2 focus:ring-brand-primary-start/20" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">{t('role')}</label>
                  <select required defaultValue={selectedUser.role} className="w-full px-4 py-2 bg-bg-main border border-border-base rounded-xl text-sm focus:ring-2 focus:ring-brand-primary-start/20">
                    <option value="Senior Manager">{language === 'ar' ? 'المدير الأعلى' : 'Senior Manager'}</option>
                  <option value="System Admin">{t('system_admin')}</option>
                    <option value="HR Manager">{t('hr_manager')}</option>
                    <option value="HR Officer">{t('hr_officer')}</option>
                    <option value="Department Head">{t('dept_head')}</option>
                    <option value="Payroll Officer">{t('payroll_officer')}</option>
                    <option value="Accountant">{t('accountant')}</option>
                    <option value="Occupational Health Officer">{t('occ_health_officer')}</option>
                    <option value="Employee">{t('employee')}</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">{t('status')}</label>
                  <select required defaultValue={selectedUser.status} className="w-full px-4 py-2 bg-bg-main border border-border-base rounded-xl text-sm focus:ring-2 focus:ring-brand-primary-start/20">
                    <option value="active">{t('active')}</option>
                    <option value="inactive">{t('inactive')}</option>
                    <option value="pending">{t('pending')}</option>
                  </select>
                </div>
              </div>
            )}
          </div>
          <div className="p-6 border-t border-border-base bg-bg-main/50 flex items-center gap-3">
            <button type="button" onClick={() => setIsEditDrawerOpen(false)} className="flex-1 px-4 py-2 bg-white border border-border-base rounded-xl text-sm font-bold text-text-secondary hover:bg-bg-main transition-colors">
              {t('cancel')}
            </button>
            <button type="submit" disabled={isSaving} className="flex-1 px-4 py-2 bg-gradient-primary text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50">
              {isSaving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Save className="w-4 h-4" />}
              {t('save_changes')}
            </button>
          </div>
        </form>
      </Drawer>
    </div>
  );
};
