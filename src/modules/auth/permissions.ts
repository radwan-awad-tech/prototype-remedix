import { RoleType, User } from '../../types';

export type AccessLevel = 'manage' | 'review' | 'view';
export type AccessScope = 'organization' | 'department' | 'self';
export interface RoleModuleAccess { path: string; level: AccessLevel; scope: AccessScope }
export interface RoleAccessPolicy { role: RoleType; landingPath: string; modules: RoleModuleAccess[] }
const m = (path: string, level: AccessLevel = 'view', scope: AccessScope = 'organization'): RoleModuleAccess => ({ path, level, scope });
const personal = [m('/profile', 'manage', 'self'), m('/settings', 'manage', 'self'), m('/access')];
export const ROLE_ORDER: RoleType[] = ['System Admin', 'HR Manager', 'HR Officer', 'Department Head', 'Payroll Officer', 'Accountant', 'Occupational Health Officer', 'Employee'];
const policy = (role: RoleType, modules: RoleModuleAccess[]): RoleAccessPolicy => ({ role, landingPath: '/', modules: [m('/'), ...modules, ...personal] });

/** Proposed hospital delegation, NOT a universal hierarchy or production authorization. */
export const ROLE_ACCESS_POLICIES: Record<RoleType, RoleAccessPolicy> = {
  'System Admin': policy('System Admin', [m('/admin', 'manage')]),
  'HR Manager': policy('HR Manager', [m('/employees', 'manage'), m('/doctors', 'manage'), m('/scheduling', 'manage'), m('/leaves', 'manage'), m('/attendance', 'manage'), m('/licenses', 'manage'), m('/recruitment', 'manage'), m('/performance', 'manage'), m('/health'), m('/reports')]),
  'HR Officer': policy('HR Officer', [m('/employees', 'manage'), m('/doctors'), m('/scheduling'), m('/leaves', 'review'), m('/attendance', 'review'), m('/licenses', 'manage'), m('/recruitment', 'manage'), m('/performance'), m('/health'), m('/reports')]),
  'Department Head': policy('Department Head', [m('/employees', 'view', 'department'), m('/doctors', 'view', 'department'), m('/scheduling', 'manage', 'department'), m('/leaves', 'review', 'department'), m('/attendance', 'review', 'department'), m('/licenses', 'view', 'department'), m('/recruitment', 'review', 'department'), m('/performance', 'review', 'department'), m('/health', 'view', 'department'), m('/reports', 'view', 'department')]),
  'Payroll Officer': policy('Payroll Officer', [m('/payroll', 'manage'), m('/attendance'), m('/leaves'), m('/reports')]),
  'Accountant': policy('Accountant', [m('/payroll', 'review'), m('/reports')]),
  'Occupational Health Officer': policy('Occupational Health Officer', [m('/health', 'manage')]),
  Employee: policy('Employee', [m('/scheduling', 'view', 'self'), m('/leaves', 'manage', 'self'), m('/attendance', 'manage', 'self'), m('/payroll', 'view', 'self'), m('/performance', 'view', 'self'), m('/licenses', 'view', 'self')]),
};
export const getModuleAccess = (role: RoleType, path: string) => ROLE_ACCESS_POLICIES[role]?.modules.find(m => m.path === path);
export const canAccessPath = (role: RoleType, path: string) => !!getModuleAccess(role, path);
export const getLandingPath = (role: RoleType) => ROLE_ACCESS_POLICIES[role]?.landingPath || '/profile';
export interface RoutePermission { path: string; allowedRoles: RoleType[] }
export const ROUTE_PERMISSIONS: RoutePermission[] = [...new Set(ROLE_ORDER.flatMap(r => ROLE_ACCESS_POLICIES[r].modules.map(m => m.path)))].map(path => ({ path, allowedRoles: ROLE_ORDER.filter(r => canAccessPath(r, path)) }));

export function withinScope(user: User, path: string, row: { employeeId?: string; department?: string }): boolean {
  const access = getModuleAccess(user.role, path);
  if (!access || user.status === 'inactive') return false;
  if (access.scope === 'organization') return true;
  if (access.scope === 'department') return !!user.department && row.department === user.department;
  return !!user.employeeId && row.employeeId === user.employeeId;
}

export const ROLE_PROFILES: Record<RoleType, { ar: string; authority: string; tasks: string; limits: string; en: string }> = {
  'System Admin': { ar: 'مسؤول النظام', authority: 'سلطة تقنية، لا سلطة إدارية على العاملين', tasks: 'إدارة الحسابات والأدوار والبنية التقنية وسجل التدقيق.', limits: 'لا رواتب أو ملفات طبية أو اعتماد إجازات. منح الدور يتطلب تفويضاً خارج النظام.', en: 'Technical access administration; no clinical, payroll or HR decision authority.' },
  'HR Manager': { ar: 'مدير الموارد البشرية', authority: 'إدارة فريق الموارد البشرية وحوكمة شؤون العاملين', tasks: 'سياسات الموظفين، التوظيف، الامتثال، الإجازات والتقييمات بالتنسيق مع رؤساء الأقسام.', limits: 'ليس مديراً سريرياً لكل الأطباء. لا تشخيصات صحية، ولا اعتماد رواتب أو إدارة حسابات تقنية.', en: 'Workforce policy and HR approvals; no clinical records, payroll approval or system administration.' },
  'HR Officer': { ar: 'مسؤول الموارد البشرية', authority: 'تنفيذ ومتابعة الإجراءات ضمن تفويض مدير الموارد', tasks: 'تحديث البيانات الإدارية، التراخيص، تجهيز التوظيف، مراجعة الحضور والإجازات.', limits: 'لا إنهاء خدمة أو اعتماد نهائي للإجازات أو نشر عروض وظيفية أو تعديل الرواتب.', en: 'HR operations and document checks; no final employment, leave or salary decisions.' },
  'Department Head': { ar: 'رئيس القسم', authority: 'إشراف مباشر داخل القسم المكلّف به فقط', tasks: 'توزيع العمل والمناوبات، التوصية بالإجازات، مراجعة الأداء والحضور والاحتياج للتوظيف.', limits: 'لا موظفين خارج قسمه، لا رواتب تفصيلية أو تشخيصات، لا اعتماد طلبه الشخصي أو تعيين نهائي.', en: 'Department supervision, rosters and first-stage leave review; no other departments or salary/medical details.' },
  'Payroll Officer': { ar: 'مسؤول الرواتب', authority: 'إعداد مالي، وليس سلطة على الموظفين', tasks: 'إعداد دورة الرواتب وحسابها وتجميدها للمراجعة من المدخلات المعتمدة.', limits: 'لا اعتماد الدورة التي أعدّها، لا صرف بنكي، لا تعديل ملف الموارد أو تفاصيل صحية.', en: 'Prepares, calculates and locks payroll; cannot approve it or release bank payments.' },
  Accountant: { ar: 'المحاسب', authority: 'مراجعة مالية مستقلة بتفويض صريح في هذا النموذج', tasks: 'مطابقة الرواتب المقفلة ومراجعة الأرقام واعتماد الدورة للمحاسبة.', limits: 'لا إعداد أو إعادة حساب الرواتب؛ الاعتماد ليس أمراً بتحويل الأموال. لا ملفات صحية.', en: 'Delegated independent payroll reviewer; cannot prepare payroll; approval is not bank payment authority.' },
  'Occupational Health Officer': { ar: 'مسؤول الصحة المهنية', authority: 'تقييم مهني صحي ضمن التأهيل والتفويض', tasks: 'متابعة الإصابات والتطعيمات والفحوص، وحفظ الملف السرّي والتوصيات المتعلقة بالعمل.', limits: 'لا قرارات فصل أو رواتب أو إدارة أقسام. لا مشاركة تشخيصات مع الموارد أو رئيس القسم.', en: 'Confidential occupational health care and work advice; no HR, payroll or line-management decisions.' },
  Employee: { ar: 'الموظف', authority: 'خدمة ذاتية دون سلطة على الآخرين', tasks: 'عرض جدوله وكشف راتبه وتقييمه النهائي وتراخيصه، وتقديم طلباته الشخصية.', limits: 'لا بيانات زملاء، لا اعتماد ذاتي، لا تغيير راتب أو دور حساب.', en: 'Own schedule, payslips and finalized reviews; submits own requests, never approves them.' },
};
