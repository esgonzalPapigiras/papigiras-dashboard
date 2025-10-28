import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TripulationsDTO } from 'app/models/driver';
import { CoordinatorService } from 'app/services/coordinator.service';
import { ToursServicesService } from 'app/services/tours-services.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tour-add-coordinator-modal',
  templateUrl: './tour-add-coordinator-modal.component.html',
  styleUrls: ['./tour-add-coordinator-modal.component.scss']
})
export class TourAddCoordinatorModalComponent implements OnInit {

  coordinators: any[] = [];
  searchTerm: string = '';
  selectedCoordinators: any[] = [];
  alreadySelectedCoordinatorsIds: string[] = []; // store coordinatorRut of pre-selected coordinators

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    public dialog: MatDialog,
    private coordinatorService: CoordinatorService,
    private tourService: ToursServicesService,
    public dialogRef: MatDialogRef<TourAddCoordinatorModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.obtenerCoordinadores();
  }

  obtenerCoordinadores() {
    Swal.fire({
      title: 'Cargando...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
        this.coordinatorService.obtenerCoordinadores().subscribe(res => {
          this.coordinators = res;
          Swal.close();
          this.prefillSelectedCoordinators();
        }, err => {
          Swal.close();
          console.error(err);
          Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudieron cargar los coordinadores' });
        });
      }
    });
  }

  prefillSelectedCoordinators() {
    this.tourService.listaTripulantes(this.data).subscribe((tripulaciones: TripulationsDTO[]) => {
      // solo coordinadores (typeId === 32)
      const coordinadoresTour = (tripulaciones ?? []).filter(t => t.tourTripulationTypeId === 32);

      this.selectedCoordinators = coordinadoresTour.map(t => {
        const full = this.coordinators.find(c => c.coordinatorRut === t.tourTripulationIdentificationId);
        if (full) return full;

        // fallback if the coordinator is not in the master list
        return {
          coordinatorName: t.tourTripulationNameId.split(' ')[0] || '',
          coordinatorLastname: t.tourTripulationNameId.split(' ').slice(1).join(' ') || '',
          coordinatorRut: t.tourTripulationIdentificationId,
          coordinatorCelular: t.tourTripulationPhoneId,
          coordinatorFechaNacimiento: t.fechaNacimiento
        };
      });

      // guardar los RUTs de coordinadores ya seleccionados para deshabilitar en el select
      this.alreadySelectedCoordinatorsIds = coordinadoresTour.map(t => t.tourTripulationIdentificationId);
    });
  }

  get selectedCoordinatorsText(): string {
    return this.selectedCoordinators && this.selectedCoordinators.length > 0
      ? this.selectedCoordinators.map(c => c.coordinatorName + ' ' + c.coordinatorLastname).join(', ')
      : 'Selecciona coordinadores';
  }

  filteredCoordinators() {
    return this.coordinators.filter(coordinator =>
      coordinator.coordinatorName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      coordinator.coordinatorLastname.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  sendCoordinators() {
    if (this.selectedCoordinators.length === 0) {
      Swal.fire({
        title: 'Error',
        text: 'No has seleccionado ningún coordinador.',
        icon: 'error',
        confirmButtonText: 'Cerrar'
      });
      return;
    }

    this.selectedCoordinators.forEach(c => {
      const coordinator = new TripulationsDTO(
        0,
        32,
        c.coordinatorName + " " + c.coordinatorLastname,
        "Coordinador",
        c.coordinatorRut,
        c.coordinatorCelular,
        0,
        this.data,
        c.coordinatorFechaNacimiento
      );

      this.tourService.addTripulation(coordinator, this.data, true).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err) => {
          console.error('Error al guardar el coordinador:', err);
          this.dialogRef.close(false);
        }
      });
    });

    Swal.fire({
      title: 'Coordinadores seleccionados',
      text: 'Has seleccionado: ' + this.selectedCoordinators.map(c => c.coordinatorName + ' ' + c.coordinatorLastname).join(', '),
      icon: 'success',
      confirmButtonText: 'Cerrar'
    });
  }
}
