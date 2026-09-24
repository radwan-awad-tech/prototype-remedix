# Administration Module

## Module Purpose
The Administration module is the central control hub for the OryxStaff system. It provides high-level configuration, user management, and compliance monitoring through audit logs.

## Main Pages/Components
- **AdministrationView**: Main container with tabbed navigation for different admin functions.
- **System Settings**: Placeholder for global system configurations.
- **Users & Access**: Manage mock users and inspect the enforced role/module access matrix.
- **Organizational Structure**: Placeholder for defining the hospital's hierarchy.
- **Audit & Activity Log**: Implemented table showing a searchable record of administrative actions.

## Visible User Flows
1. **System Configuration**: Admin navigates through settings tabs to configure system-wide parameters (currently read-only placeholders).
2. **Audit Monitoring**: Admin reviews the activity log to monitor system changes and user actions.

## Major Actions
- **View Audit Logs**: Search and filter through system activity records.
- **Switch Admin Tabs**: Navigate between Settings, Users, Org Structure, and Audit Logs.

## Current Mock/Scaffolded Behavior
- **Data**: Audit logs are generated from `mockData.ts` within the module.
- **State**: Tab selection is managed by local component state (`AdministrationView`).
- **Placeholders**: System Settings and Org Structure remain scaffolded; Users & Access provides a functional demo RBAC matrix and role-scoped navigation.

## Known Limitations
- System settings are not yet editable or persistent.
- User management is mock-only and is not persisted to a backend.
- Organizational structure visualization is a placeholder.

## Likely Future Backend/API Needs
- `GET /api/admin/audit-logs`: Fetch audit logs with pagination and filters.
- `GET /api/admin/settings`: Fetch global system settings.
- `PUT /api/admin/settings`: Update global system settings.
- `GET /api/admin/users`: Fetch system users.
- `POST /api/admin/users`: Create a new system user.
- `PUT /api/admin/users/:id`: Update a system user.
- `GET /api/admin/roles`: Fetch role definitions and permissions.
