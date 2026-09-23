# Proposed Database Table Mapping (Future Backend)

> [!IMPORTANT]
> This document outlines a **proposed** relational database structure for a future backend implementation. The current application is **frontend-only** and uses mock data and services.

This document provides a conceptual mapping of the core data models used in the MediStaff HR application to a relational database structure.

## Core Entities

### `users`
- `id` (PK, UUID)
- `email` (VARCHAR, Unique)
- `password_hash` (VARCHAR)
- `role_id` (FK -> `roles.id`)
- `employee_id` (FK -> `employees.id`, Nullable)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### `roles`
- `id` (PK, UUID)
- `name` (VARCHAR) - e.g., 'System Admin', 'HR Manager'
- `permissions` (JSONB) - Granular access control flags

### `employees`
- `id` (PK, UUID)
- `employee_code` (VARCHAR, Unique) - e.g., 'EMP-001'
- `first_name` (VARCHAR)
- `last_name` (VARCHAR)
- `email` (VARCHAR, Unique)
- `department_id` (FK -> `departments.id`)
- `job_title` (VARCHAR)
- `status` (ENUM) - 'Active', 'On Leave', 'Terminated'
- `join_date` (DATE)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### `departments`
- `id` (PK, UUID)
- `name` (VARCHAR)
- `head_employee_id` (FK -> `employees.id`, Nullable)

### `doctors`
- `id` (PK, UUID)
- `employee_id` (FK -> `employees.id`, Unique)
- `doctor_code` (VARCHAR, Unique)
- `medical_license_number` (VARCHAR)
- `licensing_authority` (VARCHAR)
- `license_issue_date` (DATE)
- `license_expiry_date` (DATE)
- `availability_status` (ENUM)
- `primary_specialty_id` (FK -> `specialties.id`)

### `specialties`
- `id` (PK, UUID)
- `name` (VARCHAR)
- `description` (TEXT)

## Workforce Management

### `shift_types`
- `id` (PK, UUID)
- `name` (VARCHAR)
- `start_time` (TIME)
- `end_time` (TIME)
- `color_code` (VARCHAR)

### `shift_assignments`
- `id` (PK, UUID)
- `employee_id` (FK -> `employees.id`)
- `shift_type_id` (FK -> `shift_types.id`)
- `date` (DATE)
- `status` (ENUM) - 'Scheduled', 'Completed', 'Missed'

### `leave_requests`
- `id` (PK, UUID)
- `employee_id` (FK -> `employees.id`)
- `type` (ENUM) - 'Annual', 'Sick', 'Maternity', etc.
- `start_date` (DATE)
- `end_date` (DATE)
- `status` (ENUM) - 'Pending Manager', 'Pending HR', 'Approved', 'Rejected'
- `reason` (TEXT)
- `manager_id` (FK -> `employees.id`, Nullable)
- `hr_id` (FK -> `employees.id`, Nullable)

### `attendance_logs`
- `id` (PK, UUID)
- `employee_id` (FK -> `employees.id`)
- `date` (DATE)
- `check_in_time` (TIMESTAMP)
- `check_out_time` (TIMESTAMP)
- `status` (ENUM) - 'Present', 'Absent', 'Late', 'Half Day'
- `late_minutes` (INT)

## Compliance & Documents

### `qualifications`
- `id` (PK, UUID)
- `employee_id` (FK -> `employees.id`)
- `type` (ENUM) - 'License', 'Certification'
- `name` (VARCHAR)
- `number` (VARCHAR)
- `expiry_date` (DATE)
- `verification_status` (ENUM) - 'Pending', 'Verified', 'Rejected'
- `document_id` (FK -> `documents.id`)

### `documents`
- `id` (PK, UUID)
- `file_name` (VARCHAR)
- `file_path` (VARCHAR)
- `doc_type` (VARCHAR)
- `uploaded_by` (FK -> `users.id`)
- `entity_type` (ENUM) - 'Employee', 'Doctor', 'Qualification', etc.
- `entity_id` (UUID) - Polymorphic relation

## Talent & Performance

### `job_openings`
- `id` (PK, UUID)
- `title` (VARCHAR)
- `department_id` (FK -> `departments.id`)
- `status` (ENUM) - 'Draft', 'Pending Approval', 'Open', 'Closed'
- `vacancies` (INT)

### `candidates`
- `id` (PK, UUID)
- `opening_id` (FK -> `job_openings.id`)
- `first_name` (VARCHAR)
- `last_name` (VARCHAR)
- `email` (VARCHAR)
- `stage` (ENUM) - 'Applied', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected'

### `evaluation_cycles`
- `id` (PK, UUID)
- `name` (VARCHAR)
- `start_date` (DATE)
- `due_date` (DATE)
- `status` (ENUM) - 'Draft', 'Active', 'Closed', 'Finalized'

### `evaluation_records`
- `id` (PK, UUID)
- `cycle_id` (FK -> `evaluation_cycles.id`)
- `employee_id` (FK -> `employees.id`)
- `evaluator_id` (FK -> `employees.id`)
- `status` (ENUM) - 'Draft', 'Submitted', 'Acknowledged'
- `overall_score` (DECIMAL)
- `comments` (TEXT)

## Payroll & Health

### `payroll_runs`
- `id` (PK, UUID)
- `period` (VARCHAR) - e.g., '2023-10'
- `status` (ENUM) - 'Draft', 'Calculated', 'Locked', 'Approved'
- `total_net_pay` (DECIMAL)

### `payslips`
- `id` (PK, UUID)
- `run_id` (FK -> `payroll_runs.id`)
- `employee_id` (FK -> `employees.id`)
- `net_salary` (DECIMAL)
- `breakdown` (JSONB) - Detailed components

### `oh_incidents`
- `id` (PK, UUID)
- `employee_id` (FK -> `employees.id`)
- `type` (VARCHAR)
- `severity` (ENUM) - 'Low', 'Medium', 'High', 'Critical'
- `status` (ENUM) - 'Open', 'Under Investigation', 'Resolved', 'Closed'
- `confidential_notes` (TEXT) - Encrypted/Restricted access

## System

### `audit_logs`
- `id` (PK, UUID)
- `timestamp` (TIMESTAMP)
- `user_id` (FK -> `users.id`)
- `action` (VARCHAR)
- `entity_type` (VARCHAR)
- `entity_id` (UUID)
- `summary` (TEXT)
- `details` (JSONB)
