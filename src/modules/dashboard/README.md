# Dashboard Module

## Module Purpose
The Dashboard module provides a centralized operational overview for HR staff and managers, highlighting key metrics, urgent alerts, and pending approval tasks.

## Main Pages/Components
- **DashboardOverview**: Visual representation of KPIs (Headcount, Attendance, etc.) using charts and summary cards.
- **AlertsCenter**: Notification hub for critical events like expiring licenses or staffing shortages.
- **ApprovalsInbox**: Consolidated view for reviewing and acting on requests from other modules (Leaves, Attendance, etc.).

## Visible User Flows
1. **Daily Monitoring**: User logs in and reviews the dashboard to get a quick snapshot of organizational health.
2. **Alert Resolution**: User identifies a critical alert (e.g., license expiry) and navigates to the relevant module to resolve it.
3. **Task Approval**: Manager reviews pending requests in the inbox and approves or rejects them directly from the dashboard.

## Major Actions
- **View KPIs**: Observe real-time (simulated) trends in HR data.
- **Act on Approvals**: Approve or reject pending requests with a single click.
- **Dismiss Alerts**: Mark notifications as seen to clear the alerts list.

## Current Mock/Scaffolded Behavior
- **KPI Data**: Statistics are aggregated from mock data across the application.
- **Charts**: Recharts visualizations use static mock datasets.
- **Approvals**: The inbox pulls pending items from the global mock state.

## Known Limitations
- Real-time data updates from other modules are simulated.
- Deep-linking from alerts to specific record details is partially implemented.
- Customization of dashboard widgets is not currently supported.

## Likely Future Backend/API Needs
- `GET /api/dashboard/stats`: Fetch aggregated KPI data.
- `GET /api/dashboard/charts`: Fetch time-series data for visualizations.
- `GET /api/dashboard/alerts`: Fetch active system alerts.
- `GET /api/dashboard/approvals`: Fetch consolidated pending requests.
- `POST /api/dashboard/approvals/:id/approve`: Approve a request.
- `POST /api/dashboard/approvals/:id/reject`: Reject a request.

