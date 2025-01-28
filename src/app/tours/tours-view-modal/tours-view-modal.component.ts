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

  
  


  


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private girasServices: ToursServicesService
  ) {
    console.log(data);
  }

  ngOnInit(): void {
    this.obtenerDetalleGira();
    this.obtenerListaTripulantes();
    this.ObtenerListaAlumnos();
  }

  ngAfterViewInit() {
    
    this.dataSourceAlumnos.sort = this.sort;
    this.dataSourceAlumnos.paginator = this.paginator;
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
          this.dataSourceGira.paginator = this.paginator;
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
          this.dataSourceTripulantes = new MatTableDataSource(respon);
          this.dataSourceTripulantes.paginator = this.paginator;
          this.dataSourceTripulantes.sort = this.sort;
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
          this.dataSourceAlumnos.paginator = this.paginator;
          this.dataSourceAlumnos.sort = this.sort;
          Swal.close();
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
          this.dataSourceBus = new MatTableDataSource(respon);
          this.dataSourceBus.paginator = this.paginator;
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
          this.dataSourceAvion = new MatTableDataSource(respon);
          this.dataSourceAvion.paginator = this.paginator;
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
          this.dataSourceHotel = new MatTableDataSource(respon);
          this.dataSourceHotel.paginator = this.paginator;
          this.dataSourceHotel.sort = this.sort;
          Swal.close();
        });
      },
    });
  }
}
