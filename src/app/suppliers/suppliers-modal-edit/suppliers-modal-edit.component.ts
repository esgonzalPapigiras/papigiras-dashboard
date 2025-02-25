import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Suppliers } from 'app/models/suppliers';
import { SuppliersService } from 'app/services/suppliers.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-suppliers-modal-edit',
  templateUrl: './suppliers-modal-edit.component.html',
  styleUrls: ['./suppliers-modal-edit.component.scss']
})
export class SuppliersModalEditComponent implements OnInit {


  suppliers: Suppliers;


  constructor(
    public dialogRef: MatDialogRef<SuppliersModalEditComponent>,
    public dialog: MatDialog,
    private supplierService: SuppliersService,
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
          this.suppliers = this.data;
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
        console.log(this.suppliers)
        this.supplierService.suppliersUpdate(this.suppliers, this.data.suppliers_id).subscribe(
          (response) => {
            Swal.close();
            Swal.fire(
              "Éxito",
              "Los datos del proveedor han sido guardados",
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
