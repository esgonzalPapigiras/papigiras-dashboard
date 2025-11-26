import { TourSalesDetail } from "./toursalesdetail";

export interface FullTourSalesDTO {
  // From TourSalesDTO
  tourSalesId: number;
  tourSalesUuid: string;
  tourSalesInit: string;
  tourSalesFinal: string;
  tourGroups: string | null;
  tourInitialPay: string | null;
  tourSalesStudentcount: number;
  tourSalesPrice: number;
  tourSalesStatus: string;
  branchId: number;
  clientId: number;
  communeId: number;
  tourId: number;
  tour: string | null;
  seller: string | null;
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
  addCourse: string | null;
  collegeName: string | null;

  // Extra enriched fields
  communeName: string | null;
  alumnosCount: number | null;
  addAlumnListDocComputed: boolean | null;

  // Backend-added detalle
  detalle: TourSalesDetail | null;
  coordinatorName: string;
  coordinatorIdentification: string;
}
