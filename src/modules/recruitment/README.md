# Recruitment Module

## Module Purpose
The Recruitment module manages the end-to-end hiring process, from job requisition and posting to candidate tracking and final onboarding.

## Main Pages/Components
- **Job Openings**: Management of internal and external job postings.
- **Candidates Pipeline**: Kanban-style board for tracking candidates through various hiring stages (Applied, Interview, Offer, etc.).
- **Candidate Profile**: Detailed view of a candidate's resume, interview scores, and communication history.
- **Interview Scheduler**: Tool for coordinating interview times between candidates and hiring panels.

## Visible User Flows
1. **Job Posting**: HR user creates a new job opening, defines requirements, and publishes it to the job board.
2. **Candidate Tracking**: User reviews new applications in the Kanban board and drags candidates to the next stage (e.g., from "Applied" to "Interview").
3. **Interview Process**: User schedules an interview, records feedback from the panel, and updates the candidate's score.

## Major Actions
- **Create Job Opening**: Define a new vacancy in the organization.
- **Add Candidate**: Manually add a candidate or import from an external source.
- **Move Stage**: Update a candidate's position in the hiring pipeline.
- **Schedule Interview**: Coordinate meeting times for candidate evaluation.

## Current Mock/Scaffolded Behavior
- **Data**: Job openings and candidates are generated from local mock data.
- **Kanban Board**: Drag-and-drop interactions update the local state and provide immediate feedback.
- **Scoring**: Candidate evaluation scores are calculated based on mock interview data.

## Known Limitations
- Integration with external job boards (e.g., LinkedIn, Indeed) is simulated.
- Automated resume parsing (parsing PDF to data) is not implemented.
- Real-time calendar sync for interviewers is a placeholder.

## Likely Future Backend/API Needs
- `GET /api/recruitment/jobs`: List job openings with filters.
- `POST /api/recruitment/jobs`: Create a new job opening.
- `GET /api/recruitment/candidates`: Fetch candidates for a specific job or pipeline.
- `PATCH /api/recruitment/candidates/:id/stage`: Update a candidate's pipeline stage.
- `POST /api/recruitment/interviews`: Schedule a new interview.
- `GET /api/recruitment/stats`: Fetch recruitment funnel analytics.
