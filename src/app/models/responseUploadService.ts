export class ResponseUploadService {
    route: string;
    message: string;
    code: string;
  
    constructor(route: string, message: string, code: string) {
      this.route = route;
      this.message = message;
      this.code = code;
    }
  }