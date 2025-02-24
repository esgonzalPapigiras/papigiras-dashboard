import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Branch } from 'app/models/branch';
import { Communes } from 'app/models/communes';
import { BranchService } from 'app/services/branch.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-branch-modal-edit',
  templateUrl: './branch-modal-edit.component.html',
  styleUrls: ['./branch-modal-edit.component.scss']
})
export class BranchModalEditComponent implements OnInit {

  
  
  oficina: Branch;
  oficinaUpdate: Branch = new Branch();

  constructor(public dialogRef: MatDialogRef<BranchModalEditComponent>,
      private branchService: BranchService,
      @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.obtenercomunaUpdate();
  }

  

  obtenercomunaUpdate(){
      console.log(this.data);
      Swal.fire({
            title: "Cargando...",
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
              if (this.data) {
                this.oficina = this.data;
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
          this.oficinaUpdate.branchId = this.oficina.branchId;
          this.oficinaUpdate.branchName = this.oficina.branchName;
          
          this.branchService.branchUpdate(this.oficinaUpdate, this.data.branchId).subscribe(
            (response) => {
              Swal.close();
              Swal.fire(
                "Éxito",
                "Los datos de la oficina han sido guardados",
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
