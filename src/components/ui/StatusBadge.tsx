import React from 'react';
import { StatusType } from '../../types';
import { useTranslation } from '../../hooks/useTranslation';

interface StatusBadgeProps {
  status?: StatusType | string;
  customLabel?: string;
  translationKey?: any;
  label?: string;
  type?: 'emerald' | 'blue' | 'amber' | 'rose' | 'slate' | 'indigo' | 'purple' | 'teal' | 'orange' | 'gray' | 'indigo';
  className?: string;
}

const statusStyles: Record<string, string> = {
  Active: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Inactive: 'bg-slate-100 text-slate-700 border-slate-200',
  Pending: 'bg-amber-100 text-amber-700 border-amber-200',
  Approved: 'bg-blue-100 text-blue-700 border-blue-200',
  Rejected: 'bg-rose-100 text-rose-700 border-rose-200',
  Valid: 'bg-teal-100 text-teal-700 border-teal-200',
  Expired: 'bg-orange-100 text-orange-700 border-orange-200',
  Expiring: 'bg-amber-50 text-amber-600 border-amber-100',
  Draft: 'bg-gray-100 text-gray-700 border-gray-200',
  Published: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  'On Leave': 'bg-purple-100 text-purple-700 border-purple-200',
  'Busy': 'bg-rose-100 text-rose-700 border-rose-200',
  'Available': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'Not Available': 'bg-slate-100 text-slate-700 border-slate-200',
  // Type-based styles
  emerald: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  blue: 'bg-blue-100 text-blue-700 border-blue-200',
  amber: 'bg-amber-100 text-amber-700 border-amber-200',
  rose: 'bg-rose-100 text-rose-700 border-rose-200',
  slate: 'bg-slate-100 text-slate-700 border-slate-200',
  indigo: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  purple: 'bg-purple-100 text-purple-700 border-purple-200',
  teal: 'bg-teal-100 text-teal-700 border-teal-200',
  orange: 'bg-orange-100 text-orange-700 border-orange-200',
  gray: 'bg-gray-100 text-gray-700 border-gray-200',
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  customLabel, 
  translationKey, 
  label, 
  type,
  className = ''
}) => {
  const { t } = useTranslation();
  
  const displayLabel = label || customLabel || (status ? t(translationKey || status.toLowerCase() as any) : '');
  const styleKey = type || status || 'gray';

  if (!displayLabel && !status) return null;

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-medium border whitespace-nowrap inline-flex items-center justify-center ${statusStyles[styleKey] || statusStyles.gray} ${className}`}>
      {displayLabel}
    </span>
  );
};
