import { secureService, HR, FINANCE, scopedRow } from './accessGuard';
import { withinScope } from '../modules/auth/permissions';
import { getSessionActor } from '../modules/auth/session';
import { MOCK_DOCTORS, MOCK_EMPLOYEES } from '../mockData';
import { Doctor, ApiResponse } from '../types';
import { apiClient } from './apiClient';

const rawService = {
  listDoctors: async (department?: string): Promise<ApiResponse<Doctor[]>> => {
    let data = [...MOCK_DOCTORS];
    if (department) {
      data = data.filter(doc => {
        const employee = MOCK_EMPLOYEES.find(emp => emp.id === doc.employeeId);
        return employee?.department === department;
      });
    }
    return apiClient.get(data);
  },

  getDoctor: async (id: string): Promise<ApiResponse<Doctor | null>> => {
    const doctor = MOCK_DOCTORS.find(d => d.id === id) || null;
    return apiClient.get(doctor);
  }
};

export const doctorService = secureService('/doctors', rawService, {
listDoctors: {}, getDoctor: {}
});
