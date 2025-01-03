import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CookieService} from 'ngx-cookie-service';

import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private registerPath = environment.apiUrl + '/identity/register';
  private loginPath = environment.apiUrl + '/identity/login';
  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) { }

  register(data: any):Observable<any> {
    return this.http.post(this.registerPath ,data);
  }

  login(data: any):Observable<any> {
    return this.http.post(this.loginPath, data);
  }

  saveToken(token: any) {
    this.cookieService.set('auth', token, { path: '/' });
  }

  getToken() {
    return this.cookieService.get('auth');
  }

  isAuthenticated() {
    return !!this.getToken();
  }
}
