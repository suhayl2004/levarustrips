import { NgModule } from "@angular/core";
import { BreadcrumbComponent } from "./breadcrumb/breadcrumb.component";
import { SharedModule } from "../shared.module";
import { SingleFileUploadComponent } from "./single-file-upload/single-file-upload.component";


@NgModule({
  declarations: [BreadcrumbComponent, SingleFileUploadComponent],
  imports: [SharedModule],
  exports: [BreadcrumbComponent, SingleFileUploadComponent],
})
export class ComponentsModule { }
