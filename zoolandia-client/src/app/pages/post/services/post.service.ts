import { Injectable } from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private postPath = environment.apiUrl + "/posts"
  constructor(
    private http: HttpClient
  ) { }

  create(data:any): Observable<any> {
    return this.http.post<any>(this.postPath, data);
  }
}
