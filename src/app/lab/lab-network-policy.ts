/** Local-only boundary for the independent LAB, including relative asset requests. */
export function isAllowedLabRequest(requestUrl: string, appOrigin: string, apiUrl: string): boolean {
  if (appOrigin !== 'http://127.0.0.1:4200' || apiUrl !== 'http://127.0.0.1:8084') {
    return false;
  }
  try {
    const target = new URL(requestUrl, appOrigin);
    return target.protocol === 'http:' && !target.username && !target.password &&
      (target.origin === apiUrl || target.origin === appOrigin);
  } catch {
    return false;
  }
}
