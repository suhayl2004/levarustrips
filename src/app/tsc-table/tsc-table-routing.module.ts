import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TscTableComponent } from './tsc-table.component';

const routes: Routes = [
  {
    path: '',
    component: TscTableComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TscTableRoutingModule { }

