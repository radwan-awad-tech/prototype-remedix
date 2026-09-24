# Access policy verification — 2026-09-24

## Automated checks

- `npm run test:access`: 13 tests, all passing.
- `npm run lint`: TypeScript checking.
- `npm run build`: production bundle; Vite warns about the existing large single bundle.
- Local development endpoint `http://localhost:3000/`: HTTP 200.

The access tests cover unknown routes/roles, technical-admin isolation, missing/cross-department scope, employee-field projection, forged roster department, HR officer employment restrictions, confidential-health isolation despite a caller-supplied OHO role, self-service isolation, two-stage leave approval, payroll state transitions, maker/checker identity separation, retired unscoped endpoints, inactive/missing sessions, in-flight session changes and employee transfers.

## Manual review steps

1. On the demo login, inspect the explanation below each selected role. Any nonempty demo credentials work; this is not authentication.
2. Open **Role access guide / دليل الصلاحيات**. Select each role; the explanation changes without changing the active account.
3. Sign in as System Admin: no personnel, payroll or health links. Open Administration; its legacy account forms explicitly say they are previews.
4. Sign in as Department Head: only Nursing employee/roster data; no payroll. The linked employee is record 2, so their own request cannot be approved by this account.
5. Sign in as Employee: only record 3's schedules, payslips, credentials and finalized reviews. Submit a personal one-day leave or attendance-correction request.
6. Sign in as HR Officer: no final leave approval or payroll, and no employee create/terminate controls.
7. In HR/department Health: no raw medical records; the page explains that no released work recommendations are available. OHO retains the confidential health workspace.
8. In Payroll Officer, create an unused YYYY-MM period, calculate, inspect reconciliation details, then lock. Sign out without reloading the page and sign in as Accountant. Inspect the same run and approve. Payroll Officer cannot approve; Accountant cannot calculate. Recalculation/unlock of an approved run is denied.
9. Check both Arabic/RTL and English, narrow-screen table scrolling, chart readability, and empty states.

## Visual verification limitation

Browser automation could not initialize: `Unable to load browser request-header policy`, repeated on retry. Consequently, no claim of a completed browser walkthrough or screenshot QA is made. The local preview was requested in Codex for user review. Manual steps above remain to be checked visually.

## Deliberate prototype limits

All data is mock/client-side and mutations are in memory. Reloading loses changes and preparer identities; legacy payroll runs without an identified preparer must be recalculated before approval. Department-head performance/recruitment pages currently provide scoped read views, not complete editing workflows. Attendance correction approval does not yet synchronize an external attendance ledger. Account provisioning, released occupational-health advice and real banking are not implemented. Production requires trusted server authentication/authorization, durable storage, an audit trail and approved hospital delegation rules.
