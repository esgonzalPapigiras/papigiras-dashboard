export interface TourSalesDetailWeb {
  tourSalesUuid: string;
  tourSalesFinal: string;
  tourSalesInit: string;
  tourSalesPrice: number;
  tourSalesStatus: string;
  tourSalesStudentCount: number; // puede venir (backup)
  tourDayQuantity: number;
  tourNightQuantity: number;
  cantidadHombres?: number;
  cantidadMujeres?: number;
  acompananteFemenino?: number;
  acompananteMasculino?: number;

  // campo calculado
  totalParticipantes?: number;
}