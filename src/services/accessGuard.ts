import { MOCK_EMPLOYEES, MOCK_JOB_OPENINGS } from '../mockData';
import { RoleType, User } from '../types';
import { getModuleAccess, withinScope } from '../modules/auth/permissions';
import { getSessionActor, getSessionVersion } from '../modules/auth/session';

type Row = Record<string, any>;
type Rule = { roles?: RoleType[]; metadata?: boolean; target?: (...args: any[]) => Row | undefined; validate?: (user: User, ...args: any[]) => boolean };
export type ServiceRules = Record<string, Rule>;
export const HR: RoleType[] = ['Senior Manager', 'HR Manager', 'HR Officer'];
export const FINANCE: RoleType[] = ['Payroll Officer', 'Accountant'];
let employeeDirectory = () => MOCK_EMPLOYEES;
export const setEmployeeDirectory = (lookup: typeof employeeDirectory) => { employeeDirectory = lookup; };
export const knownEmployee = (id: string) => employeeDirectory().find(e => e.id === id);
export function scopedRow(row: Row, path: string): Row {
  const employeeId = row.employeeId ?? (path === '/employees' ? row.id : undefined);
  const department = knownEmployee(employeeId)?.department ?? row.department ?? MOCK_JOB_OPENINGS.find(o => o.id === row.openingId)?.department;
  return { ...row, employeeId, department };
}
export function projectRecord(user: User, path: string, row: Row): Row | null {
  if (!withinScope(user, path, scopedRow(row, path))) return null;
  if (path === '/health' && user.role !== 'Occupational Health Officer') return null;
  if (path === '/performance' && user.role === 'Employee' && row.status !== 'Finalized') return null;
  const result: Row = { ...row, ...(row.employeeId ? { department: scopedRow(row,path).department } : {}) };
  if (path === '/employees' && !HR.includes(user.role)) {
    return Object.fromEntries(['id', 'employeeNo', 'firstName', 'lastName', 'department', 'position', 'status', 'email'].map(k => [k, row[k]]));
  }
  if ((path === '/leaves' || path === '/attendance') && !HR.includes(user.role) && row.employeeId !== user.employeeId) {
    delete result.reason; delete result.attachmentUrl; delete result.contactDuringLeave;
  }
  return result;
}

/** Mock-service boundary only. Real deployments MUST enforce equivalent rules on a server. */
export function secureService<T extends Record<string, (...args: any[]) => Promise<any>>>(path: string, service: T, rules: ServiceRules): T {
  return Object.fromEntries(Object.entries(service).map(([name, fn]) => [name, async (...args: any[]) => {
    const user = getSessionActor();
    const sessionVersion = getSessionVersion();
    const rule = rules[name];
    const denied = () => ({ success: false, status: 403, data: null, message: 'Access denied: role, scope or workflow does not permit this action.' });
    if (!user || user.status === 'inactive' || !getModuleAccess(user.role, path) || !rule) return denied();
    if (rule.roles && user.role !== 'Senior Manager' && !rule.roles.includes(user.role)) return denied();
    if (rule.target) {
      const target = rule.target(...args);
      if (!target || !withinScope(user, path, scopedRow(target, path))) return denied();
    }
    if (rule.validate && !rule.validate(user, ...args)) return denied();
    const response = await fn(...args);
    // Never deliver an old session's pending response to a different actor.
    if (getSessionVersion() !== sessionVersion) return denied();
    if (!response.success || rule.metadata || rule.roles) return response;
    const data = response.data;
    const projected = Array.isArray(data) ? data.map(r => projectRecord(user, path, r)).filter(Boolean) : data && typeof data === 'object' ? projectRecord(user, path, data) : null;
    return { ...response, data: projected };
  }])) as T;
}
