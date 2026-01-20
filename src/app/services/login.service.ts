import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  //url = 'https://stingray-app-9tqd9.ondigitalocean.app';
  url = 'http://localhost:8084';
  constructor(private http: HttpClient) { }

  /*
  login(email: string, password: string): Observable<any> {
    // Obtener el token de almacenamiento local
    const token = localStorage.getItem('token');

    if (!token) {
      return new Observable(observer => {
        observer.error('Token no disponible');
      });
    }

    // Crear los parámetros de la URL (email y password)
    const url = `https://ms-subete-app-hcp6a.ondigitalocean.app/api/user/web/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;

    // Configuración de los headers con el token
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` // Incluye el token correctamente
    });

    // Realizar la solicitud POST para login
    return this.http.post(url, {}, { headers });
  }
  */

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(this.url.concat('/api/auth/login'), { email, password });
  }

  token(): Observable<any> {
    // Construir la URL con el parámetro tokenKey en la query string
    const url = `https://ms-subete-app-hcp6a.ondigitalocean.app/api/token?tokenKey=appLanderos`;

    // Configurar los headers si es necesario
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Ajusta los encabezados según sea necesario
    });

    // Realizar la solicitud POST con los parámetros en la URL
    return this.http.post<any>(url, {}, { headers });
  }


}
