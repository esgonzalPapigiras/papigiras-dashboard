import { Component, OnInit, ViewChild } from '@angular/core';
import { SuppliersModalCreateComponent } from './suppliers-modal-create/suppliers-modal-create.component';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { SuppliersModalEditComponent } from './suppliers-modal-edit/suppliers-modal-edit.component';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { SuppliersService } from 'app/services/suppliers.service';
import { MatPaginator } from '@angular/material/paginator';
import { Suppliers } from 'app/models/suppliers';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.scss']
})
export class SuppliersComponent implements OnInit {

  displayedColumns: string[] = ["nameSuppliers", "contactSuppliers", "emailSuppliers","phoneSuppliers", "acciones"];
  dataSource = new MatTableDataSource<Suppliers>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild("fileInput") fileInput: any;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    public dialog: MatDialog,
    private supplierService: SuppliersService
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
        console.log(event.itinerary_id);
        // Llamamos al servicio para eliminar el coordinador
        this.supplierService.deletesuppliers(event.suppliers_id).subscribe(
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
    const dialogRef = this.dialog.open(SuppliersModalEditComponent, {
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
        this.supplierService.obtenerSuppliers().subscribe((respon) => {
          this.dataSource = new MatTableDataSource(respon);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          Swal.close();
        });
      },
    });
  }

  addBranch() {
    const dialogRef = this.dialog.open(SuppliersModalCreateComponent, {
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
