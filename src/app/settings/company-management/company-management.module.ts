import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ComponentsModule } from "@shared/components/components.module";
import { SharedModule } from "@shared";
import { NgxSpinnerModule } from 'ngx-spinner';
import { CompanyManagementService } from './company-management.service';
import { CompanyManagementComponent } from './company-management.component';
import { CompanyManagementRoutingModule } from './company-management-routing.module';
import { CompanyManagementFormComponent } from './dialog/company-management-form/company-management-form.component';

@NgModule({
  declarations: [
    CompanyManagementComponent,
    CompanyManagementFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule,
    SharedModule,
    CompanyManagementRoutingModule,
    NgxSpinnerModule
  ],
  providers: [CompanyManagementService],
})
export class CompanyManagementModule { }
