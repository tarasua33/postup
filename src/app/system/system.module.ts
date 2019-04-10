import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SharedModule} from '../shared/shared.module';
import {SystemComponent} from './system.component';
import {SystemRoutingModule} from './system-routing.module';
import { PrincipalComponent } from './principal/principal.component';
import {HeaderSystemComponent} from './header-system/header-system.component';
import { ListStudentsComponent } from './shared/components/list-students/list-students.component';
import { RegisterComponent } from './shared/components/register/register.component';
import { AnalysisGroupComponent } from './shared/components/analysis-group/analysis-group.component';
import { AnalysisPersonalComponent } from './shared/components/analysis-personal/analysis-personal.component';
import { TeachersComponent } from './shared/components/teachers/teachers.component';
import { ClassEditionComponent } from './shared/components/class-edition/class-edition.component';
import { YearsComponent } from './shared/components/years/years.component';
import { ParentAccessComponent } from './shared/components/parent-access/parent-access.component';
import {YearsService} from './shared/services/years.service';
import { ClassesCardComponent } from './shared/components/class-edition/classes-card/classes-card.component';
import { SubjectsCardComponent } from './shared/components/class-edition/subjects-card/subjects-card.component';
import {ClassesSubjectsService} from './shared/services/classes-subjects.service';
import { RequestTeacherCardComponent } from './shared/components/teachers/request-teacher-card/request-teacher-card.component';
import { ClassTeacherCardComponent } from './shared/components/teachers/class-teacher-card/class-teacher-card.component';
import { ListTeacherCardComponent } from './shared/components/teachers/list-teacher-card/list-teacher-card.component';
import {UsersService} from './shared/services/users.service';
import {StudentsService} from './shared/services/students.service';
import { StudentsCardComponent } from './shared/components/list-students/students-card/students-card.component';
import { ListRegisterCardComponent } from './shared/components/register/list-register-card/list-register-card.component';
import { SuccessChartComponent } from './shared/components/analysis-group/success-chart/success-chart.component';
import { LavelChartComponent } from './shared/components/analysis-group/lavel-chart/lavel-chart.component';
import { LavelEachstudChartComponent } from './shared/components/analysis-group/lavel-eachstud-chart/lavel-eachstud-chart.component';
import { MiddleRateStudentComponent } from './shared/components/analysis-personal/middle-rate-student/middle-rate-student.component';
import { GraphRateStudSubComponent } from './shared/components/analysis-personal/graph-rate-stud-sub/graph-rate-stud-sub.component';
import { NotconfirmedParentComponent } from './shared/components/parent-access/notconfirmed-parent/notconfirmed-parent.component';
import { ListParentComponent } from './shared/components/parent-access/list-parent/list-parent.component';
import { ParentTeacherComponent } from './shared/components/teachers/parent-teacher/parent-teacher.component';
import { TeacherLogComponent } from './teacher-log/teacher-log.component';
import { ParentLogComponent } from './parent-log/parent-log.component';


@NgModule({
  declarations: [
    SystemComponent,
    HeaderSystemComponent,
    PrincipalComponent,
    ListStudentsComponent,
    RegisterComponent,
    AnalysisGroupComponent,
    AnalysisPersonalComponent,
    TeachersComponent,
    ClassEditionComponent,
    YearsComponent,
    ParentAccessComponent,
    ClassesCardComponent,
    SubjectsCardComponent,
    RequestTeacherCardComponent,
    ClassTeacherCardComponent,
    ListTeacherCardComponent,
    StudentsCardComponent,
    ListRegisterCardComponent,
    SuccessChartComponent,
    LavelChartComponent,
    LavelEachstudChartComponent,
    MiddleRateStudentComponent,
    GraphRateStudSubComponent,
    NotconfirmedParentComponent,
    ListParentComponent,
    ParentTeacherComponent,
    TeacherLogComponent,
    ParentLogComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    SystemRoutingModule
  ],
  providers: [
    YearsService,
    ClassesSubjectsService,
    UsersService,
    StudentsService
  ]
})
export class SystemModule {}
