import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BestCoordinators } from 'app/models/bestCoordinator';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StadisticsService {

  token = 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiJhdXRoVG9rZW4iLCJzdWIiOiJhcHBMYW5kZXJvcyIsImF1dGhvcml0aWVzIjpbIlJPTEVfVVNFUiJdLCJpYXQiOjE3Mzg3NzUyNDgsImV4cCI6MTczOTYzOTI0OH0.K35EzwkL-9GIdI5PFWIlX7zwrzA1n-lcoJLPh58i1mbKXm-eU5dxEfOzH-4mEVDRxScWM6edrjmqjFisz_clug';
  
    constructor(private http: HttpClient) { }
  


    public listBuyYears(): Observable<{ [year: string]: number }> {
      // Reemplaza con tu lógica para obtener el token dinámicamente
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: this.token,
      });
    
      return this.http.get<{ [year: string]: number }>(
        'https://ms-papigiras-app-ezkbu.ondigitalocean.app/api/tour/sales/web/get/countbyyear',
        { headers}
      );
    }

    public countProgram(): Observable<String> {
      // Reemplaza con tu lógica para obtener el token dinámicamente
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: this.token,
      });
    
      return this.http.get<String>(
        'https://ms-papigiras-app-ezkbu.ondigitalocean.app/api/tours/web/get/count',
        { headers}
      );
    }

    public countClient(): Observable<String> {
      // Reemplaza con tu lógica para obtener el token dinámicamente
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: this.token,
      });
    
      return this.http.get<String>(
        'https://ms-papigiras-app-ezkbu.ondigitalocean.app/api/clients/web/get/count',
        { headers}
      );
    }

    public countAlumns(): Observable<String> {
      // Reemplaza con tu lógica para obtener el token dinámicamente
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: this.token,
      });
    
      return this.http.get<String>(
        'https://ms-papigiras-app-ezkbu.ondigitalocean.app/api/passenger/web/get/count',
        { headers}
      );
    }

    public countTours(): Observable<String> {
      // Reemplaza con tu lógica para obtener el token dinámicamente
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: this.token,
      });
    
      return this.http.get<String>(
        'https://ms-papigiras-app-ezkbu.ondigitalocean.app/api/tour/sales/web/get/count',
        { headers}
      );
    }

    public bestCoordinator(year:number): Observable<BestCoordinators[]> {
      // Reemplaza con tu lógica para obtener el token dinámicamente
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: this.token,
      });

      const params = new HttpParams().set('year', year.toString());
    
      return this.http.post<BestCoordinators[]>(
        'https://ms-papigiras-app-ezkbu.ondigitalocean.app/api/tour/sales/web/bestCoordinator',{},
        {headers,params}
      );
    }
}
