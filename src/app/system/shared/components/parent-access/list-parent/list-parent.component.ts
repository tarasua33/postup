import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {UserModel} from '../../../../../shared/models/user.model';
import {StudentModel} from '../../../../../shared/models/student.model';
import {NgForm} from '@angular/forms';
import {UsersService} from '../../../services/users.service';
import {StudentsService} from '../../../services/students.service';
import {MessageModel} from '../../../../../shared/models/message.model';

@Component({
  selector: 'pst-list-parent',
  templateUrl: './list-parent.component.html',
  styleUrls: ['./list-parent.component.less']
})
export class ListParentComponent implements OnDestroy, OnInit {
  subs1: Subscription;
  subs2: Subscription;
  subs3: Subscription;
  subs4: Subscription;
  @Input() students: Array<StudentModel>;
  @Input() allStudents: Array<StudentModel>;
  @Input() parent: Array<UserModel>;
  openAddRight = false;
  openDeleteRight = false;
  checkedParent: UserModel;
  message: MessageModel;
  formReady = true;
  children: Array<StudentModel> = [];
  openDeleteParent = false;
  activePage: Array<UserModel> = [];
  numberPage = 0;
  countItemInPage = 3;
  countPages = 0;
  isLoad = false;

  constructor(
    private userService: UsersService,
    private studentService: StudentsService
  ) {
    this.message = new MessageModel('');
  }
  ngOnInit() {
    // this.createPagination();
  }
  /**PAGINATION**/
  createPagination() {
    this.parent = this.parent.sort((p1, p2) => {
      const name1 = p1.name.toLocaleLowerCase(),
        name2 = p2.name.toLocaleLowerCase();
      if (name1 > name2) {
        return 1;
      }
      if (name1 < name2) {
        return -1;
      }
      return 0;
    });
    this.restartActivePage();
  }
  restartActivePage() {
    this.isLoad = false;
    this.activePage = [];
    this.countPages = Math.ceil(this.parent.length / this.countItemInPage);
    for (let i = 0; i < this.countItemInPage; i++) {
      if (this.parent[this.countItemInPage * this.numberPage + i]) {
        this.activePage.push(this.parent[this.countItemInPage * this.numberPage + i]);
      } else {
        break;
      }
    }
    this.isLoad = true;
  }
  previous() {
    if (this.numberPage > 0) {
      this.numberPage = this.numberPage - 1;
      this.restartActivePage();
    }
  }
  next() {
    if (this.numberPage < this.countPages) {
      this.numberPage = this.numberPage + 1;
      this.restartActivePage();
    }
  }
  /**\PAGINATION**/

  /**CHILDREN**/
  getChildren() {
    this.children = this.allStudents.filter(s => this.checkedParent.access.indexOf(s.id) !== -1);
    this.formReady = true;
  }
  checkParentForChild(st: StudentModel) {
    if (this.checkedParent && this.checkedParent.access.indexOf(st.id) !== -1) {
      return true;
    } else {
      return false;
    }
  }

  /**ADD RIGHT**/
  addRightOpen(p: UserModel) {
    this.checkedParent = p;
    this.openAddRight = true;
  }
  addRightCancel() {
    this.openAddRight = false;
    this.checkedParent = null;
  }
  submitAddRight(form: NgForm) {
    const idStudent = + form.value['student'];
    if (idStudent && this.checkedParent) {
      if (this.checkedParent.access.indexOf(idStudent) === -1) {
        this.checkedParent.access.push(idStudent);
        this.formReady = false;
        if (this.subs1) {
          this.subs1.unsubscribe();
        }
        this.subs1 = this.userService.putUser(this.checkedParent.id, this.checkedParent)
          .subscribe((p: UserModel) => {
            this.formReady = true;
            this.message = new MessageModel('Доступ надано успішно', 'success');
            setTimeout(() => {
              this.message.message = '';
            }, 5000);
          });
      } else {
        this.message = new MessageModel('Доступ до інформації даного учня вже надано цьому користувачу');
        setTimeout(() => {
          this.message.message = '';
        }, 5000);
      }
    }
  }
  /**DELETE RIGHT**/
  deleteRightOpen(p: UserModel) {
    this.openDeleteRight = true;
    this.checkedParent = p;
    this.formReady = false;
    this.children = [];
    if (this.children.length < this.checkedParent.access.length) {
      setTimeout(() => {
        this.getChildren();
      }, 100);
    } else {
      this.formReady = true;
      this.message = new MessageModel('Немає учнів до інформації яких наданий доступ');
      setTimeout(() => {
        this.message.message = '';
      }, 5000);
    }
  }
  deleteRightCancel() {
    this.openDeleteRight = false;
    this.checkedParent = null;
    this.children = [];
    this.formReady = true;
  }
  submitDeleteRight(form: NgForm) {
    const idStudent = + form.value['student'];
    if (idStudent && this.checkedParent) {
        const index = this.checkedParent.access.indexOf(idStudent);
        if (index !== -1) {
          this.formReady = false;
          this.checkedParent.access.splice(index, 1);
          if (this.subs1) {
            this.subs1.unsubscribe();
          }
          this.subs1 = this.userService.putUser(this.checkedParent.id, this.checkedParent)
            .subscribe((p: UserModel) => {
              for (let i = 0; i < this.children.length; i++) {
                if (this.children[i].id === idStudent) {
                  this.children.splice(i, 1);
                  break;
                }
              }
              this.formReady = true;
              this.message = new MessageModel('Доступ до інформації закритий', 'success');
              setTimeout(() => {
                this.message.message = '';
              }, 5000);
            });
        }
    } else {
      this.message = new MessageModel('Немає учнів до інформації яких наданий доступ');
      setTimeout(() => {
        this.message.message = '';
      }, 5000);
    }
  }
  /**DELETE USER**/
  deleteUserOpen(p: UserModel) {
    this.checkedParent = p;
    this.openDeleteParent = true;
  }
  deleteParentCancel() {
    this.formReady = true;
    this.checkedParent = null;
    this.openDeleteParent = false;
    this.children = [];
  }
  deleteParentSubmit() {
    this.formReady = false;
    const indx = this.checkedParent.type.indexOf('parent');
    if (indx !== -1) {
      this.checkedParent.type.splice(indx, 1);
      this.checkedParent.access = [];
      if (this.checkedParent.type.length === 0) {
        this.subs4 = this.userService.deleteUser(this.checkedParent.id).subscribe((p) => {
          for (let i = 0; i < this.parent.length; i++) {
            if (this.parent[i].id === this.checkedParent.id) {
              this.parent.splice(i, 1);
              break;
            }
          }
          this.deleteParentCancel();
        });
      } else {
        if (this.subs1) {
          this.subs1.unsubscribe();
        }
        this.subs1 = this.userService.putUser(this.checkedParent.id, this.checkedParent)
          .subscribe((p: UserModel) => {
            for (let i = 0; i < this.parent.length; i++) {
              if (this.parent[i].id === p.id) {
                this.parent.splice(i, 1);
                break;
              }
            }
            this.deleteParentCancel();
          });
      }
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
  }
}
