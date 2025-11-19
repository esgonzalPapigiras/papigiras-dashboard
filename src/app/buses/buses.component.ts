import { Component, OnInit, ViewChild } from '@angular/core';
import { BusService } from 'app/services/bus.service';
import { BusFullDTO } from 'app/models/BusFullDTO';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { BusModalEditComponent } from './bus-modal-edit/bus-modal-edit/bus-modal-edit.component';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { BusModalCreateComponent } from './bus-modal-create/bus-modal-create.component';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-buses',
  templateUrl: './buses.component.html',
  styleUrls: ['./buses.component.scss']
})
export class BusesComponent implements OnInit {

  displayedColumns: string[] = [
    "patente",
    //"marca",
    "modelo",
    "anioBus",
    "empresa",
    //"capacidad",
    "acciones"
  ];

  dataSource = new MatTableDataSource<BusFullDTO>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private busService: BusService,
    private _liveAnnouncer: LiveAnnouncer,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.obtenerBuses();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  obtenerBuses(): void {
    this.busService.obtenerBuses().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        console.log("Buses:", data);
      },
      error: (err) => {
        console.error("Error fetching buses", err);
      }
    });
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

  editarBus(row: any) {
    //console.log(row)
    const dialogRef = this.dialog.open(BusModalEditComponent, {
      width: '1300px',
      height: '600px',
      data: row.id // or row.id, whatever your backend sends
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.obtenerBuses();
      }
    });
  }

  applyDelete(event: any) {
    Swal.fire({
      title: "¿Estas seguro?",
      text: "No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.busService.deleteBus(event.id).subscribe({
          next: () => {
            Swal.fire("Eliminado", "El bus fue eliminado.", "success");
            this.obtenerBuses();
          },
          error: () => {
            Swal.fire("Error", "No se pudo eliminar el bus.", "error");
          }
        });
      }
    });
  }

  addBus() {
    const dialogRef = this.dialog.open(BusModalCreateComponent, {
      width: '1200px',
      height: '600px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.obtenerBuses(); // refresh the bus list
      }
    });
  }

  downloadTemplate() {
    const url = 'assets/templates/Buses_CargaMasiva.xlsx';
    fetch(url)
      .then(res => res.blob())
      .then(blob => {
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'Template_Buses_CargaMasiva.xlsx';
        link.click();
        window.URL.revokeObjectURL(link.href);
      });
  }

  triggerFileInput() {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fileInput?.click(); // Abre el cuadro de diálogo de selección de archivo
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
      Swal.fire({
        title: 'Cargando...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      });

      this.busService.uploadFile(file).subscribe({
        next: (response) => {
          Swal.close();
          if (response.code === '0') {
            Swal.fire('Éxito', 'Buses cargados correctamente', 'success');
            this.obtenerBuses(); // refresh table
          } else {
            Swal.fire('Error', response.response, 'error');
          }
        },
        error: (err) => {
          Swal.close();
          Swal.fire('Error', 'Hubo un problema al cargar el archivo', 'error');
        }
      });

      event.target.value = ''; // reset input
    } else {
      Swal.fire('Error', 'Debes cargar un archivo Excel para continuar', 'error');
    }
  }
  downloadBuses() {
    const buses = this.dataSource.data;
    if (!buses || buses.length === 0) {
      return;
    }
    const worksheet = XLSX.utils.json_to_sheet(buses.map(bus => ({
      ID: bus.id,
      Patente: bus.patente,
      Año: bus.anoBus,
      Empresa: bus.empresa,
      Capacidad: bus.capacidad,
      Marca: bus.marca,
      Modelo: bus.modelo
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Buses');
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'buses.xlsx');
  }

}
