import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '@shared/components/components.module';
import { SharedModule } from '@shared';
import { NgxSpinnerModule } from 'ngx-spinner';
import { RequirementsService } from 'app/requirements/requirements.service';
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import { TestSdScreenComponent } from './test-sd-screen.component';
import { TestSdScreenRoutingModule } from './test-sd-screen-routing.module';
import { TestSdScreenService } from './test-sd-screen.service';

@NgModule({
  declarations: [
    TestSdScreenComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule,
    SharedModule,
    TestSdScreenRoutingModule,
    NgxSpinnerModule,
    CKEditorModule,
  ],
  providers: [TestSdScreenService,RequirementsService],
})
export class TestSdScreenModule { }
