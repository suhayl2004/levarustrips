import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '@shared/components/components.module';
import { SharedModule } from '@shared';
import {
  costPipe,
  dsprintPipe,
  priorityPipe,
  restatusPipe,
  reviewerPipe,
  statusPipe,
  mnamePipe,
  tctypePipe,
  uservaluePipe,
} from './test-cases-search';
import { NgxSpinnerModule } from 'ngx-spinner';
import { TestCasesService } from './test-cases.service';
import { TestCasesRoutingModule } from './test-cases-routing.module';
import { TestCasesComponent } from './test-cases.component';
import { TestCasesFormComponent } from './dialog/test-cases-form/test-cases-form.component';
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";

@NgModule({
  declarations: [
    TestCasesComponent,
    TestCasesFormComponent,
    mnamePipe,
    priorityPipe,
    uservaluePipe,
    costPipe,
    statusPipe,
    restatusPipe,
    reviewerPipe,
    dsprintPipe,
    tctypePipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule,
    SharedModule,
    TestCasesRoutingModule,
    NgxSpinnerModule,
    CKEditorModule
  ],
  providers: [TestCasesService],
})
export class TestCasesModule { }
