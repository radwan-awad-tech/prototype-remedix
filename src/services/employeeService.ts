import { MOCK_EMPLOYEES } from '../mockData';
import { Employee, ApiResponse } from '../types';
import { apiClient } from './apiClient';

let employees = [...MOCK_EMPLOYEES];

export const employeeService = {
  listEmployees: async (department?: string): Promise<ApiResponse<Employee[]>> => {
    let data = [...employees];
    if (department) {
      data = data.filter(e => e.department === department);
    }
    return apiClient.get(data);
  },

  getEmployee: async (id: string): Promise<ApiResponse<Employee | null>> => {
    const employee = employees.find(e => e.id === id) || null;
    if (!employee) {
      return apiClient.error('Employee not found', 404);
    }
    return apiClient.get(employee);
  },

  createEmployee: async (data: Partial<Employee>): Promise<ApiResponse<Employee>> => {
    const newEmployee = { 
      ...data, 
      id: Math.random().toString(36).substr(2, 9),
      employeeNo: data.employeeNo || `EMP-${Math.floor(Math.random() * 10000)}`,
      status: data.status || 'Active',
      hireDate: data.hireDate || new Date().toISOString().split('T')[0]
    } as Employee;
    employees.unshift(newEmployee);
    return apiClient.post(newEmployee, 500);
  },

  updateEmployee: async (id: string, data: Partial<Employee>): Promise<ApiResponse<Employee>> => {
    const index = employees.findIndex(e => e.id === id);
    if (index === -1) {
      return apiClient.error('Employee not found', 404);
    }
    employees[index] = { ...employees[index], ...data } as Employee;
    return apiClient.put(employees[index], 500);
  }
};
