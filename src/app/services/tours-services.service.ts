import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TourSalesDTO } from 'app/models/tourSales';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToursServicesService {

  constructor(private http: HttpClient) { }

  public obtenerGiras():Observable<TourSalesDTO[]>{

    const headers = new HttpHeaders().set('Authorization', `Bearer eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiJhdXRoVG9rZW4iLCJzdWIiOiJhcHBMYW5kZXJvcyIsImF1dGhvcml0aWVzIjpbIlJPTEVfVVNFUiJdLCJpYXQiOjE3Mzc1ODY1NjIsImV4cCI6MTczODQ1MDU2Mn0.Fy2HJZTXV5-4V2K3VmFcP8I0zjgEilTGNy8S8GGs8WHhVpD6QYokbmNsIkhzQN1tMv-_Gj0r2FItgwHd1KQK0Q`);
    return this.http.get<TourSalesDTO[]>('https://ms-papigiras-app-ezkbu.ondigitalocean.app/api/tour/sales/web/get', { headers })
    
  }

}
