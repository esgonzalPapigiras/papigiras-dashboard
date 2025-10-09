import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
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
    @Inject(MAT_DIALOG_DATA) public data: { idTour: number; idPassenger: number; nombres?: string; apellidos?: string; curso?: string; colegio?: string }
  ) {
    this.form = this.fb.group({
      // Campos de texto
      nombres: [data?.nombres ?? '', [Validators.required, Validators.maxLength(120)]],
      apellidos: [data?.apellidos ?? '', [Validators.required, Validators.maxLength(120)]],
      curso: [data?.curso ?? '', [Validators.maxLength(60)]],
      colegio: [data?.colegio ?? '', [Validators.maxLength(120)]],
      comuna: ['', [Validators.maxLength(120)]],
      rut: ['', [Validators.required, Validators.maxLength(20)]],
      grupoSanguineo: ['', [Validators.maxLength(10)]],

      // Contacto emergencia
      contactoEmergenciaNombre: ['', [Validators.required, Validators.maxLength(120)]],
      contactoEmergenciaRelacion: ['', [Validators.required, Validators.maxLength(60)]],
      contactoEmergenciaTelefono: ['', [Validators.required, Validators.maxLength(20)]],
      contactoEmergenciaEmail: ['', [Validators.email, Validators.maxLength(120)]],

      // Coberturas
      tieneFonasa: [false],
      tieneIsapre: [false],
      isapre: [''],

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
      fechaNacimiento: ['', Validators.required],  // string (yyyy-MM-dd)
      fechaAutorizacion: ['', Validators.required],

      // IDs obligatorios
      idPassenger: [this.data.idPassenger, [Validators.required]],
      idTour: [this.data.idTour, [Validators.required]],
    });

    // Reglas de habilitación dinámica
    this.form.get('tieneIsapre')!.valueChanges.subscribe(v => {
      const isapreCtrl = this.form.get('isapre')!;
      v ? isapreCtrl.setValidators([Validators.required, Validators.maxLength(120)]) : isapreCtrl.clearValidators();
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

    // Armar payload exactamente como tu DTO en backend
    const payload = {
      ...this.form.value,
      // Asegura formatos string para fechas (yyyy-MM-dd)
      fechaNacimiento: this.toDateString(this.form.value.fechaNacimiento),
      fechaAutorizacion: this.toDateString(this.form.value.fechaAutorizacion),
      // medicamentos: List<Map<String,String>>
      medicamentos: (this.form.value.medicamentos || []).map((m: any) => ({ nombre: m.nombre, dosis: m.dosis })),
    };

    Swal.fire({
      title: 'Guardando ficha...',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    // Llama al servicio real aquí (inyéctalo si prefieres) o emite al padre
    // — Ejemplo simple: usa window para no alargar —
    (window as any).ngMedicalService
      ? (window as any).ngMedicalService(payload)
      : null;

    // Si lo manejas desde el padre, emite:
    // this.girasService.createMedicalRecord(payload).subscribe(...)

    // Para dejar el ejemplo autocontenible:
    // cierra devolviendo true
    Swal.close();
    this.dialogRef.close(true);
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
