import {Component, OnDestroy, OnInit} from '@angular/core';
import {ClassesSubjectsService} from '../../services/classes-subjects.service';
import {ClassModel} from '../../../../shared/models/class.model';
import {Subscription} from 'rxjs';
import {YearsService} from '../../services/years.service';
import {YearModel} from '../../../../shared/models/year.model';
import {StudentsService} from '../../services/students.service';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {StudentModel} from '../../../../shared/models/student.model';
import {AuthService} from '../../../../shared/service/auth.service';
import {UserModel} from '../../../../shared/models/user.model';
import {UsersService} from '../../services/users.service';

@Component({
  selector: 'pst-list-students',
  templateUrl: './list-students.component.html',
  styleUrls: ['./list-students.component.less']
})
export class ListStudentsComponent implements OnInit, OnDestroy {
  sub1: Subscription;
  sub2: Subscription;
  sub3: Subscription;
  sub4: Subscription;
  sub5: Subscription;
  sub6: Subscription;
  parents: Array<UserModel> = [];
  classes: Array<ClassModel> = [];
  checkedClass: ClassModel;
  year: YearModel;
  openClassList = false;
  students: Array<StudentModel> = [];
  allStudents: Array<StudentModel>;
  user: UserModel;
  /**ADD STUDENT**/
  openAddStudent = false;
  form: FormGroup;
  /**CARD**/
  isLoadedStudents = false;

  constructor(
    private classSubjService: ClassesSubjectsService,
    private yearService: YearsService,
    private studetsService: StudentsService,
    private userService: UsersService,
    private auth: AuthService
  ) { }

  ngOnInit() {
    const status = this.auth.checkStatusLog();
    this.user = this.auth.checkLog();
    this.sub1 = this.yearService.getYears().subscribe( (r1: [YearModel]) => {
      this.year = r1.find(y => y.active === true);
      if (this.year) {
        this.sub6 = this.userService.getUsers().subscribe((users: [UserModel]) => {
          for (let i = 0; i < users.length; i++) {
            if (users[i].type.indexOf('parent') !== -1) {
              this.parents.push(users[i]);
            }
          }
          this.sub2 = this.classSubjService.getClasses().subscribe((r2: [ClassModel]) => {
            for (let i = 0; i < r2.length; i++) {
              if (r2[i].year === this.year.id) {
                if (status === 'teacher') {
                  if (this.user.classes.indexOf(r2[i].id) !== -1) {
                    this.classes.push(r2[i]);
                  }
                } else {
                  this.classes.push(r2[i]);
                }
              }
            }
            if (this.classes[0]) {
              this.checkedClass = this.classes[0];
              this.sub3 = this.studetsService.getStudentsAll().subscribe((students: [StudentModel]) => {
                this.allStudents = students;
                this.loadStudent();
              });
            }
          });
        });
      }
    });
    this.form = new FormGroup({
      'secondName': new FormControl('', [Validators.required, Validators.minLength(3)]),
      'firstName': new FormControl('', [Validators.required, Validators.minLength(3)]),
      'middleName': new FormControl('', [Validators.required, Validators.minLength(3)]),
      'birthday': new FormControl(null, [Validators.required]),
      'place': new FormControl('', [Validators.required]),
      'phones': new FormArray([
        new FormControl(0, [Validators.required])
      ])
    });
  }
  loadStudent() {
    this.students = [];
    if (this.checkedClass) {
      this.students = this.allStudents.filter((st: StudentModel) => this.checkedClass.students.indexOf(st.id) !== -1);
      setTimeout(() => {
        this.isLoadedStudents = true;
      }, 100);
    }
  }
  /**EDIT**/
  editStudent(e: {isDel: boolean, isChangeClass: boolean, st: StudentModel, clOld: ClassModel, clNew: ClassModel}) {
    if (e.isDel) {
      for (let i = 0; i < this.students.length; i++) {
        if (this.students[i].id === e.st.id) {
          this.students.splice(i, 1);
          break;
        }
      }
      for (let i = 0; i < this.classes.length; i++) {
        if (this.classes[i].id === e.clOld.id) {
          this.classes[i] = e.clOld;
          break;
        }
      }
    } else {
      for (let i = 0; i < this.students.length; i++) {
        if (this.students[i].id === e.st.id) {
          this.students[i] = e.st;
          break;
        }
      }
    }
  }
  /**ADD PHONE STUD**/
  addPhone() {
    if ((<FormArray>this.form.controls['phones']).length < 3) {
      (<FormArray>this.form.controls['phones']).push(new FormControl(0, [Validators.required]));
    }
  }
  /**ADD STUDENT**/
  addStudentBtn() {
    this.openAddStudent = true;
  }
  addStudentBtnCancel() {
    this.openAddStudent = false;
  }
  addStudentBtnSubmit() {
    const register = [];
    for (let i = 0; i < this.checkedClass.subjects.length; i++) {
      register.push({
        'subject': this.checkedClass.subjects[i],
            'semesterOne': {
              'rates': [],
              'final': 0
            },
            'semesterSecond': {
              'rates': [],
              'final': 0
            }
      });
    }
    const name = this.form.value['secondName'] + ' ' + this.form.value['firstName'] + ' ' + this.form.value['middleName'];
    const student = new StudentModel(
      name,
      this.form.value['place'],
      this.form.value['birthday'],
      register,
      this.form.value['phones']
      );
    const classActive = this.checkedClass;
    this.sub4 = this.studetsService.postStudent(student).subscribe((s: StudentModel) => {
      this.students.push(s);
      classActive.students.push(s.id);
      this.sub5 = this.classSubjService.putClass(classActive.id, classActive).subscribe((c) => {
      });
    });
    this.form.reset();
    this.addStudentBtnCancel();
  }
  /**CHANGE CLASS**/
  toggleClassListBtn() {
    this.openClassList = !this.openClassList;
  }
  checkThisClass(cl: ClassModel) {
    if (this.checkedClass !== cl) {
      this.checkedClass = cl;
      this.isLoadedStudents = false;
      this.loadStudent();
      this.toggleClassListBtn();
    }
  }
  ngOnDestroy() {
    if (this.sub1) {
      this.sub1.unsubscribe();
    }
    if (this.sub2) {
      this.sub2.unsubscribe();
    }
    if (this.sub3) {
      this.sub3.unsubscribe();
    }
    if (this.sub4) {
      this.sub4.unsubscribe();
    }
    if (this.sub5) {
      this.sub5.unsubscribe();
    }
    if (this.sub6) {
      this.sub6.unsubscribe();
    }
  }
}
