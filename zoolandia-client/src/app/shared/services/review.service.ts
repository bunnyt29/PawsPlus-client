import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private reviewPath = environment.apiUrl + "/reviews"
  constructor(
    private http: HttpClient
  ) { }

  create(data:any): Observable<any> {
    return this.http.post<any>(this.reviewPath, data);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(this.reviewPath + '/' + id, {
      body: { id: id }
    });  }
}
