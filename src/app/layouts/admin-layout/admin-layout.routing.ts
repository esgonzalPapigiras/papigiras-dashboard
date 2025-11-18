import { Routes } from '@angular/router';

import { DashboardComponent } from '../../dashboard/dashboard.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { TableListComponent } from '../../table-list/table-list.component';
import { TypographyComponent } from '../../typography/typography.component';
import { IconsComponent } from '../../icons/icons.component';
import { MapsComponent } from '../../maps/maps.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { UpgradeComponent } from '../../upgrade/upgrade.component';
import { ToursComponent } from 'app/tours/tours/tours.component';
import { CoordinatorComponent } from 'app/coordinator/coordinator.component';
import { BranchComponent } from 'app/branch/branch.component';
import { ComunnesComponent } from 'app/comunnes/comunnes.component';
import { ActivitiesComponent } from 'app/activities/activities.component';
import { ProgramsComponent } from 'app/programs/programs.component';
import { SuppliersComponent } from 'app/suppliers/suppliers.component';
import { MapsCoordinatorComponent } from 'app/maps-coordinator/maps-coordinator.component';
import { SchoolComponent } from 'app/school/school.component';
import { PassengerComponent } from 'app/passengers/passengers.component';
import { BusesComponent } from 'app/buses/buses.component';


export const AdminLayoutRoutes: Routes = [
    
    { path: 'dashboard', component: DashboardComponent },
    { path: 'coordinator', component: CoordinatorComponent },
    { path: 'tours', component: ToursComponent },
    { path: 'branch', component: BranchComponent },
    { path: 'communes', component: ComunnesComponent },
    { path: 'activities', component: ActivitiesComponent },
    { path: 'programs', component: ProgramsComponent },
    { path: 'suppliers', component: SuppliersComponent },
    { path: 'school', component: SchoolComponent },
    { path: 'passenger', component: PassengerComponent },
    { path: 'bus', component: BusesComponent },
];
