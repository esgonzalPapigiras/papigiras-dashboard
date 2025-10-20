import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { Program } from 'app/models/program';
import { ComunnesService } from 'app/services/comunnes.service';
import { BranchService } from 'app/services/branch.service';
import { ProgramsService } from 'app/services/programs.service';
import { ToursServicesService } from 'app/services/tours-services.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-new-tour-modal',
  templateUrl: './new-tour-modal.component.html',
  styleUrls: ['./new-tour-modal.component.scss']
})
export class NewTourModalComponent implements OnInit {

  form!: FormGroup;

  years: number[] = [];
  // ¡ojo! usar variables distintas por select
  searchTerm = '';
  searchTermCollege = '';
  searchTermProgram = '';

  comunnes: any[] = [];
  colleges: any[] = [];
  programs: Program[] = [];

  filteredList: any[] = [];
  filteredListCollege: any[] = [];
  filteredListProgram: any[] = [];

  // ngModel (para selects con buscador en panel)
  selectedComuna: any;
  selectedCollege: any;
  selectPrograma: any;

  constructor(
    public dialogRef: MatDialogRef<NewTourModalComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private comunnesService: ComunnesService,
    private branchService: BranchService,
    private programService: ProgramsService,
    private tourService: ToursServicesService
  ) { }

  ngOnInit(): void {
    const curr = new Date().getFullYear();
    this.years = Array.from({ length: 4 }, (_, i) => curr + i);

    this.form = this.fb.group({
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      comunaId: [null, Validators.required],
      collegeId: [null, Validators.required],
      programId: [null, Validators.required],
      curso: ['', Validators.required],
      temporada: [curr, Validators.required]
    }, { validators: [this.dateRangeValidator] });

    Swal.fire({ title: 'Cargando...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
    this.obtenerComunas();
    this.obtenerColegios();
    this.obtenerPrograma();
  }

  // -------- Validación rango de fechas --------
  private dateRangeValidator = (group: AbstractControl): ValidationErrors | null => {
    const start = group.get('startDate')?.value;
    const end = group.get('endDate')?.value;
    if (!start || !end) return null;
    const s = new Date(start).setHours(0, 0, 0, 0);
    const e = new Date(end).setHours(0, 0, 0, 0);
    return s <= e ? null : { dateRange: 'startDate must be <= endDate' };
  };

  // ---------- Utilidad: tomar ID con múltiples posibles claves ----------
  private pickId(obj: any, candidates: string[]): number | string | null {
    for (const k of candidates) {
      if (obj && obj[k] !== undefined && obj[k] !== null) return obj[k];
    }
    return null;
  }

  // ---------- Búsquedas en selects ----------
  onSearchChange() {
    const term = this.searchTerm.trim().toLowerCase();
    this.filteredList = term
      ? this.comunnes.filter(c => (c.communesName || '').toLowerCase().includes(term))
      : [...this.comunnes];
  }

  onSearchChangeCollege() {
    const term = this.searchTermCollege.trim().toLowerCase();
    this.filteredListCollege = term
      ? this.colleges.filter(c => (c.name || '').toLowerCase().includes(term))
      : [...this.colleges];
  }

  onSearchChangeProgram() {
    const term = this.searchTermProgram.trim().toLowerCase();
    this.filteredListProgram = term
      ? this.programs.filter(p => (p.toursName || '').toLowerCase().includes(term))
      : [...this.programs];
  }

  // ---------- Carga de datos ----------
  obtenerComunas() {
    this.comunnesService.ObtenerCommunes().subscribe(respon => {
      this.comunnes = respon || [];
      this.filteredList = [...this.comunnes];
      Swal.close();
    }, _ => Swal.close());
  }

  obtenerColegios() {
    this.tourService.listCollege().subscribe(respon => {
      this.colleges = respon || [];
      this.filteredListCollege = [...this.colleges];
      Swal.close();
    }, _ => Swal.close());
  }

  obtenerPrograma() {
    this.programService.obtenerProgram().subscribe(respon => {
      this.programs = respon || [];
      this.filteredListProgram = [...this.programs];
      Swal.close();
    }, _ => Swal.close());
  }

  // ---------- Handlers: guardan el ID en el form ----------
  onSelectComuna(obj: any) {
    this.selectedComuna = obj;
    const id = this.pickId(obj, ['communesId', 'id']);
    this.form.patchValue({ comunaId: id });
  }

  onSelectCollege(obj: any) {
    this.selectedCollege = obj;
    const id = this.pickId(obj, ['collegeId', 'id']);
    this.form.patchValue({ collegeId: id });
  }

  onSelectProgram(obj: any) {
    this.selectPrograma = obj;
    const id = this.pickId(obj, ['tours_id']);
    this.form.patchValue({ programId: id });
  }

  // ---------- Guardado ----------
  onClose(): void {
    this.dialogRef.close();
  }

  private missingFields(): string[] {
    return Object.entries(this.form.controls)
      .filter(([_, c]) => c.invalid || c.value === null || c.value === undefined || c.value === '')
      .map(([k]) => k);
  }

  onSave() {

    const missing = this.missingFields();
    if (this.form.invalid || missing.length) {
      this.form.markAllAsTouched();
      const dateErr = this.form.errors?.['dateRange'] ? '\n- La fecha de inicio debe ser menor o igual a la fecha término.' : '';
      Swal.fire('Faltan datos', `Completa: ${missing.join(', ')}` + dateErr, 'warning');
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      const dateErr = this.form.errors?.['dateRange'] ? '\n- La fecha de inicio debe ser menor o igual a la fecha término.' : '';
      Swal.fire('Faltan datos', 'Completa los campos obligatorios.' + dateErr, 'warning');
      return;
    }

    const val = this.form.value;
    //console.log(val)

    const payload = {
      tourSalesId: 0,
      tourSalesUuid: 0,
      tourSalesInit: this.formatDateToYYYYMMDD(val.startDate),
      tourSalesFinal: this.formatDateToYYYYMMDD(val.endDate),
      tourGroups: val.temporada,
      tourInitialPay: 0,
      tourSalesStudentcount: 0,
      tourSalesPrice: 0,
      tourSalesStatus: 'Completada',
      branchId: 1,
      clientId: 1,
      communeId: val.comunaId,
      tourId: val.programId,
      tour: '',
      seller: '',
      tourSalesBusSelected: false,
      tourSalesTripulationSelected: 0,
      tourSalesCoordinatorSelected: false,
      addHotel: false,
      addAirplane: false,
      addSegurityPolicyDoc: false,
      addAlumnListDoc: false,
      addProgramDoc: false,
      addDetailHotelDoc: false,
      addMedicalDoc: false,
      addTripulation: false,
      addCourse: val.curso,
      collegeName: this.selectedCollege?.name ?? null
    };
    console.log(payload)
    Swal.fire({ title: 'Guardando...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

    // Llama a tu endpoint real
    console.log(payload)
    this.tourService.tourCreate(payload).subscribe({
      next: () => {
        Swal.close();
        Swal.fire('OK', 'Gira creada', 'success');
        this.dialogRef.close(true);
      },
      error: (e) => {
        Swal.close();
        Swal.fire('Error', 'No se pudo crear la gira', 'error');
        console.error(e);
      }
    });
  }

  private formatDateToDDMMYYYY(date: any): string | null {
    if (!date) return null;
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); // meses base 0
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  }

  private formatDateToYYYYMMDD(date: Date | string | null): string | null {
    if (!date) return null;
    const d = new Date(date);
    if (isNaN(d.getTime())) return null; // invalid date
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;  // ISO format
  }
}
