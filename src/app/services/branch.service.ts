import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Branch } from 'app/models/branch';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BranchService {

  //url = 'https://stingray-app-9tqd9.ondigitalocean.app';
  //url = "https://ms-papigiras-app-ezkbu.ondigitalocean.app"
  url = 'http://localhost:8084';
  constructor(private http: HttpClient) { }


  public obtenerOficinas(): Observable<Branch[]> {

    const headers = new HttpHeaders().set('Authorization', localStorage.getItem('token'));
    return this.http.get<Branch[]>(this.url.concat('/api/branches/web/get'), { headers })

  }

  public deleteBranch(id: number): Observable<any[]> {

    const headers = new HttpHeaders().set('Authorization', localStorage.getItem('token'));
    const params = new HttpParams().set('id', id.toString());
    return this.http.delete<any[]>(this.url.concat('/api/branches/web/delete'), { headers, params })

  }

  public obtenerBranchUpdate(id: number): Observable<Branch> {

    const headers = new HttpHeaders().set('Authorization', localStorage.getItem('token'));
    const params = new HttpParams().set('id', id.toString());
    return this.http.get<Branch>(this.url.concat('/api/branches/web/get/byid'), { headers, params })

  }

  public branchCreate(coordinator: Branch): Observable<any> {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`  // Asegúrate de usar el formato adecuado para el token
    });

    return this.http.post(this.url.concat('/api/branches/web/create'), JSON.stringify(coordinator), { headers });
  }

  public branchUpdate(coordinator: Branch, id: String): Observable<any> {
    const params = new HttpParams().set('id', id.toString());
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`  // Asegúrate de usar el formato adecuado para el token
    });

    return this.http.post(this.url.concat('/api/branches/web/update'), JSON.stringify(coordinator), { headers, params });
  }
}
