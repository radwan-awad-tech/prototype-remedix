import { Incident, Vaccination, MedicalCheckup, FollowUp, OHRole } from '../modules/occupationalHealth/types';
import { MOCK_INCIDENTS, MOCK_VACCINATIONS, MOCK_CHECKUPS, MOCK_FOLLOW_UPS } from '../modules/occupationalHealth/mockData';
import { User, ApiResponse } from '../types';
import { apiClient } from './apiClient';
import { getSessionActor } from '../modules/auth/session';

class OccupationalHealthService {
  private filterByRole<T extends { employeeId: string; department: string }>(
    data: T[],
    user: User,
    ohRole: OHRole
  ): T[] {
    if (getSessionActor()?.role === 'Occupational Health Officer' && getSessionActor()?.status !== 'inactive') {
      return data;
    }
    // Medical records never leave this service for HR or managers, even with a forged ohRole.
    return [];
  }

  async getIncidents(user: User, ohRole: OHRole): Promise<ApiResponse<Incident[]>> {
    const data = this.filterByRole(MOCK_INCIDENTS, user, ohRole);
    return apiClient.get(data);
  }

  async getVaccinations(user: User, ohRole: OHRole): Promise<ApiResponse<Vaccination[]>> {
    const data = this.filterByRole(MOCK_VACCINATIONS, user, ohRole);
    return apiClient.get(data);
  }

  async getCheckups(user: User, ohRole: OHRole): Promise<ApiResponse<MedicalCheckup[]>> {
    const data = this.filterByRole(MOCK_CHECKUPS, user, ohRole);
    return apiClient.get(data);
  }

  async getFollowUps(user: User, ohRole: OHRole): Promise<ApiResponse<FollowUp[]>> {
    const data = this.filterByRole(MOCK_FOLLOW_UPS, user, ohRole);
    return apiClient.get(data);
  }

  async reportIncident(incident: Partial<Incident>): Promise<ApiResponse<Incident>> {
    if (getSessionActor()?.role !== 'Occupational Health Officer' || getSessionActor()?.status === 'inactive') return apiClient.error('Access denied', 403);
    const newIncident = {
      ...incident,
      id: `INC-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      status: 'Open',
    } as Incident;
    MOCK_INCIDENTS.unshift(newIncident);
    return apiClient.post(newIncident, 500);
  }

  async addVaccination(vaccination: Partial<Vaccination>): Promise<ApiResponse<Vaccination>> {
    if (getSessionActor()?.role !== 'Occupational Health Officer' || getSessionActor()?.status === 'inactive') return apiClient.error('Access denied', 403);
    const newVaccination = {
      ...vaccination,
      id: `VAC-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
    } as Vaccination;
    MOCK_VACCINATIONS.unshift(newVaccination);
    return apiClient.post(newVaccination, 500);
  }

  async scheduleCheckup(checkup: Partial<MedicalCheckup>): Promise<ApiResponse<MedicalCheckup>> {
    if (getSessionActor()?.role !== 'Occupational Health Officer' || getSessionActor()?.status === 'inactive') return apiClient.error('Access denied', 403);
    const newCheckup = {
      ...checkup,
      id: `CHK-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      status: 'Scheduled',
    } as MedicalCheckup;
    MOCK_CHECKUPS.unshift(newCheckup);
    return apiClient.post(newCheckup, 500);
  }
}

export const occupationalHealthService = new OccupationalHealthService();
