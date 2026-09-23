# Flows & Dependencies

This document provides a detailed look at the major interactive flows, important detail panels, and the dependencies between different pages in the MediStaff HR application.

## 1. Major Create/Edit/Review Flows

The system uses specific UI patterns for complex data entry and review processes.

### 1.1. Multi-Step Wizards (Onboarding)
- **AddEmployeeWizard** (`/employees`):
    - **Path A (Manual)**: 5 steps (Personal, Job, Documents, Payroll, Review).
    - **Path B (Recruitment)**: Links to `CandidatePipeline` to pre-fill data.
- **AddDoctorWizard** (`/doctors`):
    - Specialized onboarding for medical staff including specialty and clinical status.
- **ConvertWizard** (`/recruitment`):
    - 4 steps to transform a "Hired" candidate into a full employee record.

### 1.2. Request & Approval Flows
- **Leave Request** (`/leaves`):
    - **Entry**: "Request Leave" button.
    - **Flow**: Modal form -> Submission -> Status: Pending -> Manager Review -> Status: Approved/Rejected.
- **Attendance Correction** (`/attendance`):
    - **Entry**: "Request Correction" on a specific log entry.
    - **Flow**: Modal form -> Reason/Time entry -> Submission -> HR Review.

### 1.3. Review & Processing Cycles
- **Performance Evaluation** (`/performance`):
    - **Flow**: Cycle Creation -> Self-Assessment (Employee) -> Manager Review (Evaluator) -> Finalization.
    - **Interaction**: Drawer-based evaluation form with competency ratings and development plans.
- **Payroll Processing** (`/payroll`):
    - **Flow**: Create Run -> Import Attendance -> Calculate -> Review -> Lock -> Approve.
    - **Interaction**: Dashboard-style view with status transitions and checklist validation.

---

## 2. Important Detail Drawers & Panels

Detail panels provide a "deep dive" into specific records without losing the context of the main list.

| Panel Name | Module | Trigger | Key Content |
|------------|--------|---------|-------------|
| **EmployeeProfile** | Employees | Row Click | Tabs: Overview, Job, Documents, Payroll, Performance, History. |
| **DoctorProfile** | Doctors | Row Click | Credentials, Specialties, Clinical Status, Active Licenses. |
| **CandidateDetails** | Recruitment | Row Click | Resume, Interview Notes, Pipeline History, Evaluation Scores. |
| **LeaveRequestDetails** | Leaves | Row Click | Request details, overlapping leaves, approval/rejection actions. |
| **EvaluationDetails** | Performance | Row Click | Competency scores, manager comments, development plan. |

---

## 3. Form Entry Points

| Action | Location | Component |
|--------|----------|-----------|
| Add Employee | Employees Page (Header) | `AddEmployeeWizard` (Modal) |
| Request Leave | Leaves Page (Header) | `LeaveRequestForm` (Modal) |
| Add Candidate | Recruitment Page (Header) | `AddCandidateForm` (Modal) |
| Correct Attendance | Attendance Page (Table) | `CorrectionRequestModal` |
| Create Payroll Run | Payroll Page (Header) | `CreateRunModal` |

---

## 4. Page-Level Dependencies

While the app is modular, several pages have logical or functional dependencies.

### 4.1. Data Dependencies
- **Recruitment -> Employees**: The `ConvertWizard` in Recruitment creates a new record that appears in the Employees list.
- **Employees -> Payroll**: Payroll calculations depend on the "Payroll" tab data in the `EmployeeProfile` (Base Salary, Allowances).
- **Attendance -> Payroll**: The "Import Attendance" action in Payroll fetches data from the Attendance module logs.
- **Leaves -> Attendance**: Approved leaves automatically create "Leave" entries in the Attendance log to account for absences.

### 4.2. Service Dependencies
- All pages depend on the `AuthContext` for user role and permissions.
- Most pages depend on a specific module service (e.g., `employeeService`, `leaveService`) which currently uses mock data.
- The `SettingsPage` affects the global `SettingsContext` (Language, Theme, RTL), which impacts the rendering of every other page.
