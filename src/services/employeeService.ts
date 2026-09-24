import { secureService, HR, setEmployeeDirectory } from './accessGuard';
import { withinScope } from '../modules/auth/permissions';
import { getSessionActor } from '../modules/auth/session';
import { MOCK_EMPLOYEES } from '../mockData';
import { Employee, ApiResponse } from '../types';
import { apiClient } from './apiClient';

let employees = [...MOCK_EMPLOYEES];
setEmployeeDirectory(() => employees);

const rawService = {
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

export const employeeService = secureService('/employees', rawService, {
listEmployees: {}, getEmployee: {}, createEmployee: { roles: ['HR Manager'] },
 updateEmployee: { roles: HR, target: id => employees.find(e => e.id === id), validate: (u, id, d) => !('id' in d) && (u.role === 'HR Manager' || !['status','role','department','position','supervisorId','contractType','hireDate'].some(k => k in d)) }
});
