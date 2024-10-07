import { NgModule } from '@angular/core';
import { AuthenticationRoutingModule } from './authentication-routing.module';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { MaterialModule, SharedModule } from '@shared';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from '@shared/components/components.module';
import { UserManagementService } from 'app/settings/user-management/user-management.service';

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    AuthenticationRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MaterialModule,
    CommonModule,
    ComponentsModule,
    SharedModule,
  ],
  providers: [
    UserManagementService
  ]
})
export class AuthenticationModule {}
