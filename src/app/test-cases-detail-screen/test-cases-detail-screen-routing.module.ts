import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestCasesDetailScreenComponent } from './test-cases-detail-screen.component';

const routes: Routes = [
  {
    path: '',
    component: TestCasesDetailScreenComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestCasesDetailScreenRoutingModule { }

