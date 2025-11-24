import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DocumentDTO } from 'app/models/document';
import { ToursServicesService } from 'app/services/tours-services.service';
import Swal from 'sweetalert2';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-tour-download-document-modal',
  templateUrl: './tour-download-document-modal.component.html',
  styleUrls: ['./tour-download-document-modal.component.scss']
})
export class TourDownloadDocumentModalComponent implements OnInit {

  displayedColumns: string[] = ["documentType", "documentName", "acciones"];
  dataSource = new MatTableDataSource<DocumentDTO>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    public dialog: MatDialog,
    private tourService: ToursServicesService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.obtenerDocumentos();
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
        this.tourService.deleteDocument(this.data.tourSalesUuid, event.documentName).subscribe(
          (response) => {
            Swal.fire("Eliminado!", "Has eliminado el registro.", "success");
            this.obtenerDocumentos();
          },
          (error) => {
            Swal.fire("Error", "No se pudo eliminar el registro.", "error");
          }
        );
      }
    });
  }

  applyDownload(event: any): void {
    Swal.fire({
      title: "Buscando el archivo...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();

        this.tourService.downloadDocument(this.data.tourSalesUuid, event.documentName)
          .subscribe({
            next: (response: ArrayBuffer) => {

              const mime =
                event.documentName.endsWith('.pdf') ? 'application/pdf' :
                  event.documentName.endsWith('.xlsx') || event.documentName.endsWith('.xls')
                    ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                    : 'application/octet-stream';

              const blob = new Blob([response], { type: mime });

              saveAs(blob, event.documentName);
              Swal.close();
            },
            error: (err) => {
              console.error('Error downloading the file: ', err);
              Swal.close();
            }
          });
      },
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

  obtenerDocumentos() {
    Swal.fire({
      title: "Cargando...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
        this.tourService.getDocument(this.data.tourSalesId).subscribe((respon) => {
          this.dataSource = new MatTableDataSource(respon);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          Swal.close();
        });
      },
    });
  }



}
