/**
 * Lightweight frontend audit logging utility for Occupational Health.
 * In a real application, this would send logs to a secure backend.
 */

export interface AuditLog {
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  details?: string;
}

const OH_AUDIT_LOG_KEY = 'oh_audit_logs';

export const auditLogger = {
  log: (action: string, resource: string, details?: string) => {
    const logs: AuditLog[] = JSON.parse(localStorage.getItem(OH_AUDIT_LOG_KEY) || '[]');
    const newLog: AuditLog = {
      timestamp: new Date().toISOString(),
      user: 'Current User', // In real app, get from auth context
      action,
      resource,
      details,
    };
    
    // Keep only last 100 logs for mock purposes
    const updatedLogs = [newLog, ...logs].slice(0, 100);
    localStorage.setItem(OH_AUDIT_LOG_KEY, JSON.stringify(updatedLogs));
    
    console.log(`[OH Audit] ${newLog.timestamp} - ${newLog.action} on ${newLog.resource}`, details || '');
  },

  getLogs: (): AuditLog[] => {
    return JSON.parse(localStorage.getItem(OH_AUDIT_LOG_KEY) || '[]');
  }
};
