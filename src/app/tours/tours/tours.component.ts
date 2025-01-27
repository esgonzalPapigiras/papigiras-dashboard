import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToursViewModalComponent } from '../tours-view-modal/tours-view-modal.component';
import { TourSalesDTO } from 'app/models/tourSales';
import Swal from 'sweetalert2'
import { ToursServicesService } from 'app/services/tours-services.service';





@Component({
  selector: 'app-tours',
  templateUrl: './tours.component.html',
  styleUrls: ['./tours.component.scss']
})
export class ToursComponent implements AfterViewInit {
  displayedColumns: string[] = ['tourSalesUuid', 'tourSalesInit', 'tourSalesFinal', 'collegeName','addCourse','acciones'];
  dataSource = new MatTableDataSource<TourSalesDTO>;

  @ViewChild(MatPaginator) paginator: MatPaginator;



  constructor(private _liveAnnouncer: LiveAnnouncer,public dialog: MatDialog,private girasServices: ToursServicesService) {}

  ngOnInit(){
    this.obtenerGiras();
  }

  obtenerGiras(){
    Swal.fire({
      title: 'Cargando...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
    this.girasServices.obtenerGiras().subscribe(respon=>{
      
      this.dataSource = new MatTableDataSource(respon);
      this.dataSource.paginator=this.paginator;
      this.dataSource.sort = this.sort;
      Swal.close();
    });
  },
});
}




  @ViewChild(MatSort) sort: MatSort;

  

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ToursViewModalComponent, {
      width: '1000px',
      height : '700px',
      
    });

    dialogRef.afterClosed().subscribe({
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
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}
