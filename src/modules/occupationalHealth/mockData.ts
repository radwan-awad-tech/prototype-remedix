import { Incident, Vaccination, MedicalCheckup, FollowUp } from './types';

export const MOCK_INCIDENTS: Incident[] = [
  {
    id: 'INC-001',
    employeeId: '1',
    employeeName: 'Sarah Mitchell',
    department: 'Human Resources',
    date: '2024-02-15',
    type: 'Needlestick Injury',
    severity: 'High',
    status: 'Closed',
    description: 'Accidental needlestick injury during blood draw in Ward 4.',
    location: 'Ward 4 - Phlebotomy',
    reportedBy: 'Sarah Mitchell',
    actionTaken: 'Immediate first aid, blood tests performed, counseling provided.',
    closedDate: '2024-02-20',
    closedBy: 'Dr. Robert Chen',
    confidentialNotes: 'Patient source was HIV negative. Follow-up tests scheduled for 3 and 6 months.'
  },
  {
    id: 'INC-002',
    employeeId: '5',
    employeeName: 'Emily Davis',
    department: 'Pediatrics',
    date: '2024-03-01',
    type: 'Slip and Fall',
    severity: 'Medium',
    status: 'Under Investigation',
    description: 'Slipped on wet floor in the cafeteria. No warning signs present.',
    location: 'Main Cafeteria',
    reportedBy: 'Emily Davis',
    confidentialNotes: 'Employee reported minor back pain. Investigating why cleaning crew did not place signs.'
  },
  {
    id: 'INC-003',
    employeeId: '8',
    employeeName: 'Jane Smith',
    department: 'Pediatrics',
    date: '2024-03-04',
    type: 'Chemical Exposure',
    severity: 'Critical',
    status: 'Open',
    description: 'Exposure to cleaning disinfectant fumes in a poorly ventilated storage room.',
    location: 'Basement Storage B',
    reportedBy: 'John Doe',
    confidentialNotes: 'Respiratory distress observed. Employee currently in ER.'
  }
];

export const MOCK_VACCINATIONS: Vaccination[] = [
  {
    id: 'VAC-001',
    employeeId: '1',
    employeeName: 'Sarah Mitchell',
    department: 'Human Resources',
    vaccineName: 'Hepatitis B',
    doseNumber: 3,
    totalDoses: 3,
    dateAdministered: '2024-01-10',
    status: 'Completed',
    provider: 'Staff Health Clinic',
    batchNumber: 'HB-99281'
  },
  {
    id: 'VAC-002',
    employeeId: '2',
    employeeName: 'John Doe',
    department: 'Nursing',
    vaccineName: 'Influenza (Annual)',
    doseNumber: 1,
    totalDoses: 1,
    dateAdministered: '2023-11-15',
    status: 'Completed',
    provider: 'Staff Health Clinic'
  },
  {
    id: 'VAC-003',
    employeeId: '5',
    employeeName: 'Emily Davis',
    department: 'Pediatrics',
    vaccineName: 'Hepatitis B',
    doseNumber: 2,
    totalDoses: 3,
    dateAdministered: '2024-02-20',
    nextDoseDate: '2024-08-20',
    status: 'Partially Completed',
    provider: 'Staff Health Clinic'
  }
];

export const MOCK_CHECKUPS: MedicalCheckup[] = [
  {
    id: 'CHK-001',
    employeeId: '3',
    employeeName: 'Jane Smith',
    department: 'Radiology',
    type: 'Periodic',
    date: '2024-01-25',
    status: 'Completed',
    physician: 'Dr. Alice Wong',
    resultsSummary: 'Fit for duty. All vitals within normal range.',
    nextCheckupDate: '2025-01-25',
    confidentialFindings: 'Slightly elevated cholesterol, advised dietary changes.'
  },
  {
    id: 'CHK-002',
    employeeId: '8',
    employeeName: 'Jane Smith',
    department: 'Pediatrics',
    type: 'Pre-employment',
    date: '2024-02-10',
    status: 'Completed',
    physician: 'Dr. Alice Wong',
    resultsSummary: 'Fit for duty with no restrictions.',
    confidentialFindings: 'No significant medical history.'
  },
  {
    id: 'CHK-003',
    employeeId: '1',
    employeeName: 'Sarah Mitchell',
    department: 'Human Resources',
    type: 'Periodic',
    date: '2024-02-16',
    status: 'Follow-up Required',
    physician: 'Dr. Robert Chen',
    resultsSummary: 'Baseline blood tests completed.',
    confidentialFindings: 'Monitoring for seroconversion following needlestick.'
  }
];

export const MOCK_FOLLOW_UPS: FollowUp[] = [
  {
    id: 'FOL-001',
    caseId: 'INC-001',
    caseType: 'Incident',
    employeeId: '1',
    employeeName: 'Sarah Mitchell',
    department: 'Human Resources',
    dueDate: '2024-05-15',
    task: '3-Month Follow-up Blood Test',
    status: 'Pending',
    assignedTo: 'Nurse Sarah'
  },
  {
    id: 'FOL-002',
    caseId: 'CHK-003',
    caseType: 'Medical Checkup',
    employeeId: '1',
    employeeName: 'Sarah Mitchell',
    department: 'Human Resources',
    dueDate: '2024-03-15',
    task: 'Review baseline test results with physician',
    status: 'Completed',
    assignedTo: 'Dr. Robert Chen'
  }
];
