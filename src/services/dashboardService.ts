import { secureService, HR } from './accessGuard';
import { 
  MOCK_ALERTS, 
  MOCK_APPROVALS, 
  MOCK_EMPLOYEES, 
  MOCK_ATTENDANCE, 
  MOCK_LEAVE_REQUESTS, 
  MOCK_JOB_OPENINGS,
  MOCK_CANDIDATES,
  MOCK_PAYROLL_RUNS,
  MOCK_SHIFT_ASSIGNMENTS
} from '../mockData';
import { Alert, ApprovalRequest, ApiResponse } from '../types';
import { apiClient } from './apiClient';

let approvals = [...MOCK_APPROVALS];
let alerts = [...MOCK_ALERTS];

const rawService = {
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
    const depts = Array.from(new Set(employees.map(e => e.department)));
    const deptDistribution = depts.map(d => ({
      name: d,
      value: employees.filter(e => e.department === d).length
    })).sort((a, b) => b.value - a.value);

    // Use the latest mocked attendance date as the dashboard reference date so
    // demo charts stay meaningful even when the real calendar moves forward.
    const latestAttendanceDate = MOCK_ATTENDANCE.reduce(
      (latest, record) => record.date > latest ? record.date : latest,
      MOCK_ATTENDANCE[0]?.date || new Date().toISOString().split('T')[0]
    );

    // Attendance Trend (Last 7 days from mock data)
    const baseAttendanceRate = MOCK_ATTENDANCE.length > 0
      ? (MOCK_ATTENDANCE.filter(record => ['OK', 'Late'].includes(record.status)).length / MOCK_ATTENDANCE.length) * 100
      : 93;
    const attendanceDates = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(`${latestAttendanceDate}T12:00:00`);
      date.setDate(date.getDate() - (6 - index));
      return date.toISOString().split('T')[0];
    });

    const attendanceTrend = attendanceDates.map((date, index) => {
      const records = MOCK_ATTENDANCE.filter(a => a.date === date && (!department || a.department === department));
      const rate = records.length > 0
        ? (records.filter(r => r.status === 'OK' || r.status === 'Late').length / records.length) * 100
        : Math.max(0, Math.min(100, baseAttendanceRate + [1, -1, 2, 0, -2, 1, 0][index]));
      
      const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
      return { day: dayName, rate: parseFloat(rate.toFixed(1)) };
    });

    const attendanceByDepartment = depts.map(dept => {
      const records = MOCK_ATTENDANCE.filter(record => {
        const employee = MOCK_EMPLOYEES.find(e => e.id === record.employeeId);
        return employee?.department === dept && (!department || employee.department === department);
      });
      const onTime = records.filter(record => record.status === 'OK').length;
      const late = records.filter(record => record.status === 'Late').length;
      const absent = records.filter(record => record.status === 'Absent').length;
      return { name: dept, onTime, late, absent };
    });

    const leaveStatus = ['Pending', 'Approved', 'Rejected'].map(status => ({
      name: status,
      value: MOCK_LEAVE_REQUESTS.filter(request => request.status === status && (!department || request.department === department)).length,
    }));

    const recruitmentFunnel = ['Applied', 'Screening', 'Interview', 'Offer', 'Hired'].map(stage => ({
      name: stage,
      value: MOCK_CANDIDATES.filter(candidate => {
        const opening = MOCK_JOB_OPENINGS.find(item => item.id === candidate.openingId);
        return candidate.stage === stage && (!department || opening?.department === department);
      }).length,
    }));

    const staffingMix = [
      { name: 'On duty', value: MOCK_ATTENDANCE.filter(record => ['OK', 'Late'].includes(record.status) && (!department || record.department === department)).length },
      { name: 'On leave', value: MOCK_LEAVE_REQUESTS.filter(request => request.status === 'Approved' && (!department || request.department === department)).length },
      { name: 'Absent', value: MOCK_ATTENDANCE.filter(record => record.status === 'Absent' && (!department || record.department === department)).length },
    ].filter(item => item.value > 0);

    const payrollTrend = MOCK_PAYROLL_RUNS.map(run => ({
      period: run.period.replace('_2024', '').replace('_', ' '),
      net: run.totalNet,
      employees: run.employeeCount,
    }));

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
    const dashboardDate = latestAttendanceDate;
    const todayAssignments = MOCK_SHIFT_ASSIGNMENTS.filter(a => {
      if (a.date !== dashboardDate) return false;
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
      .filter(l => l.status === 'Approved' && dashboardDate >= l.startDate && dashboardDate <= l.endDate && (!department || l.department === department))
      .map(l => ({
        id: l.id,
        name: l.employeeName,
        initials: l.employeeName.split(' ').map(n => n[0]).join(''),
        type: l.leaveType
      }));

    // Team Status (For Dept Heads)
    const teamStatus = {
      clockedIn: MOCK_ATTENDANCE.filter(a => a.date === dashboardDate && a.checkIn && (!department || a.department === department)).length,
      late: MOCK_ATTENDANCE.filter(a => a.date === dashboardDate && a.status === 'Late' && (!department || a.department === department)).length,
      absent: Math.max(0, employees.length - MOCK_ATTENDANCE.filter(a => a.date === dashboardDate && a.checkIn && (!department || a.department === department)).length - onLeaveToday.length),
      onLeave: onLeaveToday.length
    };

    // Pending Team Approvals
    const pendingApprovals = approvals
      .filter(a => a.status === 'Pending' && (!department || a.department === department))
      .slice(0, 5);

    return apiClient.get({
      deptDistribution,
      attendanceTrend,
      attendanceByDepartment,
      leaveStatus,
      recruitmentFunnel,
      staffingMix,
      payrollTrend,
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

// Legacy unscoped dashboard/report endpoints are retired; workspaceService is the authorized replacement.
export const dashboardService = secureService('/', rawService, {});
