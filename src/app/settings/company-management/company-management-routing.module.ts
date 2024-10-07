import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanyManagementComponent } from './company-management.component';

const routes: Routes = [
  {
    path: "",
    component: CompanyManagementComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyManagementRoutingModule { }
