import {Component, OnDestroy, OnInit} from '@angular/core';
import {UsersService} from '../../services/users.service';
import {Subscription} from 'rxjs';
import {UserModel} from '../../../../shared/models/user.model';
import {YearsService} from '../../services/years.service';
import {ClassesSubjectsService} from '../../services/classes-subjects.service';
import {YearModel} from '../../../../shared/models/year.model';
import {ClassModel} from '../../../../shared/models/class.model';

@Component({
  selector: 'pst-teachers',
  templateUrl: './teachers.component.html',
  styleUrls: ['./teachers.component.less']
})
export class TeachersComponent implements OnInit, OnDestroy {
  subs1: Subscription;
  subs2: Subscription;
  subs3: Subscription;
  subs4: Subscription;
  teachers: Array<UserModel> = [];
  unconfirmedTeachers: Array<UserModel> = [];
  year: YearModel;
  classes: Array<ClassModel> = [];
  subjects = [];
  isLoad = false;

  constructor(
    private usersService: UsersService,
    private yearsService: YearsService,
    private classSubjService: ClassesSubjectsService
  ) { }
  ngOnInit() {
    this.subs1 = this.usersService.getUsers().subscribe((response: [UserModel]) => {
      for (let i = 0; i < response.length; i++) {
        if (response[i].type.indexOf('teacher') !== -1) {
          if (response[i].confirm) {
            this.teachers.push(response[i]);
          } else {
            this.unconfirmedTeachers.push(response[i]);
          }
        }
      }
      this.subs2 = this.yearsService.getYears().subscribe((res: [YearModel]) => {
        this.year = res.find(y => y.active === true );
        this.subs3 = this.classSubjService.getClasses().subscribe((resp: [ClassModel]) => {
          for (let i = 0; i < resp.length; i++) {
            if (resp[i].year === this.year.id) {
              this.classes.push(resp[i]);
            }
          }
          this.subs4 = this.classSubjService.getSubjects().subscribe((s) => {
            this.subjects = s;
            this.isLoad = true;
          });
        });
      });
    });
  }
  confirmSubmitted(e: {isConfirm, t}) {
    for (let i = 0; i < this.unconfirmedTeachers.length; i++) {
      if (this.unconfirmedTeachers[i].id === e.t.id) {
        this.unconfirmedTeachers.splice(i, 1);
        break;
      }
    }
    if (e.isConfirm) {
      this.teachers.push(e.t);
    }
  }
  teacherEdit(e: {edited, t: UserModel}) {
    if (e.edited) {
      for (let i = 0; i < this.teachers.length; i++ ) {
        if (this.teachers[i].id === e.t.id) {
          this.teachers[i] = e.t;
          console.log('okay - change');
          break;
        }
      }
    }
  }

  ngOnDestroy() {
    if (this.subs1) {
      this.subs1.unsubscribe();
    }
    if (this.subs4) {
      this.subs4.unsubscribe();
    }
    if (this.subs3) {
      this.subs3.unsubscribe();
    }
    if (this.subs2) {
      this.subs2.unsubscribe();
    }
  }
}
