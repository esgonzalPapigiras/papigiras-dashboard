import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TripulationBus } from 'app/models/bus';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BusService {

  url = 'https://stingray-app-9tqd9.ondigitalocean.app';
  //url = "https://ms-papigiras-app-ezkbu.ondigitalocean.app"
  constructor(private http: HttpClient) { }

  public obtenerBus(): Observable<TripulationBus[]> {

    const headers = new HttpHeaders().set('Authorization', localStorage.getItem('token'));
    return this.http.get<TripulationBus[]>(this.url.concat('/api/coordinator/web/get'), { headers })

  }

  public busAdd(coordinator: TripulationBus): Observable<any> {
  
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`  // Asegúrate de usar el formato adecuado para el token
    });
  
    return this.http.post(this.url.concat('/api/coordinator/web/create'), JSON.stringify(coordinator), { headers });
  }


}
