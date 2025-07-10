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
  searchTerm = '';
  searchTermCollege='';
  comunnes: any[] = [];
  colleges: any[] =[];
  branch: Branch[] = [];
  filteredList: any[] = [];
  filteredListCollege: any[] = [];
  selectedComuna: any;
  selectedCollege:any;
  

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
  ){}

  ngOnInit(): void {
    Swal.fire({
      title: "Cargando...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
        //this.obtenerOficina();
        this.obtenerComunas();
        //this.obtenerPrograma();
        this.obtenerColegios();
      },
    });
    Swal.close();
  }

  filteredComunnes() {
    const term = this.searchTerm.trim().toLowerCase();
    return term
      ? this.comunnes.filter(c =>
          c.communesName.toLowerCase().includes(term)
        )
      : this.comunnes;
  }

  

  


  // Función para enviar las comunas seleccionadas
  

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
            // inicializamos la lista filtrada
            this.filteredList = [...this.comunnes];
            // si ya había algo escrito, lo filtramos
            if (this.searchTerm) {
              this.onSearchChange();
            }
            Swal.close();
          });
      },
    });
  }

  onSearchChange() {
    const term = this.searchTerm.trim().toLowerCase();
    this.filteredList = term
      ? this.comunnes.filter(c =>
          c.communesName.toLowerCase().includes(term)
        )
      : [...this.comunnes];
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
            this.filteredListCollege = [...this.colleges];
            Swal.close();
          });
      },
    });
  }

  onSearchChangeCollege() {
    const term = this.searchTermCollege.trim().toLowerCase();
    this.filteredListCollege = term
      ? this.colleges.filter(c =>
          c.name.toLowerCase().includes(term)
        )
      : [...this.colleges];
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


  /*
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
    */

  

  onClose(): void {
    this.dialogRef.close();  // Cerrar el modal sin guardar
  }

  onSave(){}

}
