import { Component, OnInit, ViewChild } from '@angular/core';
import { ProgramsModalEditComponent } from './programs-modal-edit/programs-modal-edit.component';
import { ProgramsModalCreateComponent } from './programs-modal-create/programs-modal-create.component';
import Swal from 'sweetalert2';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Program } from 'app/models/program';
import { MatDialog } from '@angular/material/dialog';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ProgramsService } from 'app/services/programs.service';
import { ProgramsModalAddActivitiesComponent } from './programs-modal-add-activities/programs-modal-add-activities.component';
import { ProgramsModalListActivitiesComponent } from './programs-modal-list-activities/programs-modal-list-activities.component';

@Component({
  selector: 'app-programs',
  templateUrl: './programs.component.html',
  styleUrls: ['./programs.component.scss']
})
export class ProgramsComponent implements OnInit {

  displayedColumns: string[] = ["toursName", "tour_day_quantity", "tour_nigth_quantity", "acciones"];
    dataSource = new MatTableDataSource<Program>();
  
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild("fileInput") fileInput: any;
    @ViewChild(MatSort) sort: MatSort;
  
    constructor(
      private _liveAnnouncer: LiveAnnouncer,
      public dialog: MatDialog,
      private programService: ProgramsService
    ) { }
  
    ngOnInit(): void {
      this.obtenerSuppliers();
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
          // Llamamos al servicio para eliminar el coordinador
          this.programService.deleteProgram(event.tours_id).subscribe(
            (response) => {
              Swal.fire("Eliminado!", "Has eliminado el registro.", "success");
              this.obtenerSuppliers();
            },
            (error) => {
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
  
    editarBranch(row: any) {
      const dialogRef = this.dialog.open(ProgramsModalEditComponent, {
        width: "1300px",
        height: "600px",
        data: row,
      });
  
      dialogRef.afterClosed().subscribe({});
    }

    addActivities(row: any){
      const dialogRef = this.dialog.open(ProgramsModalAddActivitiesComponent, {
        width: "1300px",
        height: "600px",
        data: row,
      });
  
      dialogRef.afterClosed().subscribe({});
    }

    listActivities(row: any){
      const dialogRef = this.dialog.open(ProgramsModalListActivitiesComponent, {
        width: "1300px",
        height: "600px",
        data: row,
      });
  
      dialogRef.afterClosed().subscribe({});
    }
  
    obtenerSuppliers() {
      Swal.fire({
        title: "Cargando...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
          this.programService.obtenerProgram().subscribe((respon) => {
            this.dataSource = new MatTableDataSource(respon);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            Swal.close();
          });
        },
      });
    }
  
    addBranch() {
      const dialogRef = this.dialog.open(ProgramsModalCreateComponent, {
        width: "1300px",
        height: "600px",
      });
  
      dialogRef.afterClosed().subscribe((result) => {
        if (result === true) {
          // Suponiendo que se retorna "true" cuando la creación es exitosa
          this.obtenerSuppliers(); // O llama a tu método de refresco de data
        }
      });
    }

}
