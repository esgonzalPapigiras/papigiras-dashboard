import { Component, OnInit, ViewChild } from '@angular/core';
import { ComunnesModalCreateComponent } from './comunnes-modal-create/comunnes-modal-create.component';
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { ComunnesModalEditComponent } from './comunnes-modal-edit/comunnes-modal-edit.component';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatDialog } from '@angular/material/dialog';
import { ComunnesService } from 'app/services/comunnes.service';
import { MatPaginator } from '@angular/material/paginator';
import { Communes } from 'app/models/communes';

@Component({
  selector: 'app-comunnes',
  templateUrl: './comunnes.component.html',
  styleUrls: ['./comunnes.component.scss']
})
export class ComunnesComponent implements OnInit {

  displayedColumns: string[] = ["communesName","branchName", "acciones"];
    dataSource = new MatTableDataSource<Communes>();
  
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild("fileInput") fileInput: any;
    @ViewChild(MatSort) sort: MatSort;
  
    constructor(
      private _liveAnnouncer: LiveAnnouncer,
      public dialog: MatDialog,
      private comunnesService: ComunnesService
    ) {}
  
    ngOnInit(): void {
      this.obtenerOficinas();
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
          this.comunnesService.deleteCommunes(event.branchId).subscribe(
            (response) => {
              Swal.fire("Eliminado!", "Has eliminado el registro.", "success");
              this.obtenerOficinas();
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
      const dialogRef = this.dialog.open(ComunnesModalEditComponent, {
        width: "1300px",
        height: "600px",
        data: row,
      });
  
      dialogRef.afterClosed().subscribe((result) => {
        if (result === true) {
          // Suponiendo que se retorna "true" cuando la creación es exitosa
          this.obtenerOficinas(); // O llama a tu método de refresco de data
        }
      });
    }
  
    obtenerOficinas() {
      Swal.fire({
        title: "Cargando...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
          this.comunnesService.ObtenerCommunes().subscribe((respon) => {
            this.dataSource = new MatTableDataSource(respon);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            Swal.close();
          });
        },
      });
    }
  
    addBranch() {
      const dialogRef = this.dialog.open(ComunnesModalCreateComponent, {
        width: "1300px",
        height: "600px",
      });
  
      dialogRef.afterClosed().subscribe((result) => {
        if (result === true) {
          // Suponiendo que se retorna "true" cuando la creación es exitosa
          this.obtenerOficinas(); // O llama a tu método de refresco de data
        }
      });
    }

}
