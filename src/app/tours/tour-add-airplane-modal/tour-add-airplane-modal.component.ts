import { Component, Inject, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TripulationAvionDTO } from 'app/models/avionList';
import { ToursServicesService } from 'app/services/tours-services.service';

@Component({
  selector: 'app-tour-add-airplane-modal',
  templateUrl: './tour-add-airplane-modal.component.html',
  styleUrls: ['./tour-add-airplane-modal.component.scss']
})
export class TourAddAirplaneModalComponent implements OnInit {
  flightForm: FormGroup;

  // Capturamos todas las instancias de mat-datepicker dinámicamente
  @ViewChildren(MatDatepicker) pickers: QueryList<MatDatepicker<any>>;

  constructor(private fb: FormBuilder,private tourService:ToursServicesService,@Inject(MAT_DIALOG_DATA) public data: any,public dialogRef: MatDialogRef<TourAddAirplaneModalComponent>) {}

  ngOnInit(): void {
    this.flightForm = this.fb.group({
      flights: this.fb.array([this.createFlight()])
    });
  }

  createFlight(): FormGroup {
    return this.fb.group({
      aerolinea: ['', Validators.required],
      numeroVuelo: ['', Validators.required],
      origen: ['', Validators.required],
      destino: ['', Validators.required],
      horaVuelo: ['', Validators.required],
      fechaSalida: ['', Validators.required]
    });
  }

  addFlight(): void {
    (this.flightForm.get('flights') as FormArray).push(this.createFlight());
  }

  removeFlight(index: number): void {
    (this.flightForm.get('flights') as FormArray).removeAt(index);
  }

  onSubmit(): void {
    if (this.flightForm.invalid) {
      return;
    }
    const flights = this.flightForm.value.flights;
    

    flights.forEach((flight: any) => {
    const avion = new TripulationAvionDTO(
      flight.numeroVuelo,  // tourTripulationAvionNumeroVuelo
      flight.aerolinea,    // tourAerolinea
      flight.fechaSalida,  // tourFechaSalida
      this.data,                   // idTour (aquí pones el valor correspondiente)
      0,                 // idAerolinea (aquí pones el valor correspondiente)
      flight.origen,       // origen
      flight.destino,      // destino
      flight.horaVuelo     // horaVuelo
    );
    
    this.tourService.addAvion(avion,this.data).subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error('Error al guardar el avion:', err);
        this.dialogRef.close(false);
      }
    });
    
  });

    
    // Aquí podrías llamar a un servicio para guardar los datos
  }

  
}
