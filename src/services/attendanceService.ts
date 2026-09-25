import { secureService, HR, FINANCE, scopedRow, knownEmployee } from './accessGuard';
import { withinScope } from '../modules/auth/permissions';
import { getSessionActor } from '../modules/auth/session';
import { MOCK_ATTENDANCE, MOCK_ATTENDANCE_CORRECTIONS } from '../mockData';
import { AttendanceRecord, AttendanceCorrection, ApiResponse } from '../types';
import { apiClient } from './apiClient';

let corrections = [...MOCK_ATTENDANCE_CORRECTIONS];
const punchStorageKey = 'remedix-attendance-punches-v1';
const localDateKey = (date = new Date()) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
function savedPunches(): AttendanceRecord[] {
  try { return JSON.parse(localStorage.getItem(punchStorageKey) || '[]'); } catch { return []; }
}
function persistPunches(rows: AttendanceRecord[]) {
  localStorage.setItem(punchStorageKey, JSON.stringify(rows));
}

const rawService = {
  getTodayPunch: async (): Promise<ApiResponse<AttendanceRecord | null>> => {
    const actor = getSessionActor()!;
    const today = localDateKey();
    const record = savedPunches().find(row => row.employeeId === actor.employeeId && row.date === today) || null;
    return apiClient.get(record);
  },
  clockIn: async (): Promise<ApiResponse<AttendanceRecord>> => {
    const actor = getSessionActor()!;
    const now = new Date();
    const today = localDateKey(now);
    const rows = savedPunches();
    if (rows.some(row => row.employeeId === actor.employeeId && row.date === today)) return apiClient.error('Attendance already started for today.', 409);
    const employee = actor.employeeId ? knownEmployee(actor.employeeId) : undefined;
    const scheduled = new Date(now); scheduled.setHours(8, 0, 0, 0);
    const minutesLate = Math.max(0, Math.floor((now.getTime() - scheduled.getTime()) / 60000));
    const record: AttendanceRecord = { id: `punch-${actor.employeeId}-${today}`, employeeId: actor.employeeId!, employeeNo: employee?.employeeNo || '', employeeName: actor.name, department: actor.department || employee?.department || '', date: today, checkIn: now.toISOString(), totalHours: 0, lateMinutes: minutesLate, overtimeHours: 0, status: minutesLate ? 'Late' : 'Missing Checkout', source: 'Web', scheduledStart: '08:00', scheduledEnd: '16:00', isCorrected: false };
    rows.unshift(record); persistPunches(rows); MOCK_ATTENDANCE.unshift(record);
    return apiClient.post(record);
  },
  clockOut: async (): Promise<ApiResponse<AttendanceRecord>> => {
    const actor = getSessionActor()!;
    const rows = savedPunches();
    const index = rows.findIndex(row => row.employeeId === actor.employeeId && row.date === localDateKey());
    if (index < 0 || !rows[index].checkIn || rows[index].checkOut) return apiClient.error('No open attendance punch found.', 409);
    const now = new Date(); const start = new Date(rows[index].checkIn!);
    const hours = Math.max(0, (now.getTime() - start.getTime()) / 3600000);
    rows[index] = { ...rows[index], checkOut: now.toISOString(), totalHours: Math.round(hours * 100) / 100, overtimeHours: Math.max(0, Math.round((hours - 8) * 100) / 100), status: 'OK' };
    persistPunches(rows);
    const mockIndex = MOCK_ATTENDANCE.findIndex(row => row.id === rows[index].id);
    if (mockIndex >= 0) MOCK_ATTENDANCE[mockIndex] = rows[index]; else MOCK_ATTENDANCE.unshift(rows[index]);
    return apiClient.put(rows[index]);
  },
  listAttendanceRecords: async (date?: string, department?: string): Promise<ApiResponse<AttendanceRecord[]>> => {
    const saved = savedPunches();
    const savedIds = new Set(saved.map(row => row.id));
    let data = [...saved, ...MOCK_ATTENDANCE.filter(row => !savedIds.has(row.id))];
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
getTodayPunch: { roles: ['Senior Manager','HR Manager','HR Officer','Department Head','Payroll Officer','Employee'], validate: u => !!u.employeeId }, clockIn: { roles: ['Senior Manager','HR Manager','HR Officer','Department Head','Payroll Officer','Employee'], validate: u => !!u.employeeId }, clockOut: { roles: ['Senior Manager','HR Manager','HR Officer','Department Head','Payroll Officer','Employee'], validate: u => !!u.employeeId },
listAttendanceRecords: {}, listAttendanceCorrections: {},
 createAttendanceCorrection: { roles: ['Senior Manager','HR Manager','HR Officer','Department Head','Employee'], target: d => d, validate: (u,d) => !!u.employeeId && d.employeeId === u.employeeId },
 approveCorrection: { roles: ['Senior Manager','HR Manager','Department Head'], target: id => corrections.find(r => r.id === id), validate: (u,id) => { const r = corrections.find(r => r.id === id); return !!r && r.status === 'Pending' && r.employeeId !== u.employeeId && (u.role === 'Department Head' ? r.stage === 'Manager' : r.stage === 'HR'); } },
 rejectCorrection: { roles: ['Senior Manager','HR Manager','Department Head'], target: id => corrections.find(r => r.id === id), validate: (u,id) => { const r = corrections.find(r => r.id === id); return !!r && r.status === 'Pending' && r.employeeId !== u.employeeId && (u.role === 'Department Head' ? r.stage === 'Manager' : r.stage === 'HR'); } },
 createAttendanceRecord: { roles: ['Senior Manager','HR Manager'] }, getAttendanceSummary: { roles: ['Senior Manager','HR Manager','HR Officer'] }
});
