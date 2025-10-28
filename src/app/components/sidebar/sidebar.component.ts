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
  { path: 'dashboard', title: 'Dashboard', icon: 'dashboard', class: '' },
  { path: 'tours', title: 'Giras', icon: 'flight', class: '' },
  { path: 'passenger', title: 'Pasajeros', icon: 'content_paste', class: '' },
  { path: 'coordinator', title: 'Coordinadores', icon: 'nordic_walking', class: '' },
  //{ path: 'branch', title: 'Oficina', icon: 'content_paste', class: '' },
  //{ path: 'communes', title: 'Comunas', icon: 'library_books', class: '' },
  { path: 'school', title: 'Colegios', icon: 'library_books', class: '' },
  { path: 'activities', title: 'Actividades', icon: 'assignment', class: '' },
  { path: 'programs', title: 'Programas', icon: 'web', class: '' },
  { path: 'suppliers', title: 'Proveedores', icon: 'notifications', class: '' },
  { path: 'maps', title: 'Seguimiento', icon: 'map', class: '' }
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
    console.log(this.router.url);
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }

  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  }

  openInNewWindow(path: string, event: MouseEvent) {
    event.preventDefault();
    // Genera la URL absoluta de la ruta
    const url = window.location.origin +
      this.router.serializeUrl(
        this.router.createUrlTree([path])
      );
    window.open(url, '_blank', 'noopener');
  }

  

  

  // Función para verificar si la ruta está activa
  isActiveRoute(route: string): boolean {
    console.log(route); 
    return this.router.url.indexOf(route) > -1;
  }
}
