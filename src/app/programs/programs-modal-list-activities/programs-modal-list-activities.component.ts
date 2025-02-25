import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivitiesDTOList } from 'app/models/activitiesList';
import { ClientAddActivities } from 'app/models/clientAddActivities';
import { ActivitiesService } from 'app/services/activities.service';
import { ProgramsService } from 'app/services/programs.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-programs-modal-list-activities',
  templateUrl: './programs-modal-list-activities.component.html',
  styleUrls: ['./programs-modal-list-activities.component.scss']
})
export class ProgramsModalListActivitiesComponent implements OnInit {

  displayedColumns: string[] = ["itineraryName", "itineraryIncludes", "itineraryDescription", "acciones"];
  dataSource = new MatTableDataSource<ClientAddActivities>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild("fileInput") fileInput: any;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    public dialog: MatDialog,
    private programServices: ProgramsService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    this.obtenerActividades();
  }

  obtenerActividades() {
    Swal.fire({
      title: "Cargando...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
        console.log(this.data)
        this.programServices.listActivitiesProgram(this.data.tours_id).subscribe((respon) => {
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
        this.programServices.activitiesProgramDeleteList(event.tourActivitiesId).subscribe(
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
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce("Sorting cleared");
    }
  }

}
