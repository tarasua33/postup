import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {StudentModel} from '../../../../../shared/models/student.model';
import { NgForm} from '@angular/forms';
import {MessageModel} from '../../../../../shared/models/message.model';
import {StudentsService} from '../../../services/students.service';
import {Subscription} from 'rxjs';
import {ClassModel} from '../../../../../shared/models/class.model';
import {ClassesSubjectsService} from '../../../services/classes-subjects.service';
import {UsersService} from '../../../services/users.service';
import {UserModel} from '../../../../../shared/models/user.model';

@Component({
  selector: 'pst-students-card',
  templateUrl: './students-card.component.html',
  styleUrls: ['./students-card.component.less']
})
export class StudentsCardComponent implements OnInit, OnDestroy {
  subs1: Subscription;
  subs2: Subscription;
  subs3: Subscription;
  subs4: Subscription;
  subs5: Subscription;
  subs6: Subscription;
  @Input() students: Array<StudentModel>;
  @Input() checkedClass: ClassModel;
  @Input() classes: Array<ClassModel>;
  @Input() parents: Array<UserModel>;
  @Output() edit = new EventEmitter();
  openEditStudent = false;
  openDeleteStudent = false;
  openChangeClass = false;
  checkedStudent: StudentModel;
  newPhone = null;
  message: MessageModel;
  isFinal = true;
  idListStudents = [];
  parentsThisClass: Array<UserModel> = [];
  formReady = true;

  constructor(
    private studentService: StudentsService,
    private classService: ClassesSubjectsService
  ) {
    this.message = new MessageModel('');
  }
  ngOnInit() {
    for (const st of this.students) {
      this.idListStudents.push(st.id);
    }
    for (const par of this.parents) {
      for (const id of par.access) {
        if (this.idListStudents.indexOf(id) !== -1) {
          this.parentsThisClass.push(par);
          break;
        }
      }
    }
  }

  getNameParents(st: StudentModel) {
    let name = '';
    for (const par of this.parentsThisClass) {
      if (par.access.indexOf(st.id) !== -1) {
        name = name + ' ' + par.name;
      }
    }
    return name;
  }
  getRating(st: StudentModel) {
    let rating = 100;
    let sum = 0;
    let count = 0;
    for (let i = 0; i < st.register.length; i++) {
      for (let j = 0; j < st.register[i].semesterOne.rates.length; j++) {
        sum += st.register[i].semesterOne.rates[j];
        count++;
      }
      for (let j = 0; j < st.register[i].semesterSecond.rates.length; j++) {
        sum += st.register[i].semesterSecond.rates[j];
        count++;
      }
    }
    if (count === 0) {
      return rating;
    }
    rating = Math.round((sum * 100) / (count * 12));
    if (rating < 10) {
      return 10;
    }
    return rating;
  }
  addPhone() {
    if (this.checkedStudent.contacts.length < 3) {
      if (String(this.newPhone).length > 4) {
        this.checkedStudent.contacts.push(this.newPhone);
        this.newPhone = null;
        this.message = new MessageModel('Телефонний номер додано', 'success');
        setTimeout(() => {
          this.message.message = '';
        }, 5000);
      } else {
        this.message = new MessageModel('Номер телефону повинен містити мінімум 4 символи', 'danger');
        setTimeout(() => {
          this.message.message = '';
        }, 5000);
      }
    } else {
      this.message = new MessageModel('Кількість контактів не повинна перевищувати 3', 'danger');
      setTimeout(() => {
        this.message.message = '';
      }, 5000);
    }
  }
  deletePhone(i) {
    this.checkedStudent.contacts.splice(i, 1);
    this.message = new MessageModel('Телефонний номер видалено', 'success');
    setTimeout(() => {
      this.message.message = '';
    }, 5000);
  }
  /**EDIT STUDENT**/
  editStudentOpen(id) {
    this.checkedStudent = this.students.find(s => s.id === id);
    this.openEditStudent = true;
  }
  editStudentSubmit(form: NgForm) {
    this.checkedStudent.name = form.value['name'].trim();
    this.checkedStudent.place = form.value['place'];
    this.checkedStudent.date = form.value['date'];
    this.formReady = false;
    this.subs1 = this.studentService.putStudent(this.checkedStudent.id, this.checkedStudent).subscribe((s: StudentModel) => {
      this.edit.emit({
        isDel: false,
        isChangeClass: false,
        st: s,
        clOld: null,
        clNew: null
      });
      this.formReady = true;
    });
    form.reset();
    this.editStudentCancel();
  }
  editStudentCancel() {
    this.openEditStudent = false;
    this.checkedStudent = null;
  }
  /**DELETE STUDENT**/
  deleteStudentOpen(id) {
    this.checkedStudent = this.students.find(s => s.id === id);
    if (this.checkedStudent) {
      this.openDeleteStudent = true;
    }
  }
  deleteStudentCancel() {
    this.openDeleteStudent = false;
    this.checkedStudent = null;
  }
  deleteStudentSubmit() {
    this.formReady = false;
    for (let i = 0; i < this.checkedClass.students.length; i++) {
      if (this.checkedClass.students[i] === this.checkedStudent.id) {
        this.checkedClass.students.splice(i, 1);
        this.subs2 = this.classService.putClass(this.checkedClass.id, this.checkedClass).subscribe((respClass) => {
          for (let j = 0; j < this.students.length; j++) {
            if (this.students[j].id === this.checkedStudent.id) {
              this.students.splice(j, 1);
              break;
            }
          }
          this.subs3 = this.studentService.deleteStudent(this.checkedStudent.id).subscribe((response) => {
            this.formReady = true;
            this.deleteStudentCancel();
          });
        });
        break;
      }
    }
  }
  /**ChangeCLASS**/
  changeClassOpen(id) {
    this.checkedStudent = this.students.find(s => s.id === id);
    if (this.checkedStudent) {
      this.openChangeClass = true;
    }
  }
  changeClassSubmit(form: NgForm) {
    const idNewClass = +form.value['newClass'];
    if ( idNewClass === this.checkedClass.id) {
      this.message = new MessageModel('Учень вже навчається в цьому класі!', 'danger');
      setTimeout(() => {
        this.message.message = '';
      }, 5000);
    } else {
      this.formReady = false;
      const ind = this.checkedClass.students.indexOf(this.checkedStudent.id);
      if (ind !== -1) {
        this.checkedClass.students.splice(ind, 1);
      }
      const oldClass = this.checkedClass;
      const newClass = this.classes.find(c => c.id === idNewClass);
      for (const sub of newClass.subjects) {
        const isSub = this.checkedStudent.register.find(r => r.subject === sub);
        if (!isSub) {
          this.checkedStudent.register.push({
            'subject': sub,
            'semesterOne': {
              // @ts-ignore
              'rates': [],
              'final': 0
            },
            'semesterSecond': {
              // @ts-ignore
              'rates': [],
              'final': 0
            }
          });
        }
      }
      if (newClass.students.indexOf(this.checkedStudent.id) === -1) {
        newClass.students.push(this.checkedStudent.id);
      }
      for (let i = 0; i < this.students.length; i++) {
        if (this.students[i].id === this.checkedStudent.id) {
          this.students.splice(i, 1);
          break;
        }
      }
      this.isFinal = false;
      this.formReady = false;
      this.subs4 = this.classService.putClass(newClass.id, newClass).subscribe((resp) => {
        if (this.subs4) {
          this.subs4.unsubscribe();
        }
        this.subs4 = this.classService.putClass(oldClass.id, oldClass).subscribe(res => {
          this.subs5 = this.studentService.putStudent(this.checkedStudent.id, this.checkedStudent)
            .subscribe(stud => {
              this.formReady = true;
              this.isFinal = true;
              this.changeClassCancel();
            });
        });
      });
    }
  }
  changeClassCancel() {
    this.openChangeClass = false;
    this.checkedStudent = null;
  }
  /**DELETE PARENT STATUS**/

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
    if (this.subs5) {
      this.subs5.unsubscribe();
    }
    if (this.subs6) {
      this.subs6.unsubscribe();
    }
  }
}
