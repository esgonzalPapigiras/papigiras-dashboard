import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { TableListComponent } from '../../table-list/table-list.component';
import { TypographyComponent } from '../../typography/typography.component';
import { IconsComponent } from '../../icons/icons.component';
import { MapsComponent } from '../../maps/maps.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { UpgradeComponent } from '../../upgrade/upgrade.component';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatRippleModule} from '@angular/material/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSelectModule} from '@angular/material/select';
import { ToursComponent } from '../../tours/tours/tours.component';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatDialogModule} from '@angular/material/dialog';
import { ToursViewModalComponent } from '../../tours/tours-view-modal/tours-view-modal.component';
import {MatTabsModule} from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatOptionModule } from '@angular/material/core';
import { TourDonwloadAlumnsModalComponent } from '../../tours/tour-donwload-alumns-modal/tour-donwload-alumns-modal.component';
import { TourAddBusModalComponent } from '../../tours/tour-add-bus-modal/tour-add-bus-modal.component';
import { TourAddCoordinatorModalComponent } from '../../tours/tour-add-coordinator-modal/tour-add-coordinator-modal.component';
import { TourAddDriverModalComponent } from '../../tours/tour-add-driver-modal/tour-add-driver-modal.component';
import { TourAddAirplaneModalComponent } from '../../tours/tour-add-airplane-modal/tour-add-airplane-modal.component';
import { TourAddHotelModalComponent } from '../../tours/tour-add-hotel-modal/tour-add-hotel-modal.component';
import { TourAddDocumentModalComponent } from '../../tours/tour-add-document-modal/tour-add-document-modal.component';
import { TourDownloadDocumentModalComponent } from '../../tours/tour-download-document-modal/tour-download-document-modal.component';
import { TourDeleteModalComponent } from '../../tours/tour-delete-modal/tour-delete-modal.component';
import { CoordinatorComponent } from 'app/coordinator/coordinator.component';
import { ComunnesComponent } from 'app/comunnes/comunnes.component';
import { BranchComponent } from 'app/branch/branch.component';
import { ActivitiesComponent } from 'app/activities/activities.component';
import { ProgramsComponent } from 'app/programs/programs.component';
import { SuppliersComponent } from 'app/suppliers/suppliers.component';
import { CoordinatorModalEditComponent } from 'app/coordinator/coordinator-modal-edit/coordinator-modal-edit.component';
import { CoordinatorModalCreateComponent } from 'app/coordinator/coordinator-modal-create/coordinator-modal-create.component';
import { BranchModalCreateComponent } from '../../branch/branch-modal-create/branch-modal-create.component';
import { BranchModalEditComponent } from '../../branch/branch-modal-edit/branch-modal-edit.component';
import { ComunnesModalEditComponent } from '../../comunnes/comunnes-modal-edit/comunnes-modal-edit.component';
import { ComunnesModalCreateComponent } from '../../comunnes/comunnes-modal-create/comunnes-modal-create.component';
import { ProgramsModalCreateComponent } from '../../programs/programs-modal-create/programs-modal-create.component';
import { ProgramsModalEditComponent } from '../../programs/programs-modal-edit/programs-modal-edit.component';
import { SuppliersModalEditComponent } from '../../suppliers/suppliers-modal-edit/suppliers-modal-edit.component';
import { SuppliersModalCreateComponent } from '../../suppliers/suppliers-modal-create/suppliers-modal-create.component';
import { ActivitiesModalCreateComponent } from '../../activities/activities-modal-create/activities-modal-create.component';
import { ActivitiesModalEditComponent } from '../../activities/activities-modal-edit/activities-modal-edit.component';
import { ProgramsModalListActivitiesComponent } from '../../programs/programs-modal-list-activities/programs-modal-list-activities.component';
import { ProgramsModalAddActivitiesComponent } from '../../programs/programs-modal-add-activities/programs-modal-add-activities.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    MatTabsModule,
    MatIconModule,
    MatOptionModule
    
    
  ],
  declarations: [
    DashboardComponent,
    UserProfileComponent,
    TableListComponent,
    TypographyComponent,
    IconsComponent,
    MapsComponent,
    NotificationsComponent,
    UpgradeComponent,
    ToursComponent,
    ToursViewModalComponent,
    TourDonwloadAlumnsModalComponent,
    TourAddBusModalComponent,
    TourAddCoordinatorModalComponent,
    TourAddDriverModalComponent,
    TourAddAirplaneModalComponent,
    TourAddHotelModalComponent,
    TourAddDocumentModalComponent,
    TourDownloadDocumentModalComponent,
    TourDeleteModalComponent,
    CoordinatorComponent,
    ComunnesComponent,
    BranchComponent,
    ActivitiesComponent,
    ProgramsComponent,
    SuppliersComponent,
    CoordinatorModalEditComponent,
    CoordinatorModalCreateComponent,
    BranchModalCreateComponent,
    BranchModalEditComponent,
    ComunnesModalEditComponent,
    ComunnesModalCreateComponent,
    ProgramsModalCreateComponent,
    ProgramsModalEditComponent,
    SuppliersModalEditComponent,
    SuppliersModalCreateComponent,
    ActivitiesModalCreateComponent,
    ActivitiesModalEditComponent,
    ProgramsModalListActivitiesComponent,
    ProgramsModalAddActivitiesComponent,

  ]
})

export class AdminLayoutModule {}
