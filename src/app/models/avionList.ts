export class TripulationAvionDTO {
  tourTripulationAvionNumeroVuelo: string;
  tourAerolinea: string;
  tourFechaSalida: string;
  idTour: number;
  idAerolinea: number;
  origen: string;
  destino: string;
  horaVuelo: string;

  constructor(
    tourTripulationAvionNumeroVuelo: string,
    tourAerolinea: string,
    tourFechaSalida: string,
    idTour: number,
    idAerolinea: number,
    origen: string,
    destino: string,
    horaVuelo: string
  ) {
    this.tourTripulationAvionNumeroVuelo = tourTripulationAvionNumeroVuelo;
    this.tourAerolinea = tourAerolinea;
    this.tourFechaSalida = tourFechaSalida;
    this.idTour = idTour;
    this.idAerolinea = idAerolinea;
    this.origen = origen;
    this.destino = destino;
    this.horaVuelo = horaVuelo;
  }
}