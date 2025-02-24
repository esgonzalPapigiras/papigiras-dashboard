import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Communes } from 'app/models/communes';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComunnesService {

  token = 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiJhdXRoVG9rZW4iLCJzdWIiOiJhcHBMYW5kZXJvcyIsImF1dGhvcml0aWVzIjpbIlJPTEVfVVNFUiJdLCJpYXQiOjE3Mzk3NTYyNTMsImV4cCI6MTc0MDYyMDI1M30.KzjMglLVW6Sy9IDI4xNoYf8SZU1NAlVCQRQhVZsAaig_c4N0or8JRYkKLv53i20e2I9EAE0GHlA_2bwAd8IDag';
  
    constructor(private http: HttpClient) { }
  
  
    public ObtenerCommunes(): Observable<Communes[]> {
    
        const headers = new HttpHeaders().set('Authorization', this.token);
        return this.http.get<Communes[]>('https://ms-papigiras-app-ezkbu.ondigitalocean.app/api/comunnes/web/get', { headers })
    
    }

    public deleteCommunes(id:number): Observable<any[]> {
    
      const headers = new HttpHeaders().set('Authorization', this.token);
      const params = new HttpParams().set('id', id.toString());
      return this.http.delete<any[]>('https://ms-papigiras-app-ezkbu.ondigitalocean.app/api/comunnes/web/delete', { headers, params })
  
  }

  public obtenerCommunesUpdate(id:number): Observable<Communes> {
    
      const headers = new HttpHeaders().set('Authorization', this.token);
      const params = new HttpParams().set('id', id.toString());
      return this.http.get<Communes>('https://ms-papigiras-app-ezkbu.ondigitalocean.app/api/comunnes/web/get/byid', { headers ,params})
  
  }

  public communesCreate(coordinator: Communes): Observable<any> {
    
  
    const url = 'https://ms-papigiras-app-ezkbu.ondigitalocean.app/api/comunnes/web/create';
  
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`  // Asegúrate de usar el formato adecuado para el token
    });
  
    return this.http.post(url, JSON.stringify(coordinator), { headers });
  }

  public communesCreateUpdate(coordinator: Communes): Observable<any> {
    
  
    const url = 'https://ms-papigiras-app-ezkbu.ondigitalocean.app/api/comunnes/web/update';
  
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`  // Asegúrate de usar el formato adecuado para el token
    });
  
    return this.http.post(url, JSON.stringify(coordinator), { headers });
  }
}
