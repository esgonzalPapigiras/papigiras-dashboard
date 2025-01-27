export class ToursSaleDTO {
    tourSalesId: number;
    tourSalesUuid: string;
    tourSalesInit: string;
    tourSalesFinal: string;
    tourSalesStudentcount: number;
    tourSalesPrice: number;
    tourSalesStatus: string;
    branchId: number;
    clientId: number;
    communeId: number;
    tourId: string;
    seller: string;
    tourSalesBusSelected?: boolean; // Optional field
    tourSalesTripulationSelected: number;
    tourSalesCoordinatorSelected?: boolean; // Optional field
  
    constructor(
      tourSalesId: number,
      tourSalesUuid: string,
      tourSalesInit: string,
      tourSalesFinal: string,
      tourSalesStudentcount: number,
      tourSalesPrice: number,
      tourSalesStatus: string,
      branchId: number,
      clientId: number,
      communeId: number,
      tourId: string,
      seller: string,
      tourSalesBusSelected: boolean | undefined,
      tourSalesTripulationSelected: number,
      tourSalesCoordinatorSelected: boolean | undefined
    ) {
      this.tourSalesId = tourSalesId;
      this.tourSalesUuid = tourSalesUuid;
      this.tourSalesInit = tourSalesInit;
      this.tourSalesFinal = tourSalesFinal;
      this.tourSalesStudentcount = tourSalesStudentcount;
      this.tourSalesPrice = tourSalesPrice;
      this.tourSalesStatus = tourSalesStatus;
      this.branchId = branchId;
      this.clientId = clientId;
      this.communeId = communeId;
      this.tourId = tourId;
      this.seller = seller;
      this.tourSalesBusSelected = tourSalesBusSelected;
      this.tourSalesTripulationSelected = tourSalesTripulationSelected;
      this.tourSalesCoordinatorSelected = tourSalesCoordinatorSelected;
    }
  }