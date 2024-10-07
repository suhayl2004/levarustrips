import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '@shared/components/components.module';
import { SharedModule } from '@shared';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
// import { TestScenariosComponent } from './test-scenarios.component';
import { TestScenariosRoutingModule } from './test-scenarios-routing.module';
import { TestScenariosService } from './test-scenarios.service';
import { TestScenariosFormComponent } from './dialog/test-scenarios-form/test-scenarios-form.component';
import { TscTableComponent } from 'app/tsc-table/tsc-table.component';
import { TscTableService } from 'app/tsc-table/tsc-table.service';

@NgModule({
  declarations: [
    // TestScenariosComponent,
    TestScenariosFormComponent,
    TscTableComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule,
    SharedModule,
    TestScenariosRoutingModule,
    NgxSpinnerModule,
    CKEditorModule
  ],
  providers: [TestScenariosService,TscTableService],
})
export class TestScenariosModule { }
