export class TourSalesDetail {
    tourSalesUuid: string;
    tourSalesFinal: string;
    tourSalesInit: string;
    tourSalesPrice: number;
    tourSalesStatus: string;
    tourSalesStudentCount: number;
    tourSalesSeller: string;
    courseClient: string;
    nameClient: string;
    seasonClient: string;
    branchName: string;
    communesName: string;
    toursName: string;
    tourDayQuantity: number;
    tourNightQuantity: number;
    cantidadHombres: number;
    cantidadMujeres: number;
    acompananteFemenino: number;
    acompananteMasculino: number;
  
    constructor(
      tourSalesUuid: string,
      tourSalesFinal: string,
      tourSalesInit: string,
      tourSalesPrice: number,
      tourSalesStatus: string,
      tourSalesStudentCount: number,
      tourSalesSeller: string,
      courseClient: string,
      nameClient: string,
      seasonClient: string,
      branchName: string,
      communesName: string,
      toursName: string,
      tourDayQuantity: number,
      tourNightQuantity: number,
      cantidadHombres: number,
      cantidadMujeres: number,
      acompananteFemenino: number,
      acompananteMasculino: number
    ) {
      this.tourSalesUuid = tourSalesUuid;
      this.tourSalesFinal = tourSalesFinal;
      this.tourSalesInit = tourSalesInit;
      this.tourSalesPrice = tourSalesPrice;
      this.tourSalesStatus = tourSalesStatus;
      this.tourSalesStudentCount = tourSalesStudentCount;
      this.tourSalesSeller = tourSalesSeller;
      this.courseClient = courseClient;
      this.nameClient = nameClient;
      this.seasonClient = seasonClient;
      this.branchName = branchName;
      this.communesName = communesName;
      this.toursName = toursName;
      this.tourDayQuantity = tourDayQuantity;
      this.tourNightQuantity = tourNightQuantity;
      this.cantidadHombres = cantidadHombres;
      this.cantidadMujeres = cantidadMujeres;
      this.acompananteFemenino = acompananteFemenino;
      this.acompananteMasculino = acompananteMasculino;
    }
  }