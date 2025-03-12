import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Branch } from 'app/models/branch';
import { CollegeList } from 'app/models/collegeList';
import { Communes } from 'app/models/communes';
import { Program } from 'app/models/program';
import { BranchService } from 'app/services/branch.service';
import { ComunnesService } from 'app/services/comunnes.service';
import { ProgramsService } from 'app/services/programs.service';
import { ToursServicesService } from 'app/services/tours-services.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-new-tour-modal',
  templateUrl: './new-tour-modal.component.html',
  styleUrls: ['./new-tour-modal.component.scss']
})
export class NewTourModalComponent implements OnInit {

  form: FormGroup;
  branch: Branch[] = [];
  programs: any[] = [];
  colleges: any[] = [];
  comunnes: any[] = [];
  searchTerm: string = '';
  searchTermCollege:string ='';
  searchTermPrograms:string ='';
  selectedProgram: any;
  selectedComuna: any;
  selectedCollege: any;
  

  newComunnes = {
    office: null,
    comunne: null,
    college: null,
    program: null,
    curso: '',
    temporada: '',
    numeroGrupo: ''
  };

  constructor(
    public dialogRef: MatDialogRef<NewTourModalComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private comunnesService: ComunnesService,
    private branchService: BranchService,
    private programService: ProgramsService,
    private tourService: ToursServicesService
  ){} /*{
    this.form = this.fb.group({
      fechaInicio: ['', Validators.required],
      fechaTermino: ['', Validators.required],
      curso: ['', Validators.required],
      temporada: ['', Validators.required],
      numeroGrupo: ['', Validators.required]
    });
  }*/

  ngOnInit(): void {
    Swal.fire({
      title: "Cargando...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
        this.obtenerOficina();
        this.obtenerComunas();
        this.obtenerPrograma();
        this.obtenerColegios();
      },
    });
    Swal.close();
  }

  // Función para filtrar comunas basándose en el término de búsqueda
  filteredComunnes() {
    return this.comunnes.filter(comunnes =>     
      comunnes.communesName.includes(this.searchTerm.toLowerCase())
    );
  }

  filteredColleges() {
    return this.colleges.filter(colleges =>     
      colleges.name.includes(this.searchTermCollege.toLowerCase())
    );
  }

  filteredPrograms(){
    return this.programs.filter(programs =>     
      programs.tours_name.includes(this.searchTermPrograms.toLowerCase())
    );
  }


  // Función para enviar las comunas seleccionadas
  

  // Obtener las comunas del servicio
  obtenerComunas() {
    Swal.fire({
      title: "Cargando...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
        this.comunnesService
          .ObtenerCommunes()
          .subscribe((respon) => {
            this.comunnes = respon;
            Swal.close();
          });
      },
    });
  }

  // Función para obtener oficinas
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

  // Función para obtener programas
  obtenerPrograma() {
    Swal.fire({
      title: "Cargando...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
        this.programService
          .obtenerProgram()
          .subscribe((respon) => {
            this.programs = respon;
            Swal.close();
          });
      },
    });
  }

  // Función para obtener colegios
  obtenerColegios() {
    Swal.fire({
      title: "Cargando...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
        this.tourService
          .listCollege()
          .subscribe((respon) => {
            this.colleges = respon;
            Swal.close();
          });
      },
    });
  }

  onClose(): void {
    this.dialogRef.close();  // Cerrar el modal sin guardar
  }

  onSave(){}

}
