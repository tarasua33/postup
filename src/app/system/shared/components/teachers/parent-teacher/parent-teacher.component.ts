import {Component, Input, OnDestroy} from '@angular/core';
import {UserModel} from '../../../../../shared/models/user.model';
import {UsersService} from '../../../services/users.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'pst-parent-teacher',
  templateUrl: './parent-teacher.component.html',
  styleUrls: ['./parent-teacher.component.less']
})
export class ParentTeacherComponent implements OnDestroy {
  subs1: Subscription;
  subs2: Subscription;
  @Input() teachers: Array<UserModel>;
  checkedTeacher: UserModel;
  openAddStatusParent = false;
  openDeleteUser = false;

  constructor(
    private userService: UsersService
  ) { }
  checkStatusParent(t: UserModel) {
    return t.type.indexOf('parent') === -1;
  }
  /**STATUS PARENT**/
  addParentStatusOpen(t: UserModel) {
    this.checkedTeacher = t;
    this.openAddStatusParent = true;
  }
  addParentStatusCancel() {
    this.openAddStatusParent = false;
    this.checkedTeacher = null;
  }
  addParentStatusSubmit() {
    console.log('submit');
    if (this.checkedTeacher.type.indexOf('parent') === -1) {
      this.checkedTeacher.type.push('parent');
      this.subs1 = this.userService.putUser(this.checkedTeacher.id, this.checkedTeacher)
        .subscribe((teacher) => {
          this.addParentStatusCancel();
        });
    }
  }
  /**DELETE USER**/
  deleteUserOpen(t: UserModel) {
    this.checkedTeacher = t;
    this.openDeleteUser = true;
  }
  deleteUserCancel() {
    this.openDeleteUser = false;
    this.checkedTeacher = null;
  }
  deleteUserSubmit() {
      this.subs2 = this.userService.deleteUser(this.checkedTeacher.id)
        .subscribe((teacher) => {
          this.deleteUserCancel();
        });
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
