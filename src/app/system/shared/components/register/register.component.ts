import {Component, OnDestroy, OnInit} from '@angular/core';
import {YearsService} from '../../services/years.service';
import {ClassesSubjectsService} from '../../services/classes-subjects.service';
import {StudentsService} from '../../services/students.service';
import {AuthService} from '../../../../shared/service/auth.service';
import {YearModel} from '../../../../shared/models/year.model';
import {Subscription} from 'rxjs';
import {ClassModel} from '../../../../shared/models/class.model';
import {UserModel} from '../../../../shared/models/user.model';
import {SubjectModel} from '../../../../shared/models/subject.model';
import {StudentModel} from '../../../../shared/models/student.model';

@Component({
  selector: 'pst-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.less']
})
export class RegisterComponent implements OnInit, OnDestroy {
  allSubjects: Array<SubjectModel>;
  subs1: Subscription;
  subs2: Subscription;
  subs3: Subscription;
  subs4: Subscription;
  showClasses = false;
  showSemesters = false;
  showSubjects = false;
  statusLog = null;
  user: UserModel;
  year: YearModel;
  classes: Array<ClassModel>;
  subjects: Array<SubjectModel>;
  checkedClass: ClassModel;
  checkedSubject: SubjectModel;
  checkedSemester: number;
  semesters = ['Перший', 'Другий'];
  students: Array<StudentModel> = [];
  isLoad = false;
  nameClass = '';

  constructor(
    private yearService: YearsService,
    private classSubjService: ClassesSubjectsService,
    private studentService: StudentsService,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.statusLog = this.auth.checkStatusLog();
    this.user = this.auth.checkLog();
    this.subs1 = this.yearService.getYears().subscribe((y: [YearModel]) => {
      this.year = y.find(year => year.active === true);
      if (this.year) {
        this.subs2 = this.classSubjService.getClasses().subscribe((cl: [ClassModel]) => {
          if (this.statusLog === 'teacher') {
            const classesId = [];
            for (let i = 0; i < this.user.subjects.length; i++) {
              classesId.push(this.user.subjects[i].class);
            }
            for (let i = 0; i < this.user.classes.length; i++) {
              classesId.push(this.user.classes[i]);
            }
            this.classes = cl.filter(c => {
              return ((c.year === this.year.id) && (classesId.indexOf(c.id) !== -1));
            });
            this.subs3 = this.classSubjService.getSubjects().subscribe((subjects: [SubjectModel]) => {
              this.allSubjects = subjects;
              if (this.classes.length > 0) {
                this.checkedClass = this.classes[0];
                this.reloadDataSubjects();
              }
              this.checkedSemester = this.year.semesters.length - 1;
              // console.log('year', this.year);
              // console.log('user', this.user);
              // console.log('status', this.statusLog);
              // console.log('classes', this.classes);
              // console.log('subjects', this.subjects);
              // console.log('checkedClass', this.checkedClass);
              // console.log('checkedSubject', this.checkedSubject);
            });
          } else if (this.statusLog === 'principal') {
            this.classes = cl.filter(c => {
              return (c.year === this.year.id) ;
            });
            this.subs3 = this.classSubjService.getSubjects().subscribe((subjects: [SubjectModel]) => {
              this.allSubjects = subjects;
              if (this.classes.length > 0) {
                this.checkedClass = this.classes[0];
                this.reloadDataSubjects();
              }
              this.checkedSemester = this.year.semesters.length - 1;
              // console.log('year', this.year);
              // console.log('user', this.user);
              // console.log('status', this.statusLog);
              // console.log('classes', this.classes);
              // console.log('subjects', this.subjects);
              // console.log('checkedClass', this.checkedClass);
              // console.log('checkedSubject', this.checkedSubject);
            });
          } else if (this.statusLog === 'parent') {
            this.subs3 = this.classSubjService.getSubjects().subscribe((subjects: [SubjectModel]) => {
              this.allSubjects = subjects;
              this.subjects = subjects;
              if (this.subjects[0]) {
                this.checkedSubject = this.subjects[0];
              }
              this.checkedSemester = this.year.semesters.length - 1;
              // console.log('year', this.year);
              // console.log('user', this.user);
              // console.log('status', this.statusLog);
              // console.log('classes', this.classes);
              // console.log('subjects', this.subjects);
              // console.log('checkedClass', this.checkedClass);
              // console.log('checkedSubject', this.checkedSubject);
            });
          }
        });
      }
    });
  }
  /**RELOAD**/
  reloadDataSubjects() {
    this.subjects = this.allSubjects.filter(subj => this.checkedClass.subjects.indexOf(subj.key) !== -1);
    if (this.subjects.length > 0) {
      if (this.statusLog === 'teacher') {
        if (this.user.classes.indexOf(this.checkedClass.id) !== -1) {
          if (this.subjects.length > 0) {
            this.checkedSubject = this.subjects[0];
          }
        } else {
          this.subjects = this.subjects.filter((subject ) => {
            for (let i = 0; i < this.user.subjects.length; i++) {
              if (this.user.subjects[i].subject === subject.id && this.user.subjects[i].class === this.checkedClass.id) {
                return true;
              }
            }
            return false;
          });
          if (this.subjects.length > 0) {
            this.checkedSubject = this.subjects[0];
          }
        }
      } else if (this.statusLog === 'principal') {
        this.checkedSubject = this.subjects[0];
      } else {
        this.checkedSubject = null;
      }
    } else {
      this.checkedSubject = null;
    }
  }
  /**TOGGLE BTN**/
  toggleSubjects() {
    this.showSubjects = !this.showSubjects;
  }
  toggleClasses() {
    this.showClasses = !this.showClasses;
  }
  toggleSemesters() {
    this.showSemesters = !this.showSemesters;
  }
  /***CHECKS*/
  checkClass(id) {
    const newCls = this.classes.find(c => c.id === id);
    if (newCls) {
      this.checkedClass = newCls;
    }
    this.reloadDataSubjects();
  }
  checkSubject(id) {
    const newSubj = this.subjects.find(s => s.id === id);
    if (newSubj) {
      this.checkedSubject = newSubj;
    }
  }
  checkSemester(i) {
    this.checkedSemester = i;
  }
  getCorrectStudents() {
    this.isLoad = false;
    this.students = [];
    if (this.statusLog === 'parent') {
      this.loadChildren();
    } else {
      if (this.checkedClass.students.length > 0) {
        this.loadStudents();
      }
    }
  }
  loadStudents() {
      this.subs4 = this.studentService.getStudent(this.checkedClass.students[this.students.length]).subscribe(s => {
        this.students.push(s);
        if (this.subs4) {
          this.subs4.unsubscribe();
        }
        if (this.students.length < this.checkedClass.students.length) {
          this.loadStudents();
        } else {
          this.isLoad = true;
          this.nameClass = this.checkedClass.name;
        }
      });
  }
  loadChildren() {
    if (this.students.length < this.user.access.length) {
      this.subs4 = this.studentService.getStudent(this.user.access[this.students.length]).subscribe(s => {
        this.students.push(s);
        if (this.subs4) {
          this.subs4.unsubscribe();
        }
        this.loadChildren();
      });
    } else {
        this.isLoad = true;
        this.nameClass = 'Діти';
    }
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
