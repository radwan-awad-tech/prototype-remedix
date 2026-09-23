# Leaves Module

## Module Purpose
The Leaves module manages employee leave requests, approvals, and balances, ensuring accurate tracking of time off across the organization.

## Main Pages/Components
- **Leave Requests**: Dashboard for viewing, submitting, and managing leave applications.
- **Leave Calendar**: Visual month-view of approved leaves for team coordination.
- **Leave Balances**: Tracking of annual, sick, and other leave quotas for employees.
- **Leave Request Form**: Standardized interface for employees to apply for time off.

## Visible User Flows
1. **Request Submission**: Employee checks their balance, fills out the leave request form with dates and reasons, and submits it for approval.
2. **Approval Workflow**: Manager receives a notification, reviews the request details, and approves or rejects it.
3. **Calendar Coordination**: Team lead views the leave calendar to ensure adequate staffing before approving new requests.

## Major Actions
- **Submit Request**: Apply for a new leave period.
- **Approve/Reject**: Managerial action to process a pending leave request.
- **Adjust Balance**: HR action to manually update an employee's leave quota.
- **View Calendar**: Browse approved leaves in a calendar format.

## Current Mock/Scaffolded Behavior
- **Data**: Leave requests and balances are generated from local mock data.
- **Approval Flow**: Requests move through stages (Pending -> Approved/Rejected) using local state.
- **Calendar**: Approved leaves are dynamically rendered on the calendar based on mock data.

## Known Limitations
- Automatic accrual logic for leave balances is simulated.
- Integration with payroll for unpaid leave deductions is a placeholder.
- Complex leave policies (e.g., carry-over limits) are partially implemented.

## Likely Future Backend/API Needs
- `GET /api/leaves/requests`: List leave requests with filters.
- `GET /api/leaves/balances`: Fetch current leave balances for an employee.
- `POST /api/leaves/requests`: Submit a new leave request.
- `PUT /api/leaves/requests/:id/status`: Update leave status (Approve/Reject).
- `POST /api/leaves/adjust-balance`: HR-only balance adjustment.
- `GET /api/leaves/calendar`: Fetch approved leaves for calendar view.
