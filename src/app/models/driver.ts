export class TripulationsDTO {
    tourTripulationId?: number;
    tourTripulationTypeId: number;
    tourTripulationNameId: string;
    tourTripulationDescriptionId: string;
    tourTripulationIdentificationId: string;
    tourTripulationPhoneId: string;
    tripulationBusId?: number;  // Representa la relación con TripulationBus
    tourSalesId?: number;
    fechaNacimiento?: string;
  
    constructor(
      tourTripulationId: number | undefined,
      tourTripulationTypeId: number,
      tourTripulationNameId: string,
      tourTripulationDescriptionId: string,
      tourTripulationIdentificationId: string,
      tourTripulationPhoneId: string,
      tripulationBusId: number | undefined,
      tourSalesId: number | undefined,
      fechaNacimiento: string | undefined
    ) {
      this.tourTripulationId = tourTripulationId;
      this.tourTripulationTypeId = tourTripulationTypeId;
      this.tourTripulationNameId = tourTripulationNameId;
      this.tourTripulationDescriptionId = tourTripulationDescriptionId;
      this.tourTripulationIdentificationId = tourTripulationIdentificationId;
      this.tourTripulationPhoneId = tourTripulationPhoneId;
      this.tripulationBusId = tripulationBusId;
      this.tourSalesId = tourSalesId;
      this.fechaNacimiento = fechaNacimiento;
    }
  }