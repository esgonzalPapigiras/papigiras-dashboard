import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { statusTour } from 'app/models/statusTour';
import { Suppliers } from 'app/models/suppliers';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SuppliersService {

  token = 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiJhdXRoVG9rZW4iLCJzdWIiOiJhcHBMYW5kZXJvcyIsImF1dGhvcml0aWVzIjpbIlJPTEVfVVNFUiJdLCJpYXQiOjE3Mzk3NTYyNTMsImV4cCI6MTc0MDYyMDI1M30.KzjMglLVW6Sy9IDI4xNoYf8SZU1NAlVCQRQhVZsAaig_c4N0or8JRYkKLv53i20e2I9EAE0GHlA_2bwAd8IDag';
      
        constructor(private http: HttpClient) { }
      
      
        public obtenerSuppliers(): Observable<Suppliers[]> {
        
            const headers = new HttpHeaders().set('Authorization', localStorage.getItem('token'));
            return this.http.get<Suppliers[]>('https://ms-papigiras-app-ezkbu.ondigitalocean.app/api/suppliers/web/get', { headers })
        
        }
  
        public listStatusTour(): Observable<statusTour[]> {
        
          const headers = new HttpHeaders().set('Authorization', localStorage.getItem('token'));
          return this.http.get<statusTour[]>('https://ms-papigiras-app-ezkbu.ondigitalocean.app/api/suppliers/web/get', { headers })
      
      }
  
    
        public deletesuppliers(id:number): Observable<any[]> {
        
            const headers = new HttpHeaders().set('Authorization', localStorage.getItem('token'));
            const params = new HttpParams().set('id', id.toString());
            return this.http.delete<any[]>('https://ms-papigiras-app-ezkbu.ondigitalocean.app/api/suppliers/web/delete', { headers, params })
        
        }
    
    
        public suppliersCreate(coordinator: Suppliers): Observable<any> {
          
        
          const url = 'https://ms-papigiras-app-ezkbu.ondigitalocean.app/api/suppliers/web/create';
        
          const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`  // Asegúrate de usar el formato adecuado para el token
          });
        
          return this.http.post(url, JSON.stringify(coordinator), { headers });
        }
    
        public suppliersUpdate(coordinator: Suppliers,id:String): Observable<any> {
          
        
          const url = 'https://ms-papigiras-app-ezkbu.ondigitalocean.app/api/suppliers/web/update';
          const params = new HttpParams().set('id', id.toString());
          const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`  // Asegúrate de usar el formato adecuado para el token
          });
        
          return this.http.post(url, JSON.stringify(coordinator), { headers,params });
        }
}
