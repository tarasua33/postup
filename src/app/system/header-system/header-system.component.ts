import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../shared/service/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {UserModel} from '../../shared/models/user.model';

@Component({
  selector: 'pst-header-system',
  templateUrl: './header-system.component.html',
  styleUrls: ['./header-system.component.less']
})
export class HeaderSystemComponent implements OnInit {
  user: UserModel;
  userTypes;
  openListTypes = false;
  statusInput = 'teacher';
  constructor(private auth: AuthService, private router: Router, private activateRoute: ActivatedRoute) {}

  ngOnInit() {
    const user = this.auth.checkLog();
    if (user) {
      this.user = user;
      this.userTypes = this.auth.getTypes();
      this.statusInput = this.auth.checkStatusLog();
    } else {
      this.router.navigate(['/news']);
    }
    this.activateRoute.queryParams.subscribe((data) => {
      if (data['status']) {
        if (data['status'] !== this.statusInput) {
          this.statusInput = data['status'];
          this.auth.changeSatusLog(data['status']);
        }
      }
    });
  }
  toggleListTypes() {
    this.openListTypes = !this.openListTypes;
  }
}
