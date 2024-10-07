import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestCasesComponent } from './test-cases.component';

const routes: Routes = [
  {
    path: '',
    component: TestCasesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestCasesRoutingModule { }

