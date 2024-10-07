import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestScenariosDetailScreenComponent } from './test-scenarios-detail-screen.component';

const routes: Routes = [
  {
    path: '',
    component: TestScenariosDetailScreenComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestScenariosDetailScreenRoutingModule { }

