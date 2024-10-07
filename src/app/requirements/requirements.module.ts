import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '@shared/components/components.module';
import { SharedModule } from '@shared';
import {
  priorityPipe,
  reviewerPipe,
  statusPipe,
  mnamePipe,
} from './req-search';
import { RequirementsRoutingModule } from './requirements-routing.module';
import { RequirementsComponent } from './requirements.component';
import { RequirementsService } from './requirements.service';
import { ReqFormComponent } from './dialog/req-form/req-form.component';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [
    RequirementsComponent,
    ReqFormComponent,
    mnamePipe,
    priorityPipe,
    statusPipe,
    reviewerPipe,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule,
    SharedModule,
    RequirementsRoutingModule,
    NgxSpinnerModule
  ],
  providers: [RequirementsService],
})
export class RequirementsModule { }
