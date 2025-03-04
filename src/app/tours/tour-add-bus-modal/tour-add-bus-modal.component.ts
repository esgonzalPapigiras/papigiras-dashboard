import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BusService } from 'app/services/bus.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tour-add-bus-modal',
  templateUrl: './tour-add-bus-modal.component.html',
  styleUrls: ['./tour-add-bus-modal.component.scss']
})
export class TourAddBusModalComponent implements OnInit {

    buses: any[] = [];
    searchTerm: string = '';
    selectedBuses: any[] = [];
  
  
    constructor(private _liveAnnouncer: LiveAnnouncer, public dialog: MatDialog, private busService: BusService) { }
  
    ngOnInit() {
      this.obtenerBuses();
    }
  
    obtenerBuses() {
      Swal.fire({
        title: 'Cargando...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
          this.busService.obtenerBus().subscribe(respon => {
            this.buses = respon;
            Swal.close();
          });
        },
      });
    }
  
    get selectedBusText(): string {
      return this.selectedBuses && this.selectedBuses.length > 0
        ? this.selectedBuses.map(c => c.tourTripulationBusPatent + ' ' + c.tourTripulationBusEnterprise).join(', ')
        : 'Selecciona Buses';
    }
  
    filteredBus() {
      return this.buses.filter(bus =>
        bus.tourTripulationBusPatent.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        bus.tourTripulationBusEnterprise.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  
    sendBus() {
      if (this.selectedBuses.length > 0) {
        Swal.fire({
          title: 'Buses seleccionados',
          text: 'Has seleccionado: ' + this.selectedBuses.map(c => c.tourTripulationBusPatent + ' ' + c.tourTripulationBusEnterprise).join(', '),
          icon: 'success',
          confirmButtonText: 'Cerrar'
        });
      } else {
        Swal.fire({
          title: 'Error',
          text: 'No has seleccionado ningún Buse.',
          icon: 'error',
          confirmButtonText: 'Cerrar'
        });
      }
    }

}
