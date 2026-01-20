export class DocumentDTO {
  documentId: string | null;
  documentType: string;   // human readable: Programa, Seguro...
  typeKey: string;        // internal key: gira, poliza, contract, manifiesto
  documentName: string | null;
  tourId: string;
  visibleToAll: boolean;
  
  constructor(
    documentId: string | null,
    documentType: string,
    typeKey: string,
    documentName: string | null,
    tourId: string,
    visibleToAll: boolean
  ) {
    this.documentId = documentId
    this.documentType = documentType;
    this.typeKey = typeKey;
    this.documentName = documentName;
    this.tourId = tourId;
    this.visibleToAll = visibleToAll;
  }
}
