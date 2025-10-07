import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { TripulationBusDTO } from 'app/models/tripulationBusDTO';
import { ToursServicesService } from 'app/services/tours-services.service';
import Swal from 'sweetalert2';
import { TourAddBusModalComponent } from '../tour-add-bus-modal/tour-add-bus-modal.component';

@Component({
  selector: 'app-tour-view-bus-modal',
  templateUrl: './tour-view-bus-modal.component.html',
  styleUrls: ['./tour-view-bus-modal.component.scss']
})
export class TourViewBusModalComponent implements OnInit {

  dataSourceBus = new MatTableDataSource<TripulationBusDTO>();
  displayedColumnsBus: string[] = [
    'tourTripulationBusPatent',
    'tourTripulationBusYear',
    'tourTripulationBusEnterprise',
    'acciones'
  ];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('paginatorBus') paginator!: MatPaginator;

  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,          // aquí recibes idTour u otro dato
    private girasServices: ToursServicesService,
    private tourService:ToursServicesService
  ) { }

  ngOnInit(): void {
    this.obtenerListaBuses();
  }

  obtenerListaBuses(): void {
    Swal.fire({
      title: 'Cargando...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();

        console.log(this.data);
        this.girasServices.listaBusGira(this.data).subscribe({
          next: (respon: TripulationBusDTO[]) => {
            // Si tu API devuelve un array, esto está OK
            this.dataSourceBus = new MatTableDataSource(respon ?? []);
            this.dataSourceBus.sort = this.sort;
            this.dataSourceBus.paginator = this.paginator;
          },
          error: (err) => {
            console.error(err);
            Swal.fire({ icon: 'error', title: 'Oops...', text: 'No se pudo cargar la lista de buses' });
          },
          complete: () => Swal.close()
        });
      }
    });
  }

  // (Opcional) filtro rápido desde un input
  applyBusFilter(value: string) {
    this.dataSourceBus.filter = (value || '').trim().toLowerCase();
  }

  async agregarBus() {
    const { value: formValues } = await Swal.fire({
      title: 'Agregar Bus',
      html: `
        <div class="swal2-field">
          <label>Patente</label>
          <input id="sw-patente" class="swal2-input" placeholder="Ej: SXVD14">
        </div>
        <div class="swal2-field">
          <label>Año</label>
          <input id="sw-anio" class="swal2-input" placeholder="Ej: 2019 o SIN INFORMACION">
        </div>
        <div class="swal2-field">
          <label>Empresa</label>
          <input id="sw-empresa" class="swal2-input" placeholder="Ej: EVONVAS">
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const patente = (document.getElementById('sw-patente') as HTMLInputElement).value?.trim();
        const anio = (document.getElementById('sw-anio') as HTMLInputElement).value?.trim();
        const empresa = (document.getElementById('sw-empresa') as HTMLInputElement).value?.trim();

        if (!patente || !anio || !empresa) {
          Swal.showValidationMessage('Completa todos los campos');
          return false;
        }
        return { patente, anio, empresa };
      }
    });

    if (!formValues) return;

    const payload: Partial<TripulationBusDTO> = {
      tourTripulationBusPatent: formValues.patente,
      tourTripulationBusYear: formValues.anio,
      tourTripulationBusEnterprise: formValues.empresa,
      tourTripulationBusBrand:" ",
      tourTripulationBusModel:" ",
      idTour: this.data // si tu API lo requiere
    };

    Swal.showLoading();
    this.tourService.addBusNew(payload as TripulationBusDTO,this.data).subscribe({
      next: (created) => {
        // Optimista: inserta en la tabla sin recargar
        const rows = this.dataSourceBus.data.slice();
        rows.unshift(created);
        this.dataSourceBus.data = rows;
        Swal.fire({ icon: 'success', title: 'Creado', text: 'Bus agregado correctamente' });
      },
      error: () => Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo crear el bus' })
    });
  }

  async editarBus(row: TripulationBusDTO) {
    const { value: formValues } = await Swal.fire({
      title: 'Editar Bus',
      html: `
        <div class="swal2-field">
          <label>Patente</label>
          <input id="sw-patente" class="swal2-input" value="${row.tourTripulationBusPatent || ''}">
        </div>
        <div class="swal2-field">
          <label>Año</label>
          <input id="sw-anio" class="swal2-input" value="${row.tourTripulationBusYear || ''}">
        </div>
        <div class="swal2-field">
          <label>Empresa</label>
          <input id="sw-empresa" class="swal2-input" value="${row.tourTripulationBusEnterprise || ''}">
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Actualizar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const patente = (document.getElementById('sw-patente') as HTMLInputElement).value?.trim();
        const anio = (document.getElementById('sw-anio') as HTMLInputElement).value?.trim();
        const empresa = (document.getElementById('sw-empresa') as HTMLInputElement).value?.trim();

        if (!patente || !anio || !empresa) {
          Swal.showValidationMessage('Completa todos los campos');
          return false;
        }
        return { patente, anio, empresa };
      }
    });

    if (!formValues) return;

    const payload: TripulationBusDTO = {
      ...row,
      tourTripulationBusPatent: formValues.patente,
      tourTripulationBusYear: formValues.anio,
      tourTripulationBusEnterprise: formValues.empresa
    };

    Swal.showLoading();
    console.log(payload)
    this.girasServices.actualizarBus(payload).subscribe({
      
      next: () => {
        // Actualiza la fila en memoria
        
        const rows = this.dataSourceBus.data.map(r =>
          r.tourTripulationId === row.tourTripulationId ? payload : r
        );
        this.dataSourceBus.data = rows;
        Swal.fire({ icon: 'success', title: 'Actualizado', text: 'Bus actualizado correctamente' });
      },
      error: () => Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo actualizar el bus' })
    });
  }

  // MODAL: Eliminar
  eliminarBus(row: TripulationBusDTO) {
    Swal.fire({
      title: '¿Eliminar bus?',
      text: `Patente: ${row.tourTripulationBusPatent}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (!result.isConfirmed) return;

      Swal.showLoading();
      this.girasServices.eliminarBus(row.tourTripulationId,row.idTour).subscribe({
        next: () => {
          // Quita la fila en memoria
          this.dataSourceBus.data = this.dataSourceBus.data.filter(r => r.tourTripulationId !== row.tourTripulationId);
          Swal.fire({ icon: 'success', title: 'Eliminado', text: 'Bus eliminado correctamente' });
        },
        error: () => Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo eliminar el bus' })
      });
    });
  }

}
