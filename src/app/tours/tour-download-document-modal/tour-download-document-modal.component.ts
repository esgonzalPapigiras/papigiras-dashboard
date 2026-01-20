import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
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

  displayedColumns: string[] = ["documentType", "documentName", 'visibleToAll', "acciones"];
  dataSource = new MatTableDataSource<DocumentDTO>();

  @ViewChild('fileUploader') fileUploader: any;
  selectedRow: any = null;

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    public dialog: MatDialog,
    private tourService: ToursServicesService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.obtenerDocumentos();
  }

  obtenerDocumentos() {
    Swal.fire({
      title: "Cargando...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
        this.tourService.getDocument(this.data.tourSalesId)
          .subscribe({
            next: (existingDocs: any) => {
              console.log(existingDocs)
              const officialTypes = [
                { key: 'gira', label: 'Programa' },
                { key: 'poliza', label: 'Seguro' },
                { key: 'contract', label: 'Contrato' },
                { key: 'manifiesto', label: 'Manifiesto' }
              ];
              const officialDocs = officialTypes.map(dt => {
                const found = existingDocs?.find(d => d.documentType === dt.key);
                return new DocumentDTO(
                  found ? found.documentId : null,
                  dt.label,
                  dt.key,
                  found ? found.documentName : null,
                  this.data.tourSalesId,
                  found ? found.visibleToAll : false
                );
              });
              const extraDocs = existingDocs
                .filter(d => d.documentType === 'extra')
                .map(d => new DocumentDTO(
                  d.documentId,
                  'Documento Extra',
                  'extra',
                  d.documentName,
                  this.data.tourSalesId,
                  d.visibleToAll
                ));
              this.dataSource = new MatTableDataSource([
                ...officialDocs,
                ...extraDocs
              ]);
              Swal.close();
            },
            error: () => {
              Swal.fire("Error", "No se pudieron cargar los documentos.", "error");
            }
          });
      }
    });
  }

  toggleVisibleLocal(row: DocumentDTO) {
    const newValue = !row.visibleToAll;
    this.tourService.changeDocumentVisibility(row.documentId!, newValue)
      .subscribe({
        next: () => {
          row.visibleToAll = newValue;
        },
        error: () => {
          Swal.fire(
            "Error",
            "No se pudo actualizar la visibilidad del documento",
            "error"
          );
        }
      });
  }

  applyDelete(event: DocumentDTO) {
    console.log(event)
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
        this.tourService.deleteDocument(event.documentId, this.data.tourSalesUuid, event.documentName).subscribe(
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

  addExtraDocumentRow() {
    const newDoc = new DocumentDTO(
      null,
      'Documento Extra',
      'extra',
      null,
      this.data.tourSalesId,
      false
    );

    this.dataSource.data = [
      ...this.dataSource.data,
      newDoc
    ];
  }

  chooseFile(row: any) {
    console.log(row)
    this.selectedRow = row;
    this.fileUploader.nativeElement.value = null;
    this.fileUploader.nativeElement.click();
  }
  onFileSelected(event: any) {
    console.log(event)
    const file = event.target.files[0];
    if (!file || !this.selectedRow) return;
    Swal.fire({
      title: "Subiendo documento...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
        this.tourService.uploadDocumentsExtra(file, file.name, this.data.tourSalesUuid, 'documentosextras', this.selectedRow.typeKey)
          .subscribe({
            next: () => {
              Swal.fire("Listo", "Documento subido correctamente.", "success");
              this.obtenerDocumentos();
            },
            error: () => {
              Swal.fire("Error", "No se pudo subir el documento.", "error");
            },
            complete: () => {
              event.target.value = '';
              Swal.close();
            }
          });
      }
    });
  }

}
