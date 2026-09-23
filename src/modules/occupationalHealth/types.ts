import { Employee } from '../../types';

export type IncidentType = 'Injury' | 'Illness' | 'Near Miss' | 'Exposure';
export type IncidentSeverity = 'Low' | 'Medium' | 'High' | 'Critical';
export type IncidentStatus = 'Open' | 'Under Investigation' | 'Resolved' | 'Closed';
export type VaccinationStatus = 'Completed' | 'Partially Completed' | 'Due' | 'Overdue';
export type CheckupType = 'Pre-employment' | 'Periodic' | 'Return to Work' | 'Exit';
export type CheckupStatus = 'Scheduled' | 'Completed' | 'Pending Results' | 'Follow-up Required';

export interface Incident {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  date: string;
  type: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  description: string;
  location: string;
  reportedBy: string;
  actionTaken?: string;
  closedDate?: string;
  closedBy?: string;
  closureNote?: string;
  confidentialNotes?: string; // Restricted field
}

export interface Vaccination {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  vaccineName: string;
  doseNumber: number;
  totalDoses: number;
  dateAdministered: string;
  nextDoseDate?: string;
  status: VaccinationStatus;
  provider: string;
  batchNumber?: string;
  notes?: string;
}

export interface MedicalCheckup {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  type: CheckupType;
  date: string;
  status: CheckupStatus;
  physician: string;
  resultsSummary?: string;
  recommendations?: string;
  nextCheckupDate?: string;
  confidentialFindings?: string; // Restricted field
}

export interface FollowUp {
  id: string;
  caseId: string; // Link to Incident or Checkup
  caseType: 'Incident' | 'Medical Checkup';
  employeeId: string;
  employeeName: string;
  department: string;
  dueDate: string;
  task: string;
  status: 'Pending' | 'Completed' | 'Overdue';
  assignedTo: string;
  notes?: string;
}

export type OHRole = 'OHO' | 'HR_COMPLIANCE' | 'DEPT_HEAD' | 'EMPLOYEE';

export const getOHRole = (role: string): OHRole => {
  if (role === 'Occupational Health Officer') return 'OHO';
  if (role === 'HR Manager' || role === 'HR Officer') return 'HR_COMPLIANCE';
  if (role === 'Department Head') return 'DEPT_HEAD';
  return 'EMPLOYEE';
};
