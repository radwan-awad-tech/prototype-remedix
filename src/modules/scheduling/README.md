# Scheduling Module

## Module Purpose
The Scheduling module is a workforce management tool for planning hospital shifts, ensuring adequate department coverage, and managing employee shift preferences.

## Main Pages/Components
- **Shifts Calendar**: Interactive grid for viewing, assigning, and managing shifts across the organization.
- **Manage Shift Types**: Interface for defining shift timings, colors, and staffing requirements.
- **Working Hours Policies**: Configuration area for labor rules, overtime limits, and rest periods.
- **Swap Requests**: Dashboard for managing employee-initiated shift changes and swaps.

## Visible User Flows
1. **Shift Planning**: Manager views the calendar, identifies gaps, and assigns shifts to employees by clicking on the grid.
2. **Shift Swapping**: Employees request to swap shifts, and managers review and approve these requests in the Swap Requests view.
3. **Policy Configuration**: Admin defines the rules for overtime and maximum working hours that the system uses for conflict detection.

## Major Actions
- **Assign Shift**: Create a new shift assignment for an employee on a specific date.
- **Publish Schedule**: Lock a period's schedule and make it visible to employees.
- **Approve Swap**: Review and finalize a shift swap between two employees.
- **Define Shift Type**: Create or edit shift templates (e.g., "Night Shift", "Emergency Rotation").

## Current Mock/Scaffolded Behavior
- **Calendar Data**: Shifts are rendered based on mock assignments in the module's state.
- **Conflict Detection**: Basic UI highlighting for overlapping shifts is implemented but not exhaustive.
- **Persistence**: Changes to the calendar are temporary and reset on page reload.

## Known Limitations
- Automated shift rotation and auto-scheduling are not implemented.
- Real-time conflict validation against leave requests is simulated.
- Drag-and-drop shift reassignment is currently a UI-only interaction.

## Likely Future Backend/API Needs
- `GET /api/scheduling/shift-types`: List available shift types.
- `GET /api/scheduling/assignments`: Fetch shift assignments for a date range.
- `GET /api/scheduling/policies`: Fetch working hours and staffing policies.
- `POST /api/scheduling/assign`: Create new shift assignment.
- `POST /api/scheduling/publish`: Lock and publish a schedule period.
- `GET /api/scheduling/conflicts`: Run validation engine to find staffing gaps.
