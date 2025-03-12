import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TripulationBus } from 'app/models/bus';
import { BusService } from 'app/services/bus.service';
import { ToursServicesService } from 'app/services/tours-services.service';
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
  
  
    constructor(private _liveAnnouncer: LiveAnnouncer, public dialog: MatDialog, private busService: BusService,private tourService:ToursServicesService,public dialogRef: MatDialogRef<TourAddBusModalComponent>,@Inject(MAT_DIALOG_DATA) public data: any) { }
  
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
      this.selectedBuses.forEach((buses: any) => {
          const bus = new TripulationBus(
            0,
            buses.tourTripulationBusPatent,
            buses.tourTripulationBusBrand,
            buses.tourTripulationBusModel,
            buses.tourTripulationBusYear,
            buses.tourTripulationBusEnterprise
          );
          
          this.tourService.addBus(bus,this.data).subscribe({
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
