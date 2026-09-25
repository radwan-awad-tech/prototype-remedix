const states: Record<string, string> = {
  Pending: 'بانتظار المراجعة', Approved: 'معتمد', Rejected: 'مرفوض',
  Manager: 'رئيس القسم', HR: 'الموارد البشرية', Completed: 'مكتمل',
  Draft: 'مسودة', Calculated: 'محسوب', Locked: 'مقفل للمراجعة',
  Scheduled: 'مجدول', Cancelled: 'ملغى', Overdue: 'متأخر', Issued: 'صادر',
  Active: 'نشط', Inactive: 'غير نشط', Published: 'منشور', Open: 'مفتوح',
  Closed: 'مغلق', Valid: 'ساري', Expiring: 'قارب الانتهاء', Expired: 'منتهي',
  Verified: 'تم التحقق', Submitted: 'مقدّم', Finalized: 'نهائي',
};
const months = ['january','february','march','april','may','june','july','august','september','october','november','december'];

export function chartLabel(value: string, language: 'ar' | 'en'): string {
  if (!value) return language === 'ar' ? 'غير محدد' : 'Unspecified';
  const legacy = /^([a-z]+)_(\d{4})$/i.exec(value);
  const iso = /^(\d{4})-(0[1-9]|1[0-2])$/.exec(value);
  const month = iso ? Number(iso[2]) - 1 : legacy ? months.indexOf(legacy[1].toLowerCase()) : -1;
  const year = iso?.[1] ?? legacy?.[2];
  if (month >= 0 && year) return new Intl.DateTimeFormat(language === 'ar' ? 'ar-SY' : 'en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(Date.UTC(Number(year), month, 1)));
  if (language !== 'ar') return value;
  return value.split(' / ').map(part => states[part] || part).join(' — ');
}
