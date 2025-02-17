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

export const AdminLayoutRoutes: Routes = [
    // {
    //   path: '',
    //   children: [ {
    //     path: 'dashboard',
    //     component: DashboardComponent
    // }]}, {
    // path: '',
    // children: [ {
    //   path: 'userprofile',
    //   component: UserProfileComponent
    // }]
    // }, {
    //   path: '',
    //   children: [ {
    //     path: 'icons',
    //     component: IconsComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'notifications',
    //         component: NotificationsComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'maps',
    //         component: MapsComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'typography',
    //         component: TypographyComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'upgrade',
    //         component: UpgradeComponent
    //     }]
    // }
    { path: 'dashboard', component: DashboardComponent },
    { path: 'coordinator', component: CoordinatorComponent },
    { path: 'tours', component: ToursComponent },
    { path: 'branch', component: BranchComponent },
    { path: 'communes', component: ComunnesComponent },
    { path: 'activities', component: ActivitiesComponent },
    { path: 'programs', component: ProgramsComponent },
    { path: 'suppliers', component: SuppliersComponent }

];
