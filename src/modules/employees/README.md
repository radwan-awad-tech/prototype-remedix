# Employees Module

## Module Purpose
The Employees module is the core of the OryxStaff system, managing all hospital staff records, personal information, and onboarding workflows.

## Main Pages/Components
- **Employees List**: Searchable and filterable directory of all hospital staff.
- **Add Employee Wizard**: Multi-step guided process for onboarding new hires.
- **Employee Profile**: Comprehensive tabbed view of an employee's personal, job, and document records.

## Visible User Flows
1. **Onboarding**: HR user follows the wizard to enter personal details, job information, and upload required documents for a new hire.
2. **Profile Management**: User navigates to an employee's profile to update contact information or view their employment history.
3. **Directory Search**: User uses the main list to find employees by name, department, or role.

## Major Actions
- **Create Employee**: Add a new staff member to the system via the onboarding wizard.
- **Edit Profile**: Update existing employee details.
- **Terminate/Deactivate**: Change an employee's status to reflect their current standing.
- **Filter Directory**: Narrow down the employee list based on various criteria.

## Current Mock/Scaffolded Behavior
- **Data**: Employee records are generated from local mock data.
- **Onboarding**: The wizard saves data to local state and simulates a successful creation.
- **Persistence**: Changes to employee records are temporary and reset on page reload.

## Known Limitations
- Real-time synchronization with external payroll or identity providers is simulated.
- Document storage for employee files is a UI-only placeholder.
- Advanced search (e.g., by skills or certifications) is partially implemented.

## Likely Future Backend/API Needs
- `GET /api/employees`: List employees with pagination and filters.
- `GET /api/employees/:id`: Fetch single employee profile.
- `POST /api/employees`: Create a new employee record.
- `PUT /api/employees/:id`: Update an existing employee record.
- `PATCH /api/employees/:id/status`: Update an employee's status (Active, On Leave, Terminated).

