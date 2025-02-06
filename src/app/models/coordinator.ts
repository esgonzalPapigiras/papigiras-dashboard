export class Coordinator {
    constructor(
      public coordinatorId: number,
      public coordinatorRut: string,
      public coordinatorName: string,
      public coordinatorLastname: string,
      public coordinatorSex: string,
      public coordinatorResidencia: string,
      public coordinatorOficina: string,
      public coordinatorFechaNacimiento: string,
      public coordinatorEdad: number,
      public coordinatorCelular: string,
      public coordinatorCorreo: string,
      public coordinatorInstaPersonal: string,
      public coordinatorInstaAt: string,
      public coordinatorUniversidad: string,
      public coordinatorCarrera: string,
      public coordinatorProfesion: string,
      public coordinatorEmpresa: string,
      public coordinatorPicture: boolean = false
    ) {}
  
    // El método fromJson no es necesario en Angular si estamos usando 'HttpClient' directamente,
    // pero si prefieres hacerlo, puedes incluirlo de esta manera.
    static fromJson(json: any): Coordinator {
      return new Coordinator(
        json.coordinatorId,
        json.coordinatorRut,
        json.coordinatorName,
        json.coordinatorLastname,
        json.coordinatorSex,
        json.coordinatorResidencia,
        json.coordinatorOficina,
        json.coordinatorFechaNacimiento,
        json.coordinatorEdad,
        json.coordinatorCelular,
        json.coordinatorCorreo,
        json.coordinatorInstaPersonal,
        json.coordinatorInstaAt,
        json.coordinatorUniversidad,
        json.coordinatorCarrera,
        json.coordinatorProfesion,
        json.coordinatorEmpresa,
        json.coordinatorPicture ?? false
      );
    }
  }