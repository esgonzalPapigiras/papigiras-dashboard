import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PassengerDTO } from 'app/models/passengerDTO';

@Injectable({
  providedIn: 'root'
})
export class AlumnsService {

  //url = 'https://stingray-app-9tqd9.ondigitalocean.app';
  //url = "https://ms-papigiras-app-ezkbu.ondigitalocean.app"
  url = 'http://localhost:8084';

  constructor(private http: HttpClient) { }

  public obtenerPasajeros(): Observable<PassengerDTO[]> {
    const headers = new HttpHeaders().set('Authorization', localStorage.getItem('token'));
    return this.http.get<PassengerDTO[]>(this.url.concat('/api/passenger/web/get/all'), { headers });
  }

}
