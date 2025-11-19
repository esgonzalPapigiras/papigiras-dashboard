import { Component, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PassengerDTO } from 'app/models/passengerList';
import { AlumnsService } from 'app/services/alumns.service';
import { ToursServicesService } from 'app/services/tours-services.service';
import Swal from 'sweetalert2';

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
    "passengersUuid",
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
    private alumnsService: AlumnsService,
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

  editarPasajero(alumno: any) {
    Swal.fire({
      title: 'Editar alumno',
      html:
        `
      <input id="swal-input-rut" class="swal2-input" placeholder="RUT" value="${alumno.passengersIdentification}">
      <input id="swal-input-apellidoP" class="swal2-input" placeholder="Apellido paterno" value="${alumno.passengersFatherLastName}">
      <input id="swal-input-apellidoM" class="swal2-input" placeholder="Apellido materno" value="${alumno.passengersMotherLastName}">
      <input id="swal-input-nombres" class="swal2-input" placeholder="Nombres" value="${alumno.passengersNames}">
      <input id="swal-input-nac" class="swal2-input" placeholder="Fecha de Nacimiento" value="${alumno.passengersBirthDate}">
      <input id="swal-input-sex" class="swal2-input" placeholder="Sexo" value="${alumno.passengersSex}">
      <input id="swal-input-email" class="swal2-input" placeholder="Email" value="${alumno.passengersEmail}">
      <input id="swal-input-telefono" class="swal2-input" placeholder="Teléfono" value="${alumno.passengersPhone}">`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      preConfirm: () => {
        return {
          passengersIdentification: (document.getElementById('swal-input-rut') as HTMLInputElement).value,
          passengersFatherLastName: (document.getElementById('swal-input-apellidoP') as HTMLInputElement).value,
          passengersMotherLastName: (document.getElementById('swal-input-apellidoM') as HTMLInputElement).value,
          passengersNames: (document.getElementById('swal-input-nombres') as HTMLInputElement).value,
          passengersBirthDate: (document.getElementById('swal-input-nac') as HTMLInputElement).value,
          passengersSex: (document.getElementById('swal-input-sex') as HTMLInputElement).value,
          passengersEmail: (document.getElementById('swal-input-email') as HTMLInputElement).value,
          passengersPhone: (document.getElementById('swal-input-telefono') as HTMLInputElement).value
        }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedData = result.value;
        // Modificar directamente el objeto del array (ya está enlazado)
        const data = this.dataSourceAlumnos.data;
        const index = data.findIndex((a) => a.passengersId === alumno.passengersId);
        if (index > -1) {
          data[index] = { ...data[index], ...updatedData };
          this.dataSourceAlumnos.data = [...data]; // Actualiza la tabla
        }
        Swal.fire('Guardado', 'Los datos han sido actualizados.', 'success');
      }
    });
  }

  eliminarPasajero(alumno: any) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar a ${alumno.passengersNames} ${alumno.passengersFatherLastName}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const data = this.dataSourceAlumnos.data;
        const index = data.findIndex((a) => a.passengersId === alumno.passengersId);
        if (index > -1) {
          data.splice(index, 1);
          this.dataSourceAlumnos.data = [...data]; // Actualiza la tabla
        }
        Swal.fire(
          'Eliminado',
          'El alumno ha sido eliminado correctamente.',
          'success'
        );
      }
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
