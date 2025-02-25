import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Program } from 'app/models/program';
import { TourActivities } from 'app/models/tourActivities';
import { TourPackage } from 'app/models/tourPackage';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProgramsService {

  token = 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiJhdXRoVG9rZW4iLCJzdWIiOiJhcHBMYW5kZXJvcyIsImF1dGhvcml0aWVzIjpbIlJPTEVfVVNFUiJdLCJpYXQiOjE3Mzk3NTYyNTMsImV4cCI6MTc0MDYyMDI1M30.KzjMglLVW6Sy9IDI4xNoYf8SZU1NAlVCQRQhVZsAaig_c4N0or8JRYkKLv53i20e2I9EAE0GHlA_2bwAd8IDag';

  constructor(private http: HttpClient) { }


  public obtenerProgram(): Observable<Program[]> {

    const headers = new HttpHeaders().set('Authorization', this.token);
    return this.http.get<Program[]>('https://ms-papigiras-app-ezkbu.ondigitalocean.app/api/tours/web/get', { headers })

  }




  public deleteProgram(id: number): Observable<any[]> {

    const headers = new HttpHeaders().set('Authorization', this.token);
    const params = new HttpParams().set('id', id.toString());
    return this.http.delete<any[]>('https://ms-papigiras-app-ezkbu.ondigitalocean.app/api/tours/web/delete', { headers, params })

  }


  public programCreate(coordinator: Program): Observable<any> {


    const url = 'https://ms-papigiras-app-ezkbu.ondigitalocean.app/api/tours/web/create';

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`  // Asegúrate de usar el formato adecuado para el token
    });

    return this.http.post(url, JSON.stringify(coordinator), { headers });
  }

  public programUpdate(coordinator: Program, id: String): Observable<any> {


    const url = 'https://ms-papigiras-app-ezkbu.ondigitalocean.app/api/tours/web/update';
    const params = new HttpParams().set('id', id.toString());
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`  // Asegúrate de usar el formato adecuado para el token
    });

    return this.http.post(url, JSON.stringify(coordinator), { headers, params });
  }

  public addProgramPackage(tourPackage: TourPackage, id: String): Observable<any> {


    const url = 'https://ms-papigiras-app-ezkbu.ondigitalocean.app/api/touradd/web/package/create';
    const params = new HttpParams().set('id', id.toString());
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`  // Asegúrate de usar el formato adecuado para el token
    });

    return this.http.post(url, JSON.stringify(tourPackage), { headers, params });
  }

  public addProgramActivities(tourActivities: TourActivities, id: String): Observable<any> {


    const url = 'https://ms-papigiras-app-ezkbu.ondigitalocean.app/api/touradd/web/activities/create';
    const params = new HttpParams().set('id', id.toString());
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`  // Asegúrate de usar el formato adecuado para el token
    });

    return this.http.post(url, JSON.stringify(tourActivities), { headers, params });
  }

  public listActivitiesProgram(id: String): Observable<Program[]> {

    const headers = new HttpHeaders().set('Authorization', this.token);
    const params = new HttpParams().set('id', id.toString());
    return this.http.get<Program[]>('https://ms-papigiras-app-ezkbu.ondigitalocean.app/api/touradd/web/activities/getlist', { headers,params })

  }

  public activitiesProgramDeleteList(id: number): Observable<any[]> {

    const headers = new HttpHeaders().set('Authorization', this.token);
    const params = new HttpParams().set('id', id.toString());
    return this.http.delete<any[]>('https://ms-papigiras-app-ezkbu.ondigitalocean.app/api/touradd/web/activities/deleteList', { headers, params })

  }


}
