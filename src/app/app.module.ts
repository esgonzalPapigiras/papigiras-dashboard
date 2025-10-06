import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';
import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { LoginComponent } from './login/login.component';
import { BrowserModule } from '@angular/platform-browser';
import { MatChipsModule } from '@angular/material/chips';
import { TourViewAlumnsModalComponent } from './tours/tour-view-alumns-modal/tour-view-alumns-modal.component';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ComponentsModule,
    MatPaginatorModule,
    MatTableModule,
    MatTabsModule,
    RouterModule,
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatChipsModule
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    LoginComponent,
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
