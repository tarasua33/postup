import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {UserModel} from '../../../../shared/models/user.model';
import {YearModel} from '../../../../shared/models/year.model';
import {ClassModel} from '../../../../shared/models/class.model';
import {StudentModel} from '../../../../shared/models/student.model';
import {SubjectModel} from '../../../../shared/models/subject.model';
import {YearsService} from '../../services/years.service';
import {ClassesSubjectsService} from '../../services/classes-subjects.service';
import {AuthService} from '../../../../shared/service/auth.service';
import {StudentsService} from '../../services/students.service';

@Component({
  selector: 'pst-analysis-personal',
  templateUrl: './analysis-personal.component.html',
  styleUrls: ['./analysis-personal.component.less']
})
export class AnalysisPersonalComponent implements OnInit, OnDestroy {
  subs1: Subscription;
  subs2: Subscription;
  subs3: Subscription;
  subs4: Subscription;
  user: UserModel;
  statusLog: string;
  year: YearModel;
  classes: Array<ClassModel> = [];
  checkedClass: ClassModel;
  students: Array<StudentModel> = [];
  checkedStudent: StudentModel;
  subjects: Array<SubjectModel> = [];
  isLoad = false;
  checkedSemester = 0;
  semesters = ['Перший', 'Другий', 'За рік'];
  openListSemesters = false;
  openListClasses = false;
  openListStudents = false;
  isParent = false;
  constructor(
    private yearService: YearsService,
    private classSubjService: ClassesSubjectsService,
    private auth: AuthService,
    private studentService: StudentsService
  ) { }

  ngOnInit() {
    this.user = this.auth.checkLog();
    this.statusLog = this.auth.checkStatusLog();
    this.subs1 = this.yearService.getYears().subscribe((years: [YearModel]) => {
      this.year = years.find(y => y.active === true);
      if (this.year) {
        if (this.statusLog === 'teacher') {
          this.subs2 = this.classSubjService.getClasses().subscribe((classes: [ClassModel]) => {
            const actualClasses = classes.filter(c => c.year === this.year.id);
            if (actualClasses.length > 0) {
              this.classes = actualClasses.filter(c => this.user.classes.indexOf(c.id) !== -1);
              for (let j = 0; j < this.user.subjects.length; j++) {
                const cl = this.classes.find(c => c.id === this.user.subjects[j].class);
                if (!cl) {
                  const cl2 = actualClasses.find(c => c.id === this.user.subjects[j].class);
                  if (cl2) {
                    this.classes.push(cl2);
                  }
                }
              }
              if (this.classes[0]) {
                this.checkedClass = this.classes[0];
              }
              this.updateStudents();
            }
          });
        } else if (this.statusLog === 'principal') {
          this.subs2 = this.classSubjService.getClasses().subscribe((classes: [ClassModel]) => {
            this.classes = classes.filter(c => c.year === this.year.id);
            if (this.classes[0]) {
              this.checkedClass = this.classes[0];
            }
            this.updateStudents();
          });
        } else if (this.statusLog === 'parent') {
          this.isParent = true;
          this.isLoad = false;
          this.students = [];
          if (this.user && this.user.access && this.students.length < this.user.access.length) {
            this.getChildren();
          }
        }
      }
    });
  }
  updateStudents() {
    this.isLoad = false;
    this.students = [];
    if (this.students.length < this.checkedClass.students.length) {
      this.getStudents();
    }
  }
  getChildren() {
    if (this.user && this.user.access.length > 0) {
      this.subs3 = this.studentService.getStudent(this.user.access[this.students.length])
        .subscribe((child: StudentModel) => {
          this.students.push(child);
          if (this.students.length < this.user.access.length) {
            this.getChildren();
          } else {
            this.subs4 = this.classSubjService.getSubjects().subscribe( (subjects: [SubjectModel] ) => {
              this.subjects = subjects;
              if (this.students[0]) {
                this.checkedStudent = this.students[0];
              }
              this.isLoad = true;
            });
          }
        });
    }
  }
  getStudents() {
    if (this.checkedClass) {
      this.subs3 = this.studentService.getStudent(this.checkedClass.students[this.students.length])
        .subscribe((students: StudentModel) => {
          this.students.push(students);
          if (this.students.length < this.checkedClass.students.length) {
            this.getStudents();
          } else {
            this.subs4 = this.classSubjService.getSubjects().subscribe( (subjects: [SubjectModel] ) => {
              this.subjects = subjects.filter(s => this.checkedClass.subjects.indexOf(s.key) !== -1);
              if (this.students[0]) {
                this.checkedStudent = this.students[0];
              }
              this.isLoad = true;
            });
          }
        });
    }
  }
  /**TOGGLE LISTS**/
  toggleSemester() {
    this.openListSemesters = !this.openListSemesters;
  }
  toggleClasses() {
    this.openListClasses = !this.openListClasses;
  }
  toggleStudents() {
    this.openListStudents = !this.openListStudents;
  }
  /**CHECKS**/
  checkClass(cl: ClassModel) {
    if (this.checkedClass !== cl) {
      this.checkedClass = cl;
      this.updateStudents();
    }
    this.toggleClasses();
  }
  checkSemester(n) {
    if (n !== this.checkedSemester) {
      this.checkedSemester = n;
    }
    this.toggleSemester();
  }
  checkStudent(st: StudentModel) {
    if (this.checkedStudent !== st) {
      this.checkedStudent = st;
    }
    this.toggleStudents();
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
