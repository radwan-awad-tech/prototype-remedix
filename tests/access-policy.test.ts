import assert from 'node:assert/strict';
import { test, afterEach } from 'node:test';
import { canAccessPath, ROLE_ORDER, shouldUseScopedWorkspace, withinScope } from '../src/modules/auth/permissions';
import { demoIdentity, setSessionActor } from '../src/modules/auth/session';
import { employeeService } from '../src/services/employeeService';
import { schedulingService } from '../src/services/schedulingService';
import { leaveService } from '../src/services/leaveService';
import { payrollService } from '../src/services/payrollService';
import { occupationalHealthService } from '../src/services/occupationalHealthService';
import { performanceService } from '../src/services/performanceService';
import { dashboardService } from '../src/services/dashboardService';
import { attendanceService } from '../src/services/attendanceService';
import { reportService } from '../src/services/reportService';
import { adminService } from '../src/services/adminService';
import { RoleType } from '../src/types';
import { MOCK_ATTENDANCE } from '../src/mockData';

function actor(role: RoleType, extra = {}) { const u = {...demoIdentity('Test', role), ...extra}; setSessionActor(u); return u; }
afterEach(() => setSessionActor(null));

test('staff demo identities can retrieve only their own punch state', async () => {
  const storage = new Map<string, string>();
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => storage.set(key, value),
    removeItem: (key: string) => storage.delete(key),
  }});
  for (const role of ['Senior Manager','HR Manager','HR Officer','Department Head','Payroll Officer','Employee'] as RoleType[]) {
    const u = actor(role);
    assert.ok(u.employeeId, `${role} demo account should be associated with a staff record`);
    assert.equal((await attendanceService.getTodayPunch()).success, true, `${role} can retrieve own punch status`);
  }
});

test('all eight roles have a guide, unknown roles and routes fail closed', () => {
  for (const role of ROLE_ORDER) { assert.ok(canAccessPath(role, '/access')); assert.ok(canAccessPath(role, '/')); assert.equal(canAccessPath(role, '/unlisted'), false); }
  assert.equal(canAccessPath('Employee','/reports'),true);
  assert.equal(canAccessPath('Occupational Health Officer','/reports'),true);
  assert.equal(canAccessPath('System Admin','/reports'),false);
  assert.equal(canAccessPath('unknown' as RoleType, '/admin'), false);
  assert.throws(() => demoIdentity('Test', 'unknown' as RoleType));
});
test('authorized staff roles use role-aware leave, attendance and payroll screens', () => {
  for (const role of ['Senior Manager','HR Manager','HR Officer','Department Head','Payroll Officer','Accountant','Employee'] as RoleType[]) {
    for (const path of ['/leaves','/attendance']) {
      if (canAccessPath(role, path)) assert.equal(shouldUseScopedWorkspace(role, path), false, `${role} ${path}`);
    }
    if (canAccessPath(role, '/payroll')) assert.equal(shouldUseScopedWorkspace(role, '/payroll'), false, `${role} payroll`);
  }
  assert.equal(shouldUseScopedWorkspace('Department Head','/employees'), true);
  assert.equal(shouldUseScopedWorkspace('HR Manager','/employees'), false);
});
test('technical administrator has no HR, salary or health routes/data', async () => {
  const u = actor('System Admin');
  for (const p of ['/employees','/health','/payroll','/leaves']) assert.equal(canAccessPath(u.role,p),false);
  assert.equal((await employeeService.listEmployees()).status,403);
  assert.equal((await payrollService.listRuns()).status,403);
  assert.deepEqual((await occupationalHealthService.getCheckups(u,'OHO')).data,[]);
});
test('department scope refuses missing department and cross-department queries', async () => {
  const u = actor('Department Head');
  assert.equal(withinScope({...u,department:undefined},'/employees',{department:'Nursing'}),false);
  const rows = (await employeeService.listEmployees()).data;
  assert.ok(rows.length); assert.ok(rows.every(r => r.department === 'Nursing'));
  assert.ok(rows.every(r => !('nationalId' in r) && !('address' in r) && !('phone' in r)));
  assert.deepEqual((await employeeService.listEmployees('Radiology')).data,[]);
  assert.equal((await employeeService.getEmployee('3')).data,null);
});
test('department head cannot create a roster entry for another department', async () => {
  actor('Department Head');
  const response = await schedulingService.createScheduleAssignment({employeeId:'3',department:'Nursing',date:'2026-09-24'});
  assert.equal(response.status,403); // canonical employee department beats forged input
});
test('HR officer cannot change employment status or create employees', async () => {
  actor('HR Officer');
  assert.equal((await employeeService.updateEmployee('2',{status:'Inactive'})).status,403);
  assert.equal((await employeeService.createEmployee({firstName:'Unauthorized'})).status,403);
  assert.equal((await employeeService.updateEmployee('2',{phone:'555-0100'})).success,true);
});
test('medical data ignores caller-supplied role and is not returned to HR or managers', async () => {
  for (const role of ['HR Manager','HR Officer','Department Head'] as RoleType[]) {
    const u = actor(role);
    assert.deepEqual((await occupationalHealthService.getIncidents({...u,role:'Occupational Health Officer'},'OHO')).data,[]);
    assert.equal((await occupationalHealthService.addVaccination({employeeId:'1'})).status,403);
  }
  const u = actor('Occupational Health Officer');
  assert.ok((await occupationalHealthService.getCheckups(u,'OHO')).data.length > 0);
  const pending = occupationalHealthService.getCheckups(u,'OHO');
  actor('HR Officer');
  assert.equal((await pending).status,403);
});
test('employee sees only own records, cannot query another payslip or submit for another employee', async () => {
  const u = actor('Employee');
  const leaves = (await leaveService.listLeaveRequests()).data;
  assert.ok(leaves.every(r => r.employeeId === u.employeeId));
  const slips = (await payrollService.listPayslips()).data;
  assert.ok(slips.every(r => r.employeeId === u.employeeId));
  assert.deepEqual((await payrollService.listPayslips({employeeId:'1'})).data,[]);
  assert.equal((await payrollService.listRuns()).status,403);
  assert.equal((await leaveService.createLeaveRequest({employeeId:'1',department:'Radiology'})).status,403);
  const reviews = (await performanceService.listReviews()).data;
  assert.ok(reviews.every(r => r.employeeId === u.employeeId && r.status === 'Finalized'));
});
test('leave requires independent manager recommendation then HR final approval', async () => {
  const u = actor('Employee');
  const created = await leaveService.createLeaveRequest({employeeId:u.employeeId,employeeName:'Test',department:'Radiology',leaveType:'Annual',startDate:'2026-09-25',endDate:'2026-09-25',duration:1,reason:'Personal'});
  assert.equal(created.success,true); const id=created.data.id;
  assert.equal((await leaveService.updateLeaveStatus(id,'Approved')).status,403);
  actor('HR Manager'); assert.equal((await leaveService.updateLeaveStatus(id,'Approved')).status,403);
  actor('Department Head'); assert.equal((await leaveService.updateLeaveStatus(id,'Approved')).status,403);
  actor('Department Head',{department:'Radiology',employeeId:'3'}); assert.equal((await leaveService.updateLeaveStatus(id,'Approved')).status,403);
  actor('Department Head',{department:'Radiology',employeeId:'another-manager'}); assert.equal((await leaveService.updateLeaveStatus(id,'Approved')).success,true);
  let row=(await leaveService.listLeaveRequests()).data.find(r=>r.id===id)!;
  assert.equal(row.status,'Pending'); assert.equal(row.stage,'HR');
  actor('HR Officer'); assert.equal((await leaveService.updateLeaveStatus(id,'Approved')).status,403);
  actor('HR Manager'); assert.equal((await leaveService.updateLeaveStatus(id,'Approved')).success,true);
  row=(await leaveService.listLeaveRequests()).data.find(r=>r.id===id)!;
  assert.equal(row.status,'Approved'); assert.equal(row.stage,'Completed');
  assert.equal((await leaveService.updateLeaveStatus(id,'Approved')).status,403);
});
test('payroll requires valid transitions and a different delegated reviewer', async () => {
  const preparer = actor('Payroll Officer');
  const result = await payrollService.createRun('2026-09'); assert.equal(result.success,true); const id=result.data.id;
  const testAttendance = ['1','2'].map((employeeId, index) => ({ id:`test-payroll-${employeeId}`, employeeId, employeeNo:`EMP-00${employeeId}`, employeeName:`Test ${employeeId}`, department:index ? 'Nursing' : 'Human Resources', date:'2026-09-10', checkIn:'08:00', checkOut:'16:00', totalHours:8, lateMinutes:0, overtimeHours:0, status:'OK' as const, source:'Device' as const, isCorrected:false }));
  MOCK_ATTENDANCE.push(...testAttendance);
  assert.equal((await payrollService.lockRun(id)).status,403);
  assert.equal((await payrollService.approveRun(id)).status,403);
  assert.equal((await payrollService.calculateRun(id)).success,true);
  actor('Senior Manager'); assert.equal((await payrollService.calculateRun(id)).status,403);
  actor('Payroll Officer',{id:preparer.id});
  assert.equal((await payrollService.lockRun(id)).success,true);
  assert.equal((await payrollService.calculateRun(id)).status,403);
  actor('Accountant',{id:preparer.id}); assert.equal((await payrollService.approveRun(id)).status,403);
  actor('Accountant'); assert.equal((await payrollService.createRun('2026-10')).status,403);
  assert.equal((await payrollService.calculateRun(id)).status,403);
  assert.equal((await payrollService.approveRun(id)).success,true);
  assert.equal((await payrollService.approveRun(id)).status,403);
  actor('Payroll Officer'); assert.equal((await payrollService.unlockRun(id)).status,403);
  assert.equal((await payrollService.calculateRun(id)).status,403);
  MOCK_ATTENDANCE.splice(0, MOCK_ATTENDANCE.length, ...MOCK_ATTENDANCE.filter(row => !row.id.startsWith('test-payroll-')));
});
test('old global reports and approval endpoints cannot bypass scoped workflow', async () => {
  actor('HR Manager');
  assert.equal((await dashboardService.listApprovals()).status,403);
  assert.equal((await reportService.listHistory()).status,403);
  await assert.rejects(() => adminService.getUsers());
});
test('no session and inactive sessions cannot access services', async () => {
  setSessionActor(null); assert.equal((await employeeService.listEmployees()).status,403);
  actor('HR Manager',{status:'inactive'}); assert.equal((await employeeService.listEmployees()).status,403);
  const u = actor('Occupational Health Officer',{status:'inactive'});
  assert.deepEqual((await occupationalHealthService.getCheckups(u,'OHO')).data,[]);
  assert.equal((await occupationalHealthService.addVaccination({employeeId:'1'})).status,403);
});
test('a pending response cannot cross a session or role switch', async () => {
  const u = actor('HR Manager');
  const pending = employeeService.listEmployees();
  actor('System Admin',{id:u.id});
  assert.equal((await pending).status,403);
});
test('department access follows the current personnel directory after a transfer', async () => {
  actor('HR Manager');
  assert.equal((await employeeService.updateEmployee('2',{department:'Radiology'})).success,true);
  actor('Department Head');
  assert.ok((await employeeService.listEmployees()).data.every(e => e.id !== '2'));
  assert.ok((await leaveService.listLeaveRequests()).data.every(r => r.employeeId !== '2'));
  actor('HR Manager'); await employeeService.updateEmployee('2',{department:'Nursing'});
});
