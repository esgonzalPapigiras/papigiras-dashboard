import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { INTERNAL_DOCUMENT_MAX_BYTES, InternalTourDocument, internalDocumentList, validInternalTourId } from '../models/internal-document';

/** Administrative view of the private document API. The server enforces ADMIN;
 * neither this service nor a client-side token creates permission. */
@Injectable({ providedIn: 'root' })
export class InternalDocumentsService {
  readonly url = environment.apiUrl;
  constructor(private http: HttpClient) { }

  list(tourId: number): Observable<InternalTourDocument[]> {
    const id = validInternalTourId(tourId);
    return this.http.get<unknown>(this.url + '/app/services/internal-documents', {
      headers: this.headers(), params: { tourId: String(id) }
    }).pipe(map(value => internalDocumentList(value, id)));
  }

  download(tourId: number, document: InternalTourDocument): Observable<Blob> {
    const id = validInternalTourId(tourId);
    internalDocumentList([document], id);
    return this.http.get(this.url + '/app/services/internal-documents/' + document.id, {
      headers: this.headers(), params: { tourId: String(id) }, responseType: 'arraybuffer'
    }).pipe(map(bytes => {
      if (bytes.byteLength !== document.sizeBytes || bytes.byteLength > INTERNAL_DOCUMENT_MAX_BYTES) {
        throw new Error('No se pudo verificar el documento.');
      }
      return new Blob([bytes], { type: document.contentType });
    }));
  }

  private headers(): HttpHeaders {
    return new HttpHeaders({ Authorization: localStorage.getItem('token') || '' });
  }
}
