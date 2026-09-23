# Role-Based Access Control (RBAC) Mapping

This document details the access permissions for each major path in the MediStaff HR application, based on the user's role.

## Role Definitions

- **System Admin**: Full access to all modules and administration settings.
- **HR Manager**: Full access to HR-related modules and some administration settings.
- **HR Officer**: Access to core HR modules (Employees, Doctors, Scheduling, Leaves, Attendance, Licenses, Recruitment, Health).
- **Department Head**: Access to their department's data (Employees, Doctors, Scheduling, Leaves, Attendance, Performance, Reports).
- **Accountant**: Access to Payroll and Reports.
- **Payroll Officer**: Access to Payroll.
- **Occupational Health Officer**: Access to Attendance, Licenses, and Occupational Health.
- **Employee**: Access to their own data (Dashboard, Leaves, Payroll/Payslips, Settings, Profile).

## Path Permissions

| Path | Description | Allowed Roles |
| --- | --- | --- |
| `/` | Dashboard | All Authenticated Users (`*`) |
| `/employees` | Employees Directory | HR Manager, HR Officer, System Admin, Department Head |
| `/doctors` | Doctors Management | HR Manager, HR Officer, System Admin, Department Head |
| `/scheduling` | Shift Scheduling | HR Manager, HR Officer, System Admin, Department Head |
| `/leaves` | Leave Management | All Authenticated Users (`*`) |
| `/attendance` | Attendance Logs | HR Manager, HR Officer, System Admin, Department Head, Occupational Health Officer |
| `/licenses` | License Tracking | HR Manager, HR Officer, System Admin, Occupational Health Officer |
| `/recruitment` | Recruitment Pipeline | HR Manager, HR Officer, System Admin |
| `/performance` | Performance Reviews | HR Manager, System Admin, Department Head |
| `/payroll` | Payroll Processing | HR Manager, Payroll Officer, Accountant, System Admin, Employee |
| `/health` | Occupational Health | HR Manager, HR Officer, System Admin, Occupational Health Officer |
| `/reports` | System Reports | HR Manager, System Admin, Department Head, Accountant |
| `/admin` | Administration | System Admin, HR Manager |
| `/settings` | User Settings | All Authenticated Users (`*`) |
| `/profile` | User Profile | All Authenticated Users (`*`) |

## Permission Logic

- **Sidebar Filtering**: Navigation items are automatically hidden from the sidebar if the user's role is not in the `allowedRoles` list for that path.
- **Route Guarding**: If a user attempts to access a restricted path directly via the URL, the application redirects them to the **AccessDeniedPage**.
- **Default Behavior**: If a path is not explicitly defined in the permissions mapping, it defaults to being accessible by all authenticated users.
