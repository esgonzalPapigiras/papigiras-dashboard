export class BestCoordinators {
    cantidadHitos: number;
    cantidadFotos: number;
    tourSalesUuid: string;
    tourSalesInit: string;
    tourSalesFinal: string;
    nameClient: string;
    courseClient: string;
    tourTripulationNameId: string;
  
    constructor(
      cantidadHitos: number,
      cantidadFotos: number,
      tourSalesUuid: string,
      tourSalesInit: string,
      tourSalesFinal: string,
      nameClient: string,
      courseClient: string,
      tourTripulationNameId: string
    ) {
      this.cantidadHitos = cantidadHitos;
      this.cantidadFotos = cantidadFotos;
      this.tourSalesUuid = tourSalesUuid;
      this.tourSalesInit = tourSalesInit;
      this.tourSalesFinal = tourSalesFinal;
      this.nameClient = nameClient;
      this.courseClient = courseClient;
      this.tourTripulationNameId = tourTripulationNameId;
    }
  }
  