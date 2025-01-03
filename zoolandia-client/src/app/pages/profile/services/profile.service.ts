import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private userPath = environment.apiUrl + "/profiles"
  constructor(
    private http: HttpClient
  ) { }

  getProfile():Observable<any> {
    return this.http.get<any>(this.userPath);
  }
  editProfile(id:string, data:any){
    return this.http.put(this.userPath + '/' + id, data);
  }
}
