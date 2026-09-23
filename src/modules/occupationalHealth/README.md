# Occupational Health Module

## Module Purpose
The Occupational Health module manages sensitive medical records, health screenings, and workplace injury reports for hospital staff, ensuring compliance with health and safety regulations.

## Main Pages/Components
- **Health Screenings**: Tracking of mandatory medical checkups, vaccinations, and fitness-for-duty assessments.
- **Injury Reports**: Management of workplace incident reports and follow-up actions.
- **Medical Records**: Secure repository for employee-specific medical documentation.
- **Health Dashboard**: Aggregated view of organizational health compliance and incident trends.

## Visible User Flows
1. **Screening Management**: HR or medical staff schedules a health screening for an employee and records the results upon completion.
2. **Incident Reporting**: An employee or manager reports a workplace injury, triggering an investigation and follow-up workflow.
3. **Compliance Audit**: HR user reviews the health dashboard to identify departments with low vaccination or screening compliance.

## Major Actions
- **Record Screening**: Enter results for a medical assessment or vaccination.
- **Log Injury**: Create a new workplace incident report with details and attachments.
- **Update Follow-up**: Record progress on injury recovery or screening requirements.
- **View Compliance**: Analyze organizational health metrics.

## Current Mock/Scaffolded Behavior
- **Data**: Health records and injury reports are generated from local mock data.
- **Privacy**: Access to sensitive medical data is simulated using role-based UI restrictions.
- **Compliance**: Statistics are computed on the fly based on mock screening dates.

## Known Limitations
- Integration with external hospital medical systems is simulated.
- Real-time notifications for overdue screenings are placeholders.
- Advanced privacy controls (e.g., granular medical consent) are partially implemented.

## Likely Future Backend/API Needs
- `GET /api/oh/screenings`: List health screenings with filters.
- `POST /api/oh/screenings`: Record a new screening result.
- `GET /api/oh/injuries`: List workplace injury reports.
- `POST /api/oh/injuries`: Create a new injury report.
- `GET /api/oh/stats`: Fetch aggregated health and safety metrics.
- `GET /api/oh/documents/:id`: Securely retrieve sensitive medical documents.
