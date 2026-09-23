# Performance Module

## Module Purpose
The Performance module manages employee evaluations, goal setting, and competency assessments, providing a structured framework for professional growth and organizational alignment.

## Main Pages/Components
- **Performance Reviews**: Dashboard for managing annual, semi-annual, or probation reviews.
- **Goals & OKRs**: Tracking of individual and departmental objectives.
- **Competency Framework**: Definition of required skills and behaviors for different job roles.
- **Feedback Hub**: Interface for peer-to-peer and manager-to-employee feedback.

## Visible User Flows
1. **Review Cycle**: HR initiates a review cycle, employees complete self-assessments, and managers provide their evaluations.
2. **Goal Setting**: Employee and manager collaborate to define quarterly goals and track progress through the dashboard.
3. **Competency Assessment**: Manager evaluates an employee against the competency framework to identify skill gaps and training needs.

## Major Actions
- **Start Review**: Initiate a new performance evaluation for an employee.
- **Submit Self-Assessment**: Employee records their own performance reflections.
- **Set Goal**: Define a new objective with measurable targets.
- **Provide Feedback**: Record a feedback entry for a colleague or subordinate.

## Current Mock/Scaffolded Behavior
- **Data**: Performance reviews and goals are generated from local mock data.
- **Workflows**: Review stages (Self-Assessment -> Manager Review -> Finalized) are managed in local state.
- **Scoring**: Performance scores are calculated based on mock evaluation criteria.

## Known Limitations
- Automated reminders for overdue reviews are simulated.
- Integration with external learning management systems (LMS) is a placeholder.
- Advanced analytics for performance trends across departments are partially implemented.

## Likely Future Backend/API Needs
- `GET /api/performance/reviews`: List performance reviews with filters.
- `POST /api/performance/reviews`: Initiate a new review cycle.
- `GET /api/performance/goals`: Fetch goals for an employee or department.
- `POST /api/performance/goals`: Create or update a goal.
- `GET /api/performance/competencies`: Fetch competency frameworks by role.
- `POST /api/performance/feedback`: Submit a new feedback entry.
