import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivitiesModalEditComponent } from './activities-modal-edit/activities-modal-edit.component';
import { ActivitiesModalCreateComponent } from './activities-modal-create/activities-modal-create.component';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ActivitiesDTOList } from 'app/models/activitiesList';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatDialog } from '@angular/material/dialog';
import { ActivitiesService } from 'app/services/activities.service';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss']
})
export class ActivitiesComponent implements OnInit {

  displayedColumns: string[] = ["itinerary_name","name_suppliers","itinerary_description", "acciones"];
    dataSource = new MatTableDataSource<ActivitiesDTOList>();
  
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild("fileInput") fileInput: any;
    @ViewChild(MatSort) sort: MatSort;
  
    constructor(
      private _liveAnnouncer: LiveAnnouncer,
      public dialog: MatDialog,
      private activitiesService: ActivitiesService
    ) {}
  
    ngOnInit(): void {
      this.obtenerActividades();
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
          console.log(event.itinerary_id);
          // Llamamos al servicio para eliminar el coordinador
          this.activitiesService.deleteActivities(event.itinerary_id).subscribe(
            (response) => {
              Swal.fire("Eliminado!", "Has eliminado el registro.", "success");
              this.obtenerActividades();
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
      const dialogRef = this.dialog.open(ActivitiesModalEditComponent, {
        width: "1300px",
        height: "600px",
        data: row,
      });
  
      dialogRef.afterClosed().subscribe({});
    }
  
    obtenerActividades() {
      Swal.fire({
        title: "Cargando...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
          this.activitiesService.obtenerActividades().subscribe((respon) => {
            this.dataSource = new MatTableDataSource(respon);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            Swal.close();
          });
        },
      });
    }
  
    addBranch() {
      const dialogRef = this.dialog.open(ActivitiesModalCreateComponent, {
        width: "1300px",
        height: "600px",
      });
  
      dialogRef.afterClosed().subscribe((result) => {
        if (result === true) {
          // Suponiendo que se retorna "true" cuando la creación es exitosa
          this.obtenerActividades(); // O llama a tu método de refresco de data
        }
      });
    }
  }
