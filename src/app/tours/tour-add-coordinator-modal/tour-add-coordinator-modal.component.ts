import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CoordinatorService } from 'app/services/coordinator.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tour-add-coordinator-modal',
  templateUrl: './tour-add-coordinator-modal.component.html',
  styleUrls: ['./tour-add-coordinator-modal.component.scss']
})
export class TourAddCoordinatorModalComponent implements OnInit {

  coordinators: any[] = [];
  searchTerm: string = '';
  selectedCoordinator: any;


  constructor(private _liveAnnouncer: LiveAnnouncer, public dialog: MatDialog, private coordinatorServices: CoordinatorService,) { }

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

  filteredCoordinators() {
    return this.coordinators.filter(coordinator =>
      coordinator.coordinatorName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      coordinator.coordinatorLastname.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

}
