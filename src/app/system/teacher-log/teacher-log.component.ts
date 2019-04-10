import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../shared/service/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'pst-teacher-log',
  templateUrl: './teacher-log.component.html',
  styleUrls: ['./teacher-log.component.less']
})
export class TeacherLogComponent implements OnInit {
  statusLog: string;

  constructor(
    private auth: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.statusLog = this.auth.checkStatusLog();
    if (this.statusLog !== 'teacher') {
      this.router.navigate(['/news']);
    }
  }

}
