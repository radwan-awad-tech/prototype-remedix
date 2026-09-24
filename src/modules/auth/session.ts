import { User, RoleType } from '../../types';
import { ROLE_ORDER } from './permissions';

let actor: User | null = null;
let version = 0;
export const setSessionActor = (user: User | null) => { actor = user ? { ...user } : null; version += 1; };
export const getSessionVersion = () => version;
export const getSessionActor = () => actor ? { ...actor } : null;
export function demoIdentity(name: string, role: RoleType): User {
  if (!ROLE_ORDER.includes(role)) throw new Error('Unknown role');
  const employeeId = role === 'Department Head' ? '2' : role === 'Employee' ? '3' : role === 'HR Manager' ? '1' : undefined;
  return { id: `demo-${role.replaceAll(' ', '-')}`, employeeId, name, email: `${name.toLowerCase().replace(/\s+/g, '.')}@remedix.demo`, role, department: role === 'Department Head' ? 'Nursing' : role === 'Employee' ? 'Radiology' : undefined, status: 'active' };
}
