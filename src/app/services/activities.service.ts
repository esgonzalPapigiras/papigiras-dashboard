import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Activities } from 'app/models/activities';
import { ActivitiesDTOList } from 'app/models/activitiesList';
import { statusTour } from 'app/models/statusTour';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActivitiesService {

  //url = 'https://stingray-app-9tqd9.ondigitalocean.app';
  //url = "https://ms-papigiras-app-ezkbu.ondigitalocean.app"
  url = 'http://localhost:8084';
  constructor(private http: HttpClient) { }


  public obtenerActividades(): Observable<ActivitiesDTOList[]> {
    const headers = new HttpHeaders().set('Authorization', localStorage.getItem('token'));
    return this.http.get<ActivitiesDTOList[]>(this.url.concat('/api/activities/web/get'), { headers })

  }

  public listStatusTour(): Observable<statusTour[]> {
    const headers = new HttpHeaders().set('Authorization', localStorage.getItem('token'));
    return this.http.get<statusTour[]>(this.url.concat('/api/activities/web/get'), { headers })

  }

  public deleteActivities(id: number): Observable<any[]> {
    const headers = new HttpHeaders().set('Authorization', localStorage.getItem('token'));
    const params = new HttpParams().set('id', id.toString());
    return this.http.delete<any[]>(this.url.concat('/api/activities/web/delete'), { headers, params })

  }


  public activitiesCreate(coordinator: Activities): Observable<any> {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`  // Asegúrate de usar el formato adecuado para el token
    });

    return this.http.post(this.url.concat('/api/activities/web/create'), JSON.stringify(coordinator), { headers });
  }

  public activitiesUpdate(coordinator: Activities, id: String): Observable<any> {
    const params = new HttpParams().set('id', id.toString());
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`  // Asegúrate de usar el formato adecuado para el token
    });

    return this.http.post(this.url.concat('/api/activities/web/update'), JSON.stringify(coordinator), { headers, params });
  }
}
