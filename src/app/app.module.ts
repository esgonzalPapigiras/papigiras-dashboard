import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';
import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { BranchModalCreateComponent } from './branch/branch-modal-create/branch-modal-create.component';
import { BranchModalEditComponent } from './branch/branch-modal-edit/branch-modal-edit.component';
import { ComunnesModalEditComponent } from './comunnes/comunnes-modal-edit/comunnes-modal-edit.component';
import { ComunnesModalCreateComponent } from './comunnes/comunnes-modal-create/comunnes-modal-create.component';
import { ProgramsModalCreateComponent } from './programs/programs-modal-create/programs-modal-create.component';
import { ProgramsModalEditComponent } from './programs/programs-modal-edit/programs-modal-edit.component';
import { SuppliersModalEditComponent } from './suppliers/suppliers-modal-edit/suppliers-modal-edit.component';
import { SuppliersModalCreateComponent } from './suppliers/suppliers-modal-create/suppliers-modal-create.component';
import { ActivitiesModalCreateComponent } from './activities/activities-modal-create/activities-modal-create.component';
import { ActivitiesModalEditComponent } from './activities/activities-modal-edit/activities-modal-edit.component';




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
    
    
    
    

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
