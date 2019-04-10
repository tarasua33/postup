import {Injectable} from '@angular/core';
import {BaseApi} from '../core/base-api/base-api';
import {Observable} from 'rxjs';
import {UserModel} from '../models/user.model';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class ServerService extends BaseApi {
  constructor(public http: HttpClient) {
    super(http);
  }
  addNewUser(newUser: UserModel): Observable<any> {
    return this.post('users', newUser);
  }
  logIn(email: string): Observable<any> {
    return this.get(`users?email=${email}`);
  }
}
