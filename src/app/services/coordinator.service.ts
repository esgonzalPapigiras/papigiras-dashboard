import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Coordinator } from 'app/models/coordinator';
import { ResponseUploadCoordinator } from 'app/models/responseUploadCoordinator';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoordinatorService {
  

  token = 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiJhdXRoVG9rZW4iLCJzdWIiOiJhcHBMYW5kZXJvcyIsImF1dGhvcml0aWVzIjpbIlJPTEVfVVNFUiJdLCJpYXQiOjE3Mzk3NTYyNTMsImV4cCI6MTc0MDYyMDI1M30.KzjMglLVW6Sy9IDI4xNoYf8SZU1NAlVCQRQhVZsAaig_c4N0or8JRYkKLv53i20e2I9EAE0GHlA_2bwAd8IDag';

  constructor(private http: HttpClient) { }


  public obtenerCoordinadores(): Observable<Coordinator[]> {
  
      const headers = new HttpHeaders().set('Authorization', this.token);
      return this.http.get<Coordinator[]>('https://ms-papigiras-app-ezkbu.ondigitalocean.app/api/coordinator/web/get', { headers })
  
  }

  public obtenerCoordinadoresUpdate(id:number): Observable<Coordinator[]> {
  
    const headers = new HttpHeaders().set('Authorization', this.token);
    const params = new HttpParams().set('id', id.toString());
    return this.http.get<Coordinator[]>('https://ms-papigiras-app-ezkbu.ondigitalocean.app/api/coordinator/web/get/byid', { headers ,params})

}

  public deleteCoordinador(id:number): Observable<any[]> {

    const headers = new HttpHeaders().set('Authorization', this.token);
    const params = new HttpParams().set('id', id.toString());
    return this.http.delete<any[]>('https://ms-papigiras-app-ezkbu.ondigitalocean.app/api/coordinator/web/delete', { headers, params })

}

public uploadFile(file: any): Observable<ResponseUploadCoordinator> {

  
  
  const formData = new FormData();
  formData.append('file', file, file.name);
  const headers = new HttpHeaders().set('Authorization', this.token); // Reemplazar con el token si es necesario

  return this.http.post<ResponseUploadCoordinator>('https://ms-papigiras-app-ezkbu.ondigitalocean.app/api/coordinator/web/upload', formData, { headers });
    
}

public coordinatorCreate(coordinator: Coordinator): Observable<any> {
  

  const url = 'https://ms-papigiras-app-ezkbu.ondigitalocean.app/api/coordinator/web/create';

  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${this.token}`  // Asegúrate de usar el formato adecuado para el token
  });

  return this.http.post(url, JSON.stringify(coordinator), { headers });
}


}
