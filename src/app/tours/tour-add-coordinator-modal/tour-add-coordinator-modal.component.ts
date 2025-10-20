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


  constructor(private _liveAnnouncer: LiveAnnouncer, public dialog: MatDialog, private coordinatorServices: CoordinatorService,
    private tourService:ToursServicesService,public dialogRef: MatDialogRef<TourAddCoordinatorModalComponent>,@Inject(MAT_DIALOG_DATA) public data: any
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
        this.coordinatorServices.obtenerCoordinadores().subscribe(respon => {
          this.coordinators = respon;
          Swal.close();
        });
      },
    });
  }

  get selectedCoordinatorsText(): string {
    return this.selectedCoordinators && this.selectedCoordinators.length > 0
      ? this.selectedCoordinators.map(c => c.coordinatorName + ' ' + c.coordinatorLastname).join(', ')
      : 'Selecciona coordinadores';
  }

  filteredCoordinators() {
    //console.log(this.searchTerm);
    return this.coordinators.filter(coordinator =>
      coordinator.coordinatorName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      coordinator.coordinatorLastname.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  sendCoordinators() {
    if (this.selectedCoordinators.length > 0) {
      Swal.fire({
        title: 'Coordinadores seleccionados',
        text: 'Has seleccionado: ' + this.selectedCoordinators.map(c => c.coordinatorName + ' ' + c.coordinatorLastname).join(', '),
        icon: 'success',
        confirmButtonText: 'Cerrar'
      });
    } else {
      Swal.fire({
        title: 'Error',
        text: 'No has seleccionado ningún coordinador.',
        icon: 'error',
        confirmButtonText: 'Cerrar'
      });
    }
    this.selectedCoordinators.forEach((coordinators: any) => {
              const coordinator = new TripulationsDTO(
                0,
                32,
                coordinators.coordinatorName+ " "+coordinators.coordinatorLastname,
                "Coordinador",
                coordinators.coordinatorRut,
                coordinators.coordinatorCelular,
                0,
                this.data,
                coordinators.fechaNacimiento
              );
              
              this.tourService.addTripulation(coordinator,this.data,true).subscribe({
                next: () => {
                  this.dialogRef.close(true);
                },
                error: (err) => {
                  console.error('Error al guardar el buses:', err);
                  this.dialogRef.close(false);
                }
              });
              
            });


  }

}
