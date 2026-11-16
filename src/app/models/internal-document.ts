export type InternalDocumentCategory = 'GENERAL' | 'VOUCHER';
export interface InternalTourDocument {
  id: string;
  tourId: number;
  category: InternalDocumentCategory;
  name: string;
  originalName: string;
  storedName: string;
  contentType: string;
  sizeBytes: number;
  createdAt: string;
  activityId?: number | null;
  activityName?: string | null;
}
export const INTERNAL_DOCUMENT_MAX_BYTES = 10 * 1024 * 1024;
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const types = new Set(['application/pdf', 'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/jpeg', 'image/png', 'image/webp']);

export function validInternalTourId(value: unknown): number {
  const id = Number(value);
  if (!Number.isSafeInteger(id) || id <= 0) throw new Error('Gira no disponible.');
  return id;
}

export function internalDocumentList(value: unknown, tourId: number): InternalTourDocument[] {
  if (!Array.isArray(value)) throw new Error('Respuesta de documentos no válida.');
  const seen = new Set<string>();
  return value.map((row: any) => {
    if (!row || !uuid.test(row.id) || seen.has(row.id) || row.tourId !== tourId ||
        !['GENERAL', 'VOUCHER'].includes(row.category) || typeof row.name !== 'string' || !row.name.trim() || row.name.length > 120 ||
        typeof row.storedName !== 'string' || !row.storedName || /[/\\]/.test(row.storedName) ||
        !/\.(pdf|docx?|xlsx?|jpe?g|png|webp)$/i.test(row.storedName) || !types.has(row.contentType) ||
        !Number.isSafeInteger(row.sizeBytes) || row.sizeBytes <= 0 || row.sizeBytes > INTERNAL_DOCUMENT_MAX_BYTES ||
        typeof row.createdAt !== 'string' || !Number.isFinite(Date.parse(row.createdAt)) ||
        (row.category === 'VOUCHER' && row.activityId != null && (!Number.isSafeInteger(row.activityId) || row.activityId <= 0))) {
      throw new Error('Respuesta de documentos no válida.');
    }
    seen.add(row.id);
    return row as InternalTourDocument;
  });
}
