import {Injectable} from '@angular/core';
import {BaseApi} from '../../../shared/core/base-api/base-api';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class YearsService extends BaseApi {
  constructor(public http: HttpClient) {
    super(http);
  }
  getYears() {
    return this.get('years');
  }
  putYear(year, id) {
    return this.put(`years/${id}`, year);
  }
  postYear(year) {
    return this.post('years', year);
  }
  deleteYear(id) {
    return this.delete(`years/${id}`);
  }
}
