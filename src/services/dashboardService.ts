import { 
  MOCK_ALERTS, 
  MOCK_APPROVALS, 
  MOCK_EMPLOYEES, 
  MOCK_ATTENDANCE, 
  MOCK_LEAVE_REQUESTS, 
  MOCK_JOB_OPENINGS,
  MOCK_PAYROLL_RUNS,
  MOCK_SHIFT_ASSIGNMENTS
} from '../mockData';
import { Alert, ApprovalRequest, ApiResponse } from '../types';
import { apiClient } from './apiClient';

let approvals = [...MOCK_APPROVALS];
let alerts = [...MOCK_ALERTS];

export const dashboardService = {
  listAlerts: async (department?: string): Promise<ApiResponse<Alert[]>> => {
    let filteredAlerts = [...alerts];
    if (department) {
      filteredAlerts = filteredAlerts.filter(a => !a.department || a.department === department);
    }
    return apiClient.get(filteredAlerts);
  },

  listApprovals: async (department?: string): Promise<ApiResponse<ApprovalRequest[]>> => {
    let filteredApprovals = [...approvals];
    if (department) {
      filteredApprovals = filteredApprovals.filter(a => !a.department || a.department === department);
    }
    return apiClient.get(filteredApprovals);
  },

  getStats: async (department?: string): Promise<ApiResponse<any>> => {
    const employees = department 
      ? MOCK_EMPLOYEES.filter(e => e.department === department)
      : MOCK_EMPLOYEES;
    
    const deptAlerts = department
      ? alerts.filter(a => a.department === department)
      : alerts;

    const deptLeaves = department
      ? MOCK_LEAVE_REQUESTS.filter(l => l.department === department)
      : MOCK_LEAVE_REQUESTS;

    const deptAttendance = department
      ? MOCK_ATTENDANCE.filter(a => a.department === department)
      : MOCK_ATTENDANCE;

    // Calculate attendance rate
    const attendanceRate = deptAttendance.length > 0
      ? (deptAttendance.filter(a => a.status === 'OK' || a.status === 'Late').length / deptAttendance.length) * 100
      : 95.0;

    const latestPayroll = MOCK_PAYROLL_RUNS[MOCK_PAYROLL_RUNS.length - 1];

    const stats = {
      headcount: employees.length,
      attendance: parseFloat(attendanceRate.toFixed(1)),
      pendingLeaves: deptLeaves.filter(l => l.status === 'Pending').length,
      understaffed: deptAlerts.filter(a => a.type === 'Understaffed').length,
      expiringDocs: deptAlerts.filter(a => a.type === 'Document Expiry').length,
      payrollStatus: latestPayroll?.status || 'Draft',
      recruitment: MOCK_JOB_OPENINGS.filter(j => j.status === 'Open').length,
      netPayroll: latestPayroll?.totalNet || 0,
      activeUsers: Math.floor(employees.length * 0.8), // Mocking active users as 80% of employees
      systemUptime: 99.9
    };

    return apiClient.get(stats);
  },

  getChartsData: async (department?: string): Promise<ApiResponse<any>> => {
    const employees = department 
      ? MOCK_EMPLOYEES.filter(e => e.department === department)
      : MOCK_EMPLOYEES;

    // Department Distribution
    const depts = Array.from(new Set(MOCK_EMPLOYEES.map(e => e.department)));
    const deptDistribution = depts.map(d => ({
      name: d,
      value: MOCK_EMPLOYEES.filter(e => e.department === d).length
    })).sort((a, b) => b.value - a.value);

    // Attendance Trend (Last 7 days from mock data)
    const attendanceDates = Array.from(new Set(MOCK_ATTENDANCE.map(a => a.date))).sort();
    const last7Dates = attendanceDates.slice(-7);
    
    const attendanceTrend = last7Dates.map(date => {
      const records = MOCK_ATTENDANCE.filter(a => a.date === date && (!department || a.department === department));
      const rate = records.length > 0
        ? (records.filter(r => r.status === 'OK' || r.status === 'Late').length / records.length) * 100
        : 95;
      
      const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
      return { day: dayName, rate: parseFloat(rate.toFixed(1)) };
    });

    // Recent Hires
    const recentHires = [...MOCK_EMPLOYEES]
      .filter(e => !department || e.department === department)
      .sort((a, b) => b.hireDate.localeCompare(a.hireDate))
      .slice(0, 5)
      .map(e => ({
        id: e.id,
        name: e.name || `${e.firstName} ${e.lastName}`,
        dept: e.department,
        date: e.hireDate === new Date().toISOString().split('T')[0] ? 'Today' : e.hireDate
      }));

    // Expiring Docs (Next 30 days)
    const expiringDocs = alerts
      .filter(a => a.type === 'Document Expiry' && (!department || a.department === department))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 5);

    // Roster Summary (Today)
    const today = new Date().toISOString().split('T')[0];
    const todayAssignments = MOCK_SHIFT_ASSIGNMENTS.filter(a => {
      if (a.date !== today) return false;
      if (!department) return true;
      const emp = MOCK_EMPLOYEES.find(e => e.id === a.employeeId);
      return emp?.department === department;
    });
    
    const rosterSummary = {
      morning: todayAssignments.filter(a => a.shiftTypeName.toLowerCase().includes('morning')).length,
      evening: todayAssignments.filter(a => a.shiftTypeName.toLowerCase().includes('evening')).length,
      night: todayAssignments.filter(a => a.shiftTypeName.toLowerCase().includes('night')).length,
    };

    // On Leave Today
    const onLeaveToday = MOCK_LEAVE_REQUESTS
      .filter(l => l.status === 'Approved' && today >= l.startDate && today <= l.endDate && (!department || l.department === department))
      .map(l => ({
        id: l.id,
        name: l.employeeName,
        initials: l.employeeName.split(' ').map(n => n[0]).join(''),
        type: l.leaveType
      }));

    // Team Status (For Dept Heads)
    const teamStatus = {
      clockedIn: MOCK_ATTENDANCE.filter(a => a.date === today && a.checkIn && (!department || a.department === department)).length,
      late: MOCK_ATTENDANCE.filter(a => a.date === today && a.status === 'Late' && (!department || a.department === department)).length,
      absent: employees.length - MOCK_ATTENDANCE.filter(a => a.date === today && a.checkIn && (!department || a.department === department)).length - onLeaveToday.length,
      onLeave: onLeaveToday.length
    };

    // Pending Team Approvals
    const pendingApprovals = approvals
      .filter(a => a.status === 'Pending' && (!department || a.department === department))
      .slice(0, 5);

    return apiClient.get({
      deptDistribution,
      attendanceTrend,
      recentHires,
      expiringDocs,
      rosterSummary,
      onLeaveToday,
      teamStatus,
      pendingApprovals,
      payrollCycle: {
        progress: 75,
        calculated: 842,
        pending: 158,
        exceptions: 12
      }
    });
  },

  markAlertAsSeen: async (id: string): Promise<ApiResponse<void>> => {
    alerts = alerts.filter(a => a.id !== id);
    return apiClient.put(undefined);
  },

  approveRequest: async (id: string): Promise<ApiResponse<void>> => {
    const index = approvals.findIndex(a => a.id === id);
    if (index !== -1) {
      approvals[index] = { ...approvals[index], status: 'Approved' };
      return apiClient.put(undefined);
    }
    return apiClient.error('Approval request not found', 404);
  },

  rejectRequest: async (id: string, reason: string): Promise<ApiResponse<void>> => {
    const index = approvals.findIndex(a => a.id === id);
    if (index !== -1) {
      approvals[index] = { ...approvals[index], status: 'Rejected', rejectionReason: reason };
      return apiClient.put(undefined);
    }
    return apiClient.error('Approval request not found', 404);
  }
};
