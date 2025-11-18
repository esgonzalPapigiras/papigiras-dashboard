import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TripulationBusDTO } from 'app/models/tripulationBusDTO';
import { BusFullDTO } from 'app/models/BusFullDTO';
import { BusService } from 'app/services/bus.service';
import { ToursServicesService } from 'app/services/tours-services.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tour-view-bus-modal',
  templateUrl: './tour-view-bus-modal.component.html',
  styleUrls: ['./tour-view-bus-modal.component.scss']
})
export class TourViewBusModalComponent implements OnInit {

  buses: BusFullDTO[] = [];
  searchTerm: string = '';
  selectedBus?: BusFullDTO;
  alreadySelectedBusPatents: string[] = [];

  dataSourceBus = new MatTableDataSource<TripulationBusDTO>();
  displayedColumnsBus = [
    'tourTripulationBusPatent',
    'tourTripulationBusBrand',
    'tourTripulationBusModel',
    'tourTripulationBusYear',
    'tourTripulationBusEnterprise',
    'acciones'
  ];

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    public dialog: MatDialog,
    private busService: BusService,
    private girasServices: ToursServicesService,
    public dialogRef: MatDialogRef<TourViewBusModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    this.loadBuses();
    this.obtenerListaBuses();
  }

  loadBuses() {
    Swal.fire({ title: 'Cargando...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
    this.busService.obtenerBuses().subscribe({
      next: (res: BusFullDTO[]) => {
        this.buses = res ?? [];
        Swal.close();
        this.prefillSelectedBus();
      },
      error: (err) => {
        Swal.close();
        console.error(err);
        Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudieron cargar los buses' });
      }
    });
  }

  prefillSelectedBus() {
    this.girasServices.listaBusGira(this.data).subscribe((linked: TripulationBusDTO[]) => {
      this.dataSourceBus.data = linked ?? [];
      this.alreadySelectedBusPatents = linked.map(b => b.tourTripulationBusPatent);
      if (linked.length > 0) {
        const pat = linked[0].tourTripulationBusPatent;
        this.selectedBus = this.buses.find(b => b.patente === pat) || undefined;
      }
      this.dataSourceBus.sort = this.sort;
    });
  }

  filteredBuses(): BusFullDTO[] {
    return this.buses.filter(b =>
      (b.patente + b.marca + b.modelo + b.empresa).toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  obtenerListaBuses(): void {
    this.girasServices.listaBusGira(this.data).subscribe({
      next: (res: TripulationBusDTO[]) => {
        this.dataSourceBus.data = res ?? [];
        this.alreadySelectedBusPatents = res.map(b => b.tourTripulationBusPatent);
        this.dataSourceBus.sort = this.sort;
      },
      error: (err) => console.error(err)
    });
  }

  saveBus() {
    if (!this.selectedBus) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Debes seleccionar un bus.' });
      return;
    }
    if (this.alreadySelectedBusPatents.includes(this.selectedBus.patente)) {
      Swal.fire({ icon: 'warning', title: 'Atención', text: 'El bus ya fue agregado.' });
      return;
    }
    const dto: TripulationBusDTO = {
      tourTripulationId: 0,
      tourTripulationBusPatent: this.selectedBus.patente,
      tourTripulationBusBrand: this.selectedBus.marca,
      tourTripulationBusModel: this.selectedBus.modelo,
      tourTripulationBusYear: this.selectedBus.anoBus.toString(),
      tourTripulationBusEnterprise: this.selectedBus.empresa,
      idTour: this.data,
      bus_id: this.selectedBus.id
    };
    Swal.fire({ title: 'Guardando...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
    this.girasServices.addBusNew(dto, this.data).subscribe({
      next: () => {
        Swal.close();
        Swal.fire({ icon: 'success', title: 'Bus asignado', text: 'El bus fue asignado correctamente.' });
        this.selectedBus = undefined;
        this.obtenerListaBuses();
      },
      error: () => {
        Swal.close();
        Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo asignar el bus.' });
      }
    });
  }

  remover(bus: TripulationBusDTO) {
    Swal.fire({
      title: "¿Eliminar bus del tour?",
      text: `Esto quitará el bus ${bus.tourTripulationBusPatent} del tour.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar"
    }).then(result => {
      if (result.isConfirmed) {
        this.busService.removeBus(bus.tourTripulationId).subscribe({
          next: () => {
            Swal.fire("Eliminado", "El bus fue eliminado del tour.", "success");
            this.loadBuses();
            this.obtenerListaBuses();
          },
          error: () => {
            Swal.fire("Error", "No se pudo eliminar el bus.", "error");
          }
        });
      }
    });
  }
}
