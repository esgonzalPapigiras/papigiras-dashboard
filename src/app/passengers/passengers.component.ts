import { Component, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PassengerDTO } from 'app/models/passengerList';
import { AlumnsService } from 'app/services/alumns.service';
import { ToursServicesService } from 'app/services/tours-services.service';
import Swal from 'sweetalert2';
import { saveAs } from 'file-saver';
import { MedicalRecordDialogComponent } from 'app/tours/medical-record-dialog/medical-record-dialog.component';
import { PassengerEditDialogComponent } from 'app/tours/passenger-edit-dialog/passenger-edit-dialog.component';

@Component({
  selector: 'app-passengers',
  templateUrl: './passengers.component.html',
  styleUrls: ['./passengers.component.scss']
})
export class PassengerComponent implements OnInit {

  dataSourceAlumnos = new MatTableDataSource<PassengerDTO>();
  @ViewChild(MatPaginator) paginatorAlumn: MatPaginator;
  @ViewChild(MatSort) sortAlumn: MatSort;
  displayedColumnsAlumnos: string[] = [
    "codigoGira",
    "passengersIdentification",
    "passengersFatherLastName",
    "passengersNames",
    "passengersBirthDate",
    "passengersSex",
    //"passengersSize",
    //"passengersDiet",
    "passengersEmail",
    "passengersPhone",
    "acciones",
  ];
  giras: any[] = [];

  constructor(
    private girasServices: ToursServicesService,
    private alumnsService: AlumnsService,
    public dialog: MatDialog,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.obtenerTodosPasajeros();
  }

  ngAfterViewInit() {
    this.dataSourceAlumnos.paginator = this.paginatorAlumn;
    this.dataSourceAlumnos.sort = this.sortAlumn;
  }

  obtenerTodosPasajeros() {
    Swal.fire({
      title: "Cargando todos los pasajeros...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
        this.alumnsService.obtenerPasajeros().subscribe((respon) => {
          console.log(respon);
          this.dataSourceAlumnos.data = respon;
          Swal.close();
        });
      },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceAlumnos.filter = filterValue.trim().toLowerCase();
  }

  medicalRecord(row: any): void {
    console.log(row)
    // Si YA tiene ficha -> descarga
    if (row.medicalRecord) {
      Swal.fire({
        title: 'Buscando el archivo...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
          this.girasServices
            .downloadDocumentMedical(row.passengersUuid, row.passengersId, row.passengersIdentification)
            .subscribe({
              next: (response) => {
                const blob = new Blob([response]);
                // agrega extensión si corresponde (ej: .pdf)
                saveAs(blob, `${row.passengersIdentification}.pdf`);
                Swal.close();
              },
              error: (err) => {
                console.error('Error downloading the file: ', err);
                Swal.close();
                Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo descargar la ficha.' });
              },
            });
        },
      });
      return;
    }

    // Si NO tiene ficha -> abrir modal para crear
    //console.log(this.data)
    const dialogRef = this.dialog.open(MedicalRecordDialogComponent, {
      width: '760px',
      disableClose: true,
      data: {
        idTour: row.passengersUuid,                // viene de tu componente padre
        idPassenger: row.passengersId,       // del registro
        // Si quieres prefijar nombres/apellidos/curso/colegio desde row, puedes pasarlos aquí:
        nombres: row.passengersNames,
        apellidos: `${row.passengersFatherLastName ?? ''} ${row.passengersMotherLastName ?? ''}`.trim(),
        RUT: row.passengersIdentification,
        curso: row.passengersCourse,
        fechaNacimiento: row.passengersBirthDate,
      },
    });

    dialogRef.afterClosed().subscribe((createdOk: boolean) => {
      if (createdOk) {
        // marca visualmente que ya tiene ficha (opcional refrescar desde backend)
        row.medicalRecord = true;
        Swal.fire({ icon: 'success', title: 'Ficha creada', text: 'Se guardó la ficha médica.' });
      }
    });
  }

  editarPasajero(alumno: any): void {
    const ref = this.dialog.open(PassengerEditDialogComponent, {
      width: '720px',
      disableClose: true,
      data: alumno
    });
    ref.afterClosed().subscribe((updated?: PassengerDTO) => {
      if (updated) {
        this.obtenerTodosPasajeros();
      }
    });
  }
  eliminarPasajero(row: any) {
    console.log(row)
    const nombre = row.passengersNames || row.namePassengersAttorney || '';
    const identificacion = row.passengersIdentification || '';
    Swal.fire({
      title: '¿Eliminar pasajero?',
      html: `
        <div style="text-align:left">
          <div><strong>Nombre:</strong> ${nombre}</div>
          <div><strong>Identificación:</strong> ${identificacion}</div>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    }).then(result => {
      if (!result.isConfirmed) return;
      // 1) Definir ID a enviar
      const idParam = (row.passengersUuid && String(row.passengersUuid).trim().length > 0)
        ? String(row.passengersUuid)
        : String(row.passengersId ?? '');
      if (!idParam) {
        Swal.fire({ icon: 'warning', title: 'Sin ID', text: 'No se encontró el identificador del pasajero.' });
        return;
      }
      Swal.fire({ title: 'Eliminando...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
      this.girasServices.deletePassenger(row.passengersId).subscribe({
        next: (resp) => {
          if (resp?.status === 'success') {
            this.obtenerTodosPasajeros();
            Swal.fire({
              icon: 'success',
              title: 'Eliminado',
              text: resp.message || 'Pasajero eliminado correctamente',
              timer: 1600,
              showConfirmButton: false
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'No se pudo eliminar',
              text: resp?.message || 'La operación fue rechazada por el servidor'
            });
          }
        },
        error: (err) => {
          const serverMsg = err?.error?.message;
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: serverMsg || 'No se pudo eliminar el pasajero'
          });
        }
      });
    });
  }
  triggerFileInput() {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fileInput?.click();
  }
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
      Swal.fire({
        title: 'Cargando...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      });
      this.alumnsService.uploadFile(file).subscribe({
        next: (response) => {
          Swal.close();
          if (response.code === '0') {
            Swal.fire('Éxito', 'Buses cargados correctamente', 'success');
            this.obtenerTodosPasajeros();
          } else {
            Swal.fire('Error', response.response, 'error');
          }
        },
        error: (err) => {
          Swal.close();
          Swal.fire('Error', 'Hubo un problema al cargar el archivo', err);
        }
      });
      event.target.value = ''; // reset input
    } else {
      Swal.fire('Error', 'Debes cargar un archivo Excel para continuar', 'error');
    }
  }
  addPassenger() { }
  downloadPassengers() { }

  downloadTemplatePassenger() {
    const url = 'assets/templates/Pasajeros_CargaMasiva.xlsx';
    fetch(url)
      .then(res => res.blob())
      .then(blob => {
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'Template_Pasajeros_CargaMasiva.xlsx';
        link.click();
        window.URL.revokeObjectURL(link.href);
      });
  }
}
