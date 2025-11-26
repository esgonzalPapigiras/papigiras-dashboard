import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PassengerDTO } from 'app/models/passengerDTO';
import { ResponseUploadPassenger } from 'app/models/ResponseUploadPassenger';

@Injectable({
  providedIn: 'root'
})
export class AlumnsService {

  url = 'https://stingray-app-9tqd9.ondigitalocean.app';
  //url = 'http://localhost:8084';

  constructor(private http: HttpClient) { }

  public obtenerPasajeros(): Observable<PassengerDTO[]> {
    const headers = new HttpHeaders().set('Authorization', localStorage.getItem('token'));
    return this.http.get<PassengerDTO[]>(this.url.concat('/api/passenger/web/get/all'), { headers });
  }

  public uploadFile(file: File): Observable<ResponseUploadPassenger> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    const headers = new HttpHeaders().set('Authorization', localStorage.getItem('token'));
    return this.http.post<ResponseUploadPassenger>(`${this.url}/api/passenger/web/upload`, formData, { headers });
  }

}
