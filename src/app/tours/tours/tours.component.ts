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
import { ComunnesService } from 'app/services/comunnes.service';
import { TourAddCoordinatorModalComponent } from '../tour-add-coordinator-modal/tour-add-coordinator-modal.component';
import { TourDownloadDocumentModalComponent } from '../tour-download-document-modal/tour-download-document-modal.component';
import { TourAddAirplaneModalComponent } from '../tour-add-airplane-modal/tour-add-airplane-modal.component';
import { saveAs } from 'file-saver';
import { NewTourModalComponent } from '../new-tour-modal/new-tour-modal.component';
import { TourViewAlumnsModalComponent } from '../tour-view-alumns-modal/tour-view-alumns-modal.component';
import * as XLSX from 'xlsx';
// RXJS
import { forkJoin, of } from 'rxjs';
import { catchError, finalize, switchMap, tap } from 'rxjs/operators';
import { TourViewBusModalComponent } from '../tour-view-bus-modal/tour-view-bus-modal.component';
import { TourViewDriverModalComponent } from '../tour-view-driver-modal/tour-view-driver-modal.component';

@Component({
  selector: 'app-tours',
  templateUrl: './tours.component.html',
  styleUrls: ['./tours.component.scss']
})
export class ToursComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = ['tourSalesUuid', 'tourSalesInit', 'tourSalesFinal', 'collegeName', 'addCourse', 'communesName', 'acciones'];
  dataSource = new MatTableDataSource<TourSalesDTO>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @ViewChild('fileInput') fileInput: any;
  @ViewChild('fileInputContract') fileInputContract: any;
  @ViewChild('fileInputPoliciHealth') fileInputPoliciHealth: any;
  @ViewChild('fileInputProgram') fileInputProgram: any;

  // Estados auxiliares
  isUploading = false;
  private id: number;
  filterValues: any = {
    tourSalesUuid: '',
    tourSalesInit: '',
    tourSalesFinal: '',
    collegeName: '',
    addCourse: '',
    communeName: ''
  };

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    public dialog: MatDialog,
    private girasServices: ToursServicesService,
    private communesService: ComunnesService
  ) { }

  ngOnInit() {
    this.obtenerGiras();
    this.dataSource.filterPredicate = (data: TourSalesDTO, filter: string) => {
      const searchTerms = JSON.parse(filter);
      return (!searchTerms.tourSalesUuid || data.tourSalesUuid.toLowerCase().includes(searchTerms.tourSalesUuid)) &&
        (!searchTerms.tourSalesInit || data.tourSalesInit.toLowerCase().includes(searchTerms.tourSalesInit)) &&
        (!searchTerms.tourSalesFinal || data.tourSalesFinal.toLowerCase().includes(searchTerms.tourSalesFinal)) &&
        (!searchTerms.collegeName || data.collegeName.toLowerCase().includes(searchTerms.collegeName)) &&
        (!searchTerms.addCourse || data.addCourse.toLowerCase().includes(searchTerms.addCourse))
      /*&&
      (!searchTerms.communeName || (data.communeName?.toLowerCase().includes(searchTerms.communeName) ||
        data.detalle?.communesName?.toLowerCase().includes(searchTerms.communeName)));
        */
    };
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
        this.girasServices.obtenerGirasFull().pipe(
          tap(giras => {
            console.log('FULL GIRAS:', giras);
            this.dataSource = new MatTableDataSource(giras);
            this.dataSource.sortingDataAccessor = (item, property) => {
              switch (property) {
                case 'tourSalesInit':
                case 'tourSalesFinal':
                  return this.parseDate(item[property]);
                default:
                  return item[property];
              }
            };
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }),
          finalize(() => Swal.close())
        ).subscribe();
      }
    });
  }

  addTour() {
    this.dialog.open(NewTourModalComponent, {
      width: '1300px',
      height: '600px',
    });
  }

  onFileSelectedMassiveTour(event: any) {
    const file = event.target.files?.[0];
    if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
      this.isUploading = true;
      Swal.fire({
        title: 'Cargando...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
          this.girasServices.uploadFileMasiveTour(file).pipe(
            tap((response: any) => {
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

  downloadTemplateTour() {
    const url = 'assets/templates/Giras_CargaMasiva.xlsx';
    fetch(url)
      .then(res => res.blob())
      .then(blob => {
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'Template_Giras_CargaMasiva.xlsx';
        link.click();
        window.URL.revokeObjectURL(link.href);
      });
  }

  downloadGiras() {
    const giras = this.dataSource.data;
    if (!giras || giras.length === 0) {
      Swal.fire("No hay giras cargados", "", "warning");
      return;
    }
    Swal.fire({
      title: "Generando Excel...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
        const data = giras.map((g: any) => {
          const decoded = this.decodeTourUuid(g.tourSalesUuid);
          return {
            "Fecha salida": g.tourSalesInit,
            "Fecha llegada": g.tourSalesFinal,
            "Identificador gira": g.tourSalesUuid,
            "Programa": g.tour,
            "Temporada": decoded.tourGroups,
            "Colegio": decoded.colegio,
            "Comuna": decoded.comuna,
            "Curso": g.addCourse,
          };
        });
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Giras");
        const excelBuffer = XLSX.write(workbook, {
          bookType: "xlsx",
          type: "array"
        });
        const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(blob, "giras.xlsx");
        Swal.close();
      }
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
    this.id = row.tourSalesId;
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  openAlumnosModal(row: any) {
    //console.log(row)
    this.dialog.open(TourViewAlumnsModalComponent, {
      width: '1200px',
      height: '800px',
      data: {
        id: row.tourSalesId
      },
      autoFocus: false,
    });
  }

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

  openViewDialogBus(row: any): void {
    this.dialog.open(TourViewBusModalComponent, {
      width: '1300px',
      height: '600px',
      data: row.tourSalesId
    });
  }

  openViewDialogTripulation(row: any): void {
    this.dialog.open(TourViewDriverModalComponent, {
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

  obtenerGirasAntiguo() {
    Swal.fire({
      title: 'Cargando...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
        forkJoin({
          giras: this.girasServices.obtenerGiras(),
          communes: this.communesService.ObtenerCommunes()
        }).pipe(
          tap(({ giras, communes }) => {
            const communesMap = new Map<number, string>();
            communes.forEach(c => communesMap.set(c.communesId, String(c.communesName)));
            giras.forEach(row => {
              (row as any).communeName = communesMap.get(row.communeId) || '-';
            });
            this.dataSource = new MatTableDataSource(giras);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }),
          switchMap(({ giras }) => {
            if (!giras.length) return of(null);
            const tasks = giras.map(row =>
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

  getCoordinatorColor(row: any): string {
    const name = row.coordinatorName;
    const id = row.coordinatorIdentification;
    // CASE 1: Grey - no coordinator
    if (!row.tourSalesCoordinatorSelected || !name || !id) {
      return 'grey-button';
    }
    // CASE 2: Yellow - placeholder coordinator
    if (name === 'Por Asignar' || id === '11.111.111-1') {
      return 'yellow-button';
    }
    // CASE 3: Green - real coordinator
    return 'green-button';
  }

  decodeTourUuid(uuid: string) {
    const len = uuid.length;
    if (len === 17) {
      return {
        tour: uuid.substring(0, 3),
        tourGroups: uuid.substring(3, 5),
        comuna: uuid.substring(5, 10),
        colegio: uuid.substring(10, 15),
        addCourse: uuid.substring(15, 17)
      };
    }
    if (len === 19) {
      return {
        tour: uuid.substring(0, 3),
        tourGroups: uuid.substring(3, 7),
        comuna: "SIN DATOS",
        colegio: "SIN DATOS",
        addCourse: uuid.substring(17, 19)
      };
    }
    if (uuid === "CMB20251510231103B") {
      return {
        tour: "CMB",
        tourGroups: "2025",
        comuna: "SIN DATOS",
        colegio: "SIN DATOS",
        addCourse: "3B"
      };
    }
    throw new Error("Formato de tourSalesUuid inválido: " + uuid);
  }

  private parseDate(value: string): number {
    if (!value) return 0;
    // dd-MM-yyyy
    const [day, month, year] = value.split('-').map(Number);
    return new Date(year, month - 1, day).getTime();
  }
}
