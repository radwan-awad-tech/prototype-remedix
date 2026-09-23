# Page Grouping by Module

This document details the pages and key components within each module of the MediStaff HR application.

## 1. Dashboard Module
- **DashboardPage**: The landing page for authenticated users.
    - **Key Components**: KPI Cards, Attendance Alerts, Leave Requests Summary, Recruitment Pipeline Overview.

## 2. Employees Module
- **EmployeesPage**: Main directory of all hospital staff.
    - **Key Components**:
        - **DataTable**: Searchable, filterable list of employees.
        - **AddEmployeeWizard**: Multi-step modal for onboarding new staff.
        - **EmployeeProfile**: Full-screen drawer for viewing and editing detailed employee records.
        - **TerminateModal**: Confirmation modal for offboarding employees.

## 3. Doctors Module
- **DoctorsPage**: Specialized view for managing medical practitioners.
    - **Key Components**:
        - **DoctorsList**: Filterable list of doctors with quick actions.
        - **AddDoctorWizard**: Multi-step view for onboarding medical staff.
        - **DoctorProfile**: Detailed full-screen drawer for medical credentials, specialties, and clinical status.

## 4. Workforce Management Module
- **SchedulingPage**: Shift and roster management.
    - **Key Components**:
        - **ShiftsCalendar**: Visual calendar for shift assignments and roster planning.
- **LeavesPage**: Leave request and balance management.
    - **Key Components**:
        - **LeaveRequests**: List of pending and processed leave requests with filtering.
        - **LeaveRequestForm**: Modal for submitting new leave requests with type selection and date range.
        - **LeaveBalances**: Overview of user's leave entitlements and usage history.
        - **LeaveRequestDetails**: Drawer for reviewing and approving/rejecting leave requests.
- **AttendancePage**: Time tracking and attendance logs.
    - **Key Components**:
        - **AttendanceLog**: Daily attendance records with check-in/out times.
        - **CheckInOut**: Quick actions for clocking in and out with location tracking (simulated).
        - **CorrectionRequests**: Workflow for employees to request corrections to their attendance logs.
        - **OvertimeSummary**: Overview of calculated overtime hours.

## 5. Compliance & Documents Module
- **LicensesPage**: Professional license and certification tracking.
    - **Key Components**:
        - **QualificationsList**: List of employee qualifications.
        - **VerificationQueue**: Workflow for verifying submitted documents.
        - **DocumentCenter**: Centralized document storage and tracking.

## 6. Talent Module
- **RecruitmentPage**: End-to-end hiring management.
    - **Key Components**:
        - **JobOpenings**: List of active and closed job vacancies.
        - **CandidatePipeline**: Kanban-style view of candidates in different stages.
        - **Interviews**: Interview scheduling and feedback.
        - **Offers**: Offer letter generation and tracking.
        - **ConvertWizard**: Workflow for converting a candidate to an employee.

## 7. Performance Module
- **PerformancePage**: Employee evaluation and feedback.
    - **Key Components**:
        - **EvaluationCycles**: Management of review periods.
        - **EvaluationTemplates**: Customizable review forms.
        - **PerformanceAnalytics**: Data visualization of performance trends.

## 8. Payroll Module
- **PayrollPage**: Compensation and benefit management.
    - **Key Components**:
        - **RunPayroll**: Workflow for processing monthly payroll.
        - **PayrollReview**: Final review stage before payment.
        - **Payslips**: Generation and distribution of employee payslips.
        - **PayrollSettings**: Configuration of salary components and rules.

## 9. Occupational Health Module
- **OccupationalHealthPage**: Staff health and safety management.
    - **Key Components**:
        - **IncidentReporting**: Workflow for reporting workplace incidents.
        - **VaccinationTracking**: Records of staff immunizations.
        - **MedicalCheckups**: Scheduling and tracking of routine medical exams.

## 10. Reports Module
- **ReportsPage**: Centralized data analysis.
    - **Key Components**:
        - **ReportTemplates**: Pre-defined report formats.
        - **CustomReportBuilder**: Tool for generating custom data exports.

## 11. Administration Module
- **AdministrationPage**: System-wide settings.
    - **Key Components**:
        - **UserManagement**: Management of system users and roles.
        - **AuditLogs**: Tracking of system activities and changes.
        - **SystemSettings**: Global application configuration.

## 12. Auth & User Self-Service
- **LoginPage**: Entry point for authentication.
- **ProfilePage**: User's own personal profile view.
- **UserSettingsPage**: Application preferences (language, theme).
- **AccessDeniedPage**: Fallback for unauthorized access attempts.
