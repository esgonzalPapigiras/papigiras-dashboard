import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { BusService } from 'app/services/bus.service';
import Swal from 'sweetalert2';
import { BusCreateUpdateDTO } from 'app/models/BusCreateUpdateDTO';

@Component({
  selector: 'app-bus-modal-create',
  templateUrl: './bus-modal-create.component.html',
  styleUrls: ['./bus-modal-create.component.scss']
})
export class BusModalCreateComponent implements OnInit {

  bus: BusCreateUpdateDTO = {
    patente: '',
    anoBus: null,
    empresa: '',
    capacidad: null,
    marca: '',
    modelo: ''
  };

  constructor(
    private busService: BusService,
    public dialogRef: MatDialogRef<BusModalCreateComponent>
  ) { }

  ngOnInit(): void {}

  onSave(): void {
    this.bus.capacidad = 0;
    Swal.fire({
      title: "Guardando...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
        this.busService.createBus(this.bus).subscribe({
          next: () => {
            Swal.close();
            Swal.fire('Éxito', 'Bus creado correctamente.', 'success');
            this.dialogRef.close(true);
          },
          error: (err) => {
            Swal.close();
            console.error('Error al guardar bus:', err);
            Swal.fire('Error', 'No se pudo guardar el bus.', 'error');
          }
        });
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

}
