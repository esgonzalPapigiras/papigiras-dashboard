import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToursViewModalComponent } from '../tours-view-modal/tours-view-modal.component';
import { TourSalesDTO } from 'app/models/tourSales';
import Swal from 'sweetalert2'
import { ToursServicesService } from 'app/services/tours-services.service';
import { TourDonwloadAlumnsModalComponent } from '../tour-donwload-alumns-modal/tour-donwload-alumns-modal.component';
import { TourAddBusModalComponent } from '../tour-add-bus-modal/tour-add-bus-modal.component';
import { TourAddDriverModalComponent } from '../tour-add-driver-modal/tour-add-driver-modal.component';
import { TourAddCoordinatorModalComponent } from '../tour-add-coordinator-modal/tour-add-coordinator-modal.component';
import { TourAddHotelModalComponent } from '../tour-add-hotel-modal/tour-add-hotel-modal.component';
import { TourAddDocumentModalComponent } from '../tour-add-document-modal/tour-add-document-modal.component';
import { TourDownloadDocumentModalComponent } from '../tour-download-document-modal/tour-download-document-modal.component';





@Component({
  selector: 'app-tours',
  templateUrl: './tours.component.html',
  styleUrls: ['./tours.component.scss']
})
export class ToursComponent implements AfterViewInit {
  displayedColumns: string[] = ['tourSalesUuid', 'tourSalesInit', 'tourSalesFinal', 'collegeName', 'addCourse', 'acciones'];
  dataSource = new MatTableDataSource<TourSalesDTO>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('fileInput') fileInput: any;
  id : number;


  constructor(private _liveAnnouncer: LiveAnnouncer, public dialog: MatDialog, private girasServices: ToursServicesService,) { }

  ngOnInit() {
    this.obtenerGiras();
  }

  obtenerGiras() {
    Swal.fire({
      title: 'Cargando...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
        this.girasServices.obtenerGiras().subscribe(respon => {

          this.dataSource = new MatTableDataSource(respon);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          Swal.close();
        });
      },
    });
  }




  @ViewChild(MatSort) sort: MatSort;



  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openViewDialog(row: any): void {
    const dialogRef = this.dialog.open(ToursViewModalComponent, {
      width: '1300px',
      height: '600px',
      data: row.tourSalesId
    });

    dialogRef.afterClosed().subscribe({
    });
  }

  openViewDialogAlumn(row: any): void {
    this.fileInput.nativeElement.click();
    this.id = row.tourSalesId
    
  }

  onFileSelected(event: any, row: any) {
    
    const file = event.target.files[0];
    if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
      // Muestra un mensaje de carga con SweetAlert2
      Swal.fire({
        title: 'Cargando...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
          this.girasServices.uploadFile(file, this.id).subscribe(response => {
            
            if(response.repeatPassenger.length == 0){
              this.showSuccessDialog();
              this.obtenerGiras();
            }else{
              this.showDuplicateRutsDialog(response.repeatPassenger);
              
            }
            
          }, error => {
            // Maneja cualquier error durante la carga
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Hubo un problema al cargar el archivo"
            });
          });
        },
      });
  
      // Restablecer el input de tipo file
      event.target.value = '';
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Debes cargar un archivo Excel para continuar"
      });
    }
  }



  openViewDialogBus(row: any): void {
    const dialogRef = this.dialog.open(TourAddBusModalComponent, {
      width: '1300px',
      height: '600px',
      data: row.tourSalesId
    });

    dialogRef.afterClosed().subscribe({
    });
  }

  openViewDialogTripulation(row: any): void {
    const dialogRef = this.dialog.open(TourAddDriverModalComponent, {
      width: '1300px',
      height: '600px',
      data: row.tourSalesId
    });

    dialogRef.afterClosed().subscribe({
    });
  }

  openViewDialogCoordinator(row: any): void {
    const dialogRef = this.dialog.open(TourAddCoordinatorModalComponent, {
      width: '1300px',
      height: '600px',
      data: row.tourSalesId
    });

    dialogRef.afterClosed().subscribe({
    });
  }

  openViewDialogContract(row: any): void {
    const dialogRef = this.dialog.open(TourAddHotelModalComponent, {
      width: '1300px',
      height: '600px',
      data: row.tourSalesId
    });

    dialogRef.afterClosed().subscribe({
    });
  }

  openViewDialogProgram(row: any): void {
    const dialogRef = this.dialog.open(TourAddDocumentModalComponent, {
      width: '1300px',
      height: '600px',
      data: row.tourSalesId
    });

    dialogRef.afterClosed().subscribe({
    });
  }

  openViewDialogPolizaSeguro(row: any): void {
    const dialogRef = this.dialog.open(TourAddDocumentModalComponent, {
      width: '1300px',
      height: '600px',
      data: row.tourSalesId
    });

    dialogRef.afterClosed().subscribe({
    });
  }

  openViewDialogDownloadDocuments(row: any): void {
    const dialogRef = this.dialog.open(TourDownloadDocumentModalComponent, {
      width: '1300px',
      height: '600px',
      data: row.tourSalesId
    });

    dialogRef.afterClosed().subscribe({
    });
  }

  openViewDialogDownloadManifest(row: any): void {
    const dialogRef = this.dialog.open(TourDonwloadAlumnsModalComponent, {
      width: '1300px',
      height: '600px',
      data: row.tourSalesId
    });

    dialogRef.afterClosed().subscribe({
    });
  }

  applyDelete(event: any) {
    event.id_bus
    Swal.fire({
      title: 'Estas Seguro?',
      text: "No puedes revertir esto!!!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si,Estoy Seguro',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        //this.carService.deleteCars(event.id_bus).subscribe(respon=>{
        Swal.fire(
          'Eliminado!',
          'Has eliminado el registro.',
          'success'
        );


      }
    })
  }

  showSuccessDialog() {
    Swal.fire({
      icon: "success",
      title: "Oops...",
      text: "Archivo cargado exitosamente"
    });
  }

  showDuplicateRutsDialog(duplicates: any) {
    // Imprimir los duplicados en consola para verificar la estructura
    
    // Crear un string con los nombres y RUTs de los pasajeros duplicados
    const duplicateList = duplicates.map((passenger: any) => {
      return `${passenger.rutPassenger} - ${passenger.namePassenger} ${passenger.lastNamePassenger}`;
    }).join('<br>'); // Usar <br> para mostrar los datos en varias líneas
  
    Swal.fire({
      title: '¡Atención!',
      html: 'Existen RUT duplicados:<br>' + duplicateList,  // Usamos html en lugar de text
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
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}
