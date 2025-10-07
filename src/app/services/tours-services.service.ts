import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TripulationAvionDTO } from 'app/models/avionList';
import { CollegeList } from 'app/models/collegeList';
import { DocumentDTO } from 'app/models/document';
import { HotelDTOList } from 'app/models/hotelList';
import { PassengerDTO } from 'app/models/passengerList';
import { ResponseUploadService } from 'app/models/responseUploadService';
import { TourSalesDTO } from 'app/models/tourSales';
import { TourSalesDetail } from 'app/models/toursalesdetail';
import { TourSalesDetailWeb } from 'app/models/TourSalesDetailWeb';
import { TripulationBus } from 'app/models/tripulationBus';
import { TripulationBusDTO } from 'app/models/tripulationBusDTO';
import { TripulationsDTO } from 'app/models/tripulations';
import { catchError, map, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ToursServicesService {


  public eliminarBus(id: number,idTour:number) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('token'),
    });

    const params = new HttpParams()
  .set('id', id.toString())
  .set('idTour', idTour.toString());
    
    return this.http.delete<TripulationBusDTO[]>('https://ms-papigiras-app-ezkbu.ondigitalocean.app/api/tour/sales/web/delete/bus', { headers, params });
  }


  public actualizarBus(payload: TripulationBusDTO) {
    
    const url = 'https://ms-papigiras-app-ezkbu.ondigitalocean.app/api/tour/sales/web/update/bus';

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`  // Asegúrate de usar el formato adecuado para el token
    });

    return this.http.post(url, JSON.stringify(payload), { headers });
  }

  public updateTripulation(payload: TripulationsDTO) {
    
    const url = 'https://ms-papigiras-app-ezkbu.ondigitalocean.app/api/tour/sales/web/update/tripulation';

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`  // Asegúrate de usar el formato adecuado para el token
    });

    return this.http.post(url, JSON.stringify(payload), { headers });
  }

  public deleteTripulation(id: number,idTour:number) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('token'),
    });

    const params = new HttpParams()
  .set('id', id.toString())
  .set('idTour', idTour.toString());
    
    return this.http.delete<TripulationsDTO[]>('https://ms-papigiras-app-ezkbu.ondigitalocean.app/api/tour/sales/web/delete/tripulation', { headers, params });
  }

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

  public obtenerDetalleGiraWeb(id: number): Observable<TourSalesDetailWeb> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('token') || '',
    });

    const params = new HttpParams().set('id', id.toString());

    return this.http
      .get<TourSalesDetailWeb>(
        'https://ms-papigiras-app-ezkbu.ondigitalocean.app/api/tour/sales/web/getDetails',
        { headers, params }
      )
      .pipe(
        // 🔢 Calcula la suma aquí mismo
        map((d) => {
          const hombres = Number(d.cantidadHombres ?? 0);
          const mujeres = Number(d.cantidadMujeres ?? 0);
          const acompF = Number(d.acompananteFemenino ?? 0);
          const acompM = Number(d.acompananteMasculino ?? 0);

          const total = hombres + mujeres + acompF + acompM;

          return {
            ...d,
            totalParticipantes: Number.isFinite(total) && total > 0
              ? total
              : Number(d.tourSalesStudentCount ?? 0) // fallback si no vinieran los campos
          };
        })
      );
  }

  public listaBusGira(id: number): Observable<TripulationBusDTO[]> {
    // Reemplaza con tu lógica para obtener el token dinámicamente

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: localStorage.getItem('token'),
    });

    const params = new HttpParams().set('id', id.toString());

    return this.http.get<TripulationBusDTO[]>('https://ms-papigiras-app-ezkbu.ondigitalocean.app/api/tour/sales/web/get/bus', { headers, params });
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

  public uploadFileMasiveTour(file: any) {
    const formData = new FormData();
    formData.append('file', file, file.name);
    const headers = new HttpHeaders().set('Authorization', localStorage.getItem('token')); // Reemplazar con el token si es necesario

    return this.http.post<any>('https://ms-papigiras-app-ezkbu.ondigitalocean.app/api/tour/sales/web/upload/massive', formData, { headers });
  }

  public uploadFile(file: any, id_tour_sale: number): Observable<ResponsePassengerUpload> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('id_tour_sale', id_tour_sale.toString());
    const headers = new HttpHeaders().set('Authorization', localStorage.getItem('token')); // Reemplazar con el token si es necesario

    return this.http.post<ResponsePassengerUpload>('https://ms-papigiras-app-ezkbu.ondigitalocean.app/api/tour/sales/web/upload', formData, { headers });

  }

  uploadDocumentsExtra(
    result: Uint8Array,
    name: string,
    uuid: string,
    folder: string,
    tipoDoc: string
  ): Observable<any> {
    const formData = new FormData();

    // 1) Copia a un Uint8Array nuevo => su buffer es un ArrayBuffer "puro"
    const safeU8 = new Uint8Array(result.byteLength);
    safeU8.set(result);

    // 2) Puedes pasar el Uint8Array directamente (ArrayBufferView) o su buffer
    const blob = new Blob([safeU8], { type: 'application/octet-stream' });
    // Alternativa equivalente:
    // const blob = new Blob([safeU8.buffer], { type: 'application/octet-stream' });

    formData.append('file', blob, name);
    formData.append('Uuid', uuid);
    formData.append('folder', folder);
    formData.append('tipoDoc', tipoDoc);

    // No seteas Content-Type (FormData lo define con boundary)
    const token = localStorage.getItem('token') ?? '';
    const headers = token ? new HttpHeaders({ Authorization: token }) : undefined;

    return this.http.post(
      'https://ms-papigiras-app-ezkbu.ondigitalocean.app/api/tour/sales/web/s3/upload',
      formData,
      { headers }
    );
  }

  getDocument(id: number): Observable<DocumentDTO[]> {


    const url = `https://ms-papigiras-app-ezkbu.ondigitalocean.app/api/tour/sales/web/getDocument`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });

    const params = { idtour: id.toString() };

    return this.http.get<DocumentDTO[]>(url, { headers, params });

  }

  downloadDocument(name: string, supplier: any): Observable<any> {
    const url = `https://ms-papigiras-app-ezkbu.ondigitalocean.app/api/tour/sales/web/download`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });

    const params = new HttpParams()
      .set('folderName', name)
      .set('fileName', supplier);

    return this.http.get(url, { headers, params, responseType: 'arraybuffer' });
  }

  downloadDocumentMedical(name: string, idPassenger: string, supplier: any): Observable<any> {
    const url = `https://ms-papigiras-app-ezkbu.ondigitalocean.app/app/services/get/pdf/view/medical-recordscm`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });

    const params = new HttpParams()
      .set('tourId', name)
      .set('idPassenger', idPassenger)
      .set('identificacion', supplier);

    return this.http.get(url, { headers, params, responseType: 'arraybuffer' });
  }

  deleteDocument(name: string, supplier: any): Observable<any> {


    const url = `https://ms-papigiras-app-ezkbu.ondigitalocean.app/api/tour/sales/web/deleteDocument`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });

    console.log();
    const params = new HttpParams()
      .set('folderName', name)
      .set('fileName', supplier);

    return this.http.delete(url, { headers, params }).pipe(
      catchError(error => {
        console.error('Error deleting document:', error);
        throw new Error('Failed to delete document');
      })
    );
  }

  listPDF(id: number): Observable<ArrayBuffer> {
    const url = 'https://ms-papigiras-app-ezkbu.ondigitalocean.app/api/tour/sales/web/generate-pdf';
    const params = new HttpParams().set('id', id.toString());

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')
    });

    return this.http.get(url, {
      headers,
      params,
      responseType: 'arraybuffer'  // Recibir la respuesta como arraybuffer para el PDF
    });

  }

  public deleteGira(id: number): Observable<any[]> {

    const headers = new HttpHeaders().set('Authorization', localStorage.getItem('token'));
    const params = new HttpParams().set('id', id.toString());
    return this.http.delete<any>('https://ms-papigiras-app-ezkbu.ondigitalocean.app/api/tour/sales/web/delete', { headers, params })

  }

  public listCollege(): Observable<CollegeList[]> {

    const headers = new HttpHeaders().set('Authorization', localStorage.getItem('token'));
    return this.http.get<any>('https://ms-papigiras-app-ezkbu.ondigitalocean.app/api/comunnes/web/get/college', { headers })

  }

  public addAvion(objeto: TripulationAvionDTO, id: number): Observable<any> {

    const url = `https://ms-papigiras-app-ezkbu.ondigitalocean.app/api/tour/sales/web/create/avion?id=${id}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')  // Asegúrate de usar el formato adecuado para el token
    });

    return this.http.post(url, JSON.stringify(objeto), { headers });
  }

  public addBus(objeto: TripulationBus, id: number): Observable<any> {

    const url = `https://ms-papigiras-app-ezkbu.ondigitalocean.app/api/tour/sales/web/create/bus?id=${id}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')  // Asegúrate de usar el formato adecuado para el token
    });

    return this.http.post(url, JSON.stringify(objeto), { headers });
  }

  public addBusNew(objeto: TripulationBusDTO, id: number): Observable<any> {

    const url = `https://ms-papigiras-app-ezkbu.ondigitalocean.app/api/tour/sales/web/create/bus?id=${id}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')  // Asegúrate de usar el formato adecuado para el token
    });

    return this.http.post(url, JSON.stringify(objeto), { headers });
  }

  public tourCreate(tour: any): Observable<any> {


    const url = 'https://ms-papigiras-app-ezkbu.ondigitalocean.app/api/tour/sales/web/create';

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`  // Asegúrate de usar el formato adecuado para el token
    });

    return this.http.post(url, JSON.stringify(tour), { headers });
  }

  public addTripulation(objeto: TripulationsDTO, id: string): Observable<any> {

    const url = `https://ms-papigiras-app-ezkbu.ondigitalocean.app/api/tour/sales/web/create/tripulation?id=${id}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')  // Asegúrate de usar el formato adecuado para el token
    });

    return this.http.post(url, JSON.stringify(objeto), { headers });
  }

  public addTripulationNew(objeto: TripulationsDTO, id: string,confirma:boolean): Observable<any> {

    const url = `https://ms-papigiras-app-ezkbu.ondigitalocean.app/api/tour/sales/web/create/tripulation?id=${id}&confirma=${confirma}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('token')  // Asegúrate de usar el formato adecuado para el token
    });

    return this.http.post(url, JSON.stringify(objeto), { headers });
  }




}
