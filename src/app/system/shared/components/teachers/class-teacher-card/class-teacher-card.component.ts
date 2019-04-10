import {Component, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import {UserModel} from '../../../../../shared/models/user.model';
import {ClassModel} from '../../../../../shared/models/class.model';
import {NgForm} from '@angular/forms';
import {Subscription} from 'rxjs';
import {UsersService} from '../../../services/users.service';

@Component({
  selector: 'pst-class-teacher-card',
  templateUrl: './class-teacher-card.component.html',
  styleUrls: ['./class-teacher-card.component.less']
})
export class ClassTeacherCardComponent implements OnDestroy {
  subs1: Subscription;
  @Input() teachers: Array<UserModel>;
  @Input() classes: Array<ClassModel>;
  @Output() teacherEdit = new EventEmitter();
  openCardAddClasses = false;
  checkedTeacher: UserModel;

  constructor(
    private usersService: UsersService
  ) { }

  getStatusClass(id) {
    return this.checkedTeacher.classes.indexOf(+id) !== -1;
  }
  addClassesOpen(id) {
    this.checkedTeacher = this.teachers.find(t => t.id === id);
    this.openCardAddClasses = true;
  }
  addClassesCancel() {
    this.openCardAddClasses = false;
    this.checkedTeacher = null;
  }
  addClassesSubmit(form: NgForm) {
    const newClasses = [];
    for (const key in form.value) {
      if (form.value[key]) {
        newClasses.push(+key);
      }
    }
    this.checkedTeacher.classes = newClasses;
    this.subs1 = this.usersService.putUser(this.checkedTeacher.id, this.checkedTeacher).subscribe((res) => {
      this.teacherEdit.emit({
        edited: true,
        t: res
      });
    });
    this.addClassesCancel();
  }
  /**GET CLASS NAME**/
  getClassName(t: UserModel) {
    let name = '';
    for (const id of t.classes) {
      const cl = this.classes.find(c => c.id === id);
      if (cl) {
        name = name + cl.name + ' / ';
      }
    }
    if (name === '') {
      return 'немає';
    } else {
      return name;
    }
  }

  ngOnDestroy() {
    if (this.subs1) {
      this.subs1.unsubscribe();
    }
  }
}
