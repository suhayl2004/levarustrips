import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ComponentsModule } from "@shared/components/components.module";
import { SharedModule } from "@shared";
import { NgxSpinnerModule } from "ngx-spinner";
import { RequirementsService } from "app/requirements/requirements.service";
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import { TestScenariosDetailScreenComponent } from "./test-scenarios-detail-screen.component";
import { TestScenariosDetailScreenRoutingModule } from "./test-scenarios-detail-screen-routing.module";
import { TestScenariosDetailScreenService } from "./test-scenarios-detail-screen.service";
import { TestScenariosService } from "app/test-scenarios/test-scenarios.service";
import { TestCasesService } from "app/test-cases/test-cases.service";
import { TestScenariosDetailFormComponent } from "./dialog/test-scenarios-detail-form/test-scenarios-detail-form.component";
import {
  mnamePipe,
  priorityPipe,
  uservaluePipe,
  costPipe,
  statusPipe,
  restatusPipe,
  reviewerPipe,
  dsprintPipe,
  tctypePipe,
} from "./test-scenarios-detail-search";
import { ExistScenarioCasesComponent } from "app/exist-scenario-cases/exist-scenario-cases.component";
import { ExistScenarioCasesService } from "app/exist-scenario-cases/exist-scenario-cases.service";

@NgModule({
  declarations: [
    TestScenariosDetailScreenComponent,
    TestScenariosDetailFormComponent,
    mnamePipe,
    priorityPipe,
    uservaluePipe,
    costPipe,
    statusPipe,
    restatusPipe,
    reviewerPipe,
    dsprintPipe,
    tctypePipe,
    ExistScenarioCasesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule,
    SharedModule,
    TestScenariosDetailScreenRoutingModule,
    NgxSpinnerModule,
    CKEditorModule,
  ],
  providers: [
    TestScenariosDetailScreenService,
    RequirementsService,
    TestScenariosService,
    TestCasesService,
    ExistScenarioCasesService
  ],
})
export class TestScenariosDetailScreenModule {}
