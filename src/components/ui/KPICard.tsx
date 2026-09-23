import React from 'react';
import { motion } from 'motion/react';
import { useTranslation } from '../../hooks/useTranslation';

interface KPICardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    isPositive: boolean;
  };
  icon: React.ReactNode;
  onClick?: () => void;
}

export const KPICard: React.FC<KPICardProps> = ({ title, value, change, icon, onClick }) => {
  const { t } = useTranslation();
  
  return (
    <motion.div
      whileHover={{ y: -4 }}
      onClick={onClick}
      className={`card-base p-6 cursor-pointer flex items-start justify-between transition-all hover:shadow-md`}
    >
      <div>
        <p className="text-text-secondary text-sm font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-text-primary">{value}</h3>
        {change && (
          <div className={`flex items-center mt-2 text-xs font-medium ${change.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
            <span>{change.isPositive ? '↑' : '↓'} {Math.abs(change.value)}%</span>
            <span className="text-text-secondary ms-1 font-normal text-[10px]">{t('vs_last_month')}</span>
          </div>
        )}
      </div>
      <div className="p-3 rounded-lg bg-brand-primary-start/10 text-brand-primary-end">
        {icon}
      </div>
    </motion.div>
  );
};
