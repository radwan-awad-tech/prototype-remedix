import assert from 'node:assert/strict';
import { test } from 'node:test';
import { DEMO_EMAIL, DEMO_PASSWORD, isDemoCredentialMatch } from '../src/modules/auth/demoCredentials';

test('public demo account accepts only its configured email and password', () => {
  assert.equal(DEMO_EMAIL, 'radwan@gmail.com');
  assert.equal(DEMO_PASSWORD, 'root');
  assert.equal(isDemoCredentialMatch(' Radwan@gmail.com ', 'root'), true);
  assert.equal(isDemoCredentialMatch('radwan@gmail.com', 'Root'), false);
  assert.equal(isDemoCredentialMatch('someone@example.com', 'root'), false);
  assert.equal(isDemoCredentialMatch('radwan@gmail.com', 'anything-else'), false);
});
