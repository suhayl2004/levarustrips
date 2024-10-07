import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { BugDetailScreenComponent } from "./bug-detail-screen.component";

const routes: Routes = [
  {
    path: "",
    component: BugDetailScreenComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BugDetailScreenRoutingModule {}
