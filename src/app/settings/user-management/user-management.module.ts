import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ComponentsModule } from "@shared/components/components.module";
import { SharedModule } from "@shared";
import { UserManagementComponent } from './user-management.component';
import { UserManagementRoutingModule } from './user-management-routing.module';
import { UserManagementService } from './user-management.service';
import { companyPipe, projectPipe } from './user-management-search';
import { NgxSpinnerModule } from 'ngx-spinner';
import { UserManagementFormComponent } from './dialog/user-management-form/user-management-form.component';

@NgModule({
  declarations: [
    UserManagementComponent,
    UserManagementFormComponent,
    companyPipe,
    projectPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule,
    SharedModule,
    UserManagementRoutingModule,
    NgxSpinnerModule
  ],
  providers: [UserManagementService],
})
export class UserManagementModule { }
