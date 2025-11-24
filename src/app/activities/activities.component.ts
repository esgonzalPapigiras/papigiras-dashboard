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
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss']
})
export class ActivitiesComponent implements OnInit {

  displayedColumns: string[] = ["itinerary_name", "itinerary_description", "acciones"];
  dataSource = new MatTableDataSource<ActivitiesDTOList>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild("fileInput") fileInput: any;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    public dialog: MatDialog,
    private activitiesService: ActivitiesService
  ) { }

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
          console.log(respon)
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
        this.obtenerActividades();
      }
    });
  }

  showSuccessDialog() {
    Swal.fire({
      icon: "success",
      title: "Oops...",
      text: "Archivo cargado exitosamente"
    });
  }

  showSuccessDialogError() {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Archivo no se logro cargar"
    });
  }


  triggerFileInput() {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fileInput?.click(); // Abre el cuadro de diálogo de selección de archivo
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
      // Muestra un mensaje de carga con SweetAlert2
      Swal.fire({
        title: 'Cargando...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
          this.activitiesService.uploadFile(file).subscribe(response => {
            console.log('response.status');
            if (response.code === "0") {
              this.showSuccessDialog();
              this.obtenerActividades();
            } else {
              this.showSuccessDialogError();
            }
          }, error => {
            console.log(error);
            // Maneja cualquier error durante la carga
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Hubo un problema al cargar el archivo"
            });
          });
        },
      });
      event.target.value = '';
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Debes cargar un archivo Excel para continuar"
      });
    }
  }

  downloadTemplate() {
    const url = 'assets/templates/Actividades_CargaMasiva.xlsx';
    fetch(url)
      .then(res => res.blob())
      .then(blob => {
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'Template_Actividades_CargaMasiva.xlsx';
        link.click();
        window.URL.revokeObjectURL(link.href);
      });
  }

  downloadActivities() {
    const actividades = this.dataSource.data;
    if (!actividades || actividades.length === 0) {
      Swal.fire("No hay actividades cargadas", "", "warning");
      return;
    }
    Swal.fire({
      title: "Generando Excel...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
        const data = actividades.map((a: any) => ({
          "Nombre": a.itinerary_name,
          "Descripcion": a.itinerary_description,
        }));
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Actividades");
        const excelBuffer = XLSX.write(workbook, {
          bookType: "xlsx",
          type: "array"
        });
        const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(blob, "actividades.xlsx");
        Swal.close();
      }
    });
  }
}

