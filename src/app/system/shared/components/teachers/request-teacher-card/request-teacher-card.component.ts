import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {UserModel} from '../../../../../shared/models/user.model';
import {UsersService} from '../../../services/users.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'pst-request-teacher-card',
  templateUrl: './request-teacher-card.component.html',
  styleUrls: ['./request-teacher-card.component.less']
})
export class RequestTeacherCardComponent implements OnDestroy {
  @Input() unconfirmedTeachers: Array<UserModel>;
  @Output() confirm = new EventEmitter();
  subs1: Subscription;
  subs2: Subscription;
  openDeleteTeacher = false;
  openConfirmTeacher = false;
  checkedTeacher: UserModel;

  constructor(
    private usersService: UsersService
  ) { }
  confirmTeacherOpen(id) {
    this.checkedTeacher = this.unconfirmedTeachers.find( t => t.id === id);
    if (this.checkedTeacher) {
      this.openConfirmTeacher = true;
    }
  }
  confirmTeacherCancel() {
    this.openConfirmTeacher = false;
    this.checkedTeacher = null;
  }
  confirmTeacherSubmit() {
    this.checkedTeacher.confirm = true;
    this.subs2 = this.usersService.putUser(this.checkedTeacher.id, this.checkedTeacher).subscribe((response) => {
      this.confirm.emit({
        isConfirm: true,
        t: response
      });
    });
    this.confirmTeacherCancel();
  }
  /**DELETE**/
  confirmDeleteTeacherOpen(id) {
    this.checkedTeacher = this.unconfirmedTeachers.find(t => t.id === id);
    if (this.checkedTeacher) {
      this.openDeleteTeacher = true;
    }
  }
  deleteTeacherSubmit() {
    const t = this.checkedTeacher;
    this.subs1 = this.usersService.deleteUser(this.checkedTeacher.id).subscribe((response) => {
      this.confirm.emit({
        isConfirm: false,
        t
      });
    });
    this.deleteTeacherCancel();
  }
  deleteTeacherCancel() {
    this.openDeleteTeacher = false;
    this.checkedTeacher = null;
  }

  ngOnDestroy() {
    if (this.subs1) {
      this.subs1.unsubscribe();
    }
    if (this.subs2) {
      this.subs2.unsubscribe();
    }
  }
}
