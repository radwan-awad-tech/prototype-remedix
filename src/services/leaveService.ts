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

export const leaveService = {
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
    const newRequest = { 
      ...data, 
      id: `LR-${Math.floor(Math.random() * 1000)}`,
      status: 'Pending',
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
    leaveRequests[index] = { ...leaveRequests[index], status };
    return apiClient.put(undefined, 500);
  }
};
