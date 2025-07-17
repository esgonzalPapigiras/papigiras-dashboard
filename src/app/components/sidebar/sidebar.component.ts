import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Importamos el Router para poder obtener la ruta actual

declare const $: any;

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
  children?: RouteInfo[]; // Agregamos la propiedad children opcional
}

export const ROUTES: RouteInfo[] = [
  { path: '/dashboard', title: 'Dashboard', icon: 'dashboard', class: '' },
  { path: '/maps', title: 'Seguimiento', icon: 'map', class: '' },
  { path: '/tours', title: 'Giras', icon: 'flight', class: '' },
  { path: '/coordinator', title: 'Coordinadores', icon: 'nordic_walking', class: '' },
  { path: '/branch', title: 'Oficina', icon: 'content_paste', class: '' },
  { path: '/communes', title: 'Comunas', icon: 'library_books', class: '' },
  { path: '/activities', title: 'Actividades', icon: 'assignment', class: '' },
  { path: '/programs', title: 'Programas', icon: 'web', class: '' },
  { path: '/suppliers', title: 'Proveedores', icon: 'notifications', class: '' }
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];

  constructor(private router: Router) { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }

  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  }

  // Función para verificar si la ruta está activa
  isActiveRoute(route: string): boolean {
    return this.router.url.indexOf(route) > -1;
  }
}
