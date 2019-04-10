import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {YearModel} from '../../../../../shared/models/year.model';
import {NgForm} from '@angular/forms';
import {ClassesSubjectsService} from '../../../services/classes-subjects.service';
import {Subscription} from 'rxjs';
import {MessageModel} from '../../../../../shared/models/message.model';
import {ClassModel} from '../../../../../shared/models/class.model';
import {StudentsService} from '../../../services/students.service';
import {StudentModel} from '../../../../../shared/models/student.model';

@Component({
  selector: 'pst-classes-card',
  templateUrl: './classes-card.component.html',
  styleUrls: ['./classes-card.component.less']
})
export class ClassesCardComponent implements OnInit, OnDestroy {
  subs1: Subscription;
  subs2: Subscription;
  subs3: Subscription;
  subs4: Subscription;
  message: MessageModel;
  @Output() edited = new EventEmitter();
  @Input() classes: Array<ClassModel>;
  @Input() subjects: Array<{key, name, id}>;
  @Input() year: YearModel;
  correctClasses: Array<ClassModel> = [];
  openEditClasses = false;
  openDeleteClass = false;
  checkedClass: ClassModel;
  students: Array<StudentModel> = [];
  isFinal = true;

  constructor(private servService: ClassesSubjectsService, private studentService: StudentsService) {
    this.message = new MessageModel('');
  }

  ngOnInit() {
      for (let i = 0; i < this.classes.length; i++) {
        if (this.classes[i].year === this.year.id ) {
          this.correctClasses.push( this.classes[i] );
        }
    }
  }

  isIncludeSubject(key) {
    return Boolean(this.checkedClass.subjects.indexOf(key) !== -1);
  }
  editClass(id: number) {
    this.checkedClass = this.correctClasses.find(c => c.id === id);
    this.openEditClasses = true;
  }
  editCancelClass() {
    this.openEditClasses = false;
    this.checkedClass = null;
  }
  editClassSubmit(form: NgForm) {
    const data: {nameClass} = form.value;
    if (this.checkedClass.name === data['nameClass'] || !this.classes.find(c => c.name === data['nameClass'])) {
      this.checkedClass.name = data['nameClass'];
      const newSubjects = [];
      for (const key in data) {
        if (!(key === 'nameClass')) {
          if (data[key] === true) {
            newSubjects.push(key);
          }
        }
      }
      this.checkedClass.subjects = newSubjects;
      this.isFinal = false;
      this.subs1 = this.servService.putClass(this.checkedClass.id, this.checkedClass).subscribe((response: ClassModel) => {
        this.edited.emit({
          isDel: false,
          class: response
        });
        if (response.students.length > 0) {
          this.students = [];
          this.getStudents(response);
        }
      });
    } else {
      this.message = new MessageModel('Клас із такою назвою уже існує', 'danger');
      setTimeout(() => {
        this.message.message = '';
      }, 5000);
    }
  }
  getStudents(classUpdate: ClassModel) {
    this.subs3 = this.studentService.getStudent(classUpdate.students[this.students.length]).subscribe((s: StudentModel) => {
      for (const sub of classUpdate.subjects) {
        const isSub = s.register.find(r => r.subject === sub);
        if (!isSub) {
          s.register.push({
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
      this.students.push(s);
      if (this.subs3) {
        this.subs3.unsubscribe();
      }
      if (this.students.length < classUpdate.students.length) {
        this.getStudents(classUpdate);
      } else {
        if (this.students.length > 0) {
          this.putStudents();
        }
      }
    });
  }
  putStudents() {
    this.subs4 = this.studentService.putStudent(this.students[this.students.length - 1].id, this.students[this.students.length - 1])
      .subscribe((s) => {
      this.students.pop();
      if (this.subs4) {
        this.subs4.unsubscribe();
      }
      if (this.students.length > 0) {
        this.putStudents();
      } else {
        this.isFinal = true;
        this.editCancelClass();
      }
    });
  }
  /**DELETE**/
  deleteClassOpen(id) {
    this.checkedClass = this.correctClasses.find(c => c.id === id);
    this.openDeleteClass = true;
  }
  deleteClassCancel() {
    this.openDeleteClass = false;
    this.checkedClass = null;
  }
  deleteClassSubmit() {
    if (this.checkedClass) {
      if (this.checkedClass.students.length > 0) {
        const mess = 'Перед видаленнм класу необхідно усіх учнів перевести в інший клас, або видалити';
        this.message = new MessageModel(mess, 'danger');
        setTimeout(() => {
          this.message.message = '';
        }, 5000);
        return;
      }
      const needDel = this.checkedClass;
      this.subs2 = this.servService.deleteClass(this.checkedClass.id).subscribe((res) => {
        this.edited.emit({
          isDel: true,
          class: needDel
        });
      });
      for (let i = 0; i < this.correctClasses.length; i++) {
        if (this.checkedClass.key === this.correctClasses[i].key) {
          this.correctClasses.splice(i, 1);
          break;
        }
      }
    }
    this.deleteClassCancel();
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
