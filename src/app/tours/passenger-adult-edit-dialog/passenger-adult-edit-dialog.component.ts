import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { ToursServicesService } from 'app/services/tours-services.service';

@Component({
  selector: 'app-passenger-adult-edit-dialog',
  templateUrl: './passenger-adult-edit-dialog.component.html',
  styleUrls: ['./passenger-adult-edit-dialog.component.scss']
})
export class PassengerAdultEditDialogComponent {

  form: FormGroup;
  loading = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private svc: ToursServicesService,
    private dialogRef: MatDialogRef<PassengerAdultEditDialogComponent>) {
    this.form = this.fb.group({
      passengersId: [{ value: data.passengersId, disabled: true }],
      passengersNames: [data.passengersNames, Validators.required],
      passengersFatherLastName: [data.passengersFatherLastName],
      passengersMotherLastName: [data.passengersMotherLastName],
      passengersIdentification: [data.passengersIdentification, Validators.required],
      passengersPhone: [data.passengersPhone],
      passengersEmail: [data.passengersEmail, Validators.email],
      passengersActive: [data.passengersActive],
      passengersComment: [data.passengersComment]
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const dto = {
      ...this.data,
      ...this.form.getRawValue()
    };
    Swal.fire({ title: 'Guardando...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
    this.loading = true;
    this.svc.updatePassenger(dto, this.data.passengersId).subscribe({
      next: (updated) => {
        Swal.close();
        Swal.fire({ icon: 'success', title: 'Actualizado', timer: 1200, showConfirmButton: false });
        this.dialogRef.close(updated);
      },
      error: (err) => {
        Swal.close();
        this.loading = false;
        Swal.fire({ icon: 'error', title: 'Error', text: err?.error?.message || 'No se pudo actualizar.' });
      }
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }

}
