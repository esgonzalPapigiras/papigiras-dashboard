import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Coordinator } from 'app/models/coordinator';
import { ResponseUploadCoordinator } from 'app/models/responseUploadCoordinator';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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

  public obtenerCoordinadoresUpdate(id:number): Observable<Coordinator> {
  
    const headers = new HttpHeaders().set('Authorization', this.token);
    const params = new HttpParams().set('id', id.toString());
    return this.http.get<Coordinator>('https://ms-papigiras-app-ezkbu.ondigitalocean.app/api/coordinator/web/get/byid', { headers ,params})

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

public coordinatorUpdate(coordinator: Coordinator,id:number): Observable<any> {
  

  const url = 'https://ms-papigiras-app-ezkbu.ondigitalocean.app/api/coordinator/web/update';
  const params = new HttpParams().set('id', id.toString());
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${this.token}`  // Asegúrate de usar el formato adecuado para el token
  });

  return this.http.post(url, JSON.stringify(coordinator), { headers,params });
}

fetchImage(rut: string): Observable<Blob> {

  const url = `https://ms-papigiras-app-ezkbu.ondigitalocean.app/api/coordinator/web/images/${rut}`;
  
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${this.token}`
  });

  return this.http.get<Blob>(url, { headers, responseType: 'blob' as 'json' });
}

uploadDocumentsPicture(result: Uint8Array, name: string, rut: string, folder: string): Observable<any> {

  const url = 'https://ms-papigiras-app-ezkbu.ondigitalocean.app/api/tour/sales/web/s3/upload/picture';
  const formData = new FormData();

    // Agregar el archivo y los otros campos al formulario
    const file = new Blob([result], { type: 'application/octet-stream' });
    formData.append('file', file, name);
    formData.append('rut', rut);
    formData.append('folder', folder);

    // Configurar los encabezados de la solicitud
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}` // Si es necesario, agrega el token de autorización
    });

    // Realizar la solicitud POST para subir el archivo
    return this.http.post(url, formData, { headers });
}




}
