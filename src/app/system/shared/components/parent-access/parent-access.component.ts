import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserModel} from '../../../../shared/models/user.model';
import {AuthService} from '../../../../shared/service/auth.service';
import {UsersService} from '../../services/users.service';
import {StudentsService} from '../../services/students.service';
import {Subscription} from 'rxjs';
import {ClassesSubjectsService} from '../../services/classes-subjects.service';
import {YearsService} from '../../services/years.service';
import {YearModel} from '../../../../shared/models/year.model';
import {ClassModel} from '../../../../shared/models/class.model';
import {StudentModel} from '../../../../shared/models/student.model';

@Component({
  selector: 'pst-parent-access',
  templateUrl: './parent-access.component.html',
  styleUrls: ['./parent-access.component.less']
})
export class ParentAccessComponent implements OnInit, OnDestroy {
  subs1: Subscription;
  subs2: Subscription;
  subs3: Subscription;
  subs4: Subscription;
  user: UserModel;
  year: YearModel;
  status: string;
  notconfirmedParent: Array<UserModel> = [];
  parent: Array<UserModel>;
  classes: Array<ClassModel>;
  checkedClass: ClassModel;
  allStudents: Array<StudentModel> = [];
  students: Array<StudentModel> = [];
  isLoad = false;
  openListClasses = false;
  constructor(
    private auth: AuthService,
    private userService: UsersService,
    private yearService: YearsService,
    private classService: ClassesSubjectsService,
    private studentService: StudentsService
  ) { }

  ngOnInit() {
    this.user = this.auth.checkLog();
    this.status = this.auth.checkStatusLog();
    this.subs2 = this.yearService.getYears()
      .subscribe((years: [YearModel]) => {
        this.year = years.find((y) => {
          return y.active === true;
        });
        if (this.year) {
          this.subs3 = this.classService.getClasses().subscribe((classes: [ClassModel]) => {
            this.classes = classes.filter(c => c.year === this.year.id);
            if (this.status === 'teacher') {
              this.classes = this.classes.filter(c => this.user.classes.indexOf(c.id) !== -1);
            }
            if (this.classes[0]) {
              this.checkedClass = this.classes[0];
              this.subs1 = this.userService.getUsers().subscribe((users: [UserModel]) => {
                this.notconfirmedParent = users.filter(u => u.confirm === false && (u.type.indexOf('parent') !== -1));
                this.parent = users.filter(u => u.confirm === true && (u.type.indexOf('parent') !== -1));
                this.subs4 = this.studentService.getStudentsAll()
                  .subscribe((students: [StudentModel]) => {
                    this.allStudents = students;
                    this.selectStudents();
                    this.isLoad = true;
                  });
              });
            }
          });
        }
      });
  }
  selectStudents() {
    this.students = [];
    this.students = this.allStudents.filter(s => this.checkedClass.students.indexOf(s.id) !== -1 );
  }
  /**TOGGLE && CHECK CLASS**/
  toggleListClasses() {
    this.openListClasses = !this.openListClasses;
  }
  checkClass(c: ClassModel) {
    if (c !== this.checkedClass) {
      this.checkedClass = c;
      this.selectStudents();
    }
    this.toggleListClasses();
  }

  ngOnDestroy() {
    if (this.subs1) {
      this.subs1.unsubscribe();
    }
    if (this.subs2) {
      this.subs2.unsubscribe();
    }
    if (this.subs3) {
      this.subs3.unsubscribe();
    }
    if (this.subs4) {
      this.subs4.unsubscribe();
    }
  }
}
