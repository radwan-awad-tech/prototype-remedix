import { RoleType } from '../../types';

export type AccessLevel = 'manage' | 'review' | 'view';
export type AccessScope = 'organization' | 'department' | 'self';

export interface RoleModuleAccess {
  path: string;
  level: AccessLevel;
  scope: AccessScope;
}

export interface RoleAccessPolicy {
  role: RoleType;
  landingPath: string;
  modules: RoleModuleAccess[];
}

const module = (path: string, level: AccessLevel, scope: AccessScope = 'organization'): RoleModuleAccess => ({
  path,
  level,
  scope,
});

export const ROLE_ORDER: RoleType[] = [
  'System Admin',
  'HR Manager',
  'HR Officer',
  'Department Head',
  'Payroll Officer',
  'Accountant',
  'Occupational Health Officer',
  'Employee',
];

/**
 * Single source of truth for the demo RBAC model.
 * Route guards, sidebar visibility, and the Administration access view all use this matrix.
 */
export const ROLE_ACCESS_POLICIES: Record<RoleType, RoleAccessPolicy> = {
  'System Admin': {
    role: 'System Admin',
    landingPath: '/admin',
    modules: [
      module('/', 'manage'), module('/employees', 'manage'), module('/doctors', 'manage'),
      module('/scheduling', 'manage'), module('/leaves', 'manage'), module('/attendance', 'manage'),
      module('/licenses', 'manage'), module('/recruitment', 'manage'), module('/performance', 'manage'),
      module('/payroll', 'manage'), module('/health', 'manage'), module('/reports', 'manage'),
      module('/admin', 'manage'), module('/settings', 'manage', 'self'), module('/profile', 'manage', 'self'),
    ],
  },
  'HR Manager': {
    role: 'HR Manager',
    landingPath: '/',
    modules: [
      module('/', 'manage'), module('/employees', 'manage'), module('/doctors', 'manage'),
      module('/scheduling', 'manage'), module('/leaves', 'manage'), module('/attendance', 'manage'),
      module('/licenses', 'manage'), module('/recruitment', 'manage'), module('/performance', 'manage'),
      module('/payroll', 'manage'), module('/health', 'manage'), module('/reports', 'manage'),
      module('/admin', 'manage'), module('/settings', 'manage', 'self'), module('/profile', 'manage', 'self'),
    ],
  },
  'HR Officer': {
    role: 'HR Officer',
    landingPath: '/',
    modules: [
      module('/', 'view'), module('/employees', 'manage'), module('/doctors', 'manage'),
      module('/scheduling', 'manage'), module('/leaves', 'manage'), module('/attendance', 'manage'),
      module('/licenses', 'manage'), module('/recruitment', 'manage'), module('/performance', 'manage'),
      module('/payroll', 'review'), module('/health', 'view'), module('/reports', 'view'),
      module('/settings', 'manage', 'self'), module('/profile', 'manage', 'self'),
    ],
  },
  'Department Head': {
    role: 'Department Head',
    landingPath: '/',
    modules: [
      module('/', 'view', 'department'), module('/employees', 'manage', 'department'),
      module('/doctors', 'view', 'department'), module('/scheduling', 'manage', 'department'),
      module('/leaves', 'review', 'department'), module('/attendance', 'review', 'department'),
      module('/licenses', 'view', 'department'), module('/recruitment', 'review', 'department'),
      module('/performance', 'review', 'department'), module('/payroll', 'review', 'department'),
      module('/health', 'view', 'department'), module('/reports', 'view', 'department'),
      module('/settings', 'manage', 'self'), module('/profile', 'manage', 'self'),
    ],
  },
  'Payroll Officer': {
    role: 'Payroll Officer',
    landingPath: '/payroll',
    modules: [
      module('/', 'view'), module('/leaves', 'view'), module('/payroll', 'manage'),
      module('/reports', 'view'), module('/settings', 'manage', 'self'), module('/profile', 'manage', 'self'),
    ],
  },
  'Accountant': {
    role: 'Accountant',
    landingPath: '/payroll',
    modules: [
      module('/', 'view'), module('/leaves', 'view'), module('/payroll', 'review'),
      module('/reports', 'view'), module('/settings', 'manage', 'self'), module('/profile', 'manage', 'self'),
    ],
  },
  'Occupational Health Officer': {
    role: 'Occupational Health Officer',
    landingPath: '/health',
    modules: [
      module('/', 'view'), module('/leaves', 'view'), module('/attendance', 'review'),
      module('/licenses', 'manage'), module('/health', 'manage'),
      module('/settings', 'manage', 'self'), module('/profile', 'manage', 'self'),
    ],
  },
  Employee: {
    role: 'Employee',
    landingPath: '/profile',
    modules: [
      module('/leaves', 'manage', 'self'), module('/attendance', 'manage', 'self'),
      module('/payroll', 'view', 'self'), module('/settings', 'manage', 'self'), module('/profile', 'manage', 'self'),
    ],
  },
};

export interface RoutePermission {
  path: string;
  allowedRoles: RoleType[];
}

const routePaths = Array.from(new Set(
  ROLE_ORDER.flatMap(role => ROLE_ACCESS_POLICIES[role].modules.map(access => access.path))
));

export const ROUTE_PERMISSIONS: RoutePermission[] = routePaths.map(path => ({
  path,
  allowedRoles: ROLE_ORDER.filter(role => ROLE_ACCESS_POLICIES[role].modules.some(access => access.path === path)),
}));

export const canAccessPath = (role: RoleType, path: string): boolean => {
  const permission = ROUTE_PERMISSIONS.find(item => item.path === path);
  return permission ? permission.allowedRoles.includes(role) : false;
};

export const getLandingPath = (role: RoleType): string => ROLE_ACCESS_POLICIES[role]?.landingPath || '/profile';
