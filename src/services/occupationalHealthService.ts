import { Incident, Vaccination, MedicalCheckup, FollowUp, OHRole } from '../modules/occupationalHealth/types';
import { MOCK_INCIDENTS, MOCK_VACCINATIONS, MOCK_CHECKUPS, MOCK_FOLLOW_UPS } from '../modules/occupationalHealth/mockData';
import { User, ApiResponse } from '../types';
import { apiClient } from './apiClient';
import { getSessionActor, getSessionVersion } from '../modules/auth/session';
import { FULL_HEALTH_ROLES, HR_HEALTH_ROLES } from '../modules/auth/permissions';
import { knownEmployee } from './accessGuard';

export interface HealthAdministrationRecord {
  id: string; employeeId: string; employeeName: string; department: string;
  kind: 'checkup' | 'vaccination' | 'incident' | 'follow-up';
  status: string; date: string; nextDate?: string;
}

class OccupationalHealthService {
  async getAdministrationRecords(): Promise<ApiResponse<HealthAdministrationRecord[]>> {
    const user = getSessionActor();
    const version = getSessionVersion();
    if (!user || user.status === 'inactive' || ![...FULL_HEALTH_ROLES, ...HR_HEALTH_ROLES].includes(user.role)) return apiClient.error('Access denied', 403);
    // Deliberate allowlist: administrative tracking never includes diagnoses, findings or clinical free text.
    const records: HealthAdministrationRecord[] = [
      ...MOCK_CHECKUPS.map(r => ({ id:r.id, employeeId:r.employeeId, employeeName:r.employeeName, department:r.department, kind:'checkup' as const, status:r.status, date:r.date, nextDate:r.nextCheckupDate })),
      ...MOCK_VACCINATIONS.map(r => ({ id:r.id, employeeId:r.employeeId, employeeName:r.employeeName, department:r.department, kind:'vaccination' as const, status:r.status, date:r.dateAdministered, nextDate:r.nextDoseDate })),
      ...MOCK_INCIDENTS.map(r => ({ id:r.id, employeeId:r.employeeId, employeeName:r.employeeName, department:r.department, kind:'incident' as const, status:r.status, date:r.date })),
      ...MOCK_FOLLOW_UPS.map(r => ({ id:r.id, employeeId:r.employeeId, employeeName:r.employeeName, department:r.department, kind:'follow-up' as const, status:r.status, date:r.dueDate })),
    ];
    const response = await apiClient.get(records);
    return getSessionVersion() === version ? response : apiClient.error('Session changed', 403);
  }
  private async getClinicalRecords<T extends { employeeId: string; department: string }>(data: T[]): Promise<ApiResponse<T[]>> {
    const actor = getSessionActor();
    const version = getSessionVersion();
    if (!actor || actor.status === 'inactive' || !FULL_HEALTH_ROLES.includes(actor.role)) return apiClient.get([]);
    const response = await apiClient.get(data);
    // Re-check after the simulated network delay so a role switch cannot receive a prior session's clinical data.
    return getSessionVersion() === version ? response : apiClient.error('Session changed', 403);
  }

  async getIncidents(user: User, ohRole: OHRole): Promise<ApiResponse<Incident[]>> {
    return this.getClinicalRecords(MOCK_INCIDENTS);
  }

  async getVaccinations(user: User, ohRole: OHRole): Promise<ApiResponse<Vaccination[]>> {
    return this.getClinicalRecords(MOCK_VACCINATIONS);
  }

  async getCheckups(user: User, ohRole: OHRole): Promise<ApiResponse<MedicalCheckup[]>> {
    return this.getClinicalRecords(MOCK_CHECKUPS);
  }

  async getFollowUps(user: User, ohRole: OHRole): Promise<ApiResponse<FollowUp[]>> {
    return this.getClinicalRecords(MOCK_FOLLOW_UPS);
  }

  async reportIncident(incident: Partial<Incident>): Promise<ApiResponse<Incident>> {
    if (!FULL_HEALTH_ROLES.includes(getSessionActor()?.role) || getSessionActor()?.status === 'inactive') return apiClient.error('Access denied', 403);
    const version = getSessionVersion();
    const newIncident = {
      ...incident,
      id: `INC-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      status: 'Open',
    } as Incident;
    MOCK_INCIDENTS.unshift(newIncident);
    const response = await apiClient.post(newIncident, 500);
    return getSessionVersion() === version ? response : apiClient.error('Session changed', 403);
  }

  async addVaccination(vaccination: Partial<Vaccination>): Promise<ApiResponse<Vaccination>> {
    if (!FULL_HEALTH_ROLES.includes(getSessionActor()?.role) || getSessionActor()?.status === 'inactive') return apiClient.error('Access denied', 403);
    const version = getSessionVersion();
    const newVaccination = {
      ...vaccination,
      id: `VAC-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
    } as Vaccination;
    MOCK_VACCINATIONS.unshift(newVaccination);
    const response = await apiClient.post(newVaccination, 500);
    return getSessionVersion() === version ? response : apiClient.error('Session changed', 403);
  }

  async scheduleCheckup(checkup: Partial<MedicalCheckup>): Promise<ApiResponse<MedicalCheckup>> {
    if (![...FULL_HEALTH_ROLES, 'HR Manager'].includes(getSessionActor()?.role) || getSessionActor()?.status === 'inactive') return apiClient.error('Access denied', 403);
    const version = getSessionVersion();
    if (getSessionActor()?.role === 'HR Manager') {
      const employee = knownEmployee(checkup.employeeId || '');
      if (!employee || !checkup.date || !['Pre-employment','Periodic','Return to Work','Exit'].includes(checkup.type)) return apiClient.error('Invalid referral', 400);
      checkup = { employeeId: employee.id, employeeName: `${employee.firstName} ${employee.lastName}`, department: employee.department, type: checkup.type, date: checkup.date, physician: 'Occupational health team' };
    }
    const newCheckup = {
      ...checkup,
      id: `CHK-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      status: 'Scheduled',
    } as MedicalCheckup;
    MOCK_CHECKUPS.unshift(newCheckup);
    const response = await apiClient.post(newCheckup, 500);
    return getSessionVersion() === version ? response : apiClient.error('Session changed', 403);
  }
}

export const occupationalHealthService = new OccupationalHealthService();
