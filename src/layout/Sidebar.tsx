import React, { useState, useMemo, useCallback } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Stethoscope, 
  Calendar, 
  Clock, 
  FileText, 
  Briefcase, 
  TrendingUp, 
  CreditCard, 
  HeartPulse, 
  BarChart3, 
  Settings, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  User as UserIcon,
  ShieldCheck
} from 'lucide-react';
import { motion } from 'motion/react';
import { User, NavItem, RoleType } from '../types';
import { ForceLTR } from '../components/ForceLTR';
import { canAccessPath } from '../modules/auth/permissions';
import { useTranslation } from '../hooks/useTranslation';
import { TranslationKey } from '../i18n/translations';
import { ConfirmModal } from '../components/ui/Modal';
import { NAV_ITEMS } from '../constants/navigation';

interface SidebarProps {
  currentRole: RoleType;
  currentUser: User;
  activePath: string;
  onNavigate: (path: string) => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentRole, currentUser, activePath, onNavigate, onLogout }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { t, language } = useTranslation();
  const isRTL = language === 'ar';

  const filterNavItems = useCallback((items: NavItem[]): NavItem[] => {
    return items
      .filter(item => {
        // Check explicit roles if defined
        // Groups are containers; only leaf routes need a permission check.
        if (!item.children && !canAccessPath(currentRole, item.path)) return false;
        return true;
      })
      .map(item => {
        if (item.children) {
          return {
            ...item,
            children: filterNavItems(item.children)
          };
        }
        return item;
      })
      .filter(item => !item.children || item.children.length > 0);
  }, [currentRole]);

  const filteredNav = useMemo(() => filterNavItems(NAV_ITEMS), [filterNavItems]);

  return (
    <>
      <motion.aside
        animate={{ width: isCollapsed ? 80 : 260 }}
        className="h-screen bg-white border-e border-brand-light-gray/80 flex flex-col sticky top-0 z-30 shadow-[8px_0_30px_rgba(0,77,77,0.04)]"
      >
        {/* Header / Logo */}
        <div className={`p-6 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <img src="/brand/remedix-logo.png" alt="REMEDIX" className="h-auto w-36 object-contain" />
            </div>
          )}
          {isCollapsed && (
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-deep-teal text-xl font-bold text-brand-digital-teal shadow-sm">X</div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-6 custom-scrollbar">
          {filteredNav.map((group) => (
            <div key={group.title} className="space-y-1">
              {!isCollapsed && group.children && (
                <h4 className="px-3 text-[10px] font-bold text-brand-deep-teal/65 uppercase tracking-[0.16em] mb-2">
                  {group.translationKey ? t(group.translationKey as TranslationKey) : group.title}
                </h4>
              )}
              
              {group.children ? (
                group.children.map((item) => (
                  <NavItemComponent 
                    key={item.path} 
                    item={item} 
                    isCollapsed={isCollapsed} 
                    activePath={activePath} 
                    onNavigate={onNavigate} 
                  />
                ))
              ) : (
                <NavItemComponent 
                  key={group.path}
                  item={group} 
                  isCollapsed={isCollapsed} 
                  activePath={activePath} 
                  onNavigate={onNavigate} 
                />
              )}
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-border-base space-y-2">
          <button onClick={() => onNavigate('/access')} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-brand-deep-teal hover:bg-bg-main" title={isRTL ? 'دليل الصلاحيات' : 'Role access guide'}>
            <ShieldCheck className="w-5 h-5 shrink-0" />
            {!isCollapsed && <span className="text-sm font-medium">{isRTL ? 'دليل الصلاحيات' : 'Role access guide'}</span>}
          </button>
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`w-full flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-3'} py-2 rounded-lg text-text-secondary hover:bg-bg-main transition-colors`}
            title={isCollapsed ? t('expand_menu') : t('collapse_menu')}
          >
            <div className={`${isRTL ? 'rotate-180' : ''}`}>
              {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </div>
            {!isCollapsed && <span className="text-sm font-medium">{t('collapse_menu')}</span>}
          </button>
          
          <div className="pt-2">
            <button 
              onClick={() => onNavigate('/profile')}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-3'} py-2 rounded-lg transition-colors ${
                activePath === '/profile' ? 'bg-bg-main text-text-primary' : 'text-text-secondary hover:bg-bg-main'
              }`}
              title={isCollapsed ? currentUser.name : undefined}
            >
              <UserIcon className="w-5 h-5 shrink-0" />
              {!isCollapsed && (
                <div className="flex-1 text-start overflow-hidden">
                  <p className="text-sm font-semibold text-text-primary leading-none truncate">{currentUser.name}</p>
                  <p className="text-[10px] text-text-secondary mt-1 truncate">
                    <ForceLTR>{currentUser.email}</ForceLTR>
                  </p>
                </div>
              )}
            </button>
            <button 
              onClick={() => onNavigate('/settings')}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-3'} py-2 rounded-lg transition-colors ${
                activePath === '/settings' ? 'bg-bg-main text-text-primary' : 'text-text-secondary hover:bg-bg-main'
              }`}
              title={isCollapsed ? t('settings') : undefined}
            >
              <Settings className="w-5 h-5 shrink-0" />
              {!isCollapsed && <span className="text-sm font-medium">{t('settings')}</span>}
            </button>
            <button 
              onClick={() => setShowLogoutConfirm(true)}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-3'} py-2 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors`}
              title={isCollapsed ? t('logout') : undefined}
            >
              <LogOut className="w-5 h-5 shrink-0" />
              {!isCollapsed && <span className="text-sm font-medium">{t('logout')}</span>}
            </button>
          </div>
        </div>
      </motion.aside>

      <ConfirmModal 
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={onLogout}
        title={t('logout')}
        message={t('confirm_logout')}
        confirmLabel={t('confirm')}
        cancelLabel={t('cancel')}
        type="danger"
      />
    </>
  );
};

const NavItemComponent: React.FC<{ 
  item: NavItem; 
  isCollapsed: boolean; 
  activePath: string; 
  onNavigate: (path: string) => void 
}> = ({ item, isCollapsed, activePath, onNavigate }) => {
  const isActive = activePath === item.path;
  const { t } = useTranslation();
  
  return (
    <button
      onClick={() => onNavigate(item.path)}
      className={`w-full flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-3'} py-2.5 rounded-xl transition-all group ${
        isActive 
          ? 'bg-gradient-primary text-white shadow-md' 
          : 'text-text-secondary hover:bg-bg-main hover:text-text-primary'
      }`}
      title={isCollapsed ? (item.translationKey ? t(item.translationKey as TranslationKey) : item.title) : undefined}
    >
      <div className={`shrink-0 ${isActive ? 'text-white' : 'text-text-secondary group-hover:text-brand-primary-end'}`}>
        {item.icon}
      </div>
      {!isCollapsed && <span className="text-sm font-medium whitespace-nowrap">{item.translationKey ? t(item.translationKey as TranslationKey) : item.title}</span>}
    </button>
  );
};
