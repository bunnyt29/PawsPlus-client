import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {Observable} from "rxjs";
import {Profile} from "../../../shared/models/Profile";

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
