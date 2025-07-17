import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToursServicesService } from 'app/services/tours-services.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-maps-coordinator',
  templateUrl: './maps-coordinator.component.html',
  styleUrls: ['./maps-coordinator.component.scss']
})
export class MapsCoordinatorComponent implements AfterViewInit {

  constructor(private _liveAnnouncer: LiveAnnouncer, public dialog: MatDialog, private girasServices: ToursServicesService,) { }
  ngAfterViewInit(): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit() {
    this.obtenerCoordinadoresGPS();
  }

  obtenerCoordinadoresGPS() {
      Swal.fire({
        title: 'Cargando...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
          this.girasServices.obtenerGiras().subscribe(respon => {
            Swal.close();
          });
        },
      });
    }

}
