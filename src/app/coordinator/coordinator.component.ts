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
import { CoordinatorModalEditComponent } from "./coordinator-modal-edit/coordinator-modal-edit.component";
import { CoordinatorModalViewImageComponent } from "app/coordinator-modal-view-image/coordinator-modal-view-image.component";
import { saveAs } from 'file-saver';

@Component({
  selector: "app-coordinator",
  templateUrl: "./coordinator.component.html",
  styleUrls: ["./coordinator.component.scss"],
})
export class CoordinatorComponent implements OnInit {

  displayedColumns: string[] = [
    "coordinatorName",
    "coordinatorLastname",
    "coordinatorCelular",
    "coordinatorCorreo",
    "acciones",
  ];
  dataSource = new MatTableDataSource<Coordinator>();
  selectedFile: File | null = null;
  id: string;

  private headers: (keyof Coordinator)[] = [
  'coordinatorCarrera',           // cell(0)
  'coordinatorCelular',           // cell(1)
  'coordinatorCorreo',            // cell(2)
  'coordinatorEmpresa',           // cell(3)
  'coordinatorFechaNacimiento',   // cell(4)
  'coordinatorInstaAt',           // cell(5)
  'coordinatorInstaPersonal',     // cell(6)
  'coordinatorLastname',          // cell(7)
  'coordinatorName',              // cell(8)
  'coordinatorOficina',           // cell(9)
  'coordinatorProfesion',         // cell(10)
  'coordinatorResidencia',        // cell(11)
  'coordinatorRut',               // cell(12)
  'coordinatorSex',               // cell(13)
  'coordinatorUniversidad'        // cell(14)
];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild("fileInput") fileInput: any;
  @ViewChild("fileInputImage") fileInputImage: any;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    public dialog: MatDialog,
    private coordinatorServices: CoordinatorService
  ) { }

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
            this.obtenerCoordinadores();
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

  editarCoordinator(row: any) {
    const dialogRef = this.dialog.open(CoordinatorModalEditComponent, {
      width: '1300px',
      height: '600px',
      data: row.coordinatorId
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        // Suponiendo que se retorna "true" cuando la creación es exitosa
        this.obtenerCoordinadores(); // O llama a tu método de refresco de data
      }
    });
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

  verImagen(row: any) {
    const dialogRef = this.dialog.open(CoordinatorModalViewImageComponent, {
      width: '1300px',
      height: '600px',
      data: row.coordinatorRut
    });

    dialogRef.afterClosed().subscribe({
    });
  }



  addCoordinator() {
    const dialogRef = this.dialog.open(CoordinatorModalCreateComponent, {
      width: '1300px',
      height: '600px',
      
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        // Suponiendo que se retorna "true" cuando la creación es exitosa
        this.obtenerCoordinadores(); // O llama a tu método de refresco de data
      }
    });
  }

  downloadTemplate(): void {
    // 1) Generar la primera fila con los nombres de columna
    const headerRow = this.headers.map(h => h);

    // 2) Crear la hoja de cálculo a partir de un array de arrays
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([headerRow]);

    // 3) Crear el libro y asignar la hoja
    const wb: XLSX.WorkBook = {
      Sheets: { 'Coordinators': ws },
      SheetNames: ['Coordinators']
    };

    // 4) Generar el binario de Excel
    const wbout: ArrayBuffer = XLSX.write(wb, {
      bookType: 'xlsx',
      type: 'array'
    });

    // 5) Crear un Blob y disparar la descarga
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    saveAs(blob, 'template_coordinator.xlsx');
  }

  

  downloadCoordinators(): void {
    this.coordinatorServices.obtenerCoordinadores().subscribe(
      (coordinatorDetails: any[]) => {
        try {
          // Crear una hoja de Excel
          const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([
            [
              'ID', 'RUT', 'Nombre', 'Apellido', 'Sexo', 'Residencia', 'Oficina',
              'Fecha Nacimiento', 'Celular', 'Correo', 'Insta Personal',
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

  EnviarImagen(row: any) {

    this.fileInputImage.nativeElement.click();
    this.id = row.coordinatorRut
  }

  onFileSelectedImage(event: any, row: any) {

    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      // Llamar a la función de carga cuando el archivo es seleccionado
      this.uploadFile(file,);
    }
  }

  uploadFile(file: File): void {
    const reader = new FileReader();
    reader.onloadend = () => {
      const arrayBuffer = reader.result as ArrayBuffer;
      const uint8Array = new Uint8Array(arrayBuffer);

      // Llamar al servicio para subir el archivo
      Swal.fire({
        title: "Guardando Imagen...",
        text: "Por favor espera mientras se guarda la imagen.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
          this.coordinatorServices.uploadDocumentsPicture(uint8Array, file.name, this.id, 'coordinadores').subscribe({
            next: (response) => {
              Swal.close();
              Swal.fire(
                "Éxito",
                "La imagen fue encontrada",
                "success"
              );
            },
            error: (err) => {
              Swal.close();
              Swal.fire(
                "Error",
                "No existe imagen del coordinador",
                "error"
              );
            }
          });
        }
      });
      
    };
    reader.readAsArrayBuffer(file); // Lee el archivo como ArrayBuffer
  }
}
