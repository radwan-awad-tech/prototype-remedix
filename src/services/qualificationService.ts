import { MOCK_QUALIFICATIONS } from '../mockData';
import { Qualification, ApiResponse } from '../types';
import { apiClient } from './apiClient';

export const qualificationService = {
  listQualifications: async (department?: string): Promise<ApiResponse<Qualification[]>> => {
    let data = [...MOCK_QUALIFICATIONS];
    if (department) {
      data = data.filter(q => q.department === department);
    }
    return apiClient.get(data);
  },

  verifyQualification: async (id: string): Promise<ApiResponse<void>> => {
    return apiClient.put(undefined, 500);
  },

  rejectQualification: async (id: string, reason: string): Promise<ApiResponse<void>> => {
    return apiClient.put(undefined, 500);
  },

  addQualification: async (data: Partial<Qualification>): Promise<ApiResponse<Qualification>> => {
    const newQual = {
      ...data,
      id: `QUAL-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      status: 'Valid',
      verificationStatus: 'Pending',
    } as Qualification;
    return apiClient.post(newQual, 500);
  }
};
