export interface PassengerDTO {
    passengersId: number;
    passengersCourse: string;
    passengersFatherLastName: string;
    passengersMotherLastName: string;
    passengersNames: string;
    passengersIdentification: string;
    passengersBirthDate: string;
    passengersPhone: string;
    passengersEmail: string;
    passengersSex: string;
    passengersSize: string;
    passengersDiet: string;
    passengersPaidOrReleased: string;
    passengersType: string;
    passengersComment: string;
    passengersTotalPayment: string;
    passengersUuid?: string; // Opcional
    passengersTotalTruePayment?: boolean; // Opcional
    idPassengerAttorney?: number; // Opcional
    emailPassengersAttorney?: string; // Opcional
    namePassengersAttorney?: string; // Opcional
    phonePassengersAttorney?: string; // Opcional
    passengersIdAttorney?: number; // Opcional
    active?: boolean; // Opcional
    voucher?: boolean; // Opcional
    medicalRecord?: boolean; // Opcional
  }