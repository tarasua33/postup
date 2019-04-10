import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ClassModel} from '../../../../../shared/models/class.model';
import {UserModel} from '../../../../../shared/models/user.model';
import {NgForm} from '@angular/forms';
import {Subscription} from 'rxjs';
import {UsersService} from '../../../services/users.service';
import {MessageModel} from '../../../../../shared/models/message.model';

@Component({
  selector: 'pst-list-teacher-card',
  templateUrl: './list-teacher-card.component.html',
  styleUrls: ['./list-teacher-card.component.less']
})
export class ListTeacherCardComponent implements OnDestroy {
  sub1: Subscription;
  sub2: Subscription;
  @Input() subjects = [];
  @Input() classes: Array<ClassModel>;
  @Input() teachers: Array<UserModel>;
  openCardAddSubject = false;
  checkedTeacher: UserModel;
  message: MessageModel;

  constructor(private userService: UsersService) {
    this.message = new MessageModel('');
  }

  getShortName(name: string) {
    const names = name.split(' ');
    let shortName = names[0] + ' ';
    for (let i = 1; i < names.length; i++) {
      shortName = shortName + names[i].charAt(0) +  '.';
    }
    return shortName;
  }
  getClassName(sub: {class: number}) {
    const classSub = this.classes.find(c => c.id === sub.class);
    if (classSub) {
      return classSub.name;
    } else {
      return false;
    }
  }
  getSubjectName(sub: {subject: number}) {
    const subjectName = this.subjects.find(s => s.id === sub.subject);
    if (subjectName) {
      return subjectName.name;
    }
  }
  /**ADD SUBJECT**/
  addSubjectOpen(id) {
    this.checkedTeacher = this.teachers.find(t => t.id === id);
    if (this.checkedTeacher) {
      this.openCardAddSubject = true;
    }
  }
  addSubjectCancel() {
    this.openCardAddSubject = false;
    this.checkedTeacher = null;
  }
  addSubjectSubmit(form: NgForm) {
    const f = {
      class: null,
      subject: null
    };
    f.class = +form.value.class;
    f.subject = +form.value.subject;
    const thisSubject = this.checkedTeacher.subjects.find(s => s.class === f.class && s.subject === f.subject);
    if (!thisSubject) {
      this.checkedTeacher.subjects.push(f);
      this.sub1 = this.userService.putUser(this.checkedTeacher.id, this.checkedTeacher).subscribe((res) => {
        this.message = new MessageModel('Додано предмет викладання', 'success');
        setTimeout(() => {
          this.message.message = '';
        }, 5000);
      });
    } else {
      this.message = new MessageModel('Вчитель вже викладає даний предмет в даному класі', 'danger');
      setTimeout(() => {
        this.message.message = '';
      }, 5000);
    }
  }
  deleteSubject(sub: {class, subject}) {
    const newListSubject = [];
    for (let i = 0; i < this.checkedTeacher.subjects.length; i++) {
      if (this.checkedTeacher.subjects[i].class !== sub.class || this.checkedTeacher.subjects[i].subject !== sub.subject) {
        newListSubject.push(this.checkedTeacher.subjects[i]);
      }
    }
    this.checkedTeacher.subjects = newListSubject;
    this.sub2 = this.userService.putUser(this.checkedTeacher.id, this.checkedTeacher).subscribe((res) => {
      this.message = new MessageModel('ВИДАЛЕНО предмет викладання', 'success');
      setTimeout(() => {
        this.message.message = '';
      }, 5000);
    });
  }

  ngOnDestroy() {
    if (this.sub1) {
      this.sub1.unsubscribe();
    }
    if (this.sub2) {
      this.sub2.unsubscribe();
    }
  }
}
