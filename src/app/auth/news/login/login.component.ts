import {Component, HostBinding, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ServerService} from '../../../shared/service/server.service';
import {UserModel} from '../../../shared/models/user.model';
import {MessageModel} from '../../../shared/models/message.model';
import {Subscription} from 'rxjs';
import {AuthService} from '../../../shared/service/auth.service';
import {Router} from '@angular/router';
import {triggerFadeAnimare} from '../../../shared/animations/fade';

@Component({
  selector: 'pst-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
  animations: [triggerFadeAnimare]
})
export class LoginComponent implements OnInit, OnDestroy {
  form: FormGroup;
  message: MessageModel;
  subs1: Subscription;
  storageAddress = 'userPostup';
  user: UserModel;
  formReady = true;
  constructor(private log: ServerService, private auth: AuthService, private router: Router) {
    this.message = new MessageModel('', 'danger');
  }
  @HostBinding('@fade') a = true;

  ngOnInit() {
    this.form = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, [Validators.required, Validators.minLength(6)]),
      'type': new FormControl(null, [Validators.required])
    });
  }

  onSubmit(form: FormGroup) {
    this.formReady = false;
    this.subs1 = this.log.logIn(form.value.email)
      .subscribe((response: [UserModel]) => {
        this.formReady = true;
        const type = this.form.value.type;
        if (!response[0]) {
          this.message = new MessageModel('Неіснуючий логін', 'danger');
          setTimeout(() => {
            this.message.message = '';
          }, 5000);
        } else {
          if (response[0].password === form.value.password
            && response[0].type.some((el) => el === type )
            && response[0].confirm === true) {
            window.localStorage.setItem(this.storageAddress, JSON.stringify(response[0])) ;
            this.auth.logIn();
            this.auth.changeSatusLog(type);
            this.message = new MessageModel('Вітаємо! Ви увійшли в систему', 'success');
            this.form.reset();
            setTimeout(() => {
              this.message.message = '';
              if (type === 'teacher') {
                this.router.navigate(['/system/' + 'teacher']);
              } else if (type === 'parent') {
                this.router.navigate(['/system/' + 'parent']);
              }
            }, 2000);
          } else {
            this.message = new MessageModel('Непральний пароль або тип реєстрації', 'danger');
            setTimeout(() => {
              this.message.message = '';
            }, 5000);
          }
        }
      }
    );
  }
  ngOnDestroy() {
    if (this.subs1) {
      this.subs1.unsubscribe();
    }
  }
}
