import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CollegeList } from 'app/models/collegeList';
import { ToursServicesService } from 'app/services/tours-services.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-school',
  templateUrl: './school.component.html',
  styleUrls: ['./school.component.scss']
})
export class SchoolComponent implements OnInit {

  dataSourceColegios = new MatTableDataSource<CollegeList>
  @ViewChild('paginatorColegios') paginatorColegios: MatPaginator;
  @ViewChild('sortColegios') sortColegios: MatSort;
  displayedColumnsColegios: string[] = [
    "id",
    "name",
    "numeral",
  ];

  constructor(private girasServices: ToursServicesService) { }

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
          //console.log(respon)
          // Guarda sólo los primeros 100 colegios
          const primerosCien = respon.slice(0, 100);
          this.dataSourceColegios = new MatTableDataSource(respon);
          this.dataSourceColegios.paginator = this.paginatorColegios;
          this.dataSourceColegios.sort = this.sortColegios;
          Swal.close();
        });
      },
    });
  }

  downloadColegios(){}

}
