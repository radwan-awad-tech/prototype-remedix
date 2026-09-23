import { MOCK_PAYROLL_RUNS, MOCK_PAYROLL_COMPONENTS, MOCK_PAYROLL_RULES, MOCK_PAYROLL_REVIEWS, MOCK_PAYSLIPS, MOCK_EMPLOYEES, MOCK_PAYROLL_PROFILES } from '../mockData';
import { PayrollRun, PayrollComponent, PayrollRule, PayrollItem, Payslip, ApiResponse } from '../types';
import { apiClient } from './apiClient';

export const payrollService = {
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
      employeeCount: MOCK_EMPLOYEES.length,
      totalBaseSalary: 0,
      totalAllowances: 0,
      totalDeductions: 0,
      totalNet: 0,
      createdAt: new Date().toISOString(),
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
    let totalBaseSalary = 0;
    let totalAllowances = 0;
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

      profile.assignedComponents.forEach(ac => {
        if (!ac.isActive) return;
        const component = MOCK_PAYROLL_COMPONENTS.find(c => c.id === ac.componentId);
        if (!component || !component.isActive) return;

        let amount = 0;
        if (component.calcMethod === 'Fixed') {
          amount = component.value;
        } else if (component.calcMethod === 'Percentage') {
          amount = (profile.baseSalary * component.value) / 100;
        }

        if (component.type === 'Allowance') {
          empAllowances += amount;
        } else {
          empDeductions += amount;
        }
      });

      // Mock overtime, late, unpaid leave
      const overtime = 0;
      const late = 0;
      const unpaidLeave = 0;

      const netSalary = profile.baseSalary + empAllowances - empDeductions + overtime - late - unpaidLeave;

      totalBaseSalary += profile.baseSalary;
      totalAllowances += empAllowances;
      totalDeductions += empDeductions;
      totalNet += netSalary;

      const flags: string[] = [];
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
      totalBaseSalary,
      totalAllowances,
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
      approvedBy: 'Admin',
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
          deductions: [{ name: 'Total Deductions', amount: review.deductions }],
          netSalary: review.netSalary,
          generatedAt: new Date().toISOString(),
        });
      }
    });

    return apiClient.put(undefined, 500);
  }
};
