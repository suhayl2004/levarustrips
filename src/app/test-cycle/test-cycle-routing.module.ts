import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TestCycleComponent } from "./test-cycle.component";

const routes: Routes = [
  {
    path: "",
    component: TestCycleComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestCycleRoutingModule {}
