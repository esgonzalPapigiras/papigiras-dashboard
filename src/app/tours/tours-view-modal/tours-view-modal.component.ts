import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { TripulationAvionDTO } from "app/models/avionList";
import { HotelDTOList } from "app/models/hotelList";
import { PassengerDTO } from "app/models/passengerList";
import { TourSalesDetail } from "app/models/toursalesdetail";
import { TripulationBus } from "app/models/tripulationBus";
import { TripulationsDTO } from "app/models/tripulations";
import { ToursServicesService } from "app/services/tours-services.service";
import Swal from "sweetalert2";
import { saveAs } from 'file-saver';

@Component({
  selector: "app-tours-view-modal",
  templateUrl: "./tours-view-modal.component.html",
  styleUrls: ["./tours-view-modal.component.scss"],
})
export class ToursViewModalComponent implements OnInit {




  dataSourceGira = new MatTableDataSource<TourSalesDetail>();
  dataSourceTripulantes = new MatTableDataSource<TripulationsDTO>();
  dataSourceAlumnos = new MatTableDataSource<PassengerDTO>();
  dataSourceAvion = new MatTableDataSource<TripulationAvionDTO>();
  dataSourceBus = new MatTableDataSource<TripulationBus>();
  dataSourceHotel = new MatTableDataSource<HotelDTOList>();

  displayedColumnsTripulantes: string[] = [
    "tourTripulationIdentificationId",
    "tourTripulationNameId",
    "tourTripulationDescriptionId",
    "tourTripulationPhoneId",
    "acciones",
  ];

  displayedColumnsGira: string[] = [
    "tourSalesUuid",
    "tourSalesStudentCount",
    "toursName",
    "tourDayQuantity",
    "tourNightQuantity",
    "cantidadHombres",
    "cantidadMujeres",
    "acompananteFemenino",
    "acompananteMasculino",
    "acciones",
  ];

  displayedColumnsAlumnos: string[] = [
    "passengersNames",
    "passengersFatherLastName",
    "passengersIdentification",
    "passengersSize",
    "passengersDiet",
    "namePassengersAttorney",
    "emailPassengersAttorney",
    "phonePassengersAttorney",
    "active",
    "acciones",
  ];








  @ViewChild('paginatorGira') paginatorGira: MatPaginator;
  @ViewChild('paginatorAlumn') paginatorAlumn: MatPaginator;
  @ViewChild('paginatorTripulante') paginatorTripulante: MatPaginator;
  @ViewChild('paginatorBuses') paginatorBuses: MatPaginator;
  @ViewChild('paginatorAvion') paginatorAvion: MatPaginator;
  @ViewChild('paginatorHotel') paginatorHotel: MatPaginator;

  @ViewChild('sort') sort: MatSort;
  @ViewChild('sortAlumn') sortAlumn: MatSort;
  @ViewChild('sortTripulante') sortTripulante: MatSort;
  @ViewChild('sortBuses') sortBuses: MatSort;
  @ViewChild('sortAvion') sortAvion: MatSort;
  @ViewChild('sortHotel') sortHotel: MatSort;

  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private girasServices: ToursServicesService
  ) {

  }

  ngOnInit(): void {
    this.obtenerDetalleGira();
    this.ObtenerListaAlumnos();
    this.obtenerListaTripulantes();
  }

  ngAfterViewInit() {
    // Asignación de paginator y sorter para cada tabla
    this.dataSourceGira.paginator = this.paginatorGira;
    this.dataSourceGira.sort = this.sort;

    this.dataSourceAlumnos.paginator = this.paginatorAlumn;
    this.dataSourceAlumnos.sort = this.sortAlumn;

    this.dataSourceTripulantes.paginator = this.paginatorTripulante;
    this.dataSourceTripulantes.sort = this.sortTripulante;
  }

  onTabChange(event) {
    if (event.index === 0) {
      this.obtenerDetalleGira();
    } else if (event.index === 1) {
      this.ObtenerListaAlumnos();
    } else if (event.index === 2) {
      this.obtenerListaTripulantes();
    }
  }




  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceGira.filter = filterValue.trim().toLowerCase();
  }

  obtenerDetalleGira() {
    Swal.fire({
      title: "Cargando...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
        this.girasServices.obtenerDetalleGira(this.data).subscribe((respon) => {

          this.dataSourceGira = new MatTableDataSource([respon]);
          this.dataSourceGira.paginator = this.paginatorGira;
          this.dataSourceGira.sort = this.sort;

          Swal.close();
        });
      },
    });
  }

  obtenerListaTripulantes() {
    Swal.fire({
      title: "Cargando...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
        this.girasServices.listaTripulantes(this.data).subscribe((respon) => {
          console.log(respon.length);
          this.dataSourceTripulantes = new MatTableDataSource(respon);
          this.dataSourceTripulantes.paginator = this.paginatorTripulante;
          this.dataSourceTripulantes.sort = this.sortTripulante;
          this.dataSourceTripulantes.paginator.length = respon.length;
          Swal.close();
        });
      },
    });
  }

  ObtenerListaAlumnos() {
    Swal.fire({
      title: "Cargando...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
        this.girasServices.listAlumn(this.data).subscribe((respon) => {

          this.dataSourceAlumnos = new MatTableDataSource(respon);
          this.dataSourceAlumnos.paginator = this.paginatorAlumn;

          this.dataSourceAlumnos.sort = this.sortAlumn;
          this.paginatorAlumn.length = respon.length;
          Swal.close();
        });
      },
    });
  }



  medicalRecord(row: any): void {
    Swal.fire({
      title: "Buscando el archivo...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
        this.girasServices.downloadDocumentMedical(this.data.tourSalesUuid, row.passengersIdentification).subscribe({
          next: (response) => {
            const blob = new Blob([response]);
            saveAs(blob, row.passengersIdentification);
            Swal.close();
          },
          error: (err) => {
            console.error('Error downloading the file: ', err);
            Swal.close();
          }
        });
      },
    });
  }


  obtenerListaBuses() {
    Swal.fire({
      title: "Cargando...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
        this.girasServices.listaBusGira(this.data).subscribe((respon) => {
          console.log(respon);
          this.dataSourceBus = new MatTableDataSource(respon);
          //this.dataSourceBus.paginator = this.paginator;
          this.dataSourceBus.sort = this.sort;
          Swal.close();
        });
      },
    });
  }

  obtenerListaAviones() {
    Swal.fire({
      title: "Cargando...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
        this.girasServices.listAvion(this.data).subscribe((respon) => {
          console.log(respon);
          this.dataSourceAvion = new MatTableDataSource(respon);
          //this.dataSourceAvion.paginator = this.paginator;
          this.dataSourceAvion.sort = this.sort;
          Swal.close();
        });
      },
    });
  }

  obtenerListaHoteles() {
    Swal.fire({
      title: "Cargando...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
        this.girasServices.listHotel(this.data).subscribe((respon) => {
          console.log(respon);
          this.dataSourceHotel = new MatTableDataSource(respon);
          //this.dataSourceHotel.paginator = this.paginator;
          this.dataSourceHotel.sort = this.sort;
          Swal.close();
        });
      },
    });
  }
}
