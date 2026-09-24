import { secureService, HR, FINANCE, scopedRow } from './accessGuard';
import { withinScope } from '../modules/auth/permissions';
import { getSessionActor } from '../modules/auth/session';
import { MOCK_SHIFT_TYPES, MOCK_SHIFT_ASSIGNMENTS, MOCK_POLICIES } from '../mockData';
import { ShiftType, ScheduleAssignment, WorkingHoursPolicy, ApiResponse } from '../types';
import { apiClient } from './apiClient';

let assignments = [...MOCK_SHIFT_ASSIGNMENTS];

const rawService = {
  listShiftTypes: async (): Promise<ApiResponse<ShiftType[]>> => {
    return apiClient.get(MOCK_SHIFT_TYPES);
  },

  listPolicies: async (): Promise<ApiResponse<WorkingHoursPolicy[]>> => {
    return apiClient.get(MOCK_POLICIES);
  },

  listScheduleAssignments: async (startDate: string, endDate: string, department?: string): Promise<ApiResponse<ScheduleAssignment[]>> => {
    // In a real app, we'd filter by date range and department on the server
    let data = [...assignments];
    if (department) {
      data = data.filter(a => a.department === department);
    }
    return apiClient.get(data);
  },

  createScheduleAssignment: async (data: Partial<ScheduleAssignment>): Promise<ApiResponse<ScheduleAssignment>> => {
    const newAssignment = { 
      ...data, 
      id: Math.random().toString(36).substr(2, 9),
      status: 'Published'
    } as ScheduleAssignment;
    assignments.push(newAssignment);
    return apiClient.post(newAssignment, 500);
  },

  updateScheduleAssignment: async (id: string, data: Partial<ScheduleAssignment>): Promise<ApiResponse<ScheduleAssignment>> => {
    const index = assignments.findIndex(a => a.id === id);
    if (index === -1) {
      return apiClient.error('Assignment not found', 404);
    }
    assignments[index] = { ...assignments[index], ...data } as ScheduleAssignment;
    return apiClient.put(assignments[index], 500);
  },

  deleteScheduleAssignment: async (id: string): Promise<ApiResponse<void>> => {
    const index = assignments.findIndex(a => a.id === id);
    if (index === -1) {
      return apiClient.error('Assignment not found', 404);
    }
    assignments.splice(index, 1);
    return apiClient.delete(undefined, 300);
  },
  
  createShiftType: async (data: Partial<ShiftType>): Promise<ApiResponse<ShiftType>> => {
    const newShiftType = {
      ...data,
      id: Math.random().toString(36).substr(2, 9)
    } as ShiftType;
    return apiClient.post(newShiftType, 500);
  },

  createPolicy: async (data: Partial<WorkingHoursPolicy>): Promise<ApiResponse<WorkingHoursPolicy>> => {
    const newPolicy = {
      ...data,
      id: Math.random().toString(36).substr(2, 9)
    } as WorkingHoursPolicy;
    return apiClient.post(newPolicy, 500);
  }
};

export const schedulingService = secureService('/scheduling', rawService, {
listShiftTypes: { metadata: true }, listPolicies: { metadata: true }, listScheduleAssignments: {},
 createScheduleAssignment: { roles: ['HR Manager','Department Head'], target: d => d, validate: (u,d) => !!d.employeeId && withinScope(u, '/scheduling', scopedRow(d,'/scheduling')) },
 updateScheduleAssignment: { roles: ['HR Manager','Department Head'], target: id => assignments.find(a => a.id === id), validate: (u,id,d) => !('id' in d) && withinScope(u, '/scheduling', scopedRow({...assignments.find(a => a.id === id),...d},'/scheduling')) },
 deleteScheduleAssignment: { roles: ['HR Manager','Department Head'], target: id => assignments.find(a => a.id === id) },
 createShiftType: { roles: ['HR Manager'] }, createPolicy: { roles: ['HR Manager'] }
});
