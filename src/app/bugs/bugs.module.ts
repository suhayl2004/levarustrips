import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ComponentsModule } from "@shared/components/components.module";
import { SharedModule } from "@shared";
import {
  assigneePipe,
  mnamePipe,
  severityPipe,
  tcaseidPipe,
  reqidPipe,
  tscenarioidPipe,
  statusPipe,
  complexityPipe,
  priorityPipe,
  frequencyPipe,
} from "./bugs-search";
import { NgxSpinnerModule } from "ngx-spinner";
import { BugsComponent } from "./bugs.component";
import { BugsFormComponent } from "./dialog/bugs-form/bugs-form.component";
import { BugsRoutingModule } from "./bugs-routing.module";
import { BugsService } from "./bugs.service";
import { RequirementsService } from "app/requirements/requirements.service";
import { TestCasesService } from "app/test-cases/test-cases.service";
import { TestScenariosService } from "app/test-scenarios/test-scenarios.service";

@NgModule({
  declarations: [
    BugsComponent,
    BugsFormComponent,
    assigneePipe,
    mnamePipe,
    severityPipe,
    reqidPipe,
    tcaseidPipe,
    tscenarioidPipe,
    statusPipe,
    complexityPipe,
    priorityPipe,
    frequencyPipe,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule,
    SharedModule,
    BugsRoutingModule,
    NgxSpinnerModule,
  ],
  providers: [
    BugsService,
    RequirementsService,
    TestCasesService,
    TestScenariosService,
  ],
})
export class BugsModule {}
