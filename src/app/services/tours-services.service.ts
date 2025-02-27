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
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ToursServicesService {


  token = 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiJhdXRoVG9rZW4iLCJzdWIiOiJhcHBMYW5kZXJvcyIsImF1dGhvcml0aWVzIjpbIlJPTEVfVVNFUiJdLCJpYXQiOjE3Mzk3NTYyNTMsImV4cCI6MTc0MDYyMDI1M30.KzjMglLVW6Sy9IDI4xNoYf8SZU1NAlVCQRQhVZsAaig_c4N0or8JRYkKLv53i20e2I9EAE0GHlA_2bwAd8IDag';

  constructor(private http: HttpClient) { }

  public obtenerGiras(): Observable<TourSalesDTO[]> {

    const headers = new HttpHeaders().set('Authorization', localStorage.getItem('token'));
    return this.http.get<TourSalesDTO[]>('https://ms-papigiras-app-ezkbu.ondigitalocean.app/api/tour/sales/web/get', { headers })

  }

  public obtenerDetalleGira(id: number): Observable<TourSalesDetail> {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('token'),
    });

    const params = new HttpParams().set('id', id.toString());

    return this.http.get<TourSalesDetail>('https://ms-papigiras-app-ezkbu.ondigitalocean.app/api/tour/sales/web/getDetails', { headers, params });
  }

  public listaBusGira(id: number): Observable<TripulationBus[]> {
    // Reemplaza con tu lógica para obtener el token dinámicamente

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('token'),
    });

    const params = new HttpParams().set('id', id.toString());

    return this.http.get<TripulationBus[]>('https://ms-papigiras-app-ezkbu.ondigitalocean.app/api/tour/sales/web/get/bus', { headers, params });
  }

  public listaTripulantes(id: number): Observable<TripulationsDTO[]> {
    // Reemplaza con tu lógica para obtener el token dinámicamente

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('token'),
    });

    const params = new HttpParams().set('id', id.toString());

    return this.http.get<TripulationsDTO[]>('https://ms-papigiras-app-ezkbu.ondigitalocean.app/api/tour/sales/web/get/tripulation', { headers, params });
  }

  public listHotel(id: number): Observable<HotelDTOList[]> {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('token'),
    });

    const params = new HttpParams().set('id', id.toString());

    return this.http.get<HotelDTOList[]>('https://ms-papigiras-app-ezkbu.ondigitalocean.app/api/tour/sales/web/get/hotels', { headers, params });
  }

  public listAvion(id: number): Observable<TripulationAvionDTO[]> {
    // Reemplaza con tu lógica para obtener el token dinámicamente

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('token'),
    });

    const params = new HttpParams().set('id', id.toString());

    return this.http.get<TripulationAvionDTO[]>('https://ms-papigiras-app-ezkbu.ondigitalocean.app/api/tour/sales/web/get/avion', { headers, params });
  }

  public listAlumn(id: number): Observable<PassengerDTO[]> {
    // Reemplaza con tu lógica para obtener el token dinámicamente

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('token'),
    });

    const params = new HttpParams().set('id', id.toString());

    return this.http.get<PassengerDTO[]>('https://ms-papigiras-app-ezkbu.ondigitalocean.app/api/passenger/web/get/tour', { headers, params });
  }

  public uploadFile(file: any, id_tour_sale: number): Observable<ResponsePassengerUpload> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('id_tour_sale', id_tour_sale.toString());
    const headers = new HttpHeaders().set('Authorization', localStorage.getItem('token')); // Reemplazar con el token si es necesario

    return this.http.post<ResponsePassengerUpload>('https://ms-papigiras-app-ezkbu.ondigitalocean.app/api/tour/sales/web/upload', formData, { headers });
      
  }

  

  
}
