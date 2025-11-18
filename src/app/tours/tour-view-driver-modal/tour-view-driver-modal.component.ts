import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TripulationsDTO } from 'app/models/tripulations';
import { ToursServicesService } from 'app/services/tours-services.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tour-view-driver-modal',
  templateUrl: './tour-view-driver-modal.component.html',
  styleUrls: ['./tour-view-driver-modal.component.scss']
})
export class TourViewDriverModalComponent implements OnInit {

  dataSourceTrip = new MatTableDataSource<TripulationsDTO>();
  displayedColumnsTrip: string[] = [
    'tourTripulationNameId',
    'tourTripulationIdentificationId',
    'tourTripulationPhoneId',
    'fechaNacimiento',
    'acciones'
  ];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('paginatorTrip') paginator!: MatPaginator;

  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any, // id que necesitas pasar al backend
    private toursService: ToursServicesService
  ) { }

  ngOnInit(): void {
    this.obtenerTripulacion();
  }

  obtenerTripulacion(): void {
    Swal.fire({
      title: 'Cargando...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();

        // Ajusta este método a tu servicio real para listar tripulación
        this.toursService.listaTripulantes(this.data).subscribe({
          next: (res: TripulationsDTO[]) => {
            // Filtrar solo choferes (typeId === 1)
            const choferes = (res ?? []).filter(t => t.tourTripulationTypeId === 1);
            this.dataSourceTrip = new MatTableDataSource(choferes);
            this.dataSourceTrip.sort = this.sort;
            this.dataSourceTrip.paginator = this.paginator;
          },
          error: (err) => {
            console.error(err);
            Swal.fire({ icon: 'error', title: 'Oops...', text: 'No se pudo cargar la tripulación' });
          },
          complete: () => Swal.close()
        });
      }
    });
  }

  // CREATE
  async agregarTripulante() {
    const { value: form } = await Swal.fire({
      title: 'Agregar Tripulante',
      html: `
        <input id="tp-nombre" class="swal2-input" placeholder="Nombre">
        <input id="tp-ident" class="swal2-input" placeholder="Identificación">
        <input id="tp-fono" class="swal2-input" placeholder="Teléfono">
        <input id="tp-fecha" class="swal2-input" type="date" placeholder="Fecha Nacimiento">
      `,

      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      focusConfirm: false,
      preConfirm: () => {
        const nombre = (document.getElementById('tp-nombre') as HTMLInputElement).value?.trim();
        const ident = (document.getElementById('tp-ident') as HTMLInputElement).value?.trim();
        const fono = (document.getElementById('tp-fono') as HTMLInputElement).value?.trim();
        const fecha = (document.getElementById('tp-fecha') as HTMLInputElement).value?.trim();

        if (!nombre || !ident) {
          Swal.showValidationMessage('Tipo, Nombre e Identificación son obligatorios');
          return false;
        }
        return { nombre, ident, fono, fecha };
      }
    });

    if (!form) return;
    const dto: TripulationsDTO = {
      tourTripulationTypeId: 1,
      tourTripulationNameId: form.nombre,
      tourTripulationIdentificationId: form.ident,
      tourTripulationPhoneId: form.fono,
      tourTripulationDescriptionId: 'conductor',
      fechaNacimiento: form.fecha || undefined,
      tripulationBusId: isNaN(form.busId) ? undefined : form.busId,
      tourSalesId: undefined // setéalo si corresponde
    };

    Swal.showLoading();
    // Backend exige ?id=...&confirma=...
    const id = String(this.data);     // ajusta si tu id viene distinto
    const confirma = true;             // o el valor que uses
    this.toursService.addTripulationNew(dto, id, confirma).subscribe({
      next: (created: TripulationsDTO) => {
        const rows = this.dataSourceTrip.data.slice();
        rows.unshift(created);
        this.dataSourceTrip.data = rows;
        Swal.fire({ icon: 'success', title: 'Creado', text: 'Tripulante agregado' });
      },
      error: () => Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo crear el tripulante' })
    });
  }

  // UPDATE
  async editarTripulante(row: TripulationsDTO) {
    const { value: form } = await Swal.fire({
      title: 'Editar Tripulante',
      html: `
        <input id="tp-nombre" class="swal2-input" placeholder="Nombre" value="${row.tourTripulationNameId ?? ''}">
        <input id="tp-ident" class="swal2-input" placeholder="Identificación" value="${row.tourTripulationIdentificationId ?? ''}">
        <input id="tp-fono" class="swal2-input" placeholder="Teléfono" value="${row.tourTripulationPhoneId ?? ''}">
        <input id="tp-fecha" class="swal2-input" type="date" value="${(row.fechaNacimiento ?? '').substring(0, 10)}">
      `,
      showCancelButton: true,
      confirmButtonText: 'Actualizar',
      cancelButtonText: 'Cancelar',
      focusConfirm: false,
      preConfirm: () => {
        const nombre = (document.getElementById('tp-nombre') as HTMLInputElement).value?.trim();
        const ident = (document.getElementById('tp-ident') as HTMLInputElement).value?.trim();
        const fono = (document.getElementById('tp-fono') as HTMLInputElement).value?.trim();
        const fecha = (document.getElementById('tp-fecha') as HTMLInputElement).value?.trim();
        if (!nombre || !ident) {
          Swal.showValidationMessage('Tipo, Nombre e Identificación son obligatorios');
          return false;
        }
        return { nombre, ident, fono, fecha };
      }
    });
    if (!form) return;
    const payload: TripulationsDTO = {
      ...row,
      tourTripulationTypeId: form.typeId,
      tourTripulationNameId: form.nombre,
      tourTripulationIdentificationId: form.ident,
      tourTripulationPhoneId: form.fono,
      fechaNacimiento: form.fecha || undefined,
      tripulationBusId: isNaN(form.busId) ? undefined : form.busId
    };
    Swal.showLoading();
    // Ajusta el endpoint de update a tu backend real
    this.toursService.updateTripulation(payload).subscribe({
      next: () => {
        const rows = this.dataSourceTrip.data.map(r =>
          r.tourTripulationId === payload.tourTripulationId ? payload : r
        );
        this.dataSourceTrip.data = rows;
        Swal.fire({ icon: 'success', title: 'Actualizado', text: 'Tripulante actualizado' });
      },
      error: () => Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo actualizar' })
    });
  }

  // DELETE
  eliminarTripulante(row: TripulationsDTO) {
    Swal.fire({
      title: '¿Eliminar tripulante?',
      text: `Nombre: ${row.tourTripulationNameId ?? row.tourTripulationIdentificationId ?? ''}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (!result.isConfirmed || !row.tourTripulationId) return;
      Swal.showLoading();
      this.toursService.deleteTripulation(row.tourTripulationId, this.data).subscribe({
        next: () => {
          this.dataSourceTrip.data = this.dataSourceTrip.data.filter(r => r.tourTripulationId !== row.tourTripulationId);
          Swal.fire({ icon: 'success', title: 'Eliminado', text: 'Tripulante eliminado' });
        },
        error: () => Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo eliminar' })
      });
    });
  }
}
