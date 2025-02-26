import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Branch } from 'app/models/branch';
import { Coordinator } from 'app/models/coordinator';
import { BranchService } from 'app/services/branch.service';
import { CoordinatorService } from 'app/services/coordinator.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-coordinator-modal-create',
  templateUrl: './coordinator-modal-create.component.html',
  styleUrls: ['./coordinator-modal-create.component.scss']
})
export class CoordinatorModalCreateComponent implements OnInit {

  coordinator = {
    rut: '',
    coordinatorName: '',
    coordinatorLastname: '',
    coordinatorSex: '',
    coordinatorResidencia: '',
    coordinatorOficina: '',
    coordinatorFechaNacimiento: '',
    coordinatorEdad: null,
    coordinatorCelular: '',
    coordinatorCorreo: '',
    coordinatorInstaPersonal: '',
    coordinatorInstaAt: '',
    coordinatorUniversidad: '',
    coordinatorCarrera: '',
    coordinatorProfesion: '',
    coordinatorEmpresa: ''
  };

  sexOptions = ['Masculino', 'Femenino', 'Otro'];
  branch : Branch[];

  constructor(private _liveAnnouncer: LiveAnnouncer,
      public dialog: MatDialog,
      private coordinatorServices: CoordinatorService,
      private branchService:BranchService,
      public dialogRef: MatDialogRef<CoordinatorModalCreateComponent>) { }

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
              Swal.close();
            });
        },
      });
    }

  onSave(): void {
    
    const coordinatorObj = {
      coordinatorId: 0,  // Asumiendo que el ID es un número que se asignará
      coordinatorRut: this.coordinator.rut,
      coordinatorName: this.coordinator.coordinatorName,
      coordinatorLastname: this.coordinator.coordinatorLastname,
      coordinatorSex: this.coordinator.coordinatorSex,
      coordinatorResidencia: this.coordinator.coordinatorResidencia,
      coordinatorOficina: this.coordinator.coordinatorOficina,
      coordinatorFechaNacimiento: this.coordinator.coordinatorFechaNacimiento,
      coordinatorEdad: this.coordinator.coordinatorEdad !== null ? this.coordinator.coordinatorEdad : 0, // Si es null, asignamos 0
      coordinatorCelular: this.coordinator.coordinatorCelular,
      coordinatorCorreo: this.coordinator.coordinatorCorreo,
      coordinatorInstaPersonal: this.coordinator.coordinatorInstaPersonal,
      coordinatorInstaAt: this.coordinator.coordinatorInstaAt,
      coordinatorUniversidad: this.coordinator.coordinatorUniversidad,
      coordinatorCarrera: this.coordinator.coordinatorCarrera,
      coordinatorProfesion: this.coordinator.coordinatorProfesion,
      coordinatorEmpresa: this.coordinator.coordinatorEmpresa,
      coordinatorPicture: false // Valor por defecto como false
    };
    
    this.coordinatorServices.coordinatorCreate(coordinatorObj).subscribe({
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

  onCancel(): void {
    this.dialogRef.close(false);
  }

}
