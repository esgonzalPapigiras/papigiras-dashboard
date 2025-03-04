import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TripulationBus } from 'app/models/bus';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BusService {

  constructor(private http: HttpClient) { }

  public obtenerBus(): Observable<TripulationBus[]> {

    const headers = new HttpHeaders().set('Authorization', localStorage.getItem('token'));
    return this.http.get<TripulationBus[]>('https://ms-papigiras-app-ezkbu.ondigitalocean.app/api/coordinator/web/get', { headers })

  }

  public busAdd(coordinator: TripulationBus): Observable<any> {
    
  
    const url = 'https://ms-papigiras-app-ezkbu.ondigitalocean.app/api/coordinator/web/create';
  
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`  // Asegúrate de usar el formato adecuado para el token
    });
  
    return this.http.post(url, JSON.stringify(coordinator), { headers });
  }


}
