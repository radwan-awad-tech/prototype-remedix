# Role-Based Access Control (RBAC) Matrix (Simulated)

> [!NOTE]
> The RBAC model described here is currently **simulated in the UI**. Access is controlled by the `AuthContext` and enforced in the `Sidebar` and `AppShell` components based on mock user roles. A future backend implementation will be required to enforce these permissions at the API level.

This document outlines the access permissions for each role across the different modules of the MediStaff HR application. The permissions are defined in `/src/modules/auth/permissions.ts` and enforced in `App.tsx` and `Sidebar.tsx`.

## Roles Defined
1. **System Admin**: Full access to all modules, including system configuration and audit logs.
2. **HR Manager**: High-level access to all HR functions, reporting, and approvals.
3. **HR Officer**: Operational access to employee records, attendance, and leaves.
4. **Department Head**: Scoped access to their specific department's data (e.g., team attendance, leave approvals).
5. **Employee**: Self-service access to their own profile, payslips, and leave requests.
6. **Payroll Officer**: Specialized access to the Payroll and Reports modules.
7. **Accountant**: Access restricted to Financial and Payroll report categories.
8. **Occupational Health Officer**: Exclusive access to the Occupational Health module for managing sensitive medical records.

## Access Matrix

| Module / Route | System Admin | HR Manager | HR Officer | Dept Head | Employee | Payroll Officer | Accountant | OH Officer |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Dashboard** (`/`) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Employees** (`/employees`) | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Doctors** (`/doctors`) | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Scheduling** (`/scheduling`) | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Leaves** (`/leaves`) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Attendance** (`/attendance`) | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ |
| **Licenses** (`/licenses`) | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Recruitment** (`/recruitment`) | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Performance** (`/performance`) | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Payroll** (`/payroll`) | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ |
| **Occupational Health** (`/health`) | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Reports** (`/reports`) | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ | ✅ | ❌ |
| **Administration** (`/admin`) | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Profile** (`/profile`) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Settings** (`/settings`) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

### Notes
- **`*` (All Authenticated Users)**: Routes like `/`, `/leaves`, `/settings`, and `/profile` are accessible to all authenticated users.
- **Scoped Access**: While a role like `Department Head` has access to `/reports` and `/employees`, the data they see within those modules is typically scoped to their specific department (this logic is handled at the component or API level).
- **Occupational Health Privacy**: The `Occupational Health` module has an internal privacy model where sensitive fields are masked for roles other than the `Occupational Health Officer`.
