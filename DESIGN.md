# Remedix UI design contract

## Product intent

Remedix is a practical hospital workforce and operations workspace. Interfaces should feel calm, precise, legible, and trustworthy. Prioritize clear actions, meaningful data, and role-appropriate information over decoration or generic dashboard filler.

## Brand constraints

- Preserve the established Remedix palette and logo assets. Core colors include deep teal `#004D4D`, teal `#14B8A6`, off-white `#F7F7F5`, ink `#111827`, light grey `#DCE5EB`, and pale teal `#E7F5F3`.
- Do not introduce gradients, alternate theme palettes, decorative generic AI patterns, or new brand marks.
- Use the existing typography stack (Inter, Noto Sans Arabic, Space Grotesk) and existing UI components/tokens where possible.
- Keep the custom teal cursor, pointer affordances, and established Remedix pattern at its approved size and opacity.

## Layout and interaction

- Keep a consistent page header, restrained cards, clear section hierarchy, and responsive layouts.
- Attendance punches are explicit button actions; the UI records timestamps automatically. Never ask staff to type punch times.
- Leave requests use the established detailed drawer form, with dates, leave type, reason, optional contact and replacement fields.
- Reports are purpose-specific cards with a real print-to-PDF flow and only authorized, scoped fields. Empty data is shown honestly, not fabricated.
- Role dashboards and reports must reflect each role's actual duties and authorized records; never reuse a universal dashboard merely to fill space.
- Leave, attendance, and payroll routes keep their task-specific native screens for every authorized role. Scope tabs, self-service actions, review buttons, and department data to the active role instead of replacing review/view roles with a generic workspace.
- Any demo account tied to a personnel record can clock in/out for itself; punch timestamps are system-generated, and employee IDs—not account IDs—key personal attendance and leave views.
- Arabic screens use RTL layout and localized headings/columns. Keep numeric values and timestamps readable and avoid clipping charts or tables.
- Payroll actions must make workflow state explicit and preserve maker/checker separation. Do not present unimplemented imports, validations, or payments as completed.

## Quality bar

Favor useful examples grounded in the available demo records. Preserve service-side access checks, department/self scoping, and workflow validation. Keep changes focused and consistent with this contract; test both Arabic and English labels and responsive behavior.
