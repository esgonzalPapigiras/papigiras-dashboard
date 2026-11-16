import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, timeout } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { OperationsResponse, validateOverview } from './dashboard-operations';

@Injectable({providedIn:'root'})
export class DashboardOperationsService {
  constructor(private http: HttpClient) {}
  load() {
    const headers = new HttpHeaders({Authorization:localStorage.getItem('token') || ''});
    return this.http.get<OperationsResponse>(`${environment.apiUrl}/api/dashboard/operations`, {headers})
      .pipe(timeout(20000),map(validateOverview));
  }
}
