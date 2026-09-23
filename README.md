# MediStaff HR Frontend - Project Foundation

This repository contains the frontend codebase for the MediStaff HR Management System. At its current stage, this project is **frontend-only**. All data displayed and managed within the application is simulated using mock data and services. There is no real backend implementation or database connection.

## Purpose of the Application

The MediStaff HR application aims to provide a comprehensive suite of tools for managing human resources within a healthcare organization. It covers modules such as employee management, recruitment, performance, payroll, attendance, leave management, occupational health, and reporting.

## Current Frontend-Only Status & Limitations

*   **Mock Data & Services**: All data is hardcoded or generated using mock services (`/src/mockData.ts`, `/src/services/apiClient.ts`). API calls return predefined responses.
*   **No Real Backend**: No backend API is implemented or connected. All state management and data persistence are client-side and temporary.
*   **Placeholder Actions**: Certain actions (e.g., 'Save Draft', 'Submit') may trigger placeholder feedback or be non-functional until backend integration.
*   **Limited RBAC**: Role-based access control is simulated in the UI, but not enforced by a backend authentication system.

## Setup & Installation

1.  **Prerequisites**: Node.js (v18+ recommended) and npm.
2.  **Install Dependencies**:
    ```bash
    npm install
    ```
3.  **Environment Variables**: 
    Copy `.env.example` to `.env` and fill in any required values. Currently, no specific backend-related environment variables are needed for frontend-only operation.

## Run Development Server

To start the local development server:
```bash
npm run dev
```
The application will be available at `http://localhost:3000` (or the port specified by your environment).

## Build for Production

To build the application for production:
```bash
npm run build
```
This will generate static files in the `dist/` directory.

To preview the production build locally:
```bash
npm run preview
```

## Architecture Overview

MediStaff HR is a modern Single Page Application (SPA) built with:
*   **React 18+** (UI Library)
*   **Vite** (Build Tool & Dev Server)
*   **TypeScript** (Type Safety)
*   **Tailwind CSS** (Styling)
*   **Lucide React** (Icons)
*   **Framer Motion** (Animations)

### Project Structure

*   `/src/layout`: Contains the `Sidebar` and `AppShell` components that define the main application structure.
*   `/src/components/ui`: Reusable, atomic UI components (DataTable, Modal, Drawer, StatusBadge, etc.).
*   `/src/pages`: Top-level route components.
*   `/src/modules`: Domain-specific feature modules (e.g., Attendance, Payroll, Doctors). Each module contains its own components, views, and a dedicated `README.md`.
*   `/src/types`: TypeScript interfaces and types for the entire project.
*   `/src/styles`: Theme tokens and global CSS (via Tailwind).
*   `/src/services`: API service layers. These currently use mock data and simulate API responses using `ApiResponse<T>`.
*   `/src/i18n`: Internationalization setup and translations.
*   `/src/hooks`: Custom React hooks.
*   `/src/context`: Global state contexts (e.g., AuthContext).

## Module Overview

*   **Dashboard**: Provides an overview of key HR metrics and alerts.
*   **Employees**: Manages employee records and profiles.
*   **Doctors**: Specific module for managing doctor-related information and credentials.
*   **Scheduling**: Handles staff scheduling and shift management.
*   **Leaves**: Manages leave requests, balances, and policies.
*   **Attendance**: Tracks employee check-ins/outs, logs, and correction requests.
*   **Licenses & Documentation**: Manages professional licenses, certifications, and other documents.
*   **Recruitment**: Covers the entire hiring process from job openings to offers.
*   **Performance**: Facilitates performance reviews, templates, and analytics.
*   **Payroll**: Manages payroll processing, runs, components, and payslips.
*   **Occupational Health**: Handles incidents, vaccinations, and medical checkups.
*   **Reports**: Provides reporting capabilities for various HR data.
*   **Admin**: System administration functions, user management, and settings.

## Role Model Overview

The system uses Role-Based Access Control (RBAC) to restrict navigation and actions. The `Sidebar` component filters navigation items based on the `currentRole` of the user. The `AuthContext` manages the current user's role.

Currently supported roles (simulated):
*   **System Admin**: Full access to all modules, including system configuration and audit logs.
*   **HR Manager**: High-level access to all HR functions, reporting, and approvals.
*   **HR Officer**: Operational access to employee records, attendance, and leaves.
*   **Department Head**: Scoped access to their specific department's data (e.g., team attendance, leave approvals).
*   **Employee**: Self-service access to their own profile, payslips, and leave requests.
*   **Payroll Officer**: Specialized access to the Payroll and Reports modules.
*   **Occupational Health Officer**: Exclusive access to the Occupational Health module for managing sensitive medical records.

## Future Backend Integration Notes

This frontend application is designed to be integrated with a backend API. The `src/services` directory contains mock implementations that adhere to the `ApiResponse<T>` structure. When a backend is developed, the following will be necessary:

1.  **`apiClient.ts` Update**: Modify `apiClient.ts` to make actual HTTP requests (e.g., using `fetch` or `axios`) to the backend endpoints.
2.  **Service Layer Implementation**: Replace mock data and logic in service files (e.g., `employeeService.ts`, `recruitmentService.ts`) with calls to the real API endpoints.
3.  **Authentication**: Implement actual user authentication and authorization flows, likely involving JWTs or session tokens managed by `AuthContext`.
4.  **Data Persistence**: Backend will handle all data storage and retrieval.
5.  **Error Handling**: Refine error handling to gracefully manage backend API errors and communicate them to the user via the `useToast` hook.

## Core UI Components

### DataTable
A powerful table component with built-in search, filtering UI, pagination, and column persistence.
Usage:
```tsx
<DataTable 
  tableId="employees_list" // Enable column chooser & persistence
  data={data}
  columns={columns}
  onSearch={(val) => setSearch(val)}
/>
```

### Drawer
Used for side-panels with standardized header and footer actions.
Usage:
```tsx
<Drawer
  isOpen={isOpen}
  onClose={close}
  title="Edit Record"
  subtitle="Update details for this entry"
  footerActions={{
    primary: { label: 'Save Changes', onClick: handleSave, isLoading: isSaving },
    secondary: { label: 'Cancel', onClick: close }
  }}
>
  {/* Content */}
</Drawer>
```

### Modal & ConfirmModal
Centered dialogs for complex forms or simple confirmations.
Usage:
```tsx
// Standard Modal
<Modal isOpen={isOpen} onClose={close} title="Form Title">
  {/* Content */}
</Modal>

// Confirm Modal
<ConfirmModal
  isOpen={isConfirmOpen}
  onClose={() => setConfirmOpen(false)}
  onConfirm={handleDelete}
  title="Delete Record?"
  message="This action cannot be undone."
  type="danger"
  confirmLabel="Delete"
/>
```

### Toast
Global notification system with helper methods.
Usage:
```tsx
const { success, error, info } = useToast();

// Trigger notifications
success("Record updated successfully!");
error("Failed to save changes.");
info("Feature coming soon");
```
