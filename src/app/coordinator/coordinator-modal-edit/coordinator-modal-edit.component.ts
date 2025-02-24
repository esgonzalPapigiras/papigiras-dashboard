import { LiveAnnouncer } from "@angular/cdk/a11y";
import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { Branch } from "app/models/branch";
import { Coordinator } from "app/models/coordinator";
import { BranchService } from "app/services/branch.service";
import { CoordinatorService } from "app/services/coordinator.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-coordinator-modal-edit",
  templateUrl: "./coordinator-modal-edit.component.html",
  styleUrls: ["./coordinator-modal-edit.component.scss"],
})
export class CoordinatorModalEditComponent implements OnInit {
  coordinator: Coordinator;
  branch : Branch[];
  sexOptions: string[] = ["Masculino", "Femenino"];

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    public dialog: MatDialog,
    private coordinatorServices: CoordinatorService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private branchService:BranchService
  ) {}

  ngOnInit(): void {
    this.obtenerCoordinador();
    this.obtenerOficina();
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

  obtenerOficina() {
    Swal.fire({
      title: "Cargando...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
        this.branchService
          .obtenerOficinas()
          .subscribe((respon) => {
            this.branch = respon;
            console.log(this.branch);
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
