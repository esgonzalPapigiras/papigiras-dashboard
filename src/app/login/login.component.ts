import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoginService } from 'app/services/login.service';
import Swal from 'sweetalert2';
import { normalizeAuthorization } from 'app/lab/lab-auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {


  email: string = '';
  password: string = '';
  errorMessage: string | null = null;
  authStatus: string = 'notAuthenticated'; // Por ejemplo

  constructor(
    private authService: LoginService, private router: Router,) { }

  ngOnInit(): void {

  }
  onSubmit(): void {
    Swal.fire({
      title: 'Espere ...',
      text: 'Por favor espera mientras se validan las credenciales.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();

        this.authService.login(this.email, this.password).subscribe(
          (response) => {
            const token = normalizeAuthorization(response?.token);
            if (!token) {
              localStorage.removeItem('token');
              Swal.fire('Error', 'El servidor local no entregó una sesión válida.', 'error');
              return;
            }
            localStorage.setItem('token', token);
            this.password = '';

            this.authStatus = 'authenticated';
            this.errorMessage = null;

            Swal.close();
            Swal.fire(
              'Éxito',
              'Acceso concedido',
              'success'
            ).then(() => {
              this.router.navigate(['dashboard']);
            });
          },
          () => {
            localStorage.removeItem('token');
            Swal.close();
            Swal.fire(
              'Error',
              'Credenciales inválidas',
              'error'
            );
          }
        );
      }
    });
  }

}
