import {Component,  OnInit} from '@angular/core';
import {AuthService} from '../../shared/service/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'pst-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.less']
})
export class PrincipalComponent implements OnInit {
  statusLog: string;
  constructor(
    private auth: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.statusLog = this.auth.checkStatusLog();
    if (this.statusLog !== 'principal') {
      this.router.navigate(['/news']);
    }
  }

}
