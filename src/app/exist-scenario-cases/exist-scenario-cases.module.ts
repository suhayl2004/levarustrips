import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '@shared/components/components.module';
import { SharedModule } from '@shared';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import { ExistScenarioCasesService } from './exist-scenario-cases.service';
import { ExistScenarioCasesRoutingModule } from './exist-scenario-cases-routing.module';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule,
    SharedModule,
    ExistScenarioCasesRoutingModule,
    NgxSpinnerModule,
    CKEditorModule
  ],
  providers: [ExistScenarioCasesService],
})
export class ExistScenarioCasesModule { }
