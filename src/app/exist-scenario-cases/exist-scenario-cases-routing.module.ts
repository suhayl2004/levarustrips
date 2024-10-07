import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExistScenarioCasesComponent } from './exist-scenario-cases.component';

const routes: Routes = [
  {
    path: '',
    component: ExistScenarioCasesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExistScenarioCasesRoutingModule { }

