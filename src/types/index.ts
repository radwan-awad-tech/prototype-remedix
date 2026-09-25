import React from 'react';
import { TranslationKey } from '../i18n/translations';

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
  success: boolean;
}

export type RoleType = 
  | 'Senior Manager'
  | 'HR Manager' 
  | 'HR Officer' 
  | 'Department Head' 
  | 'Employee' 
  | 'Payroll Officer' 
  | 'Accountant'
  | 'Occupational Health Officer' 
  | 'System Admin';

export interface Permission {
  id: string;
  name: string;
  code: string;
  description?: string;
  module: string;
}

export interface Role {
  id: string;
  name: RoleType;
  description?: string;
  permissions: string[]; // Permission IDs
}

export interface User {
  id: string;
  employeeId?: string;
  name: string;
  email: string;
  role: RoleType;
  department?: string;
  avatar?: string;
  status?: 'active' | 'inactive';
}

export interface OrgUnit {
  id: string;
  name: string;
  type: 'department' | 'division' | 'location';
  parentId?: string;
  parentName?: string;
  manager?: string;
  employeeCount: number;
}

export interface NavItem {
  title: string;
  path: string;
  icon?: React.ReactNode;
  roles?: RoleType[];
  children?: NavItem[];
  translationKey?: TranslationKey;
}

export type StatusType = 'Active' | 'Inactive' | 'Pending' | 'Approved' | 'Rejected' | 'Valid' | 'Expired' | 'Draft' | 'Published';

export interface DataTableColumn<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  className?: string;
  translationKey?: TranslationKey;
}

// Employee Types
export interface Employee {
  id: string;
  employeeNo: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  name?: string; // Added for compatibility with some services
  fullNameAr?: string;
  gender?: 'Male' | 'Female' | 'Other';
  dob?: string;
  nationality?: string;
  nationalId?: string;
  passportNo?: string;
  phone: string;
  email: string;
  address?: string;
  photoUrl?: string;
  department: string;
  position: string;
  category?: string;
  supervisorId?: string;
  hireDate: string;
  contractType?: string;
  role?: RoleType;
  status: StatusType;
}

// Scheduling Types
export interface ShiftType {
  id: string;
  code: string;
  name: string;
  startTime: string;
  endTime: string;
  isOvernight: boolean;
  durationHours: number;
  minStaffRequired: number;
  tags?: string[];
}

export interface ScheduleAssignment {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  shiftTypeId: string;
  shiftTypeName: string;
  department: string;
  status: 'Draft' | 'Published';
  notes?: string;
}

export interface WorkingHoursPolicy {
  id: string;
  department?: string;
  position?: string;
  maxHoursPerDay: number;
  maxHoursPerWeek: number;
  overtimeAllowed: boolean;
  maxOvertimeHours: number;
}

// Dashboard Types
export interface Alert {
  id: string;
  type: 'Document Expiry' | 'Understaffed' | 'Conflict' | 'Data Issue';
  severity: 'Low' | 'Medium' | 'High';
  message: string;
  relatedId?: string;
  relatedModule?: string;
  date: string;
  isSeen: boolean;
  department?: string;
}

export interface ApprovalRequest {
  id: string;
  type: 'Leave' | 'Attendance Correction' | 'Shift Swap';
  requesterName: string;
  details: string;
  date: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  stage: 'Manager' | 'HR';
  comment?: string;
  rejectionReason?: string;
  department?: string;
}

// Leave Types
export type LeaveType = 'Annual' | 'Sick' | 'Maternity' | 'Paternity' | 'Unpaid' | 'Emergency' | 'Compassionate';

export interface LeavePolicy {
  id: string;
  leaveType: LeaveType;
  annualEntitlement: number;
  maxCarryOver: number;
  minNoticeDays: number;
  requiresAttachment: boolean;
  isPaid: boolean;
  description?: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeNo: string;
  department: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  duration: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  stage: 'Manager' | 'HR' | 'Completed';
  submittedAt: string;
  attachmentUrl?: string;
  contactDuringLeave?: string;
  replacementEmployeeId?: string;
  managerApprovedBy?: string;
  managerApprovedAt?: string;
  hrApprovedBy?: string;
  hrApprovedAt?: string;
  rejectionReason?: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeNo: string;
  employeeName: string;
  department: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  totalHours: number;
  lateMinutes: number;
  overtimeHours: number;
  status: 'OK' | 'Late' | 'Missing Checkout' | 'Absent';
  source: 'Device' | 'Mobile' | 'Web' | 'Manual';
  scheduledStart?: string;
  scheduledEnd?: string;
  approver?: string;
  isCorrected: boolean;
}

export interface AttendanceCorrection {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  requestedIn?: string;
  requestedOut?: string;
  reason: string;
  attachmentUrl?: string;
  department: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  stage: 'Manager' | 'HR' | 'Completed';
  submittedAt: string;
  rejectionReason?: string;
}

export interface Qualification {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeNo: string;
  department: string;
  type: 'License' | 'Certification';
  name: string;
  number: string;
  expiryDate: string;
  status: 'Valid' | 'Expiring' | 'Expired';
  verificationStatus: 'Pending' | 'Verified' | 'Rejected';
  documentUrl: string;
  verifiedBy?: string;
  verifiedAt?: string;
  rejectionReason?: string;
}

export interface Document {
  id: string;
  fileName: string;
  filePath: string;
  docType: string;
  uploadedBy: string;
  uploadedAt: string;
  entityType: 'Employee' | 'Doctor' | 'Qualification' | 'Recruitment' | 'OH' | 'Payroll';
  entityId: string;
  department?: string;
}

export interface LeaveBalance {
  employeeId: string;
  employeeNo: string;
  employeeName: string;
  department: string;
  annual: number;
  sick: number;
  lastUpdated: string;
}

export interface LeaveAdjustmentLog {
  id: string;
  employeeId: string;
  leaveType: LeaveType;
  amount: number;
  reason: string;
  adjustedBy: string;
  date: string;
}

export type JobOpeningStatus = 'Draft' | 'Pending Approval' | 'Open' | 'Closed';
export type CandidateStage = 'Applied' | 'Screening' | 'Interview' | 'Offer' | 'Hired' | 'Rejected' | 'Withdrawn';
export type InterviewOutcome = 'Pass' | 'Fail' | 'Pending' | 'Cancelled';
export type OfferStatus = 'Draft' | 'Pending Approval' | 'Sent' | 'Accepted' | 'Declined';

export interface JobOpening {
  id: string;
  title: string;
  department: string;
  position: string;
  vacancies: number;
  status: JobOpeningStatus;
  createdAt: string;
  requirements: string;
  description: string;
  employmentType: string;
  priority: 'Low' | 'Medium' | 'High';
  candidateCount?: number;
}

export type CandidateSource = 'Referral' | 'Email' | 'Agency' | 'CareersPortal' | 'LinkedIn' | 'Other';

export interface CandidateAttachment {
  id: string;
  name: string;
  url: string;
  type: 'CV' | 'CoverLetter' | 'Portfolio' | 'Other';
  uploadedAt: string;
}

export interface CandidateHistoryEvent {
  stage: CandidateStage;
  timestamp: string;
  note?: string;
  byUserId?: string; // ID of the user who made the change
}

export interface Candidate {
  id: string;
  openingId: string;
  name: string;
  email: string;
  phone: string;
  stage: CandidateStage;
  experienceYears?: number;
  education?: string;
  source: CandidateSource;
  notes: string;
  cvUrl?: string; // Legacy, prefer attachments
  attachments?: CandidateAttachment[]; // Future-ready file handling
  appliedAt: string;
  updatedAt?: string;
  rejectionReason?: string;
  withdrawalReason?: string;
  history: CandidateHistoryEvent[];
}

export interface Interview {
  id: string;
  candidateId: string;
  openingId: string;
  candidateName: string;
  openingTitle: string;
  dateTime: string;
  type: 'Technical' | 'HR' | 'Panel' | 'Final';
  department: string;
  interviewers: string[];
  outcome: InterviewOutcome;
  notes: string;
  score?: number;
}

export interface Offer {
  id: string;
  candidateId: string;
  openingId: string;
  candidateName: string;
  openingTitle: string;
  status: OfferStatus;
  proposedStartDate: string;
  baseSalary: number;
  allowances?: number;
  contractType: string;
  department: string;
  createdAt: string;
  notes: string;
}

// Performance Types
export type EvaluationStatus = 'Draft' | 'Published' | 'Archived';
export type CycleStatus = 'Draft' | 'Active' | 'Closed' | 'Finalized';
export type ReviewStatus = 'Draft' | 'Submitted' | 'Finalized';
export type PeriodType = 'Quarterly' | 'Annual';

export interface EvaluationTemplate {
  id: string;
  name: string;
  version: string;
  status: EvaluationStatus;
  periodType: PeriodType;
  createdBy: string;
  createdAt: string;
}

export interface EvaluationCycle {
  id: string;
  name: string;
  templateId: string;
  templateName: string;
  startDate: string;
  dueDate: string;
  status: CycleStatus;
  completionPercentage: number;
  scope: 'Department' | 'All';
  department?: string;
  participants: string[]; // employee IDs
}

export interface EvaluationRecord {
  id: string;
  cycleId: string;
  cycleName: string;
  employeeId: string;
  employeeName: string;
  department?: string;
  evaluatorId: string;
  evaluatorName: string;
  status: ReviewStatus;
  ratings: {
    technical: number;
    communication: number;
    teamwork: number;
    discipline: number;
  };
  comments: {
    technical: string;
    communication: string;
    teamwork: string;
    discipline: string;
  };
  overallScore: number;
  managerComments: string;
  developmentPlan: string;
  submittedAt?: string;
  finalizedAt?: string;
}

// Payroll Types
export type PayrollComponentType = 'Allowance' | 'Deduction';
export type PayrollCalcMethod = 'Fixed' | 'Percentage' | 'Formula';
export type PayrollRunStatus = 'Draft' | 'Calculated' | 'Locked' | 'Approved';

export interface PayrollComponent {
  id: string;
  name: string;
  type: PayrollComponentType;
  calcMethod: PayrollCalcMethod;
  value: number;
  isActive: boolean;
}

export interface PayrollRule {
  id: string;
  name: string;
  value: number;
  unit: 'Multiplier' | 'Fixed' | 'Percentage';
  description: string;
}

export interface PayrollRun {
  id: string;
  period: string; // YYYY-MM
  status: PayrollRunStatus;
  employeeCount: number;
  totalBaseSalary: number;
  totalAllowances: number;
  totalOvertime: number;
  totalDeductions: number;
  totalNet: number;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  createdBy?: string;
  preparedBy?: string;
}

export interface EmployeePayrollProfile {
  employeeId: string;
  baseSalary: number;
  assignedComponents: {
    componentId: string;
    isActive: boolean;
  }[];
}

export interface PayrollItem {
  id: string;
  runId: string;
  employeeId: string;
  employeeName: string;
  department: string;
  baseSalary: number;
  allowances: number;
  deductions: number;
  overtime: number;
  late: number;
  unpaidLeave: number;
  netSalary: number;
  flags: string[]; // e.g., ['Missing Attendance', 'Negative Net']
}

export interface Payslip {
  id: string;
  employeeId: string;
  employeeName: string;
  period: string;
  baseSalary: number;
  allowances: { name: string; amount: number }[];
  deductions: { name: string; amount: number }[];
  netSalary: number;
  generatedAt: string;
}

// Reports Types
export type ReportCategory = 'Executive' | 'Operational' | 'Compliance' | 'Financial';
export type ReportStatus = 'Completed' | 'Failed' | 'Processing';
export type ReportFormat = 'PDF' | 'Excel' | 'CSV';

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: ReportCategory;
  type: string;
  roles?: RoleType[];
}

export interface ReportRun {
  id: string;
  reportName: string;
  category: ReportCategory;
  generatedBy: string;
  generatedAt: string; // Date + Time mandatory
  scopeDept: string;
  format: ReportFormat;
  status: ReportStatus;
  metadata?: Record<string, any>;
}

export interface ReportFilters {
  department?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  employeeId?: string;
}

// Doctor Types
export interface Doctor {
  id: string;
  employeeId: string;
  doctorCode: string; // DOC-###
  medicalLicenseNumber: string;
  licensingAuthority?: string;
  licenseIssueDate?: string;
  licenseExpiryDate: string;
  availabilityStatus: 'Available' | 'On Leave' | 'Busy' | 'Not Available';
  specialties: string[]; // Names
  primarySpecialty: string;
  status: 'Active' | 'Inactive';
  notes?: string;
}

export interface DoctorSpecialty {
  id: string;
  name: string;
  description?: string;
}

export interface DoctorDocument {
  id: string;
  doctorId: string;
  type: 'License Scan' | 'Board Certification' | 'Training' | 'Other';
  fileName: string;
  filePath: string;
  uploadedAt: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  entityType: string;
  entityId: string;
  summary: string;
}
