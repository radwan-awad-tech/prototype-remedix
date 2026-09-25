import { PAYROLL_PREPARERS, PAYROLL_APPROVERS, FULL_HEALTH_ROLES, HR_HEALTH_ROLES } from '../modules/auth/permissions';
import React, { useEffect, useState } from 'react';
import { LocalizedBarChart } from '../components/ui/LocalizedBarChart';
import { ShieldCheck, RefreshCw } from 'lucide-react';
import { useAuth } from '../modules/auth/AuthContext';
import { getModuleAccess, ROLE_ACCESS_POLICIES, ROLE_PROFILES } from '../modules/auth/permissions';
import { useTranslation } from '../hooks/useTranslation';
import { useNavigation } from '../context/NavigationContext';
import { loadWorkspace } from '../services/workspaceService';
import { MODULE_NAMES } from './RoleAccess';
import { leaveService } from '../services/leaveService';
import { attendanceService } from '../services/attendanceService';
import { payrollService } from '../services/payrollService';

const columns: Record<string, [string,string,string][]> = {
  '/employees': [['firstName','الاسم','First name'],['lastName','الكنية','Last name'],['department','القسم','Department'],['position','الوظيفة','Position'],['status','الحالة','Status']],
  '/doctors': [['doctorCode','رمز الطبيب','Doctor code'],['primarySpecialty','الاختصاص','Specialty'],['status','الحالة','Status']],
  '/scheduling': [['employeeName','الموظف','Employee'],['department','القسم','Department'],['date','التاريخ','Date'],['shiftTypeName','المناوبة','Shift'],['status','الحالة','Status']],
  '/leaves': [['employeeName','الموظف','Employee'],['department','القسم','Department'],['startDate','من','From'],['endDate','إلى','To'],['duration','الأيام','Days'],['stage','مرحلة الاعتماد','Approval stage'],['status','الحالة','Status']],
  '/attendance': [['employeeName','الموظف','Employee'],['department','القسم','Department'],['date','التاريخ','Date'],['requestedIn','الدخول المطلوب','Requested in'],['requestedOut','الخروج المطلوب','Requested out'],['stage','المرحلة','Stage'],['status','الحالة','Status']],
  '/licenses': [['employeeName','الموظف','Employee'],['name','الترخيص','Credential'],['expiryDate','الانتهاء','Expiry'],['verificationStatus','التحقق','Verification'],['status','الحالة','Status']],
  '/recruitment': [['title','الوظيفة','Position'],['department','القسم','Department'],['vacancies','الشواغر','Vacancies'],['status','الحالة','Status']],
  '/performance': [['employeeName','الموظف','Employee'],['cycleName','الدورة','Cycle'],['overallScore','التقييم','Score'],['status','الحالة','Status']],
  '/payroll': [['period','الفترة','Period'],['employeeCount','الموظفون','Employees'],['totalNet','صافي الدورة','Run net'],['netSalary','صافي راتبي','My net pay'],['status','الحالة','Status']],
};
export const ScopedWorkspace: React.FC<{ path: string }> = ({ path }) => {
  const { user } = useAuth();
  const { language } = useTranslation();
  const { navigate } = useNavigation();
  const ar = language === 'ar';
  const [rows, setRows] = useState<Record<string, any>[]>([]);
  const [reviewRows, setReviewRows] = useState<Record<string, any>[]>([]);
  const [reviewId, setReviewId] = useState('');
  const [focusRows, setFocusRows] = useState<Record<string, any>[]>([]);
  const [focusPath, setFocusPath] = useState('');
  const [counts, setCounts] = useState<{name: string; count: number; path: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [version, setVersion] = useState(0);
  const overview = path === '/' || path === '/reports';
  const access = getModuleAccess(user!.role, path);
  const profile = ROLE_PROFILES[user!.role];
  const say = (a: string, e: string) => ar ? a : e;
  useEffect(() => {
    let cancelled = false;
    setRows([]); setCounts([]); setFocusRows([]); setReviewRows([]); setReviewId(''); setLoading(true); setMessage('');
    const paths = ROLE_ACCESS_POLICIES[user!.role].modules.map(m => m.path).filter(p => !!columns[p] || (p === '/health' && (FULL_HEALTH_ROLES.includes(user!.role) || HR_HEALTH_ROLES.includes(user!.role))));
    (overview ? Promise.all(paths.map(async p => ({path: p, name: MODULE_NAMES[p][ar ? 0 : 1], records: await loadWorkspace(p)}))).then(data => {
      if (cancelled) return;
      setCounts(data.map(d => ({ path:d.path, name:d.name, count:d.records.length })));
      const preferred = ['Payroll Officer','Accountant','Employee'].includes(user!.role) ? '/payroll' : user!.role === 'Occupational Health Officer' ? '/health' : '/leaves';
      const focus = data.find(d => d.path === preferred);
      setFocusPath(preferred); setFocusRows(focus?.records || []);
    }) : loadWorkspace(path).then(data => { if (!cancelled) setRows(data); }))
      .catch(() => { if (!cancelled) setMessage(say('تعذر تحميل البيانات المسموح بها.', 'Could not load authorized records.')); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [path, user?.id, ar, version]);
  async function perform(action: () => Promise<any>) {
    setBusy(true); setMessage('');
    try { const response = await action(); if (!response.success) throw new Error(); setVersion(v => v + 1); }
    catch { setMessage(say('لم يتم الحفظ: تحقق من الصلاحية ومرحلة الطلب. لا يمكن اعتماد طلبك أو تجاوز المراجعة.', 'Not saved: check authorization and workflow stage. Self-approval and skipped review are blocked.')); }
    finally { setBusy(false); }
  }
  const canReview = (row: Record<string, any>) => ['Senior Manager','HR Manager','Department Head'].includes(user!.role) && row.status === 'Pending' && row.employeeId !== user!.employeeId && row.stage === (user!.role === 'Department Head' ? 'Manager' : 'HR');
  const stateCounts = Object.entries(rows.reduce((a, row) => { const key = row.status || 'Issued'; a[key] = (a[key] || 0) + 1; return a; }, {} as Record<string,number>)).map(([name,count]) => ({name,count}));
  const focusChart = focusPath === '/payroll' ? focusRows.map(r => ({name:r.period, value:r.totalNet ?? r.netSalary ?? 0})) : Object.entries(focusRows.reduce((a,r) => { const label = r.status === 'Pending' ? `${r.status} / ${r.stage}` : r.status; a[label] = (a[label] || 0) + 1; return a; }, {} as Record<string,number>)).map(([name,value]) => ({name,value}));
  const payrollCols = user!.role === 'Employee' ? columns['/payroll'].filter(c => ['period','netSalary'].includes(c[0])) : columns['/payroll'].filter(c => c[0] !== 'netSalary');
  const visibleColumns = path === '/payroll' ? payrollCols : columns[path] || [];
  return <section className="space-y-6">
    <header className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-sm font-semibold text-brand-deep-teal">{ar ? profile.ar : user!.role} {user!.department && ` / ${user!.department}`}</p><h1 className="text-3xl font-bold mt-2">{MODULE_NAMES[path]?.[ar ? 0 : 1]}</h1><p className="text-text-secondary mt-3 max-w-3xl leading-7">{ar ? profile.tasks : profile.en}</p></div><button onClick={() => setVersion(v => v+1)} disabled={loading || busy} className="p-3 border rounded-xl bg-white" aria-label={say('تحديث','Refresh')}><RefreshCw size={20}/></button></header>
    <div className="flex gap-3 p-4 bg-white border border-border-base rounded-xl"><ShieldCheck className="text-brand-deep-teal shrink-0" size={22}/><div className="text-sm leading-7"><p>{ar ? profile.limits : profile.en}</p><button onClick={() => navigate('/access')} className="text-brand-deep-teal underline">{say('استعرض دليل الصلاحيات','Explore role access')}</button></div></div>
    <p className="text-xs text-text-secondary">{say('بيانات تجريبية — النطاق مفروض على خدمات العرض والإجراءات؛ ليس نظام حماية إنتاجياً.', 'Demo data — mock services enforce view/action scope; this is not production security.')} {access?.scope === 'department' ? say('قسمك فقط.','Your department only.') : access?.scope === 'self' ? say('سجلاتك فقط.','Your own records only.') : ''}</p>
    {message && <p role="alert" className="p-4 rounded-xl bg-amber-50 text-amber-900">{message}</p>}
    {loading ? <p role="status">{say('جارٍ تحميل السجلات المسموح بها…','Loading authorized records…')}</p> : overview ? <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{counts.map(c => <button onClick={() => navigate(c.path)} key={c.path} className="card-base p-5 text-start"><p className="text-sm text-text-secondary">{c.name}</p><p className="text-3xl font-bold text-brand-deep-teal mt-3">{c.count}</p><p className="text-xs mt-2">{say('سجلات متاحة لدورك','Records available to your role')}</p></button>)}</div>
      {focusChart.length > 0 && <div className="card-base p-6"><h2 className="font-bold mb-4">{focusPath === '/payroll' ? say('صافي الرواتب حسب الفترة — أرقام تجريبية','Net payroll by period — demo amounts') : focusPath === '/health' ? say('متابعة مواعيد الفحوص حسب الحالة','Health check appointments by status') : say('الإجازات حسب الحالة ومرحلة الموافقة','Leave by status and approval stage')}</h2><LocalizedBarChart data={focusChart} dataKey="value" language={language} amount={focusPath === '/payroll'} metricLabel={focusPath === '/payroll' ? say('الصافي', 'Net amount') : say('عدد السجلات', 'Records')} color="#0E7875" /></div>}
      {counts.length > 0 ? <div className="card-base p-6"><h2 className="font-bold mb-5">{say('حجم السجلات ضمن نطاقك — ليست مؤشرات سريرية','Record volume within your scope — not clinical metrics')}</h2><LocalizedBarChart data={counts} dataKey="count" language={language} metricLabel={say('عدد السجلات', 'Records')} /></div> : <div className="card-base p-6"><p>{say('حساب تقني: لا يتم تحميل بيانات موظفين أو رواتب أو ملفات صحية.','Technical account: no employee, salary or health records are loaded.')}</p><button onClick={() => navigate('/admin')} className="mt-4 bg-brand-deep-teal text-white px-5 py-3 rounded-xl">{say('إدارة النظام','Administration')}</button></div>}
    </> : path === '/health' ? <article className="card-base p-8"><h2 className="font-bold text-xl">{say('توصيات العمل المصرّح بمشاركتها','Released work recommendations')}</h2><p className="mt-4 leading-8">{say('لا توجد توصيات معتمدة للمشاركة في البيانات الحالية. لا نعرض نتائج الفحوص أو الإصابات أو ملاحظات الطبيب، ولا نستنتج اللياقة للعمل من حالة موعد الفحص.','No released recommendations exist in the current data. Test results, incidents and clinical notes are not shared, and fitness is never inferred from appointment status.')}</p></article> : <>
      {rows.length > 0 && <div className="card-base p-5"><h2 className="font-semibold mb-3">{say('توزيع حالات السجلات المتاحة','Status of accessible records')}</h2><LocalizedBarChart data={stateCounts} dataKey="count" language={language} metricLabel={say('عدد السجلات', 'Records')} color="#0E7875" /></div>}
      {path === '/payroll' && PAYROLL_PREPARERS.includes(user!.role) && <form className="card-base p-4 flex gap-3 flex-wrap" onSubmit={e => { e.preventDefault(); const f = new FormData(e.currentTarget); void perform(() => payrollService.createRun(String(f.get('period')))); }}><label>{say('دورة جديدة','New run')} <input type="month" name="period" required className="border rounded-lg p-2 mx-2"/></label><button disabled={busy} className="bg-brand-deep-teal text-white rounded-lg px-5 py-2">{say('إنشاء','Create')}</button></form>}
      <div className="card-base overflow-auto"><table className="w-full text-sm"><thead className="bg-bg-main"><tr>{visibleColumns.map(c => <th key={c[0]} className="text-start px-4 py-3 whitespace-nowrap">{c[ar ? 1 : 2]}</th>)}<th className="text-start px-4 py-3">{say('الإجراءات','Actions')}</th></tr></thead><tbody>{rows.map(row => <tr key={row.id} className="border-t border-border-base">{visibleColumns.map(c => <td key={c[0]} className="p-4">{String(row[c[0]] ?? '—')}</td>)}<td className="p-3"><div className="flex flex-wrap gap-2">
      {['/leaves','/attendance'].includes(path) && canReview(row) && <><button disabled={busy} className="border border-brand-deep-teal text-brand-deep-teal px-3 py-2 rounded-lg" onClick={() => void perform(() => path === '/leaves' ? leaveService.updateLeaveStatus(row.id,'Approved') : attendanceService.approveCorrection(row.id))}>{user!.role === 'Department Head' ? say('توصية للموارد','Recommend to HR') : say('اعتماد نهائي','Final approval')}</button><button disabled={busy} className="border px-3 py-2 rounded-lg" onClick={() => { const reason = window.prompt(say('سبب الرفض','Rejection reason')); if (reason?.trim()) void perform(() => path === '/leaves' ? leaveService.updateLeaveStatus(row.id,'Rejected',reason) : attendanceService.rejectCorrection(row.id,reason)); }}>{say('رفض','Reject')}</button></>}
      {path === '/payroll' && PAYROLL_PREPARERS.includes(user!.role) && ['Draft','Calculated','Locked'].includes(row.status) && <button disabled={busy} className="border rounded-lg px-3 py-2" onClick={() => void perform(() => row.status === 'Draft' ? payrollService.calculateRun(row.id) : row.status === 'Calculated' ? payrollService.lockRun(row.id) : payrollService.unlockRun(row.id))}>{row.status === 'Draft' ? say('حساب','Calculate') : row.status === 'Calculated' ? say('قفل للمراجعة','Lock for review') : say('إعادة للتحضير','Return to preparation')}</button>}
      {path === '/payroll' && PAYROLL_PREPARERS.includes(user!.role) && row.status === 'Calculated' && <button disabled={busy} className="border rounded-lg px-3 py-2" onClick={() => void perform(() => payrollService.calculateRun(row.id))}>{say('إعادة الحساب','Recalculate')}</button>}
      {path === '/payroll' && user!.role !== 'Employee' && <button disabled={busy} className="border rounded-lg px-3 py-2" onClick={async () => { setBusy(true); try { const r = await payrollService.listReviews(row.id); if (!r.success) throw new Error(); setReviewRows(r.data); setReviewId(row.id); } catch { setMessage(say('تعذر تحميل التفاصيل','Could not load details')); } finally { setBusy(false); } }}>{say('تفاصيل المطابقة','Reconciliation details')}</button>}
      {path === '/payroll' && PAYROLL_APPROVERS.includes(user!.role) && row.status === 'Locked' && <button disabled={busy} className="border rounded-lg px-3 py-2" onClick={() => { if (window.confirm(say('اعتماد الدورة بعد المراجعة؟ هذا ليس أمراً بالدفع.','Approve after review? This is not a payment instruction.'))) void perform(() => payrollService.approveRun(row.id)); }}>{say('اعتماد مالي','Approve payroll')}</button>}
      </div></td></tr>)}</tbody></table>{!rows.length && <p className="p-8 text-center text-text-secondary">{say('لا سجلات متاحة ضمن نطاقك.','No records available within your scope.')}</p>}</div>
      {path === '/payroll' && PAYROLL_APPROVERS.includes(user!.role) && <p className="text-sm text-text-secondary">{say('الدورات القديمة دون هوية مُعدّ لا يمكن اعتمادها؛ أعد حساب دورة غير معتمدة بحساب مسؤول الرواتب لتوثيق المُعدّ أولاً.','Legacy runs without a preparer identity cannot be approved. Recalculate an unapproved run as Payroll Officer to record its preparer first.')}</p>}
      {reviewId && <section className="card-base p-5 overflow-auto"><h2 className="font-bold mb-4">{say('تفاصيل المطابقة','Reconciliation details')} — {reviewId}</h2><table className="w-full text-sm"><thead><tr>{(ar ? ['الموظف','القسم','الأساسي','البدلات','الاستقطاعات','الصافي'] : ['Employee','Department','Base','Allowances','Deductions','Net']).map(c => <th className="text-start p-3" key={c}>{c}</th>)}</tr></thead><tbody>{reviewRows.map(r => <tr key={r.id} className="border-t">{['employeeName','department','baseSalary','allowances','deductions','netSalary'].map(k => <td className="p-3" key={k}>{r[k]}</td>)}</tr>)}</tbody></table>{!reviewRows.length && <p>{say('لا بنود في بيانات هذه الدورة؛ يلزم تحضيرها قبل المراجعة.','No line items in this run; prepare it before review.')}</p>}</section>}
      {['/leaves','/attendance'].includes(path) && user!.employeeId && <form className="card-base p-5 space-y-4" onSubmit={e => { e.preventDefault(); const f = new FormData(e.currentTarget); const date = String(f.get('date')); const reason = String(f.get('reason')); void perform(() => path === '/leaves' ? leaveService.createLeaveRequest({ employeeId:user!.employeeId, employeeName:user!.name, department:user!.department, leaveType:'Annual', startDate:date, endDate:date, duration:1, reason }) : attendanceService.createAttendanceCorrection({ employeeId:user!.employeeId, employeeName:user!.name, department:user!.department, date, reason, requestedIn:String(f.get('requestedIn')), requestedOut:String(f.get('requestedOut')) })); }}><h2 className="font-bold">{say('طلب شخصي جديد','New personal request')}</h2><div className="flex flex-wrap gap-4"><label>{say('التاريخ','Date')}<input type="date" name="date" required className="block border rounded-lg p-2 mt-1"/></label>{path === '/attendance' && <><label>{say('وقت الدخول','Check-in')}<input type="time" name="requestedIn" required className="block border rounded-lg p-2 mt-1"/></label><label>{say('وقت الخروج','Check-out')}<input type="time" name="requestedOut" required className="block border rounded-lg p-2 mt-1"/></label></>}<label className="grow">{say('السبب — لا تكتب تفاصيل طبية','Reason — do not include medical details')}<input name="reason" required maxLength={500} className="block w-full border rounded-lg p-2 mt-1"/></label></div><p className="text-xs text-text-secondary">{say('طلب الإجازة المبسّط: يوم واحد من الإجازة السنوية.','Simplified leave request: one day of annual leave.')}</p><button disabled={busy} className="bg-brand-deep-teal text-white rounded-lg px-5 py-2">{say('إرسال للمراجعة','Submit for review')}</button></form>}
    </>}
  </section>;
}
