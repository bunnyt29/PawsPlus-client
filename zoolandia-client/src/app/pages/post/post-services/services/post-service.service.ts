import { Injectable } from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostServiceService {
  private servicePath = environment.apiUrl + "/services"
  constructor(
    private http: HttpClient
  ) { }

  create(data:any): Observable<any> {
    return this.http.post<any>(this.servicePath, data);
  }
  get(id: string | null):Observable<any> {
    return this.http.get<any>(this.servicePath + "/" + id );
  }
  edit(id:string, data:any) {
    return this.http.put(this.servicePath + '/' + id, data);
  }
  delete(id: string): Observable<any> {
    return this.http.delete(this.servicePath + '/' + id);
  }
}
