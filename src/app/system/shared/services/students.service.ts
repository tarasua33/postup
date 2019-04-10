import {Injectable} from '@angular/core';
import {BaseApi} from '../../../shared/core/base-api/base-api';
import {HttpClient} from '@angular/common/http';
import {error} from '@angular/compiler/src/util';
import {throwError} from 'rxjs';

@Injectable()
export class StudentsService extends BaseApi {
  constructor(public http: HttpClient) {
    super(http);
  }
  getStudentsAll() {
    return this.get('students');
  }
  getStudent(id) {
    return this.get(`students/${id}`);
  }
  deleteStudent(id) {
    return this.delete(`students/${id}`);
  }
  putStudent(id, data) {
    return this.put(`students/${id}`, data);
  }
  postStudent(data) {
    return this.post(`students`, data);
  }
}
