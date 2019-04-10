import {Component, Input, OnDestroy } from '@angular/core';
import {StudentModel} from '../../../../../shared/models/student.model';
import {SubjectModel} from '../../../../../shared/models/subject.model';
import {NgForm} from '@angular/forms';
import {StudentsService} from '../../../services/students.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'pst-list-register-card',
  templateUrl: './list-register-card.component.html',
  styleUrls: ['./list-register-card.component.less']
})
export class ListRegisterCardComponent implements OnDestroy {
  subs1: Subscription;
  @Input() students: Array<StudentModel>;
  @Input() checkedSubject: SubjectModel;
  @Input() checkedSemester: number;
  @Input() nameClass: string;
  @Input() statusLog: string;
  semesters = ['semesterOne', 'semesterSecond'];
  openChangeRegister = false;
  openAddRegister = false;
  checkedStudent: StudentModel;

  constructor(
    private studentService: StudentsService
  ) { }
  getIndex(student: StudentModel) {
    for (let i = 0; i < student.register.length; i++) {
      if (student.register[i].subject === this.checkedSubject.key) {
        return i;
      }
    }
  }
  getSemester() {
    return this.semesters[this.checkedSemester];
  }
  isRegister(student: StudentModel) {
    for (let i = 0; i < student.register.length; i++) {
      if (student.register[i].subject === this.checkedSubject.key) {
        return true;
      }
    }
    return false;
  }
  /**CHANGE**/
  changeRegisterOpen(student: StudentModel) {
    this.checkedStudent = student;
    this.openChangeRegister = true;
  }
  changeRegisterCancel() {
    this.openChangeRegister = false;
    this.checkedStudent = null;
  }
  deleteNumber(i) {
    const index = this.getIndex(this.checkedStudent);
    this.checkedStudent.register[index][this.getSemester()].rates.splice(i, 1);
  }
  changeRegisterSubmit(form: NgForm) {
    if (this.statusLog === 'parent') {
      return;
    }
    const index = this.getIndex(this.checkedStudent);
    this.checkedStudent.register[index][this.getSemester()].rates = [];
    let final = 0;
    let count = 0;
    for (const key in form.value) {
      if (this.checkedStudent) {
        const val = +form.value[key] > 12 ? 12 : +form.value[key] < 1 ? 1 : +form.value[key];
        final = final + val;
        count ++ ;
        this.checkedStudent.register[index][this.getSemester()].rates.push(val);
      }
    }
    if (count > 0) {
      this.checkedStudent.register[index][this.getSemester()].final = Math.round(final / count );
    } else {
      this.checkedStudent.register[index][this.getSemester()].final = 1;
    }
    this.subs1 = this.studentService.putStudent(this.checkedStudent.id, this.checkedStudent).subscribe((st) => {
      this.changeRegisterCancel();
    });
  }
  /**ADD**/
  addRegisterOpen(student: StudentModel) {
    this.checkedStudent = student;
    this.openAddRegister = true;
  }
  addRegisterCancel() {
    this.openAddRegister = false;
    this.checkedStudent = null;
  }
  addRegisterSubmit(form: NgForm) {
    if (this.statusLog === 'parent') {
      return;
    }
    const index = this.getIndex(this.checkedStudent);
    const rates = this.checkedStudent.register[index][this.getSemester()].rates;
    const val = +form.value['newValue'] > 12 ? 12 : +form.value['newValue'] < 1 ? 1 : +form.value['newValue'];
    rates.push(val);
    let final = 0;
    for (const numb of rates) {
      final += numb;
    }
    const len = rates.length;
    if (len > 0) {
      this.checkedStudent.register[index][this.getSemester()].final = Math.round(final / len);
    } else {
      this.checkedStudent.register[index][this.getSemester()].final = 1;
    }
    this.subs1 = this.studentService.putStudent(this.checkedStudent.id, this.checkedStudent).subscribe((st) => {
      this.addRegisterCancel();
    });
  }

  ngOnDestroy() {
    if (this.subs1) {
      this.subs1.unsubscribe();
    }
  }
}
