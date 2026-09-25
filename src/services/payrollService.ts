import { PAYROLL_READERS, PAYROLL_PREPARERS, PAYROLL_APPROVERS } from '../modules/auth/permissions';
import { secureService, HR, FINANCE, scopedRow } from './accessGuard';
import { withinScope } from '../modules/auth/permissions';
import { getSessionActor } from '../modules/auth/session';
import { MOCK_PAYROLL_RUNS, MOCK_PAYROLL_COMPONENTS, MOCK_PAYROLL_RULES, MOCK_PAYROLL_REVIEWS, MOCK_PAYSLIPS, MOCK_EMPLOYEES, MOCK_PAYROLL_PROFILES, MOCK_LEAVE_REQUESTS } from '../mockData';
import { attendanceService } from './attendanceService';
import { PayrollRun, PayrollComponent, PayrollRule, PayrollItem, Payslip, ApiResponse } from '../types';
import { apiClient } from './apiClient';

const rawService = {
  listRuns: async (): Promise<ApiResponse<PayrollRun[]>> => {
    return apiClient.get(MOCK_PAYROLL_RUNS);
  },

  listComponents: async (): Promise<ApiResponse<PayrollComponent[]>> => {
    return apiClient.get(MOCK_PAYROLL_COMPONENTS);
  },

  listRules: async (): Promise<ApiResponse<PayrollRule[]>> => {
    return apiClient.get(MOCK_PAYROLL_RULES);
  },

  listReviews: async (runId?: string, department?: string): Promise<ApiResponse<PayrollItem[]>> => {
    let data = [...MOCK_PAYROLL_REVIEWS];
    if (runId) {
      data = data.filter(r => r.runId === runId);
    }
    if (department) {
      data = data.filter(r => r.department === department);
    }
    return apiClient.get(data);
  },

  getPayslip: async (employeeId: string, period: string): Promise<ApiResponse<Payslip | null>> => {
    const payslip = MOCK_PAYSLIPS.find(p => p.employeeId === employeeId && p.period === period) || null;
    return apiClient.get(payslip);
  },

  listPayslips: async (filters?: { employeeId?: string; period?: string }): Promise<ApiResponse<Payslip[]>> => {
    let data = MOCK_PAYSLIPS;
    if (filters?.employeeId) data = data.filter(p => p.employeeId === filters.employeeId);
    if (filters?.period) data = data.filter(p => p.period === filters.period);
    return apiClient.get(data);
  },

  createRun: async (period: string): Promise<ApiResponse<PayrollRun>> => {
    const newRun: PayrollRun = {
      id: `run-${Date.now()}`,
      period,
      status: 'Draft',
      employeeCount: 0,
      totalBaseSalary: 0,
      totalAllowances: 0,
      totalOvertime: 0,
      totalDeductions: 0,
      totalNet: 0,
      createdAt: new Date().toISOString(),
      createdBy: getSessionActor()!.id,
    };
    MOCK_PAYROLL_RUNS.unshift(newRun);
    return apiClient.post(newRun, 500);
  },

  calculateRun: async (runId: string): Promise<ApiResponse<void>> => {
    const runIndex = MOCK_PAYROLL_RUNS.findIndex(r => r.id === runId);
    if (runIndex === -1) {
      return apiClient.error('Run not found', 404);
    }

    const run = MOCK_PAYROLL_RUNS[runIndex];
    const actor = getSessionActor()!;
    const [year, month] = run.period.split('-').map(Number);
    const attendanceResult = await attendanceService.listAttendanceRecords();
    const periodAttendance = attendanceResult.success ? attendanceResult.data.filter(row => row.date?.startsWith(run.period)) : [];
    const latePenaltyRule = MOCK_PAYROLL_RULES.find(rule => rule.id === 'pr-2')?.value || 0;
    const overtimeMultiplier = MOCK_PAYROLL_RULES.find(rule => rule.id === 'pr-1')?.value || 0;
    const unpaidLeaveMultiplier = MOCK_PAYROLL_RULES.find(rule => rule.id === 'pr-3')?.value || 0;
    const monthlyDayBasis = MOCK_PAYROLL_RULES.find(rule => rule.id === 'pr-4')?.value || 30;
    let totalBaseSalary = 0;
    let totalAllowances = 0;
    let totalOvertime = 0;
    let totalDeductions = 0;
    let totalNet = 0;

    // Clear existing reviews for this run
    const existingReviews = MOCK_PAYROLL_REVIEWS.filter(r => r.runId !== runId);
    MOCK_PAYROLL_REVIEWS.length = 0;
    MOCK_PAYROLL_REVIEWS.push(...existingReviews);

    MOCK_PAYROLL_PROFILES.forEach(profile => {
      const employee = MOCK_EMPLOYEES.find(e => e.id === profile.employeeId);
      if (!employee) return;

      let empAllowances = 0;
      let empDeductions = 0;
      const flags: string[] = [];

      profile.assignedComponents.forEach(ac => {
        if (!ac.isActive) return;
        const component = MOCK_PAYROLL_COMPONENTS.find(c => c.id === ac.componentId);
        if (!component || !component.isActive) return;

        let amount = 0;
        if (component.calcMethod === 'Fixed') {
          amount = component.value;
        } else if (component.calcMethod === 'Percentage') {
          amount = (profile.baseSalary * component.value) / 100;
        } else {
          flags.push(`Unconfigured formula: ${component.name}`);
          return;
        }

        if (component.type === 'Allowance') {
          empAllowances += amount;
        } else {
          empDeductions += amount;
        }
      });

      const employeeAttendance = periodAttendance.filter(row => row.employeeId === profile.employeeId);
      if (!employeeAttendance.length) flags.push('Missing Attendance Data');
      const overtimeHours = employeeAttendance.reduce((sum, row) => sum + (row.overtimeHours || 0), 0);
      const lateOccurrences = employeeAttendance.filter(row => row.lateMinutes > 15).length;
      const overtime = Math.round((profile.baseSalary / monthlyDayBasis / 8) * overtimeMultiplier * overtimeHours * 100) / 100;
      const late = lateOccurrences * latePenaltyRule;
      const monthStart = new Date(year, month - 1, 1);
      const monthEnd = new Date(year, month, 0);
      const unpaidDays = MOCK_LEAVE_REQUESTS.filter(request => request.employeeId === profile.employeeId && request.status === 'Approved' && request.leaveType === 'Unpaid').reduce((days, request) => {
        const start = new Date(`${request.startDate}T00:00:00`);
        const end = new Date(`${request.endDate}T00:00:00`);
        if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < monthStart || start > monthEnd) return days;
        const overlapStart = start < monthStart ? monthStart : start;
        const overlapEnd = end > monthEnd ? monthEnd : end;
        const fullDays = Math.max(1, Math.round((end.getTime() - start.getTime()) / 86400000) + 1);
        const overlapDays = Math.round((overlapEnd.getTime() - overlapStart.getTime()) / 86400000) + 1;
        return days + request.duration * overlapDays / fullDays;
      }, 0);
      const unpaidLeave = Math.round((profile.baseSalary / monthlyDayBasis) * unpaidLeaveMultiplier * unpaidDays * 100) / 100;

      const netSalary = profile.baseSalary + empAllowances - empDeductions + overtime - late - unpaidLeave;

      totalBaseSalary += profile.baseSalary;
      totalAllowances += empAllowances;
      totalOvertime += overtime;
      totalDeductions += empDeductions + late + unpaidLeave;
      totalNet += netSalary;

      if (netSalary < 0) flags.push('Negative Net');

      MOCK_PAYROLL_REVIEWS.push({
        id: `per-${Date.now()}-${profile.employeeId}`,
        runId: run.id,
        employeeId: profile.employeeId,
        employeeName: `${employee.firstName} ${employee.lastName}`,
        department: employee.department,
        baseSalary: profile.baseSalary,
        allowances: empAllowances,
        deductions: empDeductions,
        overtime,
        late,
        unpaidLeave,
        netSalary,
        flags,
      });
    });

    MOCK_PAYROLL_RUNS[runIndex] = {
      ...run,
      status: 'Calculated',
      preparedBy: run.preparedBy || actor.id,
      employeeCount: MOCK_PAYROLL_REVIEWS.filter(r => r.runId === runId).length,
      totalBaseSalary,
      totalAllowances,
      totalOvertime,
      totalDeductions,
      totalNet,
    };

    return apiClient.put(undefined, 1000);
  },

  lockRun: async (id: string): Promise<ApiResponse<void>> => {
    const runIndex = MOCK_PAYROLL_RUNS.findIndex(r => r.id === id);
    if (runIndex === -1) {
      return apiClient.error('Run not found', 404);
    }
    MOCK_PAYROLL_RUNS[runIndex] = {
      ...MOCK_PAYROLL_RUNS[runIndex],
      status: 'Locked',
    };
    return apiClient.put(undefined, 500);
  },

  unlockRun: async (id: string): Promise<ApiResponse<void>> => {
    const runIndex = MOCK_PAYROLL_RUNS.findIndex(r => r.id === id);
    if (runIndex === -1) {
      return apiClient.error('Run not found', 404);
    }
    MOCK_PAYROLL_RUNS[runIndex] = {
      ...MOCK_PAYROLL_RUNS[runIndex],
      status: 'Calculated',
    };
    return apiClient.put(undefined, 500);
  },

  approveRun: async (id: string): Promise<ApiResponse<void>> => {
    const runIndex = MOCK_PAYROLL_RUNS.findIndex(r => r.id === id);
    if (runIndex === -1) {
      return apiClient.error('Run not found', 404);
    }

    const run = MOCK_PAYROLL_RUNS[runIndex];
    MOCK_PAYROLL_RUNS[runIndex] = {
      ...run,
      status: 'Approved',
      approvedAt: new Date().toISOString(),
      approvedBy: getSessionActor()!.id,
    };

    // Generate payslips
    const reviews = MOCK_PAYROLL_REVIEWS.filter(r => r.runId === id);
    reviews.forEach(review => {
      // Check if payslip already exists
      if (!MOCK_PAYSLIPS.find(p => p.employeeId === review.employeeId && p.period === run.period)) {
        MOCK_PAYSLIPS.push({
          id: `ps-${Date.now()}-${review.employeeId}`,
          employeeId: review.employeeId,
          employeeName: review.employeeName,
          period: run.period,
          baseSalary: review.baseSalary,
          allowances: [{ name: 'Total Allowances', amount: review.allowances }],
          deductions: [{ name: 'Total Deductions', amount: review.deductions + review.late + review.unpaidLeave }],
          netSalary: review.netSalary,
          generatedAt: new Date().toISOString(),
        });
      }
    });

    return apiClient.put(undefined, 500);
  }
};

export const payrollService = secureService('/payroll', rawService, {
listRuns: { roles: PAYROLL_READERS }, listComponents: { roles: PAYROLL_READERS }, listRules: { roles: PAYROLL_READERS }, listReviews: { roles: PAYROLL_READERS },
 getPayslip: {}, listPayslips: {},
 createRun: { roles: PAYROLL_PREPARERS, validate: (u,period) => /^\d{4}-(0[1-9]|1[0-2])$/.test(period) && !MOCK_PAYROLL_RUNS.some(r => r.period === period) },
 calculateRun: { roles: PAYROLL_PREPARERS, validate: (u,id) => { const r = MOCK_PAYROLL_RUNS.find(r => r.id === id); return r?.status === 'Draft' && !r.preparedBy || r?.status === 'Calculated' && r.preparedBy === u.id; } },
 lockRun: { roles: PAYROLL_PREPARERS, validate: (u,id) => { const r = MOCK_PAYROLL_RUNS.find(r => r.id === id); return r?.status === 'Calculated' && r.preparedBy === u.id && !MOCK_PAYROLL_REVIEWS.some(item => item.runId === id && item.flags?.length); } },
 unlockRun: { roles: PAYROLL_PREPARERS, validate: (u,id) => { const r = MOCK_PAYROLL_RUNS.find(r => r.id === id); return r?.status === 'Locked' && r.preparedBy === u.id; } },
 approveRun: { roles: PAYROLL_APPROVERS, validate: (u,id) => { const r = MOCK_PAYROLL_RUNS.find(r => r.id === id); return r?.status === 'Locked' && !!r.preparedBy && r.preparedBy !== u.id; } }
});
