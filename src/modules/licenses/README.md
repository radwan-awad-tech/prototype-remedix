# Licenses & Documentation Module

## Module Purpose
The Licenses & Documentation module manages professional qualifications (licenses/certifications) and provides a unified document repository for the entire HR system.

## Main Pages/Components
- **Professional Licenses**: Tracking and renewal of medical and nursing practice licenses.
- **Certifications & Training**: Management of specialized certifications like ACLS and BLS.
- **Verification Queue**: HR workflow for verifying uploaded documents against physical or primary source records.
- **Document Center**: Unified browser for all system documents, including employee files, payroll records, and recruitment data.

## Visible User Flows
1. **License Renewal**: Employee uploads a new license document, which enters the verification queue for HR review.
2. **Document Verification**: HR user reviews the verification queue, checks the uploaded document preview, and marks it as verified or rejected.
3. **Unified Search**: HR user uses the Document Center to find all documents related to a specific employee or department.

## Major Actions
- **Upload Document**: Add a new license, certification, or general document to the system.
- **Verify/Reject**: HR action to validate an uploaded qualification.
- **Filter Documents**: Search the unified repository by entity type, department, or date.

## Current Mock/Scaffolded Behavior
- **Data**: Qualifications and documents are generated from local mock data.
- **Verification**: The verification workflow updates local state and provides immediate UI feedback.
- **Document Center**: The unified view aggregates mock records from various modules.

## Known Limitations
- Integration with external primary source verification (PSV) services is simulated.
- Real-time expiry notifications are currently UI-only placeholders.
- OCR for automatic document data extraction is not implemented.

## Likely Future Backend/API Needs
- `GET /api/qualifications`: List qualifications with advanced filters.
- `POST /api/qualifications/verify/:id`: Mark a qualification as verified.
- `POST /api/qualifications/reject/:id`: Reject a qualification with a reason.
- `GET /api/documents`: Unified document search and retrieval.
- `POST /api/documents/upload`: Generic upload with entity linking.
- `DELETE /api/documents/:id`: Soft delete document (HR only).
