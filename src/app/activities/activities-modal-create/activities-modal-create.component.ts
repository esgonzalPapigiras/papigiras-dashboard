import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Activities } from 'app/models/activities';
import { Suppliers } from 'app/models/suppliers';
import { ActivitiesService } from 'app/services/activities.service';
import { SuppliersService } from 'app/services/suppliers.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-activities-modal-create',
  templateUrl: './activities-modal-create.component.html',
  styleUrls: ['./activities-modal-create.component.scss']
})
export class ActivitiesModalCreateComponent implements OnInit {

  suppliers: Suppliers[];
  newActivities = {
    actividad: '',
    descripcion: '',
    incluye: '',
    suppliers: null as Suppliers | null,
  }

  constructor(
    public dialogRef: MatDialogRef<ActivitiesModalCreateComponent>,
    private activitiesService: ActivitiesService,
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
            if (this.suppliers && this.suppliers.length > 0) {
              this.newActivities.suppliers = this.suppliers[0];   // auto-select default
            }
            Swal.close();
          });
      },
    });
  }

  onSave(): void {
    if (this.newActivities != null) {
      const newActivitie: Activities = {
        itinerary_id: 0,
        itinerary_active: true,
        itinerary_description: this.newActivities.descripcion,
        itinerary_includes: "",
        itinerary_name: this.newActivities.actividad,
        id_supplier: this.newActivities.suppliers.suppliers_id
      };
      this.activitiesService.activitiesCreate(newActivitie).subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error('Error al guardar la oficina:', err);
          this.dialogRef.close(false);
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
