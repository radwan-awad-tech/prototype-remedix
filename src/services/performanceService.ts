import { MOCK_EVALUATION_TEMPLATES, MOCK_EVALUATION_CYCLES, MOCK_EMPLOYEE_REVIEWS } from '../mockData';
import { EvaluationTemplate, EvaluationCycle, EvaluationRecord, ApiResponse, EvaluationStatus } from '../types';
import { apiClient } from './apiClient';

let reviews = [...MOCK_EMPLOYEE_REVIEWS];

export const performanceService = {
  listTemplates: async (): Promise<ApiResponse<EvaluationTemplate[]>> => {
    return apiClient.get(MOCK_EVALUATION_TEMPLATES);
  },

  createTemplate: async (data: Partial<EvaluationTemplate>): Promise<ApiResponse<EvaluationTemplate>> => {
    const newTemplate = {
      ...data,
      id: `T-00${Math.floor(Math.random() * 1000)}`,
      version: '1.0',
      status: 'Draft',
      createdBy: 'Sarah Mitchell',
      createdAt: new Date().toISOString().split('T')[0],
    } as EvaluationTemplate;
    return apiClient.post(newTemplate, 500);
  },

  updateTemplateStatus: async (id: string, status: EvaluationStatus): Promise<ApiResponse<void>> => {
    // In a real app, we'd update the template in the database
    return apiClient.put(undefined, 300);
  },

  listCycles: async (): Promise<ApiResponse<EvaluationCycle[]>> => {
    return apiClient.get(MOCK_EVALUATION_CYCLES);
  },

  listReviews: async (cycleId?: string, department?: string): Promise<ApiResponse<EvaluationRecord[]>> => {
    let data = [...reviews];
    if (cycleId) {
      data = data.filter(r => r.cycleId === cycleId);
    }
    if (department) {
      data = data.filter(r => r.department === department);
    }
    return apiClient.get(data);
  },

  submitReview: async (id: string, data: Partial<EvaluationRecord>): Promise<ApiResponse<EvaluationRecord>> => {
    const index = reviews.findIndex(r => r.id === id);
    if (index === -1) {
      return apiClient.error('Review not found', 404);
    }
    reviews[index] = { ...reviews[index], ...data, status: 'Finalized', finalizedAt: new Date().toISOString() };
    return apiClient.put(reviews[index], 500);
  },

  getPerformanceAnalytics: async (department?: string): Promise<ApiResponse<{
    scoreDistribution: any[];
    deptAverages: any[];
    completionData: any[];
    stats: any[];
    topPerformers: any[];
  }>> => {
    // In a real app, these would be filtered by department in the database
    const data = {
      scoreDistribution: [
        { range: '1-2', count: 2, color: '#EF4444' },
        { range: '2-3', count: 5, color: '#F59E0B' },
        { range: '3-4', count: 18, color: 'var(--primary-gradient-end)' },
        { range: '4-5', count: 12, color: '#10B981' },
      ],
      deptAverages: department ? [
        { name: department, score: 4.2 }
      ] : [
        { name: 'Nursing', score: 4.2 },
        { name: 'Radiology', score: 3.8 },
        { name: 'Emergency', score: 4.5 },
        { name: 'Pediatrics', score: 4.0 },
        { name: 'HR', score: 4.3 },
      ],
      completionData: [
        { name: 'Completed', value: 45 },
        { name: 'Pending', value: 55 },
      ],
      stats: [
        { label: department ? `${department} Avg Score` : 'Avg Org Score', value: '4.1', trend: '+0.3', type: 'score' },
        { label: 'Active Participants', value: department ? '24' : '124', trend: '98%', type: 'participants' },
        { label: 'Completion Rate', value: '45%', trend: 'On Track', type: 'completion' },
        { label: 'Top Performers', value: department ? '3' : '12', trend: '5 New', type: 'top' },
      ],
      topPerformers: [
        { name: 'Sarah Mitchell', dept: 'HR', score: 4.9 },
        { name: 'Robert Wilson', dept: 'Emergency', score: 4.8 },
        { name: 'John Doe', dept: 'Nursing', score: 4.5 },
        { name: 'Jane Smith', dept: 'Radiology', score: 4.4 },
      ].filter(p => !department || p.dept === department)
    };
    return apiClient.get(data);
  }
};
