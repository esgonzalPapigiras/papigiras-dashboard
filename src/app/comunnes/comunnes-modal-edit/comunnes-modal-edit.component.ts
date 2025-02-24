import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Communes } from 'app/models/communes';
import { CommunesUpdate } from 'app/models/communesUpdate';
import { BranchService } from 'app/services/branch.service';
import { ComunnesService } from 'app/services/comunnes.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-comunnes-modal-edit',
  templateUrl: './comunnes-modal-edit.component.html',
  styleUrls: ['./comunnes-modal-edit.component.scss']
})
export class ComunnesModalEditComponent implements OnInit {

  communesNameNew: string = '';
  comuna: CommunesUpdate;
  communesUpdate: CommunesUpdate = new CommunesUpdate();

  constructor(
      public dialogRef: MatDialogRef<ComunnesModalEditComponent>,
      public dialog: MatDialog,
      private comunnesService: ComunnesService,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private branchService:BranchService) { }

  ngOnInit(): void {
    this.obtenercomunaUpdate();
  }

  obtenercomunaUpdate(){
    
    Swal.fire({
          title: "Cargando...",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
            if (this.data) {
              this.comuna = this.data;
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
        this.communesUpdate.communesBranchId = this.data.branchNameId;
        this.communesUpdate.communesName = this.comuna.communesName;
        this.communesUpdate.communesId = this.comuna.communesId;
        this.communesUpdate.communesNumeral = this.comuna.communesNumeral;
        
        this.comunnesService.communesCreateUpdate(this.communesUpdate, this.data.communesId).subscribe(
          (response) => {
            Swal.close();
            Swal.fire(
              "Éxito",
              "Los datos de la comuna han sido guardados",
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
