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
  Active: 'brand-status-soft',
  Inactive: 'brand-status-neutral',
  Pending: 'brand-status-attention',
  Approved: 'brand-status-soft',
  Rejected: 'brand-status-critical',
  Valid: 'brand-status-soft',
  Expired: 'brand-status-critical',
  Expiring: 'brand-status-attention',
  Draft: 'brand-status-neutral',
  Published: 'brand-status-soft',
  'On Leave': 'brand-status-neutral',
  Busy: 'brand-status-strong',
  Available: 'brand-status-soft',
  'Not Available': 'brand-status-neutral',
  // Type-based styles
  emerald: 'brand-status-soft',
  blue: 'brand-status-soft',
  amber: 'brand-status-attention',
  rose: 'brand-status-critical',
  slate: 'brand-status-neutral',
  indigo: 'brand-status-soft',
  purple: 'brand-status-soft',
  teal: 'brand-status-soft',
  orange: 'brand-status-strong',
  gray: 'brand-status-neutral',
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
