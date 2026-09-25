import assert from 'node:assert/strict';
import { test } from 'node:test';
import { interpolateTranslation } from '../src/i18n/translations';

test('translation interpolation replaces double and single brace placeholders as text', () => {
  assert.equal(interpolateTranslation('Reject {{name}} on {date}.', { name: '<img src=x>', date: '2026-09-25' }), 'Reject <img src=x> on 2026-09-25.');
  assert.equal(interpolateTranslation('Status: {{status}}', { status: 'Approved' }), 'Status: Approved');
  assert.equal(interpolateTranslation('No values', undefined), 'No values');
});
