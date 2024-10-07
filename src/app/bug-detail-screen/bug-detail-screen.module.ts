import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ComponentsModule } from "@shared/components/components.module";
import { SharedModule } from "@shared";
import { NgxSpinnerModule } from "ngx-spinner";
import { RequirementsService } from "app/requirements/requirements.service";
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import { BugDetailScreenComponent } from "./bug-detail-screen.component";
import { BugDetailScreenRoutingModule } from "./bug-detail-screen-routing.module";
import { BugDetailScreenService } from "./bug-detail-screen.service";
import { BugsService } from "app/bugs/bugs.service";

@NgModule({
  declarations: [BugDetailScreenComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule,
    SharedModule,
    BugDetailScreenRoutingModule,
    NgxSpinnerModule,
    CKEditorModule,
  ],
  providers: [BugDetailScreenService, BugsService],
})
export class BugDetailScreenModule {}
