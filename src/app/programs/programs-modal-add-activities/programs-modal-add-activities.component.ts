import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TourActivities } from 'app/models/tourActivities';
import { ActivitiesService } from 'app/services/activities.service';
import { ProgramsService } from 'app/services/programs.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-programs-modal-add-activities',
  templateUrl: './programs-modal-add-activities.component.html',
  styleUrls: ['./programs-modal-add-activities.component.scss']
})
export class ProgramsModalAddActivitiesComponent implements OnInit {

    programs: any[] = [];
    searchTerm: string = '';
    selectedActivities: any[] = [];
  
  
    constructor(private _liveAnnouncer: LiveAnnouncer, public dialogRef: MatDialogRef<ProgramsModalAddActivitiesComponent>, private programService: ProgramsService,private activitiesService: ActivitiesService,@Inject(MAT_DIALOG_DATA) public data: any,) { }
  
    ngOnInit() {
      this.obtenerActividades();
    }
  
    obtenerActividades() {
      Swal.fire({
        title: 'Cargando...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
          this.activitiesService.obtenerActividades().subscribe(respon => {
            this.programs = respon;
            Swal.close();
          });
        },
      });
    }
  
    get selectedProgramsText(): string {
      return this.selectedActivities && this.selectedActivities.length > 0
        ? this.selectedActivities.map(c => c.itinerary_name).join(', ')
        : 'Selecciona Actividades';
    }
  
    filteredPrograms() {
      return this.programs.filter(programs =>
        programs.itinerary_name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  
    sendCoordinators() {
      if (this.selectedActivities.length > 0) {
        const selectedNamesAndIds = this.selectedActivities.map(activity =>activity.itinerary_name).join(', ');
        Swal.fire({
          title: 'Actividades seleccionadas',
          text: 'Has seleccionado: ' + selectedNamesAndIds,
          icon: 'success',
          confirmButtonText: 'Cerrar'
        });
        this.selectedActivities.forEach(activity => {
          console.log('ID Actividad:', activity.itinerary_id);
          console.log('ID Programa :' , this.data.tours_id);
        
          // Creación correcta de una nueva instancia de TourActivities
          const tourActivity = new TourActivities();
  
          // Asignar los valores manualmente
          tourActivity.idTour = this.data.tours_id;
          tourActivity.idActivity = activity.itinerary_id;
          tourActivity.isSelect = true;
        
          console.log(tourActivity);
        
          // Llamada al servicio con tourActivity
          Swal.fire({
            title: 'Cargando...',
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
              this.programService.addProgramActivities(tourActivity, this.data.tours_id).subscribe(respon => {
                
              });
            },
          });
        
          
           // Cerrar el loading de Swal
        });
        Swal.close();
        this.dialogRef.close(true);
      } else {
        Swal.fire({
          title: 'Error',
          text: 'No has seleccionado ninguna Actividad.',
          icon: 'error',
          confirmButtonText: 'Cerrar'
        });
      }
    }

}
