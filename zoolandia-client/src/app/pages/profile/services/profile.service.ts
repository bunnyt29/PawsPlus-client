import {Injectable} from '@angular/core';
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

  getMine():Observable<any> {
    return this.http.get<any>(this.userPath + '/mine');
  }

  get(profileId: string): Observable<any> {
    return this.http.get<any>(this.userPath + '/' + profileId);
  }

  edit(id:string, data:any) {
    return this.http.put(this.userPath + '/' + id, data);
  }
}
