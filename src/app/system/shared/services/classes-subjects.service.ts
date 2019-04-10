import {Injectable} from '@angular/core';
import {BaseApi} from '../../../shared/core/base-api/base-api';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class ClassesSubjectsService extends BaseApi {
  constructor(public http: HttpClient) {
    super(http);
  }
  getSubjects(): Observable<any> {
    return this.get('subjects');
  }
  getClasses(): Observable<any> {
    return this.get('classes');
  }
  putSubject(id, data): Observable<any> {
    return this.put(`subjects/${id}`, data);
  }
  putClass(id, data): Observable<any> {
    return this.put(`classes/${id}`, data);
  }
  postClass(data): Observable<any> {
    return this.post('classes', data);
  }
  postSubject(data): Observable<any> {
    return this.post('subjects', data);
  }
  deleteSubject(id): Observable<any> {
    return this.delete(`subjects/${id}`);
  }
  deleteClass(id): Observable<any> {
    return this.delete(`classes/${id}`);
  }
}
