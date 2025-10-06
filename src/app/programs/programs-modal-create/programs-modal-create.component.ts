import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Program } from 'app/models/program';
import { ProgramsService } from 'app/services/programs.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-programs-modal-create',
  templateUrl: './programs-modal-create.component.html',
  styleUrls: ['./programs-modal-create.component.scss']
})
export class ProgramsModalCreateComponent implements OnInit {

  suppliers: Program[];
  
    newProgram = {
      nombrePrograma: '',
      cantidadDias:'',
      cantidadNoches:'',
      
    }
  
    constructor(
      public dialogRef: MatDialogRef<ProgramsModalCreateComponent>,
      private programService: ProgramsService,
      @Inject(MAT_DIALOG_DATA) public data: any,
  
    ) { }
  
    ngOnInit(): void {
      this.obtenerProveedor();
      
    }
  
  
  
    obtenerProveedor() {
      Swal.fire({
        title: "Cargando...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
          this.programService
            .obtenerProgram()
            .subscribe((respon) => {
              this.suppliers = respon;
              Swal.close();
            });
        },
      });
    }
  
    onSave(): void {
      if (this.newProgram != null) {
  
        const newActivitie: Program = {
          tour_id: 0, // o null, según cómo manejes la creación en el backend
          toursName: this.newProgram.nombrePrograma,
          tour_day_quantity: this.newProgram.cantidadDias,
          tour_nigth_quantity: this.newProgram.cantidadNoches
        };
        this.programService.programCreate(newActivitie).subscribe({
          next: () => {
            // Llamamos al método que refresca la lista de oficinas
            // Cerramos el modal indicando éxito (true)
            this.dialogRef.close(true);
          },
          error: (err) => {
            console.error('Error al guardar la oficina:', err);
            // Puedes optar por cerrar el modal con false o mostrar un mensaje de error sin cerrarlo
            this.dialogRef.close(false);
          }
        });
      }
    }
  
  
  
    onCancel(): void {
      this.dialogRef.close(false);
    }

}
