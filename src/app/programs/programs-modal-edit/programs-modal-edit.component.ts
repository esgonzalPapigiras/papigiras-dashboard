import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Program } from 'app/models/program';
import { ProgramsService } from 'app/services/programs.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-programs-modal-edit',
  templateUrl: './programs-modal-edit.component.html',
  styleUrls: ['./programs-modal-edit.component.scss']
})
export class ProgramsModalEditComponent implements OnInit {

    program: Program;
    
  
  
    constructor(
      public dialogRef: MatDialogRef<ProgramsModalEditComponent>,
      public dialog: MatDialog,
      private programService: ProgramsService,
      @Inject(MAT_DIALOG_DATA) public data: any,
    ) { }
  
    ngOnInit(): void {
      this.obtenercomunaUpdate();
    }
  
    
  
  
  
  
    obtenercomunaUpdate() {
  
      Swal.fire({
        title: "Cargando...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
          if (this.data) {
            this.program = this.data;
          }
  
          Swal.close();
        },
      });
    }
  
    onSave() {
      Swal.fire({
        title: "Guardando...",
        text: "Por favor espera mientras se guarda la información.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
          this.programService.programUpdate(this.program, this.data.tours_id).subscribe(
            (response) => {
              Swal.close();
              Swal.fire(
                "Éxito",
                "Los datos del programa han sido guardados",
                "success"
              ).then(() => {
                // Cierra el modal y retorna "true"
                this.dialogRef.close(true);
              });
            },
            (error) => {
              console.log(error);
              Swal.close();
              Swal.fire(
                "Error",
                "Hubo un problema al guardar los datos",
                "error"
              );
            }
          );
        },
      });
    }
  
  
  
    onCancel(): void {
      this.dialogRef.close(false);
    }

}
