import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Branch } from 'app/models/branch';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BranchService {

  token = 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiJhdXRoVG9rZW4iLCJzdWIiOiJhcHBMYW5kZXJvcyIsImF1dGhvcml0aWVzIjpbIlJPTEVfVVNFUiJdLCJpYXQiOjE3Mzk3NTYyNTMsImV4cCI6MTc0MDYyMDI1M30.KzjMglLVW6Sy9IDI4xNoYf8SZU1NAlVCQRQhVZsAaig_c4N0or8JRYkKLv53i20e2I9EAE0GHlA_2bwAd8IDag';
  
    constructor(private http: HttpClient) { }
  
  
    public obtenerCoordinadores(): Observable<Branch[]> {
    
        const headers = new HttpHeaders().set('Authorization', this.token);
        return this.http.get<Branch[]>('https://ms-papigiras-app-ezkbu.ondigitalocean.app/api/branches/web/get', { headers })
    
    }
}
