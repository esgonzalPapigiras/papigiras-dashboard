import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Communes } from 'app/models/communes';
import { CommunesUpdate } from 'app/models/communesUpdate';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComunnesService {

  readonly url = environment.apiUrl;
  constructor(private http: HttpClient) { }


  public ObtenerCommunes(): Observable<Communes[]> {

    const headers = new HttpHeaders().set('Authorization', localStorage.getItem('token'));
    return this.http.get<Communes[]>(this.url.concat('/api/comunnes/web/get'), { headers })

  }

  public deleteCommunes(id: number): Observable<any[]> {

    const headers = new HttpHeaders().set('Authorization', localStorage.getItem('token'));
    const params = new HttpParams().set('id', id.toString());
    return this.http.delete<any[]>(this.url.concat('/api/comunnes/web/delete'), { headers, params })

  }

  public obtenerCommunesUpdate(id: number): Observable<Communes> {

    const headers = new HttpHeaders().set('Authorization', localStorage.getItem('token'));
    const params = new HttpParams().set('id', id.toString());
    return this.http.get<Communes>(this.url.concat('/api/comunnes/web/get/byid'), { headers, params })

  }

  public communesCreate(coordinator: Communes): Observable<any> {


    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`  // Asegúrate de usar el formato adecuado para el token
    });

    return this.http.post(this.url.concat('/api/comunnes/web/create'), JSON.stringify(coordinator), { headers });
  }

  public communesCreateUpdate(coordinator: CommunesUpdate, id: String): Observable<any> {

    const params = new HttpParams().set('id', id.toString());
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`  // Asegúrate de usar el formato adecuado para el token
    });


    return this.http.post(this.url.concat('/api/comunnes/web/update'), JSON.stringify(coordinator), { headers, params });
  }
}
