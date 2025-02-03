import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';
import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { TourDonwloadAlumnsModalComponent } from './tours/tour-donwload-alumns-modal/tour-donwload-alumns-modal.component';
import { TourAddBusModalComponent } from './tours/tour-add-bus-modal/tour-add-bus-modal.component';
import { TourAddCoordinatorModalComponent } from './tours/tour-add-coordinator-modal/tour-add-coordinator-modal.component';
import { TourAddDriverModalComponent } from './tours/tour-add-driver-modal/tour-add-driver-modal.component';
import { TourAddAirplaneModalComponent } from './tours/tour-add-airplane-modal/tour-add-airplane-modal.component';
import { TourAddHotelModalComponent } from './tours/tour-add-hotel-modal/tour-add-hotel-modal.component';
import { TourAddDocumentModalComponent } from './tours/tour-add-document-modal/tour-add-document-modal.component';
import { TourDownloadDocumentModalComponent } from './tours/tour-download-document-modal/tour-download-document-modal.component';
import { TourDeleteModalComponent } from './tours/tour-delete-modal/tour-delete-modal.component';



@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ComponentsModule,
    RouterModule,
    AppRoutingModule,
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    TourDonwloadAlumnsModalComponent,
    TourAddBusModalComponent,
    TourAddCoordinatorModalComponent,
    TourAddDriverModalComponent,
    TourAddAirplaneModalComponent,
    TourAddHotelModalComponent,
    TourAddDocumentModalComponent,
    TourDownloadDocumentModalComponent,
    TourDeleteModalComponent,
    
    

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
