import { secureService, HR } from './accessGuard';
import { MOCK_REPORT_TEMPLATES, MOCK_REPORT_HISTORY } from '../mockData';
import { ReportTemplate, ReportRun, ReportFilters, ApiResponse } from '../types';
import { apiClient } from './apiClient';

const rawService = {
  listTemplates: async (): Promise<ApiResponse<ReportTemplate[]>> => {
    return apiClient.get(MOCK_REPORT_TEMPLATES);
  },

  listHistory: async (department?: string): Promise<ApiResponse<ReportRun[]>> => {
    let data = [...MOCK_REPORT_HISTORY];
    if (department) {
      data = data.filter(r => r.scopeDept === department || r.scopeDept === 'All');
    }
    return apiClient.get(data);
  },

  generateReport: async (templateId: string, filters: ReportFilters): Promise<ApiResponse<ReportRun>> => {
    const template = MOCK_REPORT_TEMPLATES.find(t => t.id === templateId);
    const newReport: ReportRun = {
      id: `REP-${Math.floor(Math.random() * 1000)}`,
      reportName: template?.name || 'Custom Report',
      category: template?.category || 'Operational',
      generatedBy: 'Sarah Mitchell',
      generatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      scopeDept: filters.department || 'All',
      format: 'PDF',
      status: 'Completed',
    };
    return apiClient.post(newReport, 1500);
  },

  downloadReport: async (id: string): Promise<ApiResponse<void>> => {
    return apiClient.get(undefined, 500);
  }
};

// Legacy unscoped dashboard/report endpoints are retired; workspaceService is the authorized replacement.
export const reportService = secureService('/reports', rawService, {});
