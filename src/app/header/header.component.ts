import {Component, OnInit} from '@angular/core';
import {AuthService} from '../shared/service/auth.service';
import {Router} from '@angular/router';
import {UserModel} from '../shared/models/user.model';

@Component({
  selector: 'pst-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit {
  user: UserModel;
  constructor(private auth: AuthService, private router: Router) { }
  ngOnInit() {
    this.user = this.auth.checkLog();
  }

  out() {
    this.auth.logOut();
    this.user = null;
    this.router.navigate(['/news']);
  }
}
