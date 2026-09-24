import { secureService, HR, FINANCE, scopedRow } from './accessGuard';
import { withinScope } from '../modules/auth/permissions';
import { getSessionActor } from '../modules/auth/session';
import { MOCK_ATTENDANCE, MOCK_ATTENDANCE_CORRECTIONS } from '../mockData';
import { AttendanceRecord, AttendanceCorrection, ApiResponse } from '../types';
import { apiClient } from './apiClient';

let corrections = [...MOCK_ATTENDANCE_CORRECTIONS];

const rawService = {
  listAttendanceRecords: async (date?: string, department?: string): Promise<ApiResponse<AttendanceRecord[]>> => {
    let data = [...MOCK_ATTENDANCE];
    if (department) {
      data = data.filter(a => a.department === department);
    }
    return apiClient.get(data);
  },

  listAttendanceCorrections: async (department?: string): Promise<ApiResponse<AttendanceCorrection[]>> => {
    let data = [...corrections];
    if (department) {
      data = data.filter(c => c.department === department);
    }
    return apiClient.get(data);
  },

  createAttendanceCorrection: async (data: Partial<AttendanceCorrection>): Promise<ApiResponse<AttendanceCorrection>> => {
    const newRequest = { 
      ...data, 
      id: `AC-${Math.floor(Math.random() * 1000)}`,
      status: 'Pending',
      stage: 'Manager',
      submittedAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    } as AttendanceCorrection;
    corrections.unshift(newRequest);
    return apiClient.post(newRequest, 500);
  },

  approveCorrection: async (id: string): Promise<ApiResponse<void>> => {
    const index = corrections.findIndex(c => c.id === id);
    if (index === -1) {
      return apiClient.error('Correction not found', 404);
    }
    corrections[index] = { ...corrections[index], status: getSessionActor()!.role === 'Department Head' ? 'Pending' : 'Approved', stage: getSessionActor()!.role === 'Department Head' ? 'HR' : 'Completed' };
    return apiClient.put(undefined, 500);
  },

  rejectCorrection: async (id: string, reason: string): Promise<ApiResponse<void>> => {
    const index = corrections.findIndex(c => c.id === id);
    if (index === -1) {
      return apiClient.error('Correction not found', 404);
    }
    corrections[index] = { ...corrections[index], status: 'Rejected', stage: 'Completed', rejectionReason: reason };
    return apiClient.put(undefined, 500);
  },

  createAttendanceRecord: async (data: Partial<AttendanceRecord>): Promise<ApiResponse<AttendanceRecord>> => {
    const newRecord = { 
      ...data, 
      id: `AR-${Math.floor(Math.random() * 10000)}`,
      source: 'Manual',
      isCorrected: false,
      lateMinutes: data.lateMinutes || 0,
      overtimeHours: data.overtimeHours || 0,
      totalHours: data.totalHours || 0
    } as AttendanceRecord;
    MOCK_ATTENDANCE.unshift(newRecord);
    return apiClient.post(newRecord, 500);
  },

  getAttendanceSummary: async (month: string, department?: string): Promise<ApiResponse<any[]>> => {
    const summaryData = [
      {
        id: '1',
        employeeName: 'Sarah Mitchell',
        employeeNo: 'EMP-001',
        department: 'Human Resources',
        totalWorked: 168.5,
        totalOvertime: 12.5,
        totalLate: 45,
        missingCheckouts: 0,
        absences: 0,
      },
      {
        id: '2',
        employeeName: 'John Doe',
        employeeNo: 'EMP-002',
        department: 'Nursing',
        totalWorked: 172.0,
        totalOvertime: 15.0,
        totalLate: 10,
        missingCheckouts: 1,
        absences: 1,
      },
      {
        id: '3',
        employeeName: 'Jane Smith',
        employeeNo: 'EMP-003',
        department: 'Radiology',
        totalWorked: 160.0,
        totalOvertime: 0,
        totalLate: 0,
        missingCheckouts: 2,
        absences: 0,
      }
    ];
    return apiClient.get(summaryData);
  }
};

export const attendanceService = secureService('/attendance', rawService, {
listAttendanceRecords: {}, listAttendanceCorrections: {},
 createAttendanceCorrection: { roles: ['HR Manager','HR Officer','Department Head','Employee'], target: d => d, validate: (u,d) => !!u.employeeId && d.employeeId === u.employeeId },
 approveCorrection: { roles: ['HR Manager','Department Head'], target: id => corrections.find(r => r.id === id), validate: (u,id) => { const r = corrections.find(r => r.id === id); return !!r && r.status === 'Pending' && r.employeeId !== u.employeeId && (u.role === 'Department Head' ? r.stage === 'Manager' : r.stage === 'HR'); } },
 rejectCorrection: { roles: ['HR Manager','Department Head'], target: id => corrections.find(r => r.id === id), validate: (u,id) => { const r = corrections.find(r => r.id === id); return !!r && r.status === 'Pending' && r.employeeId !== u.employeeId && (u.role === 'Department Head' ? r.stage === 'Manager' : r.stage === 'HR'); } },
 createAttendanceRecord: { roles: ['HR Manager'] }, getAttendanceSummary: { roles: ['HR Manager','HR Officer'] }
});
