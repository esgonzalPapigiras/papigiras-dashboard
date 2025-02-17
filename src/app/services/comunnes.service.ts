import { HttpClient, HttpHeaders } from '@angular/common/http';
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
}
