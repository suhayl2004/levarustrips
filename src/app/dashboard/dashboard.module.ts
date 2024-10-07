import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { Dashboard2Component } from './dashboard2.component';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { NgChartsModule } from 'ng2-charts';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SharedModule } from '@shared';
import { ComponentsModule } from '@shared/components/components.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import * as echarts from 'echarts';
import { NgxEchartsModule } from 'ngx-echarts';
import { BugsService } from 'app/bugs/bugs.service';
import { RequirementsService } from 'app/requirements/requirements.service';

@NgModule({
  declarations: [Dashboard2Component],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    NgChartsModule,
    NgApexchartsModule,
    NgScrollbarModule,
    DragDropModule,
    ComponentsModule,
    SharedModule,
    NgxSpinnerModule,
    NgxEchartsModule.forRoot({ echarts }),
  ],
  providers: [
    BugsService,RequirementsService,
  ]
})
export class DashboardModule { }
