# Key User Journeys

This document describes the most common user journeys within the MediStaff HR application, focusing on the interface and navigation.

## 1. Onboarding a New Employee

**User Role**: HR Manager / HR Officer

1. **Entry Point**: Navigate to **People > Employees**.
2. **Action**: Click the **"Add Employee"** button in the page header.
3. **Interaction**: The **AddEmployeeWizard** modal opens.
4. **Flow**:
    - **Step 1: Personal Info**: Enter name, email, phone, and address.
    - **Step 2: Job Details**: Select department, position, role, and hire date.
    - **Step 3: Documents**: Upload initial documents (ID, contract).
    - **Step 4: Review**: Confirm all entered details.
5. **Completion**: Click **"Complete"**. The modal closes, a success toast appears, and the new employee is added to the list.

## 2. Requesting and Approving Leave

**User Role**: Employee (Requesting) / Manager (Approving)

### Requesting Leave:
1. **Entry Point**: Navigate to **Workforce Management > Leaves**.
2. **Action**: Click the **"Request Leave"** button.
3. **Interaction**: The **LeaveRequestForm** modal opens.
4. **Flow**:
    - Select leave type (Annual, Sick, etc.).
    - Choose start and end dates.
    - Add a reason or attachment if required.
5. **Completion**: Click **"Submit"**. The request appears in the **LeaveRequests** list with a "Pending" status.

### Approving Leave:
1. **Entry Point**: Navigate to **Workforce Management > Leaves**.
2. **Action**: Click on a "Pending" leave request in the list.
3. **Interaction**: The **LeaveRequestDetails** drawer opens.
4. **Flow**:
    - Review the request details and the employee's current balance.
    - Add a comment if necessary.
5. **Completion**: Click **"Approve"** or **"Reject"**. The status updates in real-time, and a notification is triggered for the employee.

## 3. Managing Recruitment Pipeline

**User Role**: Recruitment Officer / HR Manager

1. **Entry Point**: Navigate to **Talent > Recruitment**.
2. **Action**: Switch to the **"Candidates"** tab.
3. **Interaction**: The **CandidatePipeline** (Kanban board) is displayed.
4. **Flow**:
    - Drag a candidate card from "Applied" to "Interviewing".
    - Click on a candidate card to open the **CandidateDetails** drawer.
    - Schedule an interview or log feedback.
5. **Completion**: Move the candidate to "Hired". This triggers the **ConvertWizard** to transform the candidate into an employee record.

## 4. Processing Monthly Payroll

**User Role**: Accountant / HR Manager

1. **Entry Point**: Navigate to **Payroll**.
2. **Action**: Click the **"Run Payroll"** button.
3. **Interaction**: The **RunPayroll** multi-step workflow begins.
4. **Flow**:
    - **Step 1: Select Period**: Choose the month and year.
    - **Step 2: Review Attendance**: Verify attendance and overtime data.
    - **Step 3: Adjustments**: Add bonuses, deductions, or manual adjustments.
    - **Step 4: Review**: Perform a final check of the total payroll amount.
5. **Completion**: Click **"Process"**. The payroll is finalized, and payslips are generated for all employees.

## 5. Updating Personal Profile and Settings

**User Role**: All Users

1. **Entry Point**: Click the **User Profile** or **Settings** button in the sidebar footer.
2. **Action**:
    - In **ProfilePage**: Update contact details or view professional history.
    - In **UserSettingsPage**: Change the application language (English/Arabic) or toggle between Light/Dark themes.
3. **Completion**: Changes are applied immediately (for settings) or after clicking "Save" (for profile).
