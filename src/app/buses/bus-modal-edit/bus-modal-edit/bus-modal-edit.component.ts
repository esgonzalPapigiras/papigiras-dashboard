import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BusFullDTO } from 'app/models/BusFullDTO';
import { BusService } from 'app/services/bus.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-bus-modal-edit',
  templateUrl: './bus-modal-edit.component.html',
  styleUrls: ['./bus-modal-edit.component.scss']
})
export class BusModalEditComponent implements OnInit {

  bus: BusFullDTO;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private busService: BusService,
    public dialogRef: MatDialogRef<BusModalEditComponent>
  ) { }

  ngOnInit(): void {
    this.cargarBus();
  }

  cargarBus() {
    Swal.fire({
      title: "Cargando...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
        this.busService.obtenerBusUpdate(this.data).subscribe(res => {
          this.bus = res;
          Swal.close();
        });
      }
    });
  }

  onSave() {
    this.bus.capacidad = 0;
    Swal.fire({
      title: "Guardando...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
        this.busService.updateBus(this.bus, this.data).subscribe({
          next: () => {
            Swal.close();
            Swal.fire("Éxito", "El bus fue actualizado.", "success");
            this.dialogRef.close(true);
          },
          error: () => {
            Swal.close();
            Swal.fire("Error", "No se pudo guardar.", "error");
          }
        });
      }
    });
  }
}

