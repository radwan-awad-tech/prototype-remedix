/**
 * Public demo gate only. These values are embedded in the browser bundle and
 * must never be treated as a security boundary or reused on another service.
 */
export const DEMO_EMAIL = 'radwan@gmail.com';
export const DEMO_PASSWORD = 'root';

export function isDemoCredentialMatch(email: string, password: string): boolean {
  return email.trim().toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD;
}
