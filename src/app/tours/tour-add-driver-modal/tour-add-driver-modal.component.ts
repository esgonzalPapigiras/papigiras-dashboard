import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DriverService } from 'app/services/driver.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tour-add-driver-modal',
  templateUrl: './tour-add-driver-modal.component.html',
  styleUrls: ['./tour-add-driver-modal.component.scss']
})
export class TourAddDriverModalComponent implements OnInit {

  drivers: any[] = [];
  searchTerm: string = '';
  selectedDrivers: any[] = [];


  constructor(private _liveAnnouncer: LiveAnnouncer, public dialog: MatDialog, private driverService: DriverService) { }

  ngOnInit() {
    this.obtenerConductores();
  }

  obtenerConductores() {
    Swal.fire({
      title: 'Cargando...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
        this.driverService.obtenerConductores().subscribe(respon => {
          this.drivers = respon;
          Swal.close();
        });
      },
    });
  }

  get selectedDriverText(): string {
    return this.selectedDrivers && this.selectedDrivers.length > 0
      ? this.selectedDrivers.map(c => c.tourTripulationNameId + ' ' + c.tourTripulationIdentificationId).join(', ')
      : 'Selecciona Conductores';
  }

  filteredDriver() {
    return this.drivers.filter(driver =>
      driver.tourTripulationNameId.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      driver.tourTripulationIdentificationId.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  sendDrivers() {
    if (this.selectedDrivers.length > 0) {
      Swal.fire({
        title: 'Conductores seleccionados',
        text: 'Has seleccionado: ' + this.selectedDrivers.map(c => c.tourTripulationNameId + ' ' + c.tourTripulationIdentificationId).join(', '),
        icon: 'success',
        confirmButtonText: 'Cerrar'
      });
    } else {
      Swal.fire({
        title: 'Error',
        text: 'No has seleccionado ningún Conductor.',
        icon: 'error',
        confirmButtonText: 'Cerrar'
      });
    }
  }

}
