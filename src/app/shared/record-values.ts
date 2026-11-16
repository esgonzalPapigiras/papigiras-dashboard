/** Normalize legacy API values without inventing or persisting records. */
export function recordList<T>(value: T[] | null | undefined): T[] {
  return Array.isArray(value) ? value.filter(row => row != null) : [];
}
export function searchText(value: unknown): string {
  return String(value ?? '').trim().toLocaleLowerCase('es');
}
export function calendarDate(value: unknown): string {
  let year: number, month: number, day: number;
  if (value instanceof Date) {
    if (!Number.isFinite(value.getTime())) return '';
    year = value.getFullYear(); month = value.getMonth() + 1; day = value.getDate();
  } else if (typeof value === 'string') {
    const text = value.trim();
    const iso = /^(\d{4})-(\d{2})-(\d{2})(?:T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})?)?$/.exec(text);
    const local = /^(\d{2})([-/])(\d{2})\2(\d{4})$/.exec(text);
    if (iso) [, year, month, day] = iso.map(Number);
    else if (local) { day = Number(local[1]); month = Number(local[3]); year = Number(local[4]); }
    else return '';
  } else return '';
  if (year < 1000 || year > 9999 || month < 1 || month > 12 || day < 1) return '';
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return '';
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}
export function calendarTimestamp(value: unknown): number | null {
  const date = calendarDate(value);
  return date ? Date.parse(date + 'T00:00:00Z') : null;
}
export function escapeHtml(value: unknown): string {
  const replacements: {[key: string]: string} = {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'};
  return String(value ?? '').replace(/[&<>"']/g, c => replacements[c]);
}
export function tourCommune(row: any): string {
  return String(row?.communesName || row?.detalle?.communesName || row?.communeName || '');
}
export function tourMatches(row: any, filters: {[key: string]: unknown}): boolean {
  if (!row) return false;
  for (const key of ['tourSalesUuid', 'collegeName', 'addCourse']) {
    if (searchText(filters[key]) && !searchText(row[key]).includes(searchText(filters[key]))) return false;
  }
  if (searchText(filters.communesName) && !searchText(tourCommune(row)).includes(searchText(filters.communesName))) return false;
  const from = calendarTimestamp(filters.tourSalesInit);
  const until = calendarTimestamp(filters.tourSalesFinal);
  const start = calendarTimestamp(row.tourSalesInit);
  const end = calendarTimestamp(row.tourSalesFinal);
  // Partial typing does not exclude every row; complete valid dates filter inclusively.
  if (from !== null && (start === null || start < from)) return false;
  if (until !== null && (end === null || end > until)) return false;
  return true;
}
export function validCoordinates(latitude: unknown, longitude: unknown): boolean {
  if (latitude == null || longitude == null || latitude === '' || longitude === '') return false;
  const lat = Number(latitude), lng = Number(longitude);
  return Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180;
}

export function positiveRecordId(value: unknown): number | null {
  if (!/^[0-9]+$/.test(String(value ?? ''))) return null;
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}
