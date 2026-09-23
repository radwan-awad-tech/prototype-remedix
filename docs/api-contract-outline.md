# Future API Contract Outline

> [!IMPORTANT]
> This document outlines the high-level API endpoints that will be required to transition the MediStaff HR application from its current **frontend-only** mock-data state to a fully functional backend-integrated system. These endpoints are currently **not implemented**.

## 1. Authentication & Authorization (`/api/auth`)
- `POST /api/auth/login`: Authenticate user and return JWT.
- `POST /api/auth/logout`: Invalidate current session.
- `GET /api/auth/me`: Fetch current user profile based on token.
- `POST /api/auth/refresh`: Refresh JWT token.

## 2. Administration (`/api/admin`)
- `GET /api/admin/audit-logs`: Fetch audit logs with pagination and filters.
- `GET /api/admin/settings`: Fetch global system settings.
- `PUT /api/admin/settings`: Update global system settings.
- `GET /api/admin/users`: Fetch system users.
- `POST /api/admin/users`: Create a new system user.
- `PUT /api/admin/users/:id`: Update a system user.
- `GET /api/admin/roles`: Fetch role definitions and permissions.

## 3. Dashboard (`/api/dashboard`)
- `GET /api/dashboard/stats`: Fetch KPI data.
- `GET /api/dashboard/charts`: Fetch data for charts.
- `GET /api/dashboard/alerts`: Fetch active alerts.
- `POST /api/dashboard/alerts/:id/seen`: Mark alert as seen.
- `GET /api/dashboard/approvals`: Fetch pending approval requests.
- `POST /api/dashboard/approvals/:id/approve`: Approve a request.
- `POST /api/dashboard/approvals/:id/reject`: Reject a request.

## 4. Employees (`/api/employees`)
- `GET /api/employees`: List employees with pagination and filters.
- `GET /api/employees/:id`: Fetch single employee profile.
- `POST /api/employees`: Create new employee record.
- `PUT /api/employees/:id`: Update existing employee record.

## 5. Doctors (`/api/doctors`)
- `GET /api/doctors`: List all doctors with filters.
- `GET /api/doctors/:id`: Get detailed doctor profile.
- `POST /api/doctors`: Create new doctor record.
- `PUT /api/doctors/:id`: Update doctor record.
- `PATCH /api/doctors/:id/status`: Deactivate/Reactivate doctor.
- `GET /api/specialties`: List all available specialties.
- `POST /api/doctors/:id/documents`: Upload credentials.

## 6. Scheduling (`/api/scheduling`)
- `GET /api/scheduling/shift-types`: List available shift types.
- `GET /api/scheduling/assignments`: Fetch shift assignments for a date range.
- `GET /api/scheduling/policies`: Fetch working hours and staffing policies.
- `POST /api/scheduling/assign`: Create new shift assignment.
- `POST /api/scheduling/publish`: Lock and publish a schedule period.
- `GET /api/scheduling/conflicts`: Run validation engine to find staffing gaps.

## 7. Leaves (`/api/leaves`)
- `GET /api/leaves/requests`: Fetch leave requests (filtered by user role).
- `POST /api/leaves/requests`: Submit a new leave request.
- `PUT /api/leaves/requests/:id/approve`: Approve a leave request.
- `PUT /api/leaves/requests/:id/reject`: Reject a leave request.
- `GET /api/leaves/balances/:employeeId`: Fetch leave balances for an employee.

## 8. Attendance (`/api/attendance`)
- `GET /api/attendance/logs`: Fetch daily attendance logs.
- `POST /api/attendance/check-in`: Record a check-in event.
- `POST /api/attendance/check-out`: Record a check-out event.
- `POST /api/attendance/corrections`: Submit an attendance correction request.
- `PUT /api/attendance/corrections/:id/approve`: Approve a correction request.

## 9. Licenses & Documentation (`/api/licenses` & `/api/documents`)
- `GET /api/qualifications`: List qualifications with advanced filters.
- `POST /api/qualifications/verify/:id`: Mark a qualification as verified.
- `POST /api/qualifications/reject/:id`: Reject a qualification with a reason.
- `GET /api/documents`: Unified document search.
- `POST /api/documents/upload`: Generic upload with entity linking.
- `DELETE /api/documents/:id`: Soft delete document (HR only).

## 10. Recruitment (`/api/recruitment`)
- `GET /api/recruitment/openings`: List job openings with filters.
- `GET /api/recruitment/candidates`: List candidates, optionally filtered by opening.
- `GET /api/recruitment/interviews`: List scheduled interviews.
- `GET /api/recruitment/offers`: List job offers.
- `POST /api/recruitment/openings`: Create a new job opening.
- `PATCH /api/recruitment/candidates/:id/stage`: Update candidate pipeline stage.
- `POST /api/recruitment/interviews`: Schedule an interview.
- `POST /api/recruitment/offers`: Generate a job offer.
- `POST /api/recruitment/convert`: Convert a hired candidate to an employee record.

## 11. Performance (`/api/performance`)
- `GET /api/performance/templates`: Fetch all evaluation templates.
- `GET /api/performance/cycles`: Fetch all evaluation cycles.
- `GET /api/performance/reviews`: Fetch employee reviews with filters.
- `POST /api/performance/cycles/start`: Initialize a new review cycle.
- `PUT /api/performance/reviews/:id`: Save or submit a review.
- `GET /api/performance/analytics`: Fetch aggregated performance data for charts.
- `POST /api/performance/reviews/:id/unlock`: HR action to allow re-editing of a submitted review.

## 12. Payroll (`/api/payroll`)
- `GET /api/payroll/runs`: Fetch all payroll runs.
- `GET /api/payroll/components`: Fetch all salary components.
- `GET /api/payroll/rules`: Fetch all payroll rules and rates.
- `GET /api/payroll/reviews`: Fetch detailed payroll review data for a run.
- `GET /api/payroll/payslips`: Fetch payslips with filters.
- `POST /api/payroll/runs`: Initialize a new monthly run.
- `POST /api/payroll/calculate/:runId`: Trigger server-side calculation logic.
- `POST /api/payroll/approve/:runId`: Final approval of a payroll run.

## 13. Occupational Health (`/api/oh`)
- `GET /api/oh/incidents`: List incidents (filtered by role).
- `POST /api/oh/incidents`: Report new incident.
- `PATCH /api/oh/incidents/:id/close`: Close an incident case.
- `GET /api/oh/vaccinations`: List vaccination records.
- `GET /api/oh/checkups`: List medical checkups.

## 14. Reports (`/api/reports`)
- `GET /api/reports/templates`: Fetch available report templates based on user role.
- `GET /api/reports/history`: Fetch the audit log of generated reports.
- `POST /api/reports/generate`: Trigger server-side report generation with filter parameters.
- `GET /api/reports/download/:historyId`: Securely download a generated report file.
