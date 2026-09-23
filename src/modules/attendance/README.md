# Attendance Module

## Module Purpose
The Attendance module tracks daily employee presence, manages check-in/out events, processes attendance correction requests, and aggregates data for payroll processing.

## Main Pages/Components
- **Check-in / Check-out**: Real-time interface for employees to record their arrival and departure.
- **Attendance Log**: Comprehensive list of all attendance records with filtering and search capabilities.
- **Correction Requests**: Workflow for employees to request fixes for missing or incorrect punches.
- **Overtime & Late Summary**: Aggregated view of worked hours, overtime, and lateness for a given period.

## Visible User Flows
1. **Daily Punching**: Employee logs in and uses the check-in/out interface to record their shift times.
2. **Correction Workflow**: Employee identifies an error in their log, submits a correction request with a reason, and tracks its approval status.
3. **Manager Review**: Manager reviews the attendance log for their department and approves or rejects pending correction requests.

## Major Actions
- **Check-in/out**: Record the current timestamp for shift start or end.
- **Submit Correction**: Request a manual update to an attendance record.
- **Approve/Reject Correction**: Managerial action to finalize a correction request.
- **Filter Logs**: Search and filter attendance records by date, department, or employee.

## Current Mock/Scaffolded Behavior
- **Punch Logic**: Check-in/out actions update the local state and provide immediate feedback.
- **Calculations**: Total hours and lateness are calculated on the fly based on mock shift schedules.
- **Approval Flow**: Correction requests move through stages (Pending -> Approved/Rejected) using local state management.

## Known Limitations
- Real-time integration with hardware biometric devices is simulated.
- Geofencing for mobile check-ins is currently a UI-only placeholder.
- Automatic shift detection for flexible schedules is limited.

## Likely Future Backend/API Needs
- `POST /api/attendance/check-in`: Record start of shift.
- `POST /api/attendance/check-out`: Record end of shift.
- `GET /api/attendance/log`: Fetch attendance records with filters.
- `GET /api/attendance/corrections`: Fetch pending correction requests.
- `POST /api/attendance/corrections`: Submit a new correction request.
- `POST /api/attendance/corrections/:id/approve`: Approve a correction request.
- `POST /api/attendance/corrections/:id/reject`: Reject a correction request.
- `GET /api/attendance/summary`: Fetch monthly payroll-ready data.
