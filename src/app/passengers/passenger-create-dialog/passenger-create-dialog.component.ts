import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ToursServicesService } from 'app/services/tours-services.service';
import Swal from 'sweetalert2';
import { PassengerDTO } from 'app/models/passengerDTO';
import { AlumnsService } from 'app/services/alumns.service';

@Component({
  selector: 'app-passenger-create-dialog',
  templateUrl: './passenger-create-dialog.component.html',
  styleUrls: ['./passenger-create-dialog.component.scss']
})
export class PassengerCreateDialogComponent implements OnInit {

  form: FormGroup;
  loading = false;

  sexOptions = ['M', 'F', 'AM', 'AF', 'PM', 'PF', 'Otro'];
  sizeOptions = ['XS', 'S', 'M', 'L', 'XL'];
  dietOptions = ['Tradicional', 'Vegetariana', 'Vegana', 'Celiaca', 'Otra'];

  constructor(
    private fb: FormBuilder,
    private passengerService: AlumnsService,
    private dialogRef: MatDialogRef<PassengerCreateDialogComponent>
  ) {
    this.form = this.fb.group({
      codigoGira: ['', Validators.required],
      passengersIdentification: ['', Validators.required],
      passengersFatherLastName: ['', Validators.required],
      passengersMotherLastName: [''],
      passengersNames: ['', Validators.required],
      passengersBirthDate: ['', Validators.required],
      passengersSex: ['', Validators.required],
      passengersSize: ['M'],
      passengersDiet: ['Tradicional'],
      passengersPhone: [''],
      passengersEmail: ['', Validators.email],
      // Apoderado
      namePassengersAttorney: [''],
      phonePassengersAttorney: [''],
      emailPassengersAttorney: ['', Validators.email]
    });
  }

  ngOnInit(): void {
    // Dynamically require apoderado fields depending on sexo
    this.form.get('passengersSex')?.valueChanges.subscribe(sex => {
      const isMinor = ['M', 'F'].includes(sex);
      const fields = [
        'namePassengersAttorney',
        'phonePassengersAttorney',
        'emailPassengersAttorney'
      ];
      fields.forEach(f => {
        const ctrl = this.form.get(f);
        if (!ctrl) return;
        if (isMinor) {
          ctrl.addValidators(Validators.required);
        } else {
          ctrl.removeValidators(Validators.required);
        }
        ctrl.updateValueAndValidity();
      });
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const dto: PassengerDTO = {
      ...this.form.value,
      passengersType: 'Escolar',
      passengersComment: '',
      passengersActive: true
    };
    console.log(this.form.value)
    console.log(dto)

    this.loading = true;
    Swal.fire({ title: 'Creando...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
    this.passengerService.createPassenger(dto).subscribe({
      next: (created) => {
        Swal.close();
        Swal.fire({ icon: 'success', title: 'Creado', timer: 1500, showConfirmButton: false });
        this.loading = false;
        this.dialogRef.close(created);
      },
      error: (err) => {
        this.loading = false;
        Swal.close();
        Swal.fire({
          icon: 'error',
          title: 'Error al crear',
          text: err?.error?.message || 'Revisa los datos e intenta nuevamente.'
        });
      }
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
