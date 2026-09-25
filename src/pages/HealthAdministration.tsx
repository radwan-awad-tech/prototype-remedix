import React, { useEffect, useState } from 'react';
import { useAuth } from '../modules/auth/AuthContext';
import { useTranslation } from '../hooks/useTranslation';
import { occupationalHealthService, HealthAdministrationRecord } from '../services/occupationalHealthService';
import { employeeService } from '../services/employeeService';
import { Employee } from '../types';
import { LocalizedBarChart } from '../components/ui/LocalizedBarChart';
import { chartLabel } from '../components/ui/chartLabels';

export const HealthAdministrationPage: React.FC = () => {
  const { user } = useAuth();
  const { language } = useTranslation();
  const ar = language === 'ar';
  const say = (a: string, e: string) => ar ? a : e;
  const [rows, setRows] = useState<HealthAdministrationRecord[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [kind, setKind] = useState('all');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [version, setVersion] = useState(0);
  const kinds: Record<string, string> = { checkup:say('الفحوص','Checkups'), vaccination:say('التطعيمات','Vaccinations'), incident:say('الحالات والإصابات','Incidents'), 'follow-up':say('المتابعات','Follow-ups') };
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([occupationalHealthService.getAdministrationRecords(), employeeService.listEmployees()]).then(([health, staff]) => {
      if (cancelled) return;
      if (!health.success || !staff.success) throw new Error();
      setRows(health.data); setEmployees(staff.data);
    }).catch(() => { if (!cancelled) setError(say('تعذر تحميل البيانات','Could not load data')); }).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [user?.id, version, language]);
  const filtered = rows.filter(row => kind === 'all' || row.kind === kind);
  return <section className="space-y-6">
    <header><h1 className="text-3xl font-bold">{say('صحة الموظفين — متابعة الموارد البشرية','Employee health — HR administration')}</h1><p className="text-text-secondary mt-3">{say('متابعة الفحوص والتطعيمات والحالات والمواعيد على مستوى المؤسسة. الملاحظات والتشخيصات الطبية السرّية ليست ضمن هذا العرض الإداري.','Organization-wide checkups, vaccination compliance, incidents and follow-ups. Confidential clinical notes and diagnoses are excluded from this administrative view.')}</p></header>
    {error && <p role="alert" className="rounded-xl bg-amber-50 p-4">{error}</p>}
    {loading ? <p role="status">{say('جارٍ التحميل…','Loading…')}</p> : <>
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">{Object.entries(kinds).map(([key,name]) => <button className="card-base p-5 text-start" onClick={() => setKind(key)} key={key}><p>{name}</p><p className="text-3xl font-bold text-brand-deep-teal mt-2">{rows.filter(r => r.kind === key).length}</p></button>)}</div>
      <div className="card-base p-5"><h2 className="font-bold mb-4">{say('حجم المتابعة حسب النوع','Administrative tracking by type')}</h2><LocalizedBarChart language={language} data={Object.entries(kinds).map(([key,name]) => ({name,count:rows.filter(r => r.kind === key).length}))} dataKey="count" metricLabel={say('السجلات','Records')} /></div>
      <label className="block">{say('نوع المتابعة','Record type')} <select className="border rounded-lg p-2 mx-2" value={kind} onChange={e => setKind(e.target.value)}><option value="all">{say('الكل','All')}</option>{Object.entries(kinds).map(([key,name]) => <option key={key} value={key}>{name}</option>)}</select></label>
      <div className="card-base overflow-auto"><table className="w-full text-sm"><thead><tr>{(ar ? ['الموظف','القسم','النوع','الحالة','التاريخ','الموعد القادم'] : ['Employee','Department','Type','Status','Date','Next date']).map(h => <th className="text-start p-4" key={h}>{h}</th>)}</tr></thead><tbody>{filtered.map(r => <tr key={`${r.kind}:${r.id}`} className="border-t border-border-base"><td className="p-4">{r.employeeName}</td><td className="p-4">{r.department}</td><td className="p-4">{kinds[r.kind]}</td><td className="p-4">{chartLabel(r.status,language)}</td><td className="p-4"><bdi>{r.date || '—'}</bdi></td><td className="p-4"><bdi>{r.nextDate || '—'}</bdi></td></tr>)}</tbody></table>{!filtered.length && <p className="p-5">{say('لا سجلات ضمن هذا النوع','No matching records')}</p>}</div>
    </>}
    {user?.role === 'HR Manager' && <form className="card-base p-5 space-y-4" onSubmit={async e => {
      e.preventDefault(); const f = new FormData(e.currentTarget); setBusy(true); setError('');
      try { const result = await occupationalHealthService.scheduleCheckup({employeeId:String(f.get('employeeId')),date:String(f.get('date')),type:'Periodic'}); if (!result.success) throw new Error(); setVersion(v => v+1); }
      catch { setError(say('لم يتم حفظ الإحالة','Referral was not saved')); } finally { setBusy(false); }
    }}><h2 className="font-bold">{say('إحالة لفحص دوري','Schedule a periodic checkup')}</h2><div className="flex flex-wrap gap-4"><label>{say('الموظف','Employee')}<select name="employeeId" required className="block border rounded-lg p-2 mt-1"><option value="">{say('اختر الموظف','Select employee')}</option>{employees.map(e => <option key={e.id} value={e.id}>{e.firstName} {e.lastName} — {e.department}</option>)}</select></label><label>{say('التاريخ','Date')}<input name="date" type="date" required className="block border rounded-lg p-2 mt-1" /></label></div><button disabled={busy} className="bg-brand-deep-teal text-white rounded-lg px-5 py-2">{say('حفظ الإحالة','Save referral')}</button></form>}
  </section>;
};
