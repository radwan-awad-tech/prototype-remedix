# Doctors Module

## Module Purpose
The Doctors module manages specialized records for medical staff, linking them to their employee profiles while maintaining clinical-specific data such as licenses, specialties, and availability.

## Main Pages/Components
- **Doctors List**: Searchable and filterable directory of all medical staff.
- **Doctor Profile**: Detailed view of a doctor's credentials, specialties, and schedule.
- **Add Doctor Wizard**: Multi-step process to onboard a new doctor by linking an existing employee record.

## Visible User Flows
1. **Clinical Onboarding**: HR identifies an employee as a doctor and completes the specialized onboarding wizard to add medical credentials.
2. **Credential Management**: User reviews a doctor's profile to check license validity and specialty information.
3. **Availability Tracking**: User monitors the current status (Available, On Leave, Busy) of medical staff.

## Major Actions
- **Link Employee**: Associate an existing employee record with a new doctor profile.
- **Update Credentials**: Edit medical license numbers and expiry dates.
- **Manage Specialties**: Assign or remove clinical specialties for a doctor.
- **Toggle Availability**: Manually update a doctor's current operational status.

## Current Mock/Scaffolded Behavior
- **Data**: Doctor records are generated from local mock data and linked to the mock employee list.
- **License Logic**: Status (Valid/Expired) is computed on the fly based on mock dates.
- **Persistence**: Changes to doctor profiles are stored in local state and reset on page reload.

## Known Limitations
- Integration with external medical licensing boards is simulated.
- Real-time scheduling conflicts are not fully validated.
- Document uploads for credentials are UI-only placeholders.

## Likely Future Backend/API Needs
- `GET /api/doctors`: List all doctors with filters.
- `GET /api/doctors/:id`: Fetch detailed doctor profile.
- `POST /api/doctors`: Create a new doctor record.
- `PUT /api/doctors/:id`: Update doctor credentials and specialties.
- `GET /api/specialties`: Fetch list of available clinical specialties.
- `POST /api/doctors/:id/documents`: Upload and link medical credentials.

