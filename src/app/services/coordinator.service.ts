import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Coordinator } from 'app/models/coordinator';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoordinatorService {

  token = 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiJhdXRoVG9rZW4iLCJzdWIiOiJhcHBMYW5kZXJvcyIsImF1dGhvcml0aWVzIjpbIlJPTEVfVVNFUiJdLCJpYXQiOjE3Mzg3NzUyNDgsImV4cCI6MTczOTYzOTI0OH0.K35EzwkL-9GIdI5PFWIlX7zwrzA1n-lcoJLPh58i1mbKXm-eU5dxEfOzH-4mEVDRxScWM6edrjmqjFisz_clug';

  constructor(private http: HttpClient) { }


  public obtenerCoordinadores(): Observable<Coordinator[]> {
  
      const headers = new HttpHeaders().set('Authorization', this.token);
      return this.http.get<Coordinator[]>('https://ms-papigiras-app-ezkbu.ondigitalocean.app/api/coordinator/web/get', { headers })
  
    }


}
