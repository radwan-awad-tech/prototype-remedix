import { 
  Employee, 
  ShiftType, 
  ScheduleAssignment, 
  Alert, 
  ApprovalRequest, 
  WorkingHoursPolicy, 
  LeaveRequest, 
  LeaveBalance,
  AttendanceRecord,
  AttendanceCorrection,
  Qualification,
  Document,
  JobOpening,
  Candidate,
  Interview,
  Offer,
  EvaluationTemplate,
  EvaluationCycle,
  EvaluationRecord,
  PayrollComponent,
  PayrollRule,
  PayrollRun,
  PayrollItem,
  Payslip,
  ReportTemplate,
  ReportRun,
  ReportCategory,
  Doctor,
  DoctorSpecialty,
  DoctorDocument,
  EmployeePayrollProfile
} from './types';

export const MOCK_PAYROLL_COMPONENTS: PayrollComponent[] = [
  { id: 'pc-1', name: 'Housing Allowance', type: 'Allowance', calcMethod: 'Percentage', value: 25, isActive: true },
  { id: 'pc-2', name: 'Transportation Allowance', type: 'Allowance', calcMethod: 'Fixed', value: 500, isActive: true },
  { id: 'pc-3', name: 'Social Security', type: 'Deduction', calcMethod: 'Percentage', value: 7, isActive: true },
  { id: 'pc-4', name: 'Income Tax', type: 'Deduction', calcMethod: 'Formula', value: 0, isActive: true },
  { id: 'pc-5', name: 'Night Shift Bonus', type: 'Allowance', calcMethod: 'Fixed', value: 200, isActive: true },
];

export const MOCK_PAYROLL_RULES: PayrollRule[] = [
  { id: 'pr-1', name: 'Overtime Rate', value: 1.5, unit: 'Multiplier', description: 'Multiplier for normal overtime hours' },
  { id: 'pr-2', name: 'Late Penalty', value: 50, unit: 'Fixed', description: 'Fixed deduction per late occurrence > 15 mins' },
  { id: 'pr-3', name: 'Unpaid Leave', value: 1, unit: 'Multiplier', description: 'Daily rate deduction for unpaid leave' },
  { id: 'pr-4', name: 'Monthly Salary Day Basis', value: 30, unit: 'Fixed', description: 'Demo calculation basis: monthly salary divided by 30 calendar days; configure for local payroll policy before production.' },
];

export const MOCK_PAYROLL_PROFILES: EmployeePayrollProfile[] = [
  {
    employeeId: '1',
    baseSalary: 8000,
    assignedComponents: [
      { componentId: 'pc-1', isActive: true },
      { componentId: 'pc-2', isActive: true },
      { componentId: 'pc-3', isActive: true },
    ]
  },
  {
    employeeId: '2',
    baseSalary: 6000,
    assignedComponents: [
      { componentId: 'pc-1', isActive: true },
      { componentId: 'pc-2', isActive: true },
      { componentId: 'pc-3', isActive: true },
      { componentId: 'pc-5', isActive: true },
    ]
  }
];

export const MOCK_PAYROLL_RUNS: PayrollRun[] = [
  {
    id: 'run-1',
    period: '2024-01',
    status: 'Approved',
    employeeCount: 150,
    totalBaseSalary: 450000,
    totalAllowances: 120000,
    totalOvertime: 0,
    totalDeductions: 35000,
    totalNet: 535000,
    approvedBy: 'Sarah Mitchell',
    approvedAt: '2024-01-28',
    createdAt: '2024-01-25',
  },
  {
    id: 'run-2',
    period: '2024-02',
    status: 'Calculated',
    employeeCount: 3,
    totalBaseSalary: 19500,
    totalAllowances: 5800,
    totalOvertime: 600,
    totalDeductions: 2000,
    totalNet: 23900,
    createdAt: '2024-02-24',
  }
];

export const MOCK_PAYROLL_REVIEWS: PayrollItem[] = [
  {
    id: 'per-1',
    runId: 'run-2',
    employeeId: '1',
    employeeName: 'Sarah Mitchell',
    department: 'Human Resources',
    baseSalary: 8000,
    allowances: 2500,
    deductions: 600,
    overtime: 400,
    late: 0,
    unpaidLeave: 0,
    netSalary: 10300,
    flags: [],
  },
  {
    id: 'per-2',
    runId: 'run-2',
    employeeId: '2',
    employeeName: 'John Doe',
    department: 'Nursing',
    baseSalary: 6000,
    allowances: 1800,
    deductions: 450,
    overtime: 200,
    late: 50,
    unpaidLeave: 0,
    netSalary: 7500,
    flags: ['Late Penalty Applied'],
  },
  {
    id: 'per-3',
    runId: 'run-2',
    employeeId: '3',
    employeeName: 'Jane Smith',
    department: 'Radiology',
    baseSalary: 5500,
    allowances: 1500,
    deductions: 400,
    overtime: 0,
    late: 0,
    unpaidLeave: 500,
    netSalary: 6100,
    flags: ['Unpaid Leave Detected'],
  }
];

export const MOCK_PAYSLIPS: Payslip[] = [
  {
    id: 'ps-1',
    employeeId: '1',
    employeeName: 'Sarah Mitchell',
    period: '2024-01',
    baseSalary: 8000,
    allowances: [
      { name: 'Total Allowances', amount: 2500 }
    ],
    deductions: [
      { name: 'Total Deductions', amount: 760 }
    ],
    netSalary: 9740,
    generatedAt: '2024-01-28',
  }
];

export const MOCK_EMPLOYEES: Employee[] = [
  {
    id: '1',
    employeeNo: 'EMP-001',
    firstName: 'Sarah',
    lastName: 'Mitchell',
    email: 's.mitchell@medistaff.com',
    phone: '+1 555-0101',
    department: 'Human Resources',
    position: 'HR Manager',
    hireDate: '2020-01-15',
    status: 'Active',
  },
  {
    id: '2',
    employeeNo: 'EMP-002',
    firstName: 'John',
    lastName: 'Doe',
    email: 'j.doe@medistaff.com',
    phone: '+1 555-0102',
    department: 'Nursing',
    position: 'Head Nurse',
    hireDate: '2021-03-10',
    status: 'Active',
  },
  {
    id: '3',
    employeeNo: 'EMP-003',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'j.smith@medistaff.com',
    phone: '+1 555-0103',
    department: 'Radiology',
    position: 'Technician',
    hireDate: '2022-05-20',
    status: 'Active',
  },
  {
    id: '4',
    employeeNo: 'EMP-004',
    firstName: 'Robert',
    lastName: 'Wilson',
    email: 'r.wilson@medistaff.com',
    phone: '+1 555-0104',
    department: 'Emergency',
    position: 'Doctor',
    hireDate: '2019-11-01',
    status: 'Active',
  },
  {
    id: '5',
    employeeNo: 'EMP-005',
    firstName: 'Emily',
    lastName: 'Davis',
    email: 'e.davis@medistaff.com',
    phone: '+1 555-0105',
    department: 'Pediatrics',
    position: 'Nurse',
    hireDate: '2023-02-15',
    status: 'Active',
  },
  {
    id: '6',
    employeeNo: 'EMP-006',
    firstName: 'Sarah',
    lastName: 'Mitchell',
    email: 's.mitchell@medistaff.com',
    phone: '+1 555-0106',
    department: 'Cardiology',
    position: 'Consultant',
    hireDate: '2020-01-15',
    status: 'Active',
  },
  {
    id: '7',
    employeeNo: 'EMP-007',
    firstName: 'John',
    lastName: 'Doe',
    email: 'j.doe@medistaff.com',
    phone: '+1 555-0107',
    department: 'Emergency',
    position: 'Senior Registrar',
    hireDate: '2021-03-10',
    status: 'Active',
  },
  {
    id: '8',
    employeeNo: 'EMP-008',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'j.smith@medistaff.com',
    phone: '+1 555-0108',
    department: 'Pediatrics',
    position: 'Specialist',
    hireDate: '2022-05-20',
    status: 'Active',
  },
];

export const MOCK_SHIFT_TYPES: ShiftType[] = [
  {
    id: 'st-1',
    code: 'MOR',
    name: 'Morning Shift',
    startTime: '07:00',
    endTime: '15:00',
    isOvernight: false,
    durationHours: 8,
    minStaffRequired: 5,
    tags: ['Standard'],
  },
  {
    id: 'st-2',
    code: 'EVE',
    name: 'Evening Shift',
    startTime: '15:00',
    endTime: '23:00',
    isOvernight: false,
    durationHours: 8,
    minStaffRequired: 4,
    tags: ['Standard'],
  },
  {
    id: 'st-3',
    code: 'NIG',
    name: 'Night Shift',
    startTime: '23:00',
    endTime: '07:00',
    isOvernight: true,
    durationHours: 8,
    minStaffRequired: 3,
    tags: ['Overnight'],
  },
];

export const MOCK_ALERTS: Alert[] = [
  {
    id: 'a-1',
    type: 'Document Expiry',
    severity: 'High',
    message: 'Nursing License for John Doe expires in 3 days.',
    date: '2024-03-05',
    isSeen: false,
    relatedId: '2',
    relatedModule: 'employees',
    department: 'Nursing',
  },
  {
    id: 'a-2',
    type: 'Understaffed',
    severity: 'Medium',
    message: 'Emergency Dept understaffed for Night Shift on 2024-03-10.',
    date: '2024-03-05',
    isSeen: false,
    relatedModule: 'scheduling',
    department: 'Emergency',
  },
  {
    id: 'a-3',
    type: 'Conflict',
    severity: 'Low',
    message: 'Shift overlap detected for Jane Smith on 2024-03-06.',
    date: '2024-03-05',
    isSeen: true,
    relatedId: '3',
    relatedModule: 'scheduling',
    department: 'Radiology',
  },
];

export const MOCK_APPROVALS: ApprovalRequest[] = [
  {
    id: 'ap-1',
    type: 'Leave',
    requesterName: 'Emily Davis',
    details: 'Annual Leave (3 days)',
    date: '2024-03-04',
    status: 'Pending',
    stage: 'Manager',
    department: 'Pediatrics',
  },
  {
    id: 'ap-2',
    type: 'Shift Swap',
    requesterName: 'John Doe',
    details: 'Swap Morning with Evening on 2024-03-08',
    date: '2024-03-05',
    status: 'Pending',
    stage: 'HR',
    department: 'Nursing',
  },
];

export const MOCK_POLICIES: WorkingHoursPolicy[] = [
  {
    id: 'p-1',
    department: 'Nursing',
    maxHoursPerDay: 12,
    maxHoursPerWeek: 48,
    overtimeAllowed: true,
    maxOvertimeHours: 10,
  },
];

export const MOCK_LEAVE_REQUESTS: LeaveRequest[] = [
  {
    id: 'LR-001',
    employeeId: '5',
    employeeName: 'Emily Davis',
    employeeNo: 'EMP-005',
    department: 'Pediatrics',
    leaveType: 'Annual',
    startDate: '2024-03-10',
    endDate: '2024-03-12',
    duration: 3,
    reason: 'Family vacation',
    status: 'Pending',
    stage: 'Manager',
    submittedAt: '2024-03-04 10:30',
  },
  {
    id: 'LR-002',
    employeeId: '2',
    employeeName: 'John Doe',
    employeeNo: 'EMP-002',
    department: 'Nursing',
    leaveType: 'Sick',
    startDate: '2024-03-05',
    endDate: '2024-03-05',
    duration: 1,
    reason: 'Flu',
    status: 'Approved',
    stage: 'Completed',
    submittedAt: '2024-03-05 08:00',
    managerApprovedBy: 'Dr. Sarah Mitchell',
    managerApprovedAt: '2024-03-05 08:30',
    hrApprovedBy: 'Admin',
    hrApprovedAt: '2024-03-05 09:00',
  },
  {
    id: 'LR-003',
    employeeId: '3',
    employeeName: 'Jane Smith',
    employeeNo: 'EMP-003',
    department: 'Radiology',
    leaveType: 'Annual',
    startDate: '2024-03-15',
    endDate: '2024-03-20',
    duration: 6,
    reason: 'Personal matters',
    status: 'Pending',
    stage: 'HR',
    submittedAt: '2024-03-01 14:00',
    managerApprovedBy: 'Dept Head',
    managerApprovedAt: '2024-03-02 10:00',
  },
  {
    id: 'LR-004',
    employeeId: '4',
    employeeName: 'Robert Wilson',
    employeeNo: 'EMP-004',
    department: 'Emergency',
    leaveType: 'Emergency',
    startDate: '2024-03-06',
    endDate: '2024-03-07',
    duration: 2,
    reason: 'Family emergency',
    status: 'Rejected',
    stage: 'Manager',
    submittedAt: '2024-03-05 16:00',
    rejectionReason: 'Insufficient coverage in Emergency Dept for these dates.',
  },
];

export const MOCK_LEAVE_BALANCES: LeaveBalance[] = [
  {
    employeeId: '1',
    employeeNo: 'EMP-001',
    employeeName: 'Sarah Mitchell',
    department: 'Human Resources',
    annual: 25,
    sick: 10,
    lastUpdated: '2024-01-01',
  },
  {
    employeeId: '2',
    employeeNo: 'EMP-002',
    employeeName: 'John Doe',
    department: 'Nursing',
    annual: 18,
    sick: 8,
    lastUpdated: '2024-01-01',
  },
  {
    employeeId: '3',
    employeeNo: 'EMP-003',
    employeeName: 'Jane Smith',
    department: 'Radiology',
    annual: 22,
    sick: 12,
    lastUpdated: '2024-01-01',
  },
  {
    employeeId: '4',
    employeeName: 'Robert Wilson',
    employeeNo: 'EMP-004',
    department: 'Emergency',
    annual: 15,
    sick: 5,
    lastUpdated: '2024-01-01',
  },
  {
    employeeId: '5',
    employeeName: 'Emily Davis',
    employeeNo: 'EMP-005',
    department: 'Pediatrics',
    annual: 20,
    sick: 10,
    lastUpdated: '2024-01-01',
  },
];

export const MOCK_ATTENDANCE: AttendanceRecord[] = [
  {
    id: '1',
    employeeId: '1',
    employeeNo: 'EMP-001',
    employeeName: 'Sarah Mitchell',
    department: 'Human Resources',
    date: '2026-03-04',
    checkIn: '08:05',
    checkOut: '17:15',
    totalHours: 9.1,
    lateMinutes: 5,
    overtimeHours: 1.1,
    status: 'Late',
    source: 'Device',
    scheduledStart: '08:00',
    scheduledEnd: '16:00',
    isCorrected: false,
  },
  {
    id: '2',
    employeeId: '2',
    employeeNo: 'EMP-002',
    employeeName: 'John Doe',
    department: 'Nursing',
    date: '2026-03-04',
    checkIn: '07:55',
    checkOut: '16:05',
    totalHours: 8.1,
    lateMinutes: 0,
    overtimeHours: 0.1,
    status: 'OK',
    source: 'Mobile',
    scheduledStart: '08:00',
    scheduledEnd: '16:00',
    isCorrected: false,
  },
  {
    id: '3',
    employeeId: '3',
    employeeNo: 'EMP-003',
    employeeName: 'Jane Smith',
    department: 'Radiology',
    date: '2026-03-04',
    checkIn: '08:00',
    checkOut: undefined,
    totalHours: 0,
    lateMinutes: 0,
    overtimeHours: 0,
    status: 'Missing Checkout',
    source: 'Device',
    scheduledStart: '08:00',
    scheduledEnd: '16:00',
    isCorrected: false,
  },
];

export const MOCK_ATTENDANCE_CORRECTIONS: AttendanceCorrection[] = [
  {
    id: 'AC-001',
    employeeId: '3',
    employeeName: 'Jane Smith',
    date: '2026-03-03',
    requestedIn: '08:00',
    requestedOut: '16:00',
    reason: 'Forgot to swipe out due to emergency case',
    department: 'Radiology',
    status: 'Pending',
    stage: 'Manager',
    submittedAt: '2026-03-04T09:00:00Z',
  },
];

export const MOCK_QUALIFICATIONS: Qualification[] = [
  {
    id: 'Q-001',
    employeeId: '1',
    employeeName: 'Sarah Mitchell',
    employeeNo: 'EMP-001',
    department: 'Human Resources',
    type: 'License',
    name: 'Medical Practice License',
    number: 'MPL-88273',
    expiryDate: '2026-06-15',
    status: 'Valid',
    verificationStatus: 'Verified',
    documentUrl: '/docs/mpl-88273.pdf',
  },
  {
    id: 'Q-002',
    employeeId: '2',
    employeeName: 'John Doe',
    employeeNo: 'EMP-002',
    department: 'Nursing',
    type: 'Certification',
    name: 'Advanced Cardiac Life Support (ACLS)',
    number: 'ACLS-2024-001',
    expiryDate: '2026-04-01',
    status: 'Expiring',
    verificationStatus: 'Pending',
    documentUrl: '/docs/acls-cert.pdf',
  },
  {
    id: 'Q-003',
    employeeId: '4',
    employeeName: 'Robert Wilson',
    employeeNo: 'EMP-004',
    department: 'Emergency',
    type: 'License',
    name: 'Nursing License',
    number: 'NL-99210',
    expiryDate: '2026-02-28',
    status: 'Expired',
    verificationStatus: 'Verified',
    documentUrl: '/docs/nl-99210.pdf',
  },
];

export const MOCK_DOCUMENTS: Document[] = [
  {
    id: 'DOC-001',
    fileName: 'medical_license_sarah.pdf',
    filePath: '/storage/employees/1/medical_license_sarah.pdf',
    docType: 'License',
    uploadedBy: 'Sarah Mitchell',
    uploadedAt: '2025-01-10T10:00:00Z',
    entityType: 'Qualification',
    entityId: 'Q-001',
    department: 'Human Resources',
  },
  {
    id: 'DOC-002',
    fileName: 'acls_cert_john.pdf',
    filePath: '/storage/employees/2/acls_cert_john.pdf',
    docType: 'Certification',
    uploadedBy: 'John Doe',
    uploadedAt: '2025-02-15T14:30:00Z',
    entityType: 'Qualification',
    entityId: 'Q-002',
    department: 'Nursing',
  },
];

export const MOCK_JOB_OPENINGS: JobOpening[] = [
  {
    id: 'JO-001',
    title: 'Senior Registered Nurse',
    department: 'Emergency',
    position: 'Nurse',
    vacancies: 3,
    status: 'Open',
    createdAt: '2024-02-15',
    requirements: '5+ years experience, ACLS certified',
    description: 'Looking for experienced ER nurses for night shifts.',
    employmentType: 'Full-time',
    priority: 'High',
    candidateCount: 12,
  },
  {
    id: 'JO-002',
    title: 'Consultant Cardiologist',
    department: 'Cardiology',
    position: 'Doctor',
    vacancies: 1,
    status: 'Pending Approval',
    createdAt: '2024-03-01',
    requirements: 'Board certified, 10+ years experience',
    description: 'Lead cardiologist position for our new wing.',
    employmentType: 'Full-time',
    priority: 'High',
    candidateCount: 2,
  },
  {
    id: 'JO-003',
    title: 'Medical Lab Technician',
    department: 'Laboratory',
    position: 'Technician',
    vacancies: 2,
    status: 'Draft',
    createdAt: '2024-03-04',
    requirements: 'Degree in Medical Technology',
    description: 'General lab duties and sample processing.',
    employmentType: 'Part-time',
    priority: 'Medium',
    candidateCount: 0,
  }
];

export const MOCK_CANDIDATES: Candidate[] = [
  {
    id: 'CAN-001',
    openingId: 'JO-001',
    name: 'Alice Johnson',
    email: 'alice.j@example.com',
    phone: '+1234567890',
    stage: 'Interview',
    experienceYears: 6,
    education: 'BSc Nursing',
    source: 'Referral',
    notes: 'Strong clinical background.',
    cvUrl: '/docs/cv_alice.pdf',
    appliedAt: '2024-02-20',
    history: [
      { stage: 'Applied', timestamp: '2024-02-20' },
      { stage: 'Screening', timestamp: '2024-02-22' },
      { stage: 'Interview', timestamp: '2024-02-25' }
    ]
  },
  {
    id: 'CAN-002',
    openingId: 'JO-001',
    name: 'Bob Smith',
    email: 'bob.smith@example.com',
    phone: '+1234567891',
    stage: 'Applied',
    experienceYears: 4,
    education: 'BSc Nursing',
    source: 'Email',
    notes: 'New to the area.',
    cvUrl: '/docs/cv_bob.pdf',
    appliedAt: '2024-02-21',
    history: [{ stage: 'Applied', timestamp: '2024-02-21' }]
  },
  {
    id: 'CAN-003',
    openingId: 'JO-002',
    name: 'Dr. Sarah Wilson',
    email: 's.wilson@example.com',
    phone: '+1234567892',
    stage: 'Offer',
    experienceYears: 12,
    education: 'MD Cardiology',
    source: 'Agency',
    notes: 'Highly recommended.',
    cvUrl: '/docs/cv_sarah.pdf',
    appliedAt: '2024-03-02',
    history: [
      { stage: 'Applied', timestamp: '2024-03-02' },
      { stage: 'Screening', timestamp: '2024-03-03' },
      { stage: 'Interview', timestamp: '2024-03-05' },
      { stage: 'Offer', timestamp: '2024-03-06' }
    ]
  }
];

export const MOCK_INTERVIEWS: Interview[] = [
  {
    id: 'INT-001',
    candidateId: 'CAN-001',
    openingId: 'JO-001',
    candidateName: 'Alice Johnson',
    openingTitle: 'Senior Registered Nurse',
    dateTime: '2024-03-10T10:00:00',
    type: 'Technical',
    department: 'Emergency',
    interviewers: ['Dr. House', 'Nurse Joy'],
    outcome: 'Pending',
    notes: 'Focus on emergency response protocols.'
  }
];

export const MOCK_OFFERS: Offer[] = [
  {
    id: 'OFF-001',
    candidateId: 'CAN-003',
    openingId: 'JO-002',
    candidateName: 'Dr. Sarah Wilson',
    openingTitle: 'Consultant Cardiologist',
    status: 'Sent',
    proposedStartDate: '2024-04-01',
    baseSalary: 150000,
    allowances: 20000,
    contractType: 'Full-time',
    department: 'Cardiology',
    createdAt: '2024-03-06',
    notes: 'Relocation package included.'
  }
];

export const MOCK_EVALUATION_TEMPLATES: EvaluationTemplate[] = [
  {
    id: 'T-001',
    name: 'General Performance Review',
    version: '1.0',
    status: 'Published',
    periodType: 'Annual',
    createdBy: 'Sarah Mitchell',
    createdAt: '2023-12-01',
  },
  {
    id: 'T-002',
    name: 'Quarterly Technical Assessment',
    version: '1.2',
    status: 'Published',
    periodType: 'Quarterly',
    createdBy: 'Sarah Mitchell',
    createdAt: '2024-01-15',
  }
];

export const MOCK_EVALUATION_CYCLES: EvaluationCycle[] = [
  {
    id: 'CYC-001',
    name: '2023 Year-End Review',
    templateId: 'T-001',
    templateName: 'General Performance Review',
    startDate: '2023-12-15',
    dueDate: '2024-01-31',
    status: 'Finalized',
    completionPercentage: 100,
    scope: 'All',
    participants: ['1', '2', '3', '4', '5'],
  },
  {
    id: 'CYC-002',
    name: 'Q1 2024 Technical Review',
    templateId: 'T-002',
    templateName: 'Quarterly Technical Assessment',
    startDate: '2024-03-01',
    dueDate: '2024-03-31',
    status: 'Active',
    completionPercentage: 45,
    scope: 'Department',
    department: 'Nursing',
    participants: ['2', '5'],
  }
];

export const MOCK_EMPLOYEE_REVIEWS: EvaluationRecord[] = [
  {
    id: 'REV-001',
    cycleId: 'CYC-001',
    cycleName: '2023 Year-End Review',
    employeeId: '2',
    employeeName: 'John Doe',
    evaluatorId: '1',
    evaluatorName: 'Sarah Mitchell',
    status: 'Finalized',
    ratings: {
      technical: 4,
      communication: 5,
      teamwork: 4,
      discipline: 5,
    },
    comments: {
      technical: 'Excellent clinical skills and patient care.',
      communication: 'Very clear and empathetic with patients and staff.',
      teamwork: 'Reliable team player, always helps others.',
      discipline: 'Perfect attendance and punctuality.',
    },
    overallScore: 4.5,
    managerComments: 'John is a key asset to the nursing department.',
    developmentPlan: 'Focus on leadership training for potential promotion.',
    submittedAt: '2024-01-10',
    finalizedAt: '2024-01-15',
  },
  {
    id: 'REV-002',
    cycleId: 'CYC-002',
    cycleName: 'Q1 2024 Technical Review',
    employeeId: '2',
    employeeName: 'John Doe',
    evaluatorId: '1',
    evaluatorName: 'Sarah Mitchell',
    status: 'Draft',
    ratings: {
      technical: 3,
      communication: 4,
      teamwork: 4,
      discipline: 5,
    },
    comments: {
      technical: 'Maintaining standards.',
      communication: 'Good.',
      teamwork: 'Active.',
      discipline: 'Excellent.',
    },
    overallScore: 4.0,
    managerComments: '',
    developmentPlan: '',
  }
];
export const MOCK_SHIFT_ASSIGNMENTS: ScheduleAssignment[] = [
  {
    id: 'sa-1',
    employeeId: '2',
    employeeName: 'John Doe',
    shiftTypeId: 'st-1',
    shiftTypeName: 'Morning Shift',
    department: 'Nursing',
    date: '2026-03-11',
    status: 'Published',
  },
  {
    id: 'sa-2',
    employeeId: '5',
    employeeName: 'Emily Davis',
    shiftTypeId: 'st-2',
    shiftTypeName: 'Evening Shift',
    department: 'Pediatrics',
    date: '2026-03-11',
    status: 'Published',
  }
];
export const MOCK_REPORT_TEMPLATES: ReportTemplate[] = [
  {
    id: 'rep-001',
    name: 'reports_executive_summary_name',
    description: 'reports_executive_summary_desc',
    category: 'Executive',
    type: 'Workforce',
    roles: ['HR Manager', 'System Admin']
  },
  {
    id: 'rep-002',
    name: 'reports_budget_utilization_name',
    description: 'reports_budget_utilization_desc',
    category: 'Financial',
    type: 'Financial',
    roles: ['HR Manager', 'Accountant']
  },
  {
    id: 'rep-003',
    name: 'reports_compliance_audit_name',
    description: 'reports_compliance_audit_desc',
    category: 'Compliance',
    type: 'Compliance',
    roles: ['HR Manager', 'HR Officer']
  },
  {
    id: 'rep-004',
    name: 'reports_attendance_report_name',
    description: 'reports_attendance_report_desc',
    category: 'Operational',
    type: 'Attendance',
    roles: ['HR Manager', 'Department Head']
  },
  {
    id: 'rep-005',
    name: 'reports_payroll_variance_name',
    description: 'reports_payroll_variance_desc',
    category: 'Financial',
    type: 'Payroll',
    roles: ['HR Manager', 'Accountant']
  },
  {
    id: 'rep-006',
    name: 'reports_recruitment_funnel_name',
    description: 'reports_recruitment_funnel_desc',
    category: 'Operational',
    type: 'Recruitment',
    roles: ['HR Manager', 'HR Officer']
  }
];

export const MOCK_REPORT_HISTORY: ReportRun[] = [
  {
    id: 'hist-001',
    reportName: 'reports_executive_summary_name',
    category: 'Executive',
    generatedBy: 'Sarah Johnson',
    generatedAt: '2024-03-01 09:30:45',
    scopeDept: 'All',
    format: 'PDF',
    status: 'Completed',
    metadata: { period: 'Q1 2024', filters: 'All Departments' }
  },
  {
    id: 'hist-002',
    reportName: 'reports_budget_utilization_name',
    category: 'Financial',
    generatedBy: 'Sarah Johnson',
    generatedAt: '2024-03-02 14:15:10',
    scopeDept: 'Nursing',
    format: 'Excel',
    status: 'Completed',
    metadata: { period: 'Feb 2024', filters: 'Dept: Nursing' }
  },
  {
    id: 'hist-003',
    reportName: 'reports_compliance_audit_name',
    category: 'Compliance',
    generatedBy: 'Sarah Johnson',
    generatedAt: '2024-03-03 11:00:00',
    scopeDept: 'All',
    format: 'PDF',
    status: 'Completed',
    metadata: { period: 'YTD 2024', filters: 'Expired Licenses' }
  },
  {
    id: 'hist-004',
    reportName: 'reports_attendance_report_name',
    category: 'Operational',
    generatedBy: 'Sarah Johnson',
    generatedAt: '2024-03-04 16:45:30',
    scopeDept: 'Emergency',
    format: 'Excel',
    status: 'Failed',
    metadata: { period: 'Last 7 Days', filters: 'Dept: Emergency' }
  }
];

export const MOCK_SPECIALTIES: DoctorSpecialty[] = [
  { id: 'spec-1', name: 'Cardiology', description: 'Heart and blood vessel disorders' },
  { id: 'spec-2', name: 'Neurology', description: 'Nervous system disorders' },
  { id: 'spec-3', name: 'Pediatrics', description: 'Medical care of infants, children, and adolescents' },
  { id: 'spec-4', name: 'Orthopedics', description: 'Musculoskeletal system' },
  { id: 'spec-5', name: 'Dermatology', description: 'Skin, hair, and nail disorders' },
  { id: 'spec-6', name: 'General Surgery', description: 'Surgical treatment of abdominal organs' },
  { id: 'spec-7', name: 'Internal Medicine', description: 'Prevention, diagnosis, and treatment of internal diseases' },
  { id: 'spec-8', name: 'Emergency Medicine', description: 'Immediate medical attention' },
];

export const MOCK_DOCTORS: Doctor[] = [
  {
    id: 'doc-1',
    employeeId: '6',
    doctorCode: 'DOC-001',
    medicalLicenseNumber: 'ML-12345',
    licensingAuthority: 'Ministry of Health',
    licenseIssueDate: '2020-01-15',
    licenseExpiryDate: '2025-01-15',
    availabilityStatus: 'Available',
    specialties: ['Internal Medicine', 'Cardiology'],
    primarySpecialty: 'Internal Medicine',
    status: 'Active',
    notes: 'Senior consultant with 15 years experience.'
  },
  {
    id: 'doc-2',
    employeeId: '7',
    doctorCode: 'DOC-002',
    medicalLicenseNumber: 'ML-67890',
    licensingAuthority: 'Ministry of Health',
    licenseIssueDate: '2021-05-20',
    licenseExpiryDate: '2024-05-20',
    availabilityStatus: 'Busy',
    specialties: ['Emergency Medicine'],
    primarySpecialty: 'Emergency Medicine',
    status: 'Active'
  },
  {
    id: 'doc-3',
    employeeId: '8',
    doctorCode: 'DOC-003',
    medicalLicenseNumber: 'ML-11223',
    licensingAuthority: 'Ministry of Health',
    licenseIssueDate: '2019-11-10',
    licenseExpiryDate: '2023-11-10',
    availabilityStatus: 'On Leave',
    specialties: ['Pediatrics'],
    primarySpecialty: 'Pediatrics',
    status: 'Inactive',
    notes: 'License expired, renewal in progress.'
  }
];
