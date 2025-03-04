export class DocumentDTO {
    documentType: string;
    documentName: string;
    tourId: string;
  
    constructor(documentType: string, documentName: string, tourId: string) {
      this.documentType = documentType;
      this.documentName = documentName;
      this.tourId = tourId;
    }
  }