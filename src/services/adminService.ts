import { AuditLog, User, ApiResponse } from '../types';
import { mockAuditLogs, mockAdminUsers, mockOrgUnits } from '../modules/administration/mockData';
import { OrgUnit, AdminUser } from '../modules/administration/types';
import { apiClient } from './apiClient';
import { getSessionActor } from '../modules/auth/session';

function requireAdmin() {
  if (getSessionActor()?.role !== 'System Admin' || getSessionActor()?.status === 'inactive') throw new Error('Access denied');
}

let auditLogs = [...mockAuditLogs];
let adminUsers = [...mockAdminUsers] as AdminUser[];
let orgUnits = [...mockOrgUnits];

export const adminService = {
  // Audit Logs
  listAuditLogs: async (): Promise<ApiResponse<AuditLog[]>> => {
    requireAdmin();
    return apiClient.get([...auditLogs]);
  },

  // Users
  getUsers: async (): Promise<User[]> => {
    requireAdmin();
    return [...adminUsers] as unknown as User[];
  },

  addUser: async (data: User): Promise<User> => {
    requireAdmin();
    const newUser: AdminUser = {
      ...data,
      id: `USR-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      status: data.status || 'active',
    };
    adminUsers.unshift(newUser);
    return newUser as unknown as User;
  },

  // Org Units
  getOrgUnits: async (): Promise<OrgUnit[]> => {
    requireAdmin();
    return [...orgUnits];
  },

  addOrgUnit: async (data: OrgUnit): Promise<OrgUnit> => {
    requireAdmin();
    const newUnit = {
      ...data,
      id: `UNIT-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
    };
    orgUnits.push(newUnit);
    return newUnit;
  },

  updateOrgUnit: async (id: string, data: Partial<OrgUnit>): Promise<ApiResponse<OrgUnit>> => {
    requireAdmin();
    const index = orgUnits.findIndex(u => u.id === id);
    if (index === -1) return apiClient.error('Unit not found', 404);
    orgUnits[index] = { ...orgUnits[index], ...data } as OrgUnit;
    return apiClient.put(orgUnits[index]);
  }
};
