import React, { useEffect, useState } from 'react';
import { Download, FileText, RefreshCw } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { useAuth } from '../modules/auth/AuthContext';
import { useTranslation } from '../hooks/useTranslation';
import { canAccessPath } from '../modules/auth/permissions';
import { loadWorkspace } from '../services/workspaceService';

type Card = { id: string; path: string; title: [string,string]; detail: [string,string]; fields: [string,string,string][] };
const roleReports: Record<string, Card[]> = {
  Employee: [
    { id:'my-attendance',path:'/attendance',title:['سجل حضوري','My attendance'],detail:['سجل الدخول والخروج وساعات العمل الشخصية','Personal clock-in, clock-out and work hours'],fields:[['date','التاريخ','Date'],['checkIn','الدخول','Clock in'],['checkOut','الخروج','Clock out'],['totalHours','الساعات','Hours'],['status','الحالة','Status']] },
    { id:'my-leave',path:'/leaves',title:['طلباتي وإجازاتي','My leave requests'],detail:['حالة الطلبات والمدد المقدمة','Request status and requested days'],fields:[['leaveType','نوع الإجازة','Leave type'],['startDate','من','From'],['endDate','إلى','To'],['duration','المدة','Days'],['status','الحالة','Status']] },
    { id:'my-payslips',path:'/payroll',title:['كشوف رواتبي','My payslips'],detail:['صافي الراتب والبدلات والاستقطاعات','Net pay, allowances and deductions'],fields:[['period','الفترة','Period'],['baseSalary','الراتب الأساسي','Base salary'],['netSalary','الصافي','Net pay'],['generatedAt','تاريخ الإصدار','Issued']] },
  ],
  'Senior Manager': [
    { id:'workforce',path:'/employees',title:['القوى العاملة','Workforce roster'],detail:['توزيع الموظفين وحالاتهم الوظيفية','Employee distribution and work status'],fields:[['employeeNo','الرقم الوظيفي','Employee ID'],['firstName','الاسم','First name'],['lastName','الكنية','Last name'],['department','القسم','Department'],['position','المسمى','Position'],['status','الحالة','Status']] },
    { id:'payroll-summary',path:'/payroll',title:['ملخص دورات الرواتب','Payroll run summary'],detail:['أعداد الدورات والإجماليات وحالة الاعتماد','Run totals and approval status'],fields:[['period','الفترة','Period'],['employeeCount','عدد الموظفين','Employees'],['totalBaseSalary','الأساسي','Base pay'],['totalAllowances','البدلات','Allowances'],['totalOvertime','العمل الإضافي','Overtime'],['totalDeductions','الاستقطاعات','Deductions'],['totalNet','الصافي','Net total'],['status','الحالة','Status']] },
    { id:'leave-status',path:'/leaves',title:['حركة الإجازات','Leave workflow'],detail:['الطلبات حسب القسم والفترة والمرحلة','Requests by department, period and stage'],fields:[['employeeName','الموظف','Employee'],['department','القسم','Department'],['leaveType','النوع','Type'],['startDate','من','From'],['endDate','إلى','To'],['stage','المرحلة','Stage'],['status','الحالة','Status']] },
  ],
  'HR Manager': [
    { id:'workforce',path:'/employees',title:['القوى العاملة','Workforce roster'],detail:['بيانات الموظفين الإدارية','Employee administration'],fields:[['employeeNo','الرقم الوظيفي','Employee ID'],['firstName','الاسم','First name'],['lastName','الكنية','Last name'],['department','القسم','Department'],['position','المسمى','Position'],['status','الحالة','Status']] },
    { id:'leave-status',path:'/leaves',title:['طلبات الإجازة','Leave requests'],detail:['الموظفون والمرحلة والحالة','Employee requests and workflow'],fields:[['employeeName','الموظف','Employee'],['department','القسم','Department'],['leaveType','النوع','Type'],['startDate','من','From'],['endDate','إلى','To'],['duration','الأيام','Days'],['status','الحالة','Status']] },
    { id:'payroll-summary',path:'/payroll',title:['ملخص الرواتب','Payroll summary'],detail:['الإجماليات وحالة دورة الرواتب','Totals and payroll cycle status'],fields:[['period','الفترة','Period'],['employeeCount','عدد الموظفين','Employees'],['totalBaseSalary','الأساسي','Base pay'],['totalAllowances','البدلات','Allowances'],['totalOvertime','العمل الإضافي','Overtime'],['totalDeductions','الاستقطاعات','Deductions'],['totalNet','الصافي','Net total'],['status','الحالة','Status']] },
    { id:'recruitment',path:'/recruitment',title:['الشواغر والتوظيف','Recruitment pipeline'],detail:['الشواغر المفتوحة وحالة استكمالها','Openings and hiring status'],fields:[['title','الشاغر','Opening'],['department','القسم','Department'],['vacancies','الشواغر','Vacancies'],['status','الحالة','Status']] },
  ],
  'HR Officer': [
    { id:'recruitment',path:'/recruitment',title:['متابعة الشواغر','Open positions'],detail:['الشاغر والقسم وعدد المقاعد والحالة','Opening, department, positions and status'],fields:[['title','الشاغر','Opening'],['department','القسم','Department'],['vacancies','الشواغر','Vacancies'],['status','الحالة','Status']] },
    { id:'licenses',path:'/licenses',title:['متابعة التراخيص','Credential tracking'],detail:['تواريخ الانتهاء والتحقق الإداري','Expiry and verification status'],fields:[['employeeName','الموظف','Employee'],['name','الترخيص','Credential'],['expiryDate','الانتهاء','Expires'],['verificationStatus','التحقق','Verification']] },
    { id:'payroll-summary',path:'/payroll',title:['مطابقة الرواتب','Payroll reconciliation'],detail:['إجماليات الدورات دون أدوات تعديل أو اعتماد','Payroll totals, without editing or approval'],fields:[['period','الفترة','Period'],['employeeCount','الموظفون','Employees'],['totalNet','الصافي','Net total'],['status','الحالة','Status']] },
  ],
  'Department Head': [
    { id:'department-roster',path:'/employees',title:['موظفو القسم','Department roster'],detail:['قائمة الموظفين ضمن نطاق القسم','Employees in your department'],fields:[['employeeNo','الرقم الوظيفي','Employee ID'],['firstName','الاسم','First name'],['lastName','الكنية','Last name'],['department','القسم','Department'],['position','المسمى','Position']] },
    { id:'department-leave',path:'/leaves',title:['طلبات إجازة القسم','Department leave requests'],detail:['طلبات الإجازة المتاحة للمراجعة ضمن القسم','In-scope leave requests for review'],fields:[['employeeName','الموظف','Employee'],['leaveType','النوع','Type'],['startDate','من','From'],['endDate','إلى','To'],['duration','الأيام','Days'],['stage','المرحلة','Stage'],['status','الحالة','Status']] },
    { id:'department-schedule',path:'/scheduling',title:['جدول المناوبات','Department roster schedule'],detail:['المناوبات المسندة ضمن القسم','Assigned shifts in your department'],fields:[['employeeName','الموظف','Employee'],['date','التاريخ','Date'],['shiftTypeName','المناوبة','Shift'],['status','الحالة','Status']] },
  ],
  'Payroll Officer': [
    { id:'payroll-summary',path:'/payroll',title:['دورات الرواتب','Payroll runs'],detail:['حالة التحضير والإجماليات حسب الدورة','Preparation status and totals by run'],fields:[['period','الفترة','Period'],['employeeCount','الموظفون','Employees'],['totalBaseSalary','الأساسي','Base pay'],['totalAllowances','البدلات','Allowances'],['totalOvertime','العمل الإضافي','Overtime'],['totalDeductions','الاستقطاعات','Deductions'],['totalNet','الصافي','Net total'],['status','الحالة','Status']] },
    { id:'attendance-corrections',path:'/attendance',title:['تصحيحات الحضور','Attendance corrections'],detail:['الطلبات والمرحلة والحالة دون تعديل سجلات الدوام','Correction requests and review stage'],fields:[['employeeName','الموظف','Employee'],['department','القسم','Department'],['date','التاريخ','Date'],['stage','المرحلة','Stage'],['status','الحالة','Status']] },
  ],
  Accountant: [
    { id:'payroll-review',path:'/payroll',title:['مراجعة إجماليات الرواتب','Payroll totals review'],detail:['مطابقة المبالغ وحالات الاعتماد','Amounts and approval status'],fields:[['period','الفترة','Period'],['employeeCount','الموظفون','Employees'],['totalBaseSalary','الأساسي','Base pay'],['totalAllowances','البدلات','Allowances'],['totalOvertime','العمل الإضافي','Overtime'],['totalDeductions','الاستقطاعات','Deductions'],['totalNet','الصافي','Net total'],['status','الحالة','Status']] },
  ],
  'Occupational Health Officer': [
    { id:'occupational-health',path:'/health',title:['متابعة الصحة المهنية','Occupational health follow-up'],detail:['السجلات المهنية المصرح بها للدور الصحي فقط','Records available to the occupational health role'],fields:[['employeeName','الموظف','Employee'],['type','النوع','Type'],['date','التاريخ','Date'],['status','الحالة','Status']] },
  ],
};

const escapeHtml = (value: unknown) => String(value ?? '—').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]!));
const formatCell = (key: string, value: unknown, ar: boolean) => {
  if (value === undefined || value === null || value === '') return '—';
  if (typeof value === 'number') return new Intl.NumberFormat(ar ? 'ar' : 'en').format(value);
  if (['checkIn','checkOut','generatedAt','submittedAt'].includes(key) && typeof value === 'string' && value.includes('T')) return new Date(value).toLocaleString(ar ? 'ar' : 'en');
  if (ar) {
    const labels: Record<string,string> = { Pending:'قيد المراجعة',Approved:'معتمد',Rejected:'مرفوض',Draft:'مسودة',Calculated:'محتسبة',Locked:'مقفلة',Active:'فعال',Inactive:'غير فعال',Manager:'رئيس القسم',HR:'الموارد البشرية',Completed:'مكتملة',Annual:'سنوية',Sick:'مرضية',Unpaid:'بدون أجر',Late:'متأخر',OK:'منتظم','Missing Checkout':'خروج غير مسجل',Verified:'تم التحقق',Expired:'منتهي' };
    return labels[String(value)] || String(value);
  }
  return String(value);
};

const ReportsPage: React.FC = () => {
  const { user } = useAuth(); const { language } = useTranslation(); const ar = language === 'ar';
  const [data, setData] = useState<Record<string, Record<string, any>[]>>({}); const [loading, setLoading] = useState(true); const [failed, setFailed] = useState<string[]>([]); const [history, setHistory] = useState<{title:string; at:string}[]>([]); const [refresh, setRefresh] = useState(0);
  const cards = (roleReports[user?.role || ''] || []).filter(card => canAccessPath(user!.role, card.path));
  useEffect(() => {
    let active = true; setLoading(true);
    Promise.all(cards.map(async card => { try { return { path:card.path, rows:await loadWorkspace(card.path), failed:false }; } catch { return { path:card.path, rows:[], failed:true }; } }))
      .then(entries => { if (active) { setData(Object.fromEntries(entries.map(entry => [entry.path, entry.rows]))); setFailed([...new Set(entries.filter(entry => entry.failed).map(entry => entry.path))]); } })
      .finally(() => { if (active) setLoading(false); });
    try { const stored = localStorage.getItem(`remedix-report-history-${user?.id}`); if (stored) setHistory(JSON.parse(stored)); } catch { setHistory([]); }
    return () => { active = false; };
  }, [user?.id, user?.role, refresh]);

  const exportPdf = (card: Card) => {
    const rows = data[card.path] || [];
    const fields = card.fields;
    const title = card.title[ar ? 0 : 1];
    const table = `<table><thead><tr>${fields.map(field => `<th>${escapeHtml(field[ar ? 1 : 2])}</th>`).join('')}</tr></thead><tbody>${rows.map(row => `<tr>${fields.map(field => `<td>${escapeHtml(formatCell(field[0], row[field[0]], ar))}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
    const printWindow = window.open('', '_blank', 'width=1000,height=750');
    if (!printWindow) return;
    printWindow.document.write(`<!doctype html><html lang="${ar ? 'ar' : 'en'}" dir="${ar ? 'rtl' : 'ltr'}"><head><meta charset="utf-8"><title>${escapeHtml(title)}</title><style>body{font-family:Arial,"Noto Sans Arabic",sans-serif;color:#111827;padding:32px}h1{color:#004D4D;font-size:22px}p{color:#475569}.meta{margin:20px 0}table{width:100%;border-collapse:collapse;font-size:12px}th,td{border:1px solid #cbd5e1;padding:8px;text-align:start}th{background:#e7f5f3;color:#004D4D}@media print{body{padding:0}thead{display:table-header-group}tr{break-inside:avoid}}</style></head><body><h1>REMEDIX · ${escapeHtml(title)}</h1><p>${escapeHtml(card.detail[ar ? 0 : 1])}</p><p class="meta">${escapeHtml(user?.name)} · ${new Date().toLocaleString(ar ? 'ar' : 'en')} · ${rows.length} ${ar ? 'سجل' : 'records'}</p>${table}<script>window.onload=()=>window.print()</script></body></html>`);
    printWindow.document.close();
    const next = [{ title, at: new Date().toISOString() }, ...history].slice(0, 20); setHistory(next); localStorage.setItem(`remedix-report-history-${user?.id}`, JSON.stringify(next));
  };

  return <div className="space-y-6"><PageHeader title={ar ? 'التقارير' : 'Reports'} subtitle={ar ? 'تقارير قابلة للطباعة بصيغة PDF، حسب دورك وصلاحيات بياناتك.' : 'PDF-ready reports scoped to your role and authorized records.'} actions={<button onClick={() => setRefresh(value => value + 1)} disabled={loading} className="inline-flex items-center gap-2 rounded-lg border border-border-base bg-white px-4 py-2"><RefreshCw size={16}/>{ar ? 'تحديث البيانات' : 'Refresh data'}</button>} />
    <p className="text-sm text-text-secondary">{ar ? 'اختر بطاقة لتنزيل التقرير: من نافذة الطباعة اختر «حفظ كـ PDF». لا تُضمّن البطاقات حقولاً غير متاحة لصلاحيتك.' : 'Choose a report card, then select “Save as PDF” in the print dialog. Cards only include fields available to your role.'}</p>
    {loading ? <p role="status">{ar ? 'جارٍ تحميل البيانات المسموحة…' : 'Loading authorized data…'}</p> : <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{cards.map(card => { const rows = data[card.path] || []; const loadFailed = failed.includes(card.path); return <article key={card.id} className="card-base p-5 flex flex-col gap-4"><div className="flex items-start gap-3"><span className="rounded-xl bg-brand-muted-teal p-3 text-brand-deep-teal"><FileText size={21}/></span><div><h2 className="font-semibold">{card.title[ar ? 0 : 1]}</h2><p className="mt-1 text-sm text-text-secondary">{card.detail[ar ? 0 : 1]}</p></div></div><p className="text-xs text-text-secondary">{loadFailed ? (ar ? 'تعذر تحميل البيانات؛ حدّث الصفحة وحاول مجدداً.' : 'Could not load data. Refresh and try again.') : `${rows.length} ${ar ? 'سجل متاح' : 'available records'}`}</p><button disabled={loadFailed || !rows.length} onClick={() => exportPdf(card)} className="mt-auto inline-flex items-center justify-center gap-2 rounded-lg bg-brand-deep-teal px-4 py-2.5 text-white disabled:cursor-not-allowed disabled:opacity-50"><Download size={16}/>{ar ? 'استخراج PDF' : 'Export PDF'}</button></article>; })}</div>}
    {cards.length === 0 && <div className="card-base p-6">{ar ? 'لا توجد تقارير متاحة لهذا الدور.' : 'No reports are available for this role.'}</div>}
    <section className="card-base p-5"><h2 className="font-semibold">{ar ? 'آخر التقارير' : 'Recent reports'}</h2>{history.length ? <ul className="mt-3 divide-y divide-border-base">{history.map((item,index) => <li key={`${item.at}-${index}`} className="flex justify-between gap-4 py-3 text-sm"><span>{item.title}</span><time className="text-text-secondary">{new Date(item.at).toLocaleString(ar ? 'ar' : 'en')}</time></li>)}</ul> : <p className="mt-2 text-sm text-text-secondary">{ar ? 'لم يتم استخراج تقارير بعد.' : 'No reports exported yet.'}</p>}</section>
  </div>;
};

export default ReportsPage;
