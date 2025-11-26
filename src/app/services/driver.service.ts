import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TripulationsDTO } from 'app/models/driver';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DriverService {

  url = 'https://stingray-app-9tqd9.ondigitalocean.app';
  //url = 'http://localhost:8084';
  constructor(private http: HttpClient) { }

  public obtenerConductores(): Observable<TripulationsDTO[]> {

    const headers = new HttpHeaders().set('Authorization', localStorage.getItem('token'));
    return this.http.get<TripulationsDTO[]>(this.url.concat('/api/coordinator/web/get'), { headers })

  }

  public conductorAdd(coordinator: TripulationsDTO): Observable<any> {
  
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`  // Asegúrate de usar el formato adecuado para el token
    });
  
    return this.http.post(this.url.concat('/api/coordinator/web/create'), JSON.stringify(coordinator), { headers });
  }
}
