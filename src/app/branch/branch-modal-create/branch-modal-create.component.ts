import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Branch } from 'app/models/branch';
import { BranchService } from 'app/services/branch.service';

@Component({
  selector: 'app-branch-modal-create',
  templateUrl: './branch-modal-create.component.html',
  styleUrls: ['./branch-modal-create.component.scss']
})
export class BranchModalCreateComponent implements OnInit {

  branchName: string = '';

  constructor(
    public dialogRef: MatDialogRef<BranchModalCreateComponent>,
    private branchService: BranchService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    
  ) { }

  onSave(): void {
    if (this.branchName.trim().length > 0) {
      const newBranch: Branch = {
        branchId: 0, // o null, según cómo manejes la creación en el backend
        branchName: this.branchName
      };
      console.log(newBranch);
      this.branchService.branchCreate(newBranch).subscribe({
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

  ngOnInit(): void {
  }

}
