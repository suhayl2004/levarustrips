import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ComponentsModule } from "@shared/components/components.module";
import { SharedModule } from "@shared";
import { NgxSpinnerModule } from "ngx-spinner";
import { RequirementsService } from "app/requirements/requirements.service";
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import { TestCasesDetailScreenService } from "./test-cases-detail-screen.service";
import { TestCasesDetailScreenComponent } from "./test-cases-detail-screen.component";
import { TestCasesDetailScreenRoutingModule } from "./test-cases-detail-screen-routing.module";

@NgModule({
  declarations: [TestCasesDetailScreenComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule,
    SharedModule,
    TestCasesDetailScreenRoutingModule,
    NgxSpinnerModule,
    CKEditorModule,
  ],
  providers: [TestCasesDetailScreenService, RequirementsService],
})
export class TestCasesDetailScreenModule {}
