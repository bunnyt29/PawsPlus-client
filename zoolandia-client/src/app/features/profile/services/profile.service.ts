import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

import {environment} from '../../../../environments/environment';
import {Profile} from '../../../shared/models/Profile';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private userPath = environment.apiUrl + "/profiles"
  constructor(
    private http: HttpClient
  ) { }

  getProfile():Observable<Profile> {
    return this.http.get<Profile>(this.userPath);
  }
}
