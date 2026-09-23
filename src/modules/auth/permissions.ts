import { RoleType } from '../../types';

export interface RoutePermission {
  path: string;
  allowedRoles: RoleType[] | '*'; // '*' means all authenticated users
}

export const ROUTE_PERMISSIONS: RoutePermission[] = [
  { path: '/', allowedRoles: ['HR Manager', 'HR Officer', 'Department Head', 'System Admin', 'Payroll Officer', 'Accountant', 'Occupational Health Officer'] },
  { path: '/employees', allowedRoles: ['HR Manager', 'HR Officer', 'System Admin', 'Department Head'] },
  { path: '/doctors', allowedRoles: ['HR Manager', 'HR Officer', 'System Admin', 'Department Head'] },
  { path: '/scheduling', allowedRoles: ['HR Manager', 'HR Officer', 'System Admin', 'Department Head'] },
  { path: '/leaves', allowedRoles: '*' },
  { path: '/attendance', allowedRoles: ['HR Manager', 'HR Officer', 'System Admin', 'Department Head', 'Occupational Health Officer', 'Employee'] },
  { path: '/licenses', allowedRoles: ['HR Manager', 'HR Officer', 'System Admin', 'Occupational Health Officer'] },
  { path: '/recruitment', allowedRoles: ['HR Manager', 'HR Officer', 'System Admin', 'Department Head'] },
  { path: '/performance', allowedRoles: ['HR Manager', 'System Admin', 'Department Head'] },
  { path: '/payroll', allowedRoles: ['HR Manager', 'Payroll Officer', 'Accountant', 'System Admin', 'Employee'] },
  { path: '/health', allowedRoles: ['HR Manager', 'HR Officer', 'System Admin', 'Occupational Health Officer'] },
  { path: '/reports', allowedRoles: ['HR Manager', 'System Admin', 'Department Head'] },
  { path: '/admin', allowedRoles: ['System Admin', 'HR Manager'] },
  { path: '/settings', allowedRoles: '*' },
  { path: '/profile', allowedRoles: '*' },
];

export const canAccessPath = (role: RoleType, path: string): boolean => {
  const permission = ROUTE_PERMISSIONS.find(p => p.path === path);
  if (!permission) return true; // Default to allow if not explicitly defined
  if (permission.allowedRoles === '*') return true;
  return permission.allowedRoles.includes(role);
};

export const getLandingPath = (role: RoleType): string => {
  switch (role) {
    case 'System Admin':
      return '/admin';
    case 'Payroll Officer':
    case 'Accountant':
      return '/payroll';
    case 'Occupational Health Officer':
      return '/health';
    case 'Employee':
      return '/profile';
    case 'HR Manager':
    case 'HR Officer':
    case 'Department Head':
    default:
      return '/';
  }
};
