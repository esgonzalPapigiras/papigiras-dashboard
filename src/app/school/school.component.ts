import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CollegeList } from 'app/models/collegeList';
import { ToursServicesService } from 'app/services/tours-services.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-school',
  templateUrl: './school.component.html',
  styleUrls: ['./school.component.scss']
})
export class SchoolComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("fileInput") fileInput: any;
  dataSourceColegios = new MatTableDataSource<CollegeList>;

  displayedColumnsColegios: string[] = [
    "id",
    "name",
    "numeral",
  ];

  constructor(private _liveAnnouncer: LiveAnnouncer, private girasServices: ToursServicesService) { }

  ngOnInit(): void {
    this.ObtenerListaColegios();
  }

  ObtenerListaColegios() {
    Swal.fire({
      title: "Cargando...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
        this.girasServices.listCollege().subscribe((respon) => {
          console.log(respon)
          // Guarda sólo los primeros 100 colegios
          const primerosCien = respon.slice(0, 100);
          this.dataSourceColegios = new MatTableDataSource(respon);
          this.dataSourceColegios.paginator = this.paginator;
          this.dataSourceColegios.sort = this.sort;
          Swal.close();
        });
      },
    });
  }

  addSchool() { }
  triggerFileInput() {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fileInput?.click(); // Abre el cuadro de diálogo de selección de archivo
  }
  onFileSelected(event: any) { }
  downloadTemplate(): void {
    const url = 'assets/templates/Colegios_CargaMasiva.xlsx';
    fetch(url)
      .then(res => res.blob())
      .then(blob => {
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'Template_Colegios_CargaMasiva.xlsx';
        link.click();
        window.URL.revokeObjectURL(link.href);
      });
  }
  downloadColegios() { 
    const colegios = this.dataSourceColegios.data;
        if (!colegios || colegios.length === 0) {
          Swal.fire("No hay colegios cargados", "", "warning");
          return;
        }
        Swal.fire({
          title: "Generando Excel...",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
            const data = colegios.map((c: any) => ({
              "id": c.id,
              "name": c.name,
              "numeral": c.numeral,
            }));
            const worksheet = XLSX.utils.json_to_sheet(data);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Colegios");
            const excelBuffer = XLSX.write(workbook, {
              bookType: "xlsx",
              type: "array"
            });
            const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
            saveAs(blob, "colegios.xlsx");
            Swal.close();
          }
        });
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce("Sorting cleared");
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceColegios.filter = filterValue.trim().toLowerCase();
  }

}
