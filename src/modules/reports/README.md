# Reports Module

## Module Purpose
The Reports module provides comprehensive data analytics and reporting capabilities for the hospital. It allows authorized users to browse a catalog of standard reports, build custom reports using a step-based wizard, and maintain an audit history of generated reports.

## Main Pages/Components
- **Report Catalog**: Grid of available report templates categorized by function (Executive, Operational, etc.).
- **Report Builder**: Step-by-step wizard for configuring and generating reports with specific filters.
- **Generated Reports History**: Table tracking previously generated reports with metadata and download options.

## Visible User Flows
1. **Report Discovery**: User browses the catalog, searches for a specific report, and selects a template.
2. **Custom Generation**: User follows the builder wizard to select a report type, apply filters (Department, Date Range), and preview data before generating.
3. **History Audit**: User reviews the history log to see who generated what reports and when, or to re-download a previous run.

## Major Actions
- **Select Template**: Choose a pre-defined report structure from the catalog.
- **Configure Filters**: Apply granular filters to scope the report data.
- **Preview Data**: View a sample of the report results before final generation.
- **Generate & Export**: Process the report and export it to PDF, Excel, or CSV formats.

## Current Mock/Scaffolded Behavior
- **Data**: Report templates and history records are generated from local mock data.
- **Generation**: The "Generate" action simulates a processing state before adding a new entry to the history table.
- **Exports**: Export actions trigger a success toast but do not currently generate real files.

## Known Limitations
- Real-time data aggregation across all modules is simulated.
- PDF/Excel generation is a UI-only simulation.
- Custom report building logic (adding/removing columns) is not fully implemented.

## Likely Future Backend/API Needs
- `GET /api/reports/templates`: Fetch available report templates based on user role.
- `GET /api/reports/history`: Fetch the audit log of generated reports.
- `POST /api/reports/generate`: Trigger server-side report generation with filter parameters.
- `GET /api/reports/download/:historyId`: Securely download a generated report file.
