import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  noPadding?: boolean;
  footer?: React.ReactNode;
  footerActions?: {
    primary?: {
      label: string;
      onClick: () => void;
      isLoading?: boolean;
      disabled?: boolean;
    };
    secondary?: {
      label: string;
      onClick: () => void;
    };
  };
}

export const Drawer: React.FC<DrawerProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  subtitle,
  children, 
  size = 'md',
  noPadding = false,
  footer,
  footerActions
}) => {
  const { language } = useSettings();
  const isRTL = language === 'ar';

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ x: isRTL ? '-100%' : '100%' }}
            animate={{ x: 0 }}
            exit={{ x: isRTL ? '-100%' : '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`fixed top-0 end-0 h-full w-full ${sizeClasses[size]} bg-white shadow-2xl z-50 flex flex-col`}
          >
            <div className={`p-6 border-b border-border-base flex items-center justify-between bg-white sticky top-0 z-10 ${!title ? 'justify-end' : ''}`}>
              {title && (
                <div>
                  <h2 className="text-lg font-bold text-text-primary tracking-tight">{title}</h2>
                  {subtitle && <p className="text-xs text-text-secondary mt-0.5">{subtitle}</p>}
                </div>
              )}
              <button onClick={onClose} className="p-2 hover:bg-bg-main rounded-full transition-colors">
                <X className="w-5 h-5 text-text-secondary" />
              </button>
            </div>
            
            <div className={`flex-1 overflow-y-auto ${noPadding ? '' : 'p-6'}`}>
              {children}
            </div>

            {(footer || footerActions) && (
              <div className="p-6 border-t border-border-base bg-bg-main/30 sticky bottom-0 z-10 backdrop-blur-md">
                {footerActions ? (
                  <div className="flex gap-3">
                    {footerActions.secondary && (
                      <button
                        onClick={footerActions.secondary.onClick}
                        className="flex-1 px-4 py-2.5 border border-border-base text-text-secondary rounded-xl font-bold hover:bg-white transition-all"
                      >
                        {footerActions.secondary.label}
                      </button>
                    )}
                    {footerActions.primary && (
                      <button
                        onClick={footerActions.primary.onClick}
                        disabled={footerActions.primary.isLoading || footerActions.primary.disabled}
                        className="flex-1 btn-gradient-primary px-4 py-2.5 rounded-xl text-white font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
                      >
                        {footerActions.primary.isLoading && (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        )}
                        {footerActions.primary.label}
                      </button>
                    )}
                  </div>
                ) : footer}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
