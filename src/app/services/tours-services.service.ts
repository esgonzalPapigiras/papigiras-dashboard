import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TripulationAvionDTO } from 'app/models/avionList';
import { HotelDTOList } from 'app/models/hotelList';
import { PassengerDTO } from 'app/models/passengerList';
import { TourSalesDTO } from 'app/models/tourSales';
import { TourSalesDetail } from 'app/models/toursalesdetail';
import { TripulationBus } from 'app/models/tripulationBus';
import { TripulationsDTO } from 'app/models/tripulations';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToursServicesService {

   token = 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiJhdXRoVG9rZW4iLCJzdWIiOiJhcHBMYW5kZXJvcyIsImF1dGhvcml0aWVzIjpbIlJPTEVfVVNFUiJdLCJpYXQiOjE3Mzc1ODY1NjIsImV4cCI6MTczODQ1MDU2Mn0.Fy2HJZTXV5-4V2K3VmFcP8I0zjgEilTGNy8S8GGs8WHhVpD6QYokbmNsIkhzQN1tMv-_Gj0r2FItgwHd1KQK0Q';

  constructor(private http: HttpClient) { }

  public obtenerGiras():Observable<TourSalesDTO[]>{

    const headers = new HttpHeaders().set('Authorization', this.token);
    return this.http.get<TourSalesDTO[]>('https://ms-papigiras-app-ezkbu.ondigitalocean.app/api/tour/sales/web/get', { headers })
    
  }

  public obtenerDetalleGira(id: number): Observable<TourSalesDetail> {
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });

    const params = new HttpParams().set('id', id.toString());

    return this.http.get<TourSalesDetail>('https://ms-papigiras-app-ezkbu.ondigitalocean.app/api/tour/sales/web/getDetails', { headers, params });
  }

  public listaBusGira(id: number): Observable<TripulationBus[]> {
     // Reemplaza con tu lógica para obtener el token dinámicamente

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });

    const params = new HttpParams().set('id', id.toString());

    return this.http.get<TripulationBus[]>('https://ms-papigiras-app-ezkbu.ondigitalocean.app/api/tour/sales/web/get/bus', { headers, params });
  }

  public listaTripulantes(id: number): Observable<TripulationsDTO[]> {
     // Reemplaza con tu lógica para obtener el token dinámicamente

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });

    const params = new HttpParams().set('id', id.toString());

    return this.http.get<TripulationsDTO[]>('https://ms-papigiras-app-ezkbu.ondigitalocean.app/api/tour/sales/web/get/tripulation', { headers, params });
  }

  public listHotel(id: number): Observable<HotelDTOList[]> {
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });

    const params = new HttpParams().set('id', id.toString());

    return this.http.get<HotelDTOList[]>('https://ms-papigiras-app-ezkbu.ondigitalocean.app/api/tour/sales/web/get/hotels', { headers, params });
  }

  public listAvion(id: number): Observable<TripulationAvionDTO[]> {
     // Reemplaza con tu lógica para obtener el token dinámicamente

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: this.token,
    });

    const params = new HttpParams().set('id', id.toString());

    return this.http.get<TripulationAvionDTO[]>('https://ms-papigiras-app-ezkbu.ondigitalocean.app/api/tour/sales/web/get/avion', { headers, params });
  }

  public listAlumn(id: number): Observable<PassengerDTO[]> {
    // Reemplaza con tu lógica para obtener el token dinámicamente

   const headers = new HttpHeaders({
     'Content-Type': 'application/json',
     Authorization: this.token,
   });

   const params = new HttpParams().set('id', id.toString());

   return this.http.get<PassengerDTO[]>('https://ms-papigiras-app-ezkbu.ondigitalocean.app/api/passenger/web/get/tour', { headers, params });
 }

}
