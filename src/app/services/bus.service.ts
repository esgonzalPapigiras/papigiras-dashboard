import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TripulationBus } from 'app/models/bus';
import { BusCreateUpdateDTO } from 'app/models/BusCreateUpdateDTO';
import { BusFullDTO } from 'app/models/BusFullDTO';
import { ResponseUploadBus } from 'app/models/ResponseUploadBus';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BusService {

  url = 'https://stingray-app-9tqd9.ondigitalocean.app';
  //url = 'http://localhost:8084';
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

  public obtenerBuses(): Observable<BusFullDTO[]> {
    const headers = new HttpHeaders().set('Authorization', localStorage.getItem('token'));
    return this.http.get<BusFullDTO[]>(this.url.concat('/api/buses/getAll'), { headers });
  }

  public obtenerBusUpdate(id: number): Observable<BusFullDTO> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    return this.http.get<BusFullDTO>(`${this.url}/api/buses/obtainBus/${id}`, { headers });
  }

  public updateBus(bus: BusFullDTO, id: number): Observable<BusFullDTO> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    return this.http.put<BusFullDTO>(`${this.url}/api/buses/updateBus/${id}`, bus, { headers });
  }

  public deleteBus(id: number): Observable<void> {
    const headers = new HttpHeaders({
      'Authorization': `${localStorage.getItem('token')}`
    });
    return this.http.delete<void>(`${this.url}/api/buses/delete/${id}`, { headers });
  }

  public removeBus(id: number): Observable<void> {
    const headers = new HttpHeaders({
      'Authorization': `${localStorage.getItem('token')}`
    });
    return this.http.delete<void>(`${this.url}/api/buses/remove/${id}`, { headers });
  }

  public createBus(bus: BusCreateUpdateDTO): Observable<BusFullDTO> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `${localStorage.getItem('token')}` });
    return this.http.post<BusFullDTO>(`${this.url}/api/buses/createBus`, bus, { headers });
  }

  public uploadFile(file: File): Observable<ResponseUploadBus> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    const headers = new HttpHeaders().set('Authorization', localStorage.getItem('token'));
    return this.http.post<ResponseUploadBus>(`${this.url}/api/buses/upload`, formData, { headers });
  }

}
