import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestSdScreenComponent } from './test-sd-screen.component';

const routes: Routes = [
  {
    path: '',
    component: TestSdScreenComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestSdScreenRoutingModule { }

