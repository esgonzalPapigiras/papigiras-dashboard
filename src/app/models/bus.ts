export class TripulationBus {
    tourTripulationId: number;
    tourTripulationBusPatent: string;
    tourTripulationBusBrand: string;
    tourTripulationBusModel: string;
    tourTripulationBusYear: string;
    tourTripulationBusEnterprise: string;
  
    constructor(
      tourTripulationId: number,
      tourTripulationBusPatent: string,
      tourTripulationBusBrand: string,
      tourTripulationBusModel: string,
      tourTripulationBusYear: string,
      tourTripulationBusEnterprise: string
    ) {
      this.tourTripulationId = tourTripulationId;
      this.tourTripulationBusPatent = tourTripulationBusPatent;
      this.tourTripulationBusBrand = tourTripulationBusBrand;
      this.tourTripulationBusModel = tourTripulationBusModel;
      this.tourTripulationBusYear = tourTripulationBusYear;
      this.tourTripulationBusEnterprise = tourTripulationBusEnterprise;
    }
  }