import { RoleType } from '../../types';

export type AdminTab = 'settings' | 'users' | 'org' | 'audit';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: RoleType;
  status: 'active' | 'inactive' | 'pending';
  lastLogin?: string;
  department?: string;
}

export interface OrgUnit {
  id: string;
  name: string;
  type: 'department' | 'unit' | 'section';
  parent?: string;
  manager?: string;
  employeeCount: number;
}

export interface SystemSetting {
  id: string;
  category: 'general' | 'security' | 'notifications' | 'data' | 'privacy';
  key: string;
  value: any;
  label: string;
  description: string;
}
