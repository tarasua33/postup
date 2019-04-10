import {Component, OnDestroy, OnInit} from '@angular/core';
import {ClassesSubjectsService} from '../../services/classes-subjects.service';
import {Subscription} from 'rxjs';
import {YearModel} from '../../../../shared/models/year.model';
import {YearsService} from '../../services/years.service';
import {NgForm} from '@angular/forms';
import {ClassModel} from '../../../../shared/models/class.model';
import {MessageModel} from '../../../../shared/models/message.model';
import {SubjectModel} from '../../../../shared/models/subject.model';

@Component({
  selector: 'pst-class-edition',
  templateUrl: './class-edition.component.html',
  styleUrls: ['./class-edition.component.less']
})
export class ClassEditionComponent implements OnInit, OnDestroy {
  subs1: Subscription;
  subs2: Subscription;
  subs3: Subscription;
  subs4: Subscription;

  subs6: Subscription;
  subjects = [];
  classes: Array<ClassModel> = [];
  year: YearModel;
  openAddClasses = false;
  openAddSubject = false;
  message: MessageModel;
  constructor(
    private servService: ClassesSubjectsService,
    private yearService: YearsService
  ) {
    this.message = new MessageModel('');
  }

  ngOnInit() {
    this.subs1 = this.servService.getSubjects().subscribe((response) => {
      this.subjects = response;
      this.subs2 = this.servService.getClasses().subscribe((resp) => {
        this.classes = resp;
        this.subs3 = this.yearService.getYears().subscribe((respYear: [YearModel]) => {
          this.year = respYear.find((y) => {
            return y.active === true;
          });
        });
      });
    });
  }
  addClassOpen() {
    if (this.year) {
      this.openAddClasses = true;
    }
  }
  addClassCancel() {
    this.openAddClasses = false;
  }
  addClassSubmit(form: NgForm) {
    const data = form.value;
    if (!this.classes.find((c) => c.name === data['nameClass'])) {
      const newKey = this.getKey(this.classes);
      const cl = new ClassModel(newKey, this.year.id, data['nameClass'], []);
      for (const key in data) {
        if (key !== 'nameClass' && data[key] === true) {
          cl.subjects.push( key );
        }
      }
      this.subs4 = this.servService.postClass(cl).subscribe((response) => {
        this.classes.push(response);
        const year = this.year;
        this.year = null;
        setTimeout(() => this.year = year, 100);
      });
      this.addClassCancel();
    } else {
      this.message = new MessageModel('Клас із такою назвою уже існує', 'danger');
      setTimeout(() => {
        this.message.message = '';
      }, 5000);
    }
  }
  /**Add Subject**/
  addSubjectOpen() {
    if (this.year) {
      this.openAddSubject = true;
    }
  }
  addSubjectCancel() {
    this.openAddSubject = false;
  }
  addSubjectSubmit(form: NgForm) {
    const data: {name} = form.value;
    if (!this.subjects.find(s => s.name.toLowerCase() === data['nameSubject'].trim().toLowerCase())) {
      const newKey = this.getKey(this.subjects);
      const newSubject = new SubjectModel(newKey, data['nameSubject']);
      this.subs6 = this.servService.postSubject(newSubject).subscribe((response) => {
        this.subjects.push(response);
      });
      this.addSubjectCancel();
    } else {
      this.message = new MessageModel('Такий предмет вже існує', 'danger');
      setTimeout(() => {
        this.message.message = '';
      }, 5000);
    }
  }
  /**EDIT-DElETE EVENT**/
  editedSubject(e: {isDel, subject: {key}}) {
    const sub = e.subject;
    if (e.isDel) {
      for (let i = 0; i < this.subjects.length; i++) {
        if (this.subjects[i].key === sub.key) {
          this.subjects.splice(i, 1);
          break;
        }
      }
    } else {
      for (let i = 0; i < this.subjects.length; i++) {
        if (this.subjects[i].key === sub.key) {
          this.subjects[i] = sub;
          break;
        }
      }
    }
  }
  editedClass(e: {isDel, class: ClassModel}) {
    if (e.isDel) {
      for (let i = 0; i < this.classes.length; i++) {
        if (this.classes[i].key === e.class.key) {
          this.classes.splice(i, 1);
          break;
        }
      }
    } else {
      for (let i = 0; i < this.classes.length; i++) {
        if (this.classes[i].key === e.class.key) {
          this.classes[i] = e.class;
          break;
        }
      }
    }
  }
  getKey(objects): string {
    let newKey = '';
    let needNewKey = true;
    while (needNewKey) {
      for (let i = 0; i < 5; i++) {
        const newLeter = Math.floor(Math.random() * 10);
        newKey = newKey + newLeter;
      }
      if (!objects.find(c => c.key === newKey )) {
        needNewKey = false;
      }
    }
    return newKey;
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
    if (this.subs6) {
      this.subs6.unsubscribe();
    }
  }
}
