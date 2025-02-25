import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Suppliers } from 'app/models/suppliers';
import { SuppliersService } from 'app/services/suppliers.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-suppliers-modal-create',
  templateUrl: './suppliers-modal-create.component.html',
  styleUrls: ['./suppliers-modal-create.component.scss']
})
export class SuppliersModalCreateComponent implements OnInit {

  suppliers: Suppliers[];
  
    newSuppliers = {
      proveedor: '',
      contacto:'',
      email:'',
      telefono: '',
      direccion:''
    }
  
    constructor(
      public dialogRef: MatDialogRef<SuppliersModalCreateComponent>,
      private supplierService: SuppliersService,
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
          this.supplierService
            .obtenerSuppliers()
            .subscribe((respon) => {
              this.suppliers = respon;
              Swal.close();
            });
        },
      });
    }
  
    onSave(): void {
      if (this.newSuppliers != null) {
  
        const newSupplier: Suppliers = {
          suppliers_id: 0, // o null, según cómo manejes la creación en el backend
          nameSuppliers: this.newSuppliers.proveedor,
          contactSuppliers: this.newSuppliers.contacto,
          emailSuppliers: this.newSuppliers.email,
          phoneSuppliers: this.newSuppliers.telefono,
          addressSuppliers: this.newSuppliers.direccion
        };
        this.supplierService.suppliersCreate(newSupplier).subscribe({
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
