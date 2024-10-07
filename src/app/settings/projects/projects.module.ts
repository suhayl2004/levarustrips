import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ComponentsModule } from "@shared/components/components.module";
import { SharedModule } from "@shared";
import { NgxSpinnerModule } from 'ngx-spinner';
import { ProjectsService } from './projects.service';
import { ProjectsRoutingModule } from './projects-routing.module';
import { ProjectsComponent } from './projects.component';
import { ProjectsFormComponent } from './dialog/projects-form/projects-form.component';
import { companyPipe } from './projects-search';

@NgModule({
  declarations: [
    ProjectsComponent,
    ProjectsFormComponent,
    companyPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule,
    SharedModule,
    ProjectsRoutingModule,
    NgxSpinnerModule
  ],
  providers: [ProjectsService],
})
export class ProjectsModule { }
