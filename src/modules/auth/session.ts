import { User, RoleType } from '../../types';
import { ROLE_ORDER } from './permissions';

let actor: User | null = null;
let version = 0;
export const setSessionActor = (user: User | null) => { actor = user ? { ...user } : null; version += 1; };
export const getSessionVersion = () => version;
export const getSessionActor = () => actor ? { ...actor } : null;
export function demoIdentity(name: string, role: RoleType): User {
  if (!ROLE_ORDER.includes(role)) throw new Error('Unknown role');
  const employeeId = role === 'Senior Manager' ? '8' : role === 'Department Head' ? '2' : role === 'Employee' ? '3' : role === 'HR Manager' ? '1' : role === 'HR Officer' ? '5' : role === 'Payroll Officer' ? '6' : undefined;
  const department = role === 'Department Head' ? 'Nursing' : role === 'Employee' ? 'Radiology' : role === 'HR Officer' ? 'Pediatrics' : role === 'Payroll Officer' ? 'Cardiology' : undefined;
  return { id: `demo-${role.replaceAll(' ', '-')}`, employeeId, name, email: `${name.toLowerCase().replace(/\s+/g, '.')}@remedix.demo`, role, department, status: 'active' };
}
