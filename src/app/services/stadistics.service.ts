import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BestCoordinators } from 'app/models/bestCoordinator';
import { CoordinatorReportDTO } from 'app/models/CoordinatorReportDTO';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StadisticsService {

  token = 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiJhdXRoVG9rZW4iLCJzdWIiOiJhcHBMYW5kZXJvcyIsImF1dGhvcml0aWVzIjpbIlJPTEVfVVNFUiJdLCJpYXQiOjE3Mzk3NTYyNTMsImV4cCI6MTc0MDYyMDI1M30.KzjMglLVW6Sy9IDI4xNoYf8SZU1NAlVCQRQhVZsAaig_c4N0or8JRYkKLv53i20e2I9EAE0GHlA_2bwAd8IDag';
  url = 'https://stingray-app-9tqd9.ondigitalocean.app';
  //url = "https://ms-papigiras-app-ezkbu.ondigitalocean.app"
  //url = 'http://localhost:8084';
  constructor(private http: HttpClient) { }



  public listBuyYears(): Observable<{ [year: string]: number }> {
    // Reemplaza con tu lógica para obtener el token dinámicamente
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('token'),
    });

    return this.http.get<{ [year: string]: number }>(
      this.url.concat('/api/tour/sales/web/get/countbyyear'),
      { headers }
    );
  }

  public countProgram(): Observable<String> {
    // Reemplaza con tu lógica para obtener el token dinámicamente
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('token'),
    });

    return this.http.get<String>(
      this.url.concat('/api/tours/web/get/count'),
      { headers }
    );
  }

  public countClient(): Observable<String> {
    // Reemplaza con tu lógica para obtener el token dinámicamente
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('token'),
    });

    return this.http.get<String>(
      this.url.concat('/api/clients/web/get/count'),
      { headers }
    );
  }

  public countAlumns(): Observable<String> {
    // Reemplaza con tu lógica para obtener el token dinámicamente
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('token'),
    });

    return this.http.get<String>(
      this.url.concat('/api/passenger/web/get/count'),
      { headers }
    );
  }

  public countTours(): Observable<String> {
    // Reemplaza con tu lógica para obtener el token dinámicamente
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('token'),
    });

    return this.http.get<String>(
      this.url.concat('/api/tour/sales/web/get/count'),
      { headers }
    );
  }

  public bestCoordinator(year: number): Observable<BestCoordinators[]> {
    // Reemplaza con tu lógica para obtener el token dinámicamente
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('token'),
    });

    const params = new HttpParams().set('year', year.toString());

    return this.http.post<BestCoordinators[]>(
      this.url.concat('/api/tour/sales/web/bestCoordinator'),
      {},
      { headers, params }
    );
  }

  public getCoordinatorReport() {
    const headers = new HttpHeaders().set('Authorization', localStorage.getItem('token'))
    return this.http.get<CoordinatorReportDTO[]>(this.url.concat('/api/coordinator/web/get/report'), { headers })
  }
}
