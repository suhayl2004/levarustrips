import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '@shared/components/components.module';
import { SharedModule } from '@shared';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import { TscTableRoutingModule } from './tsc-table-routing.module';
import { TscTableService } from './tsc-table.service';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule,
    SharedModule,
    TscTableRoutingModule,
    NgxSpinnerModule,
    CKEditorModule
  ],
  providers: [TscTableService],
})
export class TscTableModule { }
