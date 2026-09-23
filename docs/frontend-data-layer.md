# Frontend Data Layer & Scaffolding

This document explains how the MediStaff HR frontend currently handles data, state, and persistence. The project is currently a frontend-only prototype. All data operations are simulated to provide a realistic user experience without requiring a backend.

## 1. Key Frontend Types & Models

The core data structures are defined in `src/types/index.ts`. These TypeScript interfaces act as the contract for what the frontend expects to send and receive.

### Core Models
- **`Employee`**: Represents a staff member, including personal info, job details, and status.
- **`Doctor`**: Extends the concept of an employee with medical-specific fields (licenses, specialties).
- **`Candidate` & `JobOpening`**: Used in the Recruitment module for tracking applicants.
- **`LeaveRequest` & `LeaveBalance`**: Used for time-off management.
- **`AttendanceRecord`**: Tracks daily check-ins/outs and calculated hours.
- **`PayrollRun` & `Payslip`**: Represents monthly payroll processing cycles.
- **`EvaluationCycle` & `EvaluationRecord`**: Used for performance reviews.

### API Response Wrapper
All service methods return an `ApiResponse<T>`:
```typescript
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
  success: boolean;
}
```
*Future Backend Implication*: The backend should standardize its JSON responses to match this structure, or the `apiClient` will need to be updated to map the backend's response format to this interface.

---

## 2. Mock Data Sources

The primary source of truth for initial data is `src/mockData.ts`.

- This file exports large arrays of static data (e.g., `MOCK_EMPLOYEES`, `MOCK_LEAVE_REQUESTS`, `MOCK_PAYROLL_RUNS`).
- The data is carefully structured to demonstrate complex relationships (e.g., a candidate linked to a job opening, or a payroll item linked to an employee).
- **Limitation**: This data is static. Changes made in the UI do not modify `mockData.ts`.

---

## 3. The Service Layer

The application uses a service-oriented architecture (`src/services/`) to abstract data fetching from the UI components.

### `apiClient.ts`
This is a mock HTTP client. It exposes `get`, `post`, `put`, `delete`, and `error` methods.
- **Behavior**: It wraps responses in Promises and uses `setTimeout` (default 300ms) to simulate network latency.
- **Purpose**: This allows UI components to handle loading states (`isLoading`) and asynchronous operations exactly as they would with a real backend.

### Module Services (e.g., `employeeService.ts`, `leaveService.ts`)
Each module has a dedicated service file.
- **Stateful Mocking**: Services often load the static mock data into a local `let` variable when the file is first evaluated:
  ```typescript
  let employees = [...MOCK_EMPLOYEES];
  ```
- **CRUD Operations**: When a user creates or updates a record, the service modifies this local array and returns a success response via `apiClient`.
- **Limitation**: Because this state lives in memory, **all changes are lost when the browser is refreshed**.

---

## 4. State Management & Persistence

The frontend uses different strategies for state depending on the data's lifespan and scope.

### Local Component State
- Managed via React's `useState` and `useReducer`.
- Used for form inputs, modal visibility, and temporary UI toggles.

### Global Application State (Context API)
- **`AuthContext`**: Manages the currently logged-in user and their role.
- **`SettingsContext`**: Manages language (i18n) and theme preferences.

### Persistence (`localStorage`)
The application intentionally avoids persisting complex relational data (like employees or payroll runs) to `localStorage` to prevent state corruption and complexity in the prototype phase. However, `localStorage` is used for specific, isolated preferences:
1. **Authentication**: `auth_token` and `current_user` are stored to maintain session state across reloads.
2. **Settings**: `medistaff_language` and `medistaff_theme_id` are saved so user preferences persist.
3. **UI Preferences**: `dt_cols_${tableId}` is used by the `DataTable` component to remember which columns the user has hidden/shown.
4. **Audit Logs**: The Occupational Health module (`OH_AUDIT_LOG_KEY`) uses `localStorage` to demonstrate a persistent audit trail.

---

## 5. Placeholder vs. Stateful Interactions

It is important for future backend developers to understand what is currently "working" in memory versus what is purely cosmetic.

### Stateful Interactions (In-Memory)
These actions update the local service arrays. The UI will reflect the changes until a page refresh:
- Adding a new Employee or Candidate.
- Submitting a Leave Request.
- Approving/Rejecting a Leave Request.
- Moving a Candidate through pipeline stages.
- Creating a new Payroll Run.

### Placeholder Interactions (Cosmetic)
These actions trigger a success toast or UI update but do not actually mutate the underlying mock data arrays:
- "Importing Attendance" in the Payroll module.
- Generating complex PDF reports (triggers a download of a dummy file or shows a success message).
- Sending email notifications (simulated via toast messages).

---

## 6. Current Limitations & Backend Integration Guide

When transitioning this application to a real backend, developers should note the following:

1. **Pagination & Filtering**: Currently, services return the *entire* array of mock data, and filtering/pagination is handled client-side by the `DataTable` component. A real backend will need to implement server-side pagination, sorting, and filtering for performance.
2. **Relational Integrity**: The mock services do not enforce strict relational integrity (e.g., deleting an employee does not automatically delete their leave requests). The backend database must handle cascading deletes or foreign key constraints.
3. **Authentication**: The current `AuthContext` uses a hardcoded mock token. This must be replaced with a real JWT or session-based authentication flow.
4. **File Uploads**: Document uploads currently just save a fake file path string to the mock data. Real file storage (e.g., AWS S3, Google Cloud Storage) and multipart form data handling will need to be implemented.
5. **Real-time Updates**: Features like notifications or live dashboard updates currently rely on polling or static data. WebSockets or Server-Sent Events (SSE) should be considered for the backend implementation.
