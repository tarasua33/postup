import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SystemComponent} from './system.component';
import {PrincipalComponent} from './principal/principal.component';
import {ListStudentsComponent} from './shared/components/list-students/list-students.component';
import {RegisterComponent} from './shared/components/register/register.component';
import {AnalysisGroupComponent} from './shared/components/analysis-group/analysis-group.component';
import {AnalysisPersonalComponent} from './shared/components/analysis-personal/analysis-personal.component';
import {TeachersComponent} from './shared/components/teachers/teachers.component';
import {ParentAccessComponent} from './shared/components/parent-access/parent-access.component';
import {YearsComponent} from './shared/components/years/years.component';
import {ClassEditionComponent} from './shared/components/class-edition/class-edition.component';
import {TeacherLogComponent} from './teacher-log/teacher-log.component';
import {ParentLogComponent} from './parent-log/parent-log.component';
import {AuthGuard} from '../shared/service/auth.guard';
import {AuthGuardPrincipal} from '../shared/service/auth.guard-principal';
import {AuthGuardTeacher} from '../shared/service/auth.guard-teacher';
import {AuthGuardParent} from '../shared/service/auth.guard-parent';

const routes: Routes = [
  {path: '', component: SystemComponent,  canActivate: [AuthGuard], children: [
      {path: 'principal', component: PrincipalComponent, canActivate: [AuthGuardPrincipal], children: [
          {path: 'list-students', component: ListStudentsComponent },
          {path: 'register', component: RegisterComponent },
          {path: 'analysis-group', component: AnalysisGroupComponent },
          {path: 'analysis-personal', component: AnalysisPersonalComponent },
          {path: 'teachers', component: TeachersComponent },
          {path: 'parent-access', component: ParentAccessComponent },
          {path: 'class-edition', component: ClassEditionComponent },
          {path: 'years', component: YearsComponent }
        ] },
      {path: 'teacher', component: TeacherLogComponent, canActivate: [AuthGuardTeacher], children: [
          {path: 'list-students', component: ListStudentsComponent },
          {path: 'register', component: RegisterComponent },
          {path: 'analysis-group', component: AnalysisGroupComponent },
          {path: 'analysis-personal', component: AnalysisPersonalComponent },
          {path: 'parent-access', component: ParentAccessComponent }
        ]},
      {path: 'parent', component: ParentLogComponent, canActivate: [AuthGuardParent], children: [
          {path: 'register', component: RegisterComponent },
          {path: 'analysis-personal', component: AnalysisPersonalComponent }
        ] },
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule
  ]
})
export class SystemRoutingModule {}
