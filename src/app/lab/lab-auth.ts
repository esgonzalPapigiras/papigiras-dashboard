/** Accept raw or legacy duplicated Bearer prefixes; never expose the credential. */
export function normalizeAuthorization(value: unknown): string | null {
  if (typeof value !== 'string' || /[\r\n]/.test(value)) return null;
  const token = value.trim().replace(/^(?:Bearer\s+)+/i, '');
  return /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(token) ? `Bearer ${token}` : null;
}
