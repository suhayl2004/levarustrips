import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestCycleDcComponent } from './test-cycle-dc.component';

const routes: Routes = [
  {
    path: '',
    component: TestCycleDcComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestCycleDcRoutingModule { }

