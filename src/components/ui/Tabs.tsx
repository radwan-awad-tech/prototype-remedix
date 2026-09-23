import React from 'react';
import { motion } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useTranslation } from '../../hooks/useTranslation';
import { TranslationKey } from '../../i18n/translations';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  translationKey?: TranslationKey;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
  variant?: 'underline' | 'pill';
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange, className, variant = 'underline' }) => {
  const { t } = useTranslation();

  return (
    <div className={cn(
      "flex items-center gap-1 overflow-x-auto no-scrollbar",
      variant === 'underline' && "border-b border-border-base",
      className
    )}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative px-4 py-2.5 text-sm font-medium transition-all flex items-center gap-2 rounded-lg",
              variant === 'underline' ? (
                isActive ? "text-brand-primary-end" : "text-text-secondary hover:text-text-primary"
              ) : (
                isActive ? "bg-white text-brand-primary-end shadow-sm" : "text-text-secondary hover:bg-white/50"
              )
            )}
          >
            {tab.icon}
            {tab.translationKey ? t(tab.translationKey) : tab.label}
            {isActive && variant === 'underline' && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 inset-x-0 h-0.5 bg-brand-primary-end"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};
