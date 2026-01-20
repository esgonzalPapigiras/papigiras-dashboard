import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PassengerDTO } from 'app/models/passengerDTO';
import { ToursServicesService } from 'app/services/tours-services.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-passenger-edit-dialog',
  templateUrl: './passenger-edit-dialog.component.html',
  styleUrls: ['./passenger-edit-dialog.component.scss']
})
export class PassengerEditDialogComponent {

  form: FormGroup;
  loading = false;
  sexOptions = ['M', 'F', 'AM', 'AF', 'PM', 'PF'];
  sizeOptions = ['XS', 'S', 'M', 'L', 'XL'];
  dietOptions = ['Tradicional', 'Vegetariana', 'Vegana', 'Celiaca', 'Otra'];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: PassengerDTO,
    private fb: FormBuilder,
    private svc: ToursServicesService,
    private dialogRef: MatDialogRef<PassengerEditDialogComponent>
  ) {
    this.form = this.fb.group({
      // IDs (no editables usualmente)
      passengersId: [{ value: data.passengersId, disabled: true }],
      passengersUuid: [{ value: data.passengersUuid, disabled: true }],
      // Datos básicos
      passengersCourse: [data.passengersCourse, [Validators.required]],
      passengersFatherLastName: [data.passengersFatherLastName, [Validators.required]],
      passengersMotherLastName: [data.passengersMotherLastName],
      passengersNames: [data.passengersNames, [Validators.required]],
      passengersIdentification: [data.passengersIdentification, [Validators.required]],
      passengersBirthDate: [data.passengersBirthDate, [Validators.required]],
      passengersPhone: [data.passengersPhone],
      passengersEmail: [data.passengersEmail, [Validators.email]],
      passengersSex: [data.passengersSex || 'M'],
      passengersSize: [data.passengersSize || 'M'],
      passengersDiet: [data.passengersDiet || 'Tradicional'],
      // Económicos
      passengersPaidOrReleased: [data.passengersPaidOrReleased],
      passengersTotalPayment: [data.passengersTotalPayment],
      // Tipo/comentario
      passengersType: [data.passengersType || 'Escolar'],
      passengersComment: [data.passengersComment ?? ''],
      // Apoderado
      idPassengerAttorney: [data.idPassengerAttorney],
      emailPassengersAttorney: [data.emailPassengersAttorney, [Validators.email]],
      namePassengersAttorney: [data.namePassengersAttorney],
      phonePassengersAttorney: [data.phonePassengersAttorney],
      passengersIdAttorney: [data.passengersIdAttorney],
      // Flags
      passengersTotalTruePayment: [data.passengersTotalTruePayment],
      passengersActive: [data.passengersActive],
      passengersVoucher: [data.passengersVoucher],
      medicalRecord: [data.medicalRecord]
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const sex = this.form.get('passengersSex')?.value;
    this.form.get('passengersType')?.setValue(
      sex === 'F' || sex === 'M' ? 'Escolar' : 'Acompañante'
    );
    const dto: PassengerDTO = {
      ...(this.data || {}),
      ...this.form.getRawValue() // getRawValue incluye disabled
    };
    const idParam = (dto.passengersUuid && String(dto.passengersUuid).trim().length > 0)
      ? String(dto.passengersUuid)
      : String(dto.passengersId);
    this.loading = true;
    Swal.fire({ title: 'Guardando...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
    this.svc.updatePassenger(dto, this.data.passengersId).subscribe({
      next: (updated) => {
        Swal.close();
        Swal.fire({ icon: 'success', title: 'Actualizado', timer: 1400, showConfirmButton: false });
        this.loading = false;
        this.dialogRef.close(updated);
      },
      error: (err) => {
        this.loading = false;
        Swal.close();
        Swal.fire({ icon: 'error', title: 'Error al actualizar', text: err?.error?.message || 'Revisa los datos e intenta nuevamente.' });
      }
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
