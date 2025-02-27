import { Injectable } from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private postPath = environment.apiUrl + "/posts"
  private userPath = environment.apiUrl + "/profiles"
  constructor(
    private http: HttpClient
  ) { }

  activate(profileId: string): Observable<any> {
    return this.http.patch(this.postPath + `/${profileId}/activate`, { profileId: profileId} );
  }
  create(data:any): Observable<any> {
    return this.http.post<any>(this.postPath, data);
  }

  get(id: string):Observable<any> {
    return this.http.get<any>(this.userPath + '/' + id + '/myPost');
  }

  getPending():Observable<any> {
    return this.http.get<any>(this.postPath + '/pending');
  }

  search(params: any): Observable<any> {
    let httpParams = new HttpParams();

    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined) {
        httpParams = httpParams.append(key, params[key]);
      }
    });

    return this.http.get<any>(this.postPath + '/search', { params: httpParams });
  }

  approve(id: string):Observable<any>{
    return this.http.patch(this.postPath + '/' + id + '/approve', id)
  }

  disapprove(id: string, data: any):Observable<any>{
    return this.http.patch(this.postPath + '/' + id + '/disapprove', data)
  }
}
