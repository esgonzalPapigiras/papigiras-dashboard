import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToursServicesService } from 'app/services/tours-services.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medical-record-dialog',
  templateUrl: './medical-record-dialog.component.html',
  styleUrls: ['./medical-record-dialog.component.scss']
})
export class MedicalRecordDialogComponent {

  form: FormGroup;

  get medicamentosFA(): FormArray {
    return this.form.get('medicamentos') as FormArray;
  }

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<MedicalRecordDialogComponent>,
    private girasService: ToursServicesService,
    @Inject(MAT_DIALOG_DATA) public data: {
      fechaNacimiento: string; idTour: number; idPassenger: number; nombres?: string; apellidos?: string; curso?: string; RUT?: string;
    }
  ) {
    this.form = this.fb.group({
      // Campos de texto
      nombres: [data?.nombres ?? '', [Validators.required, Validators.maxLength(120)]],
      apellidos: [data?.apellidos ?? '', [Validators.required, Validators.maxLength(120)]],
      curso: [data?.curso ?? '', [Validators.maxLength(60)]],
      RUT: [data?.RUT ?? '', [Validators.required, Validators.maxLength(20)]],
      grupoSanguineo: ['', [Validators.maxLength(10)]],
      fechaNacimiento: [data?.fechaNacimiento ?? '', [Validators.required, Validators.maxLength(20)]],

      // Contacto emergencia
      contactoEmergenciaNombre: ['', [Validators.required, Validators.maxLength(120)]],
      contactoEmergenciaRelacion: ['', [Validators.required, Validators.maxLength(60)]],
      contactoEmergenciaTelefono: ['', [Validators.required, Validators.maxLength(20)]],
      contactoEmergenciaEmail: ['', [Validators.email, Validators.maxLength(120)]],

      cobertura: [''], // 'FONASA' | 'ISAPRE'
      isapreNombre: [''],

      // Enfermedades / medicamentos
      tieneEnfermedades: [false],
      enfermedades: [''],
      tomaMedicamentos: [false],
      medicamentos: this.fb.array([]), // [{ nombre, dosis }]
      evitarMedicamentos: [false],
      medicamentosEvitar: [''],
      requiereCuidadosEspeciales: [false],
      cuidadosEspeciales: [''],

      // Fechas
      fechaAutorizacion: ['', Validators.required],

      // IDs obligatorios
      idPassenger: [this.data.idPassenger, [Validators.required]],
      idTour: [this.data.idTour, [Validators.required]],
    });

    // 🚀 Disable the prefilled, non-editable fields
    ['nombres', 'apellidos', 'RUT', 'curso', 'fechaNacimiento'].forEach(field => {
      const ctrl = this.form.get(field);
      if (ctrl) ctrl.disable({ emitEvent: false });
    });

    // Reglas de habilitación dinámica
    this.form.get('cobertura')!.valueChanges.subscribe(value => {
      const isapreCtrl = this.form.get('isapreNombre')!;
      if (value === 'ISAPRE') {
        isapreCtrl.setValidators([Validators.required, Validators.maxLength(120)]);
      } else {
        isapreCtrl.clearValidators();
      }
      isapreCtrl.updateValueAndValidity();
    });

    this.form.get('tieneEnfermedades')!.valueChanges.subscribe(v => {
      const enf = this.form.get('enfermedades')!;
      v ? enf.setValidators([Validators.required, Validators.maxLength(1000)]) : enf.clearValidators();
      enf.updateValueAndValidity();
    });

    this.form.get('tomaMedicamentos')!.valueChanges.subscribe(v => {
      if (v && this.medicamentosFA.length === 0) this.addMedicamento();
      if (!v) this.medicamentosFA.clear();
    });

    this.form.get('evitarMedicamentos')!.valueChanges.subscribe(v => {
      const ev = this.form.get('medicamentosEvitar')!;
      v ? ev.setValidators([Validators.required, Validators.maxLength(500)]) : ev.clearValidators();
      ev.updateValueAndValidity();
    });

    this.form.get('requiereCuidadosEspeciales')!.valueChanges.subscribe(v => {
      const c = this.form.get('cuidadosEspeciales')!;
      v ? c.setValidators([Validators.required, Validators.maxLength(1000)]) : c.clearValidators();
      c.updateValueAndValidity();
    });
  }


  addMedicamento(): void {
    this.medicamentosFA.push(
      this.fb.group({
        nombre: new FormControl('', [Validators.required, Validators.maxLength(120)]),
        dosis: new FormControl('', [Validators.required, Validators.maxLength(120)]),
      })
    );
  }

  removeMedicamento(i: number): void {
    this.medicamentosFA.removeAt(i);
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const raw = this.form.getRawValue();
    const payload = {
      ...raw,
      fechaNacimiento: this.toDateString(raw.fechaNacimiento),
      fechaAutorizacion: this.toDateString(raw.fechaAutorizacion),
      medicamentos: (raw.medicamentos || []).map((m: any) => ({ nombre: m.nombre, dosis: m.dosis })),
      tieneFonasa: raw.cobertura === 'FONASA',
      tieneIsapre: raw.cobertura === 'ISAPRE',
      isapre: raw.cobertura === 'ISAPRE' ? raw.isapreNombre : '',
    };
    console.log(payload)
    Swal.fire({ title: 'Guardando ficha...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
    this.girasService.createMedicalRecord(payload).subscribe({
      next: () => {
        Swal.close();
        Swal.fire({ icon: 'success', title: 'Ficha guardada', text: 'La ficha médica fue registrada correctamente.' });
        this.dialogRef.close(true);
      },
      error: (err) => {
        Swal.close();
        console.error('Error al guardar ficha:', err);
        Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo guardar la ficha médica.' });
      },
    });
  }

  cancel(): void {
    this.dialogRef.close(false);
  }

  private toDateString(val: any): string {
    if (!val) return '';
    // Si viene como string yyyy-MM-dd, lo retornamos igual
    if (typeof val === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(val)) return val;
    // Si viene Date, lo parseamos
    const d = new Date(val);
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${mm}-${dd}`;
  }
}
