import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '@shared/components/components.module';
import { SharedModule } from '@shared';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import { TscCycleTableRoutingModule } from './tsc-cycle-table-routing.module';
import { TscCycleTableService } from './tsc-cycle-table.service';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule,
    SharedModule,
    TscCycleTableRoutingModule,
    NgxSpinnerModule,
    CKEditorModule
  ],
  providers: [TscCycleTableService],
})
export class TscCycleTableModule { }
