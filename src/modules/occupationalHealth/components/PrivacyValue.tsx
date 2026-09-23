import React, { useEffect } from 'react';
import { Lock } from 'lucide-react';
import { OHRole } from '../types';
import { auditLogger } from '../utils/auditLogger';

interface PrivacyValueProps {
  value: React.ReactNode;
  role: OHRole;
  requiredRole?: OHRole;
  placeholder?: string;
  resourceName?: string; // For audit logging
}

export const PrivacyValue: React.FC<PrivacyValueProps> = ({ 
  value, 
  role, 
  requiredRole = 'OHO',
  placeholder = 'Restricted',
  resourceName = 'Confidential Record'
}) => {
  const hasAccess = (current: string, required: string) => {
    const levels: Record<string, number> = {
      'OHO': 4,
      'HR_COMPLIANCE': 3,
      'DEPT_HEAD': 2,
      'EMPLOYEE': 1
    };
    return (levels[current] || 0) >= (levels[required] || 0);
  };

  const isAuthorized = hasAccess(role as string, requiredRole as string);

  useEffect(() => {
    if (isAuthorized && value && value !== '-') {
      auditLogger.log('ACCESS_SENSITIVE_DATA', resourceName, `User role: ${role}`);
    }
  }, [isAuthorized, role, resourceName, value]);

  if (isAuthorized) {
    return <>{value || '-'}</>;
  }

  return (
    <span className="inline-flex items-center gap-1.5 text-text-secondary italic text-sm bg-bg-main px-2 py-0.5 rounded border border-border-main">
      <Lock className="w-3 h-3" />
      {placeholder}
    </span>
  );
};
