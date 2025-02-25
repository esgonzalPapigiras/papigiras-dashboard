import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Activities } from 'app/models/activities';
import { Suppliers } from 'app/models/suppliers';
import { ActivitiesService } from 'app/services/activities.service';
import { SuppliersService } from 'app/services/suppliers.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-activities-modal-edit',
  templateUrl: './activities-modal-edit.component.html',
  styleUrls: ['./activities-modal-edit.component.scss']
})
export class ActivitiesModalEditComponent implements OnInit {

  
    actividad: Activities;
    newActividad : Activities = new Activities();
    suppliers : Suppliers[];
    
  
    constructor(
        public dialogRef: MatDialogRef<ActivitiesModalEditComponent>,
        public dialog: MatDialog,
        private supplierService: SuppliersService,
        private activitiesService: ActivitiesService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        ) { }
  
    ngOnInit(): void {
      this.obtenercomunaUpdate();
      this.obtenerSuppliers();
    }

    obtenerSuppliers() {
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
    
    
    
  
    obtenercomunaUpdate(){
      
      Swal.fire({
            title: "Cargando...",
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
              if (this.data) {
                this.actividad = this.data;
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
          
          console.log(this.data.itinerary_id)
          console.log(this.actividad);

          this.newActividad.id_supplier = this.actividad.id_supplier
          this.newActividad.itinerary_active = false
          this.newActividad.itinerary_description = this.actividad.itinerary_description
          this.newActividad.itinerary_id = this.actividad.itinerary_id
          this.newActividad.itinerary_includes = this.actividad.itinerary_includes
          this.newActividad.itinerary_name = this.actividad.itinerary_name

          this.activitiesService.activitiesUpdate(this.newActividad, this.data.itinerary_id).subscribe(
            (response) => {
              Swal.close();
              Swal.fire(
                "Éxito",
                "Los datos de la actividad ha sido guardada",
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
