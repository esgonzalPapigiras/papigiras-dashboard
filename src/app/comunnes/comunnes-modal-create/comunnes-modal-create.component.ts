import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Branch } from 'app/models/branch';
import { Communes } from 'app/models/communes';
import { BranchService } from 'app/services/branch.service';
import { ComunnesService } from 'app/services/comunnes.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-comunnes-modal-create',
  templateUrl: './comunnes-modal-create.component.html',
  styleUrls: ['./comunnes-modal-create.component.scss']
})
export class ComunnesModalCreateComponent implements OnInit {

  newComunnes = {
    nombreComuna: '',
    office: null as Branch | null,
  }

  branch : Branch[];

  constructor(
        private _liveAnnouncer: LiveAnnouncer,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<ComunnesModalCreateComponent>,
        private comunnesService: ComunnesService,
        private branchService : BranchService) { }

  ngOnInit(): void {
    this.obtenerOficina();
  }

  obtenerOficina() {
        Swal.fire({
          title: "Cargando...",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
            this.branchService
              .obtenerOficinas()
              .subscribe((respon) => {
                this.branch = respon;
                console.log(this.branch);
                Swal.close();
              });
          },
        });
      }

  onSave(): void {
    
      if (this.newComunnes != null) {
        const coordinatorObj = { 
          communesId: 0, // o null, según cómo manejes la creación en el backend
          communesName: this.newComunnes.nombreComuna,
          branchName: this.newComunnes.office.branchName,
          branchNameId: this.newComunnes.office.branchId,
        };
        
        this.comunnesService.communesCreate(coordinatorObj).subscribe({
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
