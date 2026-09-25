import { employeeService } from './employeeService';
import { schedulingService } from './schedulingService';
import { leaveService } from './leaveService';
import { attendanceService } from './attendanceService';
import { qualificationService } from './qualificationService';
import { recruitmentService } from './recruitmentService';
import { performanceService } from './performanceService';
import { payrollService } from './payrollService';
import { doctorService } from './doctorService';
import { occupationalHealthService } from './occupationalHealthService';
import { getSessionActor } from '../modules/auth/session';
import { canAccessPath } from '../modules/auth/permissions';
import { HR_HEALTH_ROLES } from '../modules/auth/permissions';

export async function loadWorkspace(path: string): Promise<Record<string, any>[]> {
  const user = getSessionActor();
  if (!user || !canAccessPath(user.role, path)) throw new Error('Access denied');
  let response;
  switch (path) {
    case '/employees': response = await employeeService.listEmployees(); break;
    case '/doctors': response = await doctorService.listDoctors(); break;
    case '/scheduling': response = await schedulingService.listScheduleAssignments('', ''); break;
    case '/leaves': response = await leaveService.listLeaveRequests(); break;
    case '/attendance': response = await attendanceService.listAttendanceCorrections(); break;
    case '/licenses': response = await qualificationService.listQualifications(); break;
    case '/recruitment': response = await recruitmentService.listJobOpenings(); break;
    case '/performance': response = await performanceService.listReviews(); break;
    case '/payroll': response = user.role === 'Employee' ? await payrollService.listPayslips() : await payrollService.listRuns(); break;
    case '/health': response = HR_HEALTH_ROLES.includes(user.role) ? await occupationalHealthService.getAdministrationRecords() : await occupationalHealthService.getCheckups(user, 'OHO'); break;
    default: return [];
  }
  if (!response.success) throw new Error(response.message || 'Access denied');
  return response.data || [];
}
