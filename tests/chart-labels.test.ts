import assert from 'node:assert/strict';
import { test } from 'node:test';
import { chartLabel } from '../src/components/ui/chartLabels';

test('Arabic workflow labels translate both status and approval stage', () => {
  assert.equal(chartLabel('Pending / HR', 'ar'), 'بانتظار المراجعة — الموارد البشرية');
  assert.equal(chartLabel('Pending / Manager', 'ar'), 'بانتظار المراجعة — رئيس القسم');
  assert.equal(chartLabel('Calculated', 'ar'), 'محسوب');
  assert.equal(chartLabel('Pending / HR', 'en'), 'Pending / HR');
});
test('legacy and ISO payroll periods have the same localized display', () => {
  for (const lang of ['ar', 'en'] as const) {
    assert.equal(chartLabel('january_2024', lang), chartLabel('2024-01', lang));
    assert.equal(chartLabel('september_2026', lang), chartLabel('2026-09', lang));
    assert.ok(!chartLabel('january_2024', lang).includes('_'));
  }
});
test('department labels and unknown values are preserved without invalid dates', () => {
  assert.equal(chartLabel('الموارد البشرية', 'ar'), 'الموارد البشرية');
  assert.equal(chartLabel('unknown_2024', 'ar'), 'unknown_2024');
  assert.equal(chartLabel('2024-13', 'ar'), '2024-13');
  assert.equal(chartLabel('', 'ar'), 'غير محدد');
});
