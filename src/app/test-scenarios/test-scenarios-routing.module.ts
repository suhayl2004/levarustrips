import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestScenariosComponent } from './test-scenarios.component';

const routes: Routes = [
  {
    path: '',
    component: TestScenariosComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestScenariosRoutingModule { }

