import { secureService, HR, FINANCE, scopedRow, knownEmployee } from './accessGuard';
import { withinScope } from '../modules/auth/permissions';
import { getSessionActor } from '../modules/auth/session';
import { MOCK_LEAVE_REQUESTS, MOCK_LEAVE_BALANCES } from '../mockData';
import { LeaveRequest, LeaveBalance, LeavePolicy, ApiResponse } from '../types';
import { apiClient } from './apiClient';

let leaveRequests = [...MOCK_LEAVE_REQUESTS];

const MOCK_LEAVE_POLICIES: LeavePolicy[] = [
  { id: 'lp-1', leaveType: 'Annual', annualEntitlement: 21, maxCarryOver: 5, minNoticeDays: 14, requiresAttachment: false, isPaid: true, description: 'Standard annual leave entitlement.' },
  { id: 'lp-2', leaveType: 'Sick', annualEntitlement: 15, maxCarryOver: 0, minNoticeDays: 0, requiresAttachment: true, isPaid: true, description: 'Sick leave for medical reasons.' },
  { id: 'lp-3', leaveType: 'Maternity', annualEntitlement: 90, maxCarryOver: 0, minNoticeDays: 30, requiresAttachment: true, isPaid: true, description: 'Maternity leave for new mothers.' },
  { id: 'lp-4', leaveType: 'Unpaid', annualEntitlement: 0, maxCarryOver: 0, minNoticeDays: 7, requiresAttachment: false, isPaid: false, description: 'Leave without pay.' },
];

const rawService = {
  listLeaveRequests: async (department?: string): Promise<ApiResponse<LeaveRequest[]>> => {
    let data = [...leaveRequests];
    if (department) {
      data = data.filter(r => r.department === department);
    }
    return apiClient.get(data);
  },

  listLeaveBalances: async (department?: string): Promise<ApiResponse<LeaveBalance[]>> => {
    let data = [...MOCK_LEAVE_BALANCES];
    if (department) {
      data = data.filter(b => b.department === department);
    }
    return apiClient.get(data);
  },

  listLeavePolicies: async (): Promise<ApiResponse<LeavePolicy[]>> => {
    return apiClient.get(MOCK_LEAVE_POLICIES);
  },

  createLeaveRequest: async (data: Partial<LeaveRequest>): Promise<ApiResponse<LeaveRequest>> => {
    const actor = getSessionActor()!;
    const employee = actor.employeeId ? knownEmployee(actor.employeeId) : undefined;
    const start = new Date(`${data.startDate}T00:00:00Z`);
    const end = new Date(`${data.endDate}T00:00:00Z`);
    const duration = Math.floor((end.getTime() - start.getTime()) / 86400000) + 1;
    const newRequest = { 
      ...data, 
      employeeId: actor.employeeId!, employeeName: actor.name, employeeNo: employee?.employeeNo || '', department: actor.department || employee?.department || '',
      duration,
      id: `LR-${Math.floor(Math.random() * 1000)}`,
      status: 'Pending',
      stage: 'Manager',
      submittedAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    } as LeaveRequest;
    leaveRequests.unshift(newRequest);
    return apiClient.post(newRequest, 500);
  },

  updateLeaveStatus: async (id: string, status: 'Approved' | 'Rejected', reason?: string): Promise<ApiResponse<void>> => {
    const index = leaveRequests.findIndex(r => r.id === id);
    if (index === -1) {
      return apiClient.error('Leave request not found', 404);
    }
    const actor = getSessionActor()!;
    const managerStage = actor.role === 'Department Head' && status === 'Approved';
    leaveRequests[index] = { ...leaveRequests[index], status: managerStage ? 'Pending' : status, stage: managerStage ? 'HR' : 'Completed', ...(actor.role === 'Department Head' ? { managerApprovedBy: actor.id, managerApprovedAt: new Date().toISOString() } : { hrApprovedBy: actor.id, hrApprovedAt: new Date().toISOString() }), ...(status === 'Rejected' ? { rejectionReason: reason } : {}) };
    return apiClient.put(undefined, 500);
  }
};

export const leaveService = secureService('/leaves', rawService, {
listLeaveRequests: {}, listLeaveBalances: {}, listLeavePolicies: { metadata: true },
 createLeaveRequest: { roles: ['HR Manager','HR Officer','Department Head','Employee'], target: d => d, validate: (u,d) => { const validDate = (value?: string) => { if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false; const parsed = new Date(`${value}T00:00:00Z`); return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0,10) === value; }; return !!u.employeeId && d.employeeId === u.employeeId && validDate(d.startDate) && validDate(d.endDate) && d.endDate! >= d.startDate! && !!d.reason?.trim() && d.reason.length <= 500; } },
 updateLeaveStatus: { roles: ['Senior Manager','HR Manager','Department Head'], target: id => leaveRequests.find(r => r.id === id), validate: (u,id,status) => { const r = leaveRequests.find(r => r.id === id); return !!r && r.status === 'Pending' && r.employeeId !== u.employeeId && ['Approved','Rejected'].includes(status) && (u.role === 'Department Head' ? r.stage === 'Manager' : r.stage === 'HR'); } }
});
