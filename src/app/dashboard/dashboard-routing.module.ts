import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { Dashboard2Component } from "./dashboard2.component";

const routes: Routes = [
  {
    path: "",
    component: Dashboard2Component,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule { }
