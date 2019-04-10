import {Injectable} from '@angular/core';
import {BaseApi} from '../../../shared/core/base-api/base-api';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class UsersService extends BaseApi {
  constructor(public http: HttpClient) {
    super(http);
  }
  getUsers() {
    return this.get('users');
  }
  deleteUser(id) {
    return this.delete(`users/${id}`);
  }
  putUser(id, data) {
    return this.put(`users/${id}`, data);
  }
}
