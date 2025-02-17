import { LiveAnnouncer } from "@angular/cdk/a11y";
import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort, Sort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Coordinator } from "app/models/coordinator";
import { CoordinatorService } from "app/services/coordinator.service";
import Swal from "sweetalert2";
import { CoordinatorModalCreateComponent } from "./coordinator-modal-create/coordinator-modal-create.component";
import * as XLSX from 'xlsx';


@Component({
  selector: "app-coordinator",
  templateUrl: "./coordinator.component.html",
  styleUrls: ["./coordinator.component.scss"],
})
export class CoordinatorComponent implements OnInit {

  displayedColumns: string[] = [
    "coordinatorName",
    "coordinatorLastname",
    "coordinatorOficina",
    "coordinatorCelular",
    "coordinatorCorreo",
    "acciones",
  ];
  dataSource = new MatTableDataSource<Coordinator>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild("fileInput") fileInput: any;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    public dialog: MatDialog,
    private coordinatorServices: CoordinatorService
  ) {}

  ngOnInit() {
    this.obtenerCoordinadores();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
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
        this.coordinatorServices.deleteCoordinador(event.coordinatorId).subscribe(
          (response) => {
            Swal.fire("Eliminado!", "Has eliminado el registro.", "success");
          },
          (error) => {
            Swal.fire("Error", "No se pudo eliminar el registro.", "error");
          }
        );
      }
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

            this.coordinatorServices.uploadFile(file).subscribe(response => {
              console.log('response.status');
              if (response.code === "0") {
                this.showSuccessDialog();
                this.obtenerCoordinadores();
              }else{
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
    
        // Restablecer el input de tipo file
        event.target.value = '';
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Debes cargar un archivo Excel para continuar"
        });
      }
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
  /** Announce the change in sort state for assistive technology. */
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

  obtenerCoordinadores() {
    Swal.fire({
      title: "Cargando...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
        this.coordinatorServices.obtenerCoordinadores().subscribe((respon) => {
          this.dataSource = new MatTableDataSource(respon);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          Swal.close();
        });
      },
    });
  }

  addCoordinator() {
    const dialogRef = this.dialog.open(CoordinatorModalCreateComponent, {
          width: '1300px',
          height: '600px',
        });
    
        dialogRef.afterClosed().subscribe({
        });
    }

  downloadCoordinators() : void {
    this.coordinatorServices.obtenerCoordinadores().subscribe(
      (coordinatorDetails: any[]) => {
        try {
          // Crear una hoja de Excel
          const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([
            [
              'ID', 'RUT', 'Nombre', 'Apellido', 'Sexo', 'Residencia', 'Oficina', 
              'Fecha Nacimiento', 'Edad', 'Celular', 'Correo', 'Insta Personal', 
              'Insta AT', 'Universidad', 'Carrera', 'Profesión', 'Empresa', 'Foto'
            ]
          ]);

          // Agregar datos de los coordinadores a la hoja de Excel
          coordinatorDetails.forEach(row => {
            const rowData = [
              row.coordinatorId,
              row.coordinatorRut,
              row.coordinatorName,
              row.coordinatorLastname,
              row.coordinatorSex,
              row.coordinatorResidencia,
              row.coordinatorOficina,
              row.coordinatorFechaNacimiento,
              row.coordinatorEdad,
              row.coordinatorCelular,
              row.coordinatorCorreo,
              row.coordinatorInstaPersonal,
              row.coordinatorInstaAt,
              row.coordinatorUniversidad,
              row.coordinatorCarrera,
              row.coordinatorProfesion,
              row.coordinatorEmpresa,
              row.coordinatorPicture ? 'Sí' : 'No'
            ];
            XLSX.utils.sheet_add_aoa(ws, [rowData], { origin: -1 }); // Appends the row to the sheet
          });

          // Crear un archivo Excel y descargarlo
          const wb: XLSX.WorkBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Coordinadores');
          XLSX.writeFile(wb, 'coordinadores.xlsx');
        } catch (e) {
          console.error('Error al generar el Excel:', e);
        }
      },
      (error) => {
        console.error('Error al obtener los coordinadores:', error);
      }
    );
  }
  
      
}
