# Navigation Map

This document outlines the navigation structure of the MediStaff HR application, including the main menu, sub-menus, and footer actions.

## Main Navigation (Sidebar)

The sidebar is the primary navigation element, providing access to all major modules. It supports a collapsed and expanded state.

### 1. Dashboard
- **Path**: `/`
- **Icon**: `LayoutDashboard`
- **Purpose**: Overview of key HR metrics and alerts.

### 2. People (Group)
- **Employees**
    - **Path**: `/employees`
    - **Icon**: `Users`
    - **Purpose**: Centralized employee directory and record management.
- **Doctors**
    - **Path**: `/doctors`
    - **Icon**: `Stethoscope`
    - **Roles**: HR Manager, HR Officer, Department Head, System Admin
    - **Purpose**: Specialized management for medical staff credentials and profiles.

### 3. Workforce Management (Group)
- **Scheduling**
    - **Path**: `/scheduling`
    - **Icon**: `Calendar`
    - **Purpose**: Shift planning and roster management.
- **Leaves**
    - **Path**: `/leaves`
    - **Icon**: `Clock`
    - **Purpose**: Leave request processing and balance tracking.
- **Attendance**
    - **Path**: `/attendance`
    - **Icon**: `FileText`
    - **Purpose**: Time tracking, check-ins, and attendance logs.

### 4. Compliance & Documents (Group)
- **Licenses**
    - **Path**: `/licenses`
    - **Icon**: `ShieldCheck`
    - **Purpose**: Professional license tracking and document verification.

### 5. Talent (Group)
- **Recruitment**
    - **Path**: `/recruitment`
    - **Icon**: `Briefcase`
    - **Purpose**: Job openings, candidate pipeline, and hiring workflows.

### 6. Performance
- **Path**: `/performance`
- **Icon**: `TrendingUp`
- **Purpose**: Evaluation cycles, templates, and performance analytics.

### 7. Payroll
- **Path**: `/payroll`
- **Icon**: `CreditCard`
- **Purpose**: Payroll processing, history, and payslip generation.

### 8. Occupational Health (Group)
- **Occupational Health**
    - **Path**: `/health`
    - **Icon**: `HeartPulse`
    - **Roles**: HR Manager, HR Officer, Department Head, System Admin, Occupational Health Officer
    - **Purpose**: Incident reporting, vaccination tracking, and medical checkups.

### 9. Reports
- **Path**: `/reports`
- **Icon**: `BarChart3`
- **Roles**: HR Manager, Department Head, Accountant, System Admin
- **Purpose**: Centralized reporting and data export.

### 10. Administration
- **Path**: `/admin`
- **Icon**: `Settings`
- **Roles**: System Admin, HR Manager
- **Purpose**: System configuration, user management, and audit logs.

## Footer Actions

Located at the bottom of the sidebar, these actions are always accessible.

- **Collapse/Expand Menu**: Toggles the sidebar width.
- **User Profile**:
    - **Path**: `/profile`
    - **Icon**: `User`
    - **Purpose**: View and edit personal profile information.
- **User Settings**:
    - **Path**: `/settings`
    - **Icon**: `Settings`
    - **Purpose**: Manage application preferences (language, theme).
- **Logout**:
    - **Action**: Triggers a confirmation modal before clearing the session.

## Navigation Logic

- **Role-Based Access Control (RBAC)**: Navigation items are filtered based on the user's role. If a user doesn't have permission for a path, the item is hidden from the sidebar.
- **Active State**: The current page is highlighted in the sidebar using a primary gradient background.
- **RTL Support**: Navigation icons and text alignment automatically adjust for Arabic (RTL) language settings.
