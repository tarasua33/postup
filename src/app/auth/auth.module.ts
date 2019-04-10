import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import { NewsComponent } from './news/news.component';
import { LoginComponent } from './news/login/login.component';
import { RegistrationComponent } from './news/registration/registration.component';
import {AuthRoutingModule} from './auth-routing.module';
import {SharedModule} from '../shared/shared.module';
import {ServerService} from '../shared/service/server.service';

@NgModule({
  declarations: [
    NewsComponent,
    LoginComponent,
    RegistrationComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    SharedModule
  ],
  providers: [
    ServerService
  ]
})

export class AuthModule {}
