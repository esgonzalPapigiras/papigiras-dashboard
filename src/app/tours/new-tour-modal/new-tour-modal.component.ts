import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Branch } from 'app/models/branch';
import { Communes } from 'app/models/communes';
import { BranchService } from 'app/services/branch.service';
import { ComunnesService } from 'app/services/comunnes.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-new-tour-modal',
  templateUrl: './new-tour-modal.component.html',
  styleUrls: ['./new-tour-modal.component.scss']
})
export class NewTourModalComponent implements OnInit {

  form: FormGroup;
  branch : Branch[];
  comunnes : Communes[];

  constructor(
    public dialogRef: MatDialogRef<NewTourModalComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private comunnesService: ComunnesService,
    private branchService: BranchService

  ) {
    this.form = this.fb.group({
      fechaInicio: ['', Validators.required],
      fechaTermino: ['', Validators.required],
      oficina: ['', Validators.required],
      comuna: ['', Validators.required],
      colegio: ['', Validators.required],
      programa: ['', Validators.required],
      curso: ['', Validators.required],
      temporada: ['', Validators.required],
      numeroGrupo: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    this.obtenerOficina();
    this.obtenerComunas();
  }

  onSave(): void {
    if (this.form.valid) {
      console.log('Form data:', this.form.value);
      // Llamar al servicio para guardar la información
      this.dialogRef.close();  // Cerrar el modal después de guardar
    } else {
      console.log('Form invalid');
    }
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

  onClose(): void {
    this.dialogRef.close();  // Cerrar el modal sin guardar
  }

}
