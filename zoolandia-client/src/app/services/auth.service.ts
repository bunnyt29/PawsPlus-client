import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private registerPath = environment.apiUrl + '/identity/register';
  private loginPath = environment.apiUrl + '/identity/login';
  constructor(
    private http: HttpClient
  ) { }

  register(data: any):Observable<any> {
    return this.http.post(this.registerPath ,data);
  }

  login(data: any):Observable<any> {
    return this.http.post(this.loginPath, data);
  }

  saveToken(token: any) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isAuthenticated() {
    return !!this.getToken();
  }
}
