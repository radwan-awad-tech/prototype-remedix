import { AuditLog } from '../../types';
import { AdminUser, OrgUnit } from './types';

export const mockAdminUsers: AdminUser[] = [
  {
    id: 'USR-001',
    name: 'Sarah Jenkins',
    email: 's.jenkins@oryxstaff.com',
    role: 'System Admin',
    status: 'active',
    lastLogin: '2026-03-08 12:45:22',
    department: 'IT'
  },
  {
    id: 'USR-002',
    name: 'Michael Chen',
    email: 'm.chen@oryxstaff.com',
    role: 'HR Manager',
    status: 'active',
    lastLogin: '2026-03-08 11:30:15',
    department: 'Human Resources'
  },
  {
    id: 'USR-003',
    name: 'Aisha Al-Farsi',
    email: 'a.alfarsi@oryxstaff.com',
    role: 'Department Head',
    status: 'active',
    lastLogin: '2026-03-07 16:20:45',
    department: 'Clinical Services'
  },
  {
    id: 'USR-004',
    name: 'John Doe',
    email: 'j.doe@oryxstaff.com',
    role: 'HR Officer',
    status: 'active',
    lastLogin: '2026-03-07 14:10:12',
    department: 'Human Resources'
  },
  {
    id: 'USR-005',
    name: 'Robert Smith',
    email: 'r.smith@oryxstaff.com',
    role: 'Occupational Health Officer',
    status: 'inactive',
    lastLogin: '2026-03-01 09:05:33',
    department: 'Occupational Health'
  }
];

export const mockOrgUnits: OrgUnit[] = [
  {
    id: 'DEPT-001',
    name: 'Clinical Services',
    type: 'department',
    manager: 'Aisha Al-Farsi',
    employeeCount: 145
  },
  {
    id: 'DEPT-002',
    name: 'Administrative Services',
    type: 'department',
    manager: 'Michael Chen',
    employeeCount: 32
  },
  {
    id: 'DEPT-003',
    name: 'Support Services',
    type: 'department',
    manager: 'Khalid Mansour',
    employeeCount: 58
  },
  {
    id: 'UNIT-001',
    name: 'Emergency Services',
    type: 'unit',
    parent: 'DEPT-001',
    manager: 'Sarah Jenkins',
    employeeCount: 42
  },
  {
    id: 'UNIT-002',
    name: 'Telemedicine Services',
    type: 'unit',
    parent: 'DEPT-001',
    manager: 'Michael Chen',
    employeeCount: 12
  }
];

export const mockAuditLogs: AuditLog[] = [
  {
    id: '1',
    timestamp: '2026-03-08 12:45:22',
    actor: 'Sarah Jenkins (System Admin)',
    action: 'USER_ROLE_UPDATE',
    entityType: 'User',
    entityId: 'USR-001',
    summary: 'Updated role for John Doe from HR Officer to HR Manager'
  },
  {
    id: '2',
    timestamp: '2026-03-08 11:30:15',
    actor: 'Michael Chen (HR Manager)',
    action: 'ORG_DEPT_CREATE',
    entityType: 'Department',
    entityId: 'DEPT-012',
    summary: 'Created new department: "Telemedicine Services"'
  },
  {
    id: '3',
    timestamp: '2026-03-08 10:15:00',
    actor: 'Sarah Jenkins (System Admin)',
    action: 'SYSTEM_CONFIG_CHANGE',
    entityType: 'Settings',
    entityId: 'CFG-AUTH',
    summary: 'Enabled Multi-Factor Authentication for all administrative roles'
  },
  {
    id: '4',
    timestamp: '2026-03-07 16:20:45',
    actor: 'Sarah Jenkins (System Admin)',
    action: 'USER_ACCESS_REVOKE',
    entityType: 'User',
    entityId: 'USR-089',
    summary: 'Revoked system access for terminated employee: Robert Smith'
  },
  {
    id: '5',
    timestamp: '2026-03-07 14:10:12',
    actor: 'Michael Chen (HR Manager)',
    action: 'PAYROLL_CONFIG_UPDATE',
    entityType: 'Payroll',
    entityId: 'PAY-RULES',
    summary: 'Updated overtime calculation rules for night shift nurses'
  },
  {
    id: '6',
    timestamp: '2026-03-07 09:05:33',
    actor: 'Sarah Jenkins (System Admin)',
    action: 'SECURITY_POLICY_UPDATE',
    entityType: 'Security',
    entityId: 'SEC-PWD',
    summary: 'Increased minimum password length to 12 characters'
  }
];
