import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ReqDetailScreenComponent } from "./req-detail-screen.component";

const routes: Routes = [
  {
    path: "",
    component: ReqDetailScreenComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReqDetailScreenRoutingModule {}
