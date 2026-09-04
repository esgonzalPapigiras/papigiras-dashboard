import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Coordinator } from 'app/models/coordinator';
import { TourCoordinatorAssignment } from 'app/models/tourCoordinatorAssignment';
import { CoordinatorService } from 'app/services/coordinator.service';
import { ToursServicesService } from 'app/services/tours-services.service';
import { forkJoin } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tour-add-coordinator-modal',
  templateUrl: './tour-add-coordinator-modal.component.html',
  styleUrls: ['./tour-add-coordinator-modal.component.scss']
})
export class TourAddCoordinatorModalComponent implements OnInit {
  coordinators: Coordinator[] = [];
  assignments: TourCoordinatorAssignment[] = [];
  selectedCoordinatorIds: number[] = [];
  searchTerm = '';
  isLoading = false;
  isSaving = false;

  displayedColumnsCoords: string[] = ['name', 'rut', 'phone', 'acciones'];
  dataSourceCoords = new MatTableDataSource<Coordinator>([]);

  constructor(
    private coordinatorService: CoordinatorService,
    private tourService: ToursServicesService,
    public dialogRef: MatDialogRef<TourAddCoordinatorModalComponent>,
    @Inject(MAT_DIALOG_DATA) public tourId: number
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    forkJoin({
      coordinators: this.coordinatorService.obtenerCoordinadores(),
      assignments: this.tourService.getTourCoordinators(this.tourId)
    }).subscribe({
      next: ({ coordinators, assignments }) => {
        this.coordinators = coordinators || [];
        this.assignments = assignments || [];
        this.selectedCoordinatorIds = this.assignments.map(a => a.coordinatorId);
        this.updateTable();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading tour coordinators', err);
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los coordinadores de la gira.'
        });
      }
    });
  }

  get selectedCoordinatorsText(): string {
    const selected = this.getSelectedCoordinators();
    return selected.length
      ? selected.map(c => `${c.coordinatorName} ${c.coordinatorLastname}`).join(', ')
      : 'Selecciona coordinadores';
  }

  filteredCoordinators(): Coordinator[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) return this.coordinators;

    return this.coordinators.filter(coordinator =>
      `${coordinator.coordinatorName} ${coordinator.coordinatorLastname} ${coordinator.coordinatorRut}`
        .toLowerCase()
        .includes(term)
    );
  }

  selectionChanged(): void {
    this.updateTable();
  }

  removeCoordinator(coordinatorId: number): void {
    this.selectedCoordinatorIds = this.selectedCoordinatorIds.filter(id => id !== coordinatorId);
    this.updateTable();
  }

  saveCoordinators(): void {
    this.isSaving = true;
    this.tourService.updateTourCoordinators(this.tourId, this.selectedCoordinatorIds).subscribe({
      next: assignments => {
        this.isSaving = false;
        Swal.fire({
          icon: 'success',
          title: 'Coordinadores guardados',
          text: assignments.length
            ? `Se guardaron ${assignments.length} coordinador(es) para la gira.`
            : 'La gira quedó sin coordinadores asignados.'
        }).then(() => this.dialogRef.close(assignments));
      },
      error: (err) => {
        console.error('Error saving tour coordinators', err);
        this.isSaving = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err?.error?.message || 'No se pudieron guardar los coordinadores.'
        });
      }
    });
  }

  private getSelectedCoordinators(): Coordinator[] {
    const selectedIds = new Set(this.selectedCoordinatorIds);
    return this.coordinators.filter(c => selectedIds.has(c.coordinatorId));
  }

  private updateTable(): void {
    this.dataSourceCoords.data = this.getSelectedCoordinators();
  }
}
