import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CookieService} from 'ngx-cookie-service';

import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authPath = environment.apiUrl + '/identity';
  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) { }

  register(data: any):Observable<any> {
    return this.http.post(this.authPath + '/register', data);
  }

  login(data: any):Observable<any> {
    return this.http.post(this.authPath + '/login', data);
  }

  logout(): void {
    this.cookieService.delete('auth');
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

  confirmEmail(userId: string, token: string) {
    return this.http.put(this.authPath + '/confirmEmail', {'userId': userId, 'token': token});
  }
}
