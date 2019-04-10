import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {UserModel} from '../../../../../shared/models/user.model';
import {UsersService} from '../../../services/users.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'pst-notconfirmed-parent',
  templateUrl: './notconfirmed-parent.component.html',
  styleUrls: ['./notconfirmed-parent.component.less']
})
export class NotconfirmedParentComponent implements OnInit, OnDestroy {
  subs1: Subscription;
  subs2: Subscription;
  @Input() notconfirmedParent: Array<UserModel>;
  @Input() parent: Array<UserModel>;

  constructor(
    private userService: UsersService
  ) { }

  ngOnInit() {
  }
  acceptParent(par: UserModel) {
    par.confirm = true;
    this.subs1 = this.userService.putUser(par.id, par).subscribe( (p: UserModel) => {
      for (let i = 0; i < this.notconfirmedParent.length; i++) {
        if (this.notconfirmedParent[i].id === p.id) {
          this.notconfirmedParent.splice(i, 1);
          break;
        }
      }
      this.parent.push(p);
    });
  }
  deleteParent(par) {
    this.subs2 = this.userService.deleteUser(par.id).subscribe((p) => {
      for (let i = 0; i < this.notconfirmedParent.length; i++) {
        if (this.notconfirmedParent[i].id === par.id) {
          this.notconfirmedParent.splice(i, 1);
          break;
        }
      }
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
