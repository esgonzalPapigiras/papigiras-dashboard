import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoginService } from 'app/services/login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{


  email: string = '';
  password: string = '';
  errorMessage: string | null = null;
  authStatus: string = 'notAuthenticated'; // Por ejemplo

  constructor(
    private authService: LoginService,private router: Router,) { }


  ngOnInit(): void {
    
  }




  onSubmit(): void {
    Swal.fire({
      title: "Espere ...",
      text: "Por favor espera mientras se buscan los datos del usuario.",
      allowOutsideClick: false,
      didOpen: async () => {
        Swal.showLoading();
  
        // Primero obtenemos el token
        this.authService.token().subscribe(
          (response) => {
            // Guardamos el token en localStorage
            localStorage.setItem('token', response.token);
  
            // Luego hacemos la solicitud de login
            this.authService.login(this.email, this.password).subscribe(
              (response) => {
                this.authStatus = 'authenticated';
                this.errorMessage = null;
                Swal.close();
                Swal.fire(
                  "Éxito",
                  "Los datos fueron encontrados",
                  "success"
                ).then(() => {
                  this.router.navigate(['dashboard']);
                });
              },
              (error) => {
                
                Swal.close();
                Swal.fire(
                  "Error",
                  "Hubo un problema al encontrar el usuario",
                  "error"
                );
              }
            );
          },
          (error) => {
            
            Swal.close();
            Swal.fire(
              "Error",
              "Hubo un problema al obtener el token",
              "error"
            );
          }
        );
      },
    });
  }

}
