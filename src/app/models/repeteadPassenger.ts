class RepeteadPassenger {
    rutPassenger: string;
    namePassenger: string;
    lastNamePassenger: string;
  
    constructor(rutPassenger: string, namePassenger: string, lastNamePassenger: string) {
      this.rutPassenger = rutPassenger;
      this.namePassenger = namePassenger;
      this.lastNamePassenger = lastNamePassenger;
    }
  
    static fromJson(parsedJson: any): RepeteadPassenger {
      return new RepeteadPassenger(
        parsedJson['rutPassenger'],
        parsedJson['namePassenger'],
        parsedJson['lastNamePassenger']
      );
    }
  
    toJson(): any {
      return {
        rutPassenger: this.rutPassenger,
        namePassenger: this.namePassenger,
        lastNamePassenger: this.lastNamePassenger,
      };
    }
  }