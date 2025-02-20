import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RequirementsComponent } from './requirements.component';

const routes: Routes = [
  {
    path: '',
    component: RequirementsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequirementsRoutingModule { }
