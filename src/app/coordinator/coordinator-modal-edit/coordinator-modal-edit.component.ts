import { LiveAnnouncer } from "@angular/cdk/a11y";
import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { Coordinator } from "app/models/coordinator";
import { CoordinatorService } from "app/services/coordinator.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-coordinator-modal-edit",
  templateUrl: "./coordinator-modal-edit.component.html",
  styleUrls: ["./coordinator-modal-edit.component.scss"],
})
export class CoordinatorModalEditComponent implements OnInit {
  coordinator: Coordinator;
  sexOptions: string[] = ["Masculino", "Femenino"];

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    public dialog: MatDialog,
    private coordinatorServices: CoordinatorService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.obtenerCoordinador();
  }

  obtenerCoordinador() {
    Swal.fire({
      title: "Cargando...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
        this.coordinatorServices
          .obtenerCoordinadoresUpdate(this.data)
          .subscribe((respon) => {
            this.coordinator = respon;
            console.log(this.coordinator);
            Swal.close();
          });
      },
    });
  }

  onSave() {
    Swal.fire({
      title: "Guardando...",
      text: "Por favor espera mientras se guarda la información.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
        this.coordinatorServices.coordinatorUpdate(this.coordinator).subscribe(
          (response) => {
            Swal.close();
            Swal.fire(
              "Éxito",
              "Los datos del coordinador han sido guardados",
              "success"
            );
            // Aquí puedes redirigir o hacer lo que necesites después de guardar
          },
          (error) => {
            Swal.close();
            Swal.fire(
              "Error",
              "Hubo un problema al guardar los datos",
              "error"
            );
          }
        );
      },
    });
  }
}
