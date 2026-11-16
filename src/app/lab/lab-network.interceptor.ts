import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { isAllowedLabRequest } from './lab-network-policy';
import { normalizeAuthorization } from './lab-auth';

@Injectable()
export class LabNetworkInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!environment.lab || !isAllowedLabRequest(request.url, window.location.origin, environment.apiUrl)) {
      return throwError(() => new Error('PAPIGIRAS LAB bloqueó una conexión fuera del entorno local.'));
    }
    const target = new URL(request.url, window.location.origin);
    const isApi = target.origin === environment.apiUrl;
    const auth = isApi ? normalizeAuthorization(request.headers.get('Authorization')) : null;
    const headers = auth ? request.headers.set('Authorization', auth) : request.headers.delete('Authorization');
    return next.handle(request.clone({ headers })).pipe(catchError(error => {
      // Legacy unhandled subscriptions must not log response bodies or identifiers in URLs.
      const status = error instanceof HttpErrorResponse ? error.status : 0;
      return throwError(() => new HttpErrorResponse({ status, error: {
        message: status === 401 || status === 403 ? 'La sesión local no autoriza esta operación. Inicia sesión de nuevo.' : 'No se pudo completar la operación local.'
      }}));
    }));
  }
}
