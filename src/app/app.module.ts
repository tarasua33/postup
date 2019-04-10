import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import {AuthModule} from './auth/auth.module';
import {AppRoutingModule} from './app-routing.module';

import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import {BaseApi} from './shared/core/base-api/base-api';
import {AuthService} from './shared/service/auth.service';
import {AuthGuard} from './shared/service/auth.guard';
import {AuthGuardParent} from './shared/service/auth.guard-parent';
import {AuthGuardPrincipal} from './shared/service/auth.guard-principal';
import {AuthGuardTeacher} from './shared/service/auth.guard-teacher';



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    AuthModule,
    BrowserAnimationsModule
  ],
  providers: [
    BaseApi,
    AuthService,
    AuthGuard,
    AuthGuardParent,
    AuthGuardPrincipal,
    AuthGuardTeacher
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
