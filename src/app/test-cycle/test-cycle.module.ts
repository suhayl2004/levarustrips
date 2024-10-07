import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '@shared/components/components.module';
import { SharedModule } from '@shared';
import {
  testtypePipe,
  ownerPipe,
  sprintPipe,
} from './test-cycle-search';
import { NgxSpinnerModule } from 'ngx-spinner';
import { TestCycleComponent } from './test-cycle.component';
import { TestCycleFormComponent } from './dialog/test-cycle-form/test-cycle-form.component';
import { TestCycleRoutingModule } from './test-cycle-routing.module';
import { TestCycleService } from './test-cycle.service';

@NgModule({
  declarations: [
    TestCycleComponent,
    TestCycleFormComponent,
    ownerPipe,
    testtypePipe,
    sprintPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule,
    SharedModule,
    TestCycleRoutingModule,
    NgxSpinnerModule
  ],
  providers: [TestCycleService],
})
export class TestCycleModule { }
