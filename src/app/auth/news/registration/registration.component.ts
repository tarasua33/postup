import {Component, HostBinding, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {ServerService} from '../../../shared/service/server.service';
import {UserModel} from '../../../shared/models/user.model';
import {Subscription} from 'rxjs';
import {MessageModel} from '../../../shared/models/message.model';
import {triggerFadeAnimare} from '../../../shared/animations/fade';

@Component({
  selector: 'pst-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.less'],
  animations: [triggerFadeAnimare]
})
export class RegistrationComponent implements OnInit, OnDestroy {
  listClasses = [1];
  form: FormGroup;
  subs1: Subscription;
  subs2: Subscription;
  message: MessageModel;
  formReady = true;
  constructor(private reg: ServerService) {
    this.message = new MessageModel('', 'danger');
  }
  @HostBinding('@fade') a = true;

  ngOnInit() {
    this.form = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email], [this.checkEmail.bind(this)]),
      'password': new FormControl(null, [Validators.required, Validators.minLength(6)]),
      'name': new FormControl(null, [Validators.required, Validators.minLength(6)]),
      'type': new FormControl(null, [Validators.required]),
      'right': new  FormControl(null, [Validators.required, Validators.requiredTrue]),
      'phone': new  FormControl(null, [Validators.required]),
      'classes': new FormArray([
          new FormControl(null)
        ])
    });
  }
  onSubmit(form: FormGroup) {
    this.formReady = false;
    const newUser = new UserModel(
      form.value.email,
      form.value.password,
      form.value.name,
      [form.value.type],
      [form.value.phone],
      []
    );
    this.subs1 = this.reg.addNewUser(newUser)
      .subscribe((response) => {
        this.formReady = true;
        const mess = 'Вітаємо! Ви зареєструвались у системі Поступ. Зверніться до дирекції для підтвердження';
        this.message = new MessageModel(mess, 'success');
        setTimeout(() => {
          this.message.message = '';
        }, 5000);
      });
    this.form.reset();
  }
  addClass() {
    if (this.listClasses.length < 5 ) {
      this.listClasses.push(this.listClasses.length + 1);
      (<FormArray>this.form.controls['classes']).push(new FormControl(null));
    }
  }
  ngOnDestroy() {
    if (this.subs1) {
      this.subs1.unsubscribe();
    }
    if (this.subs2) {
      this.subs2.unsubscribe();
    }
  }
  checkEmail(email): Promise<any> {
    return new Promise((resolve, reject) => {
      this.subs2 = this.reg.logIn(email.value)
        .subscribe((response) => {
          const user = response;
          if (user[0]) {
            resolve({'emailIsUsed': true});
          } else {
            resolve(null);
          }
        });
    });
  }
}
