import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToursViewModalComponent } from '../tours-view-modal/tours-view-modal.component';
import { TourSalesDTO } from 'app/models/tourSales';
import Swal from 'sweetalert2';
import { ToursServicesService } from 'app/services/tours-services.service';
import { TourDonwloadAlumnsModalComponent } from '../tour-donwload-alumns-modal/tour-donwload-alumns-modal.component';
import { TourAddBusModalComponent } from '../tour-add-bus-modal/tour-add-bus-modal.component';
import { TourAddDriverModalComponent } from '../tour-add-driver-modal/tour-add-driver-modal.component';
import { TourAddCoordinatorModalComponent } from '../tour-add-coordinator-modal/tour-add-coordinator-modal.component';
import { TourAddHotelModalComponent } from '../tour-add-hotel-modal/tour-add-hotel-modal.component';
import { TourAddDocumentModalComponent } from '../tour-add-document-modal/tour-add-document-modal.component';
import { TourDownloadDocumentModalComponent } from '../tour-download-document-modal/tour-download-document-modal.component';
import { TourAddAirplaneModalComponent } from '../tour-add-airplane-modal/tour-add-airplane-modal.component';
import { saveAs } from 'file-saver';
import { NewTourModalComponent } from '../new-tour-modal/new-tour-modal.component';
import { TourViewAlumnsModalComponent } from '../tour-view-alumns-modal/tour-view-alumns-modal.component';

// RXJS
import { forkJoin, of } from 'rxjs';
import { catchError, finalize, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-tours',
  templateUrl: './tours.component.html',
  styleUrls: ['./tours.component.scss']
})
export class ToursComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = ['tourSalesUuid', 'tourSalesInit', 'tourSalesFinal', 'collegeName', 'addCourse', 'acciones'];
  dataSource = new MatTableDataSource<TourSalesDTO>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @ViewChild('fileInput') fileInput: any;
  @ViewChild('fileInputContract') fileInputContract: any;
  @ViewChild('fileInputPoliciHealth') fileInputPoliciHealth: any;
  @ViewChild('fileInputProgram') fileInputProgram: any;

  // Estados auxiliares
  isUploading = false;
  private id: number;     // para upload de alumnos (por compatibilidad con tu servicio)
  private uuid: string;   // para uploads de documentos extra

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    public dialog: MatDialog,
    private girasServices: ToursServicesService,
  ) {}

  ngOnInit() {
    this.obtenerGiras();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  obtenerGiras() {
    Swal.fire({
      title: 'Cargando...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
        this.girasServices.obtenerGiras().pipe(
          tap((respon: TourSalesDTO[]) => {
            this.dataSource = new MatTableDataSource(respon);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }),
          // Enriquecemos cada fila con el detalle para calcular alumnosCount
          switchMap(() => {
            const rows = this.dataSource.data ?? [];
            if (!rows.length) return of(null);

            const tasks = rows.map(row =>
              this.girasServices.obtenerDetalleGira(row.tourSalesId).pipe(
                tap(detalle => {
                  (row as any).detalle = detalle;
                  (row as any).alumnosCount = this.calcTotalParticipantes(detalle);
                  (row as any).addAlumnListDoc = ((row as any).alumnosCount ?? 0) > 0;
                }),
                catchError(err => {
                  console.error('Detalle falla para tourSalesId:', row.tourSalesId, err);
                  (row as any).addAlumnListDoc = false;
                  (row as any).alumnosCount = 0;
                  return of(null);
                })
              )
            );

            return forkJoin(tasks);
          }),
          finalize(() => Swal.close())
        ).subscribe();
      },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openViewDialog(row: any): void {
    this.dialog.open(ToursViewModalComponent, {
      width: '1300px',
      height: '600px',
      data: row.tourSalesId
    });
  }

  openViewDialogAvion(row: any): void {
    this.dialog.open(TourAddAirplaneModalComponent, {
      width: '1300px',
      height: '600px',
      data: row.tourSalesId
    });
  }

  openViewDialogAlumn(row: any): void {
    this.fileInput.nativeElement.click();
    this.id = row.tourSalesId; // importante: usar tourSalesId
  }

  downloadTemplateTour() {}
  downloadTemplatePassenger() {}

  onFileSelected(event: any, row: any) {
    const file = event.target.files?.[0];
    if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
      this.isUploading = true;
      Swal.fire({
        title: 'Cargando...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
          // IMPORTANTE: pasar el id correcto del row, no this.id si no quieres depender del click previo
          const tourId = row?.tourSalesId ?? this.id;
          this.girasServices.uploadFile(file, tourId).pipe(
            tap((response: any) => {
              if ((response?.repeatPassenger?.length ?? 0) === 0) {
                this.showSuccessDialog();
                // Refresca SOLO esta fila, no toda la tabla
                this.refreshAlumnosCount(row);
              } else {
                this.showDuplicateRutsDialog(response.repeatPassenger);
              }
            }),
            catchError(error => {
              console.log(error);
              Swal.fire({ icon: 'error', title: 'Oops...', text: 'Hubo un problema al cargar el archivo' });
              return of(null);
            }),
            finalize(() => {
              this.isUploading = false;
              event.target.value = '';
              Swal.close();
            })
          ).subscribe();
        },
      });
    } else {
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'Debes cargar un archivo Excel para continuar' });
    }
  }

  private refreshAlumnosCount(row: any) {
    this.girasServices.obtenerDetalleGira(row.tourSalesId).subscribe({
      next: (detalle) => {
        row.detalle = detalle;
        row.alumnosCount = this.calcTotalParticipantes(detalle);
        row.addAlumnListDoc = (row.alumnosCount ?? 0) > 0;
      },
      error: (e) => console.error('Error al obtener detalle de gira', e),
    });
  }

  private calcTotalParticipantes(d: any): number {
    const hombres = Number(d?.cantidadHombres ?? 0);
    const mujeres = Number(d?.cantidadMujeres ?? 0);
    const acompF = Number(d?.acompananteFemenino ?? 0);
    const acompM = Number(d?.acompananteMasculino ?? 0);
    const sum = hombres + mujeres + acompF + acompM;
    if (Number.isFinite(sum) && sum > 0) return sum;

    const fallback = Number(d?.tourSalesStudentCount ?? 0);
    return Number.isFinite(fallback) ? fallback : 0;
  }

  openAlumnosModal(row: any) {
    console.log(row)
    this.dialog.open(TourViewAlumnsModalComponent, {
      width: '1200px',
      height:'800px',
      data: {
        id: row.tourSalesId
      },
      autoFocus: false,
    });
  }

  onFileSelectedContract(event: any, row: any) {
    const file = event.target.files?.[0];
    if (file) {
      Swal.fire({
        title: 'Cargando...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
          this.girasServices.uploadDocumentsExtra(file, file.name, this.uuid, 'documentosextras', 'contract').pipe(
            tap((response) => {
              if (response) {
                this.showSuccessDialog();
                this.obtenerGiras();
              }
            }),
            catchError(error => {
              console.log(error);
              Swal.fire({ icon: 'error', title: 'Oops...', text: 'Hubo un problema al cargar el archivo' });
              return of(null);
            }),
            finalize(() => {
              event.target.value = '';
              Swal.close();
            })
          ).subscribe();
        },
      });
    } else {
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'Debes cargar un archivo para continuar' });
    }
  }

  onFileSelectedPolicies(event: any, row: any) {
    const file = event.target.files?.[0];
    if (file) {
      Swal.fire({
        title: 'Cargando...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
          this.girasServices.uploadDocumentsExtra(file, file.name, this.uuid, 'documentosextras', 'poliza').pipe(
            tap((response) => {
              if (response) {
                this.showSuccessDialog();
                this.obtenerGiras();
              }
            }),
            catchError(error => {
              console.log(error);
              Swal.fire({ icon: 'error', title: 'Oops...', text: 'Hubo un problema al cargar el archivo' });
              return of(null);
            }),
            finalize(() => {
              event.target.value = '';
              Swal.close();
            })
          ).subscribe();
        },
      });
    } else {
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'Debes cargar un archivo  para continuar' });
    }
  }

  onFileSelectedProgram(event: any, row: any) {
    const file = event.target.files?.[0];
    if (file) {
      Swal.fire({
        title: 'Cargando...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
          this.girasServices.uploadDocumentsExtra(file, file.name, this.uuid, 'documentosextras', 'gira').pipe(
            tap((response) => {
              if (response) {
                this.showSuccessDialog();
                this.obtenerGiras();
              }
            }),
            catchError(error => {
              console.log(error);
              Swal.fire({ icon: 'error', title: 'Oops...', text: 'Hubo un problema al cargar el archivo' });
              return of(null);
            }),
            finalize(() => {
              event.target.value = '';
              Swal.close();
            })
          ).subscribe();
        },
      });
    } else {
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'Debes cargar un archivo para continuar' });
    }
  }

  openViewDialogBus(row: any): void {
    this.dialog.open(TourAddBusModalComponent, {
      width: '1300px',
      height: '600px',
      data: row.tourSalesId
    });
  }

  openViewDialogTripulation(row: any): void {
    this.dialog.open(TourAddDriverModalComponent, {
      width: '1300px',
      height: '600px',
      data: row.tourSalesId
    });
  }

  openViewDialogCoordinator(row: any): void {
    this.dialog.open(TourAddCoordinatorModalComponent, {
      width: '1300px',
      height: '600px',
      data: row.tourSalesId
    });
  }

  openViewDialogContract(row: any): void {
    this.fileInputContract.nativeElement.click();
    this.uuid = row.tourSalesUuid;
  }

  openViewDialogProgram(row: any): void {
    this.fileInputProgram.nativeElement.click();
    this.uuid = row.tourSalesUuid;
  }

  openViewDialogPolizaSeguro(row: any): void {
    this.fileInputPoliciHealth.nativeElement.click();
    this.uuid = row.tourSalesUuid;
  }

  openViewDialogDownloadDocuments(row: any): void {
    this.dialog.open(TourDownloadDocumentModalComponent, {
      width: '1300px',
      height: '600px',
      data: row
    });
  }

  openViewDownloadDocuments(row: any): void {
    Swal.fire({
      title: 'Buscando el archivo...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
        this.girasServices.listPDF(row.tourSalesId).subscribe({
          next: (response: ArrayBuffer) => {
            if (response) {
              const blob = new Blob([response], { type: 'application/pdf' });
              saveAs(blob, `manifiesto_gira_${row.tourSalesUuid}.pdf`);
            }
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

  openViewDialogDownloadManifest(row: any): void {
    this.dialog.open(TourDonwloadAlumnsModalComponent, {
      width: '1300px',
      height: '600px',
      data: row.tourSalesId
    });
  }

  applyDelete(event: any) {
    Swal.fire({
      title: 'Estas Seguro?',
      text: 'No puedes revertir esto!!!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si,Estoy Seguro',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.girasServices.deleteGira(event.tourSalesId).subscribe(
          () => {
            Swal.fire('Eliminado!', 'Has eliminado el registro.', 'success');
            this.obtenerGiras();
          },
          () => {
            Swal.fire('Error', 'No se pudo eliminar el registro.', 'error');
          }
        );
      }
    });
  }

  showSuccessDialog() {
    Swal.fire({
      icon: 'success',
      title: 'Oops...',
      text: 'Archivo cargado exitosamente'
    });
  }

  showDuplicateRutsDialog(duplicates: any) {
    const duplicateList = duplicates.map((p: any) =>
      `${p.rutPassenger} - ${p.namePassenger} ${p.lastNamePassenger}`
    ).join('<br>');
    Swal.fire({
      title: '¡Atención!',
      html: 'Existen RUT duplicados:<br>' + duplicateList,
      icon: 'warning',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#3085d6',
      focusCancel: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.obtenerGiras();
      }
    });
  }

  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  addTour() {
    this.dialog.open(NewTourModalComponent, {
      width: '1300px',
      height: '600px',
    });
  }
}
