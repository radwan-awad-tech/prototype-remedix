# Navigation Map (Simulated)

> [!NOTE]
> This document outlines the high-level navigation structure of the MediStaff HR application. In the current **frontend-only** version, some routes may lead to views populated with mock data or placeholder content.

This document outlines the high-level navigation structure of the MediStaff HR application. The navigation is primarily handled by the `Sidebar` component (`/src/layout/Sidebar.tsx`) and routed in `App.tsx`.

## Main Navigation Structure

- **Dashboard** (`/`)
  - Overview of KPIs, Alerts, and Pending Approvals.

- **People**
  - **Employees** (`/employees`)
    - Employee Directory
    - Add Employee Wizard
    - Employee Profile
  - **Doctors** (`/doctors`)
    - Doctors Directory
    - Doctor Profile
    - Add Doctor Wizard

- **Workforce Management**
  - **Scheduling** (`/scheduling`)
    - Shifts Calendar
    - Manage Shift Types
    - Working Hours Policies
    - Swap Requests
  - **Leaves** (`/leaves`)
    - Leave Requests
    - Leave Balances
    - Approval Workflow
  - **Attendance** (`/attendance`)
    - Daily Attendance Log
    - Check-in/out
    - Corrections

- **Compliance & Documents**
  - **Licenses** (`/licenses`)
    - Professional Licenses
    - Certifications & Training
    - Verification Queue
    - Document Center

- **Talent**
  - **Recruitment** (`/recruitment`)
    - Job Openings
    - Candidates Pipeline (Kanban)
    - Interviews
    - Offers

- **Performance** (`/performance`)
  - Evaluation Forms (Templates)
  - Evaluation Cycles
  - Employee Reviews
  - Results & Analytics

- **Payroll** (`/payroll`)
  - Payroll Settings
  - Run Payroll
  - Payroll Review
  - Payslips
  - Payroll History

- **Occupational Health** (`/health`)
  - Incidents
  - Vaccinations
  - Medical Checkups
  - Follow-ups

- **Reports** (`/reports`)
  - Report Catalog
  - Report Builder
  - Generated Reports History

- **Administration** (`/admin`)
  - System Settings
  - Users & Access
  - Organizational Structure
  - Audit & Activity Log

## User Settings & Profile
- **Profile** (`/profile`)
  - Current user's personal details and settings.
- **Settings** (`/settings`)
  - Application preferences (e.g., Language, Theme).

## Authentication
- **Login** (`/login` - handled conditionally in `App.tsx`)
- **Access Denied** (Rendered when a user tries to access a restricted route)
