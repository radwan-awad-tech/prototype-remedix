# Payroll Module

## Module Purpose
The Payroll module handles salary calculations, benefits management, and tax compliance for all hospital employees, integrating data from attendance and leaves.

## Main Pages/Components
- **Payroll Run**: Interface for processing monthly or bi-weekly payroll cycles.
- **Salary Structures**: Configuration of base pay, allowances, and deductions for different job roles.
- **Benefits Management**: Tracking of employee benefits such as health insurance, retirement plans, and bonuses.
- **Payslips**: Secure portal for employees to view and download their payment history.

## Visible User Flows
1. **Payroll Processing**: HR user initiates a payroll run, reviews the calculated values (based on attendance and leaves), and finalizes the cycle.
2. **Structure Assignment**: HR user assigns a salary structure to a new employee or updates an existing one during a promotion.
3. **Payslip Access**: Employee logs in and downloads their latest payslip for their records.

## Major Actions
- **Initiate Run**: Start the payroll calculation process for a specific period.
- **Approve Payroll**: Finalize the payroll cycle and trigger payslip generation.
- **Update Salary**: Modify base pay or allowances for an employee.
- **Download Payslip**: Generate a PDF version of a payment record.

## Current Mock/Scaffolded Behavior
- **Calculations**: Net pay is computed using mock formulas based on attendance and leave data.
- **Data**: Salary structures and benefits are generated from local mock data.
- **Payslips**: PDF generation is a UI-only simulation.

## Known Limitations
- Real-time integration with bank payment gateways is simulated.
- Complex tax calculations for multiple jurisdictions are simplified.
- Automated benefits enrollment based on eligibility rules is partially implemented.

## Likely Future Backend/API Needs
- `GET /api/payroll/runs`: List payroll cycles and their statuses.
- `POST /api/payroll/runs`: Initiate a new payroll processing cycle.
- `GET /api/payroll/salary-structures`: Fetch available salary templates.
- `GET /api/payroll/payslips`: Fetch payslip history for an employee.
- `GET /api/payroll/payslips/:id/download`: Securely download payslip PDF.
- `POST /api/payroll/benefits`: Manage employee benefit enrollments.
