import {UserModel} from '../models/user.model';


export class AuthService {
  typeUsers = {
    principal: 'Адміністрація',
    teacher: 'Вчитель предметник',
    parent: 'Батько/Мати',
    classTeach: 'Класний керівник'
  };
  storageAddress = 'userPostup';
  user: UserModel;
  status = 'teacher';
  logIn() {
    const loginUser: UserModel = JSON.parse( window.localStorage.getItem(this.storageAddress));
    if (loginUser) {
      this.user = loginUser;
    }
  }
  logOut() {
    this.user = null;
    window.localStorage.setItem('userPostup', null);
  }
  checkLog() {
    if (!this.user) {
      this.logIn();
      return this.user;
    } else {
      return this.user;
    }
  }
  checkStatusLog() {
    const u = this.checkLog();
    if (u) {
      return this.status;
    }
  }
  changeSatusLog(s) {
    this.status = s;
  }
  getTypes() {
    return this.typeUsers;
  }
}
