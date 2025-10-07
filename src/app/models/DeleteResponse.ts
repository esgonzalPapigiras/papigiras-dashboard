export interface DeleteResponse {
  status: 'success' | 'error';
  message: string;
  passengerId?: string;
}