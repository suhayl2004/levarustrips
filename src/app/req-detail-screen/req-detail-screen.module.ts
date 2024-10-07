import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ComponentsModule } from "@shared/components/components.module";
import { SharedModule } from "@shared";
import { NgxSpinnerModule } from "ngx-spinner";
import { ReqDetailScreenService } from "./req-detail-screen.service";
import { ReqDetailScreenRoutingModule } from "./req-detail-screen-routing.module";
import { RequirementsService } from "app/requirements/requirements.service";
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import { ReqDetailScreenComponent } from "./req-detail-screen.component";

@NgModule({
  declarations: [ReqDetailScreenComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule,
    SharedModule,
    ReqDetailScreenRoutingModule,
    NgxSpinnerModule,
    CKEditorModule,
  ],
  providers: [ReqDetailScreenService, RequirementsService],
})
export class ReqDetailScreenModule {}
