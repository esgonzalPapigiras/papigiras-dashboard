export class TourSalesDTO {
    tourSalesId: number;
    tourSalesUuid: string;
    tourSalesInit: string;
    tourSalesFinal: string;
    tourGroups: string;
    tourInitialPay: string;
    tourSalesStudentcount: number;
    tourSalesPrice: number;
    tourSalesStatus: string;
    branchId: number;
    clientId: number;
    communeId: number;
    tourId: number;
    tour: string;
    seller: string;
    tourSalesBusSelected: boolean;
    tourSalesTripulationSelected: number;
    tourSalesCoordinatorSelected: boolean;
    addHotel: boolean;
    addAirplane: boolean;
    addSegurityPolicyDoc: boolean;
    addAlumnListDoc: boolean;
    addProgramDoc: boolean;
    addDetailHotelDoc: boolean;
    addMedicalDoc: boolean;
    addTripulation: boolean;
    addCourse: string;
    collegeName: string;
  
    constructor(
      tourSalesId: number,
      tourSalesUuid: string,
      tourSalesInit: string,
      tourSalesFinal: string,
      tourGroups: string,
      tourInitialPay: string,
      tourSalesStudentcount: number,
      tourSalesPrice: number,
      tourSalesStatus: string,
      branchId: number,
      clientId: number,
      communeId: number,
      tourId: number,
      tour: string,
      seller: string,
      tourSalesBusSelected: boolean,
      tourSalesTripulationSelected: number,
      tourSalesCoordinatorSelected: boolean,
      addHotel: boolean,
      addAirplane: boolean,
      addSegurityPolicyDoc: boolean,
      addAlumnListDoc: boolean,
      addProgramDoc: boolean,
      addDetailHotelDoc: boolean,
      addMedicalDoc: boolean,
      addTripulation: boolean,
      addCourse: string,
      collegeName: string
    ) {
      this.tourSalesId = tourSalesId;
      this.tourSalesUuid = tourSalesUuid;
      this.tourSalesInit = tourSalesInit;
      this.tourSalesFinal = tourSalesFinal;
      this.tourGroups = tourGroups;
      this.tourInitialPay = tourInitialPay;
      this.tourSalesStudentcount = tourSalesStudentcount;
      this.tourSalesPrice = tourSalesPrice;
      this.tourSalesStatus = tourSalesStatus;
      this.branchId = branchId;
      this.clientId = clientId;
      this.communeId = communeId;
      this.tourId = tourId;
      this.tour = tour;
      this.seller = seller;
      this.tourSalesBusSelected = tourSalesBusSelected;
      this.tourSalesTripulationSelected = tourSalesTripulationSelected;
      this.tourSalesCoordinatorSelected = tourSalesCoordinatorSelected;
      this.addHotel = addHotel;
      this.addAirplane = addAirplane;
      this.addSegurityPolicyDoc = addSegurityPolicyDoc;
      this.addAlumnListDoc = addAlumnListDoc;
      this.addProgramDoc = addProgramDoc;
      this.addDetailHotelDoc = addDetailHotelDoc;
      this.addMedicalDoc = addMedicalDoc;
      this.addTripulation = addTripulation;
      this.addCourse = addCourse;
      this.collegeName = collegeName;
    }
  }