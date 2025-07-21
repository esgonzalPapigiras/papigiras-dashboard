import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';
import { MapsCoordinatorComponent } from './maps-coordinator/maps-coordinator.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login', // Redirige al login por defecto
    pathMatch: 'full',
  },
  {
    path: 'login', // Ruta para el login
    component: LoginComponent,
  },
  { path: 'maps', component: MapsCoordinatorComponent },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard], // Protección del layout
    children: [
      {
        path: '',
        loadChildren: () => import('./layouts/admin-layout/admin-layout.module').then(m => m.AdminLayoutModule),
      },
    ],
  },
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes,{
       useHash: false
    })
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
