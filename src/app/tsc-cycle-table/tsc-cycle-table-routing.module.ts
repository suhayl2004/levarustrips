import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TscCycleTableComponent } from './tsc-cycle-table.component';

const routes: Routes = [
  {
    path: '',
    component: TscCycleTableComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TscCycleTableRoutingModule { }

