import { Injectable } from '@angular/core';
import {CanActivate,Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from './services/login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {


  constructor(private router: Router,private loginService : LoginService) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    const isAuthenticated = this.isLoggedIn(); // Aquí deberías comprobar si el usuario está autenticado
    if (!isAuthenticated) {
      this.router.navigate(['/login']);  // Redirige al login si no está autenticado
      return false;
    }
    return true;
  }

  private isLoggedIn(): boolean {
    return localStorage.getItem('token') !== null;  // Ejemplo simple
  }
  
}
