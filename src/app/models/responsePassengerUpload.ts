class ResponsePassengerUpload {
    repeatPassenger: RepeteadPassenger[];
    quantityRepeat: number;
  
    constructor(repeatPassenger: RepeteadPassenger[], quantityRepeat: number) {
      this.repeatPassenger = repeatPassenger;
      this.quantityRepeat = quantityRepeat;
    }
  
    static fromJson(parsedJson: any): ResponsePassengerUpload {
      const repeatPassengerList = parsedJson['repeatPassenger'] as any[];
      const passengers = repeatPassengerList.map((i) => RepeteadPassenger.fromJson(i));
  
      return new ResponsePassengerUpload(passengers, parsedJson['quantityRepeat']);
    }
  
    toJson(): any {
      return {
        repeatPassenger: this.repeatPassenger.map((p) => p.toJson()),
        quantityRepeat: this.quantityRepeat,
      };
    }
  }