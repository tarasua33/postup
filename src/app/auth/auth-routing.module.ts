import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {NewsComponent} from './news/news.component';
import {LoginComponent} from './news/login/login.component';
import {RegistrationComponent} from './news/registration/registration.component';

const routes: Routes = [
  {path: 'news', component: NewsComponent, children: [
      {path: 'login', component: LoginComponent},
      {path: 'registration', component: RegistrationComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AuthRoutingModule {}
