import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TourActivities } from 'app/models/tourActivities';
import { ActivitiesService } from 'app/services/activities.service';
import { ProgramsService } from 'app/services/programs.service';
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { ClientAddActivities } from 'app/models/clientAddActivities';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';

@Component({
  selector: 'app-programs-modal-add-activities',
  templateUrl: './programs-modal-add-activities.component.html',
  styleUrls: ['./programs-modal-add-activities.component.scss']
})
export class ProgramsModalAddActivitiesComponent implements OnInit {

  programs: any[] = [];
  searchTerm: string = '';
  selectedActivities: any[] = [];

  displayedColumns: string[] = ["itineraryName", "itineraryIncludes", "itineraryDescription", "acciones"];
  dataSource = new MatTableDataSource<ClientAddActivities>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild("fileInput") fileInput: any;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    public dialogRef: MatDialogRef<ProgramsModalAddActivitiesComponent>,
    private programService: ProgramsService,
    private activitiesService: ActivitiesService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,) { }

  ngOnInit() {
    this.obtenerActividades();
    this.obtenerActividades2();
  }

  obtenerActividades() {
    Swal.fire({
      title: 'Cargando...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
        this.activitiesService.obtenerActividades().subscribe(respon => {
          this.programs = respon;
          Swal.close();
        });
      },
    });
  }
  obtenerActividades2() {
    Swal.fire({
      title: "Cargando...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
        console.log(this.data)
        this.programService.listActivitiesProgram(this.data.tours_id).subscribe((respon) => {
          this.dataSource = new MatTableDataSource(respon);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          Swal.close();
        });
      },
    });
  }

  applyDelete(event: any) {
    Swal.fire({
      title: "Estas Seguro?",
      text: "No puedes revertir esto!!!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si,Estoy Seguro",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(event);
        // Llamamos al servicio para eliminar el coordinador
        this.programService.activitiesProgramDeleteList(event.tourActivitiesId).subscribe(
          (response) => {
            Swal.fire("Eliminado!", "Has eliminado el registro.", "success");
            this.obtenerActividades();
          },
          (error) => {
            console.log(error)
            Swal.fire("Error", "No se pudo eliminar el registro.", "error");
          }
        );
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce("Sorting cleared");
    }
  }

  get selectedProgramsText(): string {
    return this.selectedActivities && this.selectedActivities.length > 0
      ? this.selectedActivities.map(c => c.itinerary_name).join(', ')
      : 'Selecciona Actividades';
  }

  filteredPrograms() {
    console.log(this.searchTerm)
    return this.programs.filter(programs =>
      programs.itinerary_name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  sendCoordinators() {
    if (this.selectedActivities.length > 0) {
      const selectedNamesAndIds = this.selectedActivities.map(activity => activity.itinerary_name).join(', ');
      Swal.fire({
        title: 'Actividades seleccionadas',
        text: 'Has seleccionado: ' + selectedNamesAndIds,
        icon: 'success',
        confirmButtonText: 'Cerrar'
      });
      this.selectedActivities.forEach(activity => {
        console.log('ID Actividad:', activity.itinerary_id);
        console.log('ID Programa :', this.data.tours_id);

        // Creación correcta de una nueva instancia de TourActivities
        const tourActivity = new TourActivities();

        // Asignar los valores manualmente
        tourActivity.idTour = this.data.tours_id;
        tourActivity.idActivity = activity.itinerary_id;
        tourActivity.isSelect = true;

        console.log(tourActivity);

        // Llamada al servicio con tourActivity
        Swal.fire({
          title: 'Cargando...',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
            this.programService.addProgramActivities(tourActivity, this.data.tours_id).subscribe(respon => {

            });
          },
        });


        // Cerrar el loading de Swal
      });
      Swal.close();
      this.dialogRef.close(true);
    } else {
      Swal.fire({
        title: 'Error',
        text: 'No has seleccionado ninguna Actividad.',
        icon: 'error',
        confirmButtonText: 'Cerrar'
      });
    }
  }

}
