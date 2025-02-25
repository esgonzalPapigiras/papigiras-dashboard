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

  token = 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiJhdXRoVG9rZW4iLCJzdWIiOiJhcHBMYW5kZXJvcyIsImF1dGhvcml0aWVzIjpbIlJPTEVfVVNFUiJdLCJpYXQiOjE3Mzk3NTYyNTMsImV4cCI6MTc0MDYyMDI1M30.KzjMglLVW6Sy9IDI4xNoYf8SZU1NAlVCQRQhVZsAaig_c4N0or8JRYkKLv53i20e2I9EAE0GHlA_2bwAd8IDag';
    
      constructor(private http: HttpClient) { }
    
    
      public obtenerActividades(): Observable<ActivitiesDTOList[]> {
      
          const headers = new HttpHeaders().set('Authorization', this.token);
          return this.http.get<ActivitiesDTOList[]>('https://ms-papigiras-app-ezkbu.ondigitalocean.app/api/activities/web/get', { headers })
      
      }

      public listStatusTour(): Observable<statusTour[]> {
      
        const headers = new HttpHeaders().set('Authorization', this.token);
        return this.http.get<statusTour[]>('https://ms-papigiras-app-ezkbu.ondigitalocean.app/api/activities/web/get', { headers })
    
    }

  
      public deleteActivities(id:number): Observable<any[]> {
      
          const headers = new HttpHeaders().set('Authorization', this.token);
          const params = new HttpParams().set('id', id.toString());
          return this.http.delete<any[]>('https://ms-papigiras-app-ezkbu.ondigitalocean.app/api/activities/web/delete', { headers, params })
      
      }
  
  
      public activitiesCreate(coordinator: Activities): Observable<any> {
        
      
        const url = 'https://ms-papigiras-app-ezkbu.ondigitalocean.app/api/activities/web/create';
      
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`  // Asegúrate de usar el formato adecuado para el token
        });
      
        return this.http.post(url, JSON.stringify(coordinator), { headers });
      }
  
      public activitiesUpdate(coordinator: Activities,id:String): Observable<any> {
        
      
        const url = 'https://ms-papigiras-app-ezkbu.ondigitalocean.app/api/activities/web/update';
        const params = new HttpParams().set('id', id.toString());
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`  // Asegúrate de usar el formato adecuado para el token
        });
      
        return this.http.post(url, JSON.stringify(coordinator), { headers,params });
      }
}
