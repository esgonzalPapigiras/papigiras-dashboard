import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Coordinator } from 'app/models/coordinator';
import { CoordinatorService } from 'app/services/coordinator.service';

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
  officeOptions = ['Oficina 1', 'Oficina 2', 'Oficina 3'];

  constructor(private _liveAnnouncer: LiveAnnouncer,
      public dialog: MatDialog,
      private coordinatorServices: CoordinatorService) { }

  ngOnInit(): void {
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
    this.coordinatorServices.coordinatorCreate(coordinatorObj);
  }

}
