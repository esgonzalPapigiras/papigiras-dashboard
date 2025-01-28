export interface TripulationsDTO {
    tourTripulationId?: number; // Propiedad opcional
    tourTripulationTypeId: number;
    tourTripulationNameId: string;
    tourTripulationDescriptionId: string;
    tourTripulationIdentificationId: string;
    tourTripulationPhoneId: string;
    tripulationBusId?: number; // Representa la relación con TripulationBus, es opcional
    tourSalesId?: number; // Representa la relación con ToursSales, es opcional
    fechaNacimiento?: string; // Fecha opcional
  }