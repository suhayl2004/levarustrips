import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ComponentsModule } from "@shared/components/components.module";
import { SharedModule } from "@shared";
import { NgxSpinnerModule } from "ngx-spinner";
import { RequirementsService } from "app/requirements/requirements.service";
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import { TestCycleDcComponent } from "./test-cycle-dc.component";
import { TestCycleDcRoutingModule } from "./test-cycle-dc-routing.module";
import { TestCycleDcService } from "./test-cycle-dc.service";
import { TestCycleService } from "app/test-cycle/test-cycle.service";
import { TestCycleDcFormComponent } from "./dialog/test-cycle-dc-form/test-cycle-dc-form.component";
import { TscCycleTableComponent } from "app/tsc-cycle-table/tsc-cycle-table.component";
import { TscCycleTableService } from "app/tsc-cycle-table/tsc-cycle-table.service";
import { TestScenariosComponent } from "app/test-scenarios/test-scenarios.component";
import { TestScenariosService } from "app/test-scenarios/test-scenarios.service";

@NgModule({
  declarations: [
    TestCycleDcComponent,
    TestCycleDcFormComponent,
    TscCycleTableComponent,
    TestScenariosComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule,
    SharedModule,
    TestCycleDcRoutingModule,
    NgxSpinnerModule,
    CKEditorModule,
  ],
  providers: [
    TestCycleDcService,
    RequirementsService,
    TestCycleService,
    TscCycleTableService,
    TestScenariosService,
  ],
})
export class TestCycleDcModule {}
