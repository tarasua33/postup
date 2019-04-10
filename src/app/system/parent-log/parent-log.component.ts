import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../shared/service/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'pst-parent-log',
  templateUrl: './parent-log.component.html',
  styleUrls: ['./parent-log.component.less']
})
export class ParentLogComponent implements OnInit {
  statusLog: string;

  constructor(
    private auth: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.statusLog = this.auth.checkStatusLog();
    if (this.statusLog !== 'parent') {
      this.router.navigate(['/news']);
    }
  }

}
