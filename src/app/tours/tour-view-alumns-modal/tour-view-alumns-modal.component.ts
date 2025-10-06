import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { saveAs } from 'file-saver';
import { PassengerDTO } from 'app/models/passengerList';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ToursServicesService } from 'app/services/tours-services.service';
import { catchError, finalize, of, tap } from 'rxjs';

@Component({
  selector: 'app-tour-view-alumns-modal',
  templateUrl: './tour-view-alumns-modal.component.html',
  styleUrls: ['./tour-view-alumns-modal.component.scss']
})
export class TourViewAlumnsModalComponent implements OnInit, AfterViewInit {

  dataSourceAlumnos = new MatTableDataSource<PassengerDTO>([]);
  displayedColumnsAlumnos: string[] = [
    'passengersIdentification',
    'passengersNames',
    'passengersFatherLastName',
    'passengersSize',
    'passengersDiet',
    'namePassengersAttorney',
    'emailPassengersAttorney',
    'phonePassengersAttorney',
    'active',
    'acciones',
  ];

  @ViewChild(MatPaginator) paginatorAlumn!: MatPaginator;
  @ViewChild(MatSort) sortAlumn!: MatSort;

  total = 0;

  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data,
    private girasServices: ToursServicesService
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.dataSourceAlumnos.paginator = this.paginatorAlumn;
    this.dataSourceAlumnos.sort = this.sortAlumn;
    this.ObtenerListaAlumnos();
    this.refreshCounts();
  }

  ObtenerListaAlumnos(): void {
    Swal.fire({ title: 'Cargando...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

    this.girasServices.listAlumn(this.data.id).pipe(
      tap((respon: PassengerDTO[] | null | undefined) => {
        this.dataSourceAlumnos.data = respon ?? [];
        // reasegurar refs
        this.dataSourceAlumnos.paginator = this.paginatorAlumn;
        this.dataSourceAlumnos.sort = this.sortAlumn;
      }),
      catchError(err => {
        console.error('Error listAlumn:', err);
        this.dataSourceAlumnos.data = [];
        return of([]);
      }),
      finalize(() => Swal.close())
    ).subscribe();
  }

  refreshCounts(): void {
    console.log('data ')
    this.girasServices.obtenerDetalleGira(this.data.id).subscribe({
      next: (detalle) => {
        console.log(detalle)
        this.data.detalle = detalle;
        this.total = this.calcTotalParticipantes(detalle) || Number(detalle?.tourSalesStudentCount || 0);
        console.log(this.data.detalle)
        console.log(this.total)
      },
      error: (e) => console.error('Error al obtener detalle de gira', e),
    });
  }

  private calcTotalParticipantes(d: any): number {
    const h = Number(d?.cantidadHombres ?? 0);
    const m = Number(d?.cantidadMujeres ?? 0);
    const af = Number(d?.acompananteFemenino ?? 0);
    const am = Number(d?.acompananteMasculino ?? 0);
    const sum = h + m + af + am;
    return Number.isFinite(sum) && sum > 0 ? sum : 0;
  }


  // ==== Stubs para evitar errores del template ====
  voucherRecord(_row: PassengerDTO): void {
    // TODO: implementar si lo necesitas
  }
  openViewDialog(_row: PassengerDTO): void {
    // TODO
  }
  deleteAction(_row: PassengerDTO): void {
    // TODO
  }
}
