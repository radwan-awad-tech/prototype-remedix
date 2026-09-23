# Key UI Interactions

This document describes the major UI patterns and interactions used across the MediStaff HR application.

## 1. Data Tables

The **DataTable** is the most common component for displaying lists of records.

- **Search**: Real-time filtering based on multiple fields (e.g., name, ID, email).
- **Filtering**: Dropdown filters for categories like Department, Status, or Role.
- **Sorting**: Clickable column headers for ascending/descending order.
- **Row Actions**: A "More" menu (three dots) on each row providing context-specific actions (View, Edit, Delete, Terminate).
- **Row Click**: Clicking a row typically opens a **Drawer** for a detailed view of the record.
- **Export**: A "Download" button in the page header for exporting the current table view to CSV.

## 2. Drawers (Side Panels)

Drawers are used for detailed record reviews and quick edits without leaving the main page context.

- **Position**: Slides in from the right side of the screen.
- **Size**: Varies from "md" (medium) to "xl" (extra-large) depending on the content density.
- **Common Usage**:
    - **EmployeeProfile**: Comprehensive view of an employee's personal, job, and document records.
    - **LeaveRequestDetails**: Reviewing and approving leave requests.
    - **CandidateDetails**: Viewing candidate resumes and interview history.
- **Interaction**: Can be closed by clicking the "X" button, clicking the backdrop, or pressing the "Escape" key.

## 3. Modals (Dialogs)

Modals are used for focused tasks, confirmations, and multi-step workflows.

- **Position**: Centered on the screen with a darkened backdrop.
- **Common Usage**:
    - **AddEmployeeWizard**: Multi-step onboarding form.
    - **LeaveRequestForm**: Form for submitting leave requests.
    - **ConfirmModal**: Generic confirmation for destructive actions (e.g., Logout, Termination).
- **Interaction**: Requires explicit user action (Confirm/Cancel) to close in most cases.

## 4. Multi-Step Wizards

Wizards are used for complex processes that require sequential data entry.

- **Progress Indicator**: A visual stepper at the top showing the current step and total steps.
- **Navigation**: "Back" and "Next" buttons at the bottom.
- **Validation**: Each step is validated before allowing the user to proceed to the next one.
- **Common Usage**:
    - **AddEmployeeWizard** (Onboarding)
    - **RunPayroll** (Payroll processing)
    - **ConvertWizard** (Candidate to Employee conversion)

## 5. Status Badges

The **StatusBadge** component provides quick visual feedback on the state of a record.

- **Colors**:
    - **Green**: Active, Approved, Completed, Hired.
    - **Yellow**: Pending, In-Progress, Interviewing.
    - **Red**: Inactive, Rejected, Terminated, Overdue.
    - **Blue**: Draft, Scheduled, Applied.

## 6. RTL (Right-To-Left) Support

The application fully supports Arabic (RTL) language settings.

- **Layout Inversion**: The sidebar moves to the right, and content flows from right to left.
- **Icon Mirroring**: Directional icons (e.g., arrows, chevrons) are automatically mirrored.
- **Font Switching**: The system switches to an appropriate Arabic font for better legibility.
- **ForceLTR Utility**: Used for data that must remain LTR even in RTL mode (e.g., IDs, emails, phone numbers).
