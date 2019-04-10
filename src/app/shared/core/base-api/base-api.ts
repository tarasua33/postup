import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';

@Injectable()
export class BaseApi {
  baseUrl = 'http://localhost:3000/';

  constructor(public http: HttpClient) {}
  getUrl(url: string): string {
    return this.baseUrl + url;
  }

  get(url): Observable<any> {
    return this.http.get(this.getUrl(url))
      .pipe(
        map(response => response)
      )
      .pipe(
        catchError(error => throwError(error.message))
      );
  }
  post(url, data): Observable<any> {
    return this.http.post(this.getUrl(url), data)
      .pipe(
        map(response => response)
      )
      .pipe(
        catchError(error => throwError(error.message))
      );
  }
  put(url, data): Observable<any> {
    return this.http.put(this.getUrl(url), data)
      .pipe(
        map(response => response)
      )
      .pipe(
        catchError(error => throwError(error.message))
      );
  }
  delete(url): Observable<any> {
    return this.http.delete(this.getUrl(url))
      .pipe(
        map(response => response)
      )
      .pipe(
        catchError(error => throwError(error.message))
      );
  }
}
